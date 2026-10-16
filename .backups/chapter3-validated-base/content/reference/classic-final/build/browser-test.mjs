// Real-browser test of the soutenance deck: offline load, click sequences, back/fast navigation, presenter sync, keys.
import { createRequire } from 'node:module';
const require = createRequire(process.env.HOME + '/.claude/skills/deck-kit/export/package.json');
const { chromium } = require('playwright-core');
const DECK = 'file://' + (process.argv[3] || process.env.HOME + '/Desktop/zawedni-video-pfe/soutenance') + '/deck.offline.html';   // argv[3]: another copy (the extracted zip)
const OUT = process.argv[2];
if (!OUT) throw new Error('Usage: node browser-test.mjs OUTPUT_DIRECTORY [DECK_DIRECTORY]');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const res = []; const ok = (name, cond, info = '') => { const result = `${cond ? 'PASS' : 'FAIL'}  ${name}${info ? '  · ' + info : ''}`; res.push(result); console.log(result); };
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: process.env.QA_HEADLESS === '1', args: ['--ozone-platform=x11', '--window-size=1600,940', '--autoplay-policy=no-user-gesture-required'] });
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
ok('A4 44 slides', env.n === 44, String(env.n));

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
ok('B3 during the build the jury is still appearing progressively', mid.some(o => o < .5), JSON.stringify(mid));
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

// D · five journey states, admin states contain no mobile column.
const vis = async () => page.evaluate(() => [...document.querySelectorAll('#parcours-app .state')].map(e => +getComputedStyle(e).opacity > .95 ? 1 : 0).join(''));
const want = ['10000','01000','00100','00010','00001'];
for (let state = 0; state <= 4; state++) {
  await page.evaluate(h => { location.hash = h; }, `#15.${state}`); await sleep(1300);
  ok(`D ${state}: correct web/mobile composition`, (await vis()) === want[state], await vis()); await shot(`D-parcours-${state}`);
}
for (let state = 3; state >= 0; state--) {
  await key('ArrowLeft'); await sleep(400);
  ok(`D backwards ${state}: correct composition restored`, (await vis()) === want[state], await vis());
}

// H · BMC: one part outlined and enlarged per click, also backwards
const bmc = async () => (await op('#modele .ring')).map(o => o > .5 ? 1 : 0).join('') + '|' + (await op('#modele .zm')).map(o => o > .5 ? 1 : 0).join('') + '|' + ((await op('#modele .gc'))[0] > .5 ? 1 : 0);
for (let s = 0; s <= 3; s++) { await page.evaluate(h => { location.hash = h; }, `#7.${s}`); await sleep(1300); const v = await bmc(); const w = ['000|000|0', '100|100|0', '010|010|1', '001|001|0'][s]; ok(`H${s + 1} BMC 7.${s}: ${['no part', 'segments', 'valeur', 'revenus'][s]}`, v === w, v); await shot(`H-bmc-${s}`); }
await key('ArrowLeft'); await sleep(300);
ok('H5 ← from 7.3: valeur + grid card, immediately', (await bmc()) === '010|010|1', await bmc());
ok('H6 no revenue banner left', await page.evaluate(() => !document.querySelector('#modele .pv') && !/aucun n.est présenté/.test(document.querySelector('#modele').textContent)));
await sleep(200); await key('ArrowRight'); await sleep(250); await shot('H-bmc-fwd-0.25s');

// I · analyses: one outlined row and one card per click; the closing sentence only with Checkov; backwards
const an = async () => (await op('#analyses .ring')).map(o => o > .5 ? 1 : 0).join('') + '|' + (await op('#analyses .card')).map(o => o > .5 ? 1 : 0).join('') + '|' + ((await op('#analyses .end'))[0] > .5 ? 1 : 0);
for (let s = 0; s <= 6; s++) { await page.evaluate(h => { location.hash = h; }, `#29.${s}`); await sleep(1300); const one = '000000'.split('').map((_, k) => k === s - 1 ? 1 : 0).join(''); const w = `${one}|${one}|${s === 6 ? 1 : 0}`; const v = await an(); ok(`I${s + 1} analyses 26.${s}`, v === w, v); if (s % 3 === 0 || s === 1) await shot(`I-analyses-${s}`); }
await key('ArrowLeft'); await sleep(300);
ok('I8 ← from 29.6: Trivy only, no closing sentence', (await an()) === '000010|000010|0', await an());

