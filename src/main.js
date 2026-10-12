// Jury window: the 3D world, the DOM layer and the keyboard. No notes and no controls are ever shown here;
// the presenter window (presenter.html) gets the state over the BroadcastChannel and sends its keys back.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { preload } from './world/assets.js';
import { buildWorld, anchors } from './world/world.js';
import { quality, applyQuality, toggleQuality } from './world/quality.js';
import { buildPanels } from './content/panels.js';
import { STATES, SCENES, indexOf } from './content/states.js';
import { Actor } from './characters/actors.js';
import { Director } from './nav/director.js';
import { bindKeys } from './nav/keys.js';
import { toggleMotion } from './nav/prefs.js';
import { link } from './presenter/link.js';
import { PROTOTYPE } from './nav/mode.js';
import { parseCommand } from './nav/commands.ts';
import { preloadEvidence, EvidencePanel } from './story/evidence.ts';
import { FilmPlayer } from './media/player.ts';
import { shouldAutoplayFilm } from './media/transition.ts';
import { StoryWorld } from './world/story.ts';
import { applyShot } from './camera/rig.js';

const Q = new URLSearchParams(location.search);
const canvas = document.getElementById('world');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: Q.has('test') });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.shadowMap.autoUpdate = false;   // the décor never moves: its shadows are drawn once (characters have contact shadows)

const scene = new THREE.Scene();
scene.background = new THREE.Color('#f4f7f2');
scene.fog = new THREE.Fog('#f4f7f2', 140, 280);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture; scene.environmentIntensity = .25;
scene.add(new THREE.HemisphereLight('#ffffff', '#a9bb9c', 1.05));
const sun = new THREE.DirectionalLight('#fff1dc', 2.4);
sun.position.set(-40, 70, 45); sun.castShadow = true;
Object.assign(sun.shadow.camera, { left: -85, right: 85, top: 60, bottom: -60, near: 10, far: 220 });
sun.shadow.bias = -.0004; sun.shadow.normalBias = .04; sun.shadow.radius = 3;
scene.add(sun, sun.target);
const camera = new THREE.PerspectiveCamera(34, 16 / 9, .3, 600);

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  // the 3D view keeps the 16:9 framing of the stage: wider windows see more sideways, never less
  camera.aspect = w / h; camera.updateProjectionMatrix();
  const s = Math.min(w / 1920, h / 1080);
  document.getElementById('stage').style.transform = `translate(${(w - 1920 * s) / 2}px, ${(h - 1080 * s) / 2}px) scale(${s})`;
}
addEventListener('resize', resize);

try { await Promise.all([preload(), PROTOTYPE ? Promise.resolve() : preloadEvidence()]); } catch (error) {
  const veil = document.getElementById('veil'); veil.classList.add('error'); veil.textContent = 'La présentation ne peut pas charger ses fichiers locaux. Relancez le serveur local puis rechargez cette fenêtre.'; throw error;
}
buildWorld(scene);
const storyWorld = PROTOTYPE ? null : new StoryWorld(scene, anchors, () => { renderer.shadowMap.needsUpdate = true; });
buildPanels();
const stage = document.getElementById('stage');
const evidence = PROTOTYPE ? null : new EvidencePanel(stage);
const film = PROTOTYPE ? null : new FilmPlayer(stage);
const actors = { guide: new Actor('guide', 1.76), rep: new Actor('rep', 1.8) };
for (const a of Object.values(actors)) scene.add(a.root);
applyQuality(renderer, sun); resize();
renderer.shadowMap.needsUpdate = true;

// ── the two windows ──
const ch = link(m => {
  if (m.t === 'hello') announce();
  if (m.t === 'cmd') command(m.cmd);
});
let previousMediaIndex = -1;
function announce() {
  const autoplay = !Q.has('test') && shouldAutoplayFilm(STATES[previousMediaIndex]?.media ?? null, director.state.media ?? null, director.i > previousMediaIndex);
  film?.show(director.state, autoplay);
  previousMediaIndex = director.i;
  ch.send({ t: 'state', id: director.state.id, i: director.i, total: STATES.length });
}

const director = new Director({ camera, actors, onState: announce, still: Q.has('still'), fast: Q.has('test') && Q.has('fast'), onFrame: (visible, state, k, from) => { evidence?.show(state, visible.has('evidence')); storyWorld?.frame(state, k, from); } });
const fromHash = indexOf(location.hash.slice(1));
director.go(fromHash >= 0 ? fromHash : 0, { instant: true });
addEventListener('hashchange', () => { const i = indexOf(location.hash.slice(1)); if (i >= 0 && i !== director.i) director.go(i, { instant: true }); });

let notesWin = null;
function openNotes() {
  const pv = /(?:^|&)pv=(-?\d+),(-?\d+),(\d+),(\d+)/.exec(location.search.slice(1));   // ?pv=x,y,w,h (present.sh) or ?pv=auto
  const feat = pv ? `left=${pv[1]},top=${pv[2]},width=${pv[3]},height=${pv[4]}` : 'width=1280,height=800';
  notesWin = window.open(`presenter.html${PROTOTYPE ? '?prototype' : ''}`, 'zs3d-presenter', feat);
  if (pv && notesWin) try { notesWin.moveTo(+pv[1], +pv[2]); notesWin.resizeTo(+pv[3], +pv[4]); } catch { /* the window manager decides */ }
}
function command(raw) {
  const parsed = parseCommand(raw, STATES.length, SCENES); if (!parsed) return;
  if (parsed.kind === 'index') { director.go(parsed.index); return; }
  const cmd = parsed.action;
  if (cmd === 'next') director.next();
  else if (cmd === 'prev') director.prev();
  else if (cmd === 'home') director.go(0);
  else if (cmd === 'fullscreen') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {});
  else if (cmd === 'quality') { toggleQuality(); applyQuality(renderer, sun); renderer.shadowMap.needsUpdate = true; }
  else if (cmd === 'motion') toggleMotion();
  else if (cmd === 'notes') openNotes();
}
bindKeys(command);

// dev only: ?cam=x,y,z,tx,ty,tz,fov freezes the camera for framing work
const free = Q.get('cam')?.split(',').map(Number);

// fps probe (?fps): mean and 5th percentile per transition, in the console only
const fps = Q.has('fps') ? { on: false, dts: [] } : null;
let last = performance.now();
renderer.setAnimationLoop(() => {
  const now = performance.now();
  director.frame(now / 1000);
  if (free) applyShot(camera, { pos: free.slice(0, 3), target: free.slice(3, 6), fov: free[6] || 34 });
  renderer.render(scene, camera);
  if (fps) {
    if (director.moving) { fps.on = true; fps.dts.push(now - last); }
    else if (fps.on) {
      const f = fps.dts.map(d => 1000 / d).sort((a, b) => a - b), mean = f.reduce((a, b) => a + b, 0) / f.length;
      console.log(`[fps] ${director.state.id} (${quality.level}) mean ${mean.toFixed(1)} · p5 ${f[Math.floor(f.length * .05)].toFixed(1)} · ${f.length} frames`);
      fps.on = false; fps.dts = [];
    }
  }
  last = now;
});
document.getElementById('veil').classList.add('off');
if (/(?:^|&)pv=/.test(location.search.slice(1))) setTimeout(openNotes, 300);
window.__story = { renderer, ready: true, get settled() { return director.settled; }, get state() { return director.state.id; }, go: (i, options) => director.go(i, options), states: STATES.map(s => ({ id: s.id, source: s.source, shot: s.shot })), director };
