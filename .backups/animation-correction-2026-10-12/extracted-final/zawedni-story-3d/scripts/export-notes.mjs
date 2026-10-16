import { readFileSync, writeFileSync } from 'node:fs';
import { FULL_STATES } from '../src/story/itinerary.ts';
const rows = JSON.parse(readFileSync(new URL('../content/source/sequences.json', import.meta.url)));
const lines = ['# Discours 3D — référence classique actuelle', '', `${rows.length} slides, ${FULL_STATES.length} états, ${FULL_STATES.length - 1} pressions suivant. Les blocs \`[lire]\` correspondent à l’écran.`, ''];
for (const row of rows) {
  lines.push(`## ${String(row.seq).padStart(2, '0')} · ${row.id} — ${row.title}`, '');
  for (const state of FULL_STATES.filter(state => state.source.seq === row.id)) {
    lines.push(`### ${state.id} · ${state.source.step === 0 ? 'Entrée' : `Clic ${state.source.step}`}`, '');
    for (const [kind, text] of state.notes.script) lines.push(kind === 'read' ? `[lire] « ${text} »` : text, '');
    if (state.notes.silent) lines.push(`(${state.notes.silent})`, '');
    lines.push(`Prochain clic : ${state.notes.next}`, '');
  }
}
writeFileSync(new URL('../docs/SCRIPT-ACTUEL.md', import.meta.url), lines.join('\n'));
console.log('Exported docs/SCRIPT-ACTUEL.md from the same typed itinerary as the presenter.');
