import test from 'node:test';
import assert from 'node:assert/strict';
import { transitionFrame, transitionTiming, contentStart, WORLD_RETURN_DURATION } from '../src/nav/timeline.ts';
import { classifyTransition, visiblePanels } from '../src/nav/transition-plan.ts';
import { FULL_STATES } from '../src/story/itinerary.ts';
import { arrivalWalk } from '../src/characters/arrival.ts';
import { ease, shotDistance } from '../src/camera/rig.js';
const find = (id: string) => FULL_STATES.find(s => s.id === id)!;

test('normal camera moves take exactly half their previous time without changing panel fades', () => {
  for (const distance of [0, 10, 45, 80, 200]) {
    for (const [kind, before] of [
      ['approach', Math.min(1, Math.max(.65, distance / 14))],
      ['object', Math.min(1, Math.max(.65, distance / 14))],
      ['world', 1.75], ['relocate', .75],
      ['travel', Math.min(5.2, Math.max(4.5, distance / 14))],
    ] as const) {
      const timing = transitionTiming(distance, 40, false, false, kind, true);
      assert.equal(timing.movement, before / 2);
      assert.equal(timing.exit, .16); assert.equal(timing.enter, .2);
    }
  }
});

test('fixed passages preserve active frames with no camera time or walking', () => {
  let count = 0, internal = 0;
  for (let i = 1; i < FULL_STATES.length; i++) {
    const from = FULL_STATES[i - 1]!, to = FULL_STATES[i]!;
    if (from.shot !== to.shot || from.actors.guide.at !== to.actors.guide.at) continue;
    count++; if (from.source.seq === to.source.seq) internal++;
    const plan = classifyTransition(from, to, 'next', 0, 0);
    assert.equal(plan.kind, 'content'); assert.equal(plan.walk, false);
    assert.deepEqual(plan.hiddenPanels, []);
    const timing = transitionTiming(0, 0, false, false, plan.kind, false);
    assert.equal(timing.total, 0);
    for (const t of [0, .06, .12, .2, 1]) {
      const frame = transitionFrame(timing, t);
      assert.equal(frame.opacity, 1);
      assert.deepEqual([...visiblePanels(from.panels, to.panels, plan, frame.phase, frame.opacity)], to.panels);
    }
  }
  assert.ok(count >= 65); assert.equal(internal, 50);
});

test('approaches keep evidence and cycle labels, without walking or an empty stage', () => {
  for (const [a, b] of [['ch1-0','startup-0'],['ch3-0','outils-infra-0']]) {
    const from = find(a!), to = find(b!);
    const plan = classifyTransition(from, to, 'next', 10, 0);
    assert.equal(plan.walk, false); assert.deepEqual(plan.hiddenPanels, []);
    const timing = transitionTiming(10, 0, false, false, plan.kind, false);
    assert.ok(timing.movement >= .325 && timing.movement <= .5);
    const frame = transitionFrame(timing, timing.movement / 2);
    assert.equal(frame.opacity, 1);
    for (const id of from.panels.filter(id => to.panels.includes(id)))
      assert.ok(visiblePanels(from.panels, to.panels, plan, frame.phase, frame.opacity).has(id));
  }
});

test('object staging removes only obstructing evidence, retaining shared world markers', () => {
  const from = { ...find('devsecops-0'), panels: ['evidence', 'cycle-title', 'stage2'] };
  const to = find('devsecops-1');
  const plan = classifyTransition(from, to, 'next', 8, 0);
  assert.deepEqual(plan.hiddenPanels, ['evidence']);
  const vis = visiblePanels(from.panels, to.panels, plan, 'move', 0);
  assert.equal(vis.has('evidence'), false); assert.ok(vis.has('cycle-title')); assert.ok(vis.has('stage2'));
});

test('world return has its explicit short budget, independent of distance and walking', () => {
  const plan = classifyTransition(find('retour-0'), find('retour-1'), 'next', 120, 0);
  assert.equal(plan.kind, 'world'); assert.equal(plan.walk, false);
  const timing = transitionTiming(120, 0, false, false, plan.kind);
  assert.equal(timing.movement, WORLD_RETURN_DURATION); assert.ok(timing.total < 1.3);
});

test('only forward travel imposes the natural arrival stride; reverse and jumps relocate quickly', () => {
  const from = find('methodologie-1'), to = find('ch3-0');
  for (const intent of ['prev','jump'] as const) {
    const plan = classifyTransition(to, from, intent, 45, 40);
    assert.equal(plan.kind, 'relocate'); assert.equal(plan.walk, false);
    assert.equal(transitionTiming(45, 40, false, false, plan.kind).movement, .375);
  }
  const plan = classifyTransition(from, to, 'next', 45, 40);
  assert.equal(plan.kind, 'travel'); assert.equal(plan.walk, true);
  const timing = transitionTiming(45, 40, false, false, plan.kind);
  assert.ok(timing.movement >= 2.25 && timing.movement <= 2.6);
  let previous = 0;
  for (let t = 0; t < timing.total; t += .005) {
    const frame = transitionFrame(timing, t), walk = arrivalWalk(frame.movementTime, timing.movement, 40);
    assert.ok((walk.distance - previous) / .005 <= 1.801);
    if (frame.phase === 'enter') assert.equal(walk.walking, false);
    previous = walk.distance;
  }
});

test('same nominal shot during interruption still requires real camera/actor reconciliation', () => {
  const a = find('routage-0'), b = find('routage-1');
  assert.equal(classifyTransition(a, b, 'next', 12, 0).kind, 'approach');
  assert.equal(classifyTransition(a, b, 'prev', 12, 15).kind, 'relocate');
});

test('interruptions preserve selected opacity and do not repeat an exit from a hidden panel', () => {
  for (const opacity of [0,.3,1]) {
    const timing = transitionTiming(45, 0, false, false, 'relocate', true, opacity);
    if (opacity === 0) assert.equal(timing.exit, 0);
    assert.equal(transitionFrame(timing, 0, opacity).opacity, opacity);
    const complete = transitionFrame(timing, 100, opacity);
    assert.equal(complete.opacity, 1); assert.equal(complete.complete, true);
  }
});

test('reduced and fast retain eventual content without real walking or an empty fixed frame', () => {
  const reduced = transitionTiming(90, 40, true, false, 'travel');
  assert.equal(reduced.movement, 0); assert.ok(reduced.total <= .2);
  assert.equal(transitionFrame(reduced, reduced.total).opacity, 1);
  const fast = transitionTiming(90, 40, false, true, 'travel');
  assert.equal(fast.movement, .03);
  for (const reduced of [true, false]) assert.equal(transitionTiming(0,0,reduced,true,'content',false).total,0);
});

test('camera distance includes lift; long journeys retain their constant central pace', () => {
  const a = { pos:[0,0,0], target:[0,0,-1], fov:38 }, b = { pos:[28,0,0], target:[28,0,-1], fov:38 };
  assert.equal(shotDistance(a,b),28); assert.ok(shotDistance(a,b,16)>28);
  assert.ok(Math.abs((ease(.4)-ease(.3))-(ease(.7)-ease(.6)))<1e-9);
});

 test('camera completion does not restart pointing or feedback when content stayed visible', () => {
  const approach = transitionTiming(10,0,false,false,'approach',false);
  assert.equal(contentStart(approach,false),0);
  assert.ok(approach.total-contentStart(approach,false) >= .325);
  const travel = transitionTiming(45,40,false,false,'travel',true);
  assert.equal(contentStart(travel,true),travel.arrival);
  assert.ok(Math.abs(travel.total-contentStart(travel,true)-travel.enter)<1e-9);
 });
