// Navigation has one interruptible timeline. Every frame samples absolute time; a new command
// starts from the rendered camera/actor poses without landing or revealing the interrupted target.
import * as THREE from 'three';
import { STATES } from '../content/states.js';
import { updatePanels, setCover, panelStagePoint } from '../content/panels.js';
import { shotAt, shotDistance, captureShot } from '../camera/rig.js';
import { buildShots, LIFT } from '../camera/shots.js';
import { anchors, roadCurve, setFeedback } from '../world/world.js';
import { motion } from './prefs.js';
import { TravelPath, routePath } from '../characters/path.ts';
import { arrivalWalk } from '../characters/arrival.ts';
import { transitionTiming, transitionFrame, contentStart } from './timeline.ts';
import { classifyTransition, visiblePanels } from './transition-plan.ts';
import { getEvidenceTargetPoint, calculatePointWeight } from '../characters/pose.ts';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const V = (...a) => new THREE.Vector3(...a);

export class Director {
  constructor({ camera, actors, onState, onFrame, still = false, fast = false }) {
    Object.assign(this, { camera, actors, onState, onFrame, still, fast });
    this.shots = buildShots();
    this.i = 0; this.tr = null; this.instantUntil = 0;
    this.renderedState = STATES[0]; this.renderedPoses = {}; this.contentOpacity = 1;
    this.stateT0 = performance.now() / 1000;
    this.evidencePointCache = new Map();
  }

  get state() { return STATES[this.i]; }
  get settled() { return !this.tr; }
  get moving() { return !!this.tr && transitionFrame(this.tr.timing, performance.now() / 1000 - this.tr.t0).phase === 'move'; }

  go(i, { instant = false, intent = 'jump' } = {}) {
    if (!Number.isInteger(i) || !Number.isFinite(i)) return;
    i = clamp(i, 0, STATES.length - 1);
    if (i === this.i && !instant) return;
    const from = this.renderedState;
    const shot = this.camera.userData.lookTarget ? captureShot(this.camera) : this.shots[from.shot];
    const starts = { ...this.renderedPoses };
    const to = STATES[i], now = performance.now() / 1000;
    const previous = this.tr;
    this.i = i;
    // Retarget content at the same arrival anchors without restarting the flight, relocation or walk.
    // Camera alone gets a remaining-time segment from its actually rendered pose.
    if (!instant && previous && ['travel', 'relocate'].includes(previous.plan.kind) && to.place === previous.to.place
      && (now - previous.t0 < previous.timing.arrival || shotDistance(shot, this.shots[to.shot]) < 1e-5)
      && Object.entries(to.actors).every(([name, spec]) => spec.at === previous.to.actors[name].at)) {
      previous.to = to;
      const retargetPlan = classifyTransition(previous.from, to, 'next', 1, 1);
      previous.plan = { ...previous.plan, hiddenPanels: [...new Set([...previous.plan.hiddenPanels, ...retargetPlan.hiddenPanels])] };
      for (const id of previous.plan.hiddenPanels) {
        const el = document.getElementById(`p-${id}`);
        if (el) el.dataset.directed = 'true';
      }
      previous.shot = shot; previous.cameraStart = Math.max(0, now - previous.t0 - previous.timing.exit);
      previous.cameraDuration = Math.max(0, previous.D - previous.cameraStart);
      previous.lift = 0;
      this.evidencePointCache.clear();
      this.notify(to);
      return;
    }
    this.releasePanels();
    this.stateT0 = now;
    this.evidencePointCache.clear();
    if (instant) { this.tr = null; this.instantUntil = now + .05; }
    else {
      const lift = LIFT[`${from.shot}>${to.shot}`] ?? 0;
      const distance = shotDistance(shot, this.shots[to.shot]);
      const actorDistance = Math.max(0, ...Object.entries(to.actors).map(([name, spec]) =>
        (starts[name]?.pos ?? anchors[from.actors[name].at]).distanceTo(anchors[spec.at])));
      const plan = classifyTransition(from, to, intent, distance, actorDistance);
      const paths = {};
      for (const [name, spec] of plan.walk ? Object.entries(to.actors) : []) {
        const start = starts[name]?.pos ?? anchors[from.actors[name].at];
        const end = anchors[spec.at];
        if (start.distanceTo(end) < 1e-5) continue;
        if (from.place && to.place && from.place !== to.place) {
          paths[name] = routePath(roadCurve, start, end, anchors[`stopT${from.place}`], anchors[`stopT${to.place}`]);
        } else if (spec.walk && !spec.walk.includes('|') && from.move !== 'travel') {
          paths[name] = new TravelPath([start, ...spec.walk.slice(1).map(n => anchors[n]), end]);
        } else paths[name] = new TravelPath([start, end]);
      }
      const walkingLength = Math.max(0, ...Object.values(paths).map(path => path.length));
      const travelLift = plan.kind === 'travel' ? lift : 0;
      const timing = transitionTiming(shotDistance(shot, this.shots[to.shot], travelLift),
        plan.walk ? walkingLength : 0, motion.reduced, this.fast, plan.kind, plan.hiddenPanels.length > 0, this.contentOpacity);
      this.tr = { from, to, shot, starts, t0: now, timing, D: timing.movement, lift: travelLift, paths: plan.walk ? paths : {}, plan,
        cameraStart: 0, cameraDuration: timing.movement,
        reduced: motion.reduced, initialOpacity: this.contentOpacity };
      for (const id of plan.hiddenPanels) {
        const el = document.getElementById(`p-${id}`);
        if (el) el.dataset.directed = 'true';
      }
    }
    this.notify(to);
  }
  notify(to) {
    try { history.replaceState(null, '', `#${to.id}`); } catch { /* file:// in some browsers */ }
    this.onState?.(this);
  }
  next() { this.go(this.i + 1, { intent: 'next' }); }
  prev() { this.go(this.i - 1, { intent: 'prev' }); }
  releasePanels() {
    for (const el of document.querySelectorAll('[data-directed]')) {
      delete el.dataset.directed; el.style.removeProperty('opacity'); el.style.removeProperty('transform');
    }
  }
  settle() { this.releasePanels(); this.tr = null; this.instantUntil = performance.now() / 1000 + .05; }

