<?php
declare(strict_types=1);
namespace Waldbyte\Adler\DataProcessing;

use TYPO3\CMS\Core\Resource\FileRepository;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3\CMS\Frontend\ContentObject\DataProcessorInterface;

final class ContentProcessor implements DataProcessorInterface
{
    public function __construct(private readonly FileRepository $files) {}

    public function process(ContentObjectRenderer $cObj, array $contentObjectConfiguration, array $processorConfiguration, array $processedData): array
    {
        $data = $processedData['data'] ?? $cObj->data;
        $root = $cObj->getRequest()->getAttribute('site')->getRootPageId();
        $processedData['siteRoot'] = $root;
        $currentPage = (int)($cObj->getRequest()->getAttribute('frontend.page.information')?->getPageRecord()['uid'] ?? 0);
        $processedData['pageTitle'] = $cObj->getRequest()->getAttribute('frontend.page.information')?->getPageRecord()['title'] ?? '';
        $global = $cObj->getRecords('tt_content', ['pidInList' => (string)$root, 'where' => "CType='adler_header' AND colPos=91", 'orderBy' => 'sorting', 'max' => '1']);
        $site = $global[0] ?? [];
        foreach (['phone', 'mobile'] as $field) {
            $number = preg_replace('/[^0-9+]/', '', (string)($site['adler_' . $field] ?? ''));
            $site[$field . 'Href'] = $number !== '' ? 'tel:' . (str_starts_with($number, '0') ? '+49' . substr($number, 1) : $number) : '';
        }
        $processedData['siteHeader'] = $site;
        if (!empty($data['uid'])) {
            $uid = (int)($data['_LOCALIZED_UID'] ?? $data['uid']);
            $processedData['files'] = $this->files->findByRelation('tt_content', 'assets', $uid);
            $processedData['imageDisclosure'] = self::imageDisclosure(($processedData['files'][0] ?? null)?->getProperties() ?? []);
            $processedData['stationHeroCredit'] = self::isStationPhoto($processedData['files'][0] ?? null);
            $items = $cObj->getRecords('tx_adler_item', ['pidInList' => (string)(int)$data['pid'], 'where' => 'parent=' . (int)$data['uid'], 'orderBy' => 'sorting']);
            foreach ($items as &$item) {
                $references = $this->files->findByRelation('tx_adler_item', 'image', (int)($item['_LOCALIZED_UID'] ?? $item['uid']));
                $item['imageFile'] = $references[0] ?? null;
                $item['imageDisclosure'] = self::imageDisclosure($item['imageFile']?->getProperties() ?? []);
                if (($data['adler_layout'] ?? '') === 'services' && self::isStationPhoto($item['imageFile'])) {
                    $processedData['stationGridCredit'] = true;
                }
                if (($data['CType'] ?? '') === 'adler_header' && !empty($item['submenu_pages'])) {
                    $pageIds = array_values(array_unique(array_filter(array_map('intval', explode(',', $item['submenu_pages'])), static fn(int $id): bool => $id > 0)));
                    $item['submenu'] = [];
                    if ($pageIds) {
                        // Normal frontend restrictions exclude hidden, expired and inaccessible pages.
                        $pages = $cObj->getRecords('pages', ['pidInList'=>(string)$root, 'where'=>'uid IN (' . implode(',', $pageIds) . ')']);
                        $pagesById = array_column($pages, null, 'uid');
                        foreach ($pageIds as $pageId) {
                            if (!isset($pagesById[$pageId])) { continue; }
                            $page = $pagesById[$pageId];
                            $item['submenu'][] = ['uid'=>$pageId,'title'=>$page['nav_title'] ?: $page['title'],'current'=>$currentPage === $pageId];
                        }
                    }
                }
            }
            $processedData['items'] = $items;
            $processedData['serviceImageDisclosure'] = in_array('KI-generiert', array_column($items, 'imageDisclosure'), true)
                || in_array('KI-bearbeitet', array_column($items, 'imageDisclosure'), true);
        }
        $processedData['ratingFormatted'] = number_format((float)($data['adler_rating'] ?? 0), 1, ',', '.');
        $processedData['formPath'] = (string)($data['adler_form'] ?? '');
        $processedData['primaryIsPhone'] = str_starts_with((string)($data['adler_primary_link']??''),'tel:');
        $secondary=(string)($data['adler_secondary_link']??'');
        $processedData['secondaryIcon'] = str_starts_with($secondary,'tel:') ? 'phone' : (str_contains($secondary,'wa.me/') ? 'whatsapp' : (str_contains($secondary,'#buchen') ? 'arrow-down' : 'arrow-up-right'));
        return $processedData;
    }

    private static function isStationPhoto(?\TYPO3\CMS\Core\Resource\FileReference $reference): bool
    {
        return $reference?->getOriginalFile()->getIdentifier() === '/adler/rastatt-bahnhof-enhanced.webp';
    }

    private static function imageDisclosure(array $properties): string
    {
        return match ($properties['adler_image_origin'] ?? '') {
            'generated' => 'KI-generiert',
            'edited' => 'KI-bearbeitet',
            default => '',
        };
    }
}
