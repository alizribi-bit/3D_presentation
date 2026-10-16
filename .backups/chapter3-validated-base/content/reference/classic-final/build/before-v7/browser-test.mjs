// Real-browser test of the soutenance deck: offline load, click sequences, back/fast navigation, presenter sync, keys.
import { createRequire } from 'node:module';
const require = createRequire(process.env.HOME + '/.claude/skills/deck-kit/export/package.json');
const { chromium } = require('playwright-core');
const DECK = 'file://' + process.env.HOME + '/Desktop/zawedni-video-pfe/soutenance/deck.offline.html';
const OUT = process.argv[2];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const res = []; const ok = (name, cond, info = '') => { res.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${info ? '  · ' + info : ''}`); };
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: false, args: ['--ozone-platform=x11', '--window-size=1600,940', '--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
const blocked = [];
await ctx.route('**/*', r => r.request().url().startsWith('file:') || r.request().url().startsWith('data:') ? r.continue() : (blocked.push(r.request().url()), r.abort()));
const page = await ctx.newPage();
const errs = []; page.on('pageerror', e => errs.push(String(e))); page.on('console', m => m.type() === 'error' && errs.push(m.text()));
await page.goto(DECK);
await page.waitForFunction(() => document.documentElement.classList.contains('dk-ready'), null, { timeout: 30000 });
await sleep(800);
const hash = () => page.evaluate(() => location.hash);
const shot = n => page.screenshot({ path: `${OUT}/${n}.png` });
const op = sel => page.evaluate(s => [...document.querySelectorAll(s)].map(e => +getComputedStyle(e).opacity), sel);
const key = async (k, n = 1, gap = 60) => { for (let i = 0; i < n; i++) { await page.keyboard.press(k); await sleep(gap); } };

// A · offline
const env = await page.evaluate(async () => ({
  amiri: document.fonts.check('42px Amiri'), poppins: document.fonts.check('600 30px Poppins'),
  imgs: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.alt), n: document.querySelectorAll('section.slide').length }));
ok('A1 offline: no network request', blocked.length === 0, blocked.slice(0, 3).join(' '));
ok('A2 fonts Amiri + Poppins embedded', env.amiri && env.poppins);
ok('A3 every image decoded', env.imgs.length === 0, env.imgs.join(', '));
ok('A4 40 slides', env.n === 40, String(env.n));

// B · cover: Bismillah alone, then one click runs the sequence
ok('B1 starts at 1.0', (await hash()) === '#1', await hash());
const before = await op('#couverture .tile, #couverture .kick, #couverture .who > div, #couverture .jury > div, #couverture .yr');
const bism = (await op('#couverture .bism'))[0];
ok('B2 step 0: only the Bismillah', before.every(o => o < .05) && bism > .9, JSON.stringify(before));
await shot('B-cover-0');
await key('ArrowRight'); await sleep(400); await shot('B-cover-1-0.4s');
await sleep(1000); await shot('B-cover-1-1.4s');
const mid = await op('#couverture .jury > div');
await sleep(2200); await shot('B-cover-1-rest');
const end = await op('#couverture .tile, #couverture h1, #couverture .jury > div, #couverture .kick, #couverture .yr');
ok('B3 at 1.4 s the jury is not shown yet (progressive)', mid.every(o => o < .5), JSON.stringify(mid));
ok('B4 after ≈3.6 s everything is shown', end.every(o => o > .98), JSON.stringify(end));
ok('B5 still on slide 1 after its click', (await hash()) === '#1.1', await hash());

// C · sommaire: title alone, then six rows; fast presses and back
await key('ArrowRight'); await sleep(900);
ok('C1 sommaire step 0: rows hidden', (await op('#sommaire .list li')).every(o => o < .05), await hash());
await shot('C-sommaire-0');
await key('ArrowRight'); await sleep(1200); await shot('C-sommaire-1-1.2s');
await sleep(1800);
ok('C2 six rows after ≈3 s', (await op('#sommaire .list li')).every(o => o > .98));
// fast: from 2.1 press → four times within 0.25 s
await key('ArrowRight', 4, 40); await sleep(150);
const hFast = await hash();
await sleep(2500); await shot('C-fast-landing');
ok('C3 four fast presses land 4 steps later', hFast === '#4.1' || hFast === '#5', hFast);
// back to the cover: it must show its finished frame at once, without replay or delay
await page.evaluate(() => { location.hash = '#1.1'; }); await sleep(250);
const backCover = await op('#couverture .jury > div, #couverture h1');
await shot('C-back-cover');
ok('C4 jump back to 1.1: cover complete within 0.25 s (no replay)', backCover.every(o => o > .98), JSON.stringify(backCover));
await key('ArrowLeft'); await sleep(250);
ok('C5 ← from 1.1 gives 1.0: Bismillah alone again', (await hash()) === '#1' && (await op('#couverture .jury > div')).every(o => o < .05), await hash());
// interrupted sequence: click, then ← at 0.5 s, then → again
await key('ArrowRight'); await sleep(500); await key('ArrowLeft'); await sleep(1500);
ok('C6 interrupted cover then ←: nothing keeps appearing', (await op('#couverture .jury > div, #couverture .tile')).every(o => o < .05));

// D · web + mobile journey: one web capture and one mobile screen per step, changing together, also backwards
const vis = async () => (await op('#parcours-app .shot')).map(o => o > .5 ? 1 : 0).join('') + '|' + (await op('#parcours-app .ph img')).map(o => o > .5 ? 1 : 0).join('');
const want = ['1000|1000', '0100|0100', '0010|0010', '0001|0001'];
for (let s = 0; s <= 3; s++) { await page.evaluate(h => { location.hash = h; }, `#12.${s}`); await sleep(1300); const v = await vis(); ok(`D${s + 1} parcours 12.${s}: web and mobile ${s + 1} only`, v === want[s], v); await shot(`D-parcours-${s}`); }
await page.evaluate(() => { location.hash = '#12.3'; }); await sleep(900); await key('ArrowLeft'); await sleep(300);
ok('D5 ← from 12.3: results pair only, immediately', (await vis()) === '0010|0010', await vis());
await key('ArrowRight'); await sleep(300); await shot('D-parcours-fwd-0.3s');

// H · BMC: one part outlined and enlarged per click, also backwards
const bmc = async () => (await op('#modele .ring')).map(o => o > .5 ? 1 : 0).join('') + '|' + (await op('#modele .zm')).map(o => o > .5 ? 1 : 0).join('');
for (let s = 0; s <= 3; s++) { await page.evaluate(h => { location.hash = h; }, `#7.${s}`); await sleep(1300); const v = await bmc(); const w = ['000|000', '100|100', '010|010', '001|001'][s]; ok(`H${s + 1} BMC 7.${s}: ${['no part', 'segments', 'valeur', 'revenus'][s]}`, v === w, v); await shot(`H-bmc-${s}`); }
await key('ArrowLeft'); await sleep(300);
ok('H5 ← from 7.3: valeur only, immediately', (await bmc()) === '010|010', await bmc());
await sleep(200); await key('ArrowRight'); await sleep(250); await shot('H-bmc-fwd-0.25s');

// I · analyses: one outlined row and one card per click; the closing sentence only with Checkov; backwards
const an = async () => (await op('#analyses .ring')).map(o => o > .5 ? 1 : 0).join('') + '|' + (await op('#analyses .card')).map(o => o > .5 ? 1 : 0).join('') + '|' + ((await op('#analyses .end'))[0] > .5 ? 1 : 0);
for (let s = 0; s <= 6; s++) { await page.evaluate(h => { location.hash = h; }, `#26.${s}`); await sleep(1300); const one = '000000'.split('').map((_, k) => k === s - 1 ? 1 : 0).join(''); const w = `${one}|${one}|${s === 6 ? 1 : 0}`; const v = await an(); ok(`I${s + 1} analyses 26.${s}`, v === w, v); if (s % 3 === 0 || s === 1) await shot(`I-analyses-${s}`); }
await key('ArrowLeft'); await sleep(300);
ok('I8 ← from 26.6: Trivy only, no closing sentence', (await an()) === '000010|000010|0', await an());

// E · log4j: normal / blocked / back to green, and back nav
for (let s = 0; s <= 2; s++) { await page.evaluate(h => { location.hash = h; }, `#28.${s}`); await sleep(3200); await shot(`E-log4j-${s}`); }
await key('ArrowLeft'); await sleep(250); await shot('E-log4j-back-to-1');
const red = await page.evaluate(() => getComputedStyle(document.querySelectorAll('#log4j .art rect')[2] || document.body).stroke);
ok('E1 ← from 28.2 shows the blocked state (Dependency-Check red)', /217, 63, 63|d93f3f/.test(red), red);

// F · keys: overview, go to slide, black screen, fullscreen
await key('o'); await sleep(600);
const ov = await page.evaluate(() => document.documentElement.className + ' ' + document.body.className);
await shot('F-overview');
ok('F1 O opens the overview', /ov/.test(ov), ov.slice(0, 80));
await key('Escape'); await sleep(500);
await page.keyboard.type('17'); await key('Enter'); await sleep(900);
ok('F2 17 + Enter goes to slide 17', /^#17(\.|$)/.test(await hash()), await hash());
await key('ArrowRight'); await sleep(1500); await shot('F-devsecops-1');
await key('f'); await sleep(900);
ok('F3 F toggles fullscreen', await page.evaluate(() => !!document.fullscreenElement));
await key('f'); await sleep(600);

// G · presenter view and sync
await page.evaluate(() => { location.hash = '#11.0'; }); await sleep(600);
const [pv] = await Promise.all([page.waitForEvent('popup', { timeout: 10000 }), key('p')]);
await pv.waitForLoadState(); await sleep(2500);
const pvState = async () => pv.evaluate(() => ({ pos: document.querySelector('.dk-pv-pos')?.textContent, on: document.querySelector('.dk-pv-now .dk-pv-seg.on')?.textContent?.trim().slice(0, 70), timer: document.querySelector('.dk-pv-timer')?.textContent, dots: document.querySelectorAll('.dk-pv-dots i.on').length }));
let g = await pvState(); await pv.screenshot({ path: `${OUT}/G-presenter-11.0.png` });
ok('G1 presenter: slide 11, lit notes = step 0 text', /11/.test(g.pos) && /Cette organisation permet/.test(g.on || ''), JSON.stringify(g));
await key('ArrowRight'); await sleep(900); g = await pvState();
ok('G2 → in the main window: presenter lights step 1 text', /Quand le fournisseur demande/.test(g.on || ''), JSON.stringify(g));
await pv.keyboard.press('ArrowRight'); await sleep(900);
ok('G3 → in the presenter: main window follows to 12.0', (await hash()) === '#12', await hash());
g = await pvState(); await pv.screenshot({ path: `${OUT}/G-presenter-12.0.png` });
ok('G4 presenter notes follow (12.0 text)', /On retrouve cette logique/.test(g.on || ''), JSON.stringify(g));
const t1 = g.timer; await sleep(2200); g = await pvState();
ok('G5 timer runs', g.timer !== t1, `${t1} → ${g.timer}`);
await pv.keyboard.press('ArrowLeft'); await sleep(700);
ok('G6 ← in the presenter: main goes back to 11.1', (await hash()) === '#11.1', await hash());

ok('Z1 no page errors', errs.length === 0, errs.slice(0, 3).join(' | '));
console.log(res.join('\n'));
await browser.close();
