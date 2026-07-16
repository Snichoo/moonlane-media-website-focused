// Downloads every asset from chromatix.com.au, mirroring the site's path
// structure under public/ so the ported CSS resolves without rewrites.
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const ORIGIN = 'https://www.chromatix.com.au';
const THEME = '/wp-content/themes/chromatix-2018-child/dist';

// Scratchpad list files produced by the extraction step
const SCRATCH = process.env.CHR_SCRATCH ||
  'C:/Users/samsn/AppData/Local/Temp/claude/c--Users-samsn-OneDrive-Desktop-Desktop-AppProjects-Website-New-moonlane-media-website/4a4abe99-e4dc-4489-9a14-fa1d48d8f4d7/scratchpad';

function readLines(p) {
  try { return fs.readFileSync(p, 'utf8').split(/\r?\n/).map(s => s.trim()).filter(Boolean); }
  catch { return []; }
}

const urls = new Set();

// 1. Absolute URLs harvested from HTML + CSS
for (const u of readLines(path.join(SCRATCH, 'all_urls_raw.txt'))) urls.add(u.replace(/[?#].*$/, ''));

// 2. CSS-relative URLs (../images/x, ../fonts/x relative to dist/css/)
for (const rel of readLines(path.join(SCRATCH, 'css_rel_urls.txt'))) {
  const cleaned = rel.replace(/^\.\.\//, ''); // images/x.png OR fonts/x.woff
  urls.add(`${ORIGIN}${THEME}/${cleaned}`.replace(/[?#].*$/, ''));
}

// 3. Fonts (self-hosted woff)
for (const f of [
  'montserrat-v12-latin-300.woff','montserrat-v12-latin-regular.woff',
  'montserrat-v12-latin-700.woff','montserrat-v12-latin-800.woff',
  'playfair-display-v14-latin-regular.woff','playfair-display-v14-latin-italic.woff',
]) urls.add(`${ORIGIN}${THEME}/fonts/${f}`);

// 4. Favicons
for (const f of [
  'favicon/apple-touch-icon.png','favicon/favicon-32x32.png','favicon/favicon-16x16.png',
  'favicon/safari-pinned-tab.svg','favicon/favicon.ico','favicon/site.webmanifest',
  'favicon/mstile-150x150.png','favicon/android-chrome-192x192.png','favicon/android-chrome-512x512.png',
]) urls.add(`${ORIGIN}${THEME}/${f}`);

const list = [...urls].filter(u => u.startsWith('http'));
console.log(`Downloading ${list.length} assets...`);

function download(url) {
  return new Promise((resolve) => {
    let dest;
    try { dest = path.join(PUBLIC, decodeURIComponent(new URL(url).pathname)); }
    catch { return resolve({ url, ok: false, err: 'bad-url' }); }
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return resolve({ url, ok: true, cached: true });
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/149.0 Safari/537.36' }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return download(new URL(res.headers.location, url).href).then(resolve);
      }
      if (res.statusCode !== 200) { res.resume(); return resolve({ url, ok: false, code: res.statusCode }); }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve({ url, ok: true })));
      file.on('error', (e) => resolve({ url, ok: false, err: e.message }));
    });
    req.on('error', (e) => resolve({ url, ok: false, err: e.message }));
    req.setTimeout(30000, () => { req.destroy(); resolve({ url, ok: false, err: 'timeout' }); });
  });
}

async function run() {
  const CONCURRENCY = 8;
  const results = [];
  for (let i = 0; i < list.length; i += CONCURRENCY) {
    const batch = list.slice(i, i + CONCURRENCY);
    results.push(...await Promise.all(batch.map(download)));
    process.stdout.write(`\r${Math.min(i + CONCURRENCY, list.length)}/${list.length}`);
  }
  const fail = results.filter(r => !r.ok);
  console.log(`\nDone. OK: ${results.filter(r => r.ok).length}, Failed: ${fail.length}`);
  if (fail.length) console.log('Failures:\n' + fail.map(f => `  ${f.code || f.err}  ${f.url}`).join('\n'));
}
run();
