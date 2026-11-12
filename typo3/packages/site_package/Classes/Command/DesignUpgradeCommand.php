<?php
declare(strict_types=1);
namespace Waldbyte\Adler\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use TYPO3\CMS\Core\Core\Bootstrap;
use TYPO3\CMS\Core\Core\Environment;
use TYPO3\CMS\Core\DataHandling\DataHandler;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Resource\ResourceFactory;
use TYPO3\CMS\Core\Utility\GeneralUtility;

final class DesignUpgradeCommand extends Command
{
    public function __construct(private readonly \TYPO3\CMS\Form\Mvc\Persistence\FormPersistenceManagerInterface $forms, private readonly \TYPO3\CMS\Form\Domain\Repository\FormDefinitionRepository $formRepository)
    {
        parent::__construct();
    }
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        if (!Environment::getContext()->isDevelopment()) {
            throw new \RuntimeException('Design upgrade is restricted to local Development.');
        }
        Bootstrap::initializeBackendAuthentication();
        $plan = json_decode(file_get_contents(Environment::getProjectPath() . '/seed/design-upgrade.json'), true, flags: JSON_THROW_ON_ERROR);
        $previousPath=Environment::getProjectPath().'/seed/design-previous.json';
        $previousPlan=is_file($previousPath)?json_decode(file_get_contents($previousPath),true,flags:JSON_THROW_ON_ERROR):[];
        $pool = GeneralUtility::makeInstance(ConnectionPool::class);
        $db = $pool->getConnectionForTable('tt_content');
        $pageMap = $pool->getConnectionForTable('pages')->fetchAllKeyValue('SELECT slug,uid FROM pages WHERE deleted=0');
        $link = static function (string $value) use ($pageMap): string {
            if (!str_starts_with($value, '/') || str_starts_with($value, '//')) { return $value; }
            $url = parse_url($value);
            if (!isset($pageMap[$url['path'] ?? '/'])) { return $value; }
            // Keep direction query parameters as page-relative URLs; they are not TYPO3 page IDs.
            if (isset($url['query'])) { return $value; }
            return 't3://page?uid=' . $pageMap[$url['path'] ?? '/'] . (isset($url['fragment']) ? '#' . $url['fragment'] : '');
        };
        $count = 0;
        foreach ($plan['upgraded']['pages'] as $pageIndex => $page) {
            $pid = (int)$pageMap[$page['path']];
            $initial = $plan['original']['pages'][$pageIndex]['elements'];
            $data = [];
            $beforeOrder=array_map('intval',$db->fetchFirstColumn("SELECT uid FROM tt_content WHERE pid=? AND CType LIKE 'adler_%' AND deleted=0 ORDER BY sorting,uid",[$pid]));
            $serial = 0;
            $sequence = [];
            $fileReference = static function (string $table, string $field, string|int $foreign, string $filename) use (&$data, &$serial, $pid): string {
                $file = GeneralUtility::makeInstance(ResourceFactory::class)->getFileObjectFromCombinedIdentifier('1:/adler/' . $filename);
                $key = 'NEWdesignFile' . ++$serial;
                $data['sys_file_reference'][$key] = ['pid'=>$pid,'uid_local'=>$file->getUid(),'uid_foreign'=>$foreign,'tablenames'=>$table,'fieldname'=>$field,'table_local'=>'sys_file','sorting_foreign'=>1];
                return $key;
            };
            foreach ($page['elements'] as $index => $element) {
                $designKey = $page['path'] . ':' . (isset($element['match']) ? 'original-' . $element['match'] : 'added-' . $index);
                $current = $db->fetchAssociative('SELECT * FROM tt_content WHERE pid=? AND adler_design_key=? AND deleted=0', [$pid,$designKey]);
                $before = isset($element['match']) ? $initial[$element['match']] : null;
                if (!$current && $before) {
                    $current = $db->fetchAssociative('SELECT * FROM tt_content WHERE pid=? AND CType=? AND header=? AND colPos=? AND deleted=0 ORDER BY uid LIMIT 1', [$pid,'adler_'.$before['type'],$before['fields']['header']??'',$before['colPos']??0]);
                }
                $key = $current ? (int)$current['uid'] : 'NEWdesignContent' . ++$serial;
                $fields = $element['fields'] ?? [];
                $row = ['adler_design_key'=>$designKey];
                if (!$current) { $row += ['pid'=>$pid,'CType'=>'adler_'.$element['type'],'colPos'=>$element['colPos']??0,'hidden'=>0]; }
                elseif ($current['CType'] === 'adler_' . ($before['type'] ?? $element['type'])) { $row['CType']='adler_'.$element['type']; }
                foreach ($fields as $field => $value) {
                    $isLink = str_ends_with($field,'_link') || $field==='adler_whatsapp';
                    $value = $isLink ? $link((string)$value) : $value;
                    $old = $before['fields'][$field] ?? ($field==='adler_layout' ? 'default' : '');
                    $old = $isLink ? $link((string)$old) : $old;
                    $previousValue=$previousPlan['upgraded']['pages'][$pageIndex]['elements'][$index]['fields'][$field]??null;
                    if($previousValue!==null&&$isLink){$previousValue=$link((string)$previousValue);}
                    // Do not overwrite editor changes made since the original import.
                    if (!$current || (string)($current[$field]??'') === (string)$old || (string)($current[$field]??'') === (string)$value || ($previousValue!==null&&(string)($current[$field]??'')===(string)$previousValue)) { $row[$field]=$value; }
                }
                if (!empty($element['omit'])) {
                    $unchanged = !$current || ($current['bodytext']??'') === ($before['fields']['bodytext']??'');
                    if ($unchanged) { $row['hidden']=1; }
                    else { $output->writeln('Retained edited source block ' . $key); }
                }
                $newImage = $element['image'] ?? '';
                if ($newImage && (!$current || empty($current['assets']) || $newImage !== ($before['image'] ?? ''))) {
                    $existing = $current ? $db->fetchAssociative("SELECT r.uid,f.identifier FROM sys_file_reference r JOIN sys_file f ON f.uid=r.uid_local WHERE r.tablenames='tt_content' AND r.fieldname='assets' AND r.uid_foreign=? AND r.deleted=0",[$key]) : false;
                    if (!$existing) { $row['assets']=$fileReference('tt_content','assets',$key,$newImage); }
                    elseif (basename($existing['identifier']) === ($before['image']??'')) {
                        $file = GeneralUtility::makeInstance(ResourceFactory::class)->getFileObjectFromCombinedIdentifier('1:/adler/'.$newImage);
                        $data['sys_file_reference'][(int)$existing['uid']]=['uid_local'=>$file->getUid()];
                    }
                }
                $existingItems = $current ? $pool->getConnectionForTable('tx_adler_item')->fetchAllAssociative('SELECT * FROM tx_adler_item WHERE parent=? AND deleted=0 ORDER BY sorting',[$key]) : [];
                $childIds=[];
                foreach ($element['items']??[] as $sort => $item) {
                    $previousItem=$previousPlan['upgraded']['pages'][$pageIndex]['elements'][$index]['items'][$sort]??[];
                    $found = null;
                    foreach ($existingItems as $candidate) { if ($candidate['title']===$item['title']) { $found=$candidate; break; } }
                    if(!$found&&!empty($previousItem['title'])){foreach($existingItems as $candidate){if($candidate['title']===$previousItem['title']){$found=$candidate;break;}}}
                    $itemKey = $found ? (int)$found['uid'] : 'NEWdesignItem' . ++$serial;
                    $oldItem = [];
                    foreach ($before['items']??[] as $candidate) { if ($candidate['title']===$item['title']) { $oldItem=$candidate; break; } }
                    $child = [];
                    foreach ($item as $field=>$value) {
                        if ($field==='image') { continue; }
                        $value = in_array($field,['link','credit_link'],true) ? $link((string)$value) : $value;
                        $old=$oldItem[$field]??($field==='icon'?'none':($field==='link_group'?'navigation':''));
                        $old=in_array($field,['link','credit_link'],true)?$link((string)$old):$old;
                        $previous=$previousItem[$field]??null;
                        if($previous!==null&&in_array($field,['link','credit_link'],true)){$previous=$link((string)$previous);}
                        if (!$found || (string)($found[$field]??'')===(string)$old || (string)($found[$field]??'')===(string)$value || ($previous!==null&&(string)($found[$field]??'')===(string)$previous)) { $child[$field]=$value; }
                    }
                    if (!$found) { $child+=['pid'=>$pid,'parent'=>$key,'sorting'=>($sort+1)*256,'hidden'=>0]; }
                    if (!empty($item['image'])) {
                        $existing=$found?$db->fetchAssociative("SELECT r.uid,f.identifier FROM sys_file_reference r JOIN sys_file f ON f.uid=r.uid_local WHERE r.tablenames='tx_adler_item' AND r.fieldname='image' AND r.uid_foreign=? AND r.deleted=0",[$itemKey]):false;
                        if (!$existing) { $child['image']=$fileReference('tx_adler_item','image',$itemKey,$item['image']); }
                        elseif(basename($existing['identifier'])===($oldItem['image']??'') && $item['image']!==($oldItem['image']??'')) {
                            $file=GeneralUtility::makeInstance(ResourceFactory::class)->getFileObjectFromCombinedIdentifier('1:/adler/'.$item['image']);
                            $data['sys_file_reference'][(int)$existing['uid']]=['uid_local'=>$file->getUid()];
                        }
                    }
                    $data['tx_adler_item'][$itemKey]=$child;
                    $childIds[]=$itemKey;
                }
                // Adding omissions must not remove extra entries created by an editor.
                foreach ($existingItems as $existing) { if (!in_array((int)$existing['uid'],$childIds,true)) { $childIds[]=(int)$existing['uid']; } }
                if ($childIds) { $row['adler_items']=implode(',',$childIds); }
                $data['tt_content'][$key]=$row;
                $sequence[]=$key;
                $count++;
            }
            $handler=GeneralUtility::makeInstance(DataHandler::class);
            $handler->start($data,[]);$handler->process_datamap();
            if ($handler->errorLog) { throw new \RuntimeException(implode("\n",$handler->errorLog)); }
            $existingSequence=array_values(array_filter($sequence,'is_int'));
            $knownOrder=array_values(array_filter($beforeOrder,static fn(int $uid)=>in_array($uid,$existingSequence,true)));
            if($knownOrder===$existingSequence){
                foreach ($sequence as $sort=>$key) {
                    $uid=is_int($key)?$key:(int)$handler->substNEWwithIDs[$key];
                    $db->update('tt_content',['sorting'=>($sort+1)*256],['uid'=>$uid]);
                }
            }else{
                $output->writeln('Retained custom section order on '.$page['path']);
            }
        }
        $uid=$this->formRepository->findUidByFormIdentifier('taxi-inquiry');
        if ($uid) {
            $definition=$this->forms->load((string)$uid);
            foreach ($definition['renderables'][0]['renderables'] as &$field) {
                $placeholder=match($field['identifier']) {'name'=>'Ihr vollständiger Name','phone'=>'z. B. 0176 12345678','email'=>'name@beispiel.de','pickup','destination'=>'Straße, Hausnummer, PLZ, Ort',default=>null};
                if ($placeholder!==null && empty($field['properties']['fluidAdditionalAttributes']['placeholder'])) { $field['properties']['fluidAdditionalAttributes']['placeholder']=$placeholder; }
                if ($field['identifier']==='privacy' && ($field['properties']['text']??'')==='Datenschutzhinweise: /datenschutz/ – Eine Anfrage ist noch keine verbindliche Buchung.') {
                    $field['properties']['text']='<a href="/datenschutz/">Datenschutzhinweise lesen</a> – Eine Anfrage ist noch keine verbindliche Buchung.';
                }
            }
            unset($field);
            $this->forms->save((string)$uid,$definition,[]);
        }
        $groups=$pool->getConnectionForTable('be_groups');
        $group=$groups->fetchAssociative("SELECT uid,non_exclude_fields FROM be_groups WHERE title='Taxi Adler Redaktion' AND deleted=0");
        if ($group) {
            $allowed=explode(',',$group['non_exclude_fields']);
            foreach (['adler_layout','adler_side_header','adler_side_text','adler_tertiary_label','adler_tertiary_link','adler_preset_destination'] as $field) { $allowed[]='tt_content:'.$field; }
            $allowed[]='tx_adler_item:link_group';
            $groups->update('be_groups',['non_exclude_fields'=>implode(',',array_unique($allowed))],['uid'=>(int)$group['uid']]);
        }
        $output->writeln('Restored design for ' . $count . ' elements. Edited field values and extra editor entries retained.');
        return Command::SUCCESS;
    }
}
