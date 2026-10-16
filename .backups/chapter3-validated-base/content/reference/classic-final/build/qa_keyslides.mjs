// @ts-check
/** Live, settled captures of the restored originals; exports cover every rest state. */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const {chromium}=createRequire('/home/ali/.claude/skills/deck-kit/export/package.json')('playwright-core');
const root=resolve(process.argv[2]||'.'),out=resolve(root,'qa/20min/discours-demandes/visuel-live');mkdirSync(out,{recursive:true});
const ids=['couverture','sommaire','ch1','startup','modele','methodologie','ch3','ch4','ch5','ch6','bilan','limites'];
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});let checks=0;
try{
for(const [width,height] of [[1920,1080],[1366,768]]){
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(pathToFileURL(resolve(root,'deck.offline.html')).href);await page.waitForFunction(()=>window.__ready);
 await page.addStyleTag({content:'.dk-ui,.dk-hint,.dk-controls{visibility:hidden!important}'});
 const model=await page.evaluate(()=>window.__deck.slides);
 for(const id of ids){const index=model.findIndex(s=>s.id===id);
 for(let step=0;step<=model[index].steps;step++){
  await page.evaluate(({index,step})=>Deck.goto(index,step),{index,step});
  await page.waitForTimeout(id==='couverture'?4200:3300);
  const problems=await page.locator('#'+id).evaluate((section,step)=>{
   const errors=[];
   const visible=el=>{for(let n=el;n&&n!==section.parentElement;n=n.parentElement){const css=getComputedStyle(n);if(Number(css.opacity)<.98||css.visibility==='hidden'||css.display==='none'||/^inset\(100%/.test(css.clipPath))return false;}return true;};
   const check=(label,actual,expected)=>{if(actual!==expected)errors.push(label);};
   const rect=section.getBoundingClientRect();
   if(rect.left<-.5||rect.right>innerWidth+.5||rect.top<-.5||rect.bottom>innerHeight+.5)errors.push('canvas bounds');
   if(section.id==='couverture'){
    const mask=section.querySelector('h1 .dk-mask-i');
    check('full cover title',Math.abs(new DOMMatrixReadOnly(getComputedStyle(mask).transform).m42)<.1,step===1);
    check('all jury members',Array.from(section.querySelectorAll('.jury>div')).every(visible),step===1);
   }
   if(section.id==='sommaire') check('five complete TOC entries',[...section.querySelectorAll('.list li')].filter(visible).length,step===1?5:0);
   if(section.id==='startup') check('service accompanies click',visible(section.querySelector('.mis')),step===1);
   if(section.id==='modele'){
    check('complete BMC',visible(section.querySelector('.complete img')),true);
    check('two focuses same click',[...section.querySelectorAll('[data-bmc-focus]')].filter(visible).length,step===1?2:0);
    check('two detailed views same click',[...section.querySelectorAll('.bmc-details img')].filter(visible).length,step===1?2:0);
   }
   if(section.id==='methodologie'){
    check('Scrum before click',visible(section.querySelector('.scrum-diagram')),step===0);
    check('three releases after click',[...section.querySelectorAll('.releases .release')].filter(visible).length,step===1?3:0);
   }
   if(section.id==='bilan')check('two original volets in order',[...section.querySelectorAll('.ct li')].filter(visible).length,step*3);
   if(section.id==='limites')check('original horizons in order',[...section.querySelectorAll('.hz')].filter(visible).length,step);
   return errors;
  },step);
  assert.deepEqual(problems,[],`${width} ${id}.${step}: ${problems.join(',')}`);checks++;
  await page.screenshot({path:resolve(out,`${width}-${id}-${step}.png`)});
 }}
 assert.deepEqual(errors,[]);checks++;await context.close();
}
writeFileSync(resolve(out,'resultat.json'),JSON.stringify({checks,status:'PASS',settled_live:true},null,2));console.log(`${checks}/${checks} PASS: live restored slides after original entrance durations`);
}finally{await browser.close();}
