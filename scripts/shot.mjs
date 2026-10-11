// Dev helper: render URLs at 1920×1080 in Chrome and save PNGs.  node scripts/shot.mjs out.png "url" [more pairs…]
import { chromium } from 'playwright-core';
const args = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=vulkan', '--enable-features=Vulkan', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = []; page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') { errs.push(m.text()); console.log('[page]', m.text().slice(0, 300)); } }); page.on('pageerror', e => { errs.push(String(e)); console.log('[pageerror]', String(e).slice(0, 400)); });
for (let i = 0; i < args.length; i += 2) {
  await page.goto(args[i + 1].replace('#', `${args[i + 1].includes('?') ? '&' : '?'}n=${i}#`));
  await page.waitForFunction(() => window.__story?.ready && window.__story?.settled, null, { timeout: 120000 });
  await page.waitForTimeout(+(process.env.WAIT || 600));
  await page.screenshot({ path: args[i] });
  console.log('saved', args[i]);
}
if (errs.length) console.log('console:', [...new Set(errs)].slice(0, 15).join('\n'));
await browser.close();
