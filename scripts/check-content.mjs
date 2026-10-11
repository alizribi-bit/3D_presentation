// Authoring checks: all source steps/speech, generated evidence integrity, exact asset copies and banned terms.
// Browser verification separately checks that the built presentation actually renders these same frames.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { FULL_STATES, speechNotes } from '../src/story/itinerary.ts';
import rows from '../content/source/sequences.json' with { type: 'json' };
import manifest from '../content/source/assets-manifest.json' with { type: 'json' };
const SOURCE=`${process.env.HOME}/Desktop/zawedni-video-pfe/soutenance`;
const sha=b=>createHash('sha256').update(b).digest('hex');
const norm=s=>s.replaceAll('’',"'").replace(/\s+/g,' ').trim().toLowerCase();
const original=norm(readFileSync(`${SOURCE}/build/script_rows.py`,'utf8').replace(/\\'/g,"'"));
const banned=[/\bDNS\b/i,/10\s*\/\s*11/,/faux n[ée]gatif/i,/erreur de commande/i];
let failed=0,frames=0;
const check=(pass,message)=>{if(!pass){failed++;console.error(`FAIL ${message}`);}};
check(rows.length===41&&FULL_STATES.length===106,'41 sequences and 106 states');
for(const row of rows){
  const states=FULL_STATES.filter(s=>s.source.seq===row.id);
  check(states.length===row.steps+1,`source coverage ${row.id}`);
  for(const chunk of row.speech)for(const [,text]of speechNotes(chunk))check(original.includes(norm(text)),`speech ${row.id}: ${text}`);
  const evidence=JSON.parse(readFileSync(`public/content/${row.id}.json`,'utf8'));
  check(evidence.id===row.id&&evidence.frames.length===row.steps+1,`evidence coverage ${row.id}`);
  for(const frame of evidence.frames){
    frames++;check(!/<(?:script|iframe|object|embed|video|audio|button)\b|\son[a-z]+=|(?:src|href)=["'](?:https?:|javascript:|\/\/)/i.test(frame),`safe evidence ${row.id}`);
    for(const re of banned)check(!re.test(frame.replace(/<[^>]+>/g,' ')),`banned term ${row.id}`);
  }
  for(const chunk of row.speech)for(const re of banned)check(!re.test(chunk),`banned speech ${row.id}`);
}
check(sha(readFileSync(`${SOURCE}/deck.html`))===manifest.sourceDeckSha256,'source deck fingerprint');
for(const asset of manifest.assets){
  const copied=readFileSync(`public/${asset.file}`),originalBytes=readFileSync(`${SOURCE}/${asset.source}`);
  check(sha(copied)===asset.sha256&&sha(originalBytes)===asset.sha256,`unchanged asset ${asset.file}`);
}
console.log(failed?`${failed} content issue(s)`:`PASS 41 sequences, ${frames} canonical evidence frames, 106 speech states, ${manifest.assets.length} unchanged local assets; no banned terms or executable evidence.`);
process.exitCode=failed?1:0;
