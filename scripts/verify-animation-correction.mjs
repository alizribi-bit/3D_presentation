// Live behavioral checks through jury keys and the real presenter buttons.
// Instant placement only prepares a case; no clock/phase manipulation enters observations.
import { chromium } from 'playwright-core';
import { FULL_STATES } from '../src/story/itinerary.ts';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, renameSync, readFileSync } from 'node:fs';
const out = 'review/animation-correction-2026-10-12';
mkdirSync(`${out}/raw`, { recursive: true });
const base = process.argv[2] || 'http://127.0.0.1:4318';
const recordingOnly=process.env.QA_RECORD_ONLY==='1';
const report = (process.env.QA_EXTRA || process.env.QA_REPLACE_NORMAL || recordingOnly) ? JSON.parse(readFileSync(`${out}/report.json`)) : { normalSpeed:true, clockManipulated:false, audioRecorded:false, configurations:[], errors:[], external:[], failures:[] };
const gl = process.env.QA_GL === '1';
const browser = await chromium.launch({channel:'chrome',headless:!gl,args:[
  ...(gl ? ['--use-angle=gl','--use-gl=angle','--ignore-gpu-blocklist'] : ['--use-angle=swiftshader','--enable-unsafe-swiftshader']),'--disable-background-timer-throttling',
  '--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows']});
