import { CatmullRomCurve3, Vector3 } from 'three';
export class TravelPath {
  readonly length: number;
  private readonly points: Vector3[];
  private readonly lengths: number[];
  constructor(points: readonly Vector3[]) {
    if (points.length < 2) throw new Error('A travel path needs two points');
    this.points = points.map(p => p.clone());
    this.lengths = [0];
    for (let i = 1; i < this.points.length; i++) this.lengths.push(this.lengths[i - 1]! + this.points[i]!.distanceTo(this.points[i - 1]!));
    this.length = this.lengths.at(-1)!;
  }
  sample(progress: number): { position: Vector3; yaw: number; distance: number } {
    const u = Math.min(1, Math.max(0, progress));
    const distance = u * this.length;
    let i = 1; while (i < this.points.length - 1 && this.lengths[i]! < distance) i++;
    const a = this.points[i - 1]!, b = this.points[i]!;
    const span = this.lengths[i]! - this.lengths[i - 1]!;
    return { position: a.clone().lerp(b, span ? (distance - this.lengths[i - 1]!) / span : 0), yaw: Math.atan2(b.x - a.x, b.z - a.z), distance };
  }
}
export function routePath(curve: CatmullRomCurve3, from: Vector3, to: Vector3, fromT: number, toT: number): TravelPath {
  // Cache a constant-distance sampled route once per transition; no route search or curve allocation per frame.
  const points = [from];
  const steps = Math.max(2, Math.ceil(Math.abs(toT - fromT) * 120));
  for (let i = 0; i <= steps; i++) {
    const p = curve.getPointAt(fromT + (toT - fromT) * i / steps); p.y = .16; points.push(p);
  }
  points.push(to); return new TravelPath(points);
}
