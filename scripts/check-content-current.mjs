import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { FULL_STATES, speechNotes } from '../src/story/itinerary.ts';
const ref = JSON.parse(readFileSync('content/reference/manifest.json'));
const rows = JSON.parse(readFileSync('content/source/sequences.json'));
const sha = b => createHash('sha256').update(b).digest('hex');
let failed = 0;
const check = (pass, message) => { if (!pass) { failed++; console.error(`FAIL ${message}`); } };
check(JSON.stringify(rows) === JSON.stringify(ref.rows), 'active reference rows');
check(FULL_STATES.length === ref.counts.states, 'state count from current reference');
check(sha(readFileSync('content/reference/deck.html')) === ref.files['deck.html'], 'reference deck fingerprint');
check(sha(readFileSync('content/reference/script_rows.py')) === ref.files['build/script_rows.py'], 'reference rows adapter fingerprint');
check(sha(readFileSync('content/reference/content_20min.py')) === ref.files['build/content_20min.py'], 'reference speech model fingerprint');
if (ref.speechSource) {
  check(ref.speechSource.model === 'speech-content_20min.py', 'local updated speech snapshot');
  check(sha(readFileSync('content/reference/speech-content_20min.py')) === ref.speechSource.sha256, 'updated speech fingerprint');
}
for (const [i, state] of FULL_STATES.entries()) {
  const source = ref.states[i];
  check(state.id === source.id, `state order ${state.id}`);
  check(JSON.stringify(state.notes.script) === JSON.stringify(state.notes.silent ? [] : speechNotes(source.speech)), `exact notes ${state.id}`);
  const frame = JSON.parse(readFileSync(`public/content/${source.slideId}.json`)).frames[source.step];
  check(sha(frame) === source.frameSha256, `exact exported frame ${state.id}`);
  check(!/<(?:script|iframe|object|embed|video|audio|button)\b|\son[a-z]+=|(?:src|href)=["'](?:https?:|javascript:|\/\/)/i.test(frame), `inert local content ${state.id}`);
}
console.log(`${failed ? 'FAIL' : 'PASS'} active reference: ${rows.length} slides, ${ref.counts.reveals} reveals, ${FULL_STATES.length} states and exact notes/frames.`);
process.exitCode = failed ? 1 : 0;
