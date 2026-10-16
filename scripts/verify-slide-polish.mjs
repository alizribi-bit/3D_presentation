// Observe native Web Animations and real input; do not change animation clocks.
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { qaArgs } from './qa-browser.mjs';
const base = process.argv[2] || 'http://127.0.0.1:4320';
const out = 'review/slide-polish'; mkdirSync(`${out}/screenshots`, { recursive: true });
const report = { checks: [], entrances: [], errors: [], external: [], missing: [], clockModified: false, continuousGPUDrawing: false };
const check = (name, pass, detail) => { report.checks.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'} ${name}`); };
const ids = ['startup-1', 'probleme-1', 'modele-1', 'architecture-1', 'architecture-2', 'architecture-3',
  'chaine-1', 'chaine-2', 'chaine-3', 'analyses-1', 'analyses-3', 'log4j-1', 'log4j-2',
  'argocd-1', 'argocd-2', 'tracabilite-1', 'tracabilite-4', 'supervision-1', 'supervision-3', 'bilan-2', 'limites-3'];
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: qaArgs });
try {
  for (const width of [1920, 1366]) {
    const context = await browser.newContext({ viewport: { width, height: width === 1920 ? 1080 : 768 }, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    page.on('pageerror', e => report.errors.push(e.message));
    page.on('request', r => { if (/^https?:/.test(r.url()) && !r.url().startsWith(base)) report.external.push(r.url()); });
    page.on('response', r => { if (r.status() >= 400) report.missing.push(r.url()); });
    await page.goto(`${base}/?test&q=light`);
    await page.waitForFunction(() => window.__story?.ready, null, { timeout: 90000 });
    await page.evaluate(() => {
      __story.renderer.setAnimationLoop(null);
      window.__entrances = []; window.__entranceAnimations = []; window.__motionSamples = [];
      const native = Element.prototype.animate;
      Element.prototype.animate = function (frames, options) {
        const animation = native.call(this, frames, options);
        if (options.fill === 'backwards') {
          __entrances.push({ tag: this.tagName, namespace: this.namespaceURI, frames, options });
          __entranceAnimations.push(animation);
        }
        return animation;
      };
      const frame = () => {
        __story.director.frame(performance.now() / 1000);
        for (const a of __entranceAnimations) if (a.playState === 'running') {
          const el = a.effect.target;
          __motionSamples.push({ id: __story.state, opacity: +getComputedStyle(el).opacity, translate: getComputedStyle(el).translate });
        }
        requestAnimationFrame(frame);
      }; requestAnimationFrame(frame);
    });
    const at = async id => {
      await page.waitForFunction(id => __story.state === id && __story.settled && document.querySelector('#p-evidence').dataset.frame === id, id, { timeout: 30000 });
      await page.waitForFunction(() => document.querySelector('#p-evidence').shadowRoot.querySelector('.deck')
        .getAnimations({ subtree: true }).every(a => a.playState === 'finished' || a.playState === 'idle'));
    };
    const place = async id => { await page.evaluate(id => __story.go(__story.states.findIndex(s => s.id === id), { instant: true }), id); await at(id); };
    for (const id of ids) {
      const previous = await page.evaluate(id => __story.states[__story.states.findIndex(s => s.id === id) - 1].id, id);
      await place(previous);
      await page.evaluate(() => { __entrances.length = 0; __entranceAnimations.length = 0; });
      await page.keyboard.press('ArrowRight'); await at(id);
      const source = JSON.parse(readFileSync(`public/content/${id.slice(0, id.lastIndexOf('-'))}.json`)).frames[+id.slice(id.lastIndexOf('-') + 1)];
      const data = await page.evaluate(html => {
        const ev = document.querySelector('#p-evidence'), section = ev.shadowRoot.querySelector('section');
        const template = document.createElement('template'); template.innerHTML = html;
        return { canonical: section.outerHTML === template.content.querySelector('section').outerHTML,
          entrances: __entrances, boardOpacity: +getComputedStyle(ev).opacity,
          stageOpacity: +getComputedStyle(document.querySelector('#stage')).opacity,
          idle: __entranceAnimations.every(a => a.playState === 'finished' || a.playState === 'idle') };
      }, source);
      check(`${width} canonical resting content ${id}`, data.canonical && data.idle);
      check(`${width} bounded local entrance ${id}`, data.entrances.every(e =>
        e.options.delay + e.options.duration < 500 && e.frames.every(f => !('transform' in f)) &&
        (e.namespace !== 'http://www.w3.org/2000/svg' || e.frames.every(f => !('translate' in f)))));
      check(`${width} board stays visible ${id}`, data.boardOpacity === 1 && data.stageOpacity === 1);
      report.entrances.push({ width, id, ...data });
      if (['chaine-3', 'argocd-2'].includes(id)) {
        if (id === 'chaine-3') await page.waitForFunction(() => Math.abs(__story.director.actors.guide.root.parent
          .getObjectByName('delivery-version').position.x - 5.75) < 1e-6);
        await page.evaluate(() => { const d = __story.director; __story.renderer.render(d.actors.guide.root.parent, d.camera); });
        await page.screenshot({ path: `${out}/screenshots/${width}-${id}.png`, timeout: 60000 });
      }
    }
    const samples = await page.evaluate(() => __motionSamples);
    check(`${width} native intermediate opacity observed`, samples.filter(s => s.opacity > .01 && s.opacity < .99).length > 5);
    check(`${width} subtle translation observed`, samples.some(s => s.translate !== 'none' && s.translate !== '0px'));
    await place('architecture-0'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowLeft'); await at('architecture-1');
    check(`${width} rapid reversal leaves no detached animation`, await page.evaluate(() => __entranceAnimations.every(a => a.playState === 'finished' || a.playState === 'idle')));
    // Toggle the existing M preference immediately after starting a local reveal.
    await place('chaine-0'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('m'); await at('chaine-1');
    check(`${width} M finishes owned entrances`, await page.evaluate(() => __entranceAnimations.every(a => a.playState === 'finished' || a.playState === 'idle')));
    await page.evaluate(() => { __entrances.length = 0; }); await page.keyboard.press('ArrowRight'); await at('chaine-2');
    check(`${width} reduced motion creates no entrances`, await page.evaluate(() => __entrances.length === 0));
    await context.close();
  }
  check('no exceptions, missing assets or external requests', !report.errors.length && !report.external.length && !report.missing.length);
} finally {
  await browser.close(); writeFileSync(`${out}/browser-report.json`, JSON.stringify(report, null, 2) + '\n');
}
if (report.checks.some(c => !c.pass)) process.exitCode = 1;
