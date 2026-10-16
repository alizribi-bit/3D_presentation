/** A separate object clock never blocks navigation or restarts the camera.
 * Retarget from the actually displayed coordinate, including on rapid/backward input. */
export class DeliveryMotion {
  private id = '';
  private start = 0;
  private end = 0;
  private startedAt = 0;
  private duration = 0;
  static readonly durationSeconds = .65;

  private at(now: number): number {
    const t = this.duration ? Math.min(1, Math.max(0, (now - this.startedAt) / this.duration)) : 1;
    const eased = t * t * (3 - 2 * t);
    return this.start + (this.end - this.start) * eased;
  }
  sample(id: string, target: number, now: number, animate: boolean): number {
    if (id !== this.id) {
      this.start = this.id ? this.at(now) : target;
      this.end = target;
      this.startedAt = now;
      this.duration = this.id && animate ? DeliveryMotion.durationSeconds : 0;
      this.id = id;
    }
    // Toggling reduced motion finishes the object immediately, without a new state.
    if (!animate) { this.duration = 0; this.start = target; this.end = target; }
    return this.at(now);
  }
}
