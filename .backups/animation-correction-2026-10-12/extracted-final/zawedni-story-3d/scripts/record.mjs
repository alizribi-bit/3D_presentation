// Records the whole prototype path A0 → D3 as the jury sees it (1920×1080, machine GPU), with the fps probe on.
//   node scripts/record.mjs [baseURL]  →  review/parcours.webm (+ fps lines printed)
import { chromium } from 'playwright-core';
import { mkdirSync, renameSync } from 'node:fs';
const BASE = process.argv[2] || 'http://127.0.0.1:4317', OUT = new URL('../review/', import.meta.url).pathname;
mkdirSync(`${OUT}tmp`, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=vulkan', '--enable-features=Vulkan', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, ...(process.env.NOVIDEO ? {} : { recordVideo: { dir: `${OUT}tmp`, size: { width: 1920, height: 1080 } } }) });
const page = await ctx.newPage();
page.on('console', m => { if (m.text().startsWith('[fps]')) console.log(m.text()); });
await page.goto(`${BASE}/?fps${process.env.Q ? `&q=${process.env.Q}` : ''}#A0`);
await page.waitForFunction(() => window.__story?.ready, null, { timeout: 60000 });
await page.waitForTimeout(1500);
const holds = { A0: 1.2, A1: 3.4, A2: 3.6, B1: 4.6, B2: 3.4, C1: 3.6, C2: 2.6, C3: 3.2, D1: 4.8, D2: 3.4, D3: 3 };
for (const id of Object.keys(holds).slice(1)) {
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(holds[id] * 1000);
}
const v = page.video(); await ctx.close(); await browser.close();
if (v) { renameSync(await v.path(), `${OUT}parcours${process.env.Q ? `-${process.env.Q}` : ''}.webm`); console.log('saved review/parcours.webm'); }
