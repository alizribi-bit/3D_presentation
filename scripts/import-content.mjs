// Canonical text/image/SVG evidence from the immutable accepted deck. Runs only during authoring.
// The export contains no original scripts, event handlers, notes, navigation or remote resources.
import { chromium } from 'playwright-core';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(process.env.HOME, 'Desktop/zawedni-video-pfe/soutenance');
const rows = JSON.parse(await readFile(path.join(ROOT, 'content/source/sequences.json'), 'utf8'));
const OUT = path.join(ROOT, 'public/content'); await mkdir(OUT, { recursive: true });
const sha = b => createHash('sha256').update(b).digest('hex');
let html = await readFile(path.join(SOURCE, 'deck.html'), 'utf8');
const fingerprint = sha(html);
html = html.replace(/<link[^>]*>/g, '');
const fonts = await readFile(path.join(ROOT, 'src/styles.css'), 'utf8');
html = html.replace('</head>', `<style>${fonts.slice(0, fonts.indexOf(':root'))}</style></head>`);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const localOrigin = 'http://127.0.0.1:4399';
const failures = [];
await page.route('**/*', async route => {
  const u = new URL(route.request().url());
  if (u.origin !== localOrigin) { failures.push(u.origin); return route.abort(); }
  if (u.pathname === '/deck.html') return route.fulfill({ contentType: 'text/html', body: html });
  const rel = decodeURIComponent(u.pathname).replace(/^\//, '').replace(/^assets\/deck\//, 'assets/');
  const base = rel.startsWith('fonts/') ? path.join(ROOT, 'public') : SOURCE;
  const target = path.resolve(base, rel);
  if (!target.startsWith(base + path.sep)) return route.abort();
  try { await route.fulfill({ path: target }); } catch { failures.push(rel); await route.abort(); }
});
try {
  await page.goto(`${localOrigin}/deck.html?render`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__ready, null, { timeout: 60000 });
  const styles = await page.evaluate(() => [...document.querySelectorAll('style')].map(e => e.textContent).join('\n').replaceAll(':root', ':host'));
  await writeFile(path.join(OUT, 'evidence.css'), styles);
  const assets = new Set();
  let count = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i], frames = [];
    for (let step = 0; step <= row.steps; step++) {
      const frame = await page.evaluate(({ i, step }) => {
        window.__deck.show(i, step);
        const original = document.querySelectorAll('section.slide')[i];
        const sec = original.cloneNode(true);
        sec.querySelectorAll('aside,script,iframe,object,embed,video,audio,button,link').forEach(e => e.remove());
        sec.removeAttribute('style');
        const urls = [];
        for (const e of [sec, ...sec.querySelectorAll('*')]) {
          for (const a of [...e.attributes]) if (/^on/i.test(a.name)) e.removeAttribute(a.name);
          for (const attr of ['src', 'poster']) if (e.hasAttribute(attr)) {
            const v = e.getAttribute(attr);
            if (v.startsWith('assets/')) { urls.push(v); e.setAttribute(attr, v.replace('assets/', 'assets/deck/')); }
            else if (!v.startsWith('data:')) e.removeAttribute(attr);
          }
          if (e.hasAttribute('href') && !e.getAttribute('href').startsWith('#')) e.removeAttribute('href');
          if (e.hasAttribute('xlink:href') && !e.getAttribute('xlink:href').startsWith('#')) e.removeAttribute('xlink:href');
        }
        return { html: sec.outerHTML, assets: urls };
      }, { i, step });
      frames.push(frame.html); frame.assets.forEach(a => assets.add(a)); count++;
    }
    await writeFile(path.join(OUT, `${row.id}.json`), JSON.stringify({ id: row.id, frames }));
  }
  assets.add('assets/video-poster.jpg');
  const manifest = [];
  for (const rel of [...assets].sort()) {
    const file = rel.replace('assets/', 'assets/deck/'), dest = path.join(ROOT, 'public', file);
    await mkdir(path.dirname(dest), { recursive: true });
    await copyFile(path.join(SOURCE, rel), dest);
    const bytes = await readFile(dest);
    manifest.push({ file, source: rel, sha256: sha(bytes), bytes: bytes.length });
  }
  await mkdir(path.join(ROOT, 'public/media'), { recursive: true });
  const film = 'media/zawedni-devsecops.mp4';
  await copyFile(path.join(SOURCE, film), path.join(ROOT, 'public', film));
  const bytes = await readFile(path.join(ROOT, 'public', film));
  manifest.push({ file: film, source: film, sha256: sha(bytes), bytes: bytes.length });
  await writeFile(path.join(ROOT, 'content/source/assets-manifest.json'), JSON.stringify({ sourceDeckSha256: fingerprint, assets: manifest }, null, 2) + '\n');
  if (sha(await readFile(path.join(SOURCE, 'deck.html'))) !== fingerprint) throw new Error('Accepted source changed during import');
  if (failures.length) throw new Error(`Import requests failed: ${[...new Set(failures)].join(', ')}`);
  console.log(`Imported ${rows.length} sequences, ${count} canonical evidence frames, ${manifest.length} unchanged local assets.`);
} finally { await browser.close(); }
