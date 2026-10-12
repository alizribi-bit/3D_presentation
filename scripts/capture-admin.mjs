// Capture the actual local application. No assignment is submitted and no API response is mocked.
import { chromium } from 'playwright-core';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const SOURCE = '/home/ali/Desktop/zawedniPFEproject';
const origin = 'http://localhost:6064';
const compose = readFileSync(`${SOURCE}/docker-compose.yml`, 'utf8');
const passwordLine = compose.match(/^\s*ADMIN_DEFAULT_PASSWORD:\s*(.+)$/m)?.[1];
if (!passwordLine) throw new Error('Local demonstration bootstrap password is missing.');
const password = passwordLine.trim().replace(/^['"]|['"]$/g, '');
const OUT = new URL('../review/revision/', import.meta.url).pathname;
const dest = new URL('../public/assets/deck/admin-envoi-grille.png', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const requests = [], denied = [], errors = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, locale: 'fr-FR' });
  await context.addInitScript(() => {
    localStorage.setItem('i18nextLng', 'fr');
    localStorage.setItem('zawedni_theme', 'light');
  });
  await context.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (!['127.0.0.1', 'localhost'].includes(url.hostname)) {
      denied.push({ reason: 'external', url: url.href }); return route.abort();
    }
    if (request.method() !== 'GET' && request.method() !== 'OPTIONS'
        && !(request.method() === 'POST' && url.pathname === '/api/auth/login')) {
      denied.push({ reason: 'mutation', path: url.pathname }); return route.abort();
    }
    requests.push({ method: request.method(), path: url.pathname });
    return route.continue();
  });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${origin}/login`, { waitUntil: 'networkidle' });
  await page.locator('input[type=email]').fill('admin@zawedni.com');
  await page.locator('input[type=password]').fill(password);
  await page.locator('button[type=submit]').click();
  await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 30000 });
  await page.goto(`${origin}/companies`, { waitUntil: 'networkidle' });
  const action = page.locator('button[title="Attribuer un accès"]').first();
  await action.waitFor({ timeout: 30000 });
  await action.click();
  // The real modal's heading differs from its submit button; preserve both original labels.
  const assignmentHeading = page.getByRole('heading', { name: 'Envoyer le Questionnaire', exact: true });
  await assignmentHeading.waitFor();
  await page.getByRole('button', { name: 'Envoyer la Grille CSR', exact: true }).waitFor();
  await page.waitForTimeout(650);
  await page.screenshot({ path: `${OUT}admin-envoi-grille-full.png` });
  const heading = assignmentHeading;
  const box = await heading.locator('xpath=ancestor::div[contains(@class,"card-organic")]').boundingBox();
  if (!box) throw new Error('Assignment modal is not visible.');
  const clip = { x: box.x, y: box.y, width: box.width, height: box.height };
  const bytes = await page.screenshot({ path: dest, clip });
  if (requests.some(request => request.path.endsWith('/assign'))) throw new Error('Unexpected assignment request.');
  const sourceBytes = readFileSync(`${SOURCE}/ZawedniAdmin/src/components/AssignmentModal.jsx`);
  const sha = bytes => createHash('sha256').update(bytes).digest('hex');
  const report = { capturedAt: new Date().toISOString(), origin,
    source: 'ZawedniAdmin/src/components/AssignmentModal.jsx', sourceSha256: sha(sourceBytes),
    screenshot: 'assets/deck/admin-envoi-grille.png', screenshotSha256: sha(bytes),
    viewport: { width: 1600, height: 1000 }, clip, requests, denied, errors,
    assignmentSubmitted: false, mockedResponses: false, environment: 'isolated local Docker demonstration' };
  writeFileSync(`${OUT}admin-capture.json`, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ screenshot: report.screenshot, sha256: report.screenshotSha256,
    assignmentSubmitted: false, mockedResponses: false, errors }));
} finally { await browser.close(); }
