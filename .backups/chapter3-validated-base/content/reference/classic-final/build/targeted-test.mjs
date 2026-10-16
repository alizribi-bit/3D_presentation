// @ts-check
// Targeted v9 checks use slide identifiers, derive all counters, and run offline.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const require = createRequire(process.env.HOME + '/.claude/skills/deck-kit/export/package.json');
const { chromium } = require('playwright-core');
const directory = resolve(process.argv[2] || '.');
const output = resolve(process.argv[3] || 'qa/v9/screenshots');
mkdirSync(output, { recursive: true });
const allTargets = ['problematique', 'methodologie', 'sequence', 'parcours-app', 'isolation', 'alerte', 'validation', 'bilan'];
// An optional fourth argument limits QA to a comma-separated list of known slide ids.
const targets = process.argv[4] ? process.argv[4].split(',') : allTargets;
assert.ok(targets.every(id=>allTargets.includes(id)), 'Unknown targeted slide identifier');
const rows = readFileSync(resolve(directory, 'SCRIPT.md'), 'utf8').split('\n').filter(line => /^\| \d+ \|/.test(line)).map(line => line.split('|').slice(1,-1).map(cell => cell.trim()));
let checks = 0;
/** @param {string} label @param {boolean} value */
function check(label, value) { assert.ok(value, label); console.log('PASS ' + label); checks++; }
const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', headless:true });
try {
  for (const [width, height] of [[1920,1080], [1366,768]]) {
    const context = await browser.newContext({ viewport:{width,height} });
    /** @type {string[]} */ const errors = [];
    /** @type {string[]} */ const network = [];
    await context.route('**/*', route => {
      if (/^(file:|data:)/.test(route.request().url())) return route.continue();
      network.push(route.request().url()); return route.abort();
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(String(error)));
    await page.goto(pathToFileURL(resolve(directory,'deck.offline.html')).href);
    await page.waitForFunction(() => document.documentElement.classList.contains('dk-ready'));
    const model = await page.evaluate(() => window.__deck.slides);
    /** Effective opacity includes every ancestor, since company captures are grouped by state.
     * @param {string} selector @returns {Promise<boolean>} */
    const shown = selector => page.locator(selector).evaluate(element => {
      let opacity = 1;
      for (let parent = element; parent; parent = parent.parentElement) {
        const style = getComputedStyle(parent);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        opacity *= Number(style.opacity);
      }
      return opacity > .95;
    });
    /** @param {number} slide @param {number} step */
    const jump = async (slide, step) => {
      await page.evaluate(hash => {location.hash=hash;}, `#${slide}${step ? '.'+step : ''}`);
      await page.waitForTimeout(150);
    };
    const [presenter] = await Promise.all([page.waitForEvent('popup'), page.keyboard.press('p')]);
    await presenter.waitForLoadState();
    await presenter.waitForSelector('.dk-pv-now .dk-pv-seg.on');
    for (const id of targets) {
      const index = model.findIndex(slide => slide.id === id);
      const slide = model[index];
      for (let step=0; step<=slide.steps; step++) {
        // Hash jumps intentionally skip animations in deck-kit. Enter from the previous
        // slide, then use real forward keys to capture actual animated frames.
        if(step===0) await jump(index,model[index-1].steps);
        await page.keyboard.press('ArrowRight');
        const groupSelector = id==='sequence' ? '#sequence .stage' : id==='parcours-app' ? '#parcours-app .state' : ['problematique','methodologie'].includes(id) ? `#${id} .panel` : '';
        const monitor = groupSelector ? page.evaluate(async selector => {
          let overlap=false;
          const end=performance.now()+700;
          while(performance.now()<end) {
            await new Promise(resolve=>requestAnimationFrame(resolve));
            if([...document.querySelectorAll(selector)].filter(element=>Number(getComputedStyle(element).opacity)>.01).length>1) overlap=true;
          }
          return !overlap;
        },groupSelector) : Promise.resolve(true);
        await page.waitForTimeout(150);
        // Capture a real frame during the transition, then inspect its settled state.
        await page.screenshot({path:resolve(output,`${width}-${id}-${step}-animation.png`)});
        if(groupSelector) check(`${width} ${id}.${step}: old and new text never overlap during animation`,await monitor);
        await page.waitForTimeout(id==='alerte' ? 2550 : 1550);
        await page.screenshot({path:resolve(output,`${width}-${id}-${step}.png`)});
        const source = rows[index][7].split(' [clic] ')[step];
        const quotes = [...source.matchAll(/\[lire\] « (.*?) »/g)].map(match => match[1]);
        for (const quote of quotes) {
          const found = await page.locator(`#${id}`).evaluate((section,text) => {
            // Ignore notes: a reading cue must match actually projected, visible content.
            const walker=document.createTreeWalker(section,NodeFilter.SHOW_ELEMENT);
            while(walker.nextNode()) {
              const element=/** @type {Element} */(walker.currentNode);
              if(element.closest('aside') || !element.textContent?.includes(text)) continue;
              let visible=true;
              for(let parent=element;parent && parent!==section;parent=parent.parentElement) {
                const style=getComputedStyle(parent);
                if(Number(style.opacity)<.95 || style.display==='none' || style.visibility==='hidden') visible=false;
              }
              // Avoid accepting the whole state wrapper that also contains hidden phrases.
              if(visible && ![...element.children].some(child=>child.textContent?.includes(text))) return true;
            }
            return false;
          },quote);
          check(`${width} ${id}.${step}: reading visible verbatim: ${quote}`,found);
        }
        const normalise = text => text.replaceAll('[lire]', 'À lire:').replace(/À lire\s*:/g,'À lire:').replace(/\s+/g,' ').trim();
        const presenterText = await presenter.locator('.dk-pv-now .dk-pv-seg.on').evaluate(element => {
          const copy=element.cloneNode(true);
          copy.querySelectorAll('.dk-pv-tag').forEach(tag=>tag.remove());
          return copy.textContent;
        });
        check(`${width} ${id}.${step}: presenter note synchronised`, normalise(presenterText)===normalise(source));
        if(id==='parcours-app') {
          const state=page.locator(`#parcours-app .state[data-state="${step}"]`);
          check(`${width} journey ${step}: exactly one active composition`, await shown(`#parcours-app .state[data-state="${step}"]`) && (await page.locator('#parcours-app .state').evaluateAll(states=>states.filter(element=>Number(getComputedStyle(element).opacity)>.95).length))===1);
          const admin=step===0 || step===2;
          check(`${width} journey ${step}: admin has no phone, caption or APK`, admin ? await state.locator('.ph,.apk,.mob').count()===0 : await shown(`#parcours-app .state[data-state="${step}"] .ph`));
          check(`${width} journey ${step}: correct active rail`, await page.locator('#parcours-app .rail .on').evaluateAll((elements,expected)=>elements.every((element,i)=>(Number(getComputedStyle(element).opacity)>.95)===(i===expected)),step));
        }
        if(id==='sequence') check(`${width} sequence ${step}: one chronological stage`,await page.locator('#sequence .stage').evaluateAll((stages,expected)=>stages.every((element,i)=>(Number(getComputedStyle(element).opacity)>.95)===(i===expected)),step));
      }
      // Exercise every backward edge and a direction change while an animation is in flight.
      for(let step=slide.steps-1;step>=0;step--) {
        await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(200);
        check(`${width} ${id}: back restores step ${step}`, (await page.evaluate(()=>location.hash))===`#${index+1}${step ? '.'+step : ''}`);
        if(id==='parcours-app') {
          check(`${width} journey back ${step}: composition restored`,await shown(`#parcours-app .state[data-state="${step}"]`));
          check(`${width} journey back ${step}: active rail restored`,await page.locator('#parcours-app .rail .on').evaluateAll((elements,expected)=>elements.every((element,i)=>(Number(getComputedStyle(element).opacity)>.95)===(i===expected)),step));
          if(step===0 || step===2) check(`${width} journey back ${step}: mobile content hidden`,await page.locator('#parcours-app .company').evaluateAll(states=>states.every(element=>Number(getComputedStyle(element).opacity)<.05)));
        }
      }
      await page.keyboard.press('ArrowRight'); await page.waitForTimeout(100);
      await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(1000);
      check(`${width} ${id}: interrupted reveal returns to entry`, (await page.evaluate(()=>location.hash))===`#${index+1}`);
      if(id==='parcours-app') check(`${width} admin entry after interruption hides all mobile content`,await page.locator('#parcours-app .company').evaluateAll(states=>states.every(element=>Number(getComputedStyle(element).opacity)<.05)));
      if(id==='parcours-app') {
        await jump(index+1,2); await page.waitForTimeout(1200);
        await page.keyboard.press('ArrowRight'); await page.waitForTimeout(100);
        await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(1200);
        check(`${width} admin decision after interruption hides all mobile content`,await shown('#parcours-app .state[data-state="2"]') && await page.locator('#parcours-app .company').evaluateAll(states=>states.every(element=>Number(getComputedStyle(element).opacity)<.05)));
      }
    }
    check(`${width}: no missing images`,await page.evaluate(()=>[...document.images].every(image=>image.complete && image.naturalWidth>0)));
    check(`${width}: zero external requests`,network.length===0);
    check(`${width}: zero browser exceptions`,errors.length===0);
    await presenter.close(); await context.close();
  }
  console.log(`${checks}/${checks} PASS`);
} finally { await browser.close(); }
