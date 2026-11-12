<?php
declare(strict_types=1);
$input = json_decode(stream_get_contents(STDIN), true, flags: JSON_THROW_ON_ERROR);
$doc = new DOMDocument();
@$doc->loadHTML('<?xml encoding="UTF-8">' . $input['html'], LIBXML_NONET);
$xp = new DOMXPath($doc);
$result = [];
foreach ($input['queries'] as $key => $query) {
    $result[$key] = [];
    foreach ($xp->query($query) as $node) {
        $html = '';
        foreach ($node->childNodes as $child) { $html .= $doc->saveHTML($child); }
        $result[$key][] = [
            'text' => trim(preg_replace('/\s+/u', ' ', $node->textContent)),
            'html' => preg_replace('/\s+(?:class|style|id|aria-[\w-]+|data-[\w-]+)="[^"]*"/u', '', strip_tags($html, '<p><strong><em><h3><h4><ul><ol><li><a><br><small>')),
        ];
    }
}
echo json_encode($result, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
