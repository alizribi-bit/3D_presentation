import { VideoLifecycle } from './lifecycle.ts';
import type { StoryState } from '../story/types.ts';
export class FilmPlayer {
  readonly video: HTMLVideoElement;
  private readonly element: HTMLDivElement;
  private readonly button: HTMLButtonElement;
  private readonly lifecycle: VideoLifecycle;
  constructor(stage: HTMLElement) {
    this.element=document.createElement('div');this.element.id='film';this.element.className='film';this.element.hidden=true;
    this.video=document.createElement('video');this.video.src='media/zawedni-devsecops.mp4';this.video.poster='assets/deck/video-poster.jpg';this.video.controls=true;this.video.playsInline=true;this.video.preload='metadata';this.video.setAttribute('aria-label',"Le parcours d'une version, du code au suivi");
    this.button=document.createElement('button');this.button.type='button';this.button.textContent='Lire la vidéo · 1 min 30';
    this.button.addEventListener('click',()=>{void this.lifecycle.play().then(played=>{if(!played)this.button.hidden=false;});});
    this.video.addEventListener('play',()=>{this.button.hidden=true;});
    this.video.addEventListener('pause',()=>{this.button.hidden=false;});
    this.video.addEventListener('ended',()=>{this.button.hidden=false;});
    // Native mouse controls keep their normal behavior; afterward the clicker controls the presentation again.
    this.element.addEventListener('pointerup',()=>setTimeout(()=>{const active=document.activeElement;if(active instanceof HTMLElement&&this.element.contains(active))active.blur();},0));
    this.element.append(this.video,this.button);stage.append(this.element);this.lifecycle=new VideoLifecycle(this.video);
  }
  suspend(): void { this.video.pause(); }
  show(state: Pick<StoryState,'media'>, autoplay: boolean, visible = true): void {
    const media = visible ? state.media : undefined;
    this.element.hidden=!media;this.element.inert=!media;
    void this.lifecycle.enter(media?.step??null,autoplay);
  }
}
