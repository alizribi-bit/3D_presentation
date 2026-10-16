// @ts-check
import assert from 'node:assert/strict';
import{createRequire}from'node:module';
import{mkdirSync,writeFileSync}from'node:fs';
import{resolve}from'node:path';
import{pathToFileURL}from'node:url';
const {chromium}=createRequire('/home/ali/.claude/skills/deck-kit/export/package.json')('playwright-core');
const root=resolve(process.argv[2]||'.'),out=resolve(root,'qa/20min/scrum-v2');mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});let checks=0;
try{
for(const[width,height]of[[1920,1080],[1366,768]]){
 const page=await browser.newPage({viewport:{width,height}}),errors=[],external=[];
 page.on('pageerror',e=>errors.push(String(e)));await page.route('**/*',route=>{if(/^(file:|data:|blob:)/.test(route.request().url()))return route.continue();external.push(route.request().url());return route.abort();});
 await page.goto(pathToFileURL(resolve(root,'deck.offline.html')).href);await page.waitForFunction(()=>window.__ready);await page.addStyleTag({content:'.dk-ui,.dk-hint,.dk-controls{visibility:hidden!important}'});
 const index=await page.evaluate(()=>__deck.slides.findIndex(s=>s.id==='methodologie'));
 await page.evaluate(index=>Deck.goto(index,0),index);await page.waitForTimeout(1300);
 const image=await page.locator('#methodologie .scrum-diagram img').evaluate(el=>{const rect=el.getBoundingClientRect();const frame=el.parentElement.getBoundingClientRect();return{loaded:el.complete&&el.naturalWidth>1600,src:el.src.startsWith('data:image/png;base64,'),fit:getComputedStyle(el).objectFit,visible:Number(getComputedStyle(el.parentElement).opacity)>.99,safe:rect.left>=0&&rect.right<=innerWidth&&rect.top>=0&&rect.bottom<=innerHeight,aspect:el.naturalWidth/el.naturalHeight,frame:frame.width/frame.height};});
 assert.ok(image.loaded&&image.src&&image.visible&&image.safe&&image.fit==='contain'&&image.aspect>2.2);checks++;
 await page.screenshot({path:resolve(out,`${width}-scrum.png`)});
 await page.keyboard.press('ArrowRight');await page.waitForTimeout(1600);
 assert.ok(await page.evaluate(index=>Deck.state.i===index&&Deck.state.step===1&&Number(getComputedStyle(document.querySelector('#methodologie .scrum-diagram')).opacity)<.01&&Number(getComputedStyle(document.querySelector('#methodologie .releases').parentElement).opacity)>.99,index));checks++;
 await page.screenshot({path:resolve(out,`${width}-releases.png`)});
 await page.keyboard.press('ArrowLeft');await page.waitForTimeout(1600);
 assert.ok(await page.locator('#methodologie .scrum-diagram').evaluate(el=>Number(getComputedStyle(el).opacity)>.99));checks++;
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);checks+=2;await page.close();
}
writeFileSync(resolve(out,'browser.json'),JSON.stringify({checks,status:'PASS',resolutions:['1920x1080','1366x768']},null,2));console.log(`${checks}/${checks} PASS: image, fit, reveal, reverse navigation, offline`);
}finally{await browser.close();}
