import type { StoryState } from '../story/types.ts';
export type TransitionKind = 'content' | 'approach' | 'object' | 'world' | 'travel' | 'relocate';
export type NavigationIntent = 'next' | 'prev' | 'jump';
export interface TransitionPlan {
  readonly kind: TransitionKind;
  readonly hiddenPanels: readonly string[];
  readonly walk: boolean;
}
const OBSTRUCTING = new Set(['evidence', 'cover', 'sommaire', 'film-title']);
/** Geometry comes from the rendered shot/poses, never just the two nominal shot names.
 * Scene exceptions express staging intent without changing the accepted itinerary. */
export function classifyTransition(from: StoryState, to: StoryState, intent: NavigationIntent,
  cameraDistance: number, actorDistance: number): TransitionPlan {
  let kind: TransitionKind;
  if (cameraDistance < 1e-5 && actorDistance < 1e-5) kind = 'content';
  else if (intent !== 'next') kind = 'relocate';
  else if (actorDistance > 1e-5) kind = 'travel';
  else if (to.id === 'retour-1') kind = 'world';
  else if (to.source.seq === 'devsecops' || to.shot === 'architecture' || !!to.media) kind = 'object';
  else kind = 'approach';
  const clearView = ['travel', 'relocate', 'world', 'object'].includes(kind);
  const hiddenPanels = clearView ? [...new Set([...from.panels, ...to.panels])].filter(id => OBSTRUCTING.has(id)) : [];
  return { kind, hiddenPanels, walk: kind === 'travel' };
}
/** Only obstructing panels follow the director's opacity. Shared world labels stay active. */
export function visiblePanels(from: readonly string[], to: readonly string[], plan: TransitionPlan,
  phase: string, opacity: number): Set<string> {
  const display = phase === 'exit' ? from : to;
  const hidden = new Set(plan.hiddenPanels);
  const visible = new Set(display.filter(id => !hidden.has(id) || opacity > 0));
  if (phase === 'move' || phase === 'settle') {
    for (const id of from) if (to.includes(id) && !hidden.has(id)) visible.add(id);
  }
  return visible;
}
