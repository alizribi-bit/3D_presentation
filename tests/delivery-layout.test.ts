import test from 'node:test';
import assert from 'node:assert/strict';
import { FULL_STATES } from '../src/story/itinerary.ts';
import { isDeliveryReveal, deliveryLabels } from '../src/story/delivery-layout.ts';
import { DeliveryMotion } from '../src/world/delivery-motion.ts';
import { classifyTransition } from '../src/nav/transition-plan.ts';
import before from './fixtures/itinerary-before-chapter3.json';
const selected = ['chaine-1','chaine-2','chaine-3','log4j-1','log4j-2'];
const find = (id: string) => FULL_STATES.find(s=>s.id===id)!;

test('the accepted layout remains identical after the authorized speech refresh', () => {
  assert.deepEqual(FULL_STATES.map(s=>s.id),before.map(s=>s.id));
  const refreshedSpeech = ['couverture-1','outils-infra-0','tests-0','tests-1'];
  for(const state of FULL_STATES){
    const old=before.find(s=>s.id===state.id)!;
    if (!refreshedSpeech.includes(state.id)) assert.deepEqual(state.notes,old.notes,state.id);
    const {notes: currentNotes, ...layout} = state;
    const {notes: previousNotes, ...oldLayout} = old;
    if(!selected.includes(state.id))assert.deepEqual(layout,oldLayout,state.id);
  }
  assert.equal(FULL_STATES.length,86);
});
test('only the five useful convoyeur explanations share the top/bottom composition',()=>{
  assert.deepEqual(FULL_STATES.filter(s=>isDeliveryReveal(s.source)).map(s=>s.id),selected);
  for(const id of selected){const s=find(id);assert.equal(s.shot,'deliveryReveal');assert.equal(s.actors.guide.at,find(id.split('-')[0]+'-0').actors.guide.at);}
  assert.deepEqual(deliveryLabels(find('log4j-1').source),['log4j-gate-0','log4j-gate-1','log4j-gate-2']);
  for(const id of ['argocd-0','argocd-1','argocd-2','tracabilite-4','blocage-1'])assert.equal(isDeliveryReveal(find(id).source),false);
});
test('framing the same scene preserves the board forward, backward and on direct access',()=>{
  for(const intent of ['next','prev','jump'] as const){
    const plan=classifyTransition(find('chaine-0'),find('chaine-1'),intent,7,0);
    assert.equal(plan.kind,'approach');assert.equal(plan.walk,false);assert.deepEqual(plan.hiddenPanels,[]);
    assert.deepEqual(classifyTransition(find('chaine-3'),find('dix-pipelines-0'),intent,7,0).hiddenPanels,[]);
  }
  const travel=classifyTransition(find('secrets-2'),find('chaine-1'),'next',40,20);
  assert.equal(travel.kind,'travel');assert.equal(travel.walk,true);
});
test('the parcel advances continuously, reaches the failed control, then resumes',()=>{
  const m=new DeliveryMotion();
  assert.equal(m.sample('log4j-0',-5.8,0,false),-5.8);
  assert.equal(m.sample('log4j-1',0,1,true),-5.8);
  const halfway=m.sample('log4j-1',0,1.325,true);
  assert.ok(halfway>-5.8&&halfway<0);
  assert.equal(m.sample('log4j-1',0,1.65,true),0);
  assert.equal(m.sample('log4j-2',5.8,2,true),0);
  assert.equal(m.sample('log4j-2',5.8,2.65,true),5.8);
});
test('rapid reversal starts at the visible coordinate rather than the old logical endpoint',()=>{
  const m=new DeliveryMotion();m.sample('a',-5.8,0,false);m.sample('b',5.8,1,true);
  const visible=m.sample('b',5.8,1.2,true);
  assert.equal(m.sample('c',-5.8,1.2,true),visible);
  assert.ok(m.sample('c',-5.8,1.4,true)<visible);
  assert.equal(m.sample('c',-5.8,2,true),-5.8);
});
test('reduced motion and instant placement finish without waiting or additional states',()=>{
  const m=new DeliveryMotion();m.sample('a',-5.8,0,false);m.sample('b',5.8,1,true);
  assert.equal(m.sample('b',5.8,1.1,false),5.8);
  assert.equal(m.sample('c',0,1.2,false),0);
});

test('nonanimated staging keeps its own live camera-clock position',()=>{
 const m=new DeliveryMotion();m.sample('a',-5.8,0,false);
 assert.equal(m.sample('a',-2,0.1,false),-2);
 assert.equal(m.sample('a',5.8,0.2,false),5.8);
});
