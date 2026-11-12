<?php
declare(strict_types=1);
defined('TYPO3') or die();

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

ExtensionManagementUtility::addTCAcolumns('sys_file_metadata', [
    'adler_image_origin' => [
        'label' => 'KI-Kennzeichnung auf der Website',
        'config' => [
            'type' => 'select',
            'renderType' => 'selectSingle',
            'items' => [
                ['label' => 'Keine Kennzeichnung', 'value' => ''],
                ['label' => 'KI-generiert', 'value' => 'generated'],
                ['label' => 'KI-bearbeitet', 'value' => 'edited'],
            ],
            'default' => '',
        ],
    ],
]);
ExtensionManagementUtility::addToAllTCAtypes('sys_file_metadata', 'adler_image_origin', '', 'after:alternative');
