import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { FULL_STATES, speechNotes } from '../src/story/itinerary.ts';
import rows from '../content/source/sequences.json';
import reference from '../content/reference/manifest.json';
import { cueGroups } from '../src/presenter/cues.ts';

test('current reference determines counts, order and every exact speech chunk', () => {
  assert.deepEqual(rows, reference.rows);
  assert.equal(FULL_STATES.length, reference.counts.states);
  assert.deepEqual(FULL_STATES.map(state => state.id), reference.states.map(state => state.id));
  for (const [i, state] of FULL_STATES.entries()) {
    const source = reference.states[i]!;
    assert.deepEqual(state.notes.script, state.notes.silent ? [] : speechNotes(source.speech));
    if (state.notes.silent) assert.equal(`(${state.notes.silent})`, source.speech.trim());
  }
});
test('exported rendered diagrams and images cannot drift from current classic frames', () => {
  for (const state of reference.states) {
    const evidence = JSON.parse(readFileSync(`public/content/${state.slideId}.json`, 'utf8')) as { frames: string[] };
    assert.equal(createHash('sha256').update(evidence.frames[state.step]!).digest('hex'), state.frameSha256, state.id);
  }
});
test('presenter grouping preserves alternating read passages and speech without reordering', () => {
  const notes = speechNotes('On explique. [lire] « Première. » [lire] « Seconde. » Puis on précise. [lire] « Suite. »');
  assert.deepEqual(cueGroups(notes), [
    { kind: 'say', texts: ['On explique.'] }, { kind: 'read', texts: ['Première.', 'Seconde.'] },
    { kind: 'say', texts: ['Puis on précise.'] }, { kind: 'read', texts: ['Suite.'] },
  ]);
  assert.deepEqual(cueGroups([]), []);
});
test('corrected bilan keeps the accepted read instruction, and architecture/delivery keep all source frames', () => {
  const bilan = FULL_STATES.find(state => state.id === 'bilan-2')!;
  assert.ok(bilan.notes.script.some(([kind, text]) => kind === 'read' && text === 'Les essais en staging et en production montrent comment ces deux volets fonctionnent ensemble.'));
  for (const state of FULL_STATES.filter(state => ['architecture', 'chaine', 'log4j'].includes(state.source.seq))) assert.deepEqual(state.evidence, state.source);
});
