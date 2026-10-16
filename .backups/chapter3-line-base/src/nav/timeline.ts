import { minimumArrivalDuration } from '../characters/arrival.ts';
import type { TransitionKind } from './transition-plan.ts';
export interface TransitionTiming {
  readonly exit: number; readonly movement: number; readonly settle: number;
  readonly enter: number; readonly arrival: number; readonly total: number;
}
export interface TransitionFrame {
  readonly phase: 'exit' | 'move' | 'settle' | 'enter' | 'done';
  readonly opacity: number; readonly progress: number; readonly movementTime: number; readonly complete: boolean;
}
const clamp = (n: number, min = 0, max = 1): number => Math.min(max, Math.max(min, n));
const smooth = (n: number): number => { const k = clamp(n); return k * k * (3 - 2 * k); };
export const CAMERA_SPEED = 2;
export const WORLD_RETURN_DURATION = 1.75 / CAMERA_SPEED;
/** Content changes have no exit or empty stage. Only forward travel budgets terminal walking.
 * The opacity output belongs to selected obstructing panels, never the stage itself. */
export function transitionTiming(distance: number, walkingLength: number, reduced = false, fast = false,
  kind: TransitionKind = distance < 1e-5 && walkingLength < 1e-5 ? 'content' : 'travel',
  occludes = kind !== 'content' && kind !== 'approach', initialOpacity = 1): TransitionTiming {
  let movement = kind === 'content' ? 0 : kind === 'world' ? WORLD_RETURN_DURATION
    : kind === 'relocate' ? .75 / CAMERA_SPEED : kind === 'travel'
      ? Math.max(clamp(distance / 14, 4.5, 5.2) / CAMERA_SPEED, minimumArrivalDuration(walkingLength))
      : clamp(distance / 14, .65, 1) / CAMERA_SPEED;
  if (reduced) movement = 0;
  else if (fast && movement) movement = .03;
  // An already invisible panel needs no second exit when navigation is interrupted.
  const exit = occludes && initialOpacity > 0 ? (fast ? .01 : reduced ? .08 : .16) : 0;
  const enter = occludes ? (fast ? .01 : reduced ? .12 : .2) : 0;
  const settle = 0, arrival = exit + movement;
  return { exit, movement, settle, enter, arrival, total: arrival + enter };
}
/** Absolute time catches dropped frames without accumulating delays. */
export function transitionFrame(timing: TransitionTiming, elapsed: number, initialOpacity = 1): TransitionFrame {
  const t = Math.max(0, elapsed), movementTime = clamp(t - timing.exit, 0, timing.movement);
  const progress = timing.movement ? movementTime / timing.movement : t < timing.exit ? 0 : 1;
  const phase = t < timing.exit ? 'exit' : t < timing.exit + timing.movement ? 'move'
    : t < timing.arrival ? 'settle' : t < timing.total ? 'enter' : 'done';
  const opacity = phase === 'exit' ? initialOpacity * (1 - smooth(t / timing.exit))
    : phase === 'enter' ? smooth((t - timing.arrival) / timing.enter) : phase === 'done' ? 1 : timing.enter ? 0 : 1;
  return { phase, opacity, progress, movementTime, complete: t >= timing.total };
}

/** Visible content ages from movement start on an approach, and from arrival only
 * when its panel was hidden. Completing a camera move must not replay gestures. */
export function contentStart(timing: TransitionTiming, occludes: boolean): number {
  return occludes ? timing.arrival : timing.exit;
}
