# Taxi Adler Rastatt — Premium Motion Website (React + Tailwind)

A multipage **frontend mockup** of the Taxi Adler website for later implementation in TYPO3. The existing cinematic homepage, full-screen hero, booking preview, vehicle pictures and charcoal/cream/gold design are retained. Shared service content, supporting pages and navigation complete the visitor journey. This is not a deployed booking system or a production SEO implementation.

A separate local **TYPO3 14 implementation** now lives in `typo3/`, at https://taxi-adler.ddev.site/. It has 13 imported pages, 15 reusable content types, editable inline items, FAL media and a native database-backed form. See `typo3/README.md` and `typo3/EDITOR-GUIDE.md`. The React mockup remains the independent reference: its form is still a preview, while the TYPO3 form submits to local Mailpit. Neither site has been deployed publicly.

## Pages and content

- `/`: existing homepage with updated service summaries, FAQs and contact details.
- `/services/`: service overview linking to six detailed service pages.
- `/flughafentransfer-karlsruhe-baden-baden/`: dedicated FKB landing page for transfers from Karlsruhe, Baden-Baden, Rastatt and nearby areas. Includes approved “Preis auf Anfrage,” larger-group enquiries, outbound/return form defaults, airport-specific FAQs and prominent calls. One larger vehicle accommodates six passengers, but this is not a group-size limit. The form has no passenger selector; group size can be included in optional notes. Research and TYPO3 handover are in `FLUGHAFENTRANSFER-FKB.md`.
- `/leistungen/flughafenfahrten/`, `/leistungen/krankenfahrten/`, `/leistungen/dialyse-bestrahlungsfahrten/`, `/leistungen/stadt-regionalfahrten/`, `/leistungen/serien-rechnungsfahrten/`, `/leistungen/besorgungen-starthilfe/`: detailed service information, preparation checklists, FAQs and preselected inquiry links.
- `/ueber-uns/`: company introduction, personal service and vehicle options.
- `/kontakt/`: phone, mobile, email, address, external directions link and inquiry preview.
- `/impressum/`: complete legal text copied from the live website, unchanged.
- `/datenschutz/`: complete privacy text copied from the live website, with only the approved change from Ottersdorfer str.15 to Rauentaler Straße 45, Eingang A.

`src/content.js` is the shared source for business and service information. The confirmed address is **Rauentaler Straße 45, Eingang A, 76437 Rastatt**. Insurance coverage, direct billing, invoicing arrangements and special transport requirements are expressed as matters to confirm personally, not guarantees. No testimonials, prices or company-history claims were invented.

WhatsApp contact links use the existing mobile number **0151 4655 7964** via `business.whatsappUrl`. They appear on the homepage, contact page, shared footer and mobile contact bar. These are plain external chat links, not an embedded widget: no message is sent and no form data is transferred automatically. Urgent enquiries should still be made by phone.

The shared Zahlungsarten strip reproduces the live homepage's eight original logo files, unchanged and in the same order: EC-Karte, Visa, Mastercard, Sofortüberweisung, giropay, Visa Electron, Maestro and cash. Assets are bundled in `public/images/payments/`, not hotlinked. This copies the legacy site's presentation only; confirm the currently supported payment methods before launch, especially legacy payment brands. No payment processing is implemented.

The supplied **Rastatt Taxi Adler eagle logo** is used in the shared header and footer at `public/images/taxi-adler-eagle-logo.png`, replacing the earlier Taxi Rastatter artwork. The original PNG is unchanged; responsive sizing preserves the complete 3:2 image without cropping the eagle or text. This resolves the earlier logo/business-name mismatch.

The owner confirmed **20 years of service**; this is highlighted in the hero, company copy, footer and airport page without inventing a founding year. The homepage Google-review section uses six short original German excerpts verified in Chrome, with source links. Its **5.0 / 13 reviews** snapshot was read on **7 November 2026**; the verification date is retained internally but not displayed. It is not an automatically updating feed or a verified-purchase claim. The carousel displays three cards on desktop, two on tablet and one on mobile, advances every five seconds and provides arrows, position buttons, touch scrolling and a pause control. Automatic rotation pauses on hover/focus, outside the viewport and in hidden tabs; reduced-motion preferences disable autoplay. Review data lives in `src/reviews.js`. No review structured data was added.

The detailed SEO/competitor assessment and TYPO3 launch priorities are in `SEO-AUDIT-2026-11-07.md`. Run `npm run check:mockup` for programmatic page/link/content checks and a generated `output/seo-technical-snapshot.json`; this is not a ranking or Core Web Vitals measurement.

The legal-page copy lives in `src/legal-pages.json`. `node scripts/import-live-legal.mjs --use-current-address` imports the public WordPress text, removes layout markup and applies the approved privacy address correction. Source hashes and explicit edit records let `npm run check:mockup` verify that no other wording changed. These are copies of the existing legal documents, not a legal review or confirmation that their clauses describe the future TYPO3 implementation. No live-site content was changed.

