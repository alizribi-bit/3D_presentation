// @ts-check
/** Check the changed visuals after animation and every standalone reader step. */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const {chromium}=createRequire('/home/ali/.claude/skills/deck-kit/export/package.json')('playwright-core');
const root=resolve(process.argv[2]||'.');
const out=resolve(root,'qa/20min/discours-demandes/visuel-cible');
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
let checks=0;
try {
  for (const [width,height] of [[1920,1080],[1366,768]]) {
    const context=await browser.newContext({viewport:{width,height}});
    const page=await context.newPage();
    await page.goto(pathToFileURL(resolve(root,'deck.offline.html')).href);
    await page.waitForFunction(()=>window.__ready);
    const model=await page.evaluate(()=>window.__deck.slides);
    for (const id of ['secrets','validation']) {
      const index=model.findIndex(s=>s.id===id);
      for (let step=0;step<=model[index].steps;step++) {
        await page.evaluate(({index,step})=>Deck.goto(index,step),{index,step});
        await page.waitForTimeout(3500);
        const actual=await page.locator('#'+id).evaluate(section=>{
          const visible=el=>{
            for(let node=el;node&&node!==section.parentElement;node=node.parentElement) {
              const css=getComputedStyle(node);
              if(Number(css.opacity)<.98||css.visibility==='hidden'||css.display==='none')return false;
            }
            return true;
          };
          return section.id==='validation'
            ? [...section.querySelectorAll('.pm')].filter(visible).map(el=>el.querySelector('h3').firstChild.textContent.trim())
            : {shot:visible(section.querySelector('.shot')),backup:!!section.querySelector('.data,.sprint-marker')};
        });
        assert.deepEqual(actual,id==='validation'
          ? (step===0?['Staging','Données']:['Staging','Données','Production','Mobile'])
          : {shot:step===2,backup:false});
        checks++;
        await page.screenshot({path:resolve(out,`${width}-${id}-${step}.png`)});
      }
    }
    await page.goto(pathToFileURL(resolve(root,'discours.html')).href);
    const readerModel=await page.evaluate(()=>DATA.slides);
    assert.equal(readerModel.length,35);checks++;
    for (let i=0;i<readerModel.length;i++) {
      for (let step=0;step<readerModel[i].steps.length;step++) {
        if(i||step)await page.keyboard.press('ArrowRight');
        assert.deepEqual(await page.evaluate(()=>[si,st]),[i,step]);
        assert.equal(await page.locator('#title').textContent(),readerModel[i].title);
        assert.deepEqual(await page.locator(`#steps .blk[data-d="${step}"]:not(.fw) p`).allTextContents(),readerModel[i].steps[step].map(line=>line.x));
        checks++;
      }
    }
    await page.keyboard.press('Home');
    assert.deepEqual(await page.evaluate(()=>[si,st]),[0,0]);checks++;
    await context.close();
  }
  writeFileSync(resolve(out,'resultat.json'),JSON.stringify({checks,status:'PASS',resolutions:['1920x1080','1366x768']},null,2));
  console.log(`${checks}/${checks} PASS: changed visuals and all standalone reader steps`);
} finally {await browser.close();}
