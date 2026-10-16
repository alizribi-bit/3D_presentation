// presenter.sh opens deck.offline.html by default: independently compare this actual bundle with deck.html.
import { chromium } from 'playwright-core';
import { readFileSync,writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const ref=JSON.parse(readFileSync('content/reference/manifest.json'));
const assets=JSON.parse(readFileSync('content/source/assets-manifest.json')).assets;
const sha=data=>createHash('sha256').update(data).digest('hex');
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[],errors=[];const check=(name,pass,detail)=>{results.push({name,pass,detail});console.log(`${pass?'PASS':'FAIL'} ${name}`);};
try{
 const page=await browser.newPage({viewport:{width:1920,height:1080}});page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>{const url=new URL(r.request().url());if(url.pathname==='/deck.offline.html')return r.fulfill({contentType:'text/html',body:readFileSync(`${ref.root}/deck.offline.html`)});if(url.hostname!=='127.0.0.1'){errors.push(url.href);return r.abort();}return r.fulfill({path:`${ref.root}${url.pathname}`});});
 await page.goto('http://127.0.0.1:4399/deck.offline.html?render');await page.waitForFunction(()=>window.__ready,null,{timeout:60000});
 const meta=await page.evaluate(()=>__deck.slides);
 check('default classic bundle has the exact slide order, titles and clicks',JSON.stringify(meta.map(s=>({id:s.id,title:s.title,steps:s.steps})))===JSON.stringify(ref.rows.map(s=>({id:s.id,title:s.title,steps:s.steps}))));
 const mismatches=[];
 for(const [i,row] of ref.rows.entries())for(let step=0;step<=row.steps;step++){
  const actual=await page.evaluate(({i,step})=>{
   __deck.show(i,step);const sec=document.querySelectorAll('section.slide')[i];
   const visible=el=>{for(let n=el;n&&n!==sec.parentElement;n=n.parentElement){const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden'||+s.opacity===0)return false;}return true;};
   const texts=[...sec.querySelectorAll('*')].filter(visible).flatMap(el=>[...el.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent.trim()).filter(Boolean));
   const images=[...sec.querySelectorAll('img')].filter(visible).map(el=>({src:el.getAttribute('src'),alt:el.alt}));
   const diagrams=[...sec.querySelectorAll('svg')].filter(visible).map(el=>el.outerHTML);
   const notes=[...sec.querySelectorAll('aside.notes>p')].map(el=>el.textContent.replace(/\s+/g,' ').trim());
   return {texts,images,diagrams,notes};
  },{i,step});
  const expected=ref.states.find(s=>s.id===`${row.id}-${step}`);
  if(JSON.stringify(actual.texts)!==JSON.stringify(expected.visibleTexts)||JSON.stringify(actual.diagrams.map(sha))!==JSON.stringify(expected.diagramHashes))mismatches.push({id:expected.id,reason:'text/diagram'});
  if(actual.notes.some((text,n)=>text!==row.speech[n].replaceAll('[lire]','À lire :').replace(/\s+/g,' ').trim()))mismatches.push({id:expected.id,reason:'notes'});
  if(actual.images.length!==expected.images.length)mismatches.push({id:expected.id,reason:'image count'});
  for(const [j,image] of actual.images.entries()){
   const original=expected.images[j];if(!original)continue;
   const expectedHash=assets.find(a=>a.source===original.src)?.sha256;
   const bytes=image.src.startsWith('data:')?Buffer.from(image.src.split(',')[1],'base64'):readFileSync(`${ref.root}/${image.src}`);
   if(image.alt!==original.alt||sha(bytes)!==expectedHash)mismatches.push({id:expected.id,reason:'image bytes'});
  }
 }
 check('all default classic resting states match the imported active deck',!mismatches.length,mismatches);
 check('offline bundle comparison has no external requests or browser exceptions',!errors.length,errors);
}catch(e){check('default classic comparison completes',false,String(e));}
finally{await browser.close();writeFileSync('review/classic/classic-offline-report.json',JSON.stringify({date:new Date().toISOString(),defaultDeck:'deck.offline.html',results,errors},null,2)+'\n');}
process.exitCode=results.some(r=>!r.pass)?1:0;
