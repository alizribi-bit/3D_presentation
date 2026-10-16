export type Chapter = 0 | 1 | 2 | 3 | 4 | 5;
export type PlaceId = '01' | '03' | '04' | '05' | '06';
export type Note = [kind: 'say' | 'read' | 'added', text: string, source?: string];
export interface Sequence {
  id: string; seq: number; chapter: number; title: string; steps: number; speech: string[]; visual: string;
}
export interface ActorState { at: string; face: string; point?: string; walk?: string[]; route?: { from: PlaceId; to: PlaceId }; }
export interface StoryState {
  id: string; scene: string; title: string; chapter: Chapter; place: PlaceId | null;
  source: { seq: string; step: number }; move: 'cut' | 'reveal' | 'travel'; shot: string;
  panels: string[]; duration: number; actors: Record<'guide' | 'rep', ActorState>;
  notes: { script: Note[]; next: string; silent?: string }; visited: string[];
  cover?: 'basmala' | 'full'; feedback?: boolean; hot?: string[];
  evidence?: { seq: string; step: number }; media?: { step: 0 | 1 };
}
