import test from 'node:test';
import assert from 'node:assert/strict';
import { arrivalWalk } from '../src/characters/arrival.ts';

test('long camera journeys keep the visible human walk below two metres per second', () => {
  for (const routeLength of [1.5, 15, 50]) {
    let last = arrivalWalk(0, 5.2, routeLength).distance;
    for (let t = .01; t < 6; t += .01) {
      const sample = arrivalWalk(t, 5.2, routeLength);
      assert.ok((sample.distance - last) / .01 < 2);
      assert.ok(sample.distance <= Math.min(2.6, routeLength));
      last = sample.distance;
    }
    assert.equal(arrivalWalk(6, 5.2, routeLength).distance, Math.min(2.6, routeLength));
  }
});

test('relocation between places occurs while the guide is fully out of frame', () => {
  assert.equal(arrivalWalk(5.2 * .5, 5.2, 40).opacity, 0);
  assert.equal(arrivalWalk(5.2 * .54, 5.2, 40).opacity, 0);
  assert.equal(arrivalWalk(5.2, 5.2, 40).walking, false);
});
