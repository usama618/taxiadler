-- Run extension:setup --extension=site_package first to add submenu_pages.
-- Initial navigation selection only. Do not overwrite a later editor selection.
-- Edit/order these pages in the global header's Leistungen entry in TYPO3.
UPDATE tx_adler_item
SET submenu_pages='11,6,7,8,9,10'
WHERE uid=1 AND title='Leistungen' AND deleted=0 AND submenu_pages='';
