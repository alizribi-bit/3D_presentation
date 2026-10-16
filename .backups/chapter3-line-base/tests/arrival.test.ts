import test from 'node:test';
import assert from 'node:assert/strict';
import { arrivalWalk, minimumArrivalDuration } from '../src/characters/arrival.ts';

test('long camera journeys keep the visible human walk below two metres per second', () => {
  for (const routeLength of [1.5, 15, 50]) {
    let last = arrivalWalk(0, 2.25, routeLength).distance;
    for (let t = .01; t < 3; t += .01) {
      const sample = arrivalWalk(t, 2.25, routeLength);
      assert.ok((sample.distance - last) / .01 <= 1.8);
      assert.ok(sample.distance <= Math.min(2.6, routeLength));
      last = sample.distance;
    }
    assert.equal(arrivalWalk(3, 2.25, routeLength).distance, Math.min(2.6, routeLength));
  }
});

test('relocation between places occurs while the guide is fully out of frame', () => {
  assert.equal(arrivalWalk(2.25 * .14, 2.25, 40).opacity, 0);
  assert.equal(arrivalWalk(2.25 * .16, 2.25, 40).opacity, 0);
  assert.equal(arrivalWalk(2.25, 2.25, 40).walking, false);
});

test('faster chapter travel retains a long visible stride and finishes before panel entry', () => {
  const duration = 2.25;
  assert.ok(minimumArrivalDuration(40) <= duration);
  for (const phase of [.3, .5, .7, .85]) {
    const sample = arrivalWalk(duration * phase, duration, 40);
    assert.equal(sample.opacity, 1);
    assert.equal(sample.walking, true);
  }
  assert.equal(arrivalWalk(duration * .95, duration, 40).walking, false);
});
