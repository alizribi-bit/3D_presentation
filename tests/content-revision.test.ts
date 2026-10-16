import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { FULL_STATES } from '../src/story/itinerary.ts';
import rows from '../content/source/sequences.json';
import reference from '../content/reference/manifest.json';

test('the final short classic alone determines the 35 slides and 86 states', () => {
  assert.equal(rows.length,35); assert.equal(FULL_STATES.length,86);
  assert.equal(rows.reduce((n,r)=>n+r.steps,0),51);
  assert.deepEqual(rows,reference.rows);
});
test('removed scenes cannot reappear in navigation or served content', () => {
  for (const id of ['reponse','acteurs','besoins','ch2','outils-dev','plateforme','sequence','parcours-app','controle-publication','alerte']) {
    assert.ok(!rows.some(r=>r.id===id));
    assert.ok(!existsSync(`public/content/${id}.json`));
  }
  assert.ok(FULL_STATES.every(s=>String(s.place)!=='02'));
  const ids=rows.map(r=>r.id);
  assert.deepEqual(ids.slice(ids.indexOf('modele'),ids.indexOf('ch3')+1),['modele','problematique','methodologie','ch3']);
});
test('BMC retains exactly full view then one simultaneous customer/value focus', () => {
  const row=rows.find(r=>r.id==='modele')!; assert.equal(row.steps,1);
  assert.ok(!row.speech.join(' ').toLowerCase().includes('revenus'));
  const frames=JSON.parse(readFileSync('public/content/modele.json','utf8')) as {frames:string[]};
  assert.equal(frames.frames.length,2);
});
test('every exported sequence has exactly one frame per validated speech state', () => {
  for (const row of rows) {
    const file=JSON.parse(readFileSync(`public/content/${row.id}.json`,'utf8')) as {id:string;frames:string[]};
    assert.equal(file.id,row.id); assert.equal(file.frames.length,row.steps+1);
    assert.equal(row.speech.length,row.steps+1);
  }
});
test('video remains slide 34, followed only by the accepted conclusion', () => {
  assert.equal(rows.findIndex(r=>r.id==='video'),33);
  assert.equal(rows[34]!.id,'retour');
  assert.equal(FULL_STATES.find(s=>s.id==='video-1')!.notes.script.length,0);
});
