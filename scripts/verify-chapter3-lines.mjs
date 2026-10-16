import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { qaArgs } from './qa-browser.mjs';
const out = 'review/chapter3-lines', base = 'http://127.0.0.1:4320';
mkdirSync(`${out}/screenshots`, { recursive: true });
const report = { checks: [], samples: [], errors: [], external: [], missing: [], clockModified: false,
  continuousGPUDrawing: false, worldUpdatesSuspendedDuringNativeEffects: true };
const check = (name, pass, detail) => { report.checks.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'} ${name}`); };
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: qaArgs });
try {
  for (const width of [1920, 1366]) {
    const context = await browser.newContext({ viewport: { width, height: width === 1920 ? 1080 : 768 }, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    page.on('pageerror', e => report.errors.push(e.message));
    page.on('request', r => { if (/^https?:/.test(r.url()) && !r.url().startsWith(base)) report.external.push(r.url()); });
    page.on('response', r => { if (r.status() >= 400) report.missing.push(r.url()); });
    await page.goto(`${base}/?test&q=light#chaine-0`);
    await page.waitForFunction(() => window.__story?.ready, null, { timeout: 90000 });
    await page.evaluate(() => {
      __story.renderer.setAnimationLoop(null); window.__svgSamples = [];
      window.__forceDirector = false;
      window.__canceledRoutes = [];
      const nativeCancel = Animation.prototype.cancel;
      Animation.prototype.cancel = function () {
        const node = this.effect?.target;
        if (['running', 'paused'].includes(this.playState) && node?.getAttribute('pathLength') === '1')
          __canceledRoutes.push({ id: __story.state, value: parseFloat(getComputedStyle(node).strokeDasharray) });
        return nativeCancel.call(this);
      };
      addEventListener('keydown', () => { __forceDirector = true; }, true);
      const frame = () => {
        // Isolate native SVG effects from expensive software-renderer world updates.
        // Process every new input/state and resume normal updates when the effect ends.
        const ev = document.querySelector('#p-evidence');
        if (__forceDirector || ev.dataset.frame !== __story.state || ev.dataset.svgMotion !== 'running')
          __story.director.frame(performance.now() / 1000);
        __forceDirector = false;
        const board = document.querySelector('#p-evidence'), root = board.shadowRoot, svg = root.querySelector('svg');
        if (svg && ['chaine', 'log4j'].includes(__story.director.state.source.seq)) {
          const path = svg.querySelector('path[pathLength="1"]'), line = svg.querySelectorAll('line')[1];
          const marker = svg.querySelector('circle[r="14"]'), dot = svg.querySelector('circle[r="15"]'), badge = svg.querySelector('g[transform^="translate("]');
          const pose = node => { const value = getComputedStyle(node).transform;
            return value === 'none' ? new DOMMatrix() : new DOMMatrix(value); };
          __svgSamples.push({ id: __story.state, running: board.dataset.svgMotion === 'running',
            dash: path ? parseFloat(getComputedStyle(path).strokeDasharray) : null,
            x2: line ? pose(line).a * +line.getAttribute('x2') + pose(line).e : null,
            marker: marker ? [+marker.getAttribute('cx') + pose(marker).e, +marker.getAttribute('cy') + pose(marker).f] : null,
            badge: badge ? badge.getAttribute('transform') : null,
            dotX: dot ? +dot.getAttribute('cx') + pose(dot).e : null, dotOpacity: dot ? +getComputedStyle(dot).opacity : null,
            art: getComputedStyle(root.querySelector('.art')).transform,
            boardOpacity: +getComputedStyle(board).opacity, stageOpacity: +getComputedStyle(document.querySelector('#stage')).opacity });
          const sample = __svgSamples.at(-1);
          if (window.__reverseArmed && sample.id === 'chaine-2' && sample.running && sample.dash > .12 && sample.dash < .45) {
            window.__reverseArmed = false; window.__reverseStart = sample.dash;
            window.__reverseIndex = __svgSamples.length; window.__cancelIndex = __canceledRoutes.length;
            // Dispatch through the same key handler on this actual animation frame,
            // avoiding remote-driver latency that could miss a one-second effect.
            dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
          }
        }
        requestAnimationFrame(frame);
      }; requestAnimationFrame(frame);
    });
    const at = async id => {
      await page.waitForFunction(id => __story.state === id && __story.settled && document.querySelector('#p-evidence').dataset.frame === id, id);
      await page.waitForFunction(() => document.querySelector('#p-evidence').dataset.svgMotion !== 'running'
        && document.querySelector('#p-evidence').shadowRoot.querySelector('.deck').getAnimations({ subtree: true })
          .every(a => a.playState === 'finished' || a.playState === 'idle'));
    };
    const place = async id => { await page.evaluate(id => __story.go(__story.states.findIndex(s => s.id === id), { instant: true }), id); await at(id);
      await page.waitForFunction(() => !document.body.classList.contains('instant')); };
    const inspect = async id => {
      const seq = id.slice(0, id.lastIndexOf('-')), step = +id.slice(id.lastIndexOf('-') + 1);
      const html = JSON.parse(readFileSync(`public/content/${seq}.json`)).frames[step];
      check(`${width} exact canonical SVG after ${id}`, await page.evaluate(html => {
        const t = document.createElement('template'); t.innerHTML = html;
        return document.querySelector('#p-evidence').shadowRoot.querySelector('section').outerHTML === t.content.querySelector('section').outerHTML;
      }, html));
      const samples = await page.evaluate(id => __svgSamples.filter(s => s.id === id && s.running), id);
      report.samples.push({ width, id, frames: samples });
      check(`${width} continuous visible board ${id}`, samples.length > 2 && samples.every(s => s.boardOpacity === 1 && s.stageOpacity === 1));
      if (id === 'chaine-1') check(`${width} compaction animates smoothly`, new Set(samples.map(s => s.art)).size > 2);
      if (seq === 'chaine' && step > 1) {
        const start = step === 2 ? 0 : .548173, end = step === 2 ? .548173 : 1;
        check(`${width} line draws intermediate lengths ${id}`, new Set(samples.filter(s => s.dash > start + .01 && s.dash < end - .01).map(s => s.dash)).size >= 2);
        check(`${width} marker follows horizontal then vertical route ${id}`, samples.every(s =>
          Math.abs(s.marker[1] - 665) < .01 || Math.abs(s.marker[0] - 1640) < .01));
      }
      if (seq === 'log4j') {
        const start = step === 1 ? 150 : 721, end = step === 1 ? 721 : 1770;
        check(`${width} line grows continuously ${id}`, new Set(samples.filter(s => s.x2 > start + 5 && s.x2 < end - 5).map(s => s.x2)).size >= 2);
        if (step === 1) check(`${width} line stops at Dependency-Check`, await page.evaluate(() =>
          +document.querySelector('#p-evidence').shadowRoot.querySelectorAll('line')[1].getAttribute('x2') === 721));
        else check(`${width} corrected version visibly follows the line`, samples.filter(s => s.dotOpacity > .1 && s.dotX > 726 && s.dotX < 1765).length > 2);
      }
      if (['chaine-3', 'log4j-1', 'log4j-2'].includes(id)) {
        await page.evaluate(() => { const d = __story.director; __story.renderer.render(d.actors.guide.root.parent, d.camera); });
        await page.screenshot({ path: `${out}/screenshots/${width}-${id}.png`, timeout: 60000 });
      }
    };
    await at('chaine-0');
    // Drain initial software-renderer work before observing a one-second SVG effect.
    await page.waitForFunction(() => __svgSamples.length >= 10 && !document.body.classList.contains('instant'));
    for (const id of ['chaine-1', 'chaine-2', 'chaine-3']) { await page.keyboard.press('ArrowRight'); await at(id); await inspect(id); }
    await place('log4j-0');
    for (const id of ['log4j-1', 'log4j-2']) { await page.keyboard.press('ArrowRight'); await at(id); await inspect(id); }
    await page.keyboard.press('ArrowLeft'); await at('log4j-1');
    check(`${width} reverse line returns to blocker`, await page.evaluate(() =>
      +document.querySelector('#p-evidence').shadowRoot.querySelectorAll('line')[1].getAttribute('x2') === 721));
    await place('chaine-1');
    await page.evaluate(() => { window.__reverseArmed = true; window.__reverseStart = null; });
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(() => __reverseStart !== null); await at('chaine-1');
    const reversal = await page.evaluate(() => ({ beforeInput: __reverseStart,
      beforeReplacement: __canceledRoutes.slice(__cancelIndex).find(s => s.id === 'chaine-1')?.value,
      after: __svgSamples.slice(__reverseIndex).find(s => s.id === 'chaine-1' && s.running)?.dash }));
    check(`${width} interrupted line reverses from visible progress`, reversal.beforeReplacement > .03
      && reversal.beforeReplacement < .548173 && reversal.after > .01
      && Math.abs(reversal.after - reversal.beforeReplacement) < .05, reversal);
    await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await at('chaine-3');
    check(`${width} rapid advances end at full line`, await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#p-evidence').shadowRoot.querySelector('path[pathLength="1"]')).strokeDasharray) === 1));
    await place('log4j-0'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(250); await page.keyboard.press('m'); await at('log4j-1');
    check(`${width} M restores canonical line immediately`, await page.evaluate(() => document.querySelector('#p-evidence').dataset.svgMotion === 'idle'
      && +document.querySelector('#p-evidence').shadowRoot.querySelectorAll('line')[1].getAttribute('x2') === 721));
    await page.keyboard.press('ArrowRight'); await at('log4j-2');
    check(`${width} reduced motion skips drawing`, await page.evaluate(() => document.querySelector('#p-evidence').dataset.svgMotion === 'idle'));
    await context.close();
  }
  check('no errors, missing assets or external requests', !report.errors.length && !report.external.length && !report.missing.length);
} finally { await browser.close(); writeFileSync(`${out}/browser-report.json`, JSON.stringify(report, null, 2) + '\n'); }
if (report.checks.some(c => !c.pass)) process.exitCode = 1;
