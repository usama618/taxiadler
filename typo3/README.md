# Taxi Adler TYPO3

Local TYPO3 14.3.10 installation, separate from the retained React mockup. Uses DDEV, PHP 8.4, MariaDB 10.11, Composer, native TCA, Fluid and sortable inline child records, following the workspace's DPF/newhobby3 project pattern. The frontend does not depend on React or Vite.

- Website: https://taxi-adler.ddev.site/
- Backend: https://taxi-adler.ddev.site/typo3/
- Mailpit: https://taxi-adler.ddev.site:8026/
- Local administrator credentials: `.local-credentials` (Git-ignored, mode 0600).
- Editor instructions: `EDITOR-GUIDE.md`.

## Start Existing Installation

Run in this directory:

```sh
ddev start
ddev composer install
ddev exec vendor/bin/typo3 asset:publish
```

Do not rerun TYPO3 setup on an existing database. The original mockup remains in the parent directory and can be run independently with `npm run dev` there.

## Content Architecture

`packages/site_package` contains the editable content model, TCA, SQL schema, data processor, Fluid templates, site set, CSS and framework-free frontend JavaScript. `config/sites/main/config.yaml` selects `waldbyte/adler` and the German frontend language.

Fifteen custom content types cover global header/footer, homepage hero, page hero, cards, text/image sections, vehicles, process steps, FAQs, review carousel, contact CTA, inquiry form, contact details, editorial/legal text and payment logos. Eight inline item types expose their relevant fields rather than a JSON blob or raw HTML page. TYPO3's normal reference/shortcut element can reuse existing content elsewhere.

Media are FAL records in `fileadmin/adler/`. Images can be replaced and cropped with normal media controls. The two E-Class visuals use the owner's photograph as the vehicle reference; the Touran remains illustrative. Original payment logos and complete legal wording are retained, including the approved address correction.

Header/footer live in columns 91/92 on the root page; normal page content uses column 0. Contact blocks and the mobile contact bar read business details from the root header. Global records use TYPO3's content queries so visibility, translations and cache dependencies apply.

## Forms

The inquiry form uses TYPO3 v14's native `form_definition` database storage, not read-only extension YAML. Editors choose it by name and edit fields, validation, recipients and confirmation in the Forms module. The YAML in `seed/` is the initial import source only.

Forms render through uncached `COA_INT` with an Extbase context, unique instance identifiers, signed state and core honeypot protection. Required values, email, text lengths, time and consent are validated server-side. Destination and passenger count are optional, and the passenger selector includes an option for more than six people.

All DDEV email is captured by Mailpit through `config/system/additional.php`. No real taxi booking is automatically confirmed. Production mail, anti-abuse policy, privacy review and operator approval remain launch requirements.

## Import And Verification

The initial import created 13 pages and 84 custom elements. The installer demo is hidden, not deleted. `adler:import` refuses to overwrite existing Adler content. Back up the database and `fileadmin/`; seed JSON is not a backup of editor changes.

For a fresh installation, after TYPO3 setup:

```sh
# From parent directory: export initial content/media; existing media are not overwritten.
node scripts/export-typo3.mjs
# From this directory:
ddev exec vendor/bin/typo3 extension:setup
ddev exec vendor/bin/typo3 adler:import
ddev exec vendor/bin/typo3 setup:begroups:default --no-interaction
ddev exec vendor/bin/typo3 adler:editor-role
ddev exec vendor/bin/typo3 asset:publish
ddev exec vendor/bin/typo3 cache:flush
```

Do not use `--repair-initial-order` after editors rearrange sections; it deliberately restores seed order. `--install-form` migrates only legacy seeded form references and retains an existing database form.

Checks in this directory:

```sh
ddev composer validate --strict
ddev exec vendor/bin/typo3 adler:audit
ddev exec vendor/bin/typo3 adler:audit --exercise-fields
```

The field exercise is restricted to local Development. It temporarily changes imported records through DataHandler, checks HTTP output, then restores values in `finally` blocks. Do not run it while an editor changes the same records. It covers 15 custom types, child editing forms, non-admin field access, visibility, links, anchors, themes, ratings, carousel settings, text and image replacement.

From the parent directory:

```sh
node scripts/audit-typo3.mjs
node scripts/test-typo3-form.mjs
```

The first checks all routes, internal links/anchors, assets, IDs, H1s, required fields, review/payment counts and exact legal text. The second posts invalid/valid synthetic data and checks rejection, confirmation and Mailpit delivery. It leaves a marked test email in local Mailpit, never sends external email, and writes reports under the parent's `output/`.

## Handover And Limits

This is local CMS implementation, not live deployment. A subsequent Chrome comparison restored photographic service cards, the hero rating and icons, original section layouts, process illustrations, the four-column footer, contact-page hierarchy and omitted airport/service/about content. Desktop and 390px mobile checks were performed; screenshot evidence is in the parent's `output/comparison/`. Small typography, crop and form differences remain; this is not pixel-identical visual QA. The native form intentionally submits locally rather than copying the mockup's non-sending preview dialog.

Before release: approve visual layout, verify payment methods/review totals, review privacy/legal text, configure production mail, restrict backend access, change site base, remove the deliberate `noindex,nofollow` header from the site set, verify image rights and configure migration redirects. DM Sans and Manrope are served locally with their OFL licenses. No tracking or embedded WhatsApp/review widget was added.

## Consent And WhatsApp

`packages/cookie_consent` is the local workspace consent extension, adapted for this site. It is installed with Composer and activated through the Adler site-set dependency. Site settings expose the banner text, privacy link, consent version and optional service categories. No optional services are configured, so the banner currently shows only necessary functions. Preferences persist for 180 days; the lower-left control reopens them. Future optional scripts must use `type="text/plain"` with `data-cookieconsent` and must not load through ordinary script tags first. Third-party cookie cleanup and provider-specific consent integration must be implemented when actual services are added.

`packages/whatsapp_sticky` is a reusable extension based on the DPF site's floating-link pattern. It reads the global root-header WhatsApp URL and loads no third-party script. The lower-right control sits above the mobile contact bar; the duplicate WhatsApp button was removed from that bar. Its accessible label is a site setting.

## Design Migration

The design upgrade is an explicit Development-only migration, not a recurring content synchronizer. `node scripts/upgrade-typo3-design.mjs` in the parent prepares `seed/design-upgrade.json` from the mockup. `ddev exec vendor/bin/typo3 adler:upgrade-design` adds omissions through DataHandler, preserves edited values when they differ from known seed/previous values and retains extra editor entries. Custom section order is retained when detected. A pre-upgrade database backup is `.design-before.sql.gz` (ignored). Do not regenerate or rerun migration plans after editors begin ongoing content maintenance without reviewing the diff and taking a new backup.

Docker recovery removed only the inactive `ddev-dpf-reinigung_default` network. DPF containers and database volume were preserved; no project container, database volume, image or source directory was deleted. DDEV recreates project networks on startup.
