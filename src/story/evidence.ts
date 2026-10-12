import rows from '../../content/source/sequences.json';
import type { StoryState } from './types.ts';
interface EvidenceFile { id: string; frames: string[]; }
const cache = new Map<string, EvidenceFile>();
let styles = '';
// Six workers avoid a burst of hundreds of parallel image/content requests during cold startup.
export async function preloadEvidence(): Promise<void> {
  const css = await fetch('content/evidence.css'); if (!css.ok) throw new Error('Evidence styles unavailable'); styles = await css.text();
  const pending = [...rows];
  await Promise.all(Array.from({length:6},async()=>{
    for(let row=pending.shift();row;row=pending.shift()) {
      const response=await fetch(`content/${row.id}.json`); if(!response.ok)throw new Error(`Missing evidence ${row.id}`);
      const file: unknown=await response.json();
      if(!file||typeof file!=='object'||!('id' in file)||file.id!==row.id||!('frames' in file)||!Array.isArray(file.frames)||file.frames.length!==row.steps+1||!file.frames.every(f=>typeof f==='string'))throw new Error(`Invalid evidence ${row.id}`);
      cache.set(row.id,file as EvidenceFile);
    }
  }));
}
export class EvidencePanel {
  readonly element: HTMLDivElement;
  private readonly content: HTMLDivElement;
  private key='';
  constructor(stage: HTMLElement) {
    this.element=document.createElement('div');this.element.id='p-evidence';this.element.className='pane evidence-board';this.element.dataset['panel']='evidence';
    const shadow=this.element.attachShadow({mode:'open'});
    const style=document.createElement('style');
    style.textContent=styles+`
:host {
  display: block;
  background: rgba(255, 255, 255, 0.85);
  color: #151a17;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.75);
  box-shadow: 0 20px 70px rgba(13, 123, 60, 0.14), 0 4px 16px rgba(21, 26, 23, 0.04);
  border-radius: 28px;
}
:host(.quality-light) {
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  background: rgba(255, 255, 255, 0.96) !important;
}
* { box-sizing: border-box; }
.deck {
  position: absolute;
  width: 1920px;
  height: 1080px;
  transform: scale(.86);
  transform-origin: 0 0;
  left: -95px;
  top: -38px;
  background: transparent;
}
.slide {
  display: block !important;
  position: absolute;
  inset: 0;
  width: 1920px;
  height: 1080px;
  overflow: visible;
  contain: none;
  background: transparent !important;
  color: #151a17 !important;
}
.slide.night {
  background: transparent !important;
  color: #151a17 !important;
}
.slide.night h1, .slide.night h2, .slide.night h3, .slide.night p, .slide.night b, .slide.night strong, .slide.night span, .slide.night td, .slide.night th {
  color: #151a17 !important;
}
.slide.night .kick, .slide.night .jh, .slide.night em, .slide.night .accent {
  color: #0d7b3c !important;
}
.slide.night p.l, .slide.night .muted, .slide.night .yr {
  color: #536459 !important;
}
.slide.night hr, .slide.night div[style*="border"] {
  border-color: rgba(13, 123, 60, 0.16) !important;
}
.notes { display: none !important; }
[data-no-advance] { pointer-events: none; }
.dk-frame { border-radius: 20px; }
`;
    this.content=document.createElement('div');this.content.className='deck';shadow.append(style,this.content);stage.append(this.element);
  }
  show(state: Pick<StoryState,'evidence'>, visible: boolean): void {
    if (typeof document !== 'undefined') {
      this.element.classList.toggle('quality-light', document.body.classList.contains('quality-light'));
    }
    const ref=state.evidence;
    this.element.classList.toggle('on',visible&&!!ref);this.element.inert=!visible||!ref;
    if(!ref)return;
    const isSplit = ['probleme', 'reponse', 'grille', 'acteurs', 'sommaire'].includes(ref.seq);
    const isWide = ['supervision', 'alerte', 'dashboard', 'journaux', 'grafana'].includes(ref.seq);
    this.element.classList.toggle('comp-split', isSplit);
    this.element.classList.toggle('comp-wide', isWide);
    this.element.classList.toggle('comp-balanced', !isSplit && !isWide);
    const key=`${ref.seq}-${ref.step}`;if(key===this.key)return;
    const html=cache.get(ref.seq)?.frames[ref.step];if(!html)throw new Error(`Missing frame ${key}`);
    // Only our generated immutable content is accepted. Defensive check keeps the renderer safe if an export is tampered with.
    const template=document.createElement('template');template.innerHTML=html;
    if(template.content.querySelector('script,iframe,object,embed,video,audio,button'))throw new Error('Unsafe evidence element');
    for(const e of template.content.querySelectorAll('*'))for(const a of e.attributes) {
      if((a.name==='style'&&/url\s*\(\s*["']?\s*(?:https?:|javascript:|\/\/)/i.test(a.value))||/^on/i.test(a.name)||(/^(src|href|xlink:href)$/i.test(a.name)&&/^(https?:|javascript:|\/\/)/i.test(a.value)))throw new Error('Unsafe evidence attribute');
    }
    this.key=key;this.content.replaceChildren(template.content);this.element.dataset['frame']=key;
  }
}
