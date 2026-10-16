import * as THREE from 'three';

export interface CharacterPose {
  pos: THREE.Vector3;
  yaw: number;
  walkDist: number;
  walkW: number;
  pointW: number;
  aim: THREE.Vector3 | null;
  lookW: number;
  look: THREE.Vector3 | null;
  opacity?: number;
  still?: boolean;
}

// Natural human range of motion for neck and head relative to the torso
export const MAX_HEAD_YAW = 0.95; // ~54 degrees max comfortable yaw
export const MIN_HEAD_PITCH = -0.52; // ~30 degrees down
export const MAX_HEAD_PITCH = 0.45; // ~26 degrees up

/**
 * Clamps head and neck aim direction to natural anatomical limits relative to body facing.
 * Prevents unnatural 180° head turns when targets are behind the character.
 */
export function clampHeadDirection(bodyForward: THREE.Vector3, dirToTarget: THREE.Vector3): { clampedDir: THREE.Vector3; exceeded: boolean } {
  const normTarget = dirToTarget.clone().normalize();
  const fwd = bodyForward.clone().setY(0).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(up, fwd).normalize();

  // Decompose target direction into body local space (x: right, y: up, z: forward)
  const localX = right.dot(normTarget);
  const localY = normTarget.y;
  const localZ = fwd.dot(normTarget);

  let yaw = Math.atan2(localX, Math.max(1e-5, localZ));
  let pitch = Math.asin(Math.max(-1, Math.min(1, localY)));

  let exceeded = false;
  if (localZ < 0 || Math.abs(yaw) > MAX_HEAD_YAW) {
    yaw = Math.sign(yaw || 1) * Math.min(Math.abs(yaw), MAX_HEAD_YAW);
    exceeded = true;
  }

  pitch = Math.max(MIN_HEAD_PITCH, Math.min(MAX_HEAD_PITCH, pitch));

  // Reconstruct clamped direction in world space
  const clamped = fwd.clone()
    .multiplyScalar(Math.cos(pitch) * Math.cos(yaw))
    .addScaledVector(right, Math.cos(pitch) * Math.sin(yaw))
    .addScaledVector(up, Math.sin(pitch))
    .normalize();

  return { clampedDir: clamped, exceeded };
}

/**
 * Computes soft body re-orientation when target is outside comfortable head-turn angle.
 * "Cible derrière provoque corps doux, jamais tête tournante."
 */
export function computeSoftBodyYaw(characterPos: THREE.Vector3, currentYaw: number, targetPos: THREE.Vector3): number {
  const dirX = targetPos.x - characterPos.x;
  const dirZ = targetPos.z - characterPos.z;
  const targetYaw = Math.atan2(dirX, dirZ);

  // Angle difference between current body yaw and target
  let diff = ((targetYaw - currentYaw + Math.PI) % (2 * Math.PI)) - Math.PI;
  if (diff < -Math.PI) diff += 2 * Math.PI;

  // If target is within ±45°, body doesn't need to turn
  if (Math.abs(diff) <= 0.8) return currentYaw;

  // If target is further, turn body softly so target is well within head rotation limit
  const turn = Math.sign(diff) * (Math.abs(diff) - 0.5);
  return currentYaw + turn;
}

/**
 * Stage pixel focal points specific to each evidence sequence and step.
 * Guarantees distinct real targets instead of generic static [380, 500].
 */
export const EVIDENCE_TARGETS: Record<string, [number, number]> = {
  'probleme-0': [1280, 240],
  'probleme-1': [1350, 320],
  'probleme-2': [1380, 480],
  'reponse-0': [1260, 260],
  'reponse-1': [1320, 380],
  'reponse-2': [1360, 510],
  'grille-0': [1380, 310],
  'grille-1': [1420, 580],
  'chaine-0': [960, 740],
  'chaine-1': [1180, 740],
  'architecture-0': [980, 480],
  'routage-0': [820, 440],
  'routage-1': [1140, 520],
  'isolation-0': [1020, 460],
  'isolation-1': [1220, 560],
  'secrets-0': [1060, 500],
  'argocd-0': [860, 460],
  'argocd-1': [1120, 500],
  'supervision-0': [900, 380],
  'supervision-1': [1260, 420],
  'alerte-0': [920, 410],
  'alerte-1': [1300, 520],
  'alerte-2': [1400, 680],
  'bilan-0': [1050, 360],
  'bilan-1': [1200, 480],
  'perspectives-0': [1100, 420],
  'conclusion-0': [960, 400],
};

export function getEvidenceTargetPoint(seq: string, step: number): [number, number] {
  const key = `${seq}-${step}`;
  const target = EVIDENCE_TARGETS[key];
  if (target) return target;
  const fallback = EVIDENCE_TARGETS[`${seq}-0`];
  if (fallback) return fallback;

  // Real explicit content center fallback, never pseudo-random hash
  return [1100, 480];
}

/**
 * Calculates brief pointing profile: rises smoothly, holds briefly on target,
 * then returns to calm rest pose so text is never obscured during reading.
 */
export function calculatePointWeight(t: number, appear: number): number {
  const elapsed = t - appear;
  if (elapsed < 0.1) return 0;
  // Rise smoothly over 0.4s
  if (elapsed < 0.5) {
    const k = (elapsed - 0.1) / 0.4;
    return k * k * (3 - 2 * k);
  }
  // Hold briefly on focal target
  if (elapsed < 1.4) {
    return 1;
  }
  // Lower smoothly back to rest pose over 0.6s
  if (elapsed < 2.0) {
    const k = 1 - (elapsed - 1.4) / 0.6;
    return k * k * (3 - 2 * k);
  }
  // Calm rest pose
  return 0;
}
