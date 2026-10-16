// @ts-check
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const require=createRequire('/home/ali/.claude/skills/deck-kit/export/package.json');
const {chromium}=require('playwright-core');
const root=resolve(process.argv[2]||'.'),out=resolve(root,'qa/20min/discours-demandes/captures');
mkdirSync(out,{recursive:true});
const selected=['argocd','tracabilite','metriques','journaux','secrets'];
let checks=0;
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
try{
for(const [width,height] of [[1920,1080],[1366,768]]){
 const context=await browser.newContext({viewport:{width,height}});
 const external=[],errors=[];
 await context.route('**/*',route=>{if(/^(file:|data:|blob:)/.test(route.request().url()))return route.continue();external.push(route.request().url());return route.abort();});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(pathToFileURL(resolve(root,'deck.offline.html')).href);
 await page.waitForFunction(()=>window.__ready);
 await page.addStyleTag({content:'.dk-ui,.dk-hint,.dk-controls{visibility:hidden!important}'});
 const model=await page.evaluate(()=>window.__deck.slides);
 for(const id of selected){
  const index=model.findIndex(s=>s.id===id);
  for(let step=0;step<=model[index].steps;step++){
   await page.evaluate(({index,step})=>Deck.goto(index,step),{index,step});
   await page.waitForTimeout(2300);
   const problems=await page.locator(`#${id}`).evaluate((section,step)=>{
    const problems=[];
    const visible=el=>{for(let node=el;node&&node!==section.parentElement;node=node.parentElement){const css=getComputedStyle(node);if(Number(css.opacity)<.95||css.visibility==='hidden'||css.display==='none')return false;}return true;};
    const base=section.getBoundingClientRect(),factor=base.width/1920;
    if(base.left<-.5||base.right>innerWidth+.5||base.top<-.5||base.bottom>innerHeight+.5)problems.push('deck does not fit viewport');
    for(const crop of section.querySelectorAll('.proof-crop')){
     if(!visible(crop))continue;
     const rect=crop.getBoundingClientRect();
     const img=crop.querySelector('img');
     const actual=img.getBoundingClientRect();
     const [x,y,w,h]=crop.dataset.proofCrop.split(' ').map(Number);
     const key=crop.dataset.proofKey;
     if(!img.complete||img.naturalWidth===0)problems.push(key+': image not loaded');
     if(x<0||y<0||x+w>img.naturalWidth||y+h>img.naturalHeight)problems.push(key+': crop outside source');
     if(Math.abs(actual.width/actual.height-img.naturalWidth/img.naturalHeight)>.002)problems.push(key+': image distorted');
     if(Math.abs(rect.width/rect.height-w/h)>.003)problems.push(key+': crop aspect incorrect');
     if(rect.left<base.left+90*factor||rect.right>base.right-90*factor||rect.top<base.top+270*factor||rect.bottom>base.top+1005*factor)problems.push(key+': outside safe content area');
     for(const mark of crop.querySelectorAll('.proof-mark')){
      const r=mark.getBoundingClientRect();
      if(r.left<rect.left-.5||r.top<rect.top-.5||r.right>rect.right+.5||r.bottom>rect.bottom+.5)problems.push(key+': clipped highlight');
     }
    }
    const expected = {
      apercu:['market'], argocd:step===2?['argocd']:[],
      tracabilite:[[],['run'],['acr'],['manifest-author','manifest-image'],['pod']][step],
      metriques:step===0?['targets']:[], journaux:step===1?['logs']:[],
      alerte:step===0?['firing']:['firing','emails'], secrets:[],
    }[section.id];
    const displayed=[...section.querySelectorAll('.proof-crop')].filter(visible).map(el=>el.dataset.proofKey);
    if(expected.join(',')!==displayed.join(','))problems.push('missing expected screenshot '+expected.join(','));
    return problems;
   },step);
   assert.deepEqual(problems,[],`${width} ${id}.${step}: ${problems.join(', ')}`);checks++;
   await page.screenshot({path:resolve(out,`${width}-${id}-${step}.png`)});
  }
 }
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);checks+=2;
 await context.close();
}
writeFileSync(resolve(root,'qa/20min/discours-demandes/captures.json'),JSON.stringify({checks,status:'PASS',resolutions:['1920x1080','1366x768']},null,2));
console.log(`${checks}/${checks} PASS: crops, aspect ratios, safe area, highlights, offline loading`);
}finally{await browser.close();}
