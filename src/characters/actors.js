// The two characters (Quaternius "Ultimate Modular Men", CC0): a guide and a business representative.
// Everything is driven by explicit values, never by accumulated time: the walk cycle's phase comes from the
// distance covered (no sliding feet), the pointing arm is aimed at the real position of its target each frame.
import * as THREE from 'three';
import { instance, gltf } from '../world/assets.js';

const V = () => new THREE.Vector3(), Q = () => new THREE.Quaternion();
const CLIP = n => `CharacterArmature|${n}`;

// outfits: the guide wears ZAWEDNI green, the representative a dark suit with a green tie
const OUTFITS = {
  guide: { White: '#f4f1ea', Red_Dark: '#3a3a3a', LightBrown: '#1f8a4c', LightBlue: '#2c3e50' },
  rep: { Suit: '#34465a', Tie: '#0d7b3c', White: '#f6f4ee' },
};

export class Actor {
  constructor(key, height = 1.78) {
    this.key = key;
    const g = gltf(`chars/${key}`);
    this.model = instance(`chars/${key}`);
    this.root = new THREE.Group(); this.root.add(this.model);
    // own materials, so outfit colours and fading stay per character
    this.mats = [];
    this.model.traverse(m => {
      if (!m.isMesh) return;
      m.material = m.material.clone(); m.material.roughness = .8; m.material.metalness = 0;
      const c = OUTFITS[key][m.material.name]; if (c) m.material.color.set(c);
      m.frustumCulled = false; m.castShadow = false; this.mats.push(m.material);
    });
    // a soft contact shadow under the feet (the décor's shadow map is static, see main.js)
    this.root.add(Actor.blob());
    this.mixer = new THREE.AnimationMixer(this.model);
    const act = n => { const a = this.mixer.clipAction(THREE.AnimationClip.findByName(g.animations, CLIP(n))); a.play(); a.setEffectiveWeight(0); return a; };
    this.idle = act('Idle'); this.walk = act('Walk');
    this.bones = {}; this.model.traverse(b => { if (b.isBone) this.bones[b.name.replace(/[^A-Za-z0-9]/g, '')] = b; });
    // height from the skeleton in the idle pose (a skinned mesh's bounding box is not reliable here): feet on y = 0
    this.idle.setEffectiveWeight(1); this.mixer.update(0); this.model.updateMatrixWorld(true);
    const head = this.bones.Head.getWorldPosition(V()), foot = this.bones.FootL.getWorldPosition(V());
    const s = height / ((head.y - foot.y) * 1.13);
    this.model.scale.multiplyScalar(s); this.model.updateMatrixWorld(true);
    this.model.position.y -= this.bones.FootL.getWorldPosition(V()).y - .07 * height;
    this.cycle = this.measureStride();   // metres per walk cycle at this scale
  }

  // Foot travel over one walk cycle, measured on the clip itself.
  measureStride() {
    const foot = this.bones.FootL, d = this.walk.getClip().duration;
    this.walk.setEffectiveWeight(1); this.idle.setEffectiveWeight(0);
    let lo = Infinity, hi = -Infinity; const p = V(), inv = new THREE.Matrix4();
    for (let i = 0; i <= 40; i++) {
      this.walk.time = d * i / 40; this.mixer.update(0); this.model.updateMatrixWorld(true);
      inv.copy(this.model.matrixWorld).invert(); foot.getWorldPosition(p).applyMatrix4(inv);
      lo = Math.min(lo, p.z); hi = Math.max(hi, p.z);
    }
    return 2 * (hi - lo) * this.model.scale.z;
  }

