// Named camera frames, placed from the world's anchors. Tuned on 1920×1080 renders.
import { place } from '../world/places.js';
import { anchors } from '../world/world.js';

export function buildShots() {
  const [mx, mz] = place('01').center, [cx, cz] = place('03').center, e = anchors.easel, n = anchors.easelNormal, r = anchors.easelRight;
  const at = (k, kr, dy) => [e.x + n.x * k + r.x * kr, e.y + dy, e.z + n.z * k + r.z * kr];
  return {
    overview: { pos: [4, 92, 90], target: [4, 0, 2], fov: 34 },
    market: { pos: [mx + 5.6, 5.4, mz + 15.6], target: [mx + 4.4, 1.5, mz + 2.4], fov: 38 },
    marketWide: { pos: [mx + .5, 14, mz + 22], target: [mx + .5, -1.2, mz + 5.5], fov: 40 },
    easel: { pos: at(7.4, 2.15, .2), target: at(0, 2.4, -.25), fov: 38 },
    cloud: { pos: [cx - .8, 13.6, cz + 16], target: [cx - .8, -.4, cz + 1.2], fov: 38 },
    architecture: { pos: [5, 23, 15], target: [5, 1, -9.5], fov: 40 },
    workshop: { pos: [-13, 12, 38], target: [-9, 1, 18], fov: 40 },
    delivery: { pos: [23, 11, 30], target: [27, 1, 12], fov: 40 },
    monitoring: { pos: [36, 12, 1], target: [40, 1, -17], fov: 40 },
    belvedere: { pos: [50, 12, 22], target: [55, 2, 2], fov: 40 },
    theater: { pos: [51, 8, 18], target: [54, 2, 0], fov: 42 },
    chapter02: { pos: [-17, 25, 48], target: [-12, 0, 19], fov: 42 },
    chapter03: { pos: [1, 27, 22], target: [5, 0, -9.5], fov: 42 },
    chapter04: { pos: [20, 25, 41], target: [24, 0, 12], fov: 42 },
    chapter05: { pos: [31, 25, 13], target: [37, 0, -17], fov: 42 },
    chapter06: { pos: [43, 23, 30], target: [52, 0, 2], fov: 42 },
    crossing: { pos: [cx - .5, 11.5, cz + 13.6], target: [cx - .5, -.4, cz + .9], fov: 38 },
  };
}
// Long moves rise over the world (metres added at mid-course).
export const LIFT = { 'overview>market': 0, 'market>overview': 0, 'overview>cloud': 0, 'market>cloud': 16 };
