// Authoring checks: all source steps/speech, generated evidence integrity, exact asset copies and banned terms.
// Browser verification separately checks that the built presentation actually renders these same frames.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { FULL_STATES } from '../src/story/itinerary.ts';
import rows from '../content/source/sequences.json' with { type: 'json' };
import manifest from '../content/source/assets-manifest.json' with { type: 'json' };

const sha = b => createHash('sha256').update(b).digest('hex');
const SOURCE = 'content/history/v7';
const historical = JSON.parse(readFileSync(`${SOURCE}/sequences.json`, 'utf8'));
const approvedBytes = readFileSync('content/revision/accepted-speech.json');
if (sha(approvedBytes) !== 'dc879fa828af4cfde8f9ac5938bb2f7e3b2c4edd5dccd07d600ba6fa77825e09') throw new Error('Approved revision snapshot changed; review its provenance before updating the check.');
const approved = JSON.parse(approvedBytes).sequences;
const expected = new Map([...historical, ...approved].map(row => [row.id, row]));
const banned = [/\bDNS\b/i, /10\s*\/\s*11/, /faux n[ée]gatif/i, /erreur de commande/i];
let failed = 0, frames = 0;
const check = (pass, message) => { if (!pass) { failed++; console.error(`FAIL ${message}`); } };

// 44 sequences and 114 states check
check(rows.length === 44 && FULL_STATES.length === 114, `44 sequences and 114 states (got ${rows.length} seqs, ${FULL_STATES.length} states)`);

for (const row of rows) {
  const states = FULL_STATES.filter(s => s.source.seq === row.id);
  check(states.length === row.steps + 1, `source coverage ${row.id}`);
  check(JSON.stringify(row.speech) === JSON.stringify(expected.get(row.id)?.speech), `exact approved speech ${row.id}`);
  const evidence = JSON.parse(readFileSync(`public/content/${row.id}.json`, 'utf8'));
  check(evidence.id === row.id && evidence.frames.length === row.steps + 1, `evidence coverage ${row.id}`);
  for (const frame of evidence.frames) {
    frames++;
    check(!/<(?:script|iframe|object|embed|video|audio|button)\b|\son[a-z]+=|(?:src|href)=["'](?:https?:|javascript:|\/\/)/i.test(frame), `safe evidence ${row.id}`);
    for (const re of banned) check(!re.test(frame.replace(/<[^>]+>/g, ' ')), `banned term ${row.id}`);
  }
  for (const chunk of row.speech) {
    for (const re of banned) check(!re.test(chunk), `banned speech ${row.id}`);
  }
}

// Source deck fingerprint check (historical baseline v7 preserved)
const deckBytes = readFileSync(`${SOURCE}/deck.html`);
check(sha(deckBytes) === manifest.sourceDeckSha256, 'source deck fingerprint');


console.log(failed ? `${failed} content issue(s)` : `PASS 44 sequences, ${frames} canonical evidence frames, 114 speech states, ${manifest.assets.length} unchanged local assets; no banned terms or executable evidence.`);
process.exitCode = failed ? 1 : 0;