  // ── per frame ─────────────────────────────────────────────────────────────────────────────────
  frame(now) {
    const tr = this.tr, to = this.state;
    const elapsed = tr ? now - tr.t0 : now - this.stateT0;
    const timeline = tr ? transitionFrame(tr.timing, elapsed, tr.initialOpacity)
      : { phase: 'done', opacity: 1, progress: 1, movementTime: 0, complete: true };
    const outgoing = timeline.phase === 'exit';
    const display = outgoing ? tr.from : to;
    const from = tr?.from ?? to, k = timeline.progress;
    this.contentOpacity = timeline.opacity;
    this.renderedState = display;
    document.body.classList.toggle('instant', now < this.instantUntil || this.fast);

    const cameraK = tr ? (tr.cameraDuration ? clamp((timeline.movementTime - tr.cameraStart) / tr.cameraDuration) : k) : 1;
    shotAt(this.camera, tr?.shot ?? this.shots[to.shot], this.shots[to.shot], cameraK, tr?.lift ?? 0,
      tr && ['approach', 'object', 'world', 'relocate'].includes(tr.plan.kind) ? 'soft' : 'travel');
    this.camera.updateMatrixWorld(true);

    // The stage stays stable; only explicitly selected blocking panels use this clock.
    const stage = document.getElementById('stage');
    stage.style.opacity = '1'; stage.style.visibility = 'visible'; stage.inert = false;
    stage.dataset.phase = timeline.phase;
    stage.dataset.transition = tr?.plan.kind ?? 'content';
    const vis = tr ? visiblePanels(tr.from.panels, to.panels, tr.plan, timeline.phase, timeline.opacity) : new Set(to.panels);
    for (const id of tr?.plan.hiddenPanels ?? []) {
      const el = document.getElementById(`p-${id}`);
      if (el) { el.style.opacity = String(vis.has(id) ? timeline.opacity : 0); el.style.transform = 'none'; }
    }
    if (tr && timeline.phase !== 'enter' && timeline.phase !== 'done' && !outgoing) vis.delete('film-title');
    setCover(display.cover || 'gone');
    updatePanels(vis, this.camera, display);
    this.onFrame?.(vis, display, k, from);
    const appear = tr ? contentStart(tr.timing, tr.plan.hiddenPanels.length > 0) - tr.timing.exit : 0;
    const poseTime = tr ? Math.max(0, elapsed - tr.timing.exit) : elapsed;
    setFeedback(display.feedback ? (outgoing ? 1 : smooth((poseTime - appear) / .8)) : 0);

    for (const [name, actor] of Object.entries(this.actors)) {
      const pose = outgoing && tr.starts[name] ? tr.starts[name]
        : this.pose(name, from, to, tr, poseTime, tr?.D ?? 1, appear);
      this.renderedPoses[name] = pose;
      actor.apply(pose, now);
    }
    if (tr && timeline.complete) {
      this.tr = null;
      this.releasePanels();
      // Keep pointing/reveal time continuous after completion rather than replaying the gesture.
      this.stateT0 = tr.t0 + contentStart(tr.timing, tr.plan.hiddenPanels.length > 0);
    }
  }

