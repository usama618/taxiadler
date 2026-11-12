<?php
declare(strict_types=1);
namespace Waldbyte\Adler\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use TYPO3\CMS\Core\Core\Environment;
use TYPO3\CMS\Core\DataHandling\DataHandler;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Resource\ResourceFactory;
use TYPO3\CMS\Core\Utility\GeneralUtility;

final class ImportCommand extends Command
{
    public function __construct(private readonly \TYPO3\CMS\Form\Mvc\Persistence\FormPersistenceManagerInterface $forms, private readonly \TYPO3\CMS\Form\Domain\Repository\FormDefinitionRepository $formRepository)
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption('repair-initial-order', null, InputOption::VALUE_NONE, 'One-time correction of imported section order; leaves all text and images untouched');
        $this->addOption('install-form', null, InputOption::VALUE_NONE, 'Install the editable database form and migrate only legacy seeded form references');
        $this->addOption('optional-destination', null, InputOption::VALUE_NONE, 'Make the destination optional in the existing shared form without changing other editor settings');
        $this->addOption('add-passengers', null, InputOption::VALUE_NONE, 'Add the optional passenger selector to the existing shared form without replacing editor settings');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        \TYPO3\CMS\Core\Core\Bootstrap::initializeBackendAuthentication();
        $pool = GeneralUtility::makeInstance(ConnectionPool::class);
        $connection = $pool->getConnectionForTable('tt_content');
        $formId = $this->formRepository->findUidByFormIdentifier('taxi-inquiry');
        if ($formId === null) {
            $definition = \Symfony\Component\Yaml\Yaml::parseFile(Environment::getProjectPath() . '/seed/TaxiInquiry.form.yaml');
            $formId = (int)$this->forms->save('NEWadlerform', $definition, [], '0')->identifier;
        }
        if ($input->getOption('add-passengers')) {
            $definition = $this->forms->load((string)$formId);
            $seedForm = \Symfony\Component\Yaml\Yaml::parseFile(Environment::getProjectPath() . '/seed/TaxiInquiry.form.yaml');
            $passengerFields = array_values(array_filter($seedForm['renderables'][0]['renderables'], static fn(array $field): bool => $field['identifier'] === 'passengers'));
            if (count($passengerFields) !== 1) {
                throw new \RuntimeException('Expected one passenger field in the seed form.');
            }
            $fields = &$definition['renderables'][0]['renderables'];
            if (in_array('passengers', array_column($fields, 'identifier'), true)) {
                $output->writeln('Passenger field already exists; editor settings retained.');
                return Command::SUCCESS;
            }
            $position = array_search('notes', array_column($fields, 'identifier'), true);
            array_splice($fields, $position === false ? count($fields) : $position, 0, $passengerFields);
            $this->forms->save((string)$formId, $definition, []);
            $output->writeln('Optional passenger field added. Existing fields and finishers retained.');
            return Command::SUCCESS;
        }
        if ($input->getOption('optional-destination')) {
            $definition = $this->forms->load((string)$formId);
            $changed = 0;
            $update = static function (array &$element) use (&$update, &$changed): void {
                if (($element['identifier'] ?? '') === 'destination') {
                    unset($element['properties']['fluidAdditionalAttributes']['required']);
                    $element['validators'] = array_values(array_filter($element['validators'] ?? [], static fn(array $validator): bool => ($validator['identifier'] ?? '') !== 'NotEmpty'));
                    $changed++;
                }
                foreach ($element['renderables'] ?? [] as $index => $child) {
                    $update($element['renderables'][$index]);
                }
            };
            $update($definition);
            if ($changed > 0) { $this->forms->save((string)$formId, $definition, []); }
            $output->writeln('Destination made optional in ' . $changed . ' form field(s). Other form settings retained.');
            return Command::SUCCESS;
        }
        if ($input->getOption('install-form')) {
            $rows = $connection->fetchAllAssociative("SELECT uid FROM tt_content WHERE CType='adler_form' AND adler_form='1:/forms/TaxiInquiry.form.yaml'");
            foreach ($rows as $row) {
                $handler = GeneralUtility::makeInstance(DataHandler::class);
                $handler->start(['tt_content' => [$row['uid'] => ['adler_form' => (string)$formId]]], []); $handler->process_datamap();
                if ($handler->errorLog) { throw new \RuntimeException(implode("\n",$handler->errorLog)); }
            }
            $output->writeln('Editable TYPO3 database form ready; migrated ' . count($rows) . ' seed references.');
            return Command::SUCCESS;
        }
        $seed = json_decode(file_get_contents(Environment::getProjectPath() . '/seed/content.json'), true, flags: JSON_THROW_ON_ERROR);
        if ($input->getOption('repair-initial-order')) {
            $this->restoreInitialOrder($pool, $seed);
            $output->writeln('Initial section order restored. Text and images were not modified.');
            return Command::SUCCESS;
        }
        if ((int)$connection->fetchOne("SELECT COUNT(*) FROM tt_content WHERE CType LIKE 'adler_%'") > 0) {
            $output->writeln('Existing Adler content found. Import skipped to preserve editor changes.');
            return Command::SUCCESS;
        }
        $pages = []; $map = []; $root = 1;
        foreach ($seed['pages'] as $index => $page) {
            $id = $page['path'] === '/' ? $root : 'NEWpage' . $index;
            $map[$page['path']] = $id;
            $pages['pages'][$id] = ['pid' => $page['parent'] ?? 1, 'title' => $page['title'], 'slug' => $page['path'], 'hidden' => 0, 'nav_hide' => $page['nav_hide'] ?? 0, 'description' => $page['description'] ?? '', 'backend_layout' => 'pagets__adler', 'backend_layout_next_level' => 'pagets__adler'];
        }
        $handler = GeneralUtility::makeInstance(DataHandler::class);
        $handler->start($pages, []); $handler->process_datamap();
        if ($handler->errorLog) { throw new \RuntimeException(implode("\n", $handler->errorLog)); }
        foreach ($map as &$id) { $id = is_int($id) ? $id : (int)$handler->substNEWwithIDs[$id]; } unset($id);
        $link = static function (string $value) use ($map): string {
            if (!str_starts_with($value, '/') || str_starts_with($value, '//')) { return $value; }
            $parts = parse_url($value); $path = $parts['path'] ?? '/';
            if (!isset($map[$path])) { return $value; }
            return 't3://page?uid=' . $map[$path] . (isset($parts['fragment']) ? '#' . $parts['fragment'] : '');
        };
        $data = []; $serial = 0;
        $fileReference = static function (string $table, string $field, string $foreign, string $filename, int $pid) use (&$data, &$serial): string {
            $file = GeneralUtility::makeInstance(ResourceFactory::class)->getFileObjectFromCombinedIdentifier('1:/adler/' . $filename);
            $key = 'NEWfile' . ++$serial;
            $data['sys_file_reference'][$key] = ['pid' => $pid, 'uid_local' => $file->getUid(), 'uid_foreign' => $foreign, 'tablenames' => $table, 'fieldname' => $field, 'table_local' => 'sys_file', 'sorting_foreign' => 1];
            return $key;
        };
        foreach ($seed['pages'] as $page) {
            $pid = $map[$page['path']];
            foreach ($page['elements'] as $sort => $element) {
                $key = 'NEWcontent' . ++$serial;
                $row = ['pid' => $pid, 'CType' => 'adler_' . $element['type'], 'colPos' => $element['colPos'] ?? 0, 'sorting' => ($sort + 1) * 256, 'hidden' => 0];
                foreach ($element['fields'] ?? [] as $field => $value) {
                    $row[$field] = str_ends_with($field, '_link') || $field === 'adler_whatsapp' ? $link((string)$value) : $value;
                }
                if ($element['type'] === 'form') { $row['adler_form'] = (string)$formId; }
                if (!empty($element['image'])) { $row['assets'] = $fileReference('tt_content', 'assets', $key, $element['image'], $pid); }
                $children = [];
                foreach ($element['items'] ?? [] as $itemSort => $item) {
                    $itemKey = 'NEWitem' . ++$serial;
                    $image = $item['image'] ?? ''; unset($item['image']);
                    foreach (['link','credit_link'] as $field) { if (isset($item[$field])) { $item[$field] = $link($item[$field]); } }
                    $data['tx_adler_item'][$itemKey] = $item + ['pid' => $pid, 'parent' => $key, 'sorting' => ($itemSort + 1) * 256, 'hidden' => 0];
                    if ($image) { $data['tx_adler_item'][$itemKey]['image'] = $fileReference('tx_adler_item', 'image', $itemKey, $image, $pid); }
                    $children[] = $itemKey;
                }
                $row['adler_items'] = implode(',', $children);
                $data['tt_content'][$key] = $row;
            }
        }
        $handler = GeneralUtility::makeInstance(DataHandler::class);
        $handler->start($data, []); $handler->process_datamap();
        if ($handler->errorLog) { throw new \RuntimeException(implode("\n", $handler->errorLog)); }
        $this->restoreInitialOrder($pool, $seed);
        $output->writeln('Imported ' . count($map) . ' pages and ' . count($data['tt_content']) . ' editable elements.');
        return Command::SUCCESS;
    }

    private function restoreInitialOrder(ConnectionPool $pool, array $seed): void
    {
        $pages = $pool->getConnectionForTable('pages');
        $content = $pool->getConnectionForTable('tt_content');
        foreach ($seed['pages'] as $pageIndex => $page) {
            $pid = (int)$pages->fetchOne('SELECT uid FROM pages WHERE slug=? AND deleted=0', [$page['path']]);
            $pages->update('pages', ['sorting' => ($pageIndex + 1) * 256], ['uid' => $pid]);
            $used = [];
            foreach ($page['elements'] as $index => $element) {
                $rows = $content->fetchAllAssociative('SELECT uid FROM tt_content WHERE pid=? AND CType=? AND header=? AND deleted=0 ORDER BY uid', [$pid, 'adler_' . $element['type'], $element['fields']['header'] ?? '']);
                foreach ($rows as $row) {
                    if (isset($used[$row['uid']])) { continue; }
                    $used[$row['uid']] = true;
                    $content->update('tt_content', ['sorting' => ($index + 1) * 256], ['uid' => $row['uid']]);
                    break;
                }
            }
        }
        // Only hide the exact core installer demonstration record, never arbitrary text elements.
        $content->executeStatement("UPDATE tt_content SET hidden=1 WHERE pid=1 AND CType='text' AND header='Welcome to your default website' AND bodytext LIKE '%This website is made with%'");
    }
}