// M · metrics: Prometheus alone, then Grafana alone; backwards. L · alert: the resolution chain only at click 1; backwards.
const met = async () => (await page.evaluate(() => [...document.querySelectorAll('#metriques > div')].map(e => +getComputedStyle(e).opacity > .5 ? 1 : 0).join('')));
for (const [h, w] of [['#36', '10'], ['#36.1', '01']]) { await page.evaluate(x => { location.hash = x; }, h); await sleep(1300); ok(`M ${h}: ${w === '10' ? 'Prometheus only' : 'Grafana only'}`, (await met()) === w, await met()); await shot('M-metriques' + h.replace('#', '-')); }
await key('ArrowLeft'); await sleep(400); ok('M ← from 36.1: Prometheus again', (await met()) === '10', await met());
const imgs = await page.evaluate(() => [...document.querySelectorAll('#metriques img')].map(i => i.naturalWidth > 0 && Math.abs(i.getBoundingClientRect().width / i.getBoundingClientRect().height - i.naturalWidth / i.naturalHeight) < .02));
ok('M real <img> crops, proportions kept', imgs.length === 3 && imgs.every(Boolean), JSON.stringify(imgs));
const al = async () => (await page.evaluate(() => { const g = document.querySelectorAll('#alerte .tl > div > .ev:last-child'); return [...g].map(e => +getComputedStyle(e).opacity > .5 ? 1 : 0).join('') + '|' + (+getComputedStyle(document.querySelector('#alerte .closing')).opacity > .5 ? 1 : 0); }));
for (const [h, w] of [['#38', '10|0'], ['#38.1', '11|0'], ['#38.2', '11|1']]) { await page.evaluate(x => { location.hash = x; }, h); await sleep(2600); ok(`L ${h}`, (await al()) === w, await al()); await shot('L-alerte' + h.replace('#', '-')); }
await key('ArrowLeft'); await sleep(400); await key('ArrowLeft'); await sleep(400);
ok('L ← back to 38.0: resolution chain hidden', (await al()) === '10|0', await al());

