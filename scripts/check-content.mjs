// Text checks (constitution, principle II): what is said comes from the accepted speech, what is projected comes
// from the accepted slides, and the banned words appear nowhere.
//   node scripts/check-content.mjs [baseURL]     needs the built version served (default http://127.0.0.1:4317)
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { STATES } from '../src/content/states.js';

const BASE = process.argv[2] || 'http://127.0.0.1:4317';
const SRC = `${process.env.HOME}/Desktop/zawedni-video-pfe/soutenance`;
const norm = s => s.replace(/&nbsp;| | /g, ' ').replace(/[’‘]/g, "'").replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim().toLowerCase();
const deck = norm(readFileSync(`${SRC}/deck.html`, 'utf8').replace(/<[^>]+>/g, ' '));
const speech = norm(readFileSync(`${SRC}/build/script_rows.py`, 'utf8').replace(/\[clic\]|\[lire\]|[«»]/g, ' ').replace(/\\'/g, "'"));
const BANNED = [/\bDNS\b/i, /10\s*\/\s*11/, /faux n[ée]gatif/i, /erreur de commande/i];
// Projected text that is not a sentence of the slides, on purpose (DESIGN.md).
const ALLOWED = new Set(['web', 'mobile', '01', '02', '03', '04', '05', '06']);

let fail = 0; const bad = (what, t) => { fail++; console.log(`FAIL  ${what}: « ${t} »`); };

// 1 · speech
for (const s of STATES) for (const [kind, text] of s.notes.script) {
  if (kind === 'added') continue;                       // flagged as an addition in the presenter window
  if (!speech.includes(norm(text))) bad(`${s.id} ${kind} not in script_rows.py`, text);
  if (kind === 'read' && !deck.includes(norm(text))) bad(`${s.id} [lire] not on the slides`, text);
}
const all = STATES.flatMap(s => [...s.notes.script.map(x => x[1]), s.notes.silent || '', s.notes.next]);

// 2 · projected text, as the jury window shows it in each state (leaf text of the visible panels)
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=vulkan', '--enable-features=Vulkan', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const projected = new Set();
for (const s of STATES) {
  await page.goto(`${BASE}/?test&still&n=${s.id}#${s.id}`);
  await page.waitForFunction(() => window.__story?.ready && __story.settled, null, { timeout: 60000 });
  await page.waitForTimeout(400);
  for (const t of await page.evaluate(() => [...document.querySelectorAll('#stage .pane.on *')]
    .filter(e => getComputedStyle(e).opacity !== '0')
    .flatMap(e => [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim())).filter(Boolean))) projected.add(t);
}
await browser.close();
for (const t of projected) {
  const n = norm(t).replace(/^·\s*|\s*·$/g, '');
  if (ALLOWED.has(n)) continue;
  for (const part of n.split(/\s+·\s+/)) if (!deck.includes(part)) bad('projected text not on the slides', t);
}
all.push(...projected);

// 3 · banned words, in speech, notes and projection
for (const t of all) for (const re of BANNED) if (re.test(t)) bad(`banned word ${re}`, t);

console.log(fail ? `\n${fail} problem(s)` : `ok    ${STATES.length} states: speech from script_rows.py, ${projected.size} projected texts from deck.html, no banned word`);
process.exit(fail ? 1 : 0);
