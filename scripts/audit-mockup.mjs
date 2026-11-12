import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import postcss from 'postcss';
import { business, paymentMethods, resolvePage, services, serviceUrl } from '../src/content.js';
import { airportInquiryDefaults, airportTransfer } from '../src/airport.js';
import { googleReviews } from '../src/reviews.js';

const paths = ['/', '/services/', '/ueber-uns/', '/kontakt/', '/impressum/', '/datenschutz/', airportTransfer.path, ...services.map(serviceUrl)];
const legalPages = JSON.parse(readFileSync('src/legal-pages.json', 'utf8'));
const legalTextHash = html => createHash('sha256').update(html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()).digest('hex');
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const errors = [];
const pageResults = [];
let checkedLinks = 0;

try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const pages = new Map(paths.map(path => [path, renderToStaticMarkup(React.createElement(App, { pathname: path, search: '' }))]));
  for (const [path, html] of pages) {
    const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(match => match[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
    if (headings.length !== 1) errors.push(`${path}: expected one H1`);
    assert(html.includes(`href="${business.whatsappUrl}"`), `${path}: missing WhatsApp contact`);
    assert(!html.includes('/images/taxi-mercedes-e-klasse-2023-black.webp'), `${path}: outdated Mercedes image`);
    assert.equal(paymentMethods.length, 8);
    assert(html.includes('id="payment-methods-heading"'));
    for (const method of paymentMethods) assert(html.includes(`src="/images/payments/${method.file}"`), `${path}: missing payment logo ${method.name}`);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    if (new Set(ids).size !== ids.length) errors.push(`${path}: duplicate element IDs`);
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = match[1].replaceAll('&amp;', '&');
      if (!href.startsWith('/') && !href.startsWith('#')) continue;
      const url = new URL(href, `http://localhost:5173${path}`);
      const target = pages.get(url.pathname);
      if (!target) errors.push(`${path}: unresolved page ${href}`);
      else if (url.hash && !target.includes(`id="${url.hash.slice(1)}"`)) errors.push(`${path}: unresolved anchor ${href}`);
      checkedLinks++;
    }
    for (const match of html.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/g)) {
      if (match[1].startsWith('/') && !existsSync(`public${match[1]}`)) errors.push(`${path}: missing image ${match[1]}`);
    }
    pageResults.push({ path, type: resolvePage(path).type, headings, forms: (html.match(/<form\b/g) || []).length });
  }

  const home = pages.get('/');
  assert(readFileSync('src/styles.css', 'utf8').includes("background-image:url('/images/taxi-adler-mercedes-hero.webp')"));
  assert(existsSync('public/images/taxi-adler-mercedes-hero.webp'));
  assert(existsSync('public/images/taxi-adler-mercedes-fleet.webp'));
  for (const previous of ['taxi-mercedes-e-klasse-2023-black.webp', 'taxi-adler-hero.webp', 'taxi-adler-contact.webp']) {
    assert(!readFileSync('src/styles.css', 'utf8').includes(`/images/${previous}`), `Outdated Mercedes background: ${previous}`);
  }
  for (const path of ['/', '/ueber-uns/', '/services/', '/leistungen/serien-rechnungsfahrten/']) {
    assert(pages.get(path).includes('/images/taxi-adler-mercedes-fleet.webp'), `${path}: missing matching E-Class`);
  }
  assert.equal(new URL(business.whatsappUrl).pathname.slice(1), business.mobileHref.replace(/\D/g, ''));
  assert(!new URL(business.whatsappUrl).search, 'WhatsApp must not include form or personal data');
  assert(home.includes(`${business.yearsOfService} Jahre Erfahrung`));
  assert(home.includes('id="bewertungen"'));
  assert.equal((home.match(/class="google-review-card"/g) || []).length, 6);
  assert.equal(new Set(googleReviews.excerpts.map(review => review.author)).size, 6);
  assert(home.includes('aria-roledescription="Karussell"'));
  assert(home.includes('aria-label="Nächste Bewertungen"'));
  assert(home.includes('aus 13 Bewertungen'));
  assert(!home.includes('Stand:'));
  assert.equal(googleReviews.checkedAt, '2026-11-07');
  assert(!home.includes('application/ld+json'));
  assert.equal(googleReviews.rating, 5);
  assert.equal(googleReviews.count, 13);
  assert(googleReviews.excerpts.every(review => review.author && review.rating === 5 && review.url.startsWith('https://maps.app.goo.gl/')));
  for (const path of ['/', '/kontakt/', airportTransfer.path]) assert(!pages.get(path).includes('<select'));
  assert.equal(airportInquiryDefaults().destination, airportTransfer.airportName);
  assert.equal(airportInquiryDefaults('?richtung=ab-flughafen').pickup, airportTransfer.airportName);
  assert(pages.get(airportTransfer.path).includes('mehr als 6 Personen'));
  for (const [slug, legal] of Object.entries(legalPages)) {
    const rendered = pages.get(`/${slug}/`);
    assert(rendered.includes(legal.contentHtml), `${slug}: complete legal text must be rendered`);
    assert.equal(legalTextHash(legal.contentHtml), legal.copiedTextSha256, `${slug}: copied text changed`);
    assert(!/<(?:script|iframe|form|object)\b|\son\w+\s*=|\[\/?vc_/i.test(legal.contentHtml), `${slug}: unexpected active content or layout shortcode`);
    const edits = slug === 'datenschutz' ? [{ from: 'Ottersdorfer str.15', to: business.street }] : [];
    assert.deepEqual(legal.approvedEdits, edits, `${slug}: only the approved privacy address edit is allowed`);
    const restored = edits.reduce((html, edit) => {
      assert.equal(html.split(edit.to).length - 1, 1, `${slug}: expected one approved address replacement`);
      return html.replace(edit.to, edit.from);
    }, legal.contentHtml);
    assert.equal(legalTextHash(restored), legal.sourceTextSha256, `${slug}: wording differs from source beyond approved edits`);
    assert.equal(legal.textMatchesSource, edits.length === 0);
    assert(!/Ottersdorfer/i.test(legal.contentHtml));
  }
  for (const file of ['src/styles.css', 'src/premium.css', 'src/pages.css', 'src/airport.css', 'src/reviews.css']) postcss.parse(readFileSync(file, 'utf8'));

  const assets = readdirSync('public/images').filter(name => /\.(png|webp|jpe?g|svg)$/.test(name)).map(name => ({ path: `/images/${name}`, bytes: statSync(`public/images/${name}`).size })).sort((a, b) => b.bytes - a.bytes);
  const snapshot = {
    scope: 'Programmatic React rendering and source checks, not a browser, Google index, Lighthouse, backlink or Search Console audit.',
    reviewCheckedAt: googleReviews.checkedAt,
    pages: pageResults,
    checkedInternalLinks: checkedLinks,
    errors,
    largestLocalImages: assets.slice(0, 6),
    rawHtmlTemplate: { title: readFileSync('index.html', 'utf8').match(/<title>(.*?)<\/title>/)?.[1], bodyRequiresJavaScript: true, uniqueRouteMetadataImplemented: ['/', airportTransfer.path] },
    googleReviewSnapshot: { rating: googleReviews.rating, count: googleReviews.count, source: business.googleReviewsUrl, excerptAuthors: googleReviews.excerpts.map(review => review.author), liveFeed: false },
    legalSourceCopies: Object.fromEntries(Object.entries(legalPages).map(([slug, legal]) => [slug, { source: legal.sourceUrl, textMatchesSource: legal.textMatchesSource, approvedEdits: legal.approvedEdits }])),
  };
  mkdirSync('output', { recursive: true });
  writeFileSync('output/seo-technical-snapshot.json', `${JSON.stringify(snapshot, null, 2)}\n`);
  assert.equal(errors.length, 0, errors.join('\n'));
  console.log(`PASS: ${paths.length} pages, ${checkedLinks} internal links/anchors, legal source parity, review snapshot, 20-year claim, form defaults, local assets and CSS syntax.`);
  console.log('Generated output/seo-technical-snapshot.json');
} finally {
  await server.close();
}
