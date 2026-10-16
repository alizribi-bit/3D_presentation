import type { StoryState } from './types.ts';
type DeliveryState = Pick<StoryState, 'source' | 'place'>;
function position({ seq, step }: StoryState['source']): number {
  if (seq === 'chaine') return -5.8 + Math.min(step, 3) * 3.85;
  if (seq === 'argocd') return Math.min(step, 2) * 5.8 - 5.8;
  if (seq === 'log4j') return step === 0 ? -5.8 : step === 1 ? 0 : 5.8;
  return 0;
}
// One source of truth for arrival, replay and interrupted transitions. Failed controls stop at the middle gate.
export function deliveryFrame(state: DeliveryState, from: DeliveryState, progress: number): { visible: boolean; blocked: boolean; x: number } {
  const { seq, step } = state.source;
  const blocked = (seq === 'blocage' && step > 0) || (seq === 'log4j' && step === 1);
  const end = blocked ? 0 : position(state.source);
  const start = from.source.seq === seq ? position(from.source) : end;
  return { visible: state.place === '04', blocked, x: start + (end - start) * Math.max(0, Math.min(1, progress)) };
}
