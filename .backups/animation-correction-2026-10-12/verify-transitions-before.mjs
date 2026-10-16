// Run against the production server started by ./present.sh, at real wall-clock speed.
// Both windows share one context, including the actual automatic notes popup.
import { chromium } from 'playwright-core';
import { qaArgs } from './qa-browser.mjs';
import { mkdirSync, writeFileSync, renameSync } from 'node:fs';
import assert from 'node:assert/strict';

const base = process.argv[2] || 'http://127.0.0.1:4318';
const out = 'review/transitions';
mkdirSync(`${out}/raw`, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: process.env.QA_HEADED !== '1',
  args: [...(process.env.QA_GL === '1' ? ['--use-angle=gl', '--use-gl=angle', '--ignore-gpu-blocklist'] : qaArgs), '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'] });
const report = { normalSpeed: true, notesOpen: true, cases: [], errors: [], external: [], clips: [] };
let failure;
try {
  for (const quality of ['normal', 'light']) {
    const context = await browser.newContext({ viewport: { width: 960, height: 540 },
      ...(quality === 'normal' ? { recordVideo: { dir: `${out}/raw`, size: { width: 960, height: 540 } } } : {}) });
    const jury = await context.newPage();
    const juryVideo = jury.video();
    for (const p of [jury]) p.on('pageerror', e => report.errors.push(e.message));
    context.on('request', r => { if (!r.url().startsWith(base) && /^https?:/.test(r.url())) report.external.push(r.url()); });
    const popup = context.waitForEvent('page');
    await jury.goto(`${base}/?test&pv=auto&q=${quality}#sommaire-1`);
    const notes = await popup;
    const notesVideo = notes.video();
    notes.on('pageerror', e => report.errors.push(e.message));
    await jury.waitForFunction(() => window.__story?.ready, null, { timeout: 60000 });
    await notes.waitForFunction(() => window.__presenter?.cur === 'sommaire-1');
    // Warm software drivers before collecting transitions; these frames are never retimed.
    await jury.screenshot({ path: `${out}/warmup-${quality}.png`, timeout: 60000 });
    await jury.waitForTimeout(2000);
    // Wrap the real director after it has built the world. Sampling runs immediately after its
    // own frame, so a panel leak on a single rendered frame is visible to the audit.
    await jury.evaluate(() => {
      window.__audit = { samples: [], violations: [] };
      const d = __story.director, frame = d.frame.bind(d);
      d.frame = now => {
        const tr = d.tr;
        frame(now);
        const stage = document.getElementById('stage');
        const phase = stage.dataset.phase;
        const opacity = +getComputedStyle(stage).opacity;
        const pos = d.camera.position.toArray();
        const walking = d.renderedPoses.guide.walkW;
        const sample = { phase, opacity, pos, walking, t: now, id: d.state.id,
          guide: d.renderedPoses.guide.pos.toArray(), guideOpacity: d.renderedPoses.guide.opacity,
          timing: tr?.timing };
        if (tr) __audit.samples.push(sample);
        if (phase === 'move' || phase === 'settle') {
          if (opacity !== 0 || getComputedStyle(stage).visibility !== 'hidden') __audit.violations.push('content during movement');
          if (document.querySelectorAll('.pane.on').length || !document.getElementById('film').hidden) __audit.violations.push('active panel during movement');
        }
        if (['settle', 'enter', 'done'].includes(phase) && walking !== 0) __audit.violations.push('walking after arrival');
      };
    });
    const states = await jury.evaluate(() => __story.states);
    const index = id => states.findIndex(s => s.id === id);
    async function at(id) {
      await jury.bringToFront();
      await jury.waitForFunction(id => __story.state === id && __story.settled && +document.getElementById('stage').style.opacity === 1, id, { timeout: 15000 });
      await notes.waitForFunction(id => __presenter?.cur === id, id);
      assert.equal(await jury.evaluate(() => {
        const s = __story.director.state;
        return s.panels.every(id => document.getElementById(`p-${id}`).classList.contains('on'))
          && (!s.evidence || document.getElementById('p-evidence').dataset.frame === s.id)
          && (!s.media || !document.getElementById('film').hidden);
      }), true, `${quality}: final panel missing at ${id}`);
    }
    async function prepare(id) {
      await jury.evaluate(i => __story.go(i, { instant: true }), index(id));
      await at(id);
      await jury.waitForTimeout(90);
    }
    async function run(from, to, key, clip = false) {
      // Verify every phase against the real DOM/director independently of the capture driver's
      // frame rate. This is outside the recorded excerpt; the subsequent keyboard trip is live.
      await jury.evaluate(({ from, to }) => {
        const d = __story.director;
        d.go(from, { instant: true }); d.frame(performance.now() / 1000);
        d.go(to);
        const tr = d.tr, timing = tr.timing;
        const offsets = [0, timing.exit / 2,
          timing.exit + timing.movement / 2, timing.arrival - timing.settle / 2,
          timing.arrival + timing.enter / 2, timing.total + .01];
        for (const offset of offsets) {
          d.frame(tr.t0 + offset);
          const stage = document.getElementById('stage'), phase = stage.dataset.phase;
          if (phase === 'move' || phase === 'settle') {
            if (+stage.style.opacity !== 0 || stage.style.visibility !== 'hidden'
              || document.querySelector('.pane.on') || !document.getElementById('film').hidden) {
              throw new Error(`Deterministic panel leak: ${d.state.id}/${phase}`);
            }
          }
        }
      }, { from: index(from), to: index(to) });
      await prepare(from);
      await jury.evaluate(() => { __audit.samples = []; });
      const start = await jury.evaluate(() => performance.now());
      await notes.keyboard.press(key);
      await at(to);
      const end = await jury.evaluate(() => performance.now());
      const samples = await jury.evaluate(() => __audit.samples);
      assert.ok(samples.length, 'No transition was rendered');
      const timing = samples[0].timing;
      const observedPhases = [...new Set(samples.map(s => s.phase))];
      if (timing.movement) {
        for (const s of samples.filter(s => s.phase === 'exit')) {
          const delta = Math.hypot(...s.pos.map((v, i) => v - samples[0].pos[i]));
          assert.ok(delta < 1e-6, 'Camera moved before the exit was complete');
        }
        const landed = samples.find(s => ['settle', 'enter', 'done'].includes(s.phase));
        for (const s of samples.filter(s => ['settle', 'enter', 'done'].includes(s.phase))) {
          assert.ok(Math.hypot(...s.pos.map((v, i) => v - landed.pos[i])) < 1e-6, 'Camera moved under arriving content');
        }
      }
      report.cases.push({ quality, from, to, timing, observedPhases, frames: samples.length, elapsedMs: end - start });
      if (quality === 'normal' && clip) report.clips.push({ from, to, start: start / 1000 - .1, end: end / 1000 + .5 });
      await jury.waitForTimeout(clip && quality === 'normal' ? 600 : 60);
      console.log(`PASS ${quality}: ${from} → ${to} (${(end - start).toFixed(0)} ms)`);
    }
    // Every camera/world boundary, including all six chapters, generic board reuse, film,
    // close approaches and their actual backward-key returns.
    for (let i = 1; i < states.length; i++) {
      if (states[i - 1].shot === states[i].shot) continue;
      const from = states[i - 1].id, to = states[i].id;
      await run(from, to, 'ArrowRight', /^(startup-0|ch[2-6]-0|outils-dev-0)$/.test(to));
      await run(to, from, 'ArrowLeft', to === 'outils-dev-0');
    }
    await run('bilan-0', 'bilan-1', 'ArrowRight');
    await prepare('methodologie-1');
    const liveStart = await jury.evaluate(() => performance.now());
    await notes.keyboard.press('ArrowRight');
    await jury.bringToFront();
    await jury.waitForFunction(() => document.getElementById('stage').dataset.phase === 'move');
    await notes.keyboard.press('ArrowLeft');
    await at('methodologie-1');
    const liveEnd = await jury.evaluate(() => performance.now());
    report.cases.push({ quality, liveBackwardInterrupt: true, final: 'methodologie-1' });
    if (quality === 'normal') {
      report.clips.push({ from: 'methodologie-1', to: 'ch2-0 → interruption → methodologie-1', start: liveStart / 1000 - .1, end: liveEnd / 1000 + .5 });
      await jury.waitForTimeout(600);
    }
    // Interrupt exit, movement, stabilization and reveal; also burst next/prev commands.
    for (const phase of ['exit', 'move', 'settle', 'enter']) {
      await prepare('methodologie-1');
      // Deterministic sampling covers short phases even when a software renderer drops a frame.
      // The transition after interruption still runs in real wall-clock time.
      const continuity = await jury.evaluate(phase => {
        const d = __story.director, before = d.camera.position.clone();
        d.next();
        const tr = d.tr, timing = tr.timing;
        const offsets = { exit: timing.exit / 2, move: timing.exit + timing.movement / 2,
          settle: timing.arrival - timing.settle / 2, enter: timing.arrival + timing.enter / 2 };
        tr.t0 = performance.now() / 1000 - offsets[phase];
        d.frame(performance.now() / 1000);
        before.copy(d.camera.position);
        const actorBefore = d.actors.guide.root.position.clone(), opacity = d.contentOpacity;
        d.prev(); d.frame(d.tr.t0);
        return { camera: before.distanceTo(d.camera.position), actor: actorBefore.distanceTo(d.actors.guide.root.position), opacity: Math.abs(opacity - d.contentOpacity) };
      }, phase);
      assert.ok(continuity.camera < 1e-6 && continuity.actor < 1e-6 && continuity.opacity < 1e-6, 'Interruption snapped the rendered pose');
      await at('methodologie-1');
      report.cases.push({ quality, interrupt: phase, continuity });
    }
    await prepare('methodologie-1');
    for (const key of ['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'ArrowLeft']) {
      await notes.keyboard.press(key); await jury.waitForTimeout(35);
    }
    await at('outils-dev-0');
    report.cases.push({ quality, rapidClicks: 6, final: 'outils-dev-0' });
    for (const chapter of [6, 2, 5, 1, 4, 3]) {
      await notes.keyboard.press(String(chapter));
      const id = await jury.evaluate(() => __story.state);
      await at(id);
      assert.equal(await jury.evaluate(() => __story.director.state.chapter), chapter);
      report.cases.push({ quality, chapterJump: chapter, final: id });
    }
    // Reduced motion can be switched mid-trip without changing a running timeline's speed.
    await prepare('methodologie-1');
    await notes.keyboard.press('ArrowRight');
    await jury.waitForFunction(() => document.getElementById('stage').dataset.phase === 'move');
    await jury.keyboard.press('m'); await at('ch2-0');
    await notes.keyboard.press('ArrowLeft'); await at('methodologie-1');
    await jury.keyboard.press('m');
    report.cases.push({ quality, reducedMotionInterrupt: true });
    const violations = await jury.evaluate(() => __audit.violations);
    assert.deepEqual(violations, [], 'Frame-level transition violations');
    report.cases.push({ quality, frameViolations: violations });
    if (quality === 'normal') {
      await jury.screenshot({ path: `${out}/final-jury.png` });
      await notes.screenshot({ path: `${out}/final-notes.png` });
    }
    await context.close();
    if (juryVideo) {
      renameSync(await juryVideo.path(), `${out}/jury-normal.webm`);
      renameSync(await notesVideo.path(), `${out}/notes-normal.webm`);
    }
  }
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.external, []);
} catch (error) {
  failure = error;
  report.failure = String(error.stack || error);
} finally {
  await browser.close();
  writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2) + '\n');
}
if (failure) throw failure;
console.log(`PASS ${report.cases.length} real-time transition checks with notes open.`);
