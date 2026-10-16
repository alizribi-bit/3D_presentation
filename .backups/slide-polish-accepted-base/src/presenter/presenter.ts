// Notes project the jury's authoritative state. This entry never imports a renderer or media.
import { STATES as importedStates } from '../content/states.js';
import { link } from './link.js';
import { PROTOTYPE } from '../nav/mode.js';
import sequences from '../../content/source/sequences.json';
import { NAV } from '../nav/keys.js';
import { cueGroups } from './cues.ts';
import type { StoryState } from '../story/types.ts';
import { isMessage } from '../nav/commands.ts';
const STATES = importedStates as readonly StoryState[];
function element<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing presenter element ${id}`);
  return el as T;
}
const names: Record<string, string> = { 0: 'Ouverture', 1: '01 · Contexte et objectifs', 2: '02 · Architecture et démarche DevSecOps', 3: '03 · Chaîne CI/CD et déploiement', 4: '04 · Supervision et validation', 5: '05 · Bilan, perspectives et conclusion' };
const source = new Map(sequences.map(row => [row.id, row]));
const titles = { say: 'À dire', read: 'À lire à l’écran', added: 'Transition' };
let cur: string | null = null, lastSeen = 0;
const ch = link((message: unknown) => {
  if (isMessage(message) && message.t === 'state') { lastSeen = Date.now(); show(message.id); }
});
ch.send({ t: 'hello' });
function status(): void {
  const connected = Date.now() - lastSeen < 4000;
  element('status').classList.toggle('off', !connected);
  element('status').textContent = connected ? 'Jury connecté' : 'En attente du jury';
}
setInterval(() => { if (Date.now() - lastSeen > 2500) ch.send({ t: 'hello' }); status(); }, 1000);
function script(state: StoryState): DocumentFragment {
  const fragment = document.createDocumentFragment();
  for (const group of cueGroups(state.notes.script)) {
    const section = document.createElement('section'); section.className = `cue ${group.kind}`;
    const heading = document.createElement('h2'); heading.textContent = titles[group.kind]; section.append(heading);
    for (const text of group.texts) {
      const p = document.createElement('p'); p.textContent = group.kind === 'read' ? `« ${text} »` : text; section.append(p);
    }
    fragment.append(section);
  }
  if (state.notes.silent) {
    const section = document.createElement('section'); section.className = 'cue silent';
    const heading = document.createElement('h2'); heading.textContent = 'Indication silencieuse';
    const p = document.createElement('p'); p.textContent = state.notes.silent; section.append(heading, p); fragment.append(section);
  }
  return fragment;
}
function show(id: string): void {
  const i = STATES.findIndex(state => state.id === id), state = STATES[i];
  if (!state || id === cur) return;
  cur = id; const row = source.get(state.source.seq);
  element('title').textContent = state.title;
  element('step').textContent = state.source.step === 0 ? 'Entrée de la slide' : `Clic ${state.source.step} sur ${row?.steps ?? state.source.step}`;
  element('src').textContent = names[state.scene] ?? state.scene;
  element('pos').textContent = `Slide ${row?.seq ?? '—'} / ${sequences.length} · État ${i + 1} / ${STATES.length}`;
  element<HTMLProgressElement>('progress').value = (i + 1) / STATES.length;
  element('script').replaceChildren(script(state)); element('now').scrollTop = 0;
  element('next').textContent = `Prochain clic → ${state.notes.next}`;
  const next = STATES[i + 1]; element('afterBody').replaceChildren();
  if (next) element('afterBody').append(script(next));
  else element('afterBody').textContent = 'Fin de la présentation.';
  for (const button of element('list').querySelectorAll<HTMLElement>('[data-i]')) {
    const current = Number(button.dataset['i']) === i;
    button.classList.toggle('cur', current); button.setAttribute('aria-current', String(current));
    if (current && element<HTMLDetailsElement>('map').open) button.scrollIntoView({ block: 'nearest' });
  }
  status();
}
let scene = '';
STATES.forEach((state, i) => {
  if (state.scene !== scene) {
    scene = state.scene; const li = document.createElement('li'); li.className = 'scene'; li.textContent = names[scene] ?? scene; element('list').append(li);
  }
  const li = document.createElement('li'), button = document.createElement('button');
  button.type = 'button'; button.dataset['i'] = String(i);
  button.textContent = `${state.title} · ${state.source.step ? `clic ${state.source.step}` : 'entrée'}`;
  button.onclick = () => ch.send({ t: 'cmd', cmd: `go:${i}` }); li.append(button); element('list').append(li);
});
element('keys').textContent = `→ Espace PageDown : suivant · ← PageUp : précédent · ${PROTOTYPE ? '1–4 : scène' : '1–5 : chapitre'} · Home / End : début / fin · + / − : taille du texte`;
addEventListener('keydown', event => {
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.key === '+' || event.key === '=') { size(1); return; }
  if (event.key === '-') { size(-1); return; }
  if ((event.key === 'Enter' || event.key === ' ') && event.target instanceof HTMLElement && event.target.closest('button,summary')) return;
  const command = (NAV as Record<string, string>)[event.key];
  if (command) { event.preventDefault(); ch.send({ t: 'cmd', cmd: command }); }
});
function size(delta: number): void {
  const root = document.documentElement;
  const value = Math.min(48, Math.max(22, parseFloat(getComputedStyle(root).getPropertyValue('--fs')) + delta * 2));
  root.style.setProperty('--fs', `${value}px`); localStorage.setItem('zs3d-presenter-font', String(value));
}
const savedSize = Number(localStorage.getItem('zs3d-presenter-font'));
if (savedSize >= 22 && savedSize <= 48) document.documentElement.style.setProperty('--fs', `${savedSize}px`);
element('larger').onclick = () => size(1); element('smaller').onclick = () => size(-1);
element('prev').onclick = () => ch.send({ t: 'cmd', cmd: 'prev' });
element('advance').onclick = () => ch.send({ t: 'cmd', cmd: 'next' });
let t0 = Number(sessionStorage.getItem('zs3d-timer')) || Date.now();
sessionStorage.setItem('zs3d-timer', String(t0));
element('timer').onclick = () => { t0 = Date.now(); sessionStorage.setItem('zs3d-timer', String(t0)); };
setInterval(() => {
  const seconds = Math.floor((Date.now() - t0) / 1000);
  element('timer').textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}, 500);
status();
Object.assign(window, { __presenter: { get cur() { return cur; } } });
