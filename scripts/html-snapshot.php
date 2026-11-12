<?php
declare(strict_types=1);
$html = stream_get_contents(STDIN);
$doc = new DOMDocument();
@$doc->loadHTML('<?xml encoding="UTF-8">' . $html, LIBXML_NONET);
$xp = new DOMXPath($doc);
$values = static function(string $expression, ?string $attribute = null) use ($xp): array {
    $result = [];
    foreach ($xp->query($expression) as $node) { $result[] = $attribute === null ? preg_replace('/\s+/u', ' ', trim($node->textContent)) : $node->getAttribute($attribute); }
    return $result;
};
$forms = [];
foreach ($xp->query('//form') as $form) {
    $controls = [];
    foreach ($xp->query('.//input|.//textarea|.//select|.//button', $form) as $node) {
        $controls[] = ['tag' => $node->nodeName, 'type' => $node->getAttribute('type'), 'name' => $node->getAttribute('name'), 'value' => $node->getAttribute('value'), 'id' => $node->getAttribute('id'), 'required' => $node->hasAttribute('required')];
    }
    $forms[] = ['action' => $form->getAttribute('action'), 'controls' => $controls];
}
$fragment = new DOMDocument();
if (getenv('HTML_FRAGMENT')) {
    echo json_encode(['text' => $values('//body')[0] ?? ''], JSON_THROW_ON_ERROR); exit;
}
echo json_encode([
    'title' => $values('//title'), 'h1' => $values('//h1'), 'ids' => $values('//*[@id]', 'id'),
    'links' => $values('//a[@href]', 'href'), 'images' => $values('//img[@src]', 'src'),
    'assets' => [...$values('//script[@src]', 'src'), ...$values('//link[@rel="stylesheet"]', 'href')],
    'legalText' => $values('//div[contains(concat(" ",normalize-space(@class)," ")," cms-text ")]'),
    'forms' => $forms,
], JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
