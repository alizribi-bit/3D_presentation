export interface ArrivalWalk {
  departure: boolean;
  offset: number;
  distance: number;
  progress: number;
  opacity: number;
  walking: boolean;
}
const clamp = (value: number) => Math.max(0, Math.min(1, value));
/** The camera crosses the roadmap while the guide is out of frame, then shows a short local walk.
 * This avoids making a human traverse tens of world metres at camera flight speed. */
export function arrivalWalk(elapsed: number, duration: number, routeLength: number): ArrivalWalk {
  const phase = elapsed / duration, visibleLength = Math.min(2.6, routeLength);
  const departure = phase < .54;
  const progress = clamp((phase - .54) / .38);
  // Small acceleration/deceleration shoulders, with stride tied to actual local distance.
  const shoulder = .12, speed = 1 / (1 - shoulder);
  const pace = progress < shoulder ? speed * progress ** 2 / (2 * shoulder)
    : progress > 1 - shoulder ? 1 - speed * (1 - progress) ** 2 / (2 * shoulder)
    : speed * (progress - shoulder / 2);
  return { departure, offset: routeLength - visibleLength, distance: visibleLength * pace, progress,
    opacity: departure ? 1 - clamp((phase - .16) / .12) : clamp((phase - .54) / .08),
    walking: progress > 0 && progress < 1 };
}
