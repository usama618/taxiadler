<?php
declare(strict_types=1);
namespace Waldbyte\Adler\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use TYPO3\CMS\Core\Core\Bootstrap;
use TYPO3\CMS\Core\Core\Environment;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\DataHandling\DataHandler;
use TYPO3\CMS\Core\Http\RequestFactory;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Form\Domain\DTO\SearchCriteria;
use TYPO3\CMS\Form\Mvc\Persistence\FormPersistenceManagerInterface;

final class AuditCommand extends Command
{
    private int $checks = 0;

    public function __construct(private readonly FormPersistenceManagerInterface $forms)
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption('exercise-fields', null, InputOption::VALUE_NONE, 'Temporarily edit local content through DataHandler, assert frontend output, then restore');
    }

    private function check(bool $condition, string $message): void
    {
        if (!$condition) { throw new \RuntimeException($message); }
        $this->checks++;
    }

    private function save(string $table, int $uid, array $fields): void
    {
        $handler = GeneralUtility::makeInstance(DataHandler::class);
        $handler->start([$table => [$uid => $fields]], []);
        $handler->process_datamap();
        if ($handler->errorLog) { throw new \RuntimeException(implode("\n", $handler->errorLog)); }
    }

    private function get(string $path): string
    {
        $response = GeneralUtility::makeInstance(RequestFactory::class)->request('https://taxi-adler.ddev.site' . $path, 'GET', ['http_errors' => false]);
        $this->check($response->getStatusCode() === 200, 'HTTP ' . $response->getStatusCode() . ': ' . $path);
        return (string)$response->getBody();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        Bootstrap::initializeBackendAuthentication();
        $GLOBALS['BE_USER']->initializeUserSessionManager();
        $pool = GeneralUtility::makeInstance(ConnectionPool::class);
        $content = $pool->getConnectionForTable('tt_content');
        $types = require GeneralUtility::getFileAbsFileName('EXT:site_package/Configuration/ContentTypes.php');
        $forms = $this->forms->listForms([], new SearchCriteria());
        $this->check(count($forms) > 0, 'No editable forms available in the form selector');
        $role = $pool->getConnectionForTable('be_groups')->fetchAssociative("SELECT * FROM be_groups WHERE title='Taxi Adler Redaktion' AND deleted=0");
        $this->check((bool)$role, 'Missing non-admin editor role; run adler:editor-role');
        $admin = $GLOBALS['BE_USER'];
        $editor = GeneralUtility::makeInstance(\TYPO3\CMS\Core\Authentication\BackendUserAuthentication::class);
        $editor->user = array_replace($admin->user, ['uid' => 999999, 'username' => 'audit-only-in-memory', 'admin' => 0, 'usergroup' => (string)$role['uid'], 'options' => 3, 'workspace_id' => 0, 'workspace_perms' => 1]);
        $editor->initializeUserSessionManager();
        $editor->fetchGroupData();
        foreach (['addFile','readFile','writeFile','readFolder'] as $permission) {
            $this->check($editor->getFilePermissions()[$permission], 'Editor lacks media permission: ' . $permission);
        }
        foreach (['tt_content','tx_adler_item','form_definition'] as $table) {
            $this->check($editor->check('tables_modify',$table), 'Editor cannot modify ' . $table);
        }
        $results = [];
        foreach ($types as $suffix => [$label,$fields,$childType]) {
            $type = 'adler_' . $suffix;
            $row = $content->fetchAssociative('SELECT * FROM tt_content WHERE CType=? AND deleted=0 AND hidden=0 ORDER BY uid LIMIT 1', [$type]);
            $this->check((bool)$row, 'Missing imported element: ' . $type);
            $this->check(isset($GLOBALS['TCA']['tt_content']['types'][$type]), 'Missing registered type: ' . $type);
            $request = (new \TYPO3\CMS\Core\Http\ServerRequest('https://taxi-adler.ddev.site/typo3/'))
                ->withAttribute('applicationType', \TYPO3\CMS\Core\Http\ApplicationType::BACKEND);
            $compiled = GeneralUtility::makeInstance(\TYPO3\CMS\Backend\Form\FormDataCompiler::class)->compile([
                'tableName' => 'tt_content', 'vanillaUid' => (int)$row['uid'], 'command' => 'edit', 'request' => $request,
            ], GeneralUtility::makeInstance(\TYPO3\CMS\Backend\Form\FormDataGroup\TcaDatabaseRecord::class));
            $this->check($compiled['recordTypeValue'] === $type, $type . ': backend edit form did not compile');
            try {
                $GLOBALS['BE_USER'] = $editor;
                $editorForm = GeneralUtility::makeInstance(\TYPO3\CMS\Backend\Form\FormDataCompiler::class)->compile([
                    'tableName' => 'tt_content', 'vanillaUid' => (int)$row['uid'], 'command' => 'edit', 'request' => $request,
                ], GeneralUtility::makeInstance(\TYPO3\CMS\Backend\Form\FormDataGroup\TcaDatabaseRecord::class));
                foreach (explode(',', $fields) as $field) {
                    // Layout-specific fields may be hidden for administrators too.
                    if (!isset($compiled['processedTca']['columns'][$field])) { continue; }
                    $this->check(isset($editorForm['processedTca']['columns'][$field]), $type . ': field inaccessible to a non-admin editor: ' . $field);
                }
                $this->check($editor->check('explicit_allowdeny','tt_content:CType:' . $type), 'Editor cannot create ' . $type);
            } finally { $GLOBALS['BE_USER'] = $admin; }
            foreach (explode(',', $fields) as $field) {
                $this->check(isset($GLOBALS['TCA']['tt_content']['columns'][$field]), 'No TCA field: ' . $field);
            }
            if ($childType && isset($compiled['processedTca']['columns']['adler_items'])) {
                $this->check($GLOBALS['TCA']['tt_content']['types'][$type]['columnsOverrides']['adler_items']['config']['overrideChildTca']['columns']['item_type']['config']['default'] === $childType, $type . ': wrong new child type');
                $this->check(isset($GLOBALS['TCA']['tx_adler_item']['types'][$childType]), 'Missing child editing form: ' . $childType);
                $newChild = GeneralUtility::makeInstance(\TYPO3\CMS\Backend\Form\FormDataCompiler::class)->compile([
                    'tableName' => 'tx_adler_item', 'vanillaUid' => (int)$row['pid'], 'command' => 'new', 'request' => $request,
                    'inlineParentUid' => (int)$row['uid'], 'inlineParentTableName' => 'tt_content', 'inlineParentFieldName' => 'adler_items',
                    'inlineParentConfig' => $compiled['processedTca']['columns']['adler_items']['config'],
                ], GeneralUtility::makeInstance(\TYPO3\CMS\Backend\Form\FormDataGroup\TcaDatabaseRecord::class));
                $this->check($newChild['recordTypeValue'] === $childType, $type . ': adding a child opens the wrong fields');
            }
            if ($input->getOption('exercise-fields')) {
                $this->check(Environment::getContext()->isDevelopment(), 'Editor exercise is restricted to Development context');
                $path = $pool->getConnectionForTable('pages')->fetchOne('SELECT slug FROM pages WHERE uid=?', [$row['pid']]);
                $changes = []; $expected = [];
                foreach (explode(',', $fields) as $field) {
                    if (!isset($compiled['processedTca']['columns'][$field])) { continue; }
                    if (in_array($field, ['assets','adler_items','adler_form'], true)) { continue; }
                    $marker = 'EDITORTEST-' . $suffix . '-' . str_replace('_','-',$field);
                    if ($field === 'adler_theme') { $changes[$field] = 'dark'; $expected[] = 'cms-theme-dark'; continue; }
                    if ($field === 'adler_rating') { $changes[$field] = 4.2; $expected[] = '4,2'; }
                    elseif ($field === 'adler_count') { $changes[$field] = 9876; $expected[] = '9876'; }
                    elseif ($field === 'adler_autoplay') { $changes[$field] = 0; $expected[] = 'data-autoplay="0"'; }
                    elseif ($field === 'adler_interval') { $changes[$field] = 8000; $expected[] = 'data-interval="8000"'; }
                    elseif ($field === 'adler_email') { $changes[$field] = 'editor-test@example.invalid'; $expected[] = 'editor-test@example.invalid'; }
                    elseif ($field === 'adler_phone' || $field === 'adler_mobile') { $changes[$field] = '+49 7222 123456'; $expected[] = '+49 7222 123456'; }
                    elseif (str_ends_with($field,'_link') || $field === 'adler_whatsapp') { $changes[$field] = 'https://example.invalid/' . $marker; $expected[] = 'https://example.invalid/' . $marker; }
                    else { $changes[$field] = $field === 'bodytext' ? '<p>' . $marker . '</p>' : $marker; $expected[] = $marker; }
                }
                $changes['adler_anchor'] = 'editortest-' . $suffix;
                $expected[] = 'id="editortest-' . $suffix . '"';
                try {
                    $this->save('tt_content', (int)$row['uid'], $changes);
                    $html = html_entity_decode($this->get($path), ENT_QUOTES | ENT_HTML5);
                    foreach ($expected as $value) { $this->check(str_contains($html, $value), $type . ': editable value not rendered: ' . $value); }
                    $this->save('tt_content', (int)$row['uid'], ['hidden' => 1]);
                    $this->check(!str_contains($this->get($path), 'EDITORTEST-' . $suffix . '-header'), $type . ': hidden record still visible');
                } finally {
                    $restore = array_intersect_key($row,$changes); $restore['hidden'] = $row['hidden'];
                    $this->save('tt_content', (int)$row['uid'], $restore);
                }
            }
            $results[] = $type;
            $output->writeln('PASS ' . $type);
        }
        // Check every installed layout, including conditional sidebar/preset fields not present on the default variant.
        foreach ($content->fetchAllAssociative("SELECT MIN(uid) AS uid FROM tt_content WHERE CType LIKE 'adler_%' AND hidden=0 AND deleted=0 GROUP BY CType,adler_layout") as $variant) {
            $adminForm=GeneralUtility::makeInstance(\TYPO3\CMS\Backend\Form\FormDataCompiler::class)->compile([
                'tableName'=>'tt_content','vanillaUid'=>(int)$variant['uid'],'command'=>'edit','request'=>$request,
            ],GeneralUtility::makeInstance(\TYPO3\CMS\Backend\Form\FormDataGroup\TcaDatabaseRecord::class));
            try {
                $GLOBALS['BE_USER']=$editor;
                $editorForm=GeneralUtility::makeInstance(\TYPO3\CMS\Backend\Form\FormDataCompiler::class)->compile([
                    'tableName'=>'tt_content','vanillaUid'=>(int)$variant['uid'],'command'=>'edit','request'=>$request,
                ],GeneralUtility::makeInstance(\TYPO3\CMS\Backend\Form\FormDataGroup\TcaDatabaseRecord::class));
                foreach ($adminForm['processedTca']['columns'] as $field=>$definition) {
                    if(str_starts_with($field,'adler_')&&$field!=='adler_design_key'){
                        $this->check(isset($editorForm['processedTca']['columns'][$field]),'Layout field inaccessible to editor: '.$variant['uid'].':'.$field);
                    }
                }
            }finally{$GLOBALS['BE_USER']=$admin;}
        }
        $children = $pool->getConnectionForTable('tx_adler_item');
        if ($input->getOption('exercise-fields')) {
            $items = $children->fetchAllAssociative('SELECT * FROM tx_adler_item WHERE deleted=0 AND hidden=0 ORDER BY uid');
            $seen = [];
            foreach ($items as $item) {
                if (isset($seen[$item['item_type']])) { continue; } $seen[$item['item_type']] = true;
                $parent = $content->fetchAssociative('SELECT * FROM tt_content WHERE uid=?', [$item['parent']]);
                $path = $pool->getConnectionForTable('pages')->fetchOne('SELECT slug FROM pages WHERE uid=?', [$parent['pid']]);
                $marker = 'CHILDTEST-' . $item['item_type'];
                $fields = $GLOBALS['TCA']['tx_adler_item']['types'][$item['item_type']]['showitem'];
                $changes = ['title' => $marker]; $expected = [$marker];
                $fieldNames = array_map(static fn(string $field): string => explode(';', $field)[0], explode(',', $fields));
                foreach (['link','credit_link'] as $field) {
                    if (in_array($field, $fieldNames, true)) {
                        $changes[$field] = 'https://example.invalid/' . $marker . '-' . $field;
                        $expected[] = $changes[$field];
                    }
                }
                foreach (['description','eyebrow','link_label','credit_label'] as $field) {
                    if (!in_array($field, $fieldNames, true)) { continue; }
                    $value = $marker . '-' . $field; $changes[$field] = $field === 'description' ? '<p>'.$value.'</p>' : $value; $expected[] = $value;
                }
                try {
                    $this->save('tx_adler_item', (int)$item['uid'], $changes);
                    $html = html_entity_decode($this->get($path), ENT_QUOTES | ENT_HTML5);
                    foreach ($expected as $value) { $this->check(str_contains($html,$value), 'Child value not rendered: ' . $value); }
                    $this->save('tx_adler_item', (int)$item['uid'], ['hidden' => 1]);
                    $this->check(!str_contains($this->get($path), $marker), 'Hidden child still visible');
                } finally {
                    $this->save('tx_adler_item', (int)$item['uid'], array_intersect_key($item,$changes) + ['hidden' => $item['hidden']]);
                }
                $output->writeln('PASS child ' . $item['item_type']);
            }
        }
        if ($input->getOption('exercise-fields')) {
            $references = $pool->getConnectionForTable('sys_file_reference');
            $target = (int)$pool->getConnectionForTable('sys_file')->fetchOne("SELECT uid FROM sys_file WHERE identifier='/adler/step-check.svg' AND missing=0 LIMIT 1");
            $this->check($target > 0, 'Missing image replacement test asset');
            $seen = [];
            foreach ($references->fetchAllAssociative('SELECT * FROM sys_file_reference WHERE deleted=0 AND hidden=0') as $reference) {
                $isItem = $reference['tablenames'] === 'tx_adler_item';
                if ($isItem) {
                    $item = $children->fetchAssociative('SELECT * FROM tx_adler_item WHERE uid=?', [$reference['uid_foreign']]);
                    $key = 'child-' . $item['item_type'];
                    $pid = $item['pid'];
                } else {
                    $parent = $content->fetchAssociative('SELECT * FROM tt_content WHERE uid=?', [$reference['uid_foreign']]);
                    $key = $parent['CType']; $pid = $parent['pid'];
                }
                if (isset($seen[$key])) { continue; } $seen[$key] = true;
                $path = $pool->getConnectionForTable('pages')->fetchOne('SELECT slug FROM pages WHERE uid=?', [$pid]);
                $uid = (int)$reference['uid'];
                try {
                    $beforeDom = new \DOMDocument(); @$beforeDom->loadHTML($this->get($path));
                    $beforeCount = (new \DOMXPath($beforeDom))->query('//*[contains(@src,"step-check") or contains(@style,"step-check")]')->length;
                    $this->save('sys_file_reference', $uid, ['uid_local' => $target]);
                    $dom = new \DOMDocument(); @$dom->loadHTML($this->get($path));
                    $xp = new \DOMXPath($dom);
                    $this->check($xp->query('//*[contains(@src,"step-check") or contains(@style,"step-check")]')->length > $beforeCount, $key . ': image replacement not rendered');
                } finally { $this->save('sys_file_reference', $uid, ['uid_local' => $reference['uid_local']]); }
                $output->writeln('PASS FAL image replacement ' . $key);
            }
        }
        $output->writeln('PASS ' . $this->checks . ' assertions; ' . count($results) . ' content types; ' . count($forms) . ' editable form(s).');
        return Command::SUCCESS;
    }
}
