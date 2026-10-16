// Independent comparison of the active classic runtime, rendered 3D frames and presenter cues.
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { FULL_STATES } from '../src/story/itinerary.ts';
import { qaArgs } from './qa-browser.mjs';
const BASE=process.argv[2]||'http://127.0.0.1:4318';
const small=process.env.VIEWPORT==='1366x768';
const viewport=small?{width:1366,height:768}:{width:1920,height:1080};
const OUT=`review/classic/${viewport.width}x${viewport.height}`;mkdirSync(OUT,{recursive:true});
const ref=JSON.parse(readFileSync('content/reference/manifest.json'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const results=[],errors=[],external=[],requests=[],states=[],geometry=[];
const check=(name,pass,detail)=>{results.push({name,pass,detail});console.log(`${pass?'PASS':'FAIL'} ${name}${pass?'':` ${JSON.stringify(detail)}`}`);};
const normalize=s=>s.replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
const samples=new Set(['sequence-2','parcours-app-0','parcours-app-2','devsecops-1','alerte-1','bilan-2']);
const browser=await chromium.launch({channel:'chrome',headless:true,args:qaArgs});
const ctx=await browser.newContext({viewport});
ctx.on('page',p=>{p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)requests.push(`${r.status()} ${r.url()}`);});});
await ctx.route('**/*',async route=>{
 const u=new URL(route.request().url());
 if(u.pathname==='/classic-reference.html'){
   let html=readFileSync(`${ref.root}/deck.html`,'utf8').replace(/<link[^>]*>/g,'');
   const fonts=readFileSync('src/styles.css','utf8').split(':root')[0];
   html=html.replace('</head>',`<style>${fonts}</style></head>`);
   return route.fulfill({contentType:'text/html',body:html});
 }
 if(u.hostname!=='127.0.0.1'&&u.hostname!=='localhost'){external.push(u.href);return route.abort();}
 if(route.request().frame().url().includes('classic-reference.html')&&(u.pathname.startsWith('/assets/')||u.pathname.startsWith('/media/'))){
   const file=`${ref.root}${decodeURIComponent(u.pathname)}`;
   return route.fulfill({path:file});
 }
 return route.continue();
});
const jury=await ctx.newPage(),pres=await ctx.newPage(),classic=await ctx.newPage();
const ready=()=>jury.waitForFunction(()=>window.__story?.ready,null,{timeout:60000});
const at=id=>pres.waitForFunction(id=>window.__presenter?.cur===id,id,{timeout:4000});
const settled=()=>jury.waitForFunction(()=>__story.settled,null,{timeout:12000});
async function inspect(state){
 await at(state.id);
 const expected=state.notes.script.map(([kind,text])=>kind==='read'?`« ${text} »`:text);
 if(state.notes.silent)expected.push(state.notes.silent);
 const speech=await pres.locator('#script .cue p').allTextContents();
 const title=await pres.locator('#title').textContent();
 check(`notes ${state.id}`,JSON.stringify(speech)===JSON.stringify(expected)&&title===state.title,{speech,expected,title});
 if(state.evidence){
  await jury.waitForFunction(id=>document.querySelector('#p-evidence')?.dataset.frame===id,state.id);
  await settled();
  const comparison=await jury.evaluate(async({i,step})=>{
   const root=document.querySelector('#p-evidence').shadowRoot;
   const sec=root.querySelector('section');
   const visible=el=>{for(let n=el;n&&n!==sec.parentElement;n=n.parentElement){const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden'||+s.opacity===0)return false;}return true;};
   const texts=[...sec.querySelectorAll('*')].filter(visible).flatMap(el=>[...el.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent.trim()).filter(Boolean));
   const imgs=[...sec.querySelectorAll('img')].filter(visible).map(el=>({src:el.getAttribute('src').replace('assets/deck/','assets/'),alt:el.alt}));
   await Promise.all([...sec.querySelectorAll('img')].map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.onload=resolve;img.onerror=resolve;})));
   const bad=[...sec.querySelectorAll('img')].filter(img=>!img.complete||img.naturalWidth===0).map(img=>img.src);
   const board=document.querySelector('#p-evidence').getBoundingClientRect();
   // Screenshots deliberately zoom inside cropped proof frames. Measure their visible intersection.
   const clipped=[...sec.querySelectorAll('p,h1,h2,h3,li,td,th,text,img')].filter(visible).filter(el=>{
    const bounds=el.getBoundingClientRect(),r={left:bounds.left,right:bounds.right,top:bounds.top,bottom:bounds.bottom};
    for(let parent=el.parentElement;parent&&parent!==sec;parent=parent.parentElement){
     const s=getComputedStyle(parent),p=parent.getBoundingClientRect();
     if(['hidden','clip','auto','scroll'].includes(s.overflowX)){r.left=Math.max(r.left,p.left);r.right=Math.min(r.right,p.right);}
     if(['hidden','clip','auto','scroll'].includes(s.overflowY)){r.top=Math.max(r.top,p.top);r.bottom=Math.min(r.bottom,p.bottom);}
    }
    return r.right>r.left&&r.bottom>r.top&&(r.left<board.left-2||r.right>board.right+2||r.top<board.top-2||r.bottom>board.bottom+2);
   }).map(el=>el.textContent.trim().slice(0,80));
   return {html:sec.outerHTML,texts,imgs,bad,clipped};
  },{i:state.source.seq,step:state.source.step});
  const exported=JSON.parse(readFileSync(`public/content/${state.source.seq}.json`)).frames[state.source.step];
  const canonical=await jury.evaluate(html=>{const t=document.createElement('template');t.innerHTML=html;return t.content.querySelector('section').outerHTML;},exported);
  const original=ref.states.find(s=>s.id===state.id);
  check(`frame ${state.id}`,comparison.html===canonical&&JSON.stringify(comparison.texts)===JSON.stringify(original.visibleTexts)&&JSON.stringify(comparison.imgs)===JSON.stringify(original.images)&&!comparison.bad.length,{bad:comparison.bad,textMatch:JSON.stringify(comparison.texts)===JSON.stringify(original.visibleTexts),imageMatch:JSON.stringify(comparison.imgs)===JSON.stringify(original.images)});
  geometry.push({id:state.id,clipped:comparison.clipped});
 }else if(!state.media){
  await settled();
  // The camera can settle before the DOM reveal threshold; compare only the completed visible state.
  await jury.waitForFunction(panels=>panels.every(id=>document.getElementById(`p-${id}`)?.classList.contains('on')),state.panels);
  const actual=await jury.evaluate(()=>[...document.querySelectorAll('.pane.on')].filter(e=>!e.shadowRoot).map(e=>e.textContent).join(' '));
  const original=ref.states.find(s=>s.id===state.id);
  const missing=original.visibleTexts.filter(t=>!/^[\s\p{P}]$|^[A-Z]$/u.test(t)).filter(t=>!normalize(actual).includes(normalize(t)));
  check(`3D adaptation ${state.id}`,!missing.length,{missing});
 }
 if(samples.has(state.id)){
  await jury.waitForTimeout(100);
  await jury.screenshot({path:`${OUT}/${state.id}-jury.png`,timeout:60000});
  await pres.screenshot({path:`${OUT}/${state.id}-presenter.png`,timeout:60000});
 }
}
try{
 const served=await (await jury.request.get(`${BASE}/build-info.json`)).json();
 const local=JSON.parse(readFileSync('dist/build-info.json'));
 check('server serves the current project build',served.buildId===local.buildId&&served.projectRoot===local.projectRoot,{projectRoot:served.projectRoot,buildId:served.buildId});
 await classic.goto(`${BASE}/classic-reference.html?render`);await classic.waitForFunction(()=>window.__ready,null,{timeout:60000});
 const runtime=await classic.evaluate(()=>__deck.slides);
 check('active classic order and click counts equal the mapped reference',JSON.stringify(runtime.map(s=>({id:s.id,title:s.title,steps:s.steps})))===JSON.stringify(ref.rows.map(s=>({id:s.id,title:s.title,steps:s.steps}))));
 await jury.goto(`${BASE}/?test&still&fast#${FULL_STATES[0].id}`);await ready();await pres.goto(`${BASE}/presenter.html`);await at(FULL_STATES[0].id);
 check('full mode uses every current state',JSON.stringify(await jury.evaluate(()=>__story.states.map(s=>s.id)))===JSON.stringify(ref.states.map(s=>s.id)));
 let worstLag=0;
 for(const [i,state] of FULL_STATES.entries()){
  if(i){const start=Date.now();await (i%2?jury:pres).keyboard.press(['ArrowRight','Space','PageDown'][i%3]);await at(state.id);worstLag=Math.max(worstLag,Date.now()-start);}
  await inspect(state);states.push(state.id);
  if(i%20===0)console.log(`Traversal ${i+1}/${FULL_STATES.length}`);
 }
 check('every forward click and exact current cue is synchronized',states.length===ref.counts.states,{worstLagMs:worstLag});
 check('all canonical projected text and images fit inside the glass board',geometry.every(s=>!s.clipped.length),geometry.filter(s=>s.clipped.length));
 const back=[];
 for(let i=FULL_STATES.length-2;i>=0;i--){await jury.keyboard.press('ArrowLeft');await at(FULL_STATES[i].id);if(await jury.evaluate(()=>__story.state)!==FULL_STATES[i].id)back.push(i);}
 check('all backward clicks synchronize without skipped states',!back.length,back);
 for(let chapter=1;chapter<=6;chapter++){await pres.keyboard.press(String(chapter));await settled();const expected=FULL_STATES.find(s=>s.chapter===chapter).id;await at(expected);check(`chapter shortcut ${chapter}`,await jury.evaluate(()=>__story.state)===expected);}
 await pres.keyboard.press('Home');await at(FULL_STATES[0].id);await pres.keyboard.press('End');await at(FULL_STATES.at(-1).id);
 check('Home and End synchronize',await jury.evaluate(()=>__story.state)===FULL_STATES.at(-1).id);
 await jury.evaluate(()=>location.hash='#bilan-2');await at('bilan-2');await jury.reload();await ready();await at('bilan-2');
 check('hash and jury reload preserve the current cue',await pres.locator('#script .read').count()===1);
 await pres.reload();await at('bilan-2');check('presenter reload recovers exact current state',true);
 await pres.close();const late=await ctx.newPage();await late.goto(`${BASE}/presenter.html`);await late.waitForFunction(()=>window.__presenter?.cur==='bilan-2',null,{timeout:4000});
 check('presenter opened late recovers exact current state',true);
 check('presenter has no WebGL canvas, video or audio',await late.locator('canvas,video,audio').count()===0);
 check('presenter current font is enlarged with comfortable line spacing',await late.locator('#script p').first().evaluate(el=>{const s=getComputedStyle(el);return parseFloat(s.fontSize)>=30&&parseFloat(s.lineHeight)>=parseFloat(s.fontSize)*1.5;}));
 check('presenter hides long next notes and navigation by default',!await late.locator('#after').evaluate(el=>el.open)&&!await late.locator('#map').evaluate(el=>el.open));
 check('no presenter page overflow',await late.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight));
 // Ensure the actual classic source did not change while the comparison was running.
 check('classic active files remain byte identical',Object.entries(ref.files).every(([file,digest])=>hash(readFileSync(`${ref.root}/${file}`))===digest));
 check('no browser exceptions or failing local resources',!errors.length&&!requests.length,{errors,requests});
 check('offline presentation makes no external requests',!external.length,external);
}catch(error){check('comparison completes',false,String(error));}
finally{await browser.close();writeFileSync(`${OUT}/report.json`,JSON.stringify({date:new Date().toISOString(),viewport,reference:ref.files,counts:ref.counts,results,geometry,errors,external,requests},null,2)+'\n');}
process.exitCode=results.some(r=>!r.pass)?1:0;