Routing is deliberately lightweight and uses normal links plus pathname selection under the Vite mockup server. A service inquiry link uses `/?leistung=<service-id>#buchen` to select the relevant service. The FKB page has browser-level title/description fields for handover, but no backend, sitemap, canonical tags, structured data, server rendering or production redirects were added; these belong to the later TYPO3 implementation.

## What's new in this edition

- Three entirely new local SVG illustrations in `public/images/step-*.svg` showing a map route, trip-request checklist, and direct phone coordination.
- Larger, darker type throughout — especially in the process cards, service descriptions, booking labels, FAQs, trust content and footer.
- Three premium, independent cards with icon badges, artwork, staggered scroll reveals, an animated connecting route line, soft gold highlights and hover lift/zoom/sheens.
- Additional refined motion: scroll-progress indicator, smooth button shine, golden hero headline treatment, polished field focus, animated booking accent, image-backed service-card reveals and hovers, slow photographic pan, animated FAQ answers, benefit-row microinteractions and a back-to-top control.
- Mobile and tablet breakpoints refined, including a one-column steps layout and readable descriptive text.
- Honors `prefers-reduced-motion`; no animation library is required.

## Download, extract and run on Windows (PowerShell)

**1. Download** `Taxi_Adler_Premium_Motion_2026_React.zip` to the Downloads folder.

**2. Extract** to a new directory (the ZIP contains the files at its root, not inside an extra folder):

```powershell
$zip = Get-ChildItem "$env:USERPROFILE\Downloads" -Filter "Taxi_Adler_Premium_Motion_2026_React*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
Expand-Archive -LiteralPath $zip.FullName -DestinationPath "D:\Taxi_Adler_Premium_Motion_2026" -Force
```

**3. Open the correct directory:**

```powershell
cd "D:\Taxi_Adler_Premium_Motion_2026"
Test-Path .\package.json
```

`Test-Path` **must show `True`**. Do not run npm until it does.

**4. Install and run:**

```powershell
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173/`.

Optionally open the project in Visual Studio Code using `code .` from the same folder.

Build for deployment (after npm install): `npm run build`; output is `dist/`.

## Project structure

| File | Purpose |
| --- | --- |
| `src/App.jsx` | Shared header/footer, existing homepage, page selection, booking form and review modal |
| `src/content.js` | Shared business details, service descriptions, page paths and inquiry links |
| `src/Pages.jsx` | Inner-page layouts and content |
| `src/legal-pages.json` | Complete copied legal text, source hashes and the approved address edit |
| `scripts/import-live-legal.mjs` | Reproducible import from the live legal pages |
| `src/pages.css` | Inner-page styles extending the existing design without duplicating homepage styles |
| `src/styles.css` | Existing layout and responsive foundation retained from the cinematic website |
| `src/premium.css` | **New premium motion system and contrast improvements**; loaded after styles.css |
| `public/images/taxi-adler-mercedes-hero.webp` | Homepage banner generated using the owner's actual Mercedes photo as the vehicle reference; cinematic setting is illustrative |
| `public/images/taxi-adler-mercedes-fleet.webp` | Matching daytime E-Class visual based on the same owner photo; used in fleet, About and recurring-trip service views |
| `public/images/taxi-adler-hero.webp`, `public/images/taxi-adler-contact.webp` | Earlier images preserved but no longer referenced by the site; dark contact backgrounds use the new Mercedes hero |
| `public/images/step-route.svg` | Local route illustration |
| `public/images/step-check.svg` | Local trip-details illustration |
| `public/images/step-call.svg` | Local contact illustration |
| `public/images/service-*.svg` | Bundled visual fallbacks for all service cards |
| `index.html` | German metadata and Google font links |

The service cards currently use external Unsplash photos with **locally bundled fallback artwork** when an image fails to load. For a real deployment, replace these with verified photos of Taxi Adler vehicles/services that you are licensed to use.

## Booking form is a prototype

**The form does not send any information or confirm a booking.** It provides client-side validation, a review modal, a copyable request summary and a working call button. A real booking workflow will require a secure server-side endpoint, authentication/anti-spam, GDPR-compliant privacy details, confirmation handling and Taxi Adler's approval. Do not advertise the form as a working booking system until the backend is connected.

**Phone currently used in prototype:** `07222 9011511`. Verify operator details and any claims before launch. The privacy link opens the copied live privacy policy with the approved address correction. Legal documents, third-party services and consent wording still require review for the final TYPO3 implementation; retaining a clause does not add the service it describes.

## Design notes

The site is independently designed with editorial photography, charcoal/cream/gold colors and restrained motion inspired by premium mobility websites. It is not a reproduction of Addison Lee or Wheely. Three-step illustrations are self-contained SVGs and can be recolored or replaced at any time. Interactive visuals use CSS and an IntersectionObserver rather than additional animation dependencies.

**Verification:** `npm run build` succeeds. The page rendering, internal links, fragment targets and six inquiry selections have been checked programmatically. Browser-based visual verification is still required on desktop and mobile before the TYPO3 handover.