  // pose: { pos, yaw, walkDist, walkW, pointW, aim (Vector3|null), lookW, look (Vector3|null), opacity, still }
  apply(pose, clock) {
    this.root.position.copy(pose.pos); this.root.rotation.y = pose.yaw;
    const wd = this.walk.getClip().duration, id = this.idle.getClip().duration;
    this.walk.time = ((pose.walkDist / this.cycle) % 1) * wd;
    this.idle.time = pose.still ? 0 : clock % id;
    this.walk.setEffectiveWeight(pose.walkW); this.idle.setEffectiveWeight(1 - pose.walkW);
    this.mixer.update(0);
    this.model.updateMatrixWorld(true);
    if (pose.look && pose.lookW > 0) this.lookAt(pose.look, pose.lookW);
    if (pose.aim && pose.pointW > 0) this.point(pose.aim, pose.pointW);
    const o = pose.opacity ?? 1;
    for (const m of this.mats) { m.transparent = o < 1; m.opacity = o; m.depthWrite = o > .5; }
    this.root.children.find(c => c.userData.blob).material.opacity = o;
    this.root.visible = o > .01;
  }

  static blob() {
    if (!Actor._blobTex) {
      const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
      const r = g.createRadialGradient(64, 64, 4, 64, 64, 62); r.addColorStop(0, 'rgba(20,40,28,.55)'); r.addColorStop(.55, 'rgba(20,40,28,.22)'); r.addColorStop(1, 'rgba(20,40,28,0)');
      g.fillStyle = r; g.fillRect(0, 0, 128, 128); Actor._blobTex = new THREE.CanvasTexture(c);
    }
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.25), new THREE.MeshBasicMaterial({ map: Actor._blobTex, transparent: true, depthWrite: false, toneMapped: false }));
    m.rotation.x = -Math.PI / 2; m.position.y = .015; m.renderOrder = 1; m.userData.blob = true;
    return m;
  }

  // rotate bone b (world space) by q, keeping the result in its parent's space
  static rotateWorld(b, q, w = 1) {
    const pw = Q(); b.parent.getWorldQuaternion(pw);
    const bw = Q(); b.getWorldQuaternion(bw);
    const target = pw.clone().invert().multiply(q).multiply(bw);
    b.quaternion.slerp(target, w); b.updateMatrixWorld(true);
  }

  // Which arm: the one on the side of the target.
  side(target) {
    const local = this.root.worldToLocal(target.clone());
    return local.x < 0 ? 'R' : 'L';   // model faces +z: its right hand is on -x
  }

  point(target, w) {
    const s = this.side(target), up = this.bones[`UpperArm${s}`], lo = this.bones[`LowerArm${s}`], wr = this.bones[`Wrist${s}`];
    const a = V(), b = V(), c = V();
    // 1 · straighten the elbow (a little bend stays)
    up.getWorldPosition(a); lo.getWorldPosition(b); wr.getWorldPosition(c);
    const u = b.clone().sub(a).normalize(), f = c.clone().sub(b).normalize();
    Actor.rotateWorld(lo, Q().setFromUnitVectors(f, u), w * .85);
    // 2 · aim the whole arm at the target, raised no higher than needed
    up.getWorldPosition(a); wr.getWorldPosition(c);
    const cur = c.clone().sub(a).normalize(), want = target.clone().sub(a).normalize();
    Actor.rotateWorld(up, Q().setFromUnitVectors(cur, want), w);
    // 3 · open hand in line with the forearm, index straight
    lo.getWorldPosition(b); wr.getWorldPosition(c);
    const fa = c.clone().sub(b).normalize();
    for (const n of ['Index1', 'Index2', 'Index3']) {
      const bone = this.bones[`${n}${s}`], child = bone?.children[0]; if (!bone || !child) continue;
      bone.getWorldPosition(a); child.getWorldPosition(c);
      Actor.rotateWorld(bone, Q().setFromUnitVectors(c.clone().sub(a).normalize(), fa), w);
    }
  }

  lookAt(target, w) {
    for (const [n, k] of [['Neck', .4], ['Head', .6]]) {
      const b = this.bones[n]; if (!b) continue;
      const p = V(); b.getWorldPosition(p);
      const fwd = V().set(0, 0, 1).applyQuaternion(this.root.quaternion);   // the body's facing
      const want = target.clone().sub(p).normalize();
      want.y *= .6;
      const q = Q().setFromUnitVectors(fwd, want.normalize());
      Actor.rotateWorld(b, Q().identity().slerp(q, Math.min(1, k * 1.2)), w);
    }
  }
}
