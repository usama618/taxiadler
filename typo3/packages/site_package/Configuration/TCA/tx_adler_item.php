<?php
declare(strict_types=1);
defined('TYPO3') or die();
$input = static fn(string $label) => ['exclude' => true, 'label' => $label, 'config' => ['type' => 'input', 'max' => 255]];
return [
    'ctrl' => ['title' => 'Taxi Adler Eintrag', 'label' => 'title', 'type' => 'item_type', 'sortby' => 'sorting', 'delete' => 'deleted', 'versioningWS' => true, 'languageField' => 'sys_language_uid', 'transOrigPointerField' => 'l10n_parent', 'translationSource' => 'l10n_source', 'enablecolumns' => ['disabled' => 'hidden'], 'iconfile' => 'EXT:core/Resources/Public/Icons/T3Icons/content/content-text.svg', 'hideTable' => true, 'security' => ['ignorePageTypeRestriction' => true]],
    'types' => [
        'link' => ['showitem' => 'title,link,icon,submenu_pages,link_group,hidden'],
        'card' => ['showitem' => 'eyebrow,title,description,image,icon,link_label,link,credit_label,credit_link,hidden'],
        'stat' => ['showitem' => 'title,description,icon,link_label,link,hidden'],
        'vehicle' => ['showitem' => 'title,description,image,link_label,link,hidden'],
        'step' => ['showitem' => 'eyebrow,title,description,image,icon,link_label,link,hidden'],
        'faq' => ['showitem' => 'title,description,hidden'],
        'review' => ['showitem' => 'title;Name der bewertenden Person,description;Originalauszug,rating,link;Link zur Originalbewertung,hidden'],
        'payment' => ['showitem' => 'title;Zahlungsart / Alternativtext,image,link;Optionaler Link,hidden'],
    ],
    'columns' => [
        'submenu_pages' => ['label'=>'Untermenü-Seiten (Hauptnavigation)', 'description'=>'Optional: Seiten aus dieser Website auswählen und sortieren. Der Hauptlink bleibt als Übersichtsseite erreichbar.', 'config'=>['type'=>'group','allowed'=>'pages','size'=>6,'maxitems'=>12,'minitems'=>0]],
        'link_group' => ['exclude' => true, 'label' => 'Footer-Bereich', 'config' => ['type' => 'select', 'renderType' => 'selectSingle', 'items' => [['label' => 'Navigation','value' => 'navigation'],['label' => 'Leistungen','value' => 'services'],['label' => 'Rechtliches','value' => 'legal']], 'default' => 'navigation']],
        'parent' => ['config' => ['type' => 'passthrough']],
        'item_type' => ['config' => ['type' => 'passthrough', 'default' => 'card']],
        'sys_language_uid' => ['label' => 'Sprache', 'config' => ['type' => 'language']],
        'l10n_parent' => ['config' => ['type' => 'group', 'allowed' => 'tx_adler_item', 'maxitems' => 1]],
        'l10n_source' => ['config' => ['type' => 'passthrough']],
        'hidden' => ['label' => 'Verbergen', 'config' => ['type' => 'check']],
        'title' => ['exclude' => true, 'label' => 'Titel', 'config' => ['type' => 'input', 'required' => true, 'max' => 255]], 'eyebrow' => $input('Kleine Überschrift'),
        'description' => ['exclude' => true, 'label' => 'Beschreibung', 'config' => ['type' => 'text', 'enableRichtext' => true]],
        'image' => ['exclude' => true, 'label' => 'Bild / Logo', 'config' => ['type' => 'file', 'allowed' => 'common-image-types', 'maxitems' => 1]],
        'link' => ['exclude' => true, 'label' => 'Ziel', 'config' => ['type' => 'link', 'allowedTypes' => ['page', 'url', 'file', 'email', 'telephone']]],
        'link_label' => $input('Link-Beschriftung'),
        'credit_label' => $input('Bildnachweis: Text'),
        'credit_link' => ['exclude' => true, 'label' => 'Bildnachweis: Link', 'config' => ['type' => 'link']],
        'icon' => ['exclude' => true, 'label' => 'Symbol', 'config' => ['type' => 'select', 'renderType' => 'selectSingle', 'items' => array_map(static fn(string $name) => ['label' => ucfirst($name), 'value' => $name], ['none','phone','car-front','plane','heart-pulse','map-pin','clock','shield-check','calendar-days','check','arrow-up-right','message-circle','star','mail','navigation','users','shopping-bag'])]],
        'rating' => ['exclude' => true, 'label' => 'Sterne', 'config' => ['type' => 'number', 'range' => ['lower' => 1, 'upper' => 5], 'default' => 5]],
    ],
];
