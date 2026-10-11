export interface VideoPort { pause(): void; play(): Promise<void>; currentTime: number; muted: boolean; }
export class VideoLifecycle {
  private key: string | null = null;
  constructor(private readonly video: VideoPort) {}
  async enter(step: 0 | 1 | null, autoplay = true): Promise<boolean> {
    const key = step === null ? null : String(step);
    if (key === this.key) return true;
    const was = this.key; this.key = key;
    if (step === null || step === 0) { this.video.pause(); this.video.currentTime = 0; return true; }
    if (was === null) this.video.currentTime = 0;
    if (!autoplay) return true;
    return this.play();
  }
  async play(): Promise<boolean> {
    const key = this.key; if (key === null) return false;
    this.video.muted = false;
    try { await this.video.play(); if (this.key !== key) { this.video.pause(); this.video.currentTime = 0; return false; } return true; } catch { return false; }
  }
}
