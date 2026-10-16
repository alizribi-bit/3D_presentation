import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { FULL_STATES } from '../src/story/itinerary.ts';
import { qaArgs } from './qa-browser.mjs';

const base = process.argv[2] || 'http://127.0.0.1:4320';
const output = 'review/slide-chrome';
mkdirSync(output, { recursive: true });
const rows = JSON.parse(readFileSync('content/source/sequences.json', 'utf8'));
const errors = [], missing = [], external = [], checks = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: qaArgs });
try {
  for (const [width, height] of [[1920, 1080], [1366, 768], [768, 1024]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) missing.push(response.url()); });
    page.on('request', request => {
      if (/^https?:/.test(request.url()) && !request.url().startsWith(base)) external.push(request.url());
    });
    await page.goto(`${base}/?test&still&q=light`);
    await page.waitForFunction(() => window.__story?.ready, null, { timeout: 90000 });
    await page.evaluate(() => __story.renderer.setAnimationLoop(null));
    for (const [index, state] of FULL_STATES.entries()) {
      const row = rows.find(row => row.id === state.source.seq);
      const frame = state.evidence ? JSON.parse(readFileSync(`public/content/${row.id}.json`, 'utf8')).frames[state.source.step] : null;
      await page.evaluate(index => {
        __story.go(index, { instant: true });
        __story.director.frame(performance.now() / 1000);
      }, index);
      const result = await page.evaluate(({ number, chapter, frame }) => {
        const counter = document.querySelector('#slide-number');
        const header = document.querySelector('#slide-chapters');
        const stage = document.querySelector('#stage').getBoundingClientRect();
        const bottom = counter.getBoundingClientRect(), top = header.getBoundingClientRect();
        const shown = element => {
          for (let parent = element; parent; parent = parent.parentElement) {
            const style = getComputedStyle(parent);
            if (style.visibility !== 'visible' || style.display === 'none' || +style.opacity === 0) return false;
          }
          return true;
        };
        const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        // Proof screenshots zoom inside clipped frames; measure only the visible portion.
        const clippedBounds = element => {
          const rect = element.getBoundingClientRect();
          const bounds = { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
          for (let parent = element.parentElement || element.getRootNode().host; parent;
            parent = parent.parentElement || parent.getRootNode().host) {
            const style = getComputedStyle(parent), clip = parent.getBoundingClientRect();
            if (['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowX)) {
              bounds.left = Math.max(bounds.left, clip.left); bounds.right = Math.min(bounds.right, clip.right);
            }
            if (['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowY)) {
              bounds.top = Math.max(bounds.top, clip.top); bounds.bottom = Math.min(bounds.bottom, clip.bottom);
            }
          }
          return bounds;
        };
        const nodes = [...document.querySelectorAll('.pane.on p, .pane.on h1, .pane.on h2, .pane.on img, .film:not([hidden])')];
        const evidence = document.querySelector('#p-evidence');
        if (evidence.classList.contains('on')) nodes.push(...evidence.shadowRoot.querySelectorAll('p,h1,h2,h3,li,img,text'));
        const collisions = nodes.filter(shown).filter(element => {
          const bounds = clippedBounds(element);
          return bounds.right > bounds.left && bounds.bottom > bounds.top && (overlaps(top, bounds) || overlaps(bottom, bounds));
        }).map(element => element.tagName + ':' + element.textContent.slice(0, 60));
        let canonical = true;
        if (frame) {
          const template = document.createElement('template'); template.innerHTML = frame;
          canonical = evidence.shadowRoot.querySelector('section').outerHTML === template.content.querySelector('section').outerHTML;
        }
        return {
          number: counter.textContent === String(number),
          chapters: [...header.querySelectorAll('li')].map(item => item.textContent).join(',') === '1,2,3,4,5',
          current: [...header.querySelectorAll('[aria-current]')].map(item => +item.dataset.chapter).join(',') === (chapter ? String(chapter) : ''),
          visible: shown(counter) && shown(header),
          margins: top.top >= stage.top && top.bottom < stage.top + stage.height * .05 && bottom.bottom <= stage.bottom && bottom.top > stage.bottom - stage.height * .05,
          inside: top.left >= stage.left && top.right <= stage.right && bottom.left >= stage.left && bottom.right <= stage.right,
          canonical, collisions,
        };
      }, { number: row.seq, chapter: state.chapter, frame });
      checks.push({ width, state: state.id, ...result });
      for (const [key, value] of Object.entries(result)) assert.ok(key === 'collisions' ? !value.length : value, `${width} ${state.id} ${key}: ${JSON.stringify(value)}`);
      if (width !== 768 && ['couverture-1', 'architecture-3', 'chaine-3', 'video-1', 'retour-0'].includes(state.id)) {
        await page.evaluate(() => {
          const director = __story.director;
          __story.renderer.render(director.actors.guide.root.parent, director.camera);
        });
        await page.screenshot({ path: `${output}/${width}-${state.id}.png`, timeout: 60000 });
      }
    }
    // Real navigation retains furniture throughout travel, including chapter changes.
    await page.evaluate(() => {
      __story.go(__story.states.findIndex(state => state.id === 'methodologie-1'), { instant: true });
      __story.director.frame(performance.now() / 1000);
      __story.go(__story.states.findIndex(state => state.id === 'ch3-0'));
      const start = performance.now() / 1000;
      for (const offset of [0, .1, .5, 1, 2, 4, 8]) {
        __story.director.frame(start + offset);
        for (const id of ['slide-number', 'slide-chapters']) {
          if (+getComputedStyle(document.getElementById(id)).opacity !== 1) throw new Error(`Furniture hidden during travel: ${id}`);
        }
      }
    });
    await page.keyboard.press('End');
    await page.evaluate(() => __story.director.frame(performance.now() / 1000 + 20));
    assert.equal(await page.locator('#slide-number').textContent(), '35');
    await page.keyboard.press('Home');
    await page.evaluate(() => __story.director.frame(performance.now() / 1000 + 20));
    assert.equal(await page.locator('#slide-number').textContent(), '1');
    await context.close();
    console.log(`PASS ${width}×${height}: all ${FULL_STATES.length} states, canonical content, margins, no content overlap and persistent travel indicators`);
  }
  assert.deepEqual({ errors, missing, external }, { errors: [], missing: [], external: [] });
} finally {
  await browser.close();
  writeFileSync(`${output}/report.json`, JSON.stringify({ checks, errors, missing, external }, null, 2) + '\n');
}
