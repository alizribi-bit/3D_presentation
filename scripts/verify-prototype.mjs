// Real-browser checks of the prototype, on the built version (dist/) served like present.sh does.
//   node scripts/verify.mjs [baseURL]     default http://127.0.0.1:4317 (start it with ./present.sh or python3 -m http.server)
// Chrome with the machine's GPU (Vulkan), 1920×1080, jury and presenter windows in one browser context.
// Every request to another host is blocked and counted. Screenshots go to review/verify/.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const BASE = process.argv[2] || 'http://127.0.0.1:4317';
const OUT = new URL('../review/verify/', import.meta.url).pathname; mkdirSync(OUT, { recursive: true });
const IDS = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'C3', 'D1', 'D2', 'D3'];
const results = []; const ok = (name, pass, info = '') => { results.push({ name, pass, info }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${info ? `  — ${info}` : ''}`); };

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=vulkan', '--enable-features=Vulkan', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const external = [], errors = [];
await ctx.route('**/*', r => { const u = new URL(r.request().url()); if (u.hostname !== '127.0.0.1' && u.hostname !== 'localhost') { external.push(u.href); return r.abort(); } return r.continue(); });
const watch = p => { p.on('pageerror', e => errors.push(String(e))); p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); }); };

const jury = await ctx.newPage(); watch(jury);
await jury.goto(`${BASE}/?prototype&test&still#A0`);
await jury.waitForFunction(() => window.__story?.ready, null, { timeout: 60000 });
const pres = await ctx.newPage(); watch(pres);
await pres.goto(`${BASE}/presenter.html?prototype`);
const state = () => jury.evaluate(() => __story.state);
const settled = () => jury.waitForFunction(() => __story.settled, null, { timeout: 15000 });
const presAt = async id => { const t = Date.now(); try { await pres.waitForFunction(i => __presenter.cur === i, id, { timeout: 2000 }); return Date.now() - t; } catch { return Infinity; } };

// 1 · forward and back, one press = one state, presenter follows
let seq = [await state()], lag = 0;
for (let i = 0; i < 10; i++) { await jury.keyboard.press(i % 3 === 1 ? 'Space' : i % 3 === 2 ? 'PageDown' : 'ArrowRight'); seq.push(await state()); lag = Math.max(lag, await presAt(seq.at(-1))); await settled(); }
ok('10 presses forward (→, Espace, PageDown) visit A0…D3 in order', seq.join() === IDS.join(), seq.join(' '));
ok('presenter follows every forward step in < 0.5 s', lag < 500, `max ${lag} ms`);
await jury.keyboard.press('ArrowRight'); ok('→ on the last state does nothing', (await state()) === 'D3');
seq = [await state()];
for (let i = 0; i < 10; i++) { await jury.keyboard.press(i % 2 ? 'PageUp' : 'ArrowLeft'); seq.push(await state()); await settled(); }
ok('10 presses back (←, PageUp) visit D3…A0 in order', seq.join() === [...IDS].reverse().join(), seq.join(' '));
await jury.keyboard.press('ArrowLeft'); ok('← on the first state does nothing', (await state()) === 'A0');

// 2 · fast presses: final state = sum of presses (clamped), never more, never less
let expect = 0; const keys = [];
for (let i = 0; i < 20; i++) { const k = (i * 7 + 3) % 5 < 3 ? 'ArrowRight' : 'ArrowLeft'; keys.push(k); expect = Math.max(0, Math.min(10, expect + (k === 'ArrowRight' ? 1 : -1))); }
for (const k of keys) { await jury.keyboard.press(k); await jury.waitForTimeout(90); }
ok('20 fast presses (90 ms apart) land on the expected state', (await state()) === IDS[expect], `${await state()} vs ${IDS[expect]}`);
await settled();
lag = await presAt(IDS[expect]); ok('presenter ends on the same state after fast presses', lag < 500, `${lag} ms`);

// 3 · presenter keys drive the jury window; mouse click does not steal the keys; wheel does nothing
await jury.evaluate(() => __story.go(3)); await settled();
await pres.keyboard.press('ArrowRight'); await jury.waitForTimeout(300);
ok('→ pressed in the presenter window advances the jury window', (await state()) === 'B2');
await settled();
await jury.mouse.click(700, 500); await jury.keyboard.press('ArrowRight'); await jury.waitForTimeout(300);
ok('keys still work after a mouse click in the jury window', (await state()) === 'C1');
await settled();
await jury.mouse.wheel(0, 900); await jury.waitForTimeout(400);
ok('mouse wheel changes nothing', (await state()) === 'C1');
await pres.mouse.click(300, 300); await pres.keyboard.press('ArrowLeft'); await jury.waitForTimeout(300);
ok('keys still work after a mouse click in the presenter window', (await state()) === 'B2');
await settled();
const jumps = [];
for (const [k, id] of [['3', 'C1'], ['4', 'D1'], ['1', 'A0'], ['2', 'B1'], ['Home', 'A0']]) { await pres.keyboard.press(k); await jury.waitForTimeout(250); await settled(); jumps.push(`${k}→${await state()}${(await state()) === id ? '' : ` (expected ${id})`}`); }
ok('scene keys 1–4 and Début jump to the right states (from the presenter window)', !jumps.some(j => j.includes('expected')), jumps.join(' '));

// 4 · late presenter window, reloads
await jury.evaluate(() => __story.go(5)); await settled();
await pres.close();
const late = await ctx.newPage(); watch(late);
const t0 = Date.now(); await late.goto(`${BASE}/presenter.html?prototype`);
await late.waitForFunction(() => window.__presenter?.cur === 'C1', null, { timeout: 3000 }).catch(() => {});
ok('a presenter window opened late shows the current state (C1) at once', (await late.evaluate(() => __presenter.cur)) === 'C1', `${Date.now() - t0} ms after navigation`);
await jury.reload(); await jury.waitForFunction(() => window.__story?.ready, null, { timeout: 60000 });
ok('reloading the jury window keeps the state', (await state()) === 'C1');
await jury.keyboard.press('ArrowRight'); await late.waitForFunction(() => __presenter.cur === 'C2', null, { timeout: 3000 }).catch(() => {});
ok('after a jury reload the presenter still follows', (await late.evaluate(() => __presenter.cur)) === 'C2');
await settled();
await late.reload(); await late.waitForFunction(() => window.__presenter?.cur === 'C2', null, { timeout: 3000 }).catch(() => {});
ok('reloading the presenter window keeps the state', (await late.evaluate(() => __presenter.cur)) === 'C2');
const pv = await late.evaluate(() => ({ canvas: document.querySelectorAll('canvas').length, media: document.querySelectorAll('audio,video').length }));
ok('the presenter window has no 3D canvas and no media', pv.canvas === 0 && pv.media === 0, JSON.stringify(pv));
const juryNotes = await jury.evaluate(() => document.body.innerText.includes('Prochain clic') || !!document.querySelector('aside, .notes, button'));
ok('the jury window shows no notes and no buttons', !juryNotes);

// 5 · same state, same image: forward / back / direct jump (hash) / reload
const shot = async (id, how) => { await settled(); await jury.waitForTimeout(700); await jury.screenshot({ path: `${OUT}${id}-${how}.png` }); };
await jury.evaluate(() => __story.go(0)); await settled();
for (let i = 0; i < 11; i++) { if (i) { await jury.keyboard.press('ArrowRight'); } await shot(IDS[i], 'forward'); }
for (let i = 10; i >= 0; i--) { if (i < 10) { await jury.keyboard.press('ArrowLeft'); } await shot(IDS[i], 'back'); }
for (const id of IDS) { await jury.goto(`${BASE}/?prototype&test&still&r=${id}#${id}`); await jury.waitForFunction(() => window.__story?.ready, null, { timeout: 60000 }); await shot(id, 'reload'); }
try {
  const diff = execFileSync('python3', [new URL('./compare.py', import.meta.url).pathname, OUT, ...IDS], { encoding: 'utf8' });
  const bad = diff.split('\n').filter(l => l.startsWith('DIFF'));
  ok('each state gives the same image forward, back and after reload', bad.length === 0, bad.length ? bad.join(' | ') : 'all 11 states within tolerance');
} catch (e) { ok('image comparison', false, String(e).slice(0, 200)); }

ok('no request left this machine (offline-safe)', external.length === 0, external.length ? [...new Set(external)].slice(0, 5).join(' ') : 'all from 127.0.0.1');
const errs = [...new Set(errors)].filter(e => !/PCFSoftShadowMap/.test(e));
ok('no JavaScript error in either window', errs.length === 0, errs.slice(0, 3).join(' | '));
await browser.close();
const failed = results.filter(r => !r.pass).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
