import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
const base = process.argv[2] || 'http://127.0.0.1:4318';
const browser = await chromium.launch({ channel: 'chrome', headless: false,
  args: ['--use-angle=gl', '--use-gl=angle', '--ignore-gpu-blocklist', '--disable-backgrounding-occluded-windows'] });
const context = await browser.newContext({ viewport: { width: 960, height: 540 } });
context.setDefaultNavigationTimeout(120000);
const jury = await context.newPage(), notes = await context.newPage();
const report = { checks: [], errors: [], external: [], failures: [] };
for (const p of [jury, notes]) p.on('pageerror', e => report.errors.push(e.message));
context.on('request', r => { if (/^https?:/.test(r.url()) && !r.url().startsWith(base)) report.external.push(r.url()); });
async function ready() { await jury.waitForFunction(() => window.__story?.ready, null, { timeout: 120000 }); }
async function at(id) {
  await jury.bringToFront();
  await jury.waitForFunction(id => __story.state === id && __story.settled && +document.getElementById('stage').style.opacity === 1, id, { timeout: 30000 });
  await notes.waitForFunction(id => window.__presenter?.cur === id, id, { timeout: 15000 });
}
function check(name) { report.checks.push(name); console.log(`PASS ${name}`); }
try {
  await jury.goto(`${base}/?test&fast&q=light#bilan-2`, { waitUntil: 'domcontentloaded' }); await ready();
  report.build = await (await jury.request.get(`${base}/build-info.json`)).json().then(info => ({ buildId: info.buildId, projectRoot: info.projectRoot }));
  await notes.goto(`${base}/presenter.html`, { waitUntil: 'domcontentloaded' }); await at('bilan-2');
  await jury.reload({ waitUntil: 'domcontentloaded' }); await ready(); await at('bilan-2');
  check('jury reload restores hash, final panel and notes');
  await notes.reload({ waitUntil: 'domcontentloaded' }); await at('bilan-2');
  check('notes reload recovers the exact cue');
  await notes.close();
  const late = await context.newPage(); await late.goto(`${base}/presenter.html`, { waitUntil: 'domcontentloaded' });
  await late.waitForFunction(() => window.__presenter?.cur === 'bilan-2', null, { timeout: 15000 });
  check('notes opened late recover the exact cue');
  await jury.evaluate(() => __story.go(__story.states.findIndex(s => s.id === 'video-0'), { instant: true }));
  await jury.waitForFunction(() => !document.getElementById('film').hidden);
  await jury.evaluate(() => {
    const video = document.querySelector('#film video');
    window.__pauses = 0;
    const pause = video.pause.bind(video);
    video.pause = () => { __pauses++; pause(); };
  });
  await late.evaluate(() => {
    const channel = new BroadcastChannel('zawedni-story-3d');
    channel.postMessage({ t: 'hello' }); channel.close();
  });
  await late.waitForTimeout(250);
  assert.equal(await jury.evaluate(() => __pauses), 0);
  check('presenter hello never pauses the film or changes its reveal state');
  await jury.keyboard.press('ArrowRight');
  await jury.waitForFunction(() => __story.state === 'video-1' && __story.settled);
  await jury.keyboard.press('ArrowRight');
  await jury.waitForFunction(() => __story.state === 'retour-0' && __story.settled);
  assert.ok(await jury.evaluate(() => __pauses > 0 && document.getElementById('film').hidden && document.querySelector('#film video').paused));
  check('leaving the film pauses media and clears the large surface');
  await jury.keyboard.press('ArrowLeft');
  await jury.waitForFunction(() => __story.state === 'video-1' && __story.settled);
  assert.equal(await jury.evaluate(() => document.getElementById('film').hidden), false);
  check('returning to media restores content without autoplay');
  assert.deepEqual(report.errors, []); assert.deepEqual(report.external, []);
} catch (error) { report.failures.push(String(error.stack || error)); process.exitCode = 1; }
finally {
  await context.close(); await browser.close();
  writeFileSync('review/transitions/recovery.json', JSON.stringify(report, null, 2) + '\n');
}
