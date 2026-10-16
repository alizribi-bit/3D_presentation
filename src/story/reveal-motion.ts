import { AnimationGroup } from './animation-group.ts';
export type RevealKind = 'diagram' | 'proof' | 'content';

/** A short bounded stagger guides the eye without adding navigation time. */
export const revealMotion = Object.freeze({
  diagramDuration: 320,
  proofDuration: 380,
  contentDuration: 300,
  stagger: 24,
  maxDelay: 96,
  distance: 8,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
});

export interface RevealEntrance {
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
}

export function revealEntrance(kind: RevealKind, index: number, opacity = 1): RevealEntrance {
  const duration = kind === 'diagram' ? revealMotion.diagramDuration
    : kind === 'proof' ? revealMotion.proofDuration : revealMotion.contentDuration;
  // SVG coordinates and cropped evidence keep their original transforms. Individual
  // CSS translate composes with an HTML image's existing crop/scale instead of replacing it.
  const keyframes: Keyframe[] = kind === 'diagram'
    ? [{ opacity: 0 }, { opacity }]
    : [{ opacity: 0, translate: `0 ${revealMotion.distance}px` }, { opacity, translate: '0 0' }];
  return { keyframes, options: {
    duration, delay: Math.min(revealMotion.maxDelay, Math.max(0, index) * revealMotion.stagger),
    easing: revealMotion.easing, fill: 'backwards',
  } };
}

/** Own only local entrances, leaving the accepted board/camera transitions intact.
 * Cancellation restores canonical styles immediately on back/jump/reduced motion. */
export class LocalRevealMotion {
  private readonly animations = new AnimationGroup();

  stop(): void {
    this.animations.stop();
  }

  play(nodes: readonly Element[]): void {
    this.stop();
    for (const [index, node] of nodes.entries()) {
      const style = getComputedStyle(node);
      const kind: RevealKind = node.namespaceURI === 'http://www.w3.org/2000/svg'
        || (style.translate && style.translate !== 'none') ? 'diagram'
        : node.tagName === 'IMG' || node.querySelector('img') ? 'proof' : 'content';
      const entrance = revealEntrance(kind, index, Number(style.opacity));
      const animation = node.animate(entrance.keyframes, entrance.options);
      this.animations.add(animation);
    }
  }
}
