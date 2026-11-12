<?php
declare(strict_types=1);
namespace Waldbyte\Adler\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use TYPO3\CMS\Core\Core\Bootstrap;
use TYPO3\CMS\Core\Core\Environment;
use TYPO3\CMS\Core\DataHandling\DataHandler;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Resource\ResourceFactory;
use TYPO3\CMS\Core\Utility\GeneralUtility;

final class ServicePagesCommand extends Command
{
    protected function configure(): void
    {
        $this->addOption('apply', null, InputOption::VALUE_NONE, 'Replace the five approved service-page content plans in local Development');
        $this->addOption('banners-only', null, InputOption::VALUE_NONE, 'Update only the configured hero images, preserving all editorial text');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        if (!Environment::getContext()->isDevelopment()) {
            throw new \RuntimeException('The service-page installer is restricted to Development.');
        }
        $plans = require Environment::getProjectPath() . '/seed/service-pages.php';
        foreach ($plans as $plan) {
            $output->writeln($plan['slug'] . ' — ' . $plan['seo_title']);
        }
        if (!$input->getOption('apply')) {
            $output->writeln('Preview only. Back up the database, then use --apply to install the approved content. Reapplying replaces these service-page texts.');
            return Command::SUCCESS;
        }
        Bootstrap::initializeBackendAuthentication();
        $pool = GeneralUtility::makeInstance(ConnectionPool::class);
        $db = $pool->getConnectionForTable('tt_content');
        $data = [];
        $serial = 0;
        $bannersOnly = $input->getOption('banners-only');
        foreach ($plans as $plan) {
            if ($bannersOnly && !isset($plan['heroImage'])) { continue; }
            $pid = $plan['pid'];
            if ($pool->getConnectionForTable('pages')->fetchOne('SELECT slug FROM pages WHERE uid=? AND deleted=0', [$pid]) !== $plan['slug']) {
                throw new \RuntimeException('Unexpected page at UID ' . $pid . '; nothing has been written.');
            }
            foreach ($plan['ids'] as $uid) {
                if ((int)$db->fetchOne('SELECT pid FROM tt_content WHERE uid=? AND deleted=0', [$uid]) !== $pid) {
                    throw new \RuntimeException('Unexpected content UID ' . $uid . '; nothing has been written.');
                }
            }
            $ids = $plan['ids'];
            if (isset($plan['heroImage'])) {
                $image = GeneralUtility::makeInstance(ResourceFactory::class)->getFileObjectFromCombinedIdentifier('1:' . $plan['heroImage']);
                $referenceUid = $pool->getConnectionForTable('sys_file_reference')->fetchOne("SELECT uid FROM sys_file_reference WHERE tablenames='tt_content' AND fieldname='assets' AND uid_foreign=? AND deleted=0 ORDER BY sorting_foreign LIMIT 1", [$ids['hero']]);
                if (!$referenceUid) {
                    throw new \RuntimeException('Missing hero image or existing image reference for page ' . $pid);
                }
                $data['sys_file_reference'][(int)$referenceUid] = ['uid_local'=>$image->getUid(),'alternative'=>$plan['heroAlt'] ?? 'Mercedes-Benz E-Klasse von Taxi Adler Rastatt'];
            }
            if ($bannersOnly) { continue; }
            $booking = 't3://page?uid=' . $pid . '#buchen';
            $data['pages'][$pid] = ['seo_title'=>$plan['seo_title'], 'description'=>$plan['description']];
            $data['tt_content'][$ids['hero']] = [
                'adler_layout'=>'service', 'adler_eyebrow'=>'TAXI ADLER · SEIT 15 JAHREN IN RASTATT',
                'header'=>$plan['hero'][0], 'adler_accent'=>$plan['hero'][1], 'bodytext'=>$plan['hero'][2],
                'adler_primary_label'=>'07222 9011511', 'adler_primary_link'=>'tel:+4972229011511',
                'adler_secondary_label'=>'Fahrt anfragen', 'adler_secondary_link'=>$booking,
                'adler_note'=>'Rastatt & Umgebung · nach Vereinbarung',
            ];
            $data['tt_content'][$ids['highlights']] = ['bodytext'=>'<ul><li>' . implode('</li><li>', $plan['highlights']) . '</li></ul>'];
            $data['tt_content'][$ids['intro']] = [
                'header'=>$plan['intro'][0], 'adler_accent'=>$plan['intro'][1], 'bodytext'=>$plan['intro'][2],
                'adler_eyebrow'=>'IHRE FAHRT. PERSÖNLICH GEPLANT.', 'adler_layout'=>'service',
                'adler_side_header'=>'Für Ihre Anfrage.',
                'adler_side_text'=>'<ol><li>' . implode('</li><li>', $plan['checklist']) . '</li></ol>',
                'adler_primary_label'=>'Anfrage vorbereiten', 'adler_primary_link'=>$booking,
                'adler_secondary_label'=>'Direkt anrufen', 'adler_secondary_link'=>'tel:+4972229011511',
            ];
            $data['tt_content'][$ids['cases']] = ['CType'=>'adler_cards','hidden'=>0,'header'=>$plan['casesTitle'],'adler_accent'=>'','bodytext'=>'','adler_eyebrow'=>'PASSEND ZU IHREM ANLIEGEN','adler_layout'=>'default','adler_theme'=>'light'];
            $data['tt_content'][$ids['guide']] = [
                'CType'=>'adler_split','hidden'=>0,'header'=>$plan['guide'][0],'adler_accent'=>$plan['guide'][1],
                'bodytext'=>$plan['guide'][2],'adler_eyebrow'=>'GUT ZU WISSEN','adler_layout'=>'editorial','adler_theme'=>'cream',
                'adler_primary_label'=>'Fragen persönlich klären','adler_primary_link'=>'tel:+4972229011511',
            ];
            $data['tt_content'][$ids['process']] = ['CType'=>'adler_cards','hidden'=>0,'header'=>'In drei Schritten.','adler_accent'=>'Gut vorbereitet.','adler_eyebrow'=>'SO FUNKTIONIERT DIE ANFRAGE','bodytext'=>'<p>Erst abstimmen, dann verbindlich vereinbaren. So wissen beide Seiten, was für Ihre Fahrt wichtig ist.</p>','adler_layout'=>'values'];
            $data['tt_content'][$ids['faq']] = ['header'=>'Ihre Fragen.','adler_accent'=>'Unsere Antworten.','bodytext'=>'<p>Noch etwas offen? Rufen Sie uns an. Den konkreten Ablauf Ihrer Fahrt klären wir persönlich.</p>','adler_primary_label'=>'07222 9011511','adler_primary_link'=>'tel:+4972229011511'];
            $data['tt_content'][$ids['form']] = ['header'=>$plan['formTitle'],'adler_accent'=>'anfragen.','adler_anchor'=>'buchen'];
            $sets = [
                'cases'=>array_map(static fn(array $r): array => ['item_type'=>'card','title'=>$r[0],'eyebrow'=>$r[1],'icon'=>$r[2],'description'=>$r[3],'link'=>$r[4]??'','link_label'=>$r[5]??''], $plan['cases']),
                'process'=>array_map(static fn(array $r): array => ['item_type'=>'card','title'=>$r[0],'description'=>$r[1],'icon'=>$r[2]], $plan['process']),
                'faq'=>array_map(static fn(array $r): array => ['item_type'=>'faq','title'=>$r[0],'description'=>$r[1]], $plan['faq']),
            ];
            foreach ($sets as $slot=>$entries) {
                $parent = $ids[$slot];
                $existing = $pool->getConnectionForTable('tx_adler_item')->fetchAllAssociative('SELECT uid FROM tx_adler_item WHERE parent=? AND deleted=0 ORDER BY sorting,uid', [$parent]);
                $children = [];
                foreach ($entries as $index=>$entry) {
                    $key = $existing[$index]['uid'] ?? 'NEWserviceItem' . ++$serial;
                    $data['tx_adler_item'][$key] = $entry + ['pid'=>$pid,'parent'=>$parent,'sorting'=>($index+1)*256,'hidden'=>0];
                    $children[] = $key;
                }
                foreach (array_slice($existing, count($entries)) as $unused) {
                    $data['tx_adler_item'][$unused['uid']] = ['hidden'=>1];
                    $children[] = $unused['uid'];
                }
                $data['tt_content'][$parent]['adler_items'] = implode(',', $children);
            }
        }
        $handler = GeneralUtility::makeInstance(DataHandler::class);
        $handler->start($data, []);
        $handler->process_datamap();
        if ($handler->errorLog) {
            throw new \RuntimeException(implode("\n", $handler->errorLog));
        }
        $output->writeln($bannersOnly ? 'Configured service banners updated. Editorial text retained.' : 'Five service pages updated. Existing URLs, related-service links and shared form configuration retained. All content is editable in TYPO3.');
        return Command::SUCCESS;
    }
}
