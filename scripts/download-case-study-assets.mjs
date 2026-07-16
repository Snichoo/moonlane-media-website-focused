// Downloads every /wp-content asset referenced by the extracted case-study
// markup (src/sections/case-studies.ts) and the ported sitewide stylesheet
// (src/styles/chromatix-main.css) into public/, mirroring the live site's
// path structure. Skips files that already exist in the mirror.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const ORIGIN = 'https://www.chromatix.com.au';

const sources = [
  fs.readFileSync(path.join(ROOT, 'src', 'sections', 'case-studies.ts'), 'utf8'),
  fs.readFileSync(path.join(ROOT, 'src', 'sections', 'contact.ts'), 'utf8'),
  fs.readFileSync(path.join(ROOT, 'src', 'styles', 'chromatix-main.css'), 'utf8'),
  fs.readFileSync(path.join(ROOT, 'src', 'styles', 'chromatix-contact.css'), 'utf8'),
];

const urls = new Set();
for (const text of sources) {
  // catches src/srcset/poster/url() references; excludes protocol-relative junk
  for (const m of text.matchAll(/\/wp-content\/[A-Za-z0-9_\-./%]+\.(png|jpe?g|gif|svg|webp|mp4|webm|woff2?|ttf|eot|ico)/g)) {
    urls.add(decodeURIComponent(m[0]));
  }
}

let queue = [...urls].filter(u => !fs.existsSync(path.join(PUBLIC, u.slice(1))));
console.log(`total refs: ${urls.size}, missing locally: ${queue.length}`);

let ok = 0, fail = [];
async function grab(u) {
  const dest = path.join(PUBLIC, u.slice(1));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await fetch(ORIGIN + encodeURI(u), { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!res.ok) { fail.push(`${res.status} ${u}`); return; }
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  ok++;
}

const BATCH = 6;
for (let i = 0; i < queue.length; i += BATCH) {
  await Promise.all(queue.slice(i, i + BATCH).map(grab));
  if (i % 48 === 0) console.log(`  ...${Math.min(i + BATCH, queue.length)}/${queue.length}`);
}
console.log(`downloaded: ${ok}, failed: ${fail.length}`);
fail.forEach(f => console.log('  FAIL', f));
