<?php
declare(strict_types=1);

// Each element exposes only fields that its Fluid template consumes.
return [
    'header' => ['Website-Kopf (global)', 'header,assets,adler_phone,adler_mobile,adler_email,adler_address,adler_hours,adler_whatsapp,adler_primary_label,adler_primary_link,adler_items', 'link'],
    'footer' => ['Website-Fuß (global)', 'header,bodytext,assets,adler_primary_label,adler_secondary_label,adler_note,adler_items', 'link'],
    'hero' => ['Großes Startseiten-Banner', 'adler_eyebrow,header,adler_accent,bodytext,assets,adler_primary_label,adler_primary_link,adler_secondary_label,adler_secondary_link,adler_items', 'stat'],
    'pagehero' => ['Seiten-Banner', 'adler_eyebrow,header,adler_accent,bodytext,assets,adler_note,adler_primary_label,adler_primary_link,adler_secondary_label,adler_secondary_link,adler_items', 'stat'],
    'cards' => ['Leistungskarten / Bildergalerie', 'adler_eyebrow,header,adler_accent,bodytext,adler_theme,adler_note,adler_primary_label,adler_primary_link,adler_items', 'card'],
    'split' => ['Text & Bild / Vorteile', 'adler_eyebrow,header,adler_accent,bodytext,assets,adler_theme,adler_note,adler_primary_label,adler_primary_link,adler_secondary_label,adler_secondary_link,adler_items', 'stat'],
    'vehicles' => ['Fahrzeuge / Bildkarten', 'adler_eyebrow,header,bodytext,adler_primary_label,adler_primary_link,adler_note,adler_items', 'vehicle'],
    'steps' => ['Ablauf in Schritten', 'adler_eyebrow,header,adler_accent,bodytext,adler_note,adler_primary_label,adler_primary_link,adler_items', 'step'],
    'faq' => ['Häufige Fragen', 'adler_eyebrow,header,adler_accent,bodytext,adler_primary_label,adler_primary_link,adler_items', 'faq'],
    'reviews' => ['Bewertungen-Karussell', 'adler_eyebrow,header,adler_accent,bodytext,adler_note,adler_rating,adler_count,adler_source_label,adler_source_link,adler_autoplay,adler_interval,adler_items', 'review'],
    'cta' => ['Kontakt-Banner', 'adler_eyebrow,header,adler_accent,bodytext,assets,adler_primary_label,adler_primary_link,adler_secondary_label,adler_secondary_link', null],
    'form' => ['Fahrtanfrage-Formular', 'adler_eyebrow,header,adler_accent,bodytext,adler_form,adler_note,adler_items', 'stat'],
    'contact' => ['Kontaktinformationen', 'header,bodytext,adler_primary_label,adler_secondary_label,adler_note', null],
    'text' => ['Redaktioneller Text / Rechtstext', 'adler_eyebrow,header,adler_accent,bodytext,adler_theme,adler_primary_label,adler_primary_link', null],
    'payments' => ['Zahlungsarten', 'header,adler_items', 'payment'],
];
