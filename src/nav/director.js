// The only owner of "where are we": one index into STATES. A key press = go(i ± 1). A press during a transition
// first lands the transition on its arrival state (settle), then starts the next one: never two transitions at once.
// Every frame is a pure function of (from, to, t): the same state always ends on the same image.
import * as THREE from 'three';
import { STATES } from '../content/states.js';
import { updatePanels, setCover, panelStagePoint } from '../content/panels.js';
import { shotAt } from '../camera/rig.js';
import { buildShots, LIFT } from '../camera/shots.js';
import { anchors, roadCurve, setFeedback } from '../world/world.js';
import { motion } from './prefs.js';
import { routePath } from '../characters/path.ts';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const V = (...a) => new THREE.Vector3(...a);

export class Director {
  constructor({ camera, actors, onState, onFrame, still = false, fast = false }) {
    Object.assign(this, { camera, actors, onState, onFrame, still, fast });
    this.shots = buildShots();
    this.i = 0; this.tr = null; this.instantFrames = 0;
  }

  get state() { return STATES[this.i]; }
  get settled() { return !this.tr; }
  get moving() { return !!this.tr && performance.now() / 1000 - this.tr.t0 < this.tr.D; }

  go(i, { instant = false } = {}) {
    if (!Number.isInteger(i) || !Number.isFinite(i)) return;
    i = clamp(i, 0, STATES.length - 1);
    if (this.tr) this.settle();
    if (i === this.i && !instant) return;
    const from = this.i; this.i = i;
    const to = STATES[i], back = i < from, jump = Math.abs(i - from) > 1;
    if (instant) { this.tr = null; this.instantFrames = 2; }
    else {
      const D = this.fast ? .03 : motion.reduced ? .35 : back || jump ? .8 : to.duration || .9;
      this.tr = { from: STATES[from], to, t0: performance.now() / 1000, D, back: back || jump, paths: {}, walks: {} };
      for (const [name, spec] of Object.entries(to.actors)) {
        if (spec.route && !back && !jump) {
          this.tr.paths[name] = routePath(roadCurve, anchors[STATES[from].actors[name].at], anchors[spec.at], anchors[`stopT${spec.route.from}`], anchors[`stopT${spec.route.to}`]);
        }
        if (spec.walk) {
          const segs = [[]]; for (const n of spec.walk) n === '|' ? segs.push([]) : segs.at(-1).push(anchors[n].clone());
          const lens = segs.map(seg => seg.slice(1).reduce((length, p, j) => length + p.distanceTo(seg[j]), 0));
          this.tr.walks[name] = { segs, lens, total: lens.reduce((x, y) => x + y, 0) };
        }
      }
    }
    try { history.replaceState(null, '', `#${to.id}`); } catch { /* file:// in some browsers */ }
    this.onState?.(this);
  }
  next() { this.go(this.i + 1); }
  prev() { this.go(this.i - 1); }
  settle() { this.tr = null; this.instantFrames = 2; }

  // ── per frame ─────────────────────────────────────────────────────────────────────────────────
  frame(now) {
    const tr = this.tr, to = this.state;
    let t = Infinity, D = 1, from = to;
    if (tr) { t = now - tr.t0; D = tr.D; from = tr.from; if (t >= D + (this.fast ? .05 : 2.6)) this.tr = null; }
    const k = clamp(t / D);
    document.body.classList.toggle('instant', this.instantFrames > 0 || this.fast); if (this.instantFrames > 0) this.instantFrames--;

    // camera
    const a = this.shots[from.shot], b = this.shots[to.shot];
    const lift = tr && !tr.back ? (LIFT[`${from.shot}>${to.shot}`] ?? 0) : 0;
    shotAt(this.camera, a, b, motion.reduced && tr ? 1 : k, lift);
    this.camera.updateMatrixWorld(true);

    // panels: what leaves goes at once, what arrives shows after the camera lands (travel) or right away (reveal)
    const appear = !tr ? 0 : motion.reduced ? 0 : tr.back ? D * .6 : to.move === 'travel' ? D * .96 : from.shot !== to.shot ? D * .82 : .25;
    const vis = new Set();
    to.panels.forEach((p, n) => {
      const lab = /^l0\d$/.test(p) && !from.panels.includes(p) ? n * .22 : 0;
      if (from.panels.includes(p) || t >= appear + lab) vis.add(p);
    });
    setCover(to.cover || 'gone');
    updatePanels(vis, this.camera, to);
    this.onFrame?.(vis, to, k, from);
    setFeedback(to.feedback ? smooth((t - appear - .2) / .8) : from.feedback && tr ? 1 - smooth(t / .4) : 0);

    // characters
    for (const [name, actor] of Object.entries(this.actors)) actor.apply(this.pose(name, from, to, tr, t, D, appear), now);
  }

  point(ref) {
    if (ref === 'camera') return this.camera.position.clone();
    if (anchors[ref]) return anchors[ref].clone();
    return null;
  }
  // A DOM panel seen as a point in the world, at the depth of the character who points at it.
  panelWorld(ref, from) {
    const [sx, sy] = panelStagePoint(ref);
    const ndc = V(sx / 1920 * 2 - 1, 1 - sy / 1080 * 2, .5).unproject(this.camera);
    const dir = ndc.sub(this.camera.position).normalize(), dist = this.camera.position.distanceTo(from);
    return this.camera.position.clone().addScaledVector(dir, dist * .92);
  }
  target(ref, at, state) {
    if (state?.actors[ref]) return anchors[state.actors[ref].at].clone().add(V(0, 1.55, 0));   // another character: look at the face
    return this.point(ref) ?? this.panelWorld(ref, at);
  }

