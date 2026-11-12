-- Run after extension:setup and after the banner files have been indexed.
UPDATE sys_file_metadata m JOIN sys_file f ON f.uid=m.file
SET m.adler_image_origin='generated'
WHERE f.identifier IN (
  '/adler/taxi-adler-mercedes-hero.webp',
  '/adler/taxi-adler-mercedes-fleet.webp',
  '/adler/taxi-vw-touran-black.webp',
  '/adler/taxi-adler-dialyse-anfahrt-v2.webp'
) AND m.adler_image_origin='';

UPDATE sys_file_metadata m JOIN sys_file f ON f.uid=m.file
SET m.adler_image_origin='edited'
WHERE f.identifier IN ('/adler/rastatt-bahnhof-enhanced.webp', '/adler/rastatt-schloss-enhanced.webp')
AND m.adler_image_origin='';
