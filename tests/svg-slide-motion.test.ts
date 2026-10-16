import test from 'node:test';
import assert from 'node:assert/strict';
import { matrixValues, parseTranslation, routeOffsets } from '../src/story/svg-slide-motion.ts';

test('route markers include the exact horizontal/vertical bend in both directions', () => {
  const corner = 1325 / 1505;
  const forward = routeOffsets(.548173, 1, corner);
  const backward = routeOffsets(1, .548173, corner);
  assert.equal(forward.length, 3); assert.equal(backward.length, 3);
  assert.ok(Math.abs(.548173 + (1 - .548173) * forward[1]! - corner) < 1e-10);
  assert.ok(Math.abs(1 + (.548173 - 1) * backward[1]! - corner) < 1e-10);
  assert.deepEqual(routeOffsets(0, .548173, corner), [0, 1]);
});

test('version badges accept only finite SVG translations, preserving their axis', () => {
  assert.deepEqual(parseTranslation('translate(250,0)'), [250, 0]);
  assert.deepEqual(parseTranslation('translate(721 0)'), [721, 0]);
  assert.deepEqual(parseTranslation('translate(-5.5)'), [-5.5, 0]);
  assert.equal(parseTranslation('scale(2)'), null);
  assert.equal(parseTranslation('translate(2e,0)'), null);
});

test('an interrupted native transform recovers the visible endpoint instead of its final attribute', () => {
  const matrix = matrixValues('matrix(0.5, 0, 0, 1, 75, 0)');
  assert.equal(matrix[0]! * 721 + matrix[4]!, 435.5);
  assert.deepEqual(matrixValues('none'), [1, 0, 0, 1, 0, 0]);
  assert.deepEqual(matrixValues('matrix(NaN,0,0,1,0,0)'), [1, 0, 0, 1, 0, 0]);
});