  pose(name, from, to, tr, t, D, appear) {
    const sA = from.actors[name], sB = to.actors[name], still = this.still || /[?&]still/.test(location.search);
    const end = anchors[sB.at].clone(), start = anchors[sA.at].clone();
    const yawTo = (p, q) => Math.atan2(q.x - p.x, q.z - p.z);
    const faceB = yawTo(end, this.target(sB.face, end, to)), faceA = yawTo(start, this.target(sA.face, start, from));
    const pose = { pos: end, yaw: faceB, walkDist: 0, walkW: 0, pointW: sB.point ? 1 : 0, aim: sB.point ? this.target(sB.point, end, to) : null,
      lookW: sB.face === 'camera' ? 0 : 1, look: this.target(sB.face, end, to), opacity: 1, still };
    if (!tr) return pose;

    const route = tr.paths[name];
    if (route && !motion.reduced) {
      const u = clamp((t - D * .08) / (D * .82));
      const A = .12, vm = 1 / (1 - A);
      const pace = u < A ? vm * u * u / (2 * A) : u > 1 - A ? 1 - vm * (1 - u) * (1 - u) / (2 * A) : vm * (u - A / 2);
      const sample = route.sample(pace);
      pose.pos = sample.position; pose.walkDist = sample.distance;
      pose.walkW = u > 0 && u < 1 ? 1 : u >= 1 ? 1 - smooth((t - D * .9) / .3) : 0;
      pose.yaw = u < 1 ? sample.yaw : lerpAngle(sample.yaw, faceB, smooth((t - D * .9) / .45));
      pose.lookW *= u >= 1 ? smooth((t - D * .9) / .5) : 0;
      pose.pointW *= u >= 1 ? smooth((t - appear) / .45) : 0;
      return pose;
    }
    const forwardWalk = !tr.back && sB.walk && !motion.reduced;
    if (forwardWalk) {
      // path: anchor names, '|' = an off-screen jump between two places (done while the camera is high)
      const { segs, lens, total } = tr.walks[name];
      const w0 = D * .08, w1 = D * .9, u = clamp((t - w0) / (w1 - w0));
      const A = .12, vm = 1 / (1 - A);   // trapezoid speed: short start and stop, constant pace between
      const d = total * (u < A ? vm * u * u / (2 * A) : u > 1 - A ? 1 - vm * (1 - u) * (1 - u) / (2 * A) : vm * (u - A / 2));
      let left = d, si = 0; while (si < segs.length - 1 && left > lens[si]) { left -= lens[si]; si++; }
      const s = segs[si]; let j = 0; while (j < s.length - 2 && left > s[j].distanceTo(s[j + 1])) { left -= s[j].distanceTo(s[j + 1]); j++; }
      const p0 = s[j], p1 = s[Math.min(j + 1, s.length - 1)], segL = Math.max(1e-6, p0.distanceTo(p1));
      pose.pos = p0.clone().lerp(p1, clamp(left / segL));
      const moving = u > 0 && u < 1;
      pose.walkDist = d; pose.walkW = moving ? 1 : u >= 1 ? 1 - smooth((t - w1) / .3) : 0;
      const yawWalk = yawTo(p0, p1);
      pose.yaw = u < 1 ? yawWalk : lerpAngle(yawWalk, faceB, smooth((t - w1) / .45));
      if (segs.length > 1) {   // fade around the jump so no one sees it
        const dj = lens[0], near = Math.abs(d - dj) / Math.max(.01, total);
        pose.opacity = clamp(near / .06);
      }
      pose.lookW = u >= 1 ? smooth((t - w1) / .5) * pose.lookW : 0;
    } else if (!start.equals(end)) {
      // no walk to show (going back, a jump, reduced motion): fade out, move, fade in
      pose.pos = t < D / 2 ? start : end; pose.yaw = t < D / 2 ? faceA : faceB;
      pose.opacity = clamp(Math.abs(t - D / 2) / (D / 2) * 2 - .2);
    } else {
      pose.yaw = lerpAngle(faceA, faceB, smooth(t / .5));
      pose.lookW = (sA.face === 'camera' ? 0 : 1) + (pose.lookW - (sA.face === 'camera' ? 0 : 1)) * smooth(t / .5);
    }
    // pointing comes in when its target appears, goes out at once
    const pA = sA.point ? 1 : 0, pB = sB.point ? 1 : 0;
    pose.pointW = pB > pA ? smooth((t - appear - .1) / .45) : pB < pA ? 1 - smooth(t / .3) : pB;
    if (!pose.aim && sA.point) pose.aim = this.target(sA.point, start, from);
    return pose;
  }
}

function lerpAngle(a, b, k) { let d = ((b - a + Math.PI) % (2 * Math.PI)) - Math.PI; if (d < -Math.PI) d += 2 * Math.PI; return a + d * k; }