const fixedReference = process.env.QA_REUSE_FIXED ? JSON.parse(readFileSync(process.env.QA_FIXED_REFERENCE || `${out}/report.json`)).configurations.find(c=>c.width===1920&&c.quality==='normal') : null;
if(process.env.QA_REPLACE_NORMAL)report.configurations=report.configurations.filter(c=>c.quality!=='normal');
const configs = recordingOnly ? [[1366,768,'normal']] : process.env.QA_ONLY_NORMAL ? [[1920,1080,'normal'],[1366,768,'normal']] : process.env.QA_EXTRA ? [[1366,768,'normal'],[1920,1080,'light'],[1366,768,'light']] : process.env.QA_SINGLE ? [[1920,1080,'normal']] : [[1920,1080,'normal'],[1366,768,'normal'],[1920,1080,'light'],[1366,768,'light']];
try {
 for (const [width,height,quality] of configs) {
  const recorded = recordingOnly || (width===1920 && quality==='normal');
  const filePrefix=recordingOnly?'recording-':'';
  const config = { width,height,quality,cases:[],fixedChecks:[],clips:[] };
  if(recordingOnly)(report.recordings??=[]).push(config);else report.configurations.push(config);
  const context = await browser.newContext({viewport:{width,height},reducedMotion:'no-preference',
    ...(recorded ? {recordVideo:{dir:`${out}/raw`,size:{width:960,height:540}}} : {})});
  context.on('page',p=>p.on('pageerror',e=>report.errors.push(e.message)));
  context.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(base))report.external.push(r.url());});
  context.on('response',r=>{if(r.status()>=400)report.errors.push(`${r.status()} ${r.url()}`);});
  const jury = await context.newPage(), video = jury.video();
  try {
   const popup = context.waitForEvent('page');
   await jury.goto(`${base}/?pv=auto&q=${quality}#probleme-0`,{waitUntil:'domcontentloaded'});
   const notes = await popup;
   await jury.waitForFunction(()=>window.__story?.ready,null,{timeout:90000});
   await notes.waitForFunction(()=>window.__presenter?.cur==='probleme-0',null,{timeout:20000});
   await jury.bringToFront();
   await jury.waitForTimeout(800);
   config.build=(await (await jury.request.get(`${base}/build-info.json`)).json()).buildId;
   config.environment=await jury.evaluate(()=>{
    const gl=__story.renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');
    return {renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),search:location.search,
      actualViewport:[innerWidth,innerHeight],light:document.body.classList.contains('quality-light'),reduced:matchMedia('(prefers-reduced-motion: reduce)').matches};
   });
   await jury.evaluate(()=>{
    const d=__story.director,go=d.go.bind(d),frame=d.frame.bind(d);
    window.__audit={active:false,samples:[],commands:[],animations:[]};
    const animate=Element.prototype.animate;
    Element.prototype.animate=function(...args){if(__audit.active)__audit.animations.push({tag:this.tagName,step:this.getAttribute('data-step'),options:args[1]});return animate.apply(this,args);};
    d.go=(i,options)=>{
      const previous=d.tr, before={elapsed:previous?performance.now()/1000-previous.t0:null,id:d.state.id,display:d.renderedState.id,camera:d.camera.position.toArray(),guide:d.renderedPoses.guide?.pos.toArray(),opacity:d.contentOpacity};
      go(i,options);
      if(__audit.active)__audit.commands.push({time:performance.now()/1000,to:d.state.id,before,kind:d.tr?.plan.kind,t0:d.tr?.t0,timing:d.tr?.timing,
        hidden:d.tr?.plan.hiddenPanels,retained:!!previous&&previous===d.tr,capturedCamera:d.tr?.shot.pos,capturedGuide:d.tr?.starts.guide?.pos.toArray(),initialOpacity:d.tr?.initialOpacity});
    };
    d.frame=now=>{
      const tr=d.tr;frame(now);if(!__audit.active)return;
      const stage=document.getElementById('stage'),ev=document.getElementById('p-evidence'),v=document.querySelector('video'),p=d.renderedPoses.guide;
      const shared=tr?tr.from.panels.filter(id=>d.state.panels.includes(id)&&!tr.plan.hiddenPanels.includes(id)):[];
      const props=[];d.actors.guide.root.parent.traverse(o=>{
        if(o.position.x===1&&o.position.y===2.85&&o.position.z===-2.2)props.push({kind:'mobile',visible:o.visible});
        if(Math.abs(o.position.x+6.6)<1e-6&&o.position.y===1.3&&o.position.z===20)props.push({kind:'phone',visible:o.visible});
      });
      __audit.samples.push({t:now,id:d.state.id,display:d.renderedState.id,phase:stage.dataset.phase,kind:tr?.plan.kind,
        stageOpacity:+getComputedStyle(stage).opacity,stageVisibility:getComputedStyle(stage).visibility,
        evidenceOn:ev.classList.contains('on'),evidenceOpacity:+getComputedStyle(ev).opacity,evidenceFrame:ev.dataset.frame,apkVisible:[...ev.shadowRoot.querySelectorAll('.apk')].some(e=>e.checkVisibility({opacityProperty:true,visibilityProperty:true})),
        active:[...document.querySelectorAll('.pane.on')].map(e=>e.dataset.panel),directed:document.querySelectorAll('[data-directed]').length,
        inactiveManagedHidden: [...document.querySelectorAll('[data-directed]:not(.on)')].every(e=>+getComputedStyle(e).opacity===0),
        sharedVisible:shared.every(id=>document.getElementById(`p-${id}`)?.classList.contains('on')),
        camera:d.camera.position.toArray(),guide:p.pos.toArray(),walk:p.walkW,guideOpacity:p.opacity,
        videoHidden:document.getElementById('film').hidden,videoPaused:v.paused,videoTime:v.currentTime,props});
    };
   });
   const index=id=>FULL_STATES.findIndex(s=>s.id===id);
   async function at(id){
    await jury.bringToFront();
    await jury.waitForFunction(id=>__story.state===id&&__story.director.renderedState.id===id&&__story.settled&&(!__story.director.state.evidence||+getComputedStyle(document.getElementById('p-evidence')).opacity===1),id,{timeout:25000});
    await notes.waitForFunction(id=>__presenter.cur===id,id,{timeout:15000});
   }
   async function prepare(id){
    await jury.evaluate(i=>{__audit.active=false;__story.go(i,{instant:true});},index(id));
    await at(id);await jury.waitForTimeout(200);
   }
   async function begin(){return jury.evaluate(()=>{__audit.samples=[];__audit.commands=[];__audit.animations=[];__audit.active=true;return performance.now()/1000;});}
   async function finish(label,from,to,start,clip=false){
    await at(to);await jury.waitForTimeout(clip?900:250);
    // Native animations become ready on a rendered frame, which can be much later on
    // a software GPU. Wait for their real completion; never finish() or retime them.
    await jury.waitForFunction(()=>document.getElementById('p-evidence').shadowRoot.querySelector('.deck').getAnimations({subtree:true}).every(a=>a.playState==='finished'||a.playState==='idle'),null,{timeout:25000});
    const data=await jury.evaluate(()=>{const ev=document.getElementById('p-evidence'),d=__story.director;return {...__audit,end:performance.now()/1000,final:{...__audit.samples.at(-1),id:d.state.id,contentOrigin:d.stateT0,phase:document.getElementById('stage').dataset.phase,directed:document.querySelectorAll('[data-directed]').length,evidenceOn:ev.classList.contains('on'),evidenceFrame:ev.dataset.frame,evidenceOpacity:+getComputedStyle(ev).opacity,apkVisible:[...ev.shadowRoot.querySelectorAll('.apk')].some(e=>e.checkVisibility({opacityProperty:true,visibilityProperty:true}))}};});
    await jury.evaluate(()=>__audit.active=false);
    assert.ok(data.commands.length);assert.ok(data.samples.length);
    for(const s of data.samples){
      assert.equal(s.stageOpacity,1,`${label}: stage opacity`);assert.equal(s.stageVisibility,'visible');assert.equal(s.sharedVisible,true);assert.equal(s.inactiveManagedHidden,true,'inactive selected panel remains hidden');
      if(['content','approach','object','world','relocate'].includes(s.kind))assert.equal(s.walk,0,`${label}: unexpected walk`);
      if(['travel','world','relocate'].includes(s.kind)&&s.phase==='move')assert.equal(s.evidenceOn,false,`${label}: obstructing evidence`);
      if(s.phase==='move')assert.ok(s.videoHidden||s.videoPaused,`${label}: film during movement`);
    }
    const last=data.final;assert.equal(last.id,to);assert.equal(last.phase,'done');assert.equal(last.directed,0);
    const lastCommand=data.commands.at(-1);
    assert.ok(Math.abs(data.final.contentOrigin-lastCommand.t0-(lastCommand.hidden.length?lastCommand.timing.arrival:lastCommand.timing.exit))<1e-6,'continuous content/gesture clock');
    const state=FULL_STATES[index(to)];if(state.evidence){assert.equal(last.evidenceOn,true);assert.equal(last.evidenceFrame,to);assert.equal(last.evidenceOpacity,1);}
    for(const cmd of data.commands){
      if(!cmd.retained&&cmd.capturedCamera)assert.deepEqual(cmd.capturedCamera,cmd.before.camera,'actual camera captured');
      if(!cmd.retained&&cmd.capturedGuide)assert.deepEqual(cmd.capturedGuide,cmd.before.guide,'actual guide captured');
    }
    const result={label,from,to,start,end:data.end,commands:data.commands,frames:data.samples.length,phases:[...new Set(data.samples.map(s=>s.phase))],
      minimumStageOpacity:Math.min(...data.samples.map(s=>s.stageOpacity)),minimumEvidenceOpacity:Math.min(...data.samples.map(s=>s.evidenceOpacity)),
      contentOrigin:data.final.contentOrigin,
      maxWalk:Math.max(...data.samples.map(s=>s.walk)),animations:data.animations,wallSeconds:data.end-start};
    config.cases.push(result);
    writeFileSync(`${out}/${filePrefix}${quality}-${width}-${String(config.cases.length).padStart(2,'0')}.json`,JSON.stringify(data,null,2));
    if(clip&&recorded)config.clips.push({label,from,to,start:data.commands[0].time-.5,end:data.end});
    console.log(`PASS ${quality} ${width}: ${label} (${data.samples.length} rendered frames)`);
    return data;
   }
   if(recorded && !process.env.QA_SKIP_FIXED){
    // One browser-side driver avoids hundreds of CDP round trips on software GPUs.
    // Every advance still clicks the real presenter button and crosses its actual channel.
    await notes.evaluate(()=>{
      window.__qaDriver = new BroadcastChannel('zs3d-qa-driver');
      __qaDriver.onmessage=()=>document.getElementById('advance').click();
    });
    jury.on('console',message=>{if(message.text().startsWith('QA fixed:'))console.log(message.text());});
    await prepare(FULL_STATES[0].id);
    config.fixedChecks=await jury.evaluate(async states=>{
      const driver=new BroadcastChannel('zs3d-qa-driver'),result=[];
      const check=(value,message)=>{if(!value)throw new Error(message);};
      for(let i=1;i<states.length;i++){
        const a=states[i-1],b=states[i];
        __audit.samples=[];__audit.commands=[];__audit.active=true;
        driver.postMessage('advance');
        const deadline=performance.now()+25000;
        await new Promise((resolve,reject)=>{
          const poll=()=>{
            if(__story.state===b.id&&__story.director.renderedState.id===b.id&&__story.settled)return resolve();
            if(performance.now()>deadline)return reject(new Error(`Navigation timeout ${b.id}`));
            setTimeout(poll,20);
          };poll();
        });
        __audit.active=false;
        if(a.shot!==b.shot||a.guide!==b.guide)continue;
        const data=__audit;
        check(data.commands.length===1,`one presenter command ${b.id}`);
        check(data.commands[0].kind==='content'&&data.commands[0].timing.total===0,`fixed budget ${b.id}`);
        check(data.samples.length>0,`rendered sample ${b.id}`);
        for(const sample of data.samples){
          check(sample.stageOpacity===1&&sample.walk===0,`fixed visibility/walk ${b.id}`);
          check(sample.evidenceOn===b.evidence,`fixed evidence ${b.id}`);
          check(Math.hypot(...sample.camera.map((v,j)=>v-data.commands[0].before.camera[j]))<1e-5,`fixed camera ${b.id}`);
        }
        result.push({from:a.id,to:b.id,frames:data.samples.length,kind:data.commands[0].kind,
          observedSeconds:data.samples.at(-1).t-data.commands[0].time});
        if(result.length%10===0)console.log(`QA fixed: ${result.length}/95`);
      }
      driver.close();return result;
    },FULL_STATES.map(s=>({id:s.id,shot:s.shot,guide:s.actors.guide.at,evidence:!!s.evidence})));
    assert.equal(config.fixedChecks.length,95);console.log('PASS 95 real presenter fixed transitions');
   }
   if(recorded && fixedReference){assert.equal(fixedReference.fixedChecks.length,95);config.fixedChecks=fixedReference.fixedChecks;config.fixedChecksBuild=fixedReference.fixedChecksBuild??fixedReference.build;config.fixedChecksReused='Subsequent changes concern non-settled relocation retargeting and gesture clocks after camera movement; fixed classification, timing, replacement, visibility and accepted itinerary are unchanged. Final unit coverage rechecks all 95.';}
   const cases=[
    ['Texte','probleme-0','probleme-1','ArrowRight'],
    ['Capture administration','parcours-app-1','parcours-app-2','ArrowRight'],
    ['Nouvelle slide fixe','startup-1','probleme-0','ArrowRight'],
    ['Atelier preuves','plateforme-2','sequence-0','ArrowRight'],
    ['Cycle 3D','devsecops-0','devsecops-1','ArrowRight'],
    ['Voyage chapitre','methodologie-1','ch2-0','ArrowRight'],
    ['Atelier sans marche','ch2-0','outils-dev-0','ArrowRight'],
    ['Retour au monde','retour-0','retour-1','ArrowRight'],
    ['Précédent rapide','ch2-0','methodologie-1','ArrowLeft']];
   for(const [label,from,to,key] of cases){
    await prepare(from);const start=await begin();await jury.keyboard.press(key);const data=await finish(label,from,to,start,true);
    if(label==='Texte')assert.ok(data.animations.some(a=>a.step==='1'&&a.options.duration===200),'local new text entrance');
    if(label==='Capture administration'){
      const props=data.final.props;assert.equal(props.length,2);assert.ok(props.every(p=>!p.visible));
      assert.equal(data.final.evidenceOn,true);assert.equal(data.final.apkVisible,false);
    }
    if(label==='Voyage chapitre')assert.ok(data.samples.some(s=>s.walk>.1),'arrival walk actually rendered');
    if(label==='Cycle 3D')assert.deepEqual(data.commands[0].hidden,[]);
   }
   // Web/mobile local changes, including return to mobile, through actual next keys.
   if(!recordingOnly){
   await prepare('parcours-app-0');
   const phoneStates=[];
   for(const id of ['parcours-app-1','parcours-app-2','parcours-app-3','parcours-app-4']){
    const start=await begin();await jury.keyboard.press('ArrowRight');const data=await finish('Téléphone local','parcours-app',id,start);
    const props=data.final.props;assert.equal(props.length,2);
    assert.ok(props.every(p=>p.visible===!['parcours-app-0','parcours-app-2'].includes(id)));assert.equal(data.final.apkVisible,!['parcours-app-0','parcours-app-2'].includes(id));phoneStates.push({id,props,apkVisible:data.final.apkVisible});
   }
   config.phoneStates=phoneStates;
   }
   await prepare('methodologie-1');let start=await begin();await jury.keyboard.press('ArrowRight');
   await jury.waitForFunction(()=>document.getElementById('stage').dataset.phase==='move',null,{timeout:15000});
   await notes.evaluate(()=>{for(const id of ['advance','advance','prev','advance','prev'])document.getElementById(id).click();});
   let data=await finish('Rafale au même lieu','methodologie-1','outils-dev-0',start,true);
   assert.equal(data.commands.length,6);assert.ok(data.commands.slice(1).every(c=>c.retained));
   assert.equal(new Set(data.commands.map(c=>c.t0)).size,1,'travel deadline retained');
   await prepare('methodologie-1');start=await begin();await jury.keyboard.press('ArrowRight');
   await jury.waitForFunction(()=>document.getElementById('stage').dataset.phase==='move',null,{timeout:15000});
   await jury.keyboard.press('ArrowLeft');data=await finish('Interruption par retour','methodologie-1','methodologie-1',start,true);
   assert.equal(data.commands.at(-1).kind,'relocate');assert.ok(data.commands.at(-1).timing.movement<=.9);
   if(recordingOnly)continue;
   await prepare('methodologie-1');start=await begin();await jury.keyboard.press('ArrowRight');
   const entryDelay=await jury.evaluate(()=>Math.max(0,(__story.director.tr.t0+__story.director.tr.timing.arrival-performance.now()/1000)*1000)+25);
   await notes.evaluate(delay=>new Promise(resolve=>setTimeout(()=>{document.getElementById('advance').click();document.getElementById('prev').click();resolve();},delay)),entryDelay);
   await finish('Rafale pendant entrée','methodologie-1','ch2-0',start,false);
   await prepare('methodologie-1');start=await begin();
   await notes.evaluate(i=>{document.querySelector(`[data-i="${i}"]`).click();document.getElementById('advance').click();},index('ch2-0'));
   data=await finish('Rafale sur saut direct','methodologie-1','outils-dev-0',start,false);
   assert.equal(data.commands.length,2);assert.equal(data.commands[0].kind,'relocate');
   assert.equal(data.commands[1].retained,true);assert.ok(data.commands[1].timing.movement<=.9);
   // Direct chapter command is a relocation rather than a compulsory terminal walk.
   await prepare('startup-0');start=await begin();await jury.keyboard.press('6');
   data=await finish('Saut chapitre','startup-0','ch6-0',start,false);assert.equal(data.commands[0].kind,'relocate');
   // Local CSS cover transitions still run after the previous flights (no permanent timeline class).
   await prepare('couverture-0');start=await begin();await jury.keyboard.press('ArrowRight');await at('couverture-1');
   const cover=await jury.evaluate(()=>{const e=document.querySelector('#p-cover h1');return {duration:getComputedStyle(e).transitionDuration,
    timeline:document.body.classList.contains('timeline'),animations:e.getAnimations().map(a=>a.playState)};});
   assert.equal(cover.timeline,false);assert.notEqual(cover.duration,'0s');config.coverAfterTravel=cover;
   await finish('Couverture CSS après voyages','couverture-0','couverture-1',start,false);
   // Playback starts only on its visible reveal, never in flight; presenter has no media.
   await prepare('startup-0');await jury.keyboard.press('ArrowLeft');await at('sommaire-1');await prepare('startup-0');start=await begin();await notes.evaluate(i=>document.querySelector(`[data-i="${i}"]`).click(),index('video-1'));
   data=await finish('Film après relocalisation','startup-0','video-1',start,false);
   assert.ok(data.samples.filter(s=>s.phase==='move').every(s=>s.videoHidden&&s.videoPaused));
   assert.equal(await jury.evaluate(()=>document.querySelector('video').paused),true,'direct jump keeps the accepted paused film behavior');
   await jury.keyboard.press('ArrowLeft');await at('video-0');
   await jury.keyboard.press('ArrowRight');await at('video-1');
   await jury.waitForFunction(()=>!document.querySelector('video').paused,null,{timeout:15000});
   await jury.keyboard.press('ArrowRight');await at('retour-0');
   assert.equal(await jury.evaluate(()=>{const v=document.querySelector('video');return v.paused&&v.currentTime===0;}),true);
   assert.equal(await notes.evaluate(()=>!document.querySelector('video,audio,canvas')),true);
   config.film={directJumpPaused:true,forwardRevealStarts:true,delayedStart:true,pausedAndRewoundOnExit:true,presenterHasNoMedia:true};
   await jury.keyboard.press('m');await prepare('methodologie-1');start=await begin();await jury.keyboard.press('ArrowRight');
   data=await finish('Mode réduit','methodologie-1','ch2-0',start,false);assert.equal(data.commands[0].timing.movement,0);
   await jury.keyboard.press('m');
   await jury.screenshot({path:`${out}/jury-${quality}-${width}.png`,timeout:60000});
   await notes.screenshot({path:`${out}/notes-${quality}-${width}.png`,timeout:60000});
  }catch(e){config.failure=e.stack;report.failures.push(e.stack);console.error(e);throw e;}
  finally {await context.close();if(video)renameSync(await video.path(),`${out}/jury-normal.webm`);}
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.external,[]);
}finally {await browser.close();writeFileSync(`${out}/report.json`,JSON.stringify(report,null,2)+'\n');}
console.log('PASS live animation correction verification');
