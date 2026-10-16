import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  clampHeadDirection,
  computeSoftBodyYaw,
  getEvidenceTargetPoint,
  calculatePointWeight,
  MAX_HEAD_YAW,
  MIN_HEAD_PITCH,
  MAX_HEAD_PITCH,
} from '../src/characters/pose.ts';

test('head and neck direction clamps to natural anatomical limits, never flips backwards', () => {
  const fwd = new THREE.Vector3(0, 0, 1);

  // 1. Direct frontal target
  const front = new THREE.Vector3(0, 0, 5);
  const resFront = clampHeadDirection(fwd, front);
  assert.equal(resFront.exceeded, false);
  assert.ok(resFront.clampedDir.z > 0.99);

  // 2. Target directly behind character (180 degrees)
  const behind = new THREE.Vector3(0, 0, -5);
  const resBehind = clampHeadDirection(fwd, behind);
  assert.equal(resBehind.exceeded, true);
  // Must strictly stay in the forward hemisphere, never looking backward through the spine
  assert.ok(resBehind.clampedDir.z >= Math.cos(MAX_HEAD_YAW) - 0.01);

  // 3. Target far to the side (90 degrees right)
  const sideRight = new THREE.Vector3(5, 0, 0);
  const resRight = clampHeadDirection(fwd, sideRight);
  assert.equal(resRight.exceeded, true);
  const angle = Math.acos(fwd.dot(resRight.clampedDir));
  assert.ok(angle <= MAX_HEAD_YAW + 1e-4);

  // 4. Extreme pitch targets (straight up / straight down)
  const straightUp = new THREE.Vector3(0, 10, 0.1);
  const resUp = clampHeadDirection(fwd, straightUp);
  const pitchUp = Math.asin(resUp.clampedDir.y);
  assert.ok(pitchUp <= MAX_HEAD_PITCH + 1e-4);

  const straightDown = new THREE.Vector3(0, -10, 0.1);
  const resDown = clampHeadDirection(fwd, straightDown);
  const pitchDown = Math.asin(resDown.clampedDir.y);
  assert.ok(pitchDown >= MIN_HEAD_PITCH - 1e-4);
});

test('targets behind trigger soft body orientation instead of twisting neck', () => {
  const pos = new THREE.Vector3(0, 0, 0);
  const currentYaw = 0; // facing +Z

  // Target in front arc (30 degrees)
  const inFront = new THREE.Vector3(1, 0, 3);
  const yawFront = computeSoftBodyYaw(pos, currentYaw, inFront);
  assert.equal(yawFront, currentYaw, 'Body should not rotate for frontal targets');

  // Target behind to the right
  const behindRight = new THREE.Vector3(3, 0, -3);
  const yawBehind = computeSoftBodyYaw(pos, currentYaw, behindRight);
  assert.notEqual(yawBehind, currentYaw, 'Body must softly orient towards target behind');
  assert.ok(yawBehind > 0, 'Should rotate towards the right side');

  // Verify that after soft body rotation, the target is now within natural head yaw limit
  const targetDir = behindRight.clone().sub(pos).normalize();
  const newBodyFwd = new THREE.Vector3(Math.sin(yawBehind), 0, Math.cos(yawBehind));
  const remainingAngle = Math.acos(newBodyFwd.dot(targetDir));
  assert.ok(remainingAngle <= MAX_HEAD_YAW, 'Target must now fall within comfortable head angle');
});

test('evidence cards have distinct specific focal targets within screen bounds', () => {
  const tProbleme = getEvidenceTargetPoint('probleme', 0);
  const tReponse = getEvidenceTargetPoint('reponse', 1);
  const tArchi = getEvidenceTargetPoint('architecture', 0);
  const tAlerte = getEvidenceTargetPoint('alerte', 2);

  // Not generic static [380, 500]
  assert.notDeepEqual(tProbleme, [380, 500]);
  assert.notDeepEqual(tReponse, tProbleme);
  assert.notDeepEqual(tArchi, tReponse);
  assert.notDeepEqual(tAlerte, tArchi);

  // All within 1920x1080 stage boundaries
  for (const pt of [tProbleme, tReponse, tArchi, tAlerte]) {
    assert.ok(pt[0] >= 0 && pt[0] <= 1920);
    assert.ok(pt[1] >= 0 && pt[1] <= 1080);
  }

  // Explicit non-random fallback target
  assert.deepEqual(getEvidenceTargetPoint('unknown_seq_xyz', 99), [1100, 480]);
});

test('pointing is brief on appearance then returns to calm rest pose', () => {
  const appear = 1.0;

  // Before appearance: rest (0)
  assert.equal(calculatePointWeight(0.5, appear), 0);

  // During appearance transition: rising
  const rising = calculatePointWeight(1.3, appear);
  assert.ok(rising > 0 && rising < 1);

  // Holding on focal target
  const holding = calculatePointWeight(1.8, appear);
  assert.equal(holding, 1);

  // Lowering back to rest
  const lowering = calculatePointWeight(2.7, appear);
  assert.ok(lowering >= 0 && lowering < 1);

  // During extended reading: fully returned to rest (0) so text is never obscured
  assert.equal(calculatePointWeight(3.5, appear), 0);
  assert.equal(calculatePointWeight(10.0, appear), 0);
});

test('repeated application produces zero drift and zero accumulation', () => {
  const fwd = new THREE.Vector3(0, 0, 1);
  const target = new THREE.Vector3(2, 1, -3);

  const initial = clampHeadDirection(fwd, target);
  for (let frame = 0; frame < 500; frame++) {
    const next = clampHeadDirection(fwd, target);
    assert.ok(Math.abs(next.clampedDir.x - initial.clampedDir.x) < 1e-6);
    assert.ok(Math.abs(next.clampedDir.y - initial.clampedDir.y) < 1e-6);
    assert.ok(Math.abs(next.clampedDir.z - initial.clampedDir.z) < 1e-6);
  }
});
