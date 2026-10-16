// Normal-speed acceptance: real keyboard commands, no fast/still flags or modified clock.
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
import { qaArgs } from './qa-browser.mjs';
const reference=JSON.parse(readFileSync('content/reference/manifest.json'));
const base=process.argv[2]||'http://127.0.0.1:4320';
const report={normalSpeed:true,clockModified:false,checks:[],states:[],errors:[],external:[],missing:[],samples:[],animations:[]};
const check=(name,pass,detail)=>{report.checks.push({name,pass,detail});console.log(`${pass?'PASS':'FAIL'} ${name}`);};
const browser=await chromium.launch({channel:'chrome',headless:true,args:qaArgs});
try {
 const context=await browser.newContext({viewport:{width:1366,height:768},reducedMotion:'no-preference'});
 context.on('page',p=>p.on('pageerror',e=>report.errors.push(e.message)));
 context.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(base))report.external.push(r.url());});
 context.on('response',r=>{if(r.status()>=400)report.missing.push(`${r.status()} ${r.url()}`);});
 const page=await context.newPage();await page.goto(`${base}/?test#couverture-0`);
 await page.waitForFunction(()=>window.__story?.ready,null,{timeout:90000});
 await page.evaluate(()=>{
  const director=__story.director,frame=director.frame.bind(director),go=director.go.bind(director);
  window.__audit={samples:[],commands:[],animations:[]};
  const animate=Element.prototype.animate;
  Element.prototype.animate=function(...args){__audit.animations.push({id:director.state.id,tag:this.tagName,focus:this.getAttribute('data-bmc-focus'),step:this.getAttribute('data-step'),duration:args[1]?.duration});return animate.apply(this,args);};
  director.go=(i,options)=>{go(i,options);__audit.commands.push({id:director.state.id,kind:director.tr?.plan.kind,timing:director.tr?.timing,walk:director.tr?.plan.walk});};
  director.frame=now=>{frame(now);const stage=document.getElementById('stage'),ev=document.getElementById('p-evidence'),pose=director.renderedPoses.guide;
   __audit.samples.push({id:director.state.id,phase:stage.dataset.phase,kind:stage.dataset.transition,stageOpacity:+getComputedStyle(stage).opacity,
    evidenceOn:ev.classList.contains('on'),camera:director.camera.position.toArray(),guide:pose.pos.toArray(),walk:pose.walkW,guideOpacity:pose.opacity});};
 });
 report.renderer=await page.evaluate(()=>{const gl=__story.renderer.getContext(),e=gl.getExtension('WEBGL_debug_renderer_info');return e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);});
 const settled=id=>page.waitForFunction(id=>__story.state===id&&__story.director.renderedState.id===id&&__story.settled,id,{timeout:30000});
 let previous=null;
 for (const [i,source] of reference.states.entries()) {
  if(i)await page.keyboard.press('ArrowRight');
  await settled(source.id);
  const state=await page.evaluate(()=>{const d=__story.director,ev=document.getElementById('p-evidence');return {id:d.state.id,shot:d.state.shot,place:d.state.place,camera:d.camera.position.toArray(),guide:d.renderedPoses.guide.pos.toArray(),walk:d.renderedPoses.guide.walkW,frame:ev.dataset.frame,evidence:!!d.state.evidence};});
  check(`arrival ${source.id}`,state.id===source.id&&(!state.evidence||state.frame===source.id));
  if(previous?.id.split('-').slice(0,-1).join('-')===source.slideId&&!['retour-1','chaine-1','log4j-1'].includes(source.id))
   check(`stable reveal ${source.id}`,state.camera.every((v,i)=>Math.abs(v-previous.camera[i])<1e-6)&&state.guide.every((v,i)=>Math.abs(v-previous.guide[i])<1e-6)&&state.walk===0);
  report.states.push(state);previous=state;
 }
 const data=await page.evaluate(()=>__audit);report.samples=data.samples;report.animations=data.animations;report.transitions=data.commands;
 check('entire stage stays visible during the complete normal-speed route',data.samples.every(s=>s.stageOpacity===1));
 const fixed=data.commands.filter(c=>c.kind==='content');
 check('local changes have zero travel budget and no walking',fixed.every(c=>c.timing.total===0&&!c.walk));
 check('five travel arrivals include only retained places',report.states.every(s=>s.place!=='02'));
 const bmcAnimations=data.animations.filter(a=>a.id==='modele-1'&&a.focus);
 check('BMC highlights value and customers on the same click',JSON.stringify(bmcAnimations.map(a=>a.focus).sort())===JSON.stringify(['clients','value']));
 check('progressive SVG diagram elements retain local animation',data.animations.some(a=>['g','path','text'].includes(a.tag.toLowerCase())&&['supervision','routage','chaine'].some(id=>a.id.startsWith(id+'-'))));
 for(const [chapter,id] of [[1,'ch1-0'],[2,'ch3-0'],[3,'ch4-0'],[4,'ch5-0'],[5,'ch6-0']]){
  await page.keyboard.press(String(chapter));await settled(id);check(`normal chapter access ${chapter}`,await page.evaluate(()=>__story.state)===id);
 }
 await page.keyboard.press('6');check('obsolete sixth chapter shortcut is absent',await page.evaluate(()=>__story.state)==='ch6-0');
 // Interrupt a chapter journey with a return, then rapidly retarget within its destination.
 await page.keyboard.press('Home');await settled('couverture-0');
 await page.keyboard.press('1');await settled('ch1-0');
 await page.keyboard.press('2');await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowLeft');await settled('ch3-0');
 check('interrupted travel recovers the requested state',await page.evaluate(()=>__story.state)==='ch3-0');
 report.nominalTransitionSeconds=data.commands.reduce((n,c)=>n+(c.timing?.total||0),0);
 check('normal route has no errors, missing files or external requests',!report.errors.length&&!report.missing.length&&!report.external.length);
} catch(error){check('normal traversal completes',false,String(error));}
finally{await browser.close();writeFileSync('review/20min/normal-route.json',JSON.stringify(report,null,2)+'\n');}
process.exitCode=report.checks.some(c=>!c.pass)?1:0;
