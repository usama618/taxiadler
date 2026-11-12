-- Replace the old business experience claim without changing other wording.
SET @old_years = _utf8mb4'20 (?=[Jj][Aa][Hh][Rr])' COLLATE utf8mb4_unicode_ci;
START TRANSACTION;
UPDATE tt_content
SET header=REGEXP_REPLACE(header, @old_years, '15 '),
    subheader=REGEXP_REPLACE(subheader, @old_years, '15 '),
    bodytext=REGEXP_REPLACE(bodytext, @old_years, '15 '),
    adler_eyebrow=REGEXP_REPLACE(adler_eyebrow, @old_years, '15 '),
    adler_note=REGEXP_REPLACE(adler_note, @old_years, '15 '),
    adler_accent=REGEXP_REPLACE(adler_accent, @old_years, '15 '),
    adler_side_header=REGEXP_REPLACE(adler_side_header, @old_years, '15 '),
    adler_side_text=REGEXP_REPLACE(adler_side_text, @old_years, '15 '),
    adler_primary_label=REGEXP_REPLACE(adler_primary_label, @old_years, '15 '),
    adler_secondary_label=REGEXP_REPLACE(adler_secondary_label, @old_years, '15 '),
    adler_tertiary_label=REGEXP_REPLACE(adler_tertiary_label, @old_years, '15 ')
WHERE deleted=0 AND CONCAT_WS(' ',header,subheader,bodytext,adler_eyebrow,adler_note,adler_accent,adler_side_header,adler_side_text,adler_primary_label,adler_secondary_label,adler_tertiary_label) REGEXP @old_years;

UPDATE tx_adler_item
SET title=REGEXP_REPLACE(title, @old_years, '15 '),
    description=REGEXP_REPLACE(description, @old_years, '15 '),
    eyebrow=REGEXP_REPLACE(eyebrow, @old_years, '15 '),
    link_label=REGEXP_REPLACE(link_label, @old_years, '15 ')
WHERE deleted=0 AND CONCAT_WS(' ',title,description,eyebrow,link_label) REGEXP @old_years;

UPDATE pages
SET title=REGEXP_REPLACE(title, @old_years, '15 '),
    description=REGEXP_REPLACE(description, @old_years, '15 '),
    seo_title=REGEXP_REPLACE(seo_title, @old_years, '15 '),
    nav_title=REGEXP_REPLACE(nav_title, @old_years, '15 '),
    subtitle=REGEXP_REPLACE(subtitle, @old_years, '15 '),
    abstract=REGEXP_REPLACE(abstract, @old_years, '15 '),
    og_title=REGEXP_REPLACE(og_title, @old_years, '15 '),
    og_description=REGEXP_REPLACE(og_description, @old_years, '15 '),
    twitter_title=REGEXP_REPLACE(twitter_title, @old_years, '15 '),
    twitter_description=REGEXP_REPLACE(twitter_description, @old_years, '15 ')
WHERE deleted=0 AND CONCAT_WS(' ',title,description,seo_title,nav_title,subtitle,abstract,og_title,og_description,twitter_title,twitter_description) REGEXP @old_years;
COMMIT;
