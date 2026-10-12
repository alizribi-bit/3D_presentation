// Real Chrome QA on dist/: full source coverage, two windows, offline requests, native film and resting-state determinism.
import { chromium } from 'playwright-core';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const BASE = process.argv[2] || 'http://127.0.0.1:4318';
const viewport = process.env.VIEWPORT === '1366x768' ? { width: 1366, height: 768 } : { width: 1920, height: 1080 };
const OUT = new URL(`../review/full/verify/${viewport.width}x${viewport.height}/`, import.meta.url).pathname; mkdirSync(OUT, { recursive: true });
const rows=JSON.parse(readFileSync(new URL('../content/source/sequences.json',import.meta.url),'utf8'));
const ids=rows.flatMap(row=>Array.from({length:row.steps+1},(_,step)=>`${row.id}-${step}`));
const lastIds=rows.map(row=>`${row.id}-${row.steps}`);
const samples=['couverture-1','sommaire-1','startup-1','modele-2','problematique-1','besoins-1','methodologie-1','ch2-0','sequence-0','sequence-1','sequence-2','parcours-app-0','parcours-app-2','parcours-app-4','isolation-0','isolation-1','architecture-0','architecture-3','secrets-3','chaine-2','log4j-1','argocd-2','ch5-0','alerte-2','video-0','retour-1'];
const results=[],errors=[],external=[],failedRequests=[];
const ok=(name,pass,detail='')=>{results.push({name,pass,detail});console.log(`${pass?'PASS':'FAIL'} ${name}${detail?` — ${detail}`:''}`);};
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-angle=vulkan','--enable-features=Vulkan','--ignore-gpu-blocklist']});
const ctx=await browser.newContext({viewport});
await ctx.route('**/*',r=>{const u=new URL(r.request().url());if(!['127.0.0.1','localhost'].includes(u.hostname)){external.push(u.href);return r.abort();}return r.continue();});
ctx.on('page',p=>{p.on('pageerror',e=>errors.push(String(e)));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('response',r=>{if(r.status()>=400)failedRequests.push(`${r.status()} ${r.url()}`);});});
const jury=await ctx.newPage(), pres=await ctx.newPage();
const url=id=>`${BASE}/?test&still&fast#${id}`;
const ready=p=>p.waitForFunction(()=>window.__story?.ready,null,{timeout:60000});
const settled=()=>jury.waitForFunction(()=>__story.settled,null,{timeout:15000});
const state=()=>jury.evaluate(()=>__story.state);
const presAt=id=>pres.waitForFunction(id=>window.__presenter?.cur===id,id,{timeout:2500});
const capture=async(id,how)=>{await settled();await jury.waitForFunction(()=>[...(document.querySelector('#p-evidence')?.shadowRoot?.querySelectorAll('img')??[])].every(img=>img.complete&&img.naturalWidth>0),null,{timeout:10000});await jury.waitForTimeout(120);await jury.screenshot({path:`${OUT}${id}-${how}.png`});};
try {
  await jury.goto(url(ids[0]));await ready(jury);await pres.goto(`${BASE}/presenter.html`);await presAt(ids[0]);
  ok(`all ${ids.length} built states match the revised source order`,rows.length===44&&JSON.stringify(await jury.evaluate(()=>__story.states.map(s=>s.id)))===JSON.stringify(ids));
  let mismatch=[],visible=[],lag=0;
  for(let i=0;i<ids.length;i++){
    const id=ids[i];if(i)await jury.keyboard.press(i%3===1?'Space':i%3===2?'PageDown':'ArrowRight');
    const t=Date.now();await presAt(id);lag=Math.max(lag,Date.now()-t);await settled();
    if((await state())!==id)mismatch.push(id);
    const panel=await jury.evaluate(()=>({ref:document.querySelector('#p-evidence')?.dataset.frame,on:document.querySelector('#p-evidence')?.classList.contains('on'),html:document.querySelector('#p-evidence')?.shadowRoot?.querySelector('section')?.outerHTML}));
    if(panel.on){
      const seq=id.slice(0,id.lastIndexOf('-')),step=__step(id);
      const source=JSON.parse(readFileSync(new URL(`../public/content/${seq}.json`,import.meta.url),'utf8'));
      const canonical=await jury.evaluate(html=>{const template=document.createElement('template');template.innerHTML=html;return template.content.querySelector('section').outerHTML;},source.frames[step]);
      if(panel.ref!==id||panel.html!==canonical)visible.push(id);
    }
    if(lastIds.includes(id)||samples.includes(id))await capture(id,'forward');
    if(i%24===0)console.log(`progress ${i+1}/${ids.length}`);
  }
  ok('forward clicker/keyboard traversal visits every source state',mismatch.length===0,mismatch.join(','));
  ok('all displayed evidence frames equal the canonical source export',visible.length===0,visible.join(','));
  ok('presenter follows every source state',lag<1000,`worst observed ${lag} ms`);
  const finalContrast = await jury.evaluate(()=>{const el=document.querySelector('#p-evidence').shadowRoot.querySelector('h3');return getComputedStyle(el).color;});
  ok('conclusion uses readable text on the light theme',/^rgb\((?:21, 26, 23|16, 38, 26)\)$/.test(finalContrast),finalContrast);
  await jury.keyboard.press('ArrowRight');ok('last state is bounded',(await state())===ids.at(-1));
  mismatch=[];
  for(let i=ids.length-1;i>=0;i--){const id=ids[i];if(i<ids.length-1)await jury.keyboard.press('ArrowLeft');await settled();if((await state())!==id)mismatch.push(id);if(samples.includes(id))await capture(id,'back');}
  ok(`backward traversal visits all ${ids.length} states`,mismatch.length===0,mismatch.join(','));
  await jury.keyboard.press('ArrowLeft');ok('first state is bounded',(await state())===ids[0]);
  let expected=0;
  for(let i=0;i<30;i++){const next=(i*7+3)%5<3;await jury.keyboard.press(next?'ArrowRight':'ArrowLeft');expected=Math.min(ids.length-1,Math.max(0,expected+(next?1:-1)));}
  await settled();await presAt(ids[expected]);ok('rapid interruption preserves exactly one state per press',(await state())===ids[expected]);
  const chapters=[1,2,3,4,5,6];let jumps=[];
  for(const c of chapters){await pres.keyboard.press(String(c));await settled();const id=rows.find(r=>r.chapter===c).id+'-0';if((await state())!==id)jumps.push(c);}
  ok('all six chapter shortcuts work from the presenter',jumps.length===0);
  ok('presenter explains the six chapter shortcuts',await pres.locator('.keys').textContent().then(s=>s.includes('1–6 : chapitre')&&s.includes('Home / End')));
  await pres.keyboard.press('Home');await settled();ok('Home returns to the opening',(await state())===ids[0]);
  await pres.keyboard.press('End');await settled();ok('End reaches the conclusion',(await state())===ids.at(-1));
  await jury.evaluate(()=>__story.go(0,{instant:true}));await presAt(ids[0]);await jury.mouse.click(800,600);await jury.keyboard.press('ArrowRight');await settled();ok('clicker keys work after a mouse click',(await state())==='couverture-1');
  const before=await state();await jury.mouse.wheel(0,900);ok('wheel cannot advance the presentation',(await state())===before);
  await jury.evaluate(total=>{const c=new BroadcastChannel('zawedni-story-3d');for(const m of [null,{}, {t:'cmd',cmd:9},{t:'cmd',cmd:'go:NaN'},{t:'cmd',cmd:'scene:bad'},{t:'cmd',cmd:`go:${total}`}])c.postMessage(m);c.close();},ids.length);
  await jury.waitForTimeout(100);ok('malformed channel messages cannot change state',(await state())===before);
  for(const id of samples){await jury.goto(url(id));await ready(jury);await capture(id,'reload');}
  const diff=execFileSync('python3',[new URL('./compare.py',import.meta.url).pathname,OUT,...samples],{encoding:'utf8'});
  ok('representative states match forward/back/reload screenshots',!diff.includes('DIFF'),diff.split('\n').filter(x=>x.startsWith('DIFF')).join(' | ')||`${samples.length} states`);
  await jury.goto(url('modele-3'));await ready(jury);await pres.close();
  const late=await ctx.newPage();const t=Date.now();await late.goto(`${BASE}/presenter.html`);await late.waitForFunction(()=>__presenter.cur==='modele-3',null,{timeout:2500});
  ok('presenter opened late recovers the current source state',true,`${Date.now()-t} ms`);
  await jury.reload();await ready(jury);ok('jury reload preserves state',(await state())==='modele-3');
  await late.reload();await late.waitForFunction(()=>__presenter.cur==='modele-3',null,{timeout:2500});ok('presenter reload preserves synchronization',true);
  const pv=await late.evaluate(()=>({canvas:document.querySelectorAll('canvas').length,media:document.querySelectorAll('video,audio').length}));
  ok('presenter contains no WebGL canvas or audio/video',pv.canvas===0&&pv.media===0);
  ok('jury has no speaker notes or navigation buttons',!(await jury.evaluate(()=>!!document.querySelector('aside,.notes'))));
  // Film remains native; source-step advance does not automatically play in test mode.
  await jury.goto(url('video-0'));await ready(jury);
  const film=jury.locator('#film video');await film.evaluate(v=>new Promise(resolve=>{if(v.readyState>=1)return resolve();v.addEventListener('loadedmetadata',resolve,{once:true});}));
  const attrs=await film.evaluate(v=>({duration:v.duration,controls:v.controls,muted:v.muted,paused:v.paused}));
  ok('local corrected film has native controls and audible playback',attrs.controls&&!attrs.muted&&attrs.duration>=89&&attrs.duration<=92,`${attrs.duration.toFixed(2)} s`);
  await jury.locator('#film button').click();await jury.waitForTimeout(300);ok('native play button starts the film',await film.evaluate(v=>!v.paused));
  const id=await state();await film.click({position:{x:400,y:450}});ok('mouse interaction with the player does not advance state',(await state())===id);
  await jury.keyboard.press('ArrowRight');await settled();ok('clicker works after player interaction',(await state())==='video-1');
  await jury.keyboard.press('ArrowRight');await settled();ok('leaving the film pauses audio and resets the clock',await film.evaluate(v=>v.paused&&v.currentTime===0));
  // Real transition path: use normal motion, then press a key halfway through it.
  await jury.goto(`${BASE}/?test&still#methodologie-1`);await ready(jury);await jury.keyboard.press('ArrowRight');
  // Observe the real walking interval; the first 8% deliberately holds the departure pose.
  let walkFailure='';
  const walking=await jury.waitForFunction(()=>{const d=__story.director;if(!d.tr?.paths.guide)return false;const p=d.pose('guide',d.tr.from,d.tr.to,d.tr,(performance.now()/1000-d.tr.t0),d.tr.D,0);return p.walkW>0&&p.walkDist>0&&Number.isFinite(p.pos.x)&&Number.isFinite(p.pos.z);},null,{timeout:10000,polling:100}).then(()=>true,error=>{walkFailure=String(error);return false;});
  ok('chapter travel shows a local arrival walk with valid character pose',walking,walkFailure);
  await jury.keyboard.press('ArrowRight');await settled();ok('interrupting a real camera/character transition advances correctly',(await state())==='outils-dev-0');
  await jury.keyboard.press('M');await jury.keyboard.press('2');await settled();ok('reduced motion reaches the same source state',(await state())==='ch2-0');
  await jury.keyboard.press('L');await settled();ok('quality toggle retains navigation state',(await state())==='ch2-0');
  const prototype=await ctx.newPage();await prototype.goto(`${BASE}/?prototype&test&still#D2`);await ready(prototype);
  ok('original four-scene prototype remains available',(await prototype.evaluate(()=>__story.states.length===11&&__story.state==='D2')));
  ok('no failed local asset or content requests',failedRequests.length===0,[...new Set(failedRequests)].join(' | '));
  ok('no external request is required',external.length===0,[...new Set(external)].join(' | '));
  ok('no JavaScript errors',errors.length===0,[...new Set(errors)].join(' | '));
} catch(error){ok('browser suite completed',false,String(error.stack||error));}
finally {await browser.close();writeFileSync(`${OUT}report.json`,JSON.stringify({date:new Date().toISOString(),viewport,results,external,failedRequests,errors},null,2));}
const failed=results.filter(r=>!r.pass).length;console.log(`\n${results.length-failed}/${results.length} browser checks passed`);process.exitCode=failed?1:0;
function __step(id){return Number(id.slice(id.lastIndexOf('-')+1));}
