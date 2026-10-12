// The ZAWEDNI world: a light plateau, a road (the roadmap) and six places. Built once; states only move the camera.
import * as THREE from 'three';
import { sceneProps } from './scene-props.ts';
import { decorateMonitorScreen } from './monitor.ts';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { instance, fit, image } from './assets.js';
import { ROAD, PLACES, ROLE, place } from './places.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: .92, metalness: 0, ...o });
const mesh = (geo, m, cast = true) => { const x = new THREE.Mesh(geo, m); x.castShadow = cast; x.receiveShadow = true; return x; };

// deterministic scatter
function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646; }

export const anchors = {};   // named world points used by states, panels and characters
export let roadCurve;

export function buildWorld(scene) {
  const world = new THREE.Group(); scene.add(world);
  ground(world);
  road(world);
  market(world);
  atelier(world);
  cloud(world);
  delivery(world);
  supervision(world);
  belvedere(world);
  scatter(world);
  bake(world);
  return world;
}

// Nothing in the décor moves: its ~1000 meshes are merged into one mesh per material (a few dozen draw calls),
// which keeps a modest integrated GPU fluid. Transparent and multi-material meshes stay as they are.
function bake(world) {
  world.updateMatrixWorld(true);
  const inverseRoot = world.matrixWorld.clone().invert();
  const groups = new Map(), done = [];
  world.traverse(m => {
    if (!m.isMesh || m.isSkinnedMesh || Array.isArray(m.material) || m.material.transparent || m.userData.keep) return;
    const g = m.geometry, sig = Object.keys(g.attributes).sort().join(',');
    const mt = m.material, look = `${mt.type}|${mt.color?.getHex()}|${mt.emissive?.getHex()}|${mt.emissiveIntensity}|${mt.map?.uuid}|${mt.side}|${mt.roughness}|${mt.toneMapped}`;
    const key = `${look}|${sig}|${m.castShadow}`;
    let geo = g.index ? g.toNonIndexed() : g.clone();
    geo.applyMatrix4(inverseRoot.clone().multiply(m.matrixWorld));
    for (const k of Object.keys(geo.morphAttributes)) delete geo.morphAttributes[k];
    if (!groups.has(key)) groups.set(key, { mat: m.material, cast: m.castShadow, geos: [] });
    groups.get(key).geos.push(geo); done.push(m);
  });
  for (const m of done) m.parent.remove(m);
  for (const { mat, cast, geos } of groups.values()) {
    const merged = mergeGeometries(geos, false); if (!merged) continue;
    const x = new THREE.Mesh(merged, mat); x.castShadow = cast; x.receiveShadow = true; x.matrixAutoUpdate = false; world.add(x);
  }
}

// ── ground: a soft plateau with a bevelled rim, like a model on a table ─────────────────────────
function ground(world) {
  const w = 150, h = 92, r = 14, s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2); s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  const g = new THREE.ExtrudeGeometry(s, { depth: 3, bevelEnabled: true, bevelThickness: .8, bevelSize: .8, bevelSegments: 4, curveSegments: 24 });
  g.rotateX(-Math.PI / 2); g.translate(4, -3.8, 0);
  const top = mesh(g, [mat('#d3e1c7'), mat('#b6c9a9')], false);
  world.add(top);
  // soft lawn patches that break the flat colour
  const R = rng(7);
  for (let i = 0; i < 26; i++) {
    const p = mesh(new THREE.CircleGeometry(4 + R() * 7, 40), mat(i % 3 ? '#c6d8b5' : '#d7e3c9'), false);
    p.rotation.x = -Math.PI / 2; p.position.set(-66 + R() * 140, .005 + i * .0004, -40 + R() * 80); world.add(p);
  }
}

