// Camera frames ("shots") and the interpolation between two of them. Pure: shotAt(from, to, k) has no state,
// so a frame reached by any path renders the same image. Travel moves rise over the world, then come down.
import * as THREE from 'three';

export const SHOTS = {
  overview: { pos: [6, 66, 74], target: [4, 0, 0], fov: 34 },
};

const P = new THREE.Vector3(), T = new THREE.Vector3();
export const ease = k => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);   // easeInOutCubic

export function applyShot(camera, s) {
  camera.position.set(...s.pos); camera.fov = s.fov; camera.updateProjectionMatrix(); camera.lookAt(...s.target);
}

// k in [0, 1]. `lift` (metres) raises the middle of a long move so it flies over the places instead of through them.
export function shotAt(camera, a, b, k, lift = 0) {
  const e = ease(k);
  P.fromArray(a.pos).lerp(T.fromArray(b.pos), e); P.y += Math.sin(Math.PI * e) * lift;
  const tg = new THREE.Vector3().fromArray(a.target).lerp(T.fromArray(b.target), e);
  camera.position.copy(P); camera.fov = a.fov + (b.fov - a.fov) * e; camera.updateProjectionMatrix(); camera.lookAt(tg);
}
