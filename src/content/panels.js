// DOM panels of the jury window, on a 1920×1080 stage. Text is the accepted deck's projected text, word for word
// (typographic apostrophes as on the slides). A panel either sits at a fixed place on the stage or follows a
// 3D anchor (projected every frame). Nothing here is clickable.
import * as THREE from 'three';
import { PLACES, ROLE } from '../world/places.js';
import { anchors, STAGES } from '../world/world.js';

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const COVER = `
  <div class="bw"><p class="bism">بسم الله الرحمن الرحيم</p></div>
  <div class="tile is" style="transition-delay:.45s"><img src="assets/deck/logo-isima.png" alt="Logo ISIMa"><span>Institut Supérieur d'Informatique de Mahdia</span></div>
  <div class="tile zw" style="transition-delay:.57s"><img src="assets/deck/logo-green.png" alt="Logo ZAWEDNI"><b>ZAWEDNI</b></div>
  <p class="kick" style="transition-delay:.85s">MEMOIRE DE FIN D’ETUDES</p>
  <h1 style="transition-delay:1.05s">Conception et déploiement d'une plateforme web et mobile pour l'achat local intégrant une approche DevSecOps</h1>
  <div class="who" style="transition-delay:1.6s">
    <div><p class="l">Élaboré par</p><b>Ali Zribi</b></div>
    <div><p class="l">Formation</p><b>Master Professionnel Computer Engineering : Expert Réseaux</b></div>
  </div>
  <p class="jh" style="transition-delay:2s">Les membres du jury :</p>
  <div class="jury" style="transition-delay:2.1s">
    <div><p class="l">Présidente</p><b>Mme. Ines Ben Hassine</b></div>
    <div><p class="l">Rapporteure</p><b>Mme. Ben Aichaa Takwa</b></div>
    <div><p class="l">Encadrante académique</p><b>Mme. Amel Zidi</b></div>
    <div><p class="l">Co-encadrante académique</p><b>Mme. Gannay Sana</b></div>
    <div><p class="l">Encadrante professionnelle</p><b>Mme. Hadil Ben Masseoud</b></div>
  </div>
  <p class="yr" style="transition-delay:2.5s">Année universitaire 2026-2027</p>`;

const FACTS = ['Les actions RSE restent parfois ponctuelles, comme des dons.', 'Il manque une stratégie claire pour agir et suivre les résultats.',
  'Il est difficile de comparer les fournisseurs locaux sur leurs pratiques responsables.'];
const ANSWERS = [['Grille d’évaluation', 'Une grille d’évaluation pour mesurer les pratiques de l’entreprise.'],
  ['Validation', 'Une validation pour rendre les fournisseurs évalués visibles sur le marché.'],
  ['Marché local', 'Un marché local pour trouver des partenaires et suivre les achats.'],
  ['Suivi des résultats', 'Des recommandations, un guide pour une stratégie RSE et un rapport ESG pour suivre les résultats.']];

