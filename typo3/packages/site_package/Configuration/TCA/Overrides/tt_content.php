<?php
declare(strict_types=1);
defined('TYPO3') or die();
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility as EMU;

$input = static fn(string $label, array $extra = []) => ['exclude' => true, 'label' => $label, 'config' => ['type' => 'input', 'max' => 255] + $extra];
$link = static fn(string $label) => ['exclude' => true, 'label' => $label, 'config' => ['type' => 'link', 'allowedTypes' => ['page', 'url', 'file', 'email', 'telephone']]];
$fields = [
    'adler_design_key' => ['config' => ['type' => 'passthrough']],
    'adler_layout' => ['exclude' => true, 'label' => 'Layout-Variante', 'config' => ['type' => 'select', 'renderType' => 'selectSingle', 'items' => array_map(static fn($item) => ['label' => $item[0], 'value' => $item[1]], [['Standard','default'],['Leistungsübersicht mit Fotokarten','services'],['Rastatt-Bildergalerie','places'],['Werte-Liste','values'],['Verwandte Leistungen','related'],['Vorteile','benefits'],['Redaktioneller Zweispalter','editorial'],['Leistungsdetails mit Anfrage-Checkliste','service'],['Flughafen: Strecken','airport-routes'],['Flughafen: Preis','airport-price'],['Flughafen: Familie','airport-family'],['Flughafen: Einzugsgebiet','airport-local'],['Flughafen: Banner','airport'],['Kontakt: kompakter Seitenkopf','contact'],['Rechtstext','legal']]), 'default' => 'default']],
    'adler_side_header' => $input('Seitenbereich: Überschrift'),
    'adler_side_text' => ['exclude' => true, 'label' => 'Seitenbereich: Text / Liste', 'config' => ['type' => 'text', 'enableRichtext' => true]],
    'adler_preset_destination' => $input('Vorausgefülltes Fahrtziel (optional, bei Flughafen-Rückrichtung als Abholort)'),
    'adler_tertiary_label' => $input('Dritte Schaltfläche: Beschriftung'),
    'adler_tertiary_link' => $link('Dritte Schaltfläche: Ziel'),
    'adler_eyebrow' => $input('Kleine Überschrift / Kicker'),
    'adler_accent' => $input('Hervorgehobene zweite Überschrift'),
    'adler_anchor' => $input('Sprungmarke (ohne #)', ['eval' => 'trim,alphanum_x', 'max' => 80]),
    'adler_note' => ['exclude' => true, 'label' => 'Hinweis unter dem Inhalt', 'config' => ['type' => 'text', 'rows' => 3]],
    'adler_primary_label' => $input('Erste Schaltfläche / Bereich: Beschriftung'),
    'adler_primary_link' => $link('Erste Schaltfläche: Ziel'),
    'adler_secondary_label' => $input('Zweite Schaltfläche / Bereich: Beschriftung'),
    'adler_secondary_link' => $link('Zweite Schaltfläche: Ziel'),
    'adler_phone' => $input('Festnetznummer (mit Landes- oder Ortsvorwahl)'),
    'adler_mobile' => $input('Mobilnummer (mit Landes- oder Ortsvorwahl)'),
    'adler_email' => $input('E-Mail-Adresse', ['eval' => 'trim,email']),
    'adler_address' => ['exclude' => true, 'label' => 'Anschrift', 'config' => ['type' => 'text', 'rows' => 2]],
    'adler_hours' => $input('Erreichbarkeit / Servicezeiten'),
    'adler_whatsapp' => $link('WhatsApp-Chat-Link'),
    'adler_source_label' => $input('Bewertungsquelle: Beschriftung'),
    'adler_source_link' => $link('Bewertungsquelle: Link'),
    'adler_rating' => ['exclude' => true, 'label' => 'Gesamtbewertung (1 bis 5)', 'config' => ['type' => 'number', 'format' => 'decimal', 'range' => ['lower' => 1, 'upper' => 5], 'default' => 5]],
    'adler_count' => ['exclude' => true, 'label' => 'Anzahl Bewertungen', 'config' => ['type' => 'number', 'range' => ['lower' => 0], 'default' => 0]],
    'adler_autoplay' => ['exclude' => true, 'label' => 'Bewertungen automatisch wechseln', 'config' => ['type' => 'check', 'default' => 1]],
    'adler_interval' => ['exclude' => true, 'label' => 'Wechselintervall in Millisekunden', 'config' => ['type' => 'number', 'range' => ['lower' => 3000, 'upper' => 30000], 'default' => 5000]],
    'adler_theme' => ['exclude' => true, 'label' => 'Hintergrund', 'config' => ['type' => 'select', 'renderType' => 'selectSingle', 'items' => [['label' => 'Hell', 'value' => 'light'], ['label' => 'Creme', 'value' => 'cream'], ['label' => 'Dunkel', 'value' => 'dark']], 'default' => 'light']],
    'adler_form' => ['exclude' => true, 'label' => 'Formular (im Modul Formulare bearbeitbar)', 'description' => 'Felder, Pflichtangaben, Bestätigung und E-Mail-Empfänger werden zentral im TYPO3-Formular bearbeitet.', 'config' => ['type' => 'select', 'renderType' => 'selectSingle', 'items' => [['label' => 'Formular auswählen', 'value' => '']], 'itemsProcFunc' => \Waldbyte\Adler\Backend\FormOptions::class . '->items', 'required' => true]],
    'adler_items' => ['exclude' => true, 'label' => 'Einträge (sortierbar)', 'config' => ['type' => 'inline', 'foreign_table' => 'tx_adler_item', 'foreign_field' => 'parent', 'foreign_sortby' => 'sorting', 'appearance' => ['collapseAll' => true, 'useSortable' => true, 'showSynchronizationLink' => true, 'showAllLocalizationLink' => true, 'enabledControls' => ['localize' => true], 'newRecordLinkTitle' => 'Eintrag hinzufügen'], 'behaviour' => ['enableCascadingDelete' => true]]],
];
$fields['adler_layout']['config']['items'][] = ['label' => 'Leistungs-Merkmale', 'value' => 'highlights'];
$fields['adler_layout']['onChange'] = 'reload';
EMU::addTCAcolumns('tt_content', $fields);
foreach (require dirname(__DIR__, 2) . '/ContentTypes.php' as $suffix => [$label, $showitem, $childType]) {
    $type = 'adler_' . $suffix;
    $overrides = ['bodytext' => ['config' => ['enableRichtext' => true, 'richtextConfiguration' => 'default']], 'assets' => ['config' => ['maxitems' => 1, 'allowed' => 'common-image-types']]];
    $layoutModes = match ($suffix) {
        'cards' => ['default','services','places','values','related'],
        'split' => ['default','benefits','editorial','service','airport-routes','airport-price','airport-family','airport-local'],
        'pagehero' => ['default','service','contact','airport','legal'],
        'form' => ['default','airport'],
        'text' => ['default','highlights'],
        default => [],
    };
    if ($layoutModes) {
        $overrides['adler_layout']['config']['items'] = array_values(array_filter($fields['adler_layout']['config']['items'], static fn(array $item) => in_array($item['value'],$layoutModes,true)));
    }
    if (in_array($suffix,['pagehero','form'],true)) {
        foreach (['adler_side_header','adler_side_text'] as $field) { $overrides[$field]['displayCond'] = 'FIELD:adler_layout:=:airport'; }
    }
    if ($suffix === 'pagehero') { $overrides['adler_source_label']['displayCond'] = 'FIELD:adler_layout:=:airport'; }
    if ($suffix === 'pagehero') { $overrides['adler_items']['displayCond'] = 'FIELD:adler_layout:=:airport'; }
    if ($suffix === 'cards') {
        $overrides['adler_theme']['displayCond'] = 'FIELD:adler_layout:IN:default,services,places';
        $overrides['adler_note']['displayCond'] = 'FIELD:adler_layout:=:services';
        foreach (['adler_primary_label','adler_primary_link'] as $field) { $overrides[$field]['displayCond'] = 'FIELD:adler_layout:IN:services,related'; }
    }
    if ($suffix === 'split') {
        $overrides['adler_theme']['displayCond'] = 'FIELD:adler_layout:IN:default,benefits,editorial';
        $overrides['adler_side_header']['displayCond'] = 'FIELD:adler_layout:IN:service,airport-price,airport-local';
        $overrides['adler_side_text']['displayCond'] = 'FIELD:adler_layout:IN:service,airport-local';
        $overrides['adler_note']['displayCond'] = 'FIELD:adler_layout:IN:benefits,airport-family';
        $overrides['assets']['displayCond'] = 'FIELD:adler_layout:IN:default,editorial,benefits,airport-family';
        $overrides['adler_items']['displayCond'] = 'FIELD:adler_layout:IN:default,editorial,benefits,airport-routes,airport-price,airport-local';
    }
    if ($childType !== null) {
        $overrides['adler_items']['config']['overrideChildTca'] = ['columns' => ['item_type' => ['config' => ['default' => $childType]]], 'types' => ['0' => ['showitem' => 'title']]];
    }
    $extraFields = match ($suffix) {
        'cards','text' => 'adler_layout',
        'split' => 'adler_layout,adler_side_header,adler_side_text',
        'pagehero' => 'adler_layout,adler_side_header,adler_side_text,adler_source_label',
        'form' => 'adler_layout,adler_side_header,adler_side_text,adler_preset_destination',
        'cta' => 'adler_tertiary_label,adler_tertiary_link',
        'hero' => 'adler_source_label,adler_source_link,adler_note',
        default => '',
    };
    if ($extraFields !== '') { $showitem .= ',' . $extraFields; }
    EMU::addRecordType(['label' => $label, 'value' => $type, 'icon' => 'content-text', 'group' => 'default'],
        $showitem . ',--div--;Darstellung,adler_anchor,--div--;core.form.tabs:language,--palette--;;language,--div--;core.form.tabs:access,--palette--;;hidden,--palette--;;access', ['columnsOverrides' => $overrides]);
}
