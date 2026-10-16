export interface ArrivalWalk {
  departure: boolean;
  offset: number;
  distance: number;
  progress: number;
  opacity: number;
  walking: boolean;
}
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const WALK = { distance: 2.6, start: .54, window: .38, shoulder: .12, maxSpeed: 1.8 } as const;
/** Shared with the navigation timeline so changing the walking profile cannot cause running. */
export function minimumArrivalDuration(routeLength: number): number {
  return Math.min(WALK.distance, Math.max(0, routeLength)) / (WALK.window * (1 - WALK.shoulder) * WALK.maxSpeed);
}
/** The camera crosses the roadmap while the guide is out of frame, then shows a short local walk.
 * This avoids making a human traverse tens of world metres at camera flight speed. */
export function arrivalWalk(elapsed: number, duration: number, routeLength: number): ArrivalWalk {
  const phase = elapsed / duration, visibleLength = Math.min(WALK.distance, routeLength);
  const departure = phase < WALK.start;
  const progress = clamp((phase - WALK.start) / WALK.window);
  // Small acceleration/deceleration shoulders, with stride tied to actual local distance.
  const shoulder = WALK.shoulder, speed = 1 / (1 - shoulder);
  const pace = progress < shoulder ? speed * progress ** 2 / (2 * shoulder)
    : progress > 1 - shoulder ? 1 - speed * (1 - progress) ** 2 / (2 * shoulder)
    : speed * (progress - shoulder / 2);
  return { departure, offset: routeLength - visibleLength, distance: visibleLength * pace, progress,
    opacity: departure ? 1 - clamp((phase - .16) / .12) : clamp((phase - WALK.start) / .08),
    walking: progress > 0 && progress < 1 };
}
