// Read the active classic sources, never an archive. Export inert resting frames and exact notes.
// Browser rendering is essential: several slides generate their diagrams in JavaScript.
import { chromium } from 'playwright-core';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCE = path.resolve(process.env.CLASSIC_SOURCE || '/home/ali/Desktop/zawedni-video-pfe/soutenance');
const OUT = path.join(ROOT, 'public/content');
const REF = path.join(ROOT, 'content/reference');
const sha = b => createHash('sha256').update(b).digest('hex');
await mkdir(OUT, { recursive: true }); await mkdir(REF, { recursive: true });
// literal_eval reads only the table; it cannot execute the source's generators or write to the classic project.
const table = JSON.parse(execFileSync('python3', ['-c', `import ast,json,sys
t=ast.parse(open(sys.argv[1]).read())
r=next(n.value for n in t.body if isinstance(n,ast.AnnAssign) and isinstance(n.target,ast.Name) and n.target.id=='R')
print(json.dumps(ast.literal_eval(r),ensure_ascii=False))`, path.join(SOURCE, 'build/script_rows.py')], { encoding: 'utf8' }));
let chapter = 0;
const rows = table.map(([id, group, title, steps, visual, transition, throughLine, speech], i) => {
  if (group) chapter = Number(group.split(' ')[0]);
  const chunks = speech.split('[clic]');
  if (chunks.length !== steps + 1) throw new Error(`Speech/click mismatch ${id}`);
  return { id, seq: i + 1, chapter, title, steps, speech: chunks, visual, transition, throughLine };
});
const sourceFiles = ['deck.html', 'deck.offline.html', 'build/script_rows.py', 'notes.py', 'presenter.sh', 'rebuild.sh', 'SCRIPT.md', 'DISCOURS.md'];
const sourceHashes = {};
for (const file of sourceFiles) sourceHashes[file] = sha(await readFile(path.join(SOURCE, file)));
await copyFile(path.join(SOURCE, 'deck.html'), path.join(REF, 'deck.html'));
await copyFile(path.join(SOURCE, 'build/script_rows.py'), path.join(REF, 'script_rows.py'));
let html = await readFile(path.join(SOURCE, 'deck.html'), 'utf8');
html = html.replace(/<link[^>]*>/g, '');
const fonts = await readFile(path.join(ROOT, 'src/styles.css'), 'utf8');
html = html.replace('</head>', `<style>${fonts.slice(0, fonts.indexOf(':root'))}</style></head>`);
const origin = 'http://127.0.0.1:4399';
const failures = [], assets = new Set();
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.route('**/*', async route => {
    const u = new URL(route.request().url());
    if (u.origin !== origin) { failures.push(u.href); return route.abort(); }
    if (u.pathname === '/deck.html') return route.fulfill({ contentType: 'text/html', body: html });
    const rel = decodeURIComponent(u.pathname).replace(/^\//, '').replace(/^assets\/deck\//, 'assets/');
    const base = rel.startsWith('fonts/') ? path.join(ROOT, 'public') : SOURCE;
    const target = path.resolve(base, rel);
    if (!target.startsWith(base + path.sep)) return route.abort();
    try { await route.fulfill({ path: target }); } catch { failures.push(rel); await route.abort(); }
  });
  await page.goto(`${origin}/deck.html?render`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__ready, null, { timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  const runtime = await page.evaluate(() => window.__deck.slides);
  for (const [i, row] of rows.entries()) {
    const actual = runtime[i];
    if (actual?.id !== row.id || actual.steps !== row.steps || actual.title !== row.title) throw new Error(`Active deck/table mismatch ${row.id}`);
    // Integrated notes must agree with the source used to rebuild the deck.
    const normalized = text => text.replaceAll('[lire]', 'À lire :').replace(/\s+/g, ' ').trim();
    const notes = await page.evaluate(i => [...document.querySelectorAll('section.slide')[i].querySelectorAll('aside.notes > p')].map(p => ({ step: +(p.dataset.step || 0), text: p.textContent })), i);
    if (notes.length !== row.speech.length || notes.some((p, step) => p.step !== step || normalized(p.text) !== normalized(row.speech[step]))) throw new Error(`Integrated notes differ ${row.id}`);
  }
  if (runtime.length !== rows.length) throw new Error('Deck includes unmapped slides');
  await writeFile(path.join(OUT, 'evidence.css'), (await page.evaluate(() => [...document.querySelectorAll('style')].map(e => e.textContent).join('\n').replaceAll(':root', ':host'))).trimEnd() + '\n');
  const states = [];
  for (const [i, row] of rows.entries()) {
    const frames = []; let previous = [];
    for (let step = 0; step <= row.steps; step++) {
      const frame = await page.evaluate(({ i, step }) => {
        window.__deck.show(i, step);
        const original = document.querySelectorAll('section.slide')[i];
        const visible = el => {
          for (let node = el; node && node !== original.parentElement; node = node.parentElement) {
            const s = getComputedStyle(node);
            if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false;
          }
          return true;
        };
        const texts = [...original.querySelectorAll('*')].filter(visible).flatMap(el => [...el.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent.trim()).filter(Boolean));
        const images = [...original.querySelectorAll('img')].filter(visible).map(el => ({ src: el.getAttribute('src'), alt: el.alt }));
        const diagrams = [...original.querySelectorAll('svg')].filter(visible).map(el => el.outerHTML);
        const declarations = [...original.querySelectorAll('[data-step],[data-out]')].map(el => ({ tag: el.tagName, from: el.dataset.step || '0', out: el.dataset.out || null, visible: visible(el), text: el.textContent.trim() }));
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
          for (const attr of ['href', 'xlink:href']) if (e.hasAttribute(attr) && !e.getAttribute(attr).startsWith('#')) e.removeAttribute(attr);
        }
        return { html: sec.outerHTML, assets: urls, texts, images, diagrams, declarations };
      }, { i, step });
      frames.push(frame.html); frame.assets.forEach(a => assets.add(a));
      states.push({ id: `${row.id}-${step}`, slideId: row.id, position: row.seq, title: row.title, step,
        speech: row.speech[step], visibleTexts: frame.texts, images: frame.images,
        diagramHashes: frame.diagrams.map(sha), reveals: frame.declarations,
        appeared: frame.texts.filter(t => !previous.includes(t)), disappeared: previous.filter(t => !frame.texts.includes(t)),
        frameSha256: sha(frame.html) });
      previous = frame.texts;
    }
    await writeFile(path.join(OUT, `${row.id}.json`), JSON.stringify({ id: row.id, frames }) + '\n');
  }
  assets.add('assets/video-poster.jpg');
  const manifest = [];
  for (const rel of [...assets].sort()) {
    const file = rel.replace('assets/', 'assets/deck/'), dest = path.join(ROOT, 'public', file);
    await mkdir(path.dirname(dest), { recursive: true }); await copyFile(path.join(SOURCE, rel), dest);
    const bytes = await readFile(dest); manifest.push({ file, source: rel, sha256: sha(bytes), bytes: bytes.length });
  }
  const film = 'media/zawedni-devsecops.mp4';
  await copyFile(path.join(SOURCE, film), path.join(ROOT, 'public', film));
  const filmBytes = await readFile(path.join(ROOT, 'public', film));
  manifest.push({ file: film, source: film, sha256: sha(filmBytes), bytes: filmBytes.length });
  if (failures.length) throw new Error(`Local import failures: ${[...new Set(failures)]}`);
  for (const file of sourceFiles) if (sha(await readFile(path.join(SOURCE, file))) !== sourceHashes[file]) throw new Error(`Classic changed during import: ${file}`);
  await writeFile(path.join(ROOT, 'content/source/sequences.json'), JSON.stringify(rows, null, 2) + '\n');
  await copyFile(path.join(SOURCE, 'build/script_rows.py'), path.join(ROOT, 'content/source/script_rows.py'));
  await writeFile(path.join(ROOT, 'content/source/assets-manifest.json'), JSON.stringify({ sourceDeckSha256: sourceHashes['deck.html'], assets: manifest }, null, 2) + '\n');
  const reference = { capturedAt: new Date().toISOString(), root: SOURCE, files: sourceHashes, counts: { slides: rows.length, reveals: rows.reduce((n, r) => n + r.steps, 0), states: states.length, advances: states.length - 1 }, rows, states };
  await writeFile(path.join(REF, 'manifest.json'), JSON.stringify(reference, null, 2) + '\n');
  console.log(`Active classic: ${rows.length} slides, ${reference.counts.reveals} reveals, ${states.length} states; exact integrated notes verified; ${manifest.length} local assets.`);
} finally { await browser.close(); }
