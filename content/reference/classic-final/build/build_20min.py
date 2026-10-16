"""Compile the independent classic copy from its frozen local reference.

The reference includes local hand edits and offline fonts. Only the selected
sections are projected. Short content, notes, order and timing share one model.
The adapter compacts both declarative and generated SVG builds before parsing.
"""
from __future__ import annotations
import base64
import html
import json
import re
from pathlib import Path
from content_20min import PARTS, SLIDES, WORDS_PER_MINUTE, TARGET_SECONDS, FILM_SECONDS
from estimate import timing, mmss
from screenshot_layouts import polish
from original_revision import revise, chapter_one, CHAPTER_IDS

ROOT = Path(__file__).resolve().parent.parent
SECTION = re.compile(r'<section class="slide[^\"]*" id="([^\"]+)"[^>]*>.*?</section>', re.S)

def notes(note: str) -> str:
    return '<aside class="notes">\n' + '\n'.join(f'<p{chr(32)+"data-step="+chr(34)+str(i)+chr(34) if i else ""}>{html.escape(text).replace("À lire :", "<b>À lire :</b>")}</p>' for i,text in enumerate(note.split(' [clic] '))) + '\n</aside>'

def inline_images(document: str) -> str:
    def replace(match: re.Match[str]) -> str:
        path=(ROOT/match[2]).resolve()
        if not path.is_relative_to(ROOT/'assets'): raise ValueError('Image outside copy')
        mime={'.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'}[path.suffix]
        return match[1]+'data:'+mime+';base64,'+base64.b64encode(path.read_bytes()).decode()+match[3]
    return re.sub(r'((?:src|href|poster)=["\'])(assets/[^"\']+)(["\'])',replace,document)

def transition_for(index: int) -> str:
    if SLIDES[index].id in CHAPTER_IDS or (index > 0 and SLIDES[index-1].part != SLIDES[index].part):
        return 'dip'
    # The routing slide focuses on a detail of the preceding architecture.
    # Fade avoids moving two SVG-heavy diagrams while the host highlight builds.
    return 'fade' if SLIDES[index].id == 'routage' else 'camera'

def build() -> None:
    reference=(ROOT/'build/reference-local.offline.html').read_text()
    original={m[1]:m[0] for m in SECTION.finditer(reference)}
    original['ch1']=chapter_one(original['ch3'])
    short={m[1]:m[0] for m in SECTION.finditer((ROOT/'build/short.sections.html').read_text())}
    blocks=[]
    for index,slide in enumerate(SLIDES):
        block=short.get(slide.id,original.get(slide.id))
        if block is None: raise ValueError(f'Missing source: {slide.id}')
        expected=slide.steps
        if slide.note.count('[clic]')!=expected: raise ValueError(f'Notes/builds differ: {slide.id}')
        block=re.sub(r'<aside class="notes">.*?</aside>',lambda m:notes(slide.note),block,flags=re.S)
        block=re.sub(r'(<h[12][^>]*>).*?(</h[12]>)',lambda m:m[1]+html.escape(slide.title)+m[2],block,count=1,flags=re.S)
        block=re.sub(r' data-(pos|transition|color)="[^\"]*"','',block,count=0)
        entering = index > 0 and SLIDES[index-1].part != slide.part
        transition = transition_for(index)
        rank = sum(1 for previous in SLIDES[:index] if previous.part == slide.part)
        block=block.replace(f'id="{slide.id}"',f'id="{slide.id}" data-pos="{rank*1.1:g} {slide.part*1.2:g}" data-transition="{transition}" data-transition-dur=".75" data-color="#f4f7f2"',1)
        block=revise(block,slide)
        block=polish(slide.id,block)
        blocks.append(block)
    # Keep the accepted theme and bundled runtime. Drop the projected source
    # sections as a unit; avoid treating presenter template literals as slides.
    start=reference.index('<section class="slide')
    end=reference.index('\n</div>\n\n<script id="deck-kit-js">',start)
    document=reference[:start]+'\n\n'.join(blocks)+'\n'+reference[end:]
    document=document.replace('<title>ZAWEDNI — Soutenance du mémoire</title>','<title>ZAWEDNI_CLASSIQUE_20MIN · 18–19 minutes</title>')
    document=document.replace('</head>','<style id="short-css">'+(ROOT/'build/short.css').read_text()+'\n'+(ROOT/'build/screenshots.css').read_text()+'</style>\n</head>',1)
    config={s.id:{'map':list(s.mapping),'preserve':True} for s in SLIDES}
    adapter=(ROOT/'build/compact-runtime.js').read_text().replace('COMPACT_CONFIG',json.dumps(config))
    # Runtime init waits for DOMContentLoaded: insert before original hook registration.
    insertion=document.index('<script>\nconst { svg, ease, lerp')
    document=document[:insertion]+'<script id="short-runtime">'+adapter+'</script>\n'+document[insertion:]
    # The rail consists of two straight segments. Avoid querying SVG geometry
    # after style writes on every moving-commit frame; compute the same position.
    document=document.replace('const q = pointAt(W.track, t);',
        'const distance = clamp(t, 0, 1) * L; const q = { x: X0 + Math.min(distance, 1640 - X0), y: YM + Math.max(0, distance - (1640 - X0)) };')
    document=document.replace("W.halo.setAttribute('r', 30 + 10 * st.life(1.8, 1));", "W.halo.setAttribute('r', 30);")
    document=document.replace('steps: 3, ambient: 24,','steps: 3,')
    # Preserve batch E: the accepted player mutes presenter previews and resets
    # playback on departure, including hash and keyboard navigation.
    player=(ROOT/'build/E.js').read_text()
    document=re.sub(r'<script data-batch="E">.*?</script>',lambda m:'<script data-batch="E">\n'+player+'\n</script>',document,flags=re.S)
    # The original chapter bar uses six positional indexes. Preserve its motion
    # with the new five-entry TOC and a first-chapter opener in the same theme.
    chapters=(ROOT/'build/chapter-runtime.js').read_text()
    document=re.sub(r'<script data-batch="H">.*?</script>',lambda m:'<script data-batch="H">\n'+chapters+'\n</script>',document,flags=re.S)
    document=inline_images(document)
    (ROOT/'deck.offline.html').write_text(document)
    (ROOT/'deck.html').write_text(document)
    write_docs()
    print(f'{len(SLIDES)} slides, {sum(s.steps for s in SLIDES)} révélations, {mmss(TARGET_SECONDS)} prévues, film inclus')

