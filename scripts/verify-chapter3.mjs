// Real keyboard/notes navigation, real absolute time, and resting GPU projection views.
// This content-specific check avoids continuous software GPU draws; the director,
// camera, actors, scene objects and animations keep updating on requestAnimationFrame.
import {chromium} from 'playwright-core';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {qaArgs} from './qa-browser.mjs';
const base=process.argv[2]||'http://127.0.0.1:4320';
const rows=JSON.parse(readFileSync('content/source/sequences.json'));
const ref=JSON.parse(readFileSync('content/reference/manifest.json'));
const report={checks:[],errors:[],missing:[],external:[],views:[],samples:[],clockModified:false,continuousGPUDrawing:false};
const check=(name,pass,detail)=>{report.checks.push({name,pass,detail});console.log(`${pass?'PASS':'FAIL'} ${name}`);};
const out='review/chapter3';mkdirSync(`${out}/screenshots`,{recursive:true});
const b=await chromium.launch({channel:'chrome',headless:true,args:qaArgs});
try{
 for(const [width,height] of [[1920,1080],[1366,768]]){
  const context=await b.newContext({viewport:{width,height},reducedMotion:'no-preference'});
  context.on('page',p=>p.on('pageerror',e=>report.errors.push(e.message)));
  context.on('response',r=>{if(r.status()>=400)report.missing.push(r.url());});
  context.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(base))report.external.push(r.url());});
  const page=await context.newPage();await page.goto(`${base}/?test&q=light#ch4-0`);await page.waitForFunction(()=>window.__story?.ready,null,{timeout:90000});
  await page.evaluate(()=>{
   __story.renderer.setAnimationLoop(null);window.__samples=[];
   const d=__story.director,frame=()=>{
    d.frame(performance.now()/1000);
    const ev=document.querySelector('#p-evidence'),parcel=d.actors.guide.root.parent.getObjectByName('delivery-version');
    __samples.push({time:performance.now()/1000,id:d.state.id,x:parcel.position.x,stageOpacity:+getComputedStyle(document.querySelector('#stage')).opacity,
      boardOpacity:+getComputedStyle(ev).opacity,layout:ev.dataset.layout,kind:d.tr?.plan.kind,hidden:d.tr?.plan.hiddenPanels||[],camera:d.camera.position.toArray()});
    requestAnimationFrame(frame);
   };requestAnimationFrame(frame);
  });
  const notes=await context.newPage();await notes.goto(`${base}/presenter.html`);
  const at=async id=>{await page.waitForFunction(id=>__story.state===id&&__story.settled&&document.querySelector('#p-evidence').dataset.frame===id,id,{timeout:30000});await notes.waitForFunction(id=>__presenter.cur===id,id,{timeout:20000});await page.waitForFunction(()=>document.querySelector('#p-evidence').shadowRoot.querySelector('.deck').getAnimations({subtree:true}).every(a=>a.playState==='finished'||a.playState==='idle'),null,{timeout:30000});
    await page.waitForFunction(()=>document.querySelector('#p-evidence').dataset.svgMotion!=='running');
    await page.waitForFunction(()=>{
      const d=__story.director,seq=d.state.source.seq,step=d.state.source.step;
      if(!((seq==='chaine'&&step>0)||(seq==='log4j'&&step>0)))return true;
      const target=seq==='chaine'?-5.8+step*3.85:step===1?0:5.8;
      return Math.abs(d.actors.guide.root.parent.getObjectByName('delivery-version').position.x-target)<1e-6;
    },null,{timeout:10000});await page.waitForTimeout(100);};
  const chapter=ref.states.filter(s=>rows.find(r=>r.id===s.slideId).chapter===3);
  for(const [i,state] of chapter.entries()){
   if(i)await page.keyboard.press('ArrowRight');await at(state.id);
   const expected=state.speech.replaceAll('À lire :','');
   const current=await notes.locator('#script .cue p').allTextContents();
   const normalized=s=>s.replace(/[«»]/g,'').replace(/\s+/g,' ').trim();
   check(`${width} notes ${state.id}`,normalized(current.join(' '))===normalized(expected));
   const data=await page.evaluate(()=>{
    const d=__story.director,ev=document.querySelector('#p-evidence'),sec=ev.shadowRoot.querySelector('section'),board=ev.getBoundingClientRect();
    const visible=e=>{for(let n=e;n&&n!==sec.parentElement;n=n.parentElement){const c=getComputedStyle(n);if(c.display==='none'||c.visibility==='hidden'||+c.opacity===0)return false;}return true;};
    const texts=[...sec.querySelectorAll('*')].filter(visible).flatMap(e=>[...e.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent.trim()).filter(Boolean));
    const clipped=[...sec.querySelectorAll('text,p,h2,h3')].filter(visible).filter(e=>{const r=e.getBoundingClientRect();return r.top<board.top-2||r.bottom>board.bottom+2||r.left<board.left-2||r.right>board.right+2;}).map(e=>e.textContent);
    const projectBox=mesh=>{
     mesh.geometry.computeBoundingBox();const bb=mesh.geometry.boundingBox;const points=[];
     for(const x of [bb.min.x,bb.max.x])for(const y of [bb.min.y,bb.max.y])for(const z of [bb.min.z,bb.max.z]){
      const p=mesh.localToWorld(mesh.position.clone().set(x,y,z)).project(d.camera);points.push([(p.x+1)/2*innerWidth,(1-p.y)/2*innerHeight]);
     }
     return {left:Math.min(...points.map(p=>p[0])),right:Math.max(...points.map(p=>p[0])),top:Math.min(...points.map(p=>p[1])),bottom:Math.max(...points.map(p=>p[1]))};
    };
    const scene=d.actors.guide.root.parent,parcel=scene.getObjectByName('delivery-version');
    const gateBoxes=[0,1,2].map(i=>projectBox(scene.getObjectByName(`delivery-gate-${i}`)));
    const labels=[...document.querySelectorAll('.pane.node-tag.on')].map(e=>{const r=e.getBoundingClientRect();return {text:e.textContent,left:r.left,right:r.right,top:r.top,bottom:r.bottom};});
    return {id:d.state.id,layout:ev.dataset.layout,texts,clipped,board:{top:board.top,bottom:board.bottom},gates:gateBoxes,parcel:projectBox(parcel),x:parcel.position.x,color:parcel.material.color.getHexString(),labels,camera:d.camera.position.toArray()};
   });
   check(`${width} exact visible content ${state.id}`,JSON.stringify(data.texts)===JSON.stringify(state.visibleTexts),{missing:state.visibleTexts.filter(t=>!data.texts.includes(t)),extra:data.texts.filter(t=>!state.visibleTexts.includes(t))});
   check(`${width} readable board ${state.id}`,data.clipped.length===0,data.clipped);
   if(data.layout==='delivery'){
    const geometry=[...data.gates,data.parcel];
    check(`${width} 3D below board ${state.id}`,geometry.every(r=>r.top>data.board.bottom+12&&r.bottom<height&&r.left>0&&r.right<width),data);
    check(`${width} separated labels ${state.id}`,data.labels.every((a,i)=>data.labels.slice(i+1).every(c=>a.right+4<c.left||c.right+4<a.left)),data.labels);
   }
   if(state.id==='log4j-1')check(`${width} failed version stops red`,data.x===0&&data.color==='b42020',data);
   if(state.id==='log4j-2')check(`${width} corrected version resumes green`,data.x===5.8&&data.color==='0d7b3c',data);
   if(['chaine-1','chaine-3','log4j-1','log4j-2','argocd-2'].includes(state.id)){
    await page.evaluate(()=>{const d=__story.director;__story.renderer.render(d.actors.guide.root.parent,d.camera);});
    const file=`${width}-${state.id}.png`;await page.screenshot({path:`${out}/screenshots/${file}`,timeout:60000});report.views.push({file,...data});
   }
  }
  // Actual previous keys recover both row composition and original full evidence views.
  for(let i=chapter.length-2;i>=0;i--){await page.keyboard.press('ArrowLeft');await page.waitForFunction(id=>__story.state===id&&__story.settled,chapter[i].id,{timeout:30000});}
  check(`${width} all chapter backward steps`,await page.evaluate(()=>__story.state)==='ch4-0');
  const place=async id=>{await page.evaluate(id=>__story.go(__story.states.findIndex(s=>s.id===id),{instant:true}),id);await at(id);};
  await place('chaine-0');await page.keyboard.press('ArrowRight');await at('chaine-1');
  await page.keyboard.press('ArrowLeft');await at('chaine-0');
  check(`${width} backward zoom restores full board`,await page.evaluate(()=>document.querySelector('#p-evidence').dataset.layout==='full'));
  await place('chaine-0');await page.keyboard.press('ArrowRight');await page.waitForTimeout(100);await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');await at('chaine-3');
  check(`${width} rapid clicks reach latest row state`,await page.evaluate(()=>Math.abs(__story.director.actors.guide.root.parent.getObjectByName('delivery-version').position.x-5.75)<1e-6));
  const samples=await page.evaluate(()=>__samples);report.samples.push({width,samples});
  const frameOpen=samples.filter(s=>s.kind==='approach'&&s.layout==='delivery');
  check(`${width} zoom keeps board and world visible`,frameOpen.length>0&&frameOpen.every(s=>s.stageOpacity===1&&s.boardOpacity===1&&s.hidden.length===0));
  for(const id of ['chaine-1','chaine-2','chaine-3','log4j-1','log4j-2']){
   const values=samples.filter(s=>s.id===id).map(s=>s.x);
   check(`${width} parcel progresses ${id}`,new Set(values.map(x=>x.toFixed(3))).size>2);
  }
  await context.close();
 }
 check('no browser errors, missing files or external requests',!report.errors.length&&!report.missing.length&&!report.external.length);
}catch(e){check('chapter verification completes',false,String(e));}
finally{await b.close();writeFileSync(`${out}/browser-report.json`,JSON.stringify(report,null,2)+'\n');}
process.exitCode=report.checks.some(c=>!c.pass)?1:0;
