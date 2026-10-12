// Headless Chrome measurements on the local integrated GPU; not a substitute for projector rehearsal.
import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
const BASE=process.argv[2]||'http://127.0.0.1:4318';
const cases=[['sommaire-1','startup-0'],['methodologie-1','ch2-0'],['parcours-app-4','ch3-0'],['secrets-3','ch4-0'],['tracabilite-4','ch5-0'],['validation-1','ch6-0']];
const measurements=[];
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-angle=vulkan','--enable-features=Vulkan','--ignore-gpu-blocklist']});
let hardware;
try{
  for(const quality of ['normal','light']){
    const page=await browser.newPage({viewport:{width:1920,height:1080}});
    const logs=[];page.on('console',m=>{if(m.text().startsWith('[fps]'))logs.push(m.text());});
    const t=Date.now();await page.goto(`${BASE}/?fps&q=${quality}#sommaire-1`);await page.waitForFunction(()=>window.__story?.ready,null,{timeout:60000});
    hardware=await page.evaluate(()=>{const gl=__story.renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');return{renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'unknown',drawCalls:__story.renderer.info.render.calls,triangles:__story.renderer.info.render.triangles};});
    measurements.push({quality,coldReadyMs:Date.now()-t});
    for(const[from,to]of cases){
      await page.evaluate(from=>__story.go(__story.states.findIndex(s=>s.id===from),{instant:true}),from);
      await page.waitForFunction(()=>__story.settled);await page.waitForTimeout(200);logs.length=0;
      await page.evaluate(to=>__story.go(__story.states.findIndex(s=>s.id===to)),to);
      await page.waitForFunction(()=>__story.settled,null,{timeout:20000});
      const line=logs.find(l=>l.includes(`[fps] ${to} `));
      if(!line)throw new Error(`No transition measurement ${to}`);
      const m=/mean ([\d.]+) · p5 ([\d.]+) · (\d+) frames/.exec(line);
      const result={quality,from,to,meanFps:Number(m[1]),p5Fps:Number(m[2]),frames:Number(m[3])};measurements.push(result);console.log(JSON.stringify(result));
    }
    await page.close();
  }
}finally{await browser.close();}
writeFileSync(new URL('../review/full/performance.json',import.meta.url),JSON.stringify({date:new Date().toISOString(),method:'Chrome headless, 1920×1080, Vulkan; normal animation, no test/still flags or screenshot during measurements',hardware,measurements},null,2));
console.log(JSON.stringify(hardware));
