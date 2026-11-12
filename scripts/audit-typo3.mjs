import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const base = 'https://taxi-adler.ddev.site';
const seed = JSON.parse(readFileSync('typo3/seed/content.json','utf8'));
const snapshot = html => JSON.parse(execFileSync('php',['scripts/html-snapshot.php'],{input:html,encoding:'utf8'}));
const get = path => execFileSync('curl',['--fail','--silent','--show-error',new URL(path,base).href],{encoding:'utf8',maxBuffer:5*1024*1024});
const pages = new Map();
for (const page of seed.pages) {
  const html = get(page.path);
  assert(!/EDITORTEST-|CHILDTEST-|TYPO3 Exception|Welcome to your default website/.test(html), `${page.path}: test or installer residue`);
  const result = snapshot(html);
  assert.equal(result.h1.length,1,`${page.path}: one H1 expected`);
  assert.equal(new Set(result.ids).size,result.ids.length,`${page.path}: duplicate IDs`);
  assert(html.includes('https://wa.me/4915146557964'));
  pages.set(page.path,{html,...result});
}
let links = 0;
let queryLinks = 0;
const assets = new Set();
for (const [path,page] of pages) {
  for (const href of page.links) {
    const url = new URL(href,new URL(path,base));
    if (url.origin !== base) continue;
    const target = pages.get(url.pathname);
    assert(target,`${path}: unresolved internal link ${href}`);
    if (url.hash) assert(target.ids.includes(decodeURIComponent(url.hash.slice(1))),`${path}: missing anchor ${href}`);
    if(url.searchParams.has('richtung')){get(url.href);queryLinks++;}
    links++;
  }
  for (const href of [...page.images,...page.assets]) {
    const url = new URL(href,base);
    if(url.origin===base) assets.add(url.href);
  }
  for (const form of page.forms) {
    assert.equal((page.html.match(/id="privacy-dialog"/g)||[]).length,1,`${path}: expected one shared privacy modal`);
    assert(page.html.includes('data-privacy-url="/datenschutz/"'),`${path}: privacy modal route missing`);
    assert(page.links.includes('/datenschutz/'),`${path}: privacy page fallback link missing`);
    assert(form.controls.some(control=>control.tag==='select' && control.name.endsWith('[passengers]') && !control.required),`${path}: optional passenger selector missing`);
    assert(page.html.includes('value="7+"'),`${path}: larger group option missing`);
    for (const field of ['name','phone','email','pickup','date','time','consent']) {
      assert(form.controls.some(control=>control.name.endsWith(`[${field}]`) && control.type!=='hidden' && control.required),`${path}: required field ${field} missing`);
    }
    assert(form.controls.some(control=>control.name.endsWith('[destination]') && control.type!=='hidden' && !control.required),`${path}: destination must be present and optional`);
  }
}
for (const url of assets) {
  const response=get(url);
  if(new URL(url).pathname.endsWith('.css')){
    for(const match of response.matchAll(/url\(['"]?(\.\.\/Fonts\/[^)'"\s]+)['"]?\)/g))get(new URL(match[1],url).href);
  }
}
const sourceLegal = JSON.parse(readFileSync('src/legal-pages.json','utf8'));
for (const [slug,legal] of Object.entries(sourceLegal)) {
  const approvedHtml = slug === 'impressum'
    ? legal.contentHtml.replace('Aisha Zaheer Choudhery','Shumail Choudhery')
    : legal.contentHtml;
  const expected = JSON.parse(execFileSync('php',['scripts/html-snapshot.php'],{input:approvedHtml,encoding:'utf8',env:{...process.env,HTML_FRAGMENT:'1'}})).text;
  assert.equal(pages.get(`/${slug}/`).legalText[0],expected,`${slug}: legal wording changed`);
}
const home=pages.get('/');
assert(home.html.indexOf('class="hero"')<home.html.indexOf('class="booking-section'));
assert.equal((home.html.match(/class="google-review-card"/g)||[]).length,6);
assert.equal((home.html.match(/<li>\s*<img[^>]*alt="(?:EC-Karte|Visa|Mastercard|Sofortüberweisung|giropay|Visa Electron|Maestro|Bargeld)"/g)||[]).length,8);
assert(!home.html.includes('Stand:'));
assert(home.html.includes('taxi-adler-mercedes-hero.webp'));
assert(home.html.includes('taxi-adler-mercedes-fleet'));
mkdirSync('output',{recursive:true});
writeFileSync('output/typo3-frontend-audit.json',JSON.stringify({pages:[...pages].map(([path,page])=>({path,h1:page.h1,forms:page.forms.length})),internalLinks:links,queryLinks,localAssets:assets.size,legalTextParity:true},null,2)+'\n');
console.log(`PASS ${pages.size} TYPO3 pages, ${links} internal links, ${queryLinks} direction query links, ${assets.size} local assets, required form fields and exact legal text.`);
