import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { sequenceDiagramFrames, isolationDiagramFrames } from './diagrams.mjs';
import { alertFrames } from './alerts.mjs';

export function finalizeRevision(root) {
  const read = id => JSON.parse(readFileSync(resolve(root, `public/content/${id}.json`), 'utf8'));
  const write = (id, frames) => writeFileSync(resolve(root, `public/content/${id}.json`), JSON.stringify({ id, frames }) + '\n');
  write('sequence', sequenceDiagramFrames()); write('isolation', isolationDiagramFrames());
  write('alerte', alertFrames());
  const sequencesPath = resolve(root, 'content/source/sequences.json');
  const sequences = JSON.parse(readFileSync(sequencesPath, 'utf8'));
  sequences.find(row => row.id === 'ch6').title = 'Bilan, perspectives et conclusion';
  writeFileSync(sequencesPath, JSON.stringify(sequences, null, 2) + '\n');
  write('parcours-app', read('parcours-app').frames.map((frame, i) => {
    if (i !== 0 && i !== 2) return frame;
    const admin = frame.replace('class="slide"', `class="slide admin-state${i === 0 ? ' assignment-state' : ''}"`);
    return i === 0 ? admin.replace(/<p class="src"[^>]*>[\s\S]*?<\/p>/g, '') : admin;
  }));
  const releaseLabels = ['1 — Fondations', '2 — Chaîne de livraison sécurisée', '3 — Exploitation et vérification'];
  write('methodologie', read('methodologie').frames.map(frame => releaseLabels.reduce((html, label, i) => html.replaceAll(`<h3>Release ${i + 1}</h3>`, `<h3>${label}</h3>`), frame)));
  for (const id of ['ch6', 'retour', 'bilan', 'limites', 'video']) write(id, read(id).frames.map(frame => frame.replaceAll('Bilan et perspectives', 'Bilan, perspectives et conclusion').replaceAll('assets/deck/logo-white.png', 'assets/deck/logo-green.png')));
  // Only normalize apostrophe typography, preserving every accepted word and every source image.
  for (const id of ['reponse', 'acteurs', 'modele', 'analyses']) write(id, read(id).frames.map(frame => frame.replaceAll('’', "'")));
  const bmcQuotes = sequences.find(row => row.id === 'modele').speech.map(chunk => [...chunk.matchAll(/\[lire\]\s*«([\s\S]*?)»/g)].map(match => match[1].trim()).filter(quote => !quote.startsWith("Une grille d'évaluation")));
  write('modele', read('modele').frames.map((frame, i) => frame.replace(/<div class="bmc-reading"[\s\S]*?<\/div>/g, '')
    .replace('<section class="slide"', `<section class="slide${i ? ' bmc-zoom' : ''}"`)
    .replace('</section>', i ? `<div class="bmc-reading">${bmcQuotes[i].map(quote => `<p>${quote}</p>`).join('')}</div></section>` : '</section>')));
  // The actors' accepted read instructions describe the grouped roles. Show these exact phrases alongside them.
  const actorQuotes = ["Les entreprises : évaluation, consultation des résultats, marché local, recommandations et rapports.", "L'administrateur : gestion des comptes, examen des grilles d'évaluation et validation des dossiers."];
  write('acteurs', read('acteurs').frames.map((frame, i) => frame.replace(/<p class="actor-reading"[\s\S]*?<\/p>/g, '').replace('</section>', `<p class="actor-reading" data-focus>${actorQuotes[i]}</p></section>`)));
  const sprintLabels = { 'outils-dev': 'Plateforme', 'outils-infra': 'S1 · S2', architecture: 'S2', routage: 'S2', secrets: 'S5',
    'outils-livraison': 'S3 · S4', 'dix-pipelines': 'S3', 'controle-publication': 'S3', tests: 'S3', analyses: 'S3', blocage: 'S3', log4j: 'S3', argocd: 'S4', tracabilite: 'S4', supervision: 'S5', metriques: 'S5', journaux: 'S5', alerte: 'S5', validation: 'S5' };
  for (const [id, label] of Object.entries(sprintLabels)) write(id, read(id).frames.map(frame => frame.replace(/<span class="sprint-marker">[^<]*<\/span>/g, '').replace('</section>', `<span class="sprint-marker">${label}</span></section>`)));
}