// V · the film: poster + button at step 0; the click plays it with sound; pause / resume; leaving stops and rewinds; return shows the poster
const vst = () => page.evaluate(() => { const v = document.querySelector('#video video'); return { paused: v.paused, muted: v.muted, t: +v.currentTime.toFixed(2), audio: v.webkitAudioDecodedByteCount || 0, ready: v.readyState, btn: getComputedStyle(document.querySelector('#video .play')).display !== 'none', src: v.currentSrc.split('/').slice(-2).join('/') }; });
await page.evaluate(() => { location.hash = '#43'; }); await sleep(1500);
let vs = await vst(); await shot('V-video-0');
ok('V1 43.0: poster, paused, play button shown, file found', vs.paused && vs.btn && vs.ready >= 1 && vs.src === 'media/zawedni-devsecops.mp4', JSON.stringify(vs));
await key('ArrowRight'); await sleep(3000); vs = await vst(); await shot('V-video-playing');
ok('V2 → plays with sound: not paused, not muted, time and decoded audio advance', !vs.paused && !vs.muted && vs.t > 1 && vs.audio > 0 && !vs.btn, JSON.stringify(vs));
const hBefore = await hash();
const box = await page.evaluate(() => { const r = document.querySelector('#video video').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height - 12 }; });
await page.mouse.move(box.x, box.y - 200); await sleep(300); await page.mouse.click(box.x, box.y - 200); await sleep(600);
ok('V3 a click on the film does not change the slide', (await hash()) === hBefore, (await hash()) + ' vs ' + hBefore);
await page.evaluate(() => document.querySelector('#video video').pause()); await sleep(400); vs = await vst();
const tPause = vs.t;
ok('V4 pause: paused, play button back', vs.paused && vs.btn, JSON.stringify(vs));
await page.click('#video .play'); await sleep(1500); vs = await vst();
ok('V5 play button resumes from the same point', !vs.paused && vs.t > tPause + .8 && vs.t < tPause + 3, `${tPause} → ${vs.t}`);
await key('ArrowRight'); await sleep(1500); vs = await vst();   // focus left where the mouse put it (the play button), as in the room
ok('V6 → to the conclusion: film stopped and rewound', vs.paused && vs.t === 0 && /^#44/.test(await hash()), JSON.stringify(vs) + ' ' + await hash());
await key('ArrowLeft'); await sleep(1500); vs = await vst(); await shot('V-video-back');
ok('V7 ← back to 43.1: no ghost playback, poster and button', vs.paused && vs.t === 0 && vs.btn && /^#43\.1/.test(await hash()), JSON.stringify(vs) + ' ' + await hash());
// back on 40.1 the poster stays: start the film with the button, as Ali would
await page.click('#video .play'); await sleep(1500);
await page.mouse.click(box.x, box.y); await sleep(500);   // a click on the native control bar (play/pause toggle)
const vBar = await vst(), tBar = vBar.t;
await key(' '); await sleep(1500); vs = await vst();
ok('V8 after a click on the player controls, Space still advances once (to 44) and the film stops', /^#44/.test(await hash()) && vs.paused && vs.t === 0, `bar ${JSON.stringify(vBar)} → ${JSON.stringify(vs)} ${await hash()}`);
await page.evaluate(() => { location.hash = '#1'; }); await sleep(800);

// E · log4j: normal / blocked / back to green, and back nav
for (let s = 0; s <= 2; s++) { await page.evaluate(h => { location.hash = h; }, `#31.${s}`); await sleep(3200); await shot(`E-log4j-${s}`); }
await key('ArrowLeft'); await sleep(250); await shot('E-log4j-back-to-1');
const red = await page.evaluate(() => getComputedStyle(document.querySelectorAll('#log4j .art rect')[2] || document.body).stroke);
ok('E1 ← from 31.2 shows the blocked state (Dependency-Check red)', /217, 63, 63|d93f3f/.test(red), red);

// F · keys: overview, go to slide, black screen, fullscreen
await key('o'); await sleep(600);
const ov = await page.evaluate(() => document.documentElement.className + ' ' + document.body.className);
await shot('F-overview');
ok('F1 O opens the overview', /ov/.test(ov), ov.slice(0, 80));
await key('Escape'); await sleep(500);
await page.keyboard.type('20'); await key('Enter'); await sleep(900);
ok('F2 20 + Enter goes to slide 20', /^#20(\.|$)/.test(await hash()), await hash());
await key('ArrowRight'); await sleep(1500); await shot('F-devsecops-1');
await key('f'); await sleep(900);
ok('F3 F toggles fullscreen', await page.evaluate(() => !!document.fullscreenElement));
await key('f'); await sleep(600);

// G · presenter view and sync
await page.evaluate(() => { location.hash = '#14.0'; }); await sleep(600);
const [pv] = await Promise.all([page.waitForEvent('popup', { timeout: 10000 }), key('p')]);
await pv.waitForLoadState(); await sleep(2500);
const pvState = async () => pv.evaluate(() => ({ pos: document.querySelector('.dk-pv-pos')?.textContent, on: document.querySelector('.dk-pv-now .dk-pv-seg.on')?.textContent?.trim().slice(0, 70), timer: document.querySelector('.dk-pv-timer')?.textContent, dots: document.querySelectorAll('.dk-pv-dots i.on').length }));
let g = await pvState(); await pv.screenshot({ path: `${OUT}/G-presenter-11.0.png` });
ok('G1 presenter: slide 14, lit notes = step 0 text', /14/.test(g.pos) && /Pour utiliser ZAWEDNI/.test(g.on || ''), JSON.stringify(g));
await key('ArrowRight'); await sleep(900); g = await pvState();
ok('G2 → in the main window: presenter lights step 1 text', /L’entreprise remplit|L'entreprise remplit/.test(g.on || ''), JSON.stringify(g));
await pv.keyboard.press('ArrowRight'); await sleep(900);
await pv.keyboard.press('ArrowRight'); await sleep(900);
ok('G3 → in the presenter: main window follows to 15.0', (await hash()) === '#15', await hash());
g = await pvState(); await pv.screenshot({ path: `${OUT}/G-presenter-12.0.png` });
ok('G4 presenter notes follow (15.0 text)', /Après la création du compte/.test(g.on || ''), JSON.stringify(g));
const t1 = g.timer; await sleep(2200); g = await pvState();
ok('G5 timer runs', g.timer !== t1, `${t1} → ${g.timer}`);
await pv.keyboard.press('ArrowLeft'); await sleep(700);
ok('G6 ← in the presenter: main goes back to 14.2', (await hash()) === '#14.2', await hash());

await page.evaluate(() => { location.hash = '#43'; }); await sleep(1200); await key('ArrowRight'); await sleep(2500);
const pvVid = await pv.evaluate(() => { const all = [...document.querySelectorAll('video')]; for (const f of document.querySelectorAll('iframe')) try { all.push(...f.contentDocument.querySelectorAll('video')); } catch (e) {} return all.map(v => (v.paused ? 'P' : 'p') + (v.muted ? 'M' : 'm')); });
const mainV = await vst(); await pv.screenshot({ path: `${OUT}/G-presenter-40.1.png` });
ok('G7 film: one audible track (main window plays; presenter window and previews paused and muted)', !mainV.paused && !mainV.muted && pvVid.length > 0 && pvVid.every(x => x === 'PM'), JSON.stringify(pvVid) + ' main ' + JSON.stringify(mainV));
await page.evaluate(() => document.querySelector('#video video').pause());

ok('Z1 no page errors', errs.length === 0, errs.slice(0, 3).join(' | '));
await browser.close();

// W · default autoplay policy (no flag): landing on 40.1 without a gesture, the browser refuses play(); the button must still start it
{
  const b2 = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: process.env.QA_HEADLESS === '1', args: ['--ozone-platform=x11', '--window-size=1600,940'] });
  const c2 = await b2.newContext({ viewport: { width: 1600, height: 900 } });
  await c2.route('**/*', r => r.request().url().startsWith('file:') || r.request().url().startsWith('data:') ? r.continue() : r.abort());
  const p2 = await c2.newPage();
  await p2.goto(DECK + '#43.1'); await p2.waitForFunction(() => document.documentElement.classList.contains('dk-ready'), null, { timeout: 30000 }); await sleep(2500);
  const st = () => p2.evaluate(() => { const v = document.querySelector('#video video'); return { paused: v.paused, muted: v.muted, t: +v.currentTime.toFixed(2), btn: getComputedStyle(document.querySelector('#video .play')).display !== 'none' }; });
  const w1 = await st();
  await p2.click('#video .play'); await sleep(2500); const w2 = await st();
  await p2.screenshot({ path: `${OUT}/W-manual-play.png` });
  ok('W1 autoplay refused without a gesture → button shown; one click on it plays with sound', w1.btn && !w2.paused && !w2.muted && w2.t > 1, JSON.stringify(w1) + ' → ' + JSON.stringify(w2));
  await b2.close();
}
console.log(`${res.filter(line => line.startsWith('PASS')).length}/${res.length} PASS`);

if (res.some(line => line.startsWith('FAIL'))) process.exitCode = 1;
