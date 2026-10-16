"""Timing model shared by generated documents, contracts and QA.

Word rate is unchanged by animations. Film playback is a separate 90-second hold.
Allocated slots include speech, film, transitions, meaningful builds and reading.
"""
from dataclasses import dataclass
import re
from content_20min import SLIDES, WORDS_PER_MINUTE, Slide

@dataclass(frozen=True)
class Timing:
    words: int
    speech: float
    film: int
    pause: float
    total: int

def spoken_text(note: str) -> str:
    text=re.sub(r'\([^)]*\)','',note).replace('[clic]','').replace('[lire]','')
    return re.sub(r'À lire\s*:\s*','',text)

def word_count(text: str) -> int:
    return sum(bool(re.search(r'[^\W_]',word)) for word in text.split())

def mmss(seconds: float) -> str:
    value=round(seconds)
    return f'{value//60}:{value%60:02d}'

def timing(slide: Slide, rate: int = WORDS_PER_MINUTE) -> Timing:
    words=word_count(spoken_text(slide.note))
    speech=words/rate*60
    return Timing(words,speech,slide.film_seconds,slide.seconds-speech-slide.film_seconds,slide.seconds)

if __name__=='__main__':
    rows=[timing(s) for s in SLIDES]
    print(f'{len(rows)} slides, {sum(s.steps for s in SLIDES)} révélations, {sum(r.words for r in rows)} mots')
    print(f'Parole {mmss(sum(r.speech for r in rows))} à {WORDS_PER_MINUTE} mots/min ; film {mmss(sum(r.film for r in rows))} ; transitions et pauses {mmss(sum(r.pause for r in rows))}')
    print(f'Total prévu : {mmss(sum(r.total for r in rows))}, pas une répétition chronométrée')
    for s,t in zip(SLIDES,rows):
        if t.pause<0:print('Créneau insuffisant',s.id,t.pause)
