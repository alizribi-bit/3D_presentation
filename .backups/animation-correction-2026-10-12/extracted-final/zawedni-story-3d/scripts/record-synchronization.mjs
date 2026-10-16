// Two simultaneous recordings in one context; commands are real keyboard/button clicks at normal speed.
import { chromium } from 'playwright-core';
import { qaArgs } from './qa-browser.mjs';
import { mkdirSync, renameSync, writeFileSync } from 'node:fs';
const base=process.argv[2]||'http://127.0.0.1:4318';
const out='review/classic/recording';mkdirSync(`${out}/raw`,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:qaArgs});
const context=await browser.newContext({viewport:{width:1366,height:768},recordVideo:{dir:`${out}/raw`,size:{width:1366,height:768}}});
const jury=await context.newPage(),presenter=await context.newPage();
const juryVideo=jury.video(),notesVideo=presenter.video();
const events=[],errors=[];let start;
for(const p of [jury,presenter])p.on('pageerror',e=>errors.push(e.message));
async function state(id,hold=1800){
 await presenter.waitForFunction(id=>window.__presenter?.cur===id,id,{timeout:4000});
 await jury.waitForFunction(()=>window.__story?.settled,null,{timeout:15000});
 events.push({id,at:Date.now(),jury:await jury.evaluate(()=>__story.state),presenter:await presenter.evaluate(()=>__presenter.cur)});
 await jury.waitForTimeout(hold);
}
try{
 await jury.goto(`${base}/?test#sequence-0`);await jury.waitForFunction(()=>window.__story?.ready,null,{timeout:60000});
 await presenter.goto(`${base}/presenter.html`);await state('sequence-0');start=Date.now();
 for(const id of ['sequence-1','sequence-2','parcours-app-0','parcours-app-1','parcours-app-2','parcours-app-3','parcours-app-4']){
  await jury.keyboard.press('ArrowRight');await state(id);
 }
 await presenter.locator('#prev').click();await state('parcours-app-3');
 await presenter.locator('#advance').click();await state('parcours-app-4');
 await jury.evaluate(()=>location.hash='#bilan-1');await state('bilan-1');
 await presenter.keyboard.press('ArrowRight');await state('bilan-2',3000);
}finally{
 await context.close();await browser.close();
 renameSync(await juryVideo.path(),`${out}/jury.webm`);renameSync(await notesVideo.path(),`${out}/presenter.webm`);
 writeFileSync(`${out}/events.json`,JSON.stringify({date:new Date().toISOString(),start,normalSpeed:true,audioRecorded:false,events,errors},null,2)+'\n');
}
if(errors.length||events.some(e=>e.jury!==e.presenter))throw new Error('Recording contains an error or synchronization mismatch');
console.log('Recorded simultaneous jury/presenter clicks at normal speed. Browser recordings contain no audio.');
