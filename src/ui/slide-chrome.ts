import type { Chapter, Sequence, StoryState } from '../story/types.ts';

export interface SlideMarker {
  readonly number: number;
  readonly total: number;
  readonly chapter: Chapter;
}

export function slideMarkers(sequences: readonly Sequence[]): ReadonlyMap<string, SlideMarker> {
  return new Map(sequences.map((sequence, index) => [sequence.id, {
    number: index + 1, total: sequences.length, chapter: sequence.chapter as Chapter,
  }]));
}

/** Persistent stage furniture, independent of panel fades and click-by-click reveals. */
export class SlideChrome {
  private readonly markers: ReadonlyMap<string, SlideMarker>;
  private readonly chapters: ReadonlyMap<Chapter, HTMLLIElement>;
  private readonly number: HTMLDivElement;
  private sequence = '';

  constructor(stage: HTMLElement, sequences: readonly Sequence[]) {
    this.markers = slideMarkers(sequences);
    const header = document.createElement('div');
    header.id = 'slide-chapters';
    header.className = 'slide-chrome';
    const label = document.createElement('span');
    label.textContent = 'Chapitres';
    const list = document.createElement('ol');
    list.setAttribute('aria-label', 'Chapitres de la présentation');
    const chapters = new Map<Chapter, HTMLLIElement>();
    for (const sequence of sequences) {
      const chapter = sequence.chapter as Chapter;
      if (!chapter || chapters.has(chapter)) continue;
      const item = document.createElement('li');
      item.textContent = String(chapter);
      item.dataset['chapter'] = String(chapter);
      item.setAttribute('aria-label', `Chapitre ${chapter} : ${sequence.title}`);
      chapters.set(chapter, item);
      list.append(item);
    }
    this.chapters = chapters;
    header.append(label, list);
    this.number = document.createElement('div');
    this.number.id = 'slide-number';
    this.number.className = 'slide-chrome';
    stage.append(header, this.number);
  }

  show(state: Pick<StoryState, 'source'>): void {
    if (state.source.seq === this.sequence) return;
    const marker = this.markers.get(state.source.seq);
    if (!marker) throw new Error(`Unknown slide ${state.source.seq}`);
    this.sequence = state.source.seq;
    this.number.textContent = String(marker.number);
    this.number.setAttribute('aria-label', `Diapositive ${marker.number} sur ${marker.total}`);
    for (const [chapter, item] of this.chapters) {
      if (chapter === marker.chapter) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    }
  }
}
