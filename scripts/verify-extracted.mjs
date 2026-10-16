// Run from the development project against the extracted offline build; no install in the delivery folder.
import { chromium } from 'playwright-core';
import { qaArgs } from './qa-browser.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const extracted=process.argv[2], base=process.argv[3]||'http://127.0.0.1:4319';
if(!extracted)throw new Error('Supply extracted project directory');
const reference=JSON.parse(readFileSync(`${extracted}/content/reference/manifest.json`));
const browser=await chromium.launch({channel:'chrome',headless:true,args:qaArgs});
const results=[],errors=[],external=[];
const check=(name,pass)=>{results.push({name,pass});console.log(`${pass?'PASS':'FAIL'} ${name}`);};
try {
  const context=await browser.newContext({viewport:{width:1366,height:768}});
  await context.route('**/*',route=>{if(!['localhost','127.0.0.1'].includes(new URL(route.request().url()).hostname)){external.push(route.request().url());return route.abort();}return route.continue();});
  context.on('page',page=>{page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});});
  const page=await context.newPage();await page.goto(`${base}/?test&still&fast#parcours-app-0`);await page.waitForFunction(()=>window.__story?.ready,null,{timeout:60000});
  check('extracted build contains every state of the current reference',await page.evaluate(count=>__story.states.length===count,reference.counts.states));
  await page.waitForFunction(()=>document.querySelector('#p-evidence')?.dataset.frame==='parcours-app-0');
  await page.waitForFunction(()=>[...document.querySelector('#p-evidence').shadowRoot.querySelectorAll('img')].every(img=>img.complete&&img.naturalWidth>0));
  check('extracted assignment proof loads the exact active classic capture',await page.evaluate(()=>document.querySelector('#p-evidence').shadowRoot.querySelector('img').src.endsWith('v9-adm-attribution.png')));
  const notes=await context.newPage();await notes.goto(`${base}/presenter.html`);await notes.waitForFunction(()=>window.__presenter?.cur==='parcours-app-0',null,{timeout:5000});
  check('extracted presenter synchronizes without second WebGL or audio',await notes.evaluate(()=>!document.querySelector('canvas,video,audio')));
  await page.keyboard.press('End');await page.waitForFunction(()=>__story.settled);check('extracted keyboard reaches conclusion',await page.evaluate(()=>__story.state==='retour-1'));
  await page.evaluate(()=>__story.go(__story.states.findIndex(s=>s.id==='video-0'),{instant:true}));
  await page.waitForFunction(()=>document.querySelector('video').readyState>=1,null,{timeout:15000});
  check('extracted final film is local, 90 seconds and unmuted',await page.evaluate(()=>{const v=document.querySelector('video');return Math.abs(v.duration-90)<.1&&!v.muted&&v.paused;}));
  check('extracted runtime makes no external or failing request',!errors.length&&!external.length);
}catch(error){errors.push(String(error));check('extracted Chrome smoke completes',false);}
finally{await browser.close();}
writeFileSync(new URL('../review/classic/extraction-report.json',import.meta.url),JSON.stringify({date:new Date().toISOString(), rendererMode: process.env.QA_RENDERER || 'vulkan',base,extractedBuildSha256:createHash('sha256').update(readFileSync(`${extracted}/dist/index.html`)).digest('hex'),results,errors,external},null,2)+'\n');
process.exitCode=results.some(result=>!result.pass)?1:0;