// ── road: a raised ribbon with curbs and a dashed centre line ───────────────────────────────────
function ribbon(curve, width, y, n = 400) {
  const pos = [], idx = [], up = V(0, 1, 0);
  for (let i = 0; i <= n; i++) {
    const t = i / n, p = curve.getPointAt(t), tan = curve.getTangentAt(t), side = new THREE.Vector3().crossVectors(up, tan).normalize();
    const a = p.clone().addScaledVector(side, width / 2), b = p.clone().addScaledVector(side, -width / 2);
    pos.push(a.x, y, a.z, b.x, y, b.z);
    if (i < n) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}
function road(world) {
  roadCurve = new THREE.CatmullRomCurve3(ROAD.map(([x, z]) => V(x, 0, z)), false, 'centripetal');
  world.add(mesh(ribbon(roadCurve, 5.2, .06), mat('#bba98a'), false));    // curb
  world.add(mesh(ribbon(roadCurve, 4.4, .1), mat('#f3ecdc'), false));     // surface
  // dashes, in ZAWEDNI green: the roadmap line
  const L = roadCurve.getLength(), dash = new THREE.BoxGeometry(1.4, .03, .2), m = mat('#2f9d63');
  for (let d = 2; d < L - 1; d += 3.2) {
    const t = d / L, p = roadCurve.getPointAt(t), tan = roadCurve.getTangentAt(t), x = mesh(dash, m, false);
    x.position.set(p.x, .12, p.z); x.rotation.y = Math.atan2(-tan.z, tan.x); world.add(x);
  }
  // milestone at each place: a rounded post with the role colour
  for (const pl of PLACES) {
    const t = nearestT(V(pl.center[0], 0, pl.center[1])), p = roadCurve.getPointAt(t), tan = roadCurve.getTangentAt(t);
    const side = new THREE.Vector3().crossVectors(V(0, 1, 0), tan).normalize();
    const toPlace = V(pl.center[0] - p.x, 0, pl.center[1] - p.z);
    const s = Math.sign(side.dot(toPlace)) || 1, at = p.clone().addScaledVector(side, -s * 3.3);
    const post = mesh(new RoundedBoxGeometry(.7, 1.6, .7, 3, .18), mat('#fbfaf6'));
    post.position.set(at.x, .9, at.z); world.add(post);
    const band = mesh(new RoundedBoxGeometry(.74, .38, .74, 3, .12), mat(ROLE[pl.role]));
    band.position.set(at.x, 1.35, at.z); world.add(band);
    anchors[`stop${pl.id}`] = p.clone();
    anchors[`label${pl.id}`] = V(...pl.label);
    anchors[`stopT${pl.id}`] = t;
  }
}
export function nearestT(p) {
  let best = 0, bd = Infinity;
  for (let i = 0; i <= 600; i++) { const t = i / 600, d = roadCurve.getPointAt(t).distanceToSquared(p); if (d < bd) { bd = d; best = t; } }
  return best;
}

function plaza(world, pl, r, color, rim) {
  const [x, z] = pl.center;
  const base = mesh(new THREE.CylinderGeometry(r + .5, r + .7, .3, 72), mat(rim), false); base.position.set(x, .15, z); world.add(base);
  const top = mesh(new THREE.CylinderGeometry(r, r, .34, 72), mat(color), false); top.position.set(x, .17, z); world.add(top);
  // a short path from the plaza to the road
  const stop = anchors[`stop${pl.id}`], dir = V(x - stop.x, 0, z - stop.z), len = dir.length() - r + 1;
  if (len > 0) {
    const pth = mesh(new THREE.BoxGeometry(3.2, .3, len), mat(color), false);
    pth.position.set(stop.x + dir.x / dir.length() * (len / 2 + 1.2), .15, stop.z + dir.z / dir.length() * (len / 2 + 1.2));
    pth.rotation.y = Math.atan2(dir.x, dir.z); world.add(pth);
  }
}
const put = (world, k, pos, size, rotY = 0, by) => { const o = fit(instance(k), size, by); o.position.copy(pos); o.rotation.y = rotY; world.add(o); return o; };

// ── 01 · local purchase: a market square ────────────────────────────────────────────────────────
function market(world) {
  const pl = place('01'), [x, z] = pl.center; plaza(world, pl, 8.8, '#ecdcc0', '#d8c29d');
  const y = .34;
  // three stalls in an arc, opening towards the road and the viewer
  [[-5.4, -1.6, .6], [0, -4.4, 0], [5.4, -1.6, -.6]].forEach(([dx, dz, r], i) => {
    put(world, 'props/market-stand', V(x + dx, y, z + dz), 3.3, r);
    const R = rng(11 + i), goods = [['food/watermelon', 'food/pumpkin-basic', 'food/cabbage'], ['food/orange', 'food/lemon', 'food/apple', 'food/grapes'], ['food/tomato', 'food/eggplant', 'food/paprika', 'food/carrot']][i];
    for (let k = 0; k < 7; k++) {
      const g = goods[k % goods.length], o = put(world, g, V(0, 0, 0), .32 + R() * .12);
      const a = V(-1.05 + k * .35, 1.08, .38 + (k % 2) * .25).applyAxisAngle(V(0, 1, 0), r);
      o.position.set(x + dx + a.x, y + a.y, z + dz + a.z); o.rotation.y = R() * 6;
    }
  });
  // crates and baskets
  const crate = new RoundedBoxGeometry(.9, .6, .7, 2, .06), wood = mat('#b98754');
  [[-7.2, 1.8, .3], [-6.4, 2.7, -.2], [7.1, 1.6, .4], [-2.3, -6.6, 0], [2.4, -6.7, .2], [-7.3, 2.6, .1]].forEach(([dx, dz, r]) => {
    const c = mesh(crate, wood); c.position.set(x + dx, y + .3, z + dz); c.rotation.y = r; world.add(c);
  });
  put(world, 'food/bag', V(x - 6.5, y + .6, z + 2.7), .55, .4);
  put(world, 'food/honey', V(x + 7.1, y + .6, z + 1.6), .4);
  // produce on the ground in front of the stalls, and two parasols
  const R2 = rng(5), pile = ['food/watermelon', 'food/pumpkin-basic', 'food/cabbage', 'food/orange', 'food/tomato', 'food/onion'];
  for (let k = 0; k < 16; k++) { const a = -1.9 + k * .25, r = 6.4 + (k % 3) * .45; put(world, pile[k % pile.length], V(x + Math.sin(a) * r, y, z - Math.cos(a) * r * .7 - .3), .34 + R2() * .18, R2() * 6); }
  put(world, 'commercial/detail-parasol-a', V(x - 8.2, y, z - 2.6), 3.2);
  put(world, 'commercial/detail-parasol-b', V(x + 8.1, y, z - 2.8), 3.2);
  // olive-like trees and palms around the square
  [[-10.8, -5, 'nature/tree_oak', 5.5], [11, -4.5, 'nature/tree_oak', 5], [-11, 3.5, 'nature/tree_palmDetailedTall', 8], [10.8, 4.5, 'nature/tree_palm', 7]]
    .forEach(([dx, dz, k, s]) => put(world, k, V(x + dx, 0, z + dz), s));
  // the evaluation easel: a real 3D board carrying the deck's screenshot (piliers web)
  const easel = new THREE.Group(); easel.position.set(x + 1.2, y, z + 2.2); easel.rotation.y = .28; world.add(easel);
  const legs = mat('#8a5a32');
  [[-1.25, -.25], [1.25, -.25]].forEach(([lx, lz]) => { const l = mesh(new THREE.CylinderGeometry(.06, .07, 2.6, 10), legs); l.position.set(lx, 1.3, lz); l.rotation.x = .08; easel.add(l); });
  const back = mesh(new RoundedBoxGeometry(3.3, 1.75, .12, 3, .05), mat('#ffffff')); back.position.set(0, 1.95, 0); easel.add(back);
  const tex = new THREE.Texture(image('assets/deck/v6-sup-piliers.jpg')); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; tex.needsUpdate = true;
  const w = 3.1, h = w * 735 / 1600;   // the screenshot keeps its 1600×735 ratio
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  face.position.set(0, 1.95, .065); easel.add(face);
  const frame = mesh(new RoundedBoxGeometry(3.42, 1.87, .08, 3, .04), mat('#0d7b3c')); frame.position.set(0, 1.95, -.05); easel.add(frame);
  easel.updateMatrixWorld(true);
  anchors.easel = face.getWorldPosition(V());
  anchors.easelCap = V(0, 1.95 - h / 2 - .2, .1).applyMatrix4(easel.matrixWorld);
  anchors.easelNormal = V(0, 0, 1).applyQuaternion(easel.quaternion);
  anchors.easelRight = V(1, 0, 0).applyQuaternion(easel.quaternion);
  // where the characters stand
  // the representative stands beside the board (never in front of it), the guide a few steps to its left
  const en = anchors.easelNormal, er = anchors.easelRight, eb = easel.position;
  anchors.repSpot = V(eb.x + er.x * 2.45 + en.x * .5, y, eb.z + er.z * 2.45 + en.z * .5);
  anchors.guideSpot01 = V(eb.x - er.x * 2.6 + en.x * 2.2, y, eb.z - er.z * 2.6 + en.z * 2.2);
  const stop = anchors.stop01, dir = V(x - stop.x, 0, z - stop.z).normalize();
  anchors.guideA2 = V(x, y, z).addScaledVector(dir, -9.2);           // on the path from the road, at the plaza's edge
  anchors.guideOut01 = anchors.guideSpot01.clone().addScaledVector(V(stop.x - anchors.guideSpot01.x, 0, stop.z - anchors.guideSpot01.z).normalize(), 3.2);
  anchors.marketLook = V(x, 1.4, z);
  anchors.market = V(x, 0, z);
}

function decorMonitor(world, pos, size, rotY = 0) {
  const monitor = put(world, 'props/computer-screen', pos, size, rotY);
  decorateMonitorScreen(monitor, image('assets/deck/logo-green.png'));
  return monitor;
}

// ── 02 · platform workshop (silhouette) ─────────────────────────────────────────────────────────
function atelier(world) {
  const pl = place('02'), [x, z] = pl.center; plaza(world, pl, 7.5, '#e4ece2', '#c5d6c6');
  put(world, 'commercial/building-b', V(x - 1.5, .34, z - 4.8), 6, Math.PI);
  // two big devices: a web screen and a phone, the platform's two faces
  decorMonitor(world, V(x + 3.6, .34, z - 1.2), 2.4, -.45);
  const phone = mesh(new RoundedBoxGeometry(1, 1.9, .18, 4, .14), mat('#1d3a2b')); phone.position.set(x + 5.4, 1.3, z + 1); phone.rotation.y = -.7; world.add(phone);
  const glass = mesh(new RoundedBoxGeometry(.84, 1.66, .02, 3, .1), mat('#5be38f', { emissive: '#2f9d63', emissiveIntensity: .35 })); glass.position.set(0, 0, .1); phone.add(glass);
  phone.userData.keep = true;
  glass.userData.keep = true;
  sceneProps.set('atelier-phone', phone);
  anchors.atelier = V(x, 0, z);
}

// ── 03 · cloud zone: the DevSecOps loop, racks and screens ──────────────────────────────────────
export const LOOP = { a: 6.2, sy: 1.15 };
function localLoopPoint(t, ly = 0) {
  const s = Math.sin(t), c = Math.cos(t), d = 1 + s * s;
  return V(LOOP.a * c / d, ly, LOOP.sy * LOOP.a * s * c / d);
}
export function loopPoint(t, y = 0) {
  const [x, z] = place('03').center;
  const lp = localLoopPoint(t, y);
  return V(x + lp.x, y, z + lp.z);
}
export const STAGES = [[.8, 'Planifier'], [1, 'Coder'], [1.2, 'Construire et tester'], [1.8, 'Livrer et déployer'], [2, 'Exploiter'], [.2, 'Superviser']];
let feedbackMat;
function localLoopRibbon(t0, t1, width, y, n = 140) {
  const pos = [], idx = [];
  for (let i = 0; i <= n; i++) {
    const t = t0 + (t1 - t0) * i / n, p = localLoopPoint(t, y), q = localLoopPoint(t + .001, y), tan = q.sub(p).normalize(), side = V(-tan.z, 0, tan.x);
    pos.push(p.x + side.x * width / 2, y, p.z + side.z * width / 2, p.x - side.x * width / 2, y, p.z - side.z * width / 2);
    if (i < n) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}
function cloud(world) {
  const pl = place('03'), [x, z] = pl.center; plaza(world, pl, 10.5, '#dfe7f1', '#b3c4d8');
  const y = .36;

  // Inclined presentation group for DevSecOps loop with depth facing spectator
  const loopGroup = new THREE.Group();
  loopGroup.position.set(x, y + 3.1, z);
  loopGroup.rotation.x = .55;
  world.add(loopGroup);

  const plinthBase = mesh(new RoundedBoxGeometry(16, .24, 9.6, 3, .12), mat('#e4ecf4'), false);
  plinthBase.position.set(0, -.12, 0); loopGroup.add(plinthBase);

  // raised base under the loop, then the two lobes (development: green, operations: deep green)
  const ds = { side: THREE.DoubleSide };
  loopGroup.add(mesh(localLoopRibbon(Math.PI * .5, Math.PI * 2.5, 1.9, .04), mat('#c9d6e4', ds), false));
  loopGroup.add(mesh(localLoopRibbon(Math.PI * .5, Math.PI * 1.5, 1.15, .1), mat('#0d7b3c', ds), false));
  loopGroup.add(mesh(localLoopRibbon(Math.PI * 1.5, Math.PI * 2.5, 1.15, .1), mat('#083f1f', ds), false));
  feedbackMat = new THREE.MeshStandardMaterial({ color: '#5be38f', emissive: '#5be38f', emissiveIntensity: .55, transparent: true, opacity: 0, roughness: .6, side: THREE.DoubleSide });
  const fb = new THREE.Mesh(localLoopRibbon(Math.PI * .2, Math.PI * .8, .42, .16), feedbackMat); loopGroup.add(fb);

  // chevrons showing the direction of travel
  const chev = new THREE.Shape(); chev.moveTo(-.18, -.22); chev.lineTo(.12, 0); chev.lineTo(-.18, .22); chev.lineTo(-.06, 0); chev.closePath();
  const cg = new THREE.ShapeGeometry(chev); cg.rotateX(-Math.PI / 2);
  [.9, 1.1, 1.9, 2.1, .65, 1.35, 1.65, 2.35].forEach(k => {
    const t = k * Math.PI, p = localLoopPoint(t, .13), q = localLoopPoint(t + .01, .13), c = new THREE.Mesh(cg, mat('#ffffff'));
    c.position.copy(p); c.rotation.y = Math.atan2(-(q.z - p.z), q.x - p.x); loopGroup.add(c);
  });

  // six stage bollards on the band
  STAGES.forEach(([k, name], i) => {
    const p = localLoopPoint(k * Math.PI, .1), dev = k > .5 && k < 1.5;
    const b = mesh(new THREE.CylinderGeometry(.42, .5, .5, 28), mat('#ffffff')); b.position.set(p.x, .35, p.z); loopGroup.add(b);
    const ring = mesh(new THREE.TorusGeometry(.4, .08, 10, 32), mat(dev ? '#0d7b3c' : '#083f1f')); ring.rotation.x = Math.PI / 2; ring.position.set(p.x, .61, p.z); loopGroup.add(ring);
    loopGroup.updateMatrixWorld(true);
    const worldP = b.getWorldPosition(new THREE.Vector3());
    anchors[`stage${i}`] = worldP.clone();
    const off = [[0, 1.4, -1.0], [-2.0, .7, 0], [0, .2, 1.6], [0, 1.4, -1.0], [2.0, 1.7, -.1], [0, .2, 1.6]][i];
    anchors[`stageTag${i}`] = b.position.clone().add(V(...off)).applyMatrix4(loopGroup.matrixWorld);
  });

  // security at the crossing: a shield on a plinth
  const cx = localLoopPoint(Math.PI / 2, .1);
  const plinth = mesh(new THREE.CylinderGeometry(.9, 1, .5, 36), mat('#ffffff')); plinth.position.set(cx.x, .35, cx.z); loopGroup.add(plinth);
  const sh = new THREE.Shape(); sh.moveTo(0, .9); sh.quadraticCurveTo(.55, .78, .72, .7); sh.lineTo(.68, .1); sh.quadraticCurveTo(.55, -.55, 0, -.9); sh.quadraticCurveTo(-.55, -.55, -.68, .1); sh.lineTo(-.72, .7); sh.quadraticCurveTo(-.55, .78, 0, .9);
  const shield = mesh(new THREE.ExtrudeGeometry(sh, { depth: .22, bevelEnabled: true, bevelSize: .06, bevelThickness: .06, bevelSegments: 3 }), mat('#0d7b3c'));
  shield.position.set(cx.x, 1.8, cx.z - .1); loopGroup.add(shield);
  const ring = mesh(new THREE.TorusGeometry(1.05, .07, 10, 48), mat('#5be38f', { emissive: '#5be38f', emissiveIntensity: .25 })); ring.position.set(cx.x, 1.8, cx.z); loopGroup.add(ring);
  loopGroup.updateMatrixWorld(true);
  anchors.crossing = shield.getWorldPosition(new THREE.Vector3());
  anchors.secuLabel = anchors.crossing.clone().add(V(0, 1.8, -0.8));

  // server racks behind the loop: rounded cabinets with LED strips
  const rack = new RoundedBoxGeometry(1.5, 3.1, 1.2, 3, .12), rm = mat('#3b4b5e', { roughness: .7 }), led = new THREE.BoxGeometry(1.1, .05, .02);
  const ledM = [mat('#5be38f', { emissive: '#5be38f', emissiveIntensity: .9 }), mat('#7fb2ee', { emissive: '#7fb2ee', emissiveIntensity: .9 })];
  for (let i = 0; i < 5; i++) {
    const r = mesh(rack, rm); r.position.set(x - 4.2 + i * 1.75, y + 1.55, z - 7.6); world.add(r);
    for (let k = 0; k < 7; k++) { const l = new THREE.Mesh(led, ledM[(i + k) % 2]); l.position.set(0, -1.1 + k * .36, .61); r.add(l); }
  }

  // a soft cloud above the racks: the zone's sign
  const cm = mat('#ffffff', { roughness: 1 }), cloudG = new THREE.Group(); cloudG.position.set(x, y + 6.2, z - 7.8); world.add(cloudG);
  [[0, 0, 0, 1.5], [-1.5, -.3, .1, 1.1], [1.6, -.25, 0, 1.15], [.7, .55, -.1, 1.05], [-.8, .45, .1, 1], [2.6, -.55, 0, .75], [-2.6, -.55, 0, .7]]
    .forEach(([cx, cy, cz, r]) => { const b = mesh(new THREE.IcosahedronGeometry(r, 3), cm); b.position.set(cx, cy, cz); b.scale.y = .82; cloudG.add(b); });

  // screens on the sides with ZAWEDNI logo
  decorMonitor(world, V(x - 9, y, z - 2.5), 2.2, .45);
  decorMonitor(world, V(x + 9, y, z - 2.5), 2.2, -.45);

  // Bake this reading prop separately so the architecture board can replace it without overlap.
  bake(loopGroup);
  loopGroup.traverse(object => { object.userData.keep = true; });
  loopGroup.name = 'devsecops-cycle';
  sceneProps.set('devsecops-cycle', loopGroup);

  // guide placement
  loopGroup.updateMatrixWorld(true);
  const lv = localLoopPoint(Math.PI, 0).applyMatrix4(loopGroup.matrixWorld);
  anchors.guideSpot03 = V(lv.x - 2.6, y, lv.z + 3.4);
  const stop3 = anchors.stop03, dir3 = V(anchors.guideSpot03.x - stop3.x, 0, anchors.guideSpot03.z - stop3.z).normalize();
  anchors.guideIn03 = anchors.guideSpot03.clone().addScaledVector(dir3, -3.6);
  anchors.lobeDev = localLoopPoint(Math.PI, .3).applyMatrix4(loopGroup.matrixWorld);
  anchors.lobeOps = localLoopPoint(0, .3).applyMatrix4(loopGroup.matrixWorld);
  anchors.cloud = V(x, 0, z);
}
export function setFeedback(w) { if (feedbackMat) feedbackMat.opacity = w; }

// ── 04 · delivery line (silhouette): a conveyor through check arches ────────────────────────────
function delivery(world) {
  const pl = place('04'), [x, z] = pl.center; plaza(world, pl, 8.5, '#e1e9f2', '#bccbdd');
  const y = .34, belt = mesh(new RoundedBoxGeometry(13, .5, 1.6, 3, .2), mat('#4a5a6c')); belt.position.set(x, y + .9, z); world.add(belt);
  for (let i = -3; i <= 3; i++) { const leg = mesh(new THREE.BoxGeometry(.2, .9, 1.3), mat('#9fb0c2')); leg.position.set(x + i * 2, y + .45, z); world.add(leg); }
  ['#0d7b3c', '#2f6db3', '#e8742c'].forEach((c, i) => {
    const g = new THREE.Group(); g.position.set(x - 4 + i * 4, y, z); world.add(g);
    [-1.2, 1.2].forEach(dz => { const p = mesh(new RoundedBoxGeometry(.32, 3, .32, 2, .1), mat('#ffffff')); p.position.set(0, 1.5, dz); g.add(p); });
    const top = mesh(new RoundedBoxGeometry(.4, .4, 2.8, 2, .12), mat(c)); top.position.set(0, 3.1, 0); g.add(top);
  });

}

// ── 05 · supervision centre (silhouette): a building with a screen wall and an antenna ───────────
function supervision(world) {
  const pl = place('05'), [x, z] = pl.center; plaza(world, pl, 8.5, '#e1e9f2', '#bccbdd');
  put(world, 'commercial/building-e', V(x + 2.5, .34, z - 9), 8, 0);
  const mast = mesh(new THREE.CylinderGeometry(.12, .16, 6, 12), mat('#ffffff')); mast.position.set(x + 5.5, 3.3, z - .5); world.add(mast);
  const dish = mesh(new THREE.SphereGeometry(1, 28, 14, 0, Math.PI * 2, 0, Math.PI / 3.2), mat('#ffffff', { side: THREE.DoubleSide })); dish.position.set(x + 5.5, 6, z - .5); dish.rotation.x = -1.1; world.add(dish);
}

// ── 06 · belvedere: a low hill with a flag, looking back over the road ─────────────────────────
function belvedere(world) {
  const pl = place('06'), [x, z] = pl.center; plaza(world, pl, 7.5, '#e4ece2', '#c5d6c6');
  const hill = mesh(new THREE.CylinderGeometry(3.4, 4.6, 1.2, 40), mat('#d2dfc8')); hill.position.set(x, .9, z - 1); world.add(hill);
  const pole = mesh(new THREE.CylinderGeometry(.08, .1, 5.6, 10), mat('#ffffff')); pole.position.set(x, 4.2, z - 1); world.add(pole);
  const flag = mesh(new THREE.PlaneGeometry(2.2, 1.3, 8, 4), mat('#0d7b3c', { side: THREE.DoubleSide })); flag.position.set(x + 1.15, 6.3, z - 1);
  const p = flag.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin((p.getX(i) + 1.1) * 2.2) * .12); flag.geometry.computeVertexNormals(); world.add(flag);
  put(world, 'nature/tree_oak', V(x - 4.5, .34, z + 2), 5);
  put(world, 'nature/tree_palmShort', V(x + 4.6, .34, z + 2.6), 4.5);
}

// ── scatter: houses, trees and bushes, never on the road or a plaza ─────────────────────────────
function scatter(world) {
  const free = (x, z, m = 0) => {
    if (Math.abs(x - 4) > 70 || Math.abs(z) > 42) return false;
    for (const pl of PLACES) if (Math.hypot(x - pl.center[0], z - pl.center[1]) < 13 + m) return false;
    return roadCurve.getPointAt(nearestT(V(x, 0, z))).distanceTo(V(x, 0, z)) > 6 + m;
  };
  const R = rng(42), houses = ['suburban/building-type-a', 'suburban/building-type-c', 'suburban/building-type-e', 'suburban/building-type-g',
    'suburban/building-type-i', 'suburban/building-type-k', 'suburban/building-type-m', 'suburban/building-type-o', 'suburban/building-type-q', 'suburban/building-type-s'];
  let n = 0;
  for (let i = 0; i < 600 && n < 13; i++) {
    const x = -64 + R() * 134, z = R() < .8 ? -39 + R() * 14 : (R() < .5 ? -1 : 1) * 0 + 30 + R() * 9;
    if (!free(x, z, 3)) continue;
    const p = roadCurve.getPointAt(nearestT(V(x, 0, z)));
    put(world, houses[n % houses.length], V(x, 0, z), 4.4 + R() * 1.2, Math.atan2(p.x - x, p.z - z)); n++;
  }
  const trees = ['nature/tree_default', 'nature/tree_oak', 'nature/tree_detailed', 'nature/tree_fat', 'nature/tree_cone', 'nature/tree_small', 'nature/tree_palm', 'nature/tree_palmShort'];
  for (let i = 0, k = 0; i < 900 && k < 60; i++) {
    const x = -66 + R() * 138, z = -42 + R() * 84;
    if (!free(x, z)) continue;
    put(world, trees[k % trees.length], V(x, 0, z), 3.2 + R() * 3.4, R() * 6); k++;
  }
  const bushes = ['nature/plant_bush', 'nature/plant_bushLarge', 'nature/plant_bushDetailed', 'nature/plant_bushSmall', 'nature/flower_yellowA', 'nature/flower_redA', 'nature/grass_large'];
  for (let i = 0, k = 0; i < 900 && k < 90; i++) {
    const x = -66 + R() * 138, z = -42 + R() * 84;
    if (!free(x, z, -3)) continue;
    put(world, bushes[k % bushes.length], V(x, 0, z), .6 + R() * .9, R() * 6); k++;
  }
}
