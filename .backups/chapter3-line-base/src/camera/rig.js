// Camera frames ("shots") and the interpolation between two of them. Pure: shotAt(from, to, k) has no state,
// so a frame reached by any path renders the same image. Travel moves rise over the world, then come down.
import * as THREE from 'three';

export const SHOTS = {
  overview: { pos: [6, 66, 74], target: [4, 0, 0], fov: 34 },
};

const P = new THREE.Vector3(), T = new THREE.Vector3(), TARGET = new THREE.Vector3();
// Short acceleration shoulders preserve a nearly constant pace over most of the journey.
export const ease = k => {
  k = Math.max(0, Math.min(1, k));
  const shoulder = .18, speed = 1 / (1 - shoulder);
  return k < shoulder ? speed * k * k / (2 * shoulder)
    : k > 1 - shoulder ? 1 - speed * (1 - k) ** 2 / (2 * shoulder)
    : speed * (k - shoulder / 2);
};

// Compute once when navigation starts; include lift and framing, not just the endpoints.
export function shotDistance(a, b, lift = 0) {
  let length = 0;
  const previous = new THREE.Vector3().fromArray(a.pos), point = new THREE.Vector3();
  for (let i = 1; i <= 32; i++) {
    const k = i / 32;
    point.fromArray(a.pos).lerp(T.fromArray(b.pos), k); point.y += Math.sin(Math.PI * k) * lift;
    length += previous.distanceTo(point); previous.copy(point);
  }
  const framing = new THREE.Vector3().fromArray(a.target).distanceTo(new THREE.Vector3().fromArray(b.target));
  return Math.max(length, framing, Math.abs(a.fov - b.fov) * .25);
}

export function captureShot(camera) {
  return { pos: camera.position.toArray(), target: camera.userData.lookTarget.toArray(), fov: camera.fov };
}

export function applyShot(camera, s) {
  camera.position.set(...s.pos); camera.fov = s.fov; camera.updateProjectionMatrix(); camera.lookAt(...s.target);
}

// k in [0, 1]. `lift` (metres) raises the middle of a long move so it flies over the places instead of through them.
export function shotAt(camera, a, b, k, lift = 0, profile = 'travel') {
  const u = Math.max(0, Math.min(1, k));
  const e = profile === 'soft' ? u * u * (3 - 2 * u) : ease(u);
  P.fromArray(a.pos).lerp(T.fromArray(b.pos), e); P.y += Math.sin(Math.PI * e) * lift;
  TARGET.fromArray(a.target).lerp(T.fromArray(b.target), e);
  camera.position.copy(P); camera.fov = a.fov + (b.fov - a.fov) * e; camera.updateProjectionMatrix(); camera.lookAt(TARGET);
  (camera.userData.lookTarget ??= new THREE.Vector3()).copy(TARGET);
}