def write_docs() -> None:
    table='| # | Chapter | Title | Steps | Visual | Transition | Through-line | Note |\n|---|---|---|---|---|---|---|---|\n'
    duration='| # | Slide | Parole | Film | Transitions, animations et lecture | Créneau | Cumul |\n|---|---|---|---|---|---|---|\n'
    speech=f"# Script oral ZAWEDNI_CLASSIQUE_20MIN\n\n{len(SLIDES)} slides · {sum(s.steps for s in SLIDES)} révélations · cible **{mmss(TARGET_SECONDS)}**, film de 90 s inclus.\n\n`[clic]` = une révélation ; les passages entre slides et les respirations sont inclus dans les créneaux. Les indications entre parenthèses ne sont pas dites. Source unique : `build/content_20min.py`.\n"
    cumulative=0
    total_words=0
    total_speech=0.0
    total_pauses=0.0
    for n,s in enumerate(SLIDES,1):
        t=timing(s)
        if t.pause < 0: raise ValueError(f'Speech/film longer than slot: {s.id}')
        cumulative+=s.seconds; total_words+=t.words; total_speech+=t.speech; total_pauses+=t.pause
        entering=n==1 or SLIDES[n-2].part!=s.part
        chapter=PARTS[s.part] if entering else ''
        transition=transition_for(n-1)
        table+=f'| {n} | {chapter} | {s.title} | {s.steps} | {s.motion} | {transition} | du code au service | {s.note} |\n'
        duration+=f'| {n} | {s.title} | {t.speech:.0f} s | {t.film} s | {t.pause:.0f} s | {s.seconds} s | {mmss(cumulative)} |\n'
        speech+=f'\n---\n\n## {n}. {s.title}\n\nDurée indicative : **{s.seconds} s**, parole ≈ {t.speech:.0f} s'+(f', film {t.film} s' if t.film else '')+'.\n\n'+s.note.replace(' [clic] ','\n\n**[clic]** ')+'\n'
    header=f"---\ntitle: ZAWEDNI_CLASSIQUE_20MIN\ntype: tech-talk\nlength: {mmss(TARGET_SECONDS)}, film inclus\nrate: {WORDS_PER_MINUTE}\naudience: jury de soutenance\nthesis: du code à une plateforme déployée, contrôlée, traçable et supervisée\nthrough-line: contexte → architecture DevSecOps → livraison → supervision → bilan\nbookend: la plateforme et son exploitation reviennent dans le bilan\n---\n\n"
    (ROOT/'SCRIPT.md').write_text(header+table)
    viewer_speech=re.sub(r'Durée indicative : .*?\n\n','',speech)
    (ROOT/'DISCOURS.md').write_text(viewer_speech)
    (ROOT/'SCRIPT_ORAL_18MIN.md').write_text(speech)
    slow=total_words/105*60+FILM_SECONDS+total_pauses
    navigation=(len(SLIDES)-1)*2+sum(s.steps for s in SLIDES)*1.2
    summary=f"# Durée prévue — classique courte animée\n\n**{total_words} mots**, soit **{mmss(total_speech)} de parole à {WORDS_PER_MINUTE} mots/min**, + **{mmss(FILM_SECONDS)} de film**, + **{mmss(total_pauses)} de transitions, animations, observation des preuves et pauses** = **{mmss(TARGET_SECONDS)} prévues**.\n\nLes créneaux réservent 2 s à chaque passage de slide, 1,2 s à chaque révélation, et environ {total_pauses-navigation:.0f} s à la lecture des captures, à la construction des schémas et aux respirations. Les {sum(s.steps for s in SLIDES)} révélations et les cinq ouvertures de chapitre restent animées. Les animations se déroulent pendant l'explication ; il n'est pas nécessaire d'attendre chaque apparition avant de parler.\n\nÀ 105 mots/min, mêmes pauses et vidéo : **{mmss(slow)}**. Le débit retenu reste naturel ; aucune accélération n’est nécessaire dans ce calcul. **Estimation fondée sur le script, pas chronométrage d'une répétition réelle.** Faire une répétition avec le minuteur du présentateur.\n\n"
    for part in range(len(PARTS)):
        summary+=f'- {PARTS[part]} : {mmss(sum(s.seconds for s in SLIDES if s.part==part))}.\n'
    summary+='\n'+duration
    (ROOT/'DUREE.md').write_text(summary)
    (ROOT/'PLAN_PRESENTATION.md').write_text(summary)

if __name__=='__main__': build()
