import {chromium} from 'playwright-core';
import {mkdirSync,writeFileSync} from 'node:fs';
import {qaArgs} from './qa-browser.mjs';
const out='review/chapter3/preview';mkdirSync(out,{recursive:true});
const b=await chromium.launch({channel:'chrome',headless:true,args:qaArgs});
const p=await b.newPage({viewport:{width:1920,height:1080}});
const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://127.0.0.1:4320/?test&still&q=light#chaine-3');await p.waitForFunction(()=>window.__story?.ready,null,{timeout:90000});
await p.evaluate(()=>{__story.renderer.setAnimationLoop(null);const frame=()=>{__story.director.frame(performance.now()/1000);requestAnimationFrame(frame);};requestAnimationFrame(frame);});
const results=[];
for(const id of ['chaine-3','log4j-1']){
 await p.evaluate(id=>__story.go(__story.states.findIndex(s=>s.id===id),{instant:true}),id);
 await p.waitForFunction(id=>document.querySelector('#p-evidence').dataset.frame===id,id);
 await p.waitForTimeout(700);
 results.push(await p.evaluate(()=>{
  const d=__story.director,ev=document.querySelector('#p-evidence'),root=ev.shadowRoot;
  const board=ev.getBoundingClientRect();
  const visible=e=>e.checkVisibility({opacityProperty:true,visibilityProperty:true});
  const clipped=[...root.querySelectorAll('text,p,h2')].filter(visible).filter(e=>{const r=e.getBoundingClientRect();return r.top<board.top||r.bottom>board.bottom||r.right>board.right;}).map(e=>e.textContent);
  __story.renderer.render(d.actors.guide.root.parent,d.camera);
  return {id:d.state.id,board:{top:board.top,bottom:board.bottom},clipped,labels:[...document.querySelectorAll('.pane.node-tag.on')].map(e=>({text:e.textContent,top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom})),camera:d.camera.position.toArray()};
 }));
 await p.screenshot({path:`${out}/${id}.png`,timeout:60000});
}
await b.close();writeFileSync(`${out}/report.json`,JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors}));
