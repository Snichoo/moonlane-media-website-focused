// Parses the raw Chromatix case-study pages and emits cleaned, self-contained
// inner-HTML for each page's `.sub-page.case-study-page` container into
// src/sections/case-studies.ts, applying the same cleaning as the homepage
// extraction (un-lazy media, local /wp-content asset paths, no scripts) plus
// the Moonlane Media rebrand (name, Melbourne→Australia, contact details).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SCRATCH = process.env.CS_SCRATCH ||
  'C:/Users/samsn/AppData/Local/Temp/claude/c--dev-moonlane-media-website/d81fafde-b935-49f2-9f8d-cb429eabb656/scratchpad';

const SLUGS = ['repurpose-it', 'cyc', 'neo', 'rylock', 'boa', 'powerplus-energy', 'ydl-stone', 'bowens'];

const rewriteUrl = (u) => u
  .replace(/https?:\/\/www\.chromatix\.com\.au\/wp-content\//g, '/wp-content/')
  .replace(/\/\/www\.chromatix\.com\.au\/wp-content\//g, '/wp-content/');

function clean(el) {
  if (!el) return '';
  el.querySelectorAll('script, noscript, iframe').forEach(n => n.remove());
  el.querySelectorAll('[data-src], [data-srcset], [data-lazy-src]').forEach(n => {
    const ds = n.getAttribute('data-src');
    const dss = n.getAttribute('data-srcset');
    const dls = n.getAttribute('data-lazy-src');
    if (ds) { n.setAttribute('src', rewriteUrl(ds)); n.removeAttribute('data-src'); }
    if (dls) { n.setAttribute('src', rewriteUrl(dls)); n.removeAttribute('data-lazy-src'); }
    if (dss) { n.setAttribute('srcset', rewriteUrl(dss)); n.removeAttribute('data-srcset'); }
    const cls = n.getAttribute('class');
    if (cls) n.setAttribute('class', cls.replace(/\blazy\b/g, '').replace(/\s+/g, ' ').trim());
  });
  el.querySelectorAll('[src], [srcset], [poster], [style]').forEach(n => {
    for (const attr of ['src', 'srcset', 'poster', 'style']) {
      const v = n.getAttribute(attr);
      if (v && v.includes('chromatix.com.au/wp-content')) n.setAttribute(attr, rewriteUrl(v));
    }
  });
  el.querySelectorAll('video').forEach(v => {
    v.setAttribute('playsinline', '');
    v.setAttribute('muted', '');
    v.setAttribute('preload', 'auto');
  });
  el.querySelectorAll('form').forEach(f => { f.setAttribute('action', '#'); f.setAttribute('onsubmit', 'return false;'); });
  el.querySelectorAll('*').forEach(n => {
    for (const a of Object.keys(n.attributes)) {
      if (/^on/i.test(a) && n.tagName !== 'FORM') n.removeAttribute(a);
    }
  });
  let html = el.innerHTML;
  html = html.replace(/<\?xml[^>]*\?>/g, '');
  // Drop the external "View/See Live Site" CTAs (whole paragraph, so no empty <p> remains)
  html = html.replace(/<p[^>]*>\s*<a class="button"[^>]*>\s*(?:View|See)\s+Live\s+Site\s*<\/a>\s*<\/p>/gi, '');
  return html.trim();
}

// Moonlane Media rebrand — mirrors the transforms applied to the homepage markup.
function rebrand(s) {
  // asset filenames that contain the old brand must keep their real paths
  s = s.split('Rylock-x-Chromatix-Testimonial').join('«RYLOCK-ASSET»');
  s = s.split(/logo-chromatix-/g ? 'logo-chromatix-' : 'logo-chromatix-').join('«LOGO-ASSET»');

  s = s.split('hello@chromatix.com.au').join('contact@moonlanemedia.com');
  s = s.split('03 9912 6403').join('0414 134 081');
  s = s.split('0399126403').join('0414134081');
  s = s.split('Suite 169, Tenancy 111, 793 Burke Road, Camberwell VIC 3124').join('3/77 Hudson Road, Albion QLD 4010');
  s = s.split('Camberwell office').join('Albion office');
  s = s.split('https://api.chromatix.com.au/v1/email/chromatix-com-au').join('#');
  s = s.split('https://www.facebook.com/chromatixau').join('#');
  s = s.split('https://twitter.com/chromatixau').join('#');
  s = s.split('https://www.chromatix.com.au/').join('/');
  s = s.split('https://www.chromatix.com.au').join('/');
  s = s.split('Chromatix').join('Moonlane Media');

  s = s.split('Melbourne Design Awards').join('«MDA»'); // third-party award name
  for (const noun of ['Web', 'web', 'businesses', 'business', 'agencies', 'audiences', 'market', 'team', 'family', 'UI', 'presence', 'project', 'websites', 'website', 'B2B', 'Small']) {
    s = s.split(`Melbourne ${noun}`).join(`Australian ${noun}`);
  }
  s = s.split('Melbourne-based').join('Australia-based');
  s = s.split('Melbourne').join('Australia');
  s = s.split('melbourne').join('australia');
  s = s.split('«MDA»').join('Melbourne Design Awards');

  s = s.split('«RYLOCK-ASSET»').join('Rylock-x-Chromatix-Testimonial');
  s = s.split('«LOGO-ASSET»').join('logo-chromatix-');
  return s;
}

const pages = {};
for (const slug of SLUGS) {
  const raw = fs.readFileSync(path.join(SCRATCH, `cs-${slug}.html`), 'utf8');
  const root = parse(raw, { comment: false, blockTextElements: { script: false, noscript: false, style: true, pre: true } });
  const el = root.querySelector('.sub-page.case-study-page');
  if (!el) throw new Error(`case-study container not found for ${slug}`);
  const rawTitle = (root.querySelector('title')?.textContent || '').trim();
  // Per-page brand accent: WordPress emits an inline <style> block that colors
  // the banner blob, quote/testimonial backdrops and list bullets.
  const styleBlocks = [...raw.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]);
  const accent = styleBlocks.find(s => s.includes('.chr-banner .chr-banner-bg'));
  if (!accent) throw new Error(`accent style block not found for ${slug}`);
  pages[slug] = {
    title: rebrand(rawTitle),
    css: accent.trim(),
    html: rebrand(clean(el)),
  };
}

let out = '// AUTO-GENERATED by scripts/extract-case-studies.mjs — cleaned inner HTML of\n';
out += '// each case-study page (.sub-page.case-study-page) from the live site, with\n';
out += '// assets rewritten to the /public mirror and Moonlane Media rebranding applied.\n\n';
out += 'export interface CaseStudy {\n  title: string;\n  css: string;\n  html: string;\n}\n\n';
out += `export const caseStudySlugs = ${JSON.stringify(SLUGS)} as const;\n\n`;
out += `export const caseStudies: Record<string, CaseStudy> = ${JSON.stringify(pages, null, 2)};\n`;
fs.writeFileSync(path.join(ROOT, 'src', 'sections', 'case-studies.ts'), out);

console.log('Page sizes (chars):');
for (const [k, v] of Object.entries(pages)) console.log(`  ${k.padEnd(18)} ${v.html.length}`);
const all = Object.values(pages).map(p => p.html).join('');
console.log('Leftover data-src:', (all.match(/data-src=/g) || []).length);
console.log('Leftover live refs:', (all.match(/chromatix\.com\.au/g) || []).length);
console.log('Leftover Melbourne:', (all.match(/Melbourne(?! Design Awards)/g) || []).length);
console.log('Leftover Chromatix (asset paths only expected):', (all.match(/Chromatix/g) || []).length);
