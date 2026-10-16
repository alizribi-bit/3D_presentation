import { readFileSync, writeFileSync } from 'node:fs';
import { FULL_STATES } from '../src/story/itinerary.ts';
const ref = JSON.parse(readFileSync('content/reference/manifest.json'));
const states = ref.states.map((source, i) => {
  const state = FULL_STATES[i];
  if (state.id !== source.id) throw new Error(`Unmapped ${source.id}`);
  const previous = ref.states[i - 1]?.slideId === source.slideId ? ref.states[i - 1] : null;
  const next = ref.states[i + 1]?.slideId === source.slideId ? ref.states[i + 1] : null;
  const imageKey = image => `${image.src}|${image.alt}`;
  const imagesMissingFrom = (images, other) => images.filter(image => !other?.images.some(item => imageKey(item) === imageKey(image)));
  return { ...source, imagesAppearing: imagesMissingFrom(source.images, previous), imagesDisappearingOnNextClick: next ? imagesMissingFrom(source.images, next) : source.images,
    textsDisappearingOnNextClick: next ? source.visibleTexts.filter(text => !next.visibleTexts.includes(text)) : source.visibleTexts,
    state3D: state.id, shot: state.shot, place: state.place, panels: state.panels,
    projection: state.evidence ? 'Cadre fidèle sur tableau glass' : state.cover ? 'Couverture animée' : state.source.seq === 'sommaire' ? 'Roadmap des six lieux' : state.source.seq === 'devsecops' ? 'Cycle 3D et légendes' : 'Écran du film et lecteur natif', notes: state.notes };
});
writeFileSync('docs/CORRESPONDANCE.json', JSON.stringify({ reference: ref.files, counts: ref.counts, states }, null, 2) + '\n');
const md = ['# Correspondance classique → 3D', '', `Source active : \`${ref.root}/deck.html\`, discours \`build/script_rows.py\`. Empreintes : \`content/reference/manifest.json\`.`, '',
  `${ref.counts.slides} slides · ${ref.counts.reveals} révélations · ${ref.counts.states} états · ${ref.counts.advances} avances.`, '',
  'Le JSON associé documente chaque texte visible, image, diagramme, apparition/disparition et discours exact. Les tableaux utilisent les cadres rendus de la référence sans ses scripts. Couverture, sommaire, cycle et lecteur ont une mise en scène 3D dédiée ; leurs contenus sont comparés dans la QA.', '',
  '| Position | Slide | Étape | État 3D | Cadrage | Support |', '|---|---|---|---|---|---|',
  ...states.map(s => `| ${s.position} | ${s.slideId} | ${s.step ? `clic ${s.step}` : 'entrée'} | ${s.state3D} | ${s.shot} | ${s.projection} |`)];
writeFileSync('docs/CORRESPONDANCE.md', md.join('\n') + '\n');
console.log(`Mapped ${states.length} classic states to ${FULL_STATES.length} 3D states.`);
