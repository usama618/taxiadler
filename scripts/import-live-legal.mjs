import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { business } from '../src/content.js';

const allowedTags = new Set(['p', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'a', 'h2', 'h3', 'h4', 'br']);
const normalize = html => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const hash = value => createHash('sha256').update(value).digest('hex');
const updateAddress = process.argv.includes('--use-current-address');
const pages = {};

for (const slug of ['impressum', 'datenschutz']) {
  const response = await fetch(`https://taxiadler-rastatt.de/wp-json/wp/v2/pages?slug=${slug}`, { signal: AbortSignal.timeout(20000) });
  assert(response.ok, `Could not retrieve ${slug}: ${response.status}`);
  const records = await response.json();
  const page = records.find(item => item.slug === slug);
  assert(page?.content?.rendered, `Missing live page content: ${slug}`);
  const raw = page.content.rendered;
  const heading = raw.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i)?.[1].replace(/<[^>]*>/g, '').trim();
  // Extract only the legal text, not WPBakery layout shortcodes or site navigation.
  const block = raw.match(/\[vc_column_text\b[^\]]*\]([\s\S]*?)\[\/vc_column_text\]/i)?.[1];
  assert(block && heading, `Unexpected live markup: ${slug}`);
  const body = block.replace(/^\s*<\/p>\s*/i, '').replace(/\s*<p>\s*$/i, '').trim();
  assert(!/<(?:script|style|iframe|form|object)\b/i.test(body), `Active content requires inspection: ${slug}`);
  const edits = [];
  let contentHtml = body.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (tag, name) => {
    name = name.toLowerCase();
    if (!allowedTags.has(name)) return '';
    if (tag.startsWith('</')) return `</${name}>`;
    if (name !== 'a') return `<${name}>`;
    const href = tag.match(/\bhref\s*=\s*(["'])(.*?)\1/i)?.[2];
    assert(href && /^(https?:\/\/|mailto:)/i.test(href), `Unsupported source link: ${slug}`);
    const blank = /\btarget\s*=\s*["']_blank["']/i.test(tag);
    return `<a href="${href.replaceAll('"', '&quot;')}"${blank ? ' target="_blank" rel="noopener noreferrer"' : ''}>`;
  });
  contentHtml = contentHtml.replace(/<p>\s*<strong>([^<]+)<\/strong>\s*<\/p>/g, '<h2>$1</h2>');
  assert.equal(normalize(contentHtml), normalize(body), `Text changed during layout cleanup: ${slug}`);
  if (slug === 'datenschutz' && updateAddress) {
    const previous = 'Ottersdorfer str.15';
    assert(contentHtml.includes(previous), 'Live privacy address changed; review it before replacing');
    contentHtml = contentHtml.replace(previous, business.street);
    edits.push({ from: previous, to: business.street });
  }
  pages[slug] = {
    heading,
    sourceUrl: page.link,
    sourceModifiedGmt: page.modified_gmt,
    sourceTextSha256: hash(normalize(body)),
    copiedTextSha256: hash(normalize(contentHtml)),
    textMatchesSource: normalize(body) === normalize(contentHtml),
    approvedEdits: edits,
    contentHtml,
  };
  console.log(`${slug}: complete text copied${edits.length ? ' with the approved address replacement' : ' unchanged'}`);
}

writeFileSync('src/legal-pages.json', `${JSON.stringify(pages, null, 2)}\n`);
console.log('Generated src/legal-pages.json; source text hashes retained for verification.');
