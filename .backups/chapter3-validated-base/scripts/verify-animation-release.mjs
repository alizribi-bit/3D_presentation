// Smoke-test the prepared archive with its own present.sh server, not the development build.
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.argv[2],base=process.argv[3]||'http://127.0.0.1:4320';
if(!root)throw new Error('Supply the extracted project directory');
const manifest=JSON.parse(readFileSync(path.join(root,'DELIVERY-MANIFEST.json')));
for(const [file,expected] of Object.entries(manifest.files)){
 const absolute=path.resolve(root,file);assert.ok(absolute.startsWith(path.resolve(root)+path.sep));
 assert.equal(createHash('sha256').update(readFileSync(absolute)).digest('hex'),expected,`archive member ${file}`);
}
const result={manifestFiles:Object.keys(manifest.files).length,checks:[],errors:[],external:[],normalRecording:false,mode:'test&fast smoke only'};
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
try{
 const context=await browser.newContext({viewport:{width:1366,height:768}});
 context.on('page',page=>page.on('pageerror',error=>result.errors.push(error.message)));
 context.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(base))result.external.push(r.url());});
 context.on('response',r=>{if(r.status()>=400)result.errors.push(`${r.status()} ${r.url()}`);});
 const jury=await context.newPage(),popup=context.waitForEvent('page');
 await jury.goto(`${base}/?test&fast&pv=auto&q=light#probleme-0`,{waitUntil:'domcontentloaded'});
 const notes=await popup;await jury.waitForFunction(()=>window.__story?.ready,null,{timeout:90000});
 await jury.bringToFront();
 await notes.waitForFunction(()=>window.__presenter?.cur==='probleme-0',null,{timeout:15000});
 assert.equal(await jury.evaluate(()=>__story.states.length),114);result.checks.push('114 bundled states, presenter connected');
 await jury.keyboard.press('ArrowRight');
 await jury.waitForFunction(()=>__story.state==='probleme-1'&&__story.settled&&__story.director.renderedState.id==='probleme-1');
 assert.equal(await jury.evaluate(()=>getComputedStyle(document.getElementById('stage')).opacity==='1'&&document.getElementById('p-evidence').classList.contains('on')),true);
 result.checks.push('actual fixed key keeps stage and evidence visible');
 await jury.keyboard.press('2');await jury.waitForFunction(()=>__story.state==='ch2-0'&&__story.settled);
 assert.equal(await jury.evaluate(()=>__story.director.renderedPoses.guide.walkW),0);result.checks.push('fast chapter jump finishes with no walk');
 await notes.waitForFunction(()=>__presenter.cur==='ch2-0');
 assert.equal(await notes.evaluate(()=>!document.querySelector('video,audio,canvas')),true);result.checks.push('presenter contains no renderer or second audio');
 await notes.locator('#map summary').click();
 const index=await jury.evaluate(()=>__story.states.findIndex(s=>s.id==='video-0'));
 await notes.locator(`[data-i="${index}"]`).click();await jury.bringToFront();
 await jury.waitForFunction(()=>__story.state==='video-0'&&__story.settled&&!document.getElementById('film').hidden);
 await jury.waitForFunction(()=>document.querySelector('video').readyState>=1,null,{timeout:20000});
 assert.equal(await jury.evaluate(()=>{const v=document.querySelector('video');return v.paused&&Math.abs(v.duration-90)<.1&&v.src.startsWith(location.origin);}),true);
 result.checks.push('local 90-second film remains paused on poster');
 await jury.keyboard.press('End');await jury.waitForFunction(()=>__story.state==='retour-1'&&__story.settled);
 await notes.waitForFunction(()=>__presenter.cur==='retour-1');
 assert.equal(await jury.evaluate(()=>{const v=document.querySelector('video');return v.paused&&v.currentTime===0;}),true);
 result.checks.push('End reaches conclusion, film paused and rewound');
 assert.deepEqual(result.errors,[]);assert.deepEqual(result.external,[]);
}finally{await browser.close();writeFileSync('review/animation-correction-2026-10-12/archive-verification.json',JSON.stringify(result,null,2)+'\n');}
console.log(`PASS extracted archive: ${result.checks.length} checks, ${result.manifestFiles} SHA-256 hashes.`);
