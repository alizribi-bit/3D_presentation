// Presenter window: shows the speech of the state the jury window announces. It never decides the state itself:
// its keys and clicks become commands for the jury window. Opened late or reloaded, it asks ("hello") and catches up.
import { STATES } from '../content/states.js';
import { link } from './link.js';
import { NAV } from '../nav/keys.js';

const $ = id => document.getElementById(id);
const SCENE_NAMES = { A: 'A · Ouverture et monde', B: 'B · Place de l’achat local', C: 'C · Grille d’évaluation', D: 'D · Zone DevSecOps' };
const TITLES = { couverture: 'Couverture', sommaire: 'Sommaire', probleme: 'Le problème à résoudre', reponse: 'La réponse de ZAWEDNI',
  modele: 'Business Model Canvas · complément', ch3: 'Ouverture du chapitre 3', devsecops: 'Le cycle DevSecOps' };
const KIND = { say: '', read: 'À lire à l’écran', added: 'Ajout (transition)' };
let cur = null, lastSeen = 0;

const ch = link(m => { if (m.t === 'state') { lastSeen = Date.now(); show(m.id); } });
ch.send({ t: 'hello' });
setInterval(() => { if (Date.now() - lastSeen > 2500) ch.send({ t: 'hello' }); status(); }, 1000);

function status() {
  const ok = Date.now() - lastSeen < 4000;
  $('status').className = ok ? '' : 'off';
  $('status').textContent = ok ? 'Fenêtre jury connectée' : 'Fenêtre jury absente';
}

function scriptHTML(s) {
  const p = document.createElement('div');
  for (const [kind, text, note] of s.notes.script) {
    const el = document.createElement('p'); el.className = kind;
    if (KIND[kind]) { const t = document.createElement('span'); t.className = 'tag'; t.textContent = KIND[kind]; el.append(t); }
    el.append(kind === 'read' ? `« ${text} »` : text);
    if (note) { const sm = document.createElement('small'); sm.textContent = kind === 'added' ? note : `source : ${note}`; el.append(sm); }
    p.append(el);
  }
  if (s.notes.silent) { const el = document.createElement('p'); el.className = 'silent'; el.textContent = s.notes.silent; p.append(el); }
  return p;
}

function show(id) {
  const i = STATES.findIndex(s => s.id === id); if (i < 0 || id === cur) return;
  cur = id; const s = STATES[i], n = STATES[i + 1];
  $('pos').textContent = `${s.id} · ${i + 1} / ${STATES.length}`;
  $('src').textContent = `${SCENE_NAMES[s.scene]} — source : ${s.source.seq}, étape ${s.source.step}${s.added ? ' · mise en scène ajoutée' : ''}`;
  $('script').replaceChildren(scriptHTML(s));
  $('next').innerHTML = '';
  const b = document.createElement('b'); b.textContent = 'Prochain clic → '; $('next').append(b, s.notes.next);
  const ab = $('afterBody'); ab.replaceChildren();
  if (n) {
    const h = document.createElement('b'); h.textContent = `${n.id} · ${n.source.seq}`; ab.append(h, document.createElement('br'));
    const first = n.notes.script[0]; ab.append(first ? (first[0] === 'read' ? `À lire : « ${first[1]} »` : first[1]) : n.notes.silent || '');
  } else ab.textContent = 'Fin du prototype.';
  for (const li of $('list').querySelectorAll('li[data-i]')) li.classList.toggle('cur', +li.dataset.i === i);
  $('list').querySelector('li.cur')?.scrollIntoView({ block: 'nearest' });
}

// the map of the prototype: click a line to go there
let scene = '';
STATES.forEach((s, i) => {
  if (s.scene !== scene) { scene = s.scene; const h = document.createElement('li'); h.innerHTML = `<span class="scene"></span>`; h.firstChild.textContent = SCENE_NAMES[scene]; $('list').append(h); }
  const li = document.createElement('li'); li.dataset.i = i;
  const b = document.createElement('b'); b.textContent = s.id; const t = document.createElement('span'); t.textContent = `${TITLES[s.source.seq]}${s.added ? ' · ajout' : ''}`;
  li.append(b, t); li.onclick = () => ch.send({ t: 'cmd', cmd: `go:${i}` }); $('list').append(li);
});

addEventListener('keydown', e => {
  if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === '+' || e.key === '=') { size(1); return; }
  if (e.key === '-') { size(-1); return; }
  const cmd = NAV[e.key]; if (!cmd) return;
  e.preventDefault(); ch.send({ t: 'cmd', cmd });
});
addEventListener('mousedown', e => { if (!e.target.closest('li, #timer')) e.preventDefault(); });
function size(d) { const r = document.documentElement, v = parseFloat(getComputedStyle(r).getPropertyValue('--fs')); r.style.setProperty('--fs', `${Math.min(40, Math.max(16, v + d * 2))}px`); }

let t0 = Date.now();
$('timer').onclick = () => { t0 = Date.now(); };
setInterval(() => {
  const s = Math.floor((Date.now() - t0) / 1000);
  $('timer').textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  $('clock').textContent = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}, 500);
status();
window.__presenter = { get cur() { return cur; } };
