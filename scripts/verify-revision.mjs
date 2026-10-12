// Additional checks specific to the accepted 44-sequence revision, at normal animation speed.
import { chromium } from 'playwright-core';
import { qaArgs } from './qa-browser.mjs';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const BASE = process.argv[2] || 'http://127.0.0.1:4318';
const viewport = process.env.VIEWPORT === '1366x768' ? { width: 1366, height: 768 } : { width: 1920, height: 1080 };
const OUT = new URL(`../review/revision/${viewport.width}x${viewport.height}/`, import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const rows = JSON.parse(readFileSync(new URL('../content/source/sequences.json', import.meta.url)));
const results = [], errors = [], external = [];
const ok = (name, pass, detail = '') => { results.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'} ${name} ${detail}`); };
const browser = await chromium.launch({ channel: 'chrome', headless: true,
  args: qaArgs });
const ctx = await browser.newContext({ viewport });
await ctx.route('**/*', route => {
  const url = new URL(route.request().url());
  if (!['127.0.0.1', 'localhost'].includes(url.hostname)) { external.push(url.href); return route.abort(); }
  return route.continue();
});
ctx.on('page', page => page.on('pageerror', error => errors.push(error.message)));
const page = await ctx.newPage();
const settled = () => page.waitForFunction(() => __story.settled, null, { timeout: 45000 });
const go = async id => {
  await page.evaluate(id => {
    const index = __story.states.findIndex(state => state.id === id);
    if (index < 0) throw new Error(`Unknown state ${id}`);
    __story.go(index, { instant: true });
  }, id);
  await settled(); await page.waitForTimeout(180);
  await page.waitForFunction(id => {
    const ref = __story.director.state.evidence;
    return (!ref && __story.director.state.panels.every(name => document.getElementById(`p-${name}`)?.classList.contains('on'))) || (document.querySelector('#p-evidence')?.dataset.frame === id
      && document.querySelector('#p-evidence')?.classList.contains('on'));
  }, id, { timeout: 15000 });
  await page.waitForFunction(() => [...(document.querySelector('#p-evidence')?.shadowRoot?.querySelectorAll('img') ?? [])]
    .every(img => img.complete && img.naturalWidth > 0), null, { timeout: 10000 });
};
const evidenceText = () => page.evaluate(() => document.querySelector('#p-evidence')?.shadowRoot?.querySelector('.slide')?.innerText ?? '');
const normalize = text => text.replaceAll('’', "'").replace(/\s+/g, ' ');
try {
  await page.goto(`${BASE}/?test&still#sommaire-1`);
  await page.waitForFunction(() => window.__story?.ready, null, { timeout: 60000 });
  await page.waitForTimeout(1000);
  const roadmap = await page.evaluate(() => [...document.querySelectorAll('.label.on')].map(label => {
    const box = label.querySelector('.tag').getBoundingClientRect();
    return { id: label.id, left: box.left, right: box.right, top: box.top, bottom: box.bottom,
      inside: box.width > 0 && box.left >= 0 && box.top >= 0 && box.right <= innerWidth && box.bottom <= innerHeight };
  }));
  ok('all six roadmap markers are within the viewport', roadmap.length === 6 && roadmap.every(label => label.inside), JSON.stringify(roadmap));
  const readMismatches = [];
  for (const row of rows) for (let step = 0; step <= row.steps; step++) {
    const quotes = [...row.speech[step].matchAll(/\[lire\]\s*«([\s\S]*?)»/g)].map(match => match[1].trim());
    if (!quotes.length) continue;
    await go(`${row.id}-${step}`);
    const text = normalize(await evidenceText());
    const panelText = await page.evaluate(() => [...document.querySelectorAll('.pane.on')].map(el => el.innerText).join(' ').replace(/\s+/g, ' '));
    // The real BMC contains its source wording as pixels, checked visually in the dedicated captures.
    if (row.id === 'modele' && step > 0) {
      ok(`BMC ${step} keeps the real highlighted source crop`, await page.evaluate(() => [...document.querySelector('#p-evidence').shadowRoot.querySelectorAll('img')].some(img => /v6-bmc-(segments|valeur|revenus)/.test(img.src))));
    }
    for (const quote of quotes) if (!(text + ' ' + normalize(panelText)).includes(normalize(quote))) readMismatches.push({ id: `${row.id}-${step}`, quote });
  }
  ok('every [lire] phrase is projected word for word in its state', readMismatches.length === 0, JSON.stringify(readMismatches));
  for (const step of [0, 1, 2, 3, 4, 3, 2, 1, 0]) {
    await go(`parcours-app-${step}`);
    const result = await page.evaluate(() => {
      const root = document.querySelector('#p-evidence').shadowRoot;
      const images = [...root.querySelectorAll('img')].map(img => ({ src: img.getAttribute('src'), complete: img.complete && img.naturalWidth > 0, width:img.getBoundingClientRect().width, height:img.getBoundingClientRect().height, naturalRatio:img.naturalWidth/img.naturalHeight }));
      return { text: root.querySelector('.slide').innerText, images,
        phone: !!root.querySelector('.phone,.phone-frame,.mobile-frame,[data-phone]') };
    });
    const admin = step === 0 || step === 2;
    ok(`interface state ${step} restores real images and ${admin ? 'has no phone or APK' : 'pairs web and mobile'}`,
      result.images.length === (admin ? 1 : 2) && result.images.every(image => image.complete)
      && (admin ? !result.phone && !/APK|mobile|téléphone/i.test(result.text.replace('Un même parcours sur le web et le mobile', '')) : true), JSON.stringify(result.images));
    if (step === 0) {
      ok('assignment state uses the new real administration capture', result.images[0]?.src?.endsWith('admin-envoi-grille.png'));
      const capture=result.images[0];
      ok('assignment modal is enlarged and preserves its full proportions',capture.height>=viewport.height*.60&&Math.abs(capture.width/capture.height-capture.naturalRatio)<.01,JSON.stringify(capture));
    }
    await page.screenshot({ path: `${OUT}parcours-app-${step}.png` });
  }
  for (const step of [0, 1, 2]) {
    await go(`sequence-${step}`);
    const diagram = await page.evaluate(() => {
      const root = document.querySelector('#p-evidence').shadowRoot;
      return { svg: root.querySelectorAll('svg').length, text: root.querySelector('.slide').innerText,
        svgText: [...root.querySelectorAll('svg text')].map(el => el.textContent).join(' ') };
    });
    const text = diagram.text + ' ' + diagram.svgText;
    ok(`technical sequence diagram ${step} keeps four participants`, diagram.svg > 0 && ['Entreprise', 'API Spring Boot', 'PostgreSQL', 'Administrateur'].every(participant => text.includes(participant)));
    if (step === 2) ok('API diagram includes the access alternative', /autoris/i.test(text) && /refus|bloqu/i.test(text));
    await page.screenshot({ path: `${OUT}sequence-${step}.png` });
  }
  for (const id of ['devsecops-0','devsecops-1']) {
    await go(id);
    const labels = await page.evaluate(() => [...document.querySelectorAll('.stage-tag.on,.side.on')].map(element => {
      const rect = element.getBoundingClientRect();
      return { id:element.id, left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom, inside:rect.left>=0&&rect.right<=innerWidth&&rect.top>=0&&rect.bottom<=innerHeight };
    }));
    ok(`${id} keeps all cycle labels within the viewport`, labels.length===9&&labels.every(label=>label.inside), JSON.stringify(labels));
    const fronts = await page.evaluate(() => {
      const scene=__story.director.actors.guide.root.parent, camera=__story.director.camera;
      const visibleMonitors=[];
      scene.traverse(object=>{
        if(object.name!=='decorative-monitor')return;
        const logo=object.getObjectByName('zawedni-monitor-logo');
        if(!logo)return;
        const position=logo.getWorldPosition(camera.position.clone());
        if(Math.hypot(position.x-5,position.z+9.5)>15)return;
        const facing=logo.getWorldDirection(camera.position.clone()).dot(camera.position.clone().sub(position).normalize());
        visibleMonitors.push(facing);
      });
      return visibleMonitors;
    });
    ok(`${id} shows both decorative monitor fronts with their original logo`,fronts.length===2&&fronts.every(value=>value>.3),JSON.stringify(fronts));
    const collisions = labels.flatMap((a,i) => labels.slice(i+1).filter(b=>Math.min(a.right,b.right)>Math.max(a.left,b.left)+1&&Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top)+1).map(b=>`${a.id}/${b.id}`));
    ok(`${id} keeps its text labels separate`,collisions.length===0,JSON.stringify(collisions));
    await page.screenshot({ path: `${OUT}${id}.png` });
  }
  await go('architecture-0');
  ok('architecture board replaces the cycle without overlapping geometry', await page.evaluate(() => {
    let cycle, board; // Inspect the actual rendered scene through the prop roots.
    const root = __story.director.actors.guide.root.parent;
    root.traverse(object => { if(object.name==='devsecops-cycle') cycle=object; if(object.name==='architecture-board') board=object; });
    return board?.visible === true && cycle?.visible === false;
  }));
  await page.screenshot({ path: `${OUT}architecture-0.png` });
  await go('isolation-1');
  const isolation = await evidenceText();
  ok('isolation has a separate network board and forbidden interface-to-database example',
    ['Accès public', "Point d'entrée", 'Application', 'Services internes', 'PostgreSQL'].every(text => isolation.includes(text))
    && /refus|interdit/i.test(isolation) && !/GitHub|ArgoCD|ACR/.test(isolation));
  await page.screenshot({ path: `${OUT}isolation-1.png` });
  const glass = await page.evaluate(() => {
    const host = document.querySelector('#p-evidence'), css = getComputedStyle(host);
    return { background: css.backgroundColor, opacity: css.opacity, blur: css.backdropFilter };
  });
  ok('glass panel keeps its content opaque and uses a translucent surface', glass.opacity === '1' && /^rgba\(/.test(glass.background), JSON.stringify(glass));
  await page.keyboard.press('L');
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#p-evidence')).backdropFilter === 'none', null, { timeout: 5000 });
  const lightweight = await page.evaluate(() => getComputedStyle(document.querySelector('#p-evidence')).backdropFilter);
  ok('light quality removes expensive panel blur', lightweight === 'none', lightweight);
  await page.keyboard.press('L');
  await go('methodologie-1');
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(400); await page.keyboard.press('ArrowRight');
  await settled(); ok('normal-speed travel interruption selects the correct next state', await page.evaluate(() => __story.state === 'outils-dev-0'));
  await go('sequence-2');
  const drift = await page.evaluate(() => {
    const director = __story.director, actor = director.actors.guide;
    const pose = director.pose('guide', director.state, director.state, null, 4, 1, 0);
    pose.still = true; pose.instant = true; pose.pointW = 1;
    actor.apply(pose, 4);
    const before = Object.fromEntries(Object.entries(actor.bones).map(([name, bone]) => [name, bone.quaternion.clone()]));
    for (let i = 0; i < 300; i++) actor.apply(pose, 4);
    return Math.max(...Object.entries(actor.bones).map(([name, bone]) => before[name].normalize().angleTo(bone.quaternion.clone().normalize())));
  });
  ok('actual animated skeleton stays stable across 300 repeated procedural poses', drift < 1e-6, `${drift} rad`);
  const cameraBefore = await page.evaluate(() => __story.director.camera.matrixWorld.elements.slice());
  await page.waitForTimeout(1500);
  const cameraAfter = await page.evaluate(() => __story.director.camera.matrixWorld.elements.slice());
  ok('camera remains stationary during diagram reading', JSON.stringify(cameraBefore) === JSON.stringify(cameraAfter));
  const popupPromise = ctx.waitForEvent('page');
  await page.keyboard.press('N');
  const presenter = await popupPromise;
  await presenter.waitForFunction(() => window.__presenter?.cur === 'sequence-2', null, { timeout: 5000 });
  ok('notes open as a synchronized second window without media or WebGL', await presenter.evaluate(() => !document.querySelector('canvas,video,audio')));
  await presenter.close();
  const autoPromise = ctx.waitForEvent('page');
  await page.goto(`${BASE}/?test&still&pv=auto#sequence-2`);
  const autoPresenter = await autoPromise;
  await autoPresenter.waitForFunction(() => window.__presenter?.cur === 'sequence-2', null, { timeout: 5000 });
  ok('launching with pv=auto opens both synchronized windows automatically', await autoPresenter.evaluate(() => !document.querySelector('canvas,video,audio')));
  await autoPresenter.close();
  ok('no external requests or browser errors', errors.length === 0 && external.length === 0, JSON.stringify({ errors, external }));
} catch (error) { ok('revision QA completed', false, error.stack); }
finally {
  await browser.close();
  writeFileSync(`${OUT}report.json`, JSON.stringify({ date: new Date().toISOString(), rendererMode: process.env.QA_RENDERER || 'vulkan', viewport, results, errors, external }, null, 2) + '\n');
}
process.exitCode = results.some(result => !result.pass) ? 1 : 0;
