// Resting projection views. Normal-speed navigation is verified separately in normal-route.json.
import {chromium} from 'playwright-core';
import {mkdirSync,writeFileSync} from 'node:fs';
import {qaArgs} from './qa-browser.mjs';
const base=process.argv[2]||'http://127.0.0.1:4320';
const out='review/20min/projection';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:qaArgs});
const results=[];
try{
 for(const [width,height,ids] of [[1366,768,['modele-0','modele-1','methodologie-0','validation-1']],[1920,1080,['secrets-2','supervision-3']]]){
  const page=await browser.newPage({viewport:{width,height}});
  await page.goto(`${base}/?test#couverture-0`);await page.waitForFunction(()=>window.__story?.ready,null,{timeout:90000});
  await page.evaluate(()=>{
   // Keep actual scene evaluation and time, draw the GPU canvas once per resting view.
   __story.renderer.setAnimationLoop(null);
   const frame=()=>{__story.director.frame(performance.now()/1000);requestAnimationFrame(frame);};requestAnimationFrame(frame);
  });
  for(const id of ids){
   await page.evaluate(id=>__story.go(__story.states.findIndex(s=>s.id===id),{instant:true}),id);
   await page.waitForFunction(id=>__story.state===id&&document.querySelector('#p-evidence')?.dataset.frame===id,id,{timeout:30000});
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelector('#p-evidence').shadowRoot.querySelectorAll('img')].map(i=>i.decode()));});
   await page.waitForTimeout(800);
   await page.evaluate(()=>{const d=__story.director;__story.renderer.render(d.actors.guide.root.parent,d.camera);});
   const file=`${width}-${id}.png`;await page.screenshot({path:`${out}/${file}`,timeout:60000});
   results.push({id,viewport:[width,height],quality:'normal',restingView:true,file});console.log(`Captured ${file}`);
  }
  await page.close();
 }
}finally{await browser.close();writeFileSync(`${out}/views.json`,JSON.stringify(results,null,2)+'\n');}
