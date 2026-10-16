/** Native animations owned by one effect, never by the whole slide or stage. */
export class AnimationGroup {
  private readonly active = new Set<Animation>();
  add(animation: Animation): void {
    this.active.add(animation);
    void animation.finished.then(() => this.active.delete(animation), () => this.active.delete(animation));
  }
  stop(): void {
    for (const animation of this.active) animation.cancel();
    this.active.clear();
  }
  pause(): void {
    for (const animation of this.active) animation.pause();
  }
}
