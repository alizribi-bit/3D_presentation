// Native browser recording of slide strokes; crop the board afterwards for review.
// GPU drawings are frozen between resting states; SVG/DOM animations use real time.
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { qaArgs } from './qa-browser.mjs';
const out = 'review/chapter3-lines'; mkdirSync(`${out}/video`, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: qaArgs });
try {
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 },
    recordVideo: { dir: `${out}/video`, size: { width: 1366, height: 768 } }, reducedMotion: 'no-preference' });
  const created = Date.now(), page = await context.newPage(), video = page.video();
  await page.goto('http://127.0.0.1:4320/?test&q=light#chaine-1');
  await page.waitForFunction(() => window.__story?.ready, null, { timeout: 90000 });
  await page.evaluate(() => {
    __story.renderer.setAnimationLoop(null); window.__captureFrames = 0;
    const frame = () => {
      const ev = document.querySelector('#p-evidence');
      if (ev.dataset.frame !== __story.state || ev.dataset.svgMotion !== 'running') __story.director.frame(performance.now() / 1000);
      __captureFrames++; requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
  const at = async id => {
    await page.waitForFunction(id => __story.state === id && __story.settled && document.querySelector('#p-evidence').dataset.frame === id
      && document.querySelector('#p-evidence').dataset.svgMotion !== 'running' && !document.body.classList.contains('instant'), id);
  };
  const render = () => page.evaluate(() => { const d = __story.director; __story.renderer.render(d.actors.guide.root.parent, d.camera); });
  await at('chaine-1'); await render(); await page.waitForFunction(() => __captureFrames > 12);
  const startSeconds = (Date.now() - created) / 1000;
  await page.waitForTimeout(400); await page.keyboard.press('ArrowRight'); await at('chaine-2');
  await page.waitForTimeout(500); await page.keyboard.press('ArrowRight'); await at('chaine-3'); await page.waitForTimeout(700);
  await page.evaluate(() => __story.go(__story.states.findIndex(s => s.id === 'log4j-1'), { instant: true }));
  await at('log4j-1'); await render(); await page.waitForTimeout(700);
  await page.keyboard.press('ArrowRight'); await at('log4j-2'); await page.waitForTimeout(1000);
  const durationSeconds = (Date.now() - created) / 1000 - startSeconds;
  await context.close(); const path = await video.path();
  writeFileSync(`${out}/video.json`, JSON.stringify({ path, startSeconds, durationSeconds, crop: '1140:448:212:0',
    nativeClock: true, continuousGPUDrawing: false, purpose: 'Review of the slide line drawing only' }, null, 2) + '\n');
  console.log({ path, startSeconds, durationSeconds });
} finally { await browser.close(); }
