<?php
declare(strict_types=1);
defined('TYPO3') or die();
// This parameter only selects a client-side form default; it never changes cached server output.
$GLOBALS['TYPO3_CONF_VARS']['FE']['cacheHash']['excludedParameters'][] = 'richtung';
// Share one rendering chain, while retaining a distinct reusable CType per layout.
$setup = '';
foreach (require \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::extPath('site_package') . 'Configuration/ContentTypes.php' as $name => $definition) {
    $type = 'adler_' . $name;
    $setup .= "\ntt_content.$type =< lib.contentElement\ntt_content.$type {\n templateName = " . ucfirst($name) . "\n dataProcessing.200 = Waldbyte\\Adler\\DataProcessing\\ContentProcessor\n}\n";
    if ($name === 'form') {
        // Form state and submissions must never be stored in the page cache.
        $setup .= "\ntt_content.$type >\ntt_content.$type = COA_INT\ntt_content.$type {\n 10 =< lib.contentElement\n 10 {\n templateName = Form\n dataProcessing.200 = Waldbyte\\Adler\\DataProcessing\\ContentProcessor\n extbase {\n pluginName = Formframework\n controllerExtensionName = Form\n controllerName = FormFrontend\n controllerActionName = perform\n }\n }\n}\n";
    }
}
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTypoScriptSetup($setup);
