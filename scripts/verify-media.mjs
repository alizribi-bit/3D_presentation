// Real native player behavior with automatic playback enabled, unlike the test-mode traversal.
import { chromium } from 'playwright-core';
import { qaArgs } from './qa-browser.mjs';
import { writeFileSync } from 'node:fs';
const base = process.argv[2] || 'http://127.0.0.1:4318';
const browser = await chromium.launch({channel:'chrome',headless:true,args:qaArgs});
const results = [], errors = [];
const check = (name, pass, detail) => { results.push({name,pass,detail});console.log(`${pass?'PASS':'FAIL'} ${name}`); };
try {
  const page = await browser.newPage(); page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${base}/?still#video-0`); await page.waitForFunction(()=>window.__story?.ready,null,{timeout:60000});
  const jump = async id => {await page.evaluate(id=>__story.go(__story.states.findIndex(s=>s.id===id),{instant:true}),id);};
  const media = () => page.evaluate(()=>{const v=document.querySelector('video');return {paused:v.paused,time:v.currentTime,muted:v.muted,hidden:document.querySelector('#film').hidden,button:!document.querySelector('#film button').hidden};});
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(()=>{const v=document.querySelector('video');return !v.paused || !document.querySelector('#film button').hidden;});
  const initial = await media(); check('forward reveal starts unmuted playback or exposes the fallback', !initial.muted && (!initial.paused || initial.button),initial);
  // Invoke the actual fallback button if Chrome refuses autoplay.
  if(initial.paused) await page.locator('#film button').click();
  await page.waitForFunction(()=>!document.querySelector('video').paused,null,{timeout:10000});
  await page.waitForTimeout(350); const playing = await media();check('native player advances with its single audio source',playing.time>0&&!playing.muted,playing);
  await jump('retour-0'); const exited=await media();check('exit stops and rewinds the film',exited.hidden&&exited.paused&&exited.time===0,exited);
  await page.keyboard.press('ArrowLeft');await page.waitForTimeout(400);const back=await media();check('back to film restores the poster without ghost playback',!back.hidden&&back.paused&&back.time===0,back);
  await page.reload();await page.waitForFunction(()=>window.__story?.ready,null,{timeout:60000});await page.waitForTimeout(300);const reload=await media();check('reloading a film state keeps it paused on the poster',reload.paused&&reload.time===0,reload);
  await page.locator('#film button').click();await page.waitForFunction(()=>!document.querySelector('video').paused);
  await page.keyboard.press('ArrowRight');await page.waitForTimeout(200);check('keyboard resumes the itinerary after a player mouse click',await page.evaluate(()=>__story.state==='retour-0'));
  check('native media run has no browser errors',errors.length===0,errors);
} catch(error) { check('native media run completes',false,String(error)); }
finally {await browser.close();writeFileSync(new URL('../review/revision/media-report.json',import.meta.url),JSON.stringify({date:new Date().toISOString(), rendererMode: process.env.QA_RENDERER || 'vulkan',results,errors,physicalAudioChecked:false},null,2)+'\n');}
process.exitCode=results.some(r=>!r.pass)?1:0;
