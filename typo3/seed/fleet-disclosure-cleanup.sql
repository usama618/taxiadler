-- Remove the legacy duplicate wording without overwriting editor changes.
UPDATE tx_adler_item i JOIN tt_content c ON c.uid = i.parent
SET i.description = ''
WHERE c.CType = 'adler_vehicles' AND c.deleted = 0 AND i.deleted = 0
  AND i.description = '<p>KI-Visualisierung auf Basis unseres Fahrzeugfotos.</p>';

UPDATE tt_content
SET adler_note = SUBSTRING(adler_note, CHAR_LENGTH('Fahrzeugabbildungen illustrativ. ') + 1)
WHERE CType = 'adler_vehicles' AND deleted = 0
  AND adler_note LIKE 'Fahrzeugabbildungen illustrativ. %';
