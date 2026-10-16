// Real native player behavior with automatic playback enabled, unlike the test-mode traversal.
import { chromium } from 'playwright-core';
import { qaArgs } from './qa-browser.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const base = process.argv[2] || 'http://127.0.0.1:4320';
mkdirSync(new URL('../review/classic/', import.meta.url), { recursive: true });
const browser = await chromium.launch({channel:'chrome',headless:true,args:qaArgs});
const results = [], errors = [];
const check = (name, pass, detail) => { results.push({name,pass,detail});console.log(`${pass?'PASS':'FAIL'} ${name}`); };
try {
  const context = await browser.newContext({viewport:{width:960,height:540}});
  const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${base}/?q=light&still#video-0`); await page.waitForFunction(()=>window.__story?.ready,null,{timeout:60000});
  const presenter = await context.newPage(); await presenter.goto(`${base}/presenter.html`);
  await presenter.waitForFunction(()=>window.__presenter?.cur==='video-0',null,{timeout:20000});
  check('presenter contains no renderer or media source',await presenter.locator('canvas,video,audio').count()===0);
  const metadata=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','stream=codec_type,codec_name','-show_entries','format=duration','-of','json','public/media/zawedni-devsecops.mp4'],{encoding:'utf8'}));
  check('accepted film has one audio track and lasts 90 seconds',metadata.streams.filter(s=>s.codec_type==='audio').length===1&&+metadata.format.duration===90,metadata);
  const arrival = async id => {await page.waitForFunction(id=>__story.state===id&&__story.director.renderedState.id===id&&__story.settled,id,{timeout:30000});};
  const jump = async id => {await page.evaluate(id=>__story.go(__story.states.findIndex(s=>s.id===id),{instant:true}),id);await arrival(id);};
  const media = () => page.evaluate(()=>{const v=document.querySelector('video');return {paused:v.paused,time:v.currentTime,muted:v.muted,hidden:document.querySelector('#film').hidden,button:!document.querySelector('#film button').hidden};});
  await page.bringToFront();
  await page.keyboard.press('ArrowRight');await arrival('video-1');
  await page.waitForFunction(()=>{const v=document.querySelector('video');return !v.paused || !document.querySelector('#film button').hidden;});
  const initial = await media(); check('forward reveal starts unmuted playback or exposes the fallback', !initial.muted && (!initial.paused || initial.button),initial);
  // Invoke the actual fallback button if Chrome refuses autoplay.
  if(initial.paused) await page.locator('#film button').click();
  await page.waitForFunction(()=>!document.querySelector('video').paused,null,{timeout:10000});
  await page.waitForTimeout(350); const playing = await media();check('native player advances with its single audio source',playing.time>0&&!playing.muted,playing);
  check('only the jury has one media source while both windows are open',await page.locator('video,audio').count()===1&&await presenter.locator('video,audio').count()===0);
  await page.locator('video').evaluate(v=>v.pause()); const paused=await media();
  check('native pause works',paused.paused&&paused.time>0,paused);
  await page.locator('#film button').click(); await page.waitForFunction(()=>!document.querySelector('video').paused);
  check('native playback resumes after pause',!(await media()).paused);
  await page.locator('video').evaluate(v=>{v.pause();v.volume=.35;v.currentTime=45;});
  await page.waitForFunction(()=>Math.abs(document.querySelector('video').currentTime-45)<2);
  check('native volume and seeking are usable',await page.locator('video').evaluate(v=>v.controls&&v.volume===.35&&v.currentTime>=45));
  await page.locator('#film button').click();await page.waitForFunction(()=>!document.querySelector('video').paused);
  await page.locator('video').evaluate(v=>{v.currentTime=v.duration-.2;});
  await page.waitForFunction(()=>document.querySelector('video').ended,null,{timeout:30000});
  check('film ends without leaving its main-route state',await page.evaluate(()=>__story.state==='video-1'&&document.querySelector('video').paused));
  await jump('retour-0'); const exited=await media();check('exit stops and rewinds the film',exited.hidden&&exited.paused&&exited.time===0,exited);
  await page.keyboard.press('ArrowLeft');await arrival('video-1');const back=await media();check('back to film restores the poster without ghost playback',!back.hidden&&back.paused&&back.time===0,back);
  await page.reload();await page.waitForFunction(()=>window.__story?.ready,null,{timeout:60000});await page.waitForTimeout(300);const reload=await media();check('reloading a film state keeps it paused on the poster',reload.paused&&reload.time===0,reload);
  await page.locator('#film button').click();await page.waitForFunction(()=>!document.querySelector('video').paused);
  await page.keyboard.press('ArrowRight');await arrival('retour-0');check('keyboard resumes the itinerary after a player mouse click',await page.evaluate(()=>__story.state==='retour-0'));
  check('native media run has no browser errors',errors.length===0,errors);
} catch(error) { check('native media run completes',false,String(error)); }
finally {await browser.close();writeFileSync(new URL('../review/classic/media-report.json',import.meta.url),JSON.stringify({date:new Date().toISOString(), rendererMode: 'swiftshader',results,errors,physicalAudioChecked:false},null,2)+'\n');}
process.exitCode=results.some(r=>!r.pass)?1:0;
