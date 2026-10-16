import type { StoryState } from './types.ts';
export type DeliverySource = StoryState['source'];
/** Only explanatory convoyeur states share the world with the original slide.
 * Evidence-heavy screens retain the accepted full board and existing camera. */
export function isDeliveryReveal(source: DeliverySource): boolean {
  return (source.seq === 'chaine' && source.step >= 1 && source.step <= 3)
    || (source.seq === 'log4j' && source.step >= 1 && source.step <= 2);
}
export function deliveryLabels(source: DeliverySource): string[] {
  return source.seq === 'log4j'
    ? ['log4j-gate-0', 'log4j-gate-1', 'log4j-gate-2']
    : ['gate-0', 'gate-1', 'gate-2'];
}