  point(ref) {
    if (ref === 'camera') return this.camera.position.clone();
    if (anchors[ref]) return anchors[ref].clone();
    return null;
  }
  // A DOM panel seen as a point in the world, at the depth of the character who points at it.
  panelWorld(ref, from, state) {
    let sx = 1100, sy = 480;
    if (ref === 'evidence') {
      let foundDom = false;
      const cacheKey = `${state.id}:${innerWidth}:${innerHeight}`;
      const cached = this.evidencePointCache.get(cacheKey);
      if (cached) { [sx, sy] = cached; foundDom = true; }
      if (typeof document !== 'undefined') {
        const stageEl = document.getElementById('stage');
        const evEl = document.getElementById('p-evidence');
        if (!foundDom && stageEl && evEl && evEl.shadowRoot && evEl.dataset.frame === state.id) {
          const candidates = [...evEl.shadowRoot.querySelectorAll('[data-focus], [data-active], .focus, .key'),
            ...evEl.shadowRoot.querySelectorAll('img:not([hidden]), svg:not([hidden]), h2')];
          const targetEl = candidates.find(element => {
            const css = getComputedStyle(element);
            return css.visibility !== 'hidden' && css.display !== 'none' && css.opacity !== '0';
          });
          if (targetEl) {
            const rect = targetEl.getBoundingClientRect();
            const sRect = stageEl.getBoundingClientRect();
            const s = sRect.width / 1920;
            if (s > 0 && rect.width > 0 && rect.height > 0) {
              sx = (rect.left + rect.width / 2 - sRect.left) / s;
              sy = (rect.top + rect.height / 2 - sRect.top) / s;
              foundDom = true;
              // Hidden recycled panels still have their off-state transform. Cache only the
              // fully revealed geometry, so pointing cannot retain a travel-phase offset.
              if (stageEl.dataset.phase === 'done' && evEl.classList.contains('on')) this.evidencePointCache.set(cacheKey, [sx, sy]);
            }
          }
        }
      }
      if (!foundDom && state?.source) {
        [sx, sy] = getEvidenceTargetPoint(state.source.seq, state.source.step);
      }
    } else {
      [sx, sy] = panelStagePoint(ref);
    }
    const ndc = V(sx / 1920 * 2 - 1, 1 - sy / 1080 * 2, .5).unproject(this.camera);
    const dir = ndc.sub(this.camera.position).normalize(), dist = this.camera.position.distanceTo(from);
    return this.camera.position.clone().addScaledVector(dir, dist * .92);
  }
  target(ref, at, state) {
    if (state?.actors[ref]) return anchors[state.actors[ref].at].clone().add(V(0, 1.55, 0));   // another character: look at the face
    return this.point(ref) ?? this.panelWorld(ref, at, state);
  }

  pose(name, from, to, tr, t, D, appear) {
    const sA = from.actors[name], sB = to.actors[name], still = this.still || /[?&]still/.test(location.search);
    const end = anchors[sB.at].clone(), start = tr?.starts[name]?.pos.clone() ?? anchors[sA.at].clone();
    const yawTo = (p, q) => Math.atan2(q.x - p.x, q.z - p.z);
    const targetLook = this.target(sB.face, end, to);
    const faceB = yawTo(end, targetLook);
    const faceA = tr?.starts[name]?.yaw ?? yawTo(start, this.target(sA.face, start, from));

    const pointTarget = sB.point ? this.target(sB.point, end, to) : null;
    const pointW = sB.point ? calculatePointWeight(t, appear) : 0;

    const pose = {
      pos: end,
      yaw: faceB,
      walkDist: 0,
      walkW: 0,
      pointW: still ? (sB.point ? 1 : 0) : pointW,
      aim: pointTarget,
      lookW: sB.face === 'camera' ? 0 : 1,
      look: targetLook,
      opacity: 1,
      still,
      instant: performance.now() / 1000 < this.instantUntil || still || tr?.reduced || this.fast
    };
    if (!tr || tr.reduced || this.fast || !D) return pose;

    const route = tr.paths[name];
    if (route) {
      const arrival = arrivalWalk(t, D, route.length), u = arrival.progress;
      if (arrival.departure) return { ...pose, pos: start, yaw: faceA, opacity: arrival.opacity * (tr.starts[name]?.opacity ?? 1), pointW: 0, lookW: 0 };
      const sample = route.sample((arrival.offset + arrival.distance) / Math.max(route.length, 1e-6));
      pose.pos = sample.position; pose.walkDist = arrival.distance; pose.opacity = arrival.opacity;
      // Blend the walk only while translating; the distance drives its clip phase.
      pose.walkW = arrival.walking ? smooth(u / .08) * (1 - smooth((u - .88) / .12)) : 0;
      pose.yaw = u < 1 ? sample.yaw : lerpAngle(sample.yaw, faceB, smooth((t - D * .9) / .45));
      pose.lookW *= u >= 1 ? smooth((t - D * .9) / .5) : 0;
      pose.pointW *= u >= 1 ? smooth((t - appear) / .45) : 0;
      return pose;
    }
    if (!start.equals(end)) {
      pose.pos = t < D / 2 ? start : end; pose.yaw = t < D / 2 ? faceA : faceB;
      pose.opacity = t < D / 2 ? (tr.starts[name]?.opacity ?? 1) * (1 - smooth(t / (D / 2)))
        : smooth((t - D / 2) / (D / 2));
    } else {
      pose.yaw = lerpAngle(faceA, faceB, smooth(t / .5));
      pose.lookW = (sA.face === 'camera' ? 0 : 1) + (pose.lookW - (sA.face === 'camera' ? 0 : 1)) * smooth(t / .5);
    }
    return pose;
  }
}

function lerpAngle(a, b, k) { let d = ((b - a + Math.PI) % (2 * Math.PI)) - Math.PI; if (d < -Math.PI) d += 2 * Math.PI; return a + d * k; }
