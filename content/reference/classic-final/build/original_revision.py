"""Targeted revisions to the frozen original; layout/runtime remain inherited."""
from __future__ import annotations
import html
import re
from content_20min import PARTS, Slide

CHAPTER_IDS = ('ch1', 'ch3', 'ch4', 'ch5', 'ch6')
DESCRIPTIONS = ('ZAWEDNI, le besoin et l’organisation du projet', 'Les outils, le cluster, le réseau et les secrets', 'Le trajet d’un changement jusqu’au déploiement', 'Le suivi des services et les résultats des essais', 'Les apports du mémoire, ses limites et la suite')
LEADS = ('ZAWEDNI, le besoin et l’organisation du projet.', 'Où tournent les services, et comment on les protège.', 'Du changement enregistré à la version déployée.', 'Suivre les services et vérifier les résultats.', 'Les deux volets du mémoire et les prochaines étapes.')

def chapter_one(template: str) -> str:
    return template.replace('id="ch3"', 'id="ch1"', 1)

def revise(block: str, slide: Slide) -> str:
    if slide.id == 'sommaire':
        items=''.join(f'<li><i>{i+1:02}</i><b>{html.escape(title)}</b><span>{html.escape(DESCRIPTIONS[i])}</span></li>' for i,title in enumerate(PARTS))
        block=re.sub(r'(<ol class="list"[^>]*>).*?(</ol>)',lambda m:m[1]+items+m[2],block,flags=re.S)
    elif slide.id in CHAPTER_IDS:
        rank=CHAPTER_IDS.index(slide.id)
        block=re.sub(r'(<p class="kicker"[^>]*>).*?(</p>)',lambda m:m[1]+f'Chapitre {rank+1}'+m[2],block,count=1,flags=re.S)
        block=re.sub(r'(<p class="no"[^>]*>).*?(</p>)',lambda m:m[1]+f'{rank+1:02}'+m[2],block,count=1,flags=re.S)
        block=re.sub(r'(<p class="lead"[^>]*>).*?(</p>)',lambda m:m[1]+html.escape(LEADS[rank])+m[2],block,count=1,flags=re.S)
        toc=''.join(f'<li{" class="+chr(34)+"on"+chr(34) if i==rank else ""}><i>{i+1:02}</i>{html.escape(title)}</li>' for i,title in enumerate(PARTS))+'<span class="bar"></span>'
        block=re.sub(r'(<ol class="toc"[^>]*>).*?(</ol>)',lambda m:m[1]+toc+m[2],block,flags=re.S)
    if slide.id == 'modele': block=bmc(block)
    if slide.id == 'methodologie': block=scrum(block)
    if slide.id == 'controle-publication':
        block=block.replace('<h3 style="font-size:28px; margin:0 0 6px">Mobile</h3>','<h3 style="font-size:28px; margin:0 0 6px">Déclenchement backend</h3>')
        block=block.replace('APK testé et construit ; sur push, distribué par Azure Blob. Pas de pod.','Lancement manuel selon la branche ; develop exclu du job backend.')
    if slide.id == 'secrets':
        # Remove the final backup reveal and its sprint-5 marker, leaving the
        # original two secret paths and their animated lock untouched.
        block=re.sub(r'<p class="data"[^>]*>.*?</p>','',block,flags=re.S)
        block=re.sub(r'<div class="sprint-marker"[^>]*>.*?</div>','',block,flags=re.S)
    if slide.id == 'log4j':
        block=re.sub(r'<p class="note".*?</p>','<p class="note">Essai documenté dans le rapport · chapitre 9 et annexe</p>',block,flags=re.S)
    if slide.id == 'blocage': block=block.replace('2 exceptions datées','exceptions documentées')
    return block

def bmc(block: str) -> str:
    """Use original images: complete canvas + two simultaneous detailed views."""
    imgs=re.findall(r'<img\b(?:[^>\"\']|"[^"]*"|\'[^\']*\')*>',block)
    if len(imgs)!=4: raise ValueError('Expected complete BMC and its three original crops')
    content='<div class="bmc complete" data-anim="rise" data-lint-skip>'+imgs[0]
    for left,width,key in [(350,191,'value'),(703,171,'clients')]:
        content+=f'<div class="ring" data-bmc-focus="{key}" style="left:{left/880*100:.5f}%;top:{7/601*100:.5f}%;width:{width/880*100:.5f}%;height:{403/601*100:.5f}%" data-step="1" data-anim="ring"></div>'
    content+='</div><p class="bmc-source">Business Model Canvas de ZAWEDNI · annexe B du mémoire</p>'
    content+='<div class="bmc-details" data-step="1" data-anim="rise"><div><h3>Segments de clientèle</h3>'+imgs[1]+'</div><div><h3>Propositions de valeur</h3>'+imgs[2]+'</div></div>'
    content+='<p class="bmc-intro" data-out="1" data-anim="fade">Le modèle complet<br><strong>Les clients visés<br>La valeur proposée</strong></p>'
    start=block.index('<div class="bmc"');end=block.index('<aside class="notes">',start)
    return block[:start]+content+'\n'+block[end:]

def scrum(block: str) -> str:
    """Framework illustration, not a claim of ceremonies performed in the project."""
    diagram='''<figure class="scrum-diagram" data-out="1" data-anim="fade" data-dur=".2">
<img src="assets/scrum-cycle-zawedni-v2.png" alt="Cadre Scrum illustré : backlog, planification, boucle de sprint avec Daily Scrum, incrément, revue et rétrospective, puis retour à la planification.">
</figure>'''
    start=block.index('<div class="panel" data-out="1"');end=block.index('<div class="panel" data-step="1"',start)
    return block[:start]+diagram+'\n'+block[end:]