// fixed panels: [left, top, width] on the stage
export const PANELS = {
  cover: { cls: 'cover', html: COVER, fixed: [0, 0, 1920] },
  sommaire: { cls: 'title-chip', fixed: [96, 64], html: `<p class="kicker">Plan de la présentation</p><h2>Sommaire</h2>` },
  probleme: { cls: 'board', fixed: [1010, 150, 800], html: `<p class="kicker">Contexte et objectifs</p><h2>Le problème à résoudre</h2>
    <div class="facts">${FACTS.map((f, i) => `<div class="fact" style="transition-delay:${.15 + i * .35}s"><i>0${i + 1}</i><p>${esc(f)}</p></div>`).join('')}</div>` },
  reponse: { cls: 'board', fixed: [1010, 92, 820], html: `<p class="kicker">Contexte et objectifs · La solution</p><h2>La réponse de ZAWEDNI</h2>
    <div class="answers">${ANSWERS.map(([h, t], i) => `<div class="answer${i ? '' : ' key'}" data-k="${i}" style="transition-delay:${.1 + i * .3}s"><div>${i ? '' : '<span class="tagv">VALEUR AJOUTÉE</span>'}<b>${h}</b><p>${esc(t)}</p></div></div>`).join('')}</div>` },
  grille: { cls: 'board', fixed: [1196, 92, 640], html: `<p class="kicker">Complément · Grille d’évaluation</p>
    <p class="quote">Une grille d’évaluation pour mesurer les pratiques responsables de l’entreprise, avant la validation de son dossier.</p>
    <div style="display:flex; gap:22px; align-items:flex-end; margin-top:26px">
      <img class="shot" src="assets/deck/v3-mob-evaluation.jpg" alt="Mobile : une question de la grille d'évaluation" style="width:200px; height:${Math.round(200 * 1125 / 520)}px">
      <p class="cap" style="max-width:300px"><b style="color:var(--ink);font-weight:600">MOBILE</b></p>
    </div>` },
  'grille-cap': { cls: 'cap-chip', anchor: () => anchors.easelCap, html: `<b>WEB</b> · Site client · Évaluation RSE : piliers de la grille` },
  chaine: { cls: 'board', fixed: [190, 700, 1540], html: `<p class="kicker">Contexte et objectifs · La solution</p>
    <div class="chain">${ANSWERS.map(([h], i) => `<div class="link${i ? '' : ' key'}"><b>${h}</b></div>`).join('')}</div>
    <div class="back"></div>` },
  'cycle-title': { cls: 'title-chip', fixed: [96, 64], html: `<p class="kicker">Architecture et démarche DevSecOps · Démarche</p><h2>Le cycle DevSecOps</h2>` },
  'side-dev': { cls: 'side', anchor: () => anchors.lobeDev, html: `<b style="color:var(--green)">Développement</b><span>Préparer et vérifier</span>` },
  'side-ops': { cls: 'side', anchor: () => anchors.lobeOps, html: `<b style="color:var(--green-d)">Exploitation</b><span>Déployer et observer</span>` },
  secu: { cls: 'side card', anchor: () => anchors.secuLabel, html: `<b style="color:var(--ink);font-size:30px">Sécurité</b><span style="font-size:22px">tout au long du cycle</span>` },
  fb: { cls: 'fb-line', fixed: [150, 900, 1620], html: `Les observations reviennent vers le développement pour préparer les corrections` },
  secline: { cls: 'sec-line', fixed: [150, 966, 1620], html: `<b>Sécurité :</b> analyses avant publication · accès protégés au déploiement · surveillance pendant l’exploitation` },
};
STAGES.forEach(([, name], i) => { PANELS[`stage${i}`] = { cls: 'stage-tag', anchor: () => anchors[`stageTag${i}`], html: name }; });
PLACES.forEach(p => {
  PANELS[`l${p.id}`] = { cls: `label${p.below ? ' below' : ''}`, anchor: () => anchors[`label${p.id}`], pin: 64,
    html: `<i class="pin"></i><div class="tag" style="--role:${ROLE[p.role]}"><span class="num">${p.id}</span><div><b>${p.title}</b><span>${p.line}</span></div></div>` };
});

const els = {};
const stage = () => document.getElementById('stage');

export function buildPanels() {
  for (const [id, p] of Object.entries(PANELS)) {
    const el = document.createElement('div');
    el.className = `pane ${p.cls}`; el.id = `p-${id}`; el.innerHTML = p.html; el.dataset.panel = id;
    if (p.anchor) { el.style.left = '0px'; el.style.top = '0px'; }
    if (p.fixed) { el.style.left = `${p.fixed[0]}px`; el.style.top = `${p.fixed[1]}px`; if (p.fixed[2]) el.style.width = `${p.fixed[2]}px`; }
    stage().appendChild(el); els[id] = el;
  }
  els.cover.classList.add('on');
}

const v = new THREE.Vector3();
// Screen position (stage pixels) of a world point.
export function toStage(p, camera) {
  v.copy(p).project(camera);
  return [(v.x + 1) / 2 * 1920, (1 - v.y) / 2 * 1080, v.z < 1];
}

// Called every frame: visibility from the director, positions of anchored panels from the camera.
export function updatePanels(visible, camera, state) {
  for (const [id, p] of Object.entries(PANELS)) {
    const el = els[id], on = visible.has(id);
    if (el.classList.contains('on') !== on) el.classList.toggle('on', on);
    if (p.anchor && (on || el.classList.contains('on'))) {
      const [x, y] = toStage(p.anchor(), camera);
      el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;   // no layout per frame: left/top stay 0
    }
  }
  for (const pl of PLACES) els[`l${pl.id}`].classList.toggle('visited', !!state?.visited?.includes(pl.id));
  for (let i = 0; i < 6; i++) els[`stage${i}`].classList.toggle('hot', !!state?.hot?.includes(`stage${i}`));
}

export function setCover(mode) {   // 'basmala' | 'full' | 'gone'
  els.cover.classList.toggle('full', mode === 'full');
  els.cover.classList.toggle('gone', mode === 'gone');
}

// Centre of a panel element (or a part of it), in stage pixels: what a character points at.
export function panelStagePoint(id) {
  const el = id === 'reponse-key' ? els.reponse.querySelector('.answer.key') : els[id];
  const st = stage().getBoundingClientRect(), r = el.getBoundingClientRect(), s = st.width / 1920;
  return [(r.left - st.left) / s, (r.top + r.height / 2 - st.top) / s];
}
