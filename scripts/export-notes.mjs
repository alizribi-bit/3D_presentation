import { readFileSync, writeFileSync } from 'node:fs';
import { isDeliveryReveal } from '../src/story/delivery-layout.ts';
import { FULL_STATES } from '../src/story/itinerary.ts';
const rows = JSON.parse(readFileSync(new URL('../content/source/sequences.json', import.meta.url)));
const lines = ['# Discours 3D — référence classique actuelle', '', `${rows.length} slides, ${FULL_STATES.length} états, ${FULL_STATES.length - 1} pressions suivant. Les blocs \`[lire]\` correspondent à l’écran.`, ''];
for (const row of rows) {
  lines.push(`## ${String(row.seq).padStart(2, '0')} · ${row.id} — ${row.title}`, '');
  for (const state of FULL_STATES.filter(state => state.source.seq === row.id)) {
    lines.push(`### ${state.id} · ${state.source.step === 0 ? 'Entrée' : `Clic ${state.source.step}`}`, '');
    lines.push(`Repère 3D (ne pas dire) : ${state.move === 'travel' ? 'arrivée dans la zone '+state.place+' ; parler pendant le déplacement' : state.source.seq === 'retour' && state.source.step === 1 ? 'retour de la caméra au monde, sans marche' : state.media?.step === 1 ? 'lecture du film et silence' : isDeliveryReveal(state.source) ? state.source.step === 1 ? 'tableau en haut, convoyeur en bas ; ouverture du cadrage pendant la parole' : 'caméra stable ; le colis avance ou reprend sur ce clic' : state.source.step ? 'révélation locale ; caméra stable' : 'ouverture du contenu'}. État ${state.id}, cadrage ${state.shot}.`, '');
    for (const [kind, text] of state.notes.script) lines.push(kind === 'read' ? `[lire] « ${text} »` : text, '');
    if (state.notes.silent) lines.push(`(${state.notes.silent})`, '');
    lines.push(`Prochain clic : ${state.notes.next}`, '');
  }
}
writeFileSync(new URL('../docs/SCRIPT-ACTUEL.md', import.meta.url), lines.join('\n'));
console.log('Exported docs/SCRIPT-ACTUEL.md from the same typed itinerary as the presenter.');
