// Normal timeline and animation speed; recording intentionally covers selected scenes, not a timed rehearsal.
import { chromium } from 'playwright-core';
import { qaArgs } from './qa-browser.mjs';
import { mkdirSync, renameSync, writeFileSync } from 'node:fs';
const BASE = process.argv[2] || 'http://127.0.0.1:4318';
const OUT = new URL('../review/revision/', import.meta.url).pathname;
mkdirSync(`${OUT}recording-tmp`, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true,
  args: qaArgs });
const context = await browser.newContext({ viewport: { width: 1366, height: 768 },
  recordVideo: { dir: `${OUT}recording-tmp`, size: { width: 1366, height: 768 } } });
const page = await context.newPage(), errors = [], samples = [];
page.on('pageerror', error => errors.push(error.message));
await context.route('**/*', route => ['127.0.0.1', 'localhost'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
const video = page.video();
try {
  await page.goto(`${BASE}/?q=normal#sommaire-1`);
  await page.waitForFunction(() => window.__story?.ready, null, { timeout: 60000 });
  const scene = async (id, { instant = false, hold = 700 } = {}) => {
    await page.evaluate(({ id, instant }) => {
      const index = __story.states.findIndex(state => state.id === id);
      if (index < 0) throw new Error(`Unknown scene ${id}`);
      __story.go(index, { instant });
    }, { id, instant });
    await page.waitForFunction(() => __story.settled, null, { timeout: 45000 });
    await page.waitForTimeout(hold);
    samples.push({ id, recordedAt: Date.now() });
    await page.screenshot({ path: `${OUT}${id}.png` });
  };
  await scene('sommaire-1');
  await scene('startup-0');
  await scene('methodologie-1', { instant: true });
  await page.keyboard.press('ArrowRight'); // Real consecutive chapter travel with walking.
  await page.waitForFunction(() => __story.settled, null, { timeout: 45000 });
  await scene('sequence-0'); await scene('sequence-1'); await scene('sequence-2');
  await scene('parcours-app-0'); await scene('parcours-app-1'); await scene('parcours-app-2');
  await scene('devsecops-0'); await scene('devsecops-1');
  await scene('architecture-0'); await scene('isolation-0'); await scene('isolation-1');
  await scene('chaine-0'); await scene('chaine-1'); await scene('chaine-2'); await scene('chaine-3');
  await scene('alerte-0'); await scene('alerte-1'); await scene('alerte-2');
  await scene('retour-1');
} finally {
  await context.close(); await browser.close();
  if (video) renameSync(await video.path(), `${OUT}revision-normal-speed.webm`);
  writeFileSync(`${OUT}recording.json`, JSON.stringify({ date: new Date().toISOString(), rendererMode: process.env.QA_RENDERER || 'vulkan',
    viewport: { width: 1366, height: 768 }, normalTimeline: true, reducedMotion: false,
    still: false, fast: false, audioRecorded: false, samples, errors }, null, 2) + '\n');
}
if (errors.length) throw new Error(errors.join('\n'));
console.log('Recorded review/revision/revision-normal-speed.webm, normal timeline; browser video capture has no audio track.');
