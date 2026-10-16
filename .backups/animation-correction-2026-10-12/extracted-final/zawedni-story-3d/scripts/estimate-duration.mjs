// An explicit speech-rate range is an estimate, never a timed spoken rehearsal.
import { readFileSync, writeFileSync } from 'node:fs';
import { FULL_STATES } from '../src/story/itinerary.ts';
const rows = JSON.parse(readFileSync(new URL('../content/source/sequences.json', import.meta.url), 'utf8'));
const words = text => text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)?.length ?? 0;
const spokenWords = FULL_STATES.reduce((total, state) => total + state.notes.script.reduce((n, note) => n + words(note[1]), 0), 0);
const transitionSeconds = FULL_STATES.slice(1).reduce((total, state) => total + state.duration, 0);
const travelSeconds = FULL_STATES.filter(state => state.move === 'travel').reduce((total, state) => total + state.duration, 0);
const filmSeconds = 90;
const readingPauseSeconds = 1.5 * FULL_STATES.filter(state => !state.notes.silent).length;
const ranges = [110, 125, 140].map(wordsPerMinute => ({ wordsPerMinute,
  speechSeconds: spokenWords * 60 / wordsPerMinute,
  totalMinutes: (spokenWords * 60 / wordsPerMinute + transitionSeconds + readingPauseSeconds + filmSeconds) / 60 }));
const report = { date: new Date().toISOString(), method: 'Estimate: full spoken and [lire] text, 110–140 words/minute, all transitions counted sequentially, 1.5 s reading pause/state, final 90 s film. No speech is removed.',
  sequences: rows.length, states: FULL_STATES.length, reveals: rows.reduce((n, row) => n + row.steps, 0),
  nextPresses: FULL_STATES.length - 1, spokenWords, transitionSeconds, travelSeconds, readingPauseSeconds, filmSeconds, ranges,
  timedRehearsal: false };
writeFileSync(new URL('../docs/DURATION.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
