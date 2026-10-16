// @ts-check
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const {chromium}=createRequire('/home/ali/.claude/skills/deck-kit/export/package.json')('playwright-core');
const root=resolve(process.argv[2]||'.'),out=resolve(root,'qa/20min/besoin-solution');mkdirSync(out,{recursive:true});
const raw=readFileSync(resolve(root,'SCRIPT.md'),'utf8').split('\n').find(line=>line.startsWith('| 5 |'));const notes=raw.split('|')[8].trim().split(' [clic] ');
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});let checks=0;
const norm=text=>text.replace(/\s+/g,' ').trim();
try{
for(const [width,height] of [[1920,1080],[1366,768]]){
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[],external=[];
 page.on('pageerror',e=>errors.push(String(e)));await context.route('**/*',route=>{if(/^(file:|data:|blob:)/.test(route.request().url()))return route.continue();external.push(route.request().url());return route.abort();});
 await page.goto(pathToFileURL(resolve(root,'deck.offline.html')).href);await page.waitForFunction(()=>window.__ready);await page.addStyleTag({content:'.dk-ui,.dk-hint,.dk-controls{visibility:hidden!important}'});
 const [presenter]=await Promise.all([page.waitForEvent('popup'),page.keyboard.press('p')]);await presenter.waitForLoadState();
 const index=await page.evaluate(()=>__deck.slides.findIndex(slide=>slide.id==='probleme'));
 for(const step of [0,1]){
  if(step===0)await page.evaluate(index=>Deck.goto(index-1,1),index);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(1600);
  const state=await page.locator('#probleme').evaluate(section=>{
   const visible=el=>{for(let node=el;node&&node!==section.parentElement;node=node.parentElement){const css=getComputedStyle(node);if(Number(css.opacity)<.98||css.visibility==='hidden'||css.display==='none')return false;}return true;};
   const panel=section.querySelector('.solution'),rect=panel.getBoundingClientRect(),base=section.getBoundingClientRect(),factor=base.width/1920;
   return {title:section.querySelector('h2').textContent,need:[...section.querySelectorAll('.need-point')].every(visible),solution:visible(panel),benefits:[...section.querySelectorAll('.benefits strong')].filter(visible).length,safe:rect.left>=base.left+60*factor&&rect.right<=base.right-60*factor&&rect.top>=base.top+270*factor&&rect.bottom<=base.bottom-60*factor,rectangle:rect.toJSON()};
  });
  assert.equal(state.title,'Du besoin à la solution ZAWEDNI');assert.equal(state.need,true);assert.equal(state.solution,step===1);assert.equal(state.benefits,step===1?3:0);assert.equal(state.safe,true,JSON.stringify(state.rectangle));checks++;
  const current=await presenter.locator('.dk-pv-now .dk-pv-seg.on').evaluate(el=>{const copy=el.cloneNode(true);copy.querySelectorAll('.dk-pv-tag').forEach(tag=>tag.remove());return copy.textContent;});assert.equal(norm(current),norm(notes[step]));checks++;
  await page.screenshot({path:resolve(out,`${width}-probleme-${step}.png`)});
 }
 await page.keyboard.press('ArrowLeft');await page.waitForTimeout(1300);assert.ok(await page.evaluate(()=>Deck.state.step===0&&Number(getComputedStyle(document.querySelector('#probleme .solution')).opacity)<.01));checks++;
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);checks+=2;await context.close();
}
writeFileSync(resolve(out,'browser.json'),JSON.stringify({checks,status:'PASS',resolutions:['1920x1080','1366x768']},null,2));console.log(`${checks}/${checks} PASS: exact reveal, presenter speech, bounds, reverse navigation and offline`);
}finally{await browser.close();}
