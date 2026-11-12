<?php
declare(strict_types=1);
namespace Waldbyte\Adler\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use TYPO3\CMS\Core\Core\Bootstrap;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\DataHandling\DataHandler;
use TYPO3\CMS\Core\Utility\GeneralUtility;

final class EditorRoleCommand extends Command
{
    private const MEDIA_PERMISSIONS = 'readFolder,writeFolder,addFolder,renameFolder,moveFolder,copyFolder,readFile,writeFile,addFile,renameFile,replaceFile,moveFile,copyFile,deleteFile';

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        Bootstrap::initializeBackendAuthentication();
        $pool = GeneralUtility::makeInstance(ConnectionPool::class);
        $groups = $pool->getConnectionForTable('be_groups');
        $uid = $groups->fetchOne("SELECT uid FROM be_groups WHERE title='Taxi Adler Redaktion' AND deleted=0");
        if ($uid) {
            // Repair only the empty initial permission set, not a role customized by an administrator.
            $groups->executeStatement("UPDATE be_groups SET file_permissions=? WHERE uid=? AND (file_permissions IS NULL OR file_permissions='')", [self::MEDIA_PERMISSIONS, $uid]);
            $output->writeln('Existing Taxi Adler editor role retained; empty initial media permissions initialized.'); return Command::SUCCESS;
        }
        $base = $groups->fetchAssociative("SELECT * FROM be_groups WHERE title='Editor' AND deleted=0 ORDER BY uid LIMIT 1") ?: [];
        $tables = ['pages','tt_content','tx_adler_item','sys_file','sys_file_metadata','sys_file_reference','form_definition'];
        $excluded = array_filter(explode(',', $base['non_exclude_fields'] ?? ''));
        foreach (['tt_content','tx_adler_item','sys_file_reference','sys_file_metadata','pages'] as $table) {
            foreach ($GLOBALS['TCA'][$table]['columns'] as $field => $config) {
                if (!empty($config['exclude'])) { $excluded[] = $table . ':' . $field; }
            }
        }
        $types = require GeneralUtility::getFileAbsFileName('EXT:site_package/Configuration/ContentTypes.php');
        $allow = array_map(static fn(string $type): string => 'tt_content:CType:adler_' . $type, array_keys($types));
        foreach (['text','textmedia','header','image','bullets','shortcut','form_formframework'] as $type) { $allow[] = 'tt_content:CType:' . $type; }
        $handler = GeneralUtility::makeInstance(DataHandler::class);
        $handler->start(['be_groups' => ['NEWadlerrole' => [
            'pid' => 0, 'title' => 'Taxi Adler Redaktion',
            'description' => 'Website-Inhalte, Bilder, wiederverwendbare Elemente und Formulare. Keine Systemverwaltung.',
            'tables_select' => implode(',', [...$tables,'sys_file_storage']),
            'tables_modify' => implode(',', $tables),
            'non_exclude_fields' => implode(',', array_unique($excluded)),
            'explicit_allowdeny' => implode(',', $allow),
            'groupMods' => 'dashboard,web_layout,records,page_preview,media_management,web_FormFormbuilder,form_manager,form_editor,recycler,user_setup',
            'db_mountpoints' => '1', 'file_mountpoints' => $base['file_mountpoints'] ?? '1',
            'file_permissions' => self::MEDIA_PERMISSIONS,
            'pagetypes_select' => '1,4,254',
            'TSconfig' => "options.clearCache.pages = 1\noptions.clearCache.all = 0\n",
        ]]], []);
        $handler->process_datamap();
        if ($handler->errorLog) { throw new \RuntimeException(implode("\n", $handler->errorLog)); }
        $uid = (int)$handler->substNEWwithIDs['NEWadlerrole'];
        $pages = $pool->getConnectionForTable('pages');
        $pages->executeStatement('UPDATE pages SET perms_groupid=?,perms_group=31,perms_everybody=1 WHERE deleted=0', [$uid]);
        $output->writeln('Prepared non-admin editor role UID ' . $uid . '. Assign it to a named editor in the backend; no login was created.');
        return Command::SUCCESS;
    }
}
