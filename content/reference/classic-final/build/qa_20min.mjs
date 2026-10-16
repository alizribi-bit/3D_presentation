// @ts-check
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const require=createRequire('/home/ali/.claude/skills/deck-kit/export/package.json');
const {chromium}=require('playwright-core');
const root=resolve(process.argv[2]||'.'), output=resolve(root,'qa/20min/discours-demandes/screenshots');
mkdirSync(output,{recursive:true});
const rows=readFileSync(resolve(root,'SCRIPT.md'),'utf8').split('\n').filter(l=>/^\| \d+ \|/.test(l)).map(l=>l.split('|').slice(1,-1).map(c=>c.trim()));
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
let checks=0;
/** @type {string[]} */ const results=[];
/** @param {string} label @param {boolean} result */
function check(label,result){ assert.ok(result,label); results.push(label); checks++; }
/** @param {string} text */
const normalise=text=>text.replace(/\s+/g,' ').trim();
try{
for(const [width,height] of [[1920,1080],[1366,768]]){
 const context=await browser.newContext({viewport:{width,height}});
 /** @type {string[]} */ const errors=[], external=[];
 await context.route('**/*',r=>{if(/^(file:|data:|blob:)/.test(r.request().url()))return r.continue();external.push(r.request().url());return r.abort();});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(pathToFileURL(resolve(root,'deck.offline.html')).href);
 await page.waitForFunction(()=>window.__ready===true);
 await page.addStyleTag({content:'.dk-ui,.dk-hint,.dk-controls{visibility:hidden!important}'});
 const model=await page.evaluate(()=>window.__deck.slides);
 check(`${width}: 35 slides et 51 révélations`,model.length===35 && model.reduce((a,s)=>a+s.steps,0)===51);
 check(`${width}: exclusions conservées`,!model.some(s=>['controle-publication','ch2','plateforme','sequence','parcours-app','acteurs','apercu','alerte','outils-dev','objectifs','perspectives'].includes(s.id)));
 check(`${width}: informations et vidéo rétablies`,['sommaire','ch1','startup','modele','methodologie','outils-livraison','devsecops','dix-pipelines','analyses','bilan','limites','video'].every(id=>model.some(s=>s.id===id)));
 check(`${width}: captures chargées`,await page.evaluate(()=>[...document.querySelectorAll('.slide img')].every(img=>img.complete && img.naturalWidth>0)));
 check(`${width}: un seul lecteur dans le parcours`,await page.locator('video').count()===1);
 const [presenter]=await Promise.all([page.waitForEvent('popup'),page.keyboard.press('p')]);
 await presenter.waitForLoadState();
 /** True only when the complete ancestor chain is visible.
  * @param {string} selector */
 const shown=selector=>page.locator(selector).evaluate(el=>{
  for(let node=el;node;node=node.parentElement){const css=getComputedStyle(node);if(Number(css.opacity)<.95 || css.visibility==='hidden' || css.display==='none')return false;}
  return true;
 });
 for(let i=0;i<model.length;i++){
  const slide=model[i], row=rows[i];
  check(`${width} ${slide.id}: titre et notes issus du script`,slide.title===row[2] && slide.steps===Number(row[3]));
  for(let step=0;step<=slide.steps;step++){
   await page.evaluate(({i,step})=>window.__deck.show(i,step),{i,step});
   await page.waitForTimeout(40);
   const integrated=await page.locator(`#${slide.id} aside`).textContent();
   check(`${width} ${slide.id}.${step}: notes intégrées`,normalise(integrated)===normalise(row[7].replaceAll('[clic]','')));
   if(slide.id==='chaine'){
    const expected=[[315,665],[315,665],[1140,665],[1640,845]][step];
    const position=await page.locator('#chaine').evaluate(el=>[Number(el._w.dot.getAttribute('cx')),Number(el._w.dot.getAttribute('cy'))]);
    check(`${width} chaine.${step}: trajet du commit conservé`,position.every((value,index)=>Math.abs(value-expected[index])<.01));
   }
   if(slide.id==='architecture'){
    check(`${width} architecture.${step}: production au dernier état`,await shown('#architecture .prod')===(step===3));
   }
   if(slide.id==='argocd') check(`${width} argocd.${step}: capture au second clic`,await shown('#argocd .shot')===(step===2));
   if(slide.id==='modele'){
    check(`${width} modele.${step}: BMC complet visible`,await shown('#modele .complete img'));
    check(`${width} modele.${step}: deux focuses ensemble`,await shown('#modele [data-bmc-focus="clients"]')===(step===1) && await shown('#modele [data-bmc-focus="value"]')===(step===1));
    check(`${width} modele.${step}: deux agrandissements ensemble`,await shown('#modele .bmc-details')===(step===1));
   }
   if(slide.id==='methodologie'){
    check(`${width} Scrum.${step}: cycle puis releases`,await shown('#methodologie .scrum-diagram')===(step===0));
    check(`${width} Scrum.${step}: trois releases`,await shown('#methodologie .releases')===(step===1));
   }
   if(slide.id==='bilan'){
    check(`${width} bilan.${step}: volet plateforme`,await shown('#bilan .ct:first-of-type ul li:first-child')===(step>=1));
    check(`${width} bilan.${step}: volet DevSecOps`,await shown('#bilan .ct:nth-of-type(2) ul li:first-child')===(step>=2));
   }
   if(slide.id==='limites') for(let horizon=0;horizon<3;horizon++) check(`${width} limites.${step}: horizon ${horizon}`,await shown(`#limites .hz:nth-of-type(${horizon+1})`)===(step>=horizon+1));
   if(/^ch[13456]$/.test(slide.id)){
    const chapter=await page.locator(`#${slide.id}`).evaluate(el=>({count:el.querySelectorAll('.toc li').length,selected:el.querySelector('.toc li.on i').textContent,number:el.querySelector('.no').textContent,bar:parseFloat(el.querySelector('.bar').style.top),top:el.querySelector('.toc li.on').offsetTop}));
    check(`${width} ${slide.id}: chapitre renuméroté et repère animé`,chapter.count===5 && chapter.selected===chapter.number && Math.abs(chapter.bar-chapter.top)<.01);
   }
   await page.screenshot({path:resolve(output,`${width}-${String(i+1).padStart(2,'0')}-${step}.png`)});
  }
 }
 // Exercise actual transitions and synchronisation, rather than only exports.
 await page.evaluate(()=>Deck.goto(0));await page.waitForTimeout(150);
 let visited=1;
 for(let i=0;i<model.length;i++)for(let step=0;step<=model[i].steps;step++){
  if(i===0&&step===0)continue;
  await page.keyboard.press('ArrowRight');await page.waitForTimeout(180);
  check(`${width}: avance ${visited}`,await page.evaluate(({i,step})=>Deck.state.i===i && Deck.state.step===step,{i,step}));
  const liveNote=await presenter.locator('.dk-pv-now .dk-pv-seg.on').evaluate(el=>{const copy=el.cloneNode(true);copy.querySelectorAll('.dk-pv-tag').forEach(tag=>tag.remove());return copy.textContent;});
  check(`${width}: discours présentateur ${i}.${step}`,normalise(liveNote)===normalise(rows[i][7].split(' [clic] ')[step]));visited++;
 }
 for(let i=model.length-1;i>=0;i--)for(let step=model[i].steps;step>=0;step--){
  if(i===model.length-1&&step===model[i].steps)continue;
  await page.keyboard.press('ArrowLeft');await page.waitForTimeout(180);
  check(`${width}: retour ${i}.${step}`,await page.evaluate(({i,step})=>Deck.state.i===i && Deck.state.step===step,{i,step}));
 }
 // Observe actual mid-animation frames: the dependency appears, then settles.
 const bilan=model.findIndex(s=>s.id==='bilan');
 await page.evaluate(i=>Deck.goto(i,0),bilan);await page.waitForTimeout(1200);
 await page.keyboard.press('ArrowRight');await page.waitForTimeout(90);
 check(`${width}: construction animée et non figée`,!(await shown('#bilan .ct:first-of-type ul li:first-child')));
 await page.screenshot({path:resolve(output,`${width}-bilan-animation.png`)});
 await page.waitForTimeout(2100);
 check(`${width}: volet lisible après animation`,await shown('#bilan .ct:first-of-type ul li:first-child'));
 // Video: keyboard start, native commands, presenter silence and departure reset.
 const videoIndex=model.findIndex(s=>s.id==='video');
 await page.evaluate(i=>Deck.goto(i,0),videoIndex);await page.waitForTimeout(1100);
 const video=page.locator('#video video');
 check(`${width}: lecteur et commande de lecture`,await page.locator('#video .play').count()===1 && await video.evaluate(v=>v.controls));
 check(`${width}: affiche avant lecture`,await video.evaluate(v=>v.paused));
 await page.keyboard.press('ArrowRight');
 await page.waitForFunction(()=>!document.querySelector('#video video').paused);
 await page.waitForTimeout(300);
 check(`${width}: film démarre avec son, 90 s`,await video.evaluate(v=>!v.muted && v.duration>=89 && v.duration<=91 && v.currentTime>0));
 const previews=presenter.frames().filter(f=>f!==presenter.mainFrame());
 for(const preview of previews){
  const players=preview.locator('video');
  if(await players.count()) check(`${width}: aperçu présentateur silencieux`,await players.evaluateAll(list=>list.every(v=>v.muted && v.paused && !v.controls)));
 }
 await video.evaluate(v=>v.pause());await page.waitForTimeout(80);
 check(`${width}: pause`,await video.evaluate(v=>v.paused));
 await page.locator('#video .play').click();await page.waitForTimeout(200);
 check(`${width}: reprise par bouton sans avancer`,await video.evaluate(v=>!v.paused) && await page.evaluate(index=>Deck.state.i===index && Deck.state.step===1,videoIndex));
 await video.evaluate(v=>{v.volume=.4;v.currentTime=45;});
 check(`${width}: volume et déplacement dans le film`,await video.evaluate(v=>Math.abs(v.volume-.4)<.01 && v.currentTime>=45));
 await page.keyboard.press('ArrowRight');await page.waitForTimeout(900);
 check(`${width}: quitter arrête et rembobine`,await video.evaluate(v=>v.paused && v.currentTime<.1));
 await page.keyboard.press('ArrowLeft');await page.waitForTimeout(950);
 check(`${width}: retour au film sans deuxième bande sonore`,await video.evaluate(v=>v.paused));
 await page.evaluate(i=>Deck.goto(i,0),videoIndex);await page.waitForTimeout(200);
 await page.locator('#video .play').click();await page.waitForTimeout(250);
 check(`${width}: lecture manuelle depuis affiche`,await video.evaluate(v=>!v.paused && !v.muted));
 await page.evaluate(()=>Deck.goto(0));await page.waitForTimeout(200);
 await page.keyboard.press('o');await page.waitForTimeout(200);
 check(`${width}: vue d'ensemble`,await page.evaluate(()=>document.documentElement.classList.contains('dk-overview')));
 await page.keyboard.press('Escape');
 check(`${width}: aucun appel externe`,external.length===0);
 check(`${width}: aucune exception`,errors.length===0);
 await context.close();
}
writeFileSync(resolve(root,'qa/20min/discours-demandes/browser.json'),JSON.stringify({checks,results},null,2));
console.log(`${checks}/${checks} PASS`);
}finally{await browser.close();}
