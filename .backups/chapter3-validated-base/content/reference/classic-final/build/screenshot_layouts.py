"""Presentation-only crops of authentic screenshots; source media stay unchanged.

Coordinates use source-image pixels. One scale controls both axes, and highlights
share that coordinate system. Two views of the manifest preserve both the bot
identity and the updated image line without inventing or repainting any evidence.
"""
from __future__ import annotations
from dataclasses import dataclass
import html
import re

@dataclass(frozen=True)
class Rect:
    x: int
    y: int
    width: int
    height: int

@dataclass(frozen=True)
class Screenshot:
    key: str
    source: str
    source_width: int
    source_height: int
    crop: Rect
    display_width: int
    alt: str
    marks: tuple[Rect, ...] = ()

    def validate(self) -> None:
        c=self.crop
        if min(c.x,c.y)<0 or min(c.width,c.height,self.display_width)<=0:
            raise ValueError(f'Invalid crop: {self.key}')
        if c.x+c.width>self.source_width or c.y+c.height>self.source_height:
            raise ValueError(f'Crop outside screenshot: {self.key}')
        for mark in self.marks:
            if mark.x<c.x or mark.y<c.y or mark.x+mark.width>c.x+c.width or mark.y+mark.height>c.y+c.height:
                raise ValueError(f'Highlight outside crop: {self.key}')

    def render(self) -> str:
        self.validate()
        c=self.crop; scale=self.display_width/c.width
        attrs=f'data-bleed data-lint-skip data-proof-key="{self.key}" data-proof-source="{self.source}" data-proof-crop="{c.x} {c.y} {c.width} {c.height}"'
        viewport=f'position:relative;overflow:hidden;width:{self.display_width}px;height:{c.height*scale:.4f}px;'
        image_style=f'position:absolute;display:block;max-width:none;width:{self.source_width*scale:.4f}px;height:auto;left:{-c.x*scale:.4f}px;top:{-c.y*scale:.4f}px;transform:none;'
        content=f'<img src="{html.escape(self.source,quote=True)}" alt="{html.escape(self.alt,quote=True)}" style="{image_style}">'
        for mark in self.marks:
            style=f'left:{(mark.x-c.x)*scale:.4f}px;top:{(mark.y-c.y)*scale:.4f}px;width:{mark.width*scale:.4f}px;height:{mark.height*scale:.4f}px;'
            content+=f'<span class="proof-mark" aria-hidden="true" style="{style}"></span>'
        return f'<div class="proof-crop" {attrs} style="{viewport}">{content}</div>'

SHOTS: dict[str,Screenshot] = {
    'market':Screenshot('market','assets/v3-buy-marketplace.jpg',1600,1000,Rect(630,245,960,390),1620,'Marché local ZAWEDNI : cartes complètes des fournisseurs, capture réelle recadrée'),
    'argocd':Screenshot('argocd','assets/p0610-argocd-apps.jpg',1255,531,Rect(15,173,1230,350),1010,'ArgoCD : trois cartes complètes, applications Synced et Healthy'),
    'run':Screenshot('run','assets/p0310-ci-run.jpg',1600,158,Rect(290,75,650,83),1620,'Run CI : commit 62c42e1, staging, Success et durée', (Rect(453,116,49,21),)),
    'acr':Screenshot('acr','assets/p0310-acr-tags.jpg',700,132,Rect(0,0,700,132),1620,'ACR : version 62c42e1…-staging',(Rect(1,65,75,23),)),
    'manifest-author':Screenshot('manifest-author','assets/p0310-manifest-commit.jpg',1600,434,Rect(0,41,820,77),1620,'Commit du ZAWEDNI CI Bot : update backend image to 62c42e1',(Rect(216,87,53,22),)),
    'manifest-image':Screenshot('manifest-image','assets/p0310-manifest-commit.jpg',1600,434,Rect(935,368,665,66),1620,'Ligne ajoutée au manifeste : image du backend 62c42e1…-staging',(Rect(1313,387,49,22),)),
    'pod':Screenshot('pod','assets/p0610-pod-image.jpg',1300,45,Rect(340,0,960,45),1620,'Image du pod staging : version 62c42e1, Ready true',(Rect(730,21,76,20),)),
    'targets':Screenshot('targets','assets/v7-prom-targets.jpg',1876,402,Rect(0,0,1876,402),1620,'Prometheus : cibles IA et backend, toutes deux UP',(Rect(18,10,430,36),Rect(1756,107,48,32),Rect(18,218,490,35),Rect(1756,317,48,32))),
    'logs':Screenshot('logs','assets/v3-grafana-journaux.jpg',1120,540,Rect(15,360,1032,175),1620,'Grafana : lignes complètes de la connexion refusée, horodatage et service conservés'),
    'firing':Screenshot('firing','assets/v3-prom-firing-rule.jpg',1360,132,Rect(0,0,1360,132),1620,'Prometheus : règle ZawedniHighErrorRate, expression, FIRING et maintien de deux minutes'),
    'emails':Screenshot('emails','assets/v3-gmail-rows.jpg',1280,172,Rect(0,0,1280,172),1040,'Gmail : FIRING et RESOLVED, heures locales entièrement visibles'),
}

def _replace(pattern: str, replacement: str, block: str, count: int = 1) -> str:
    output,n=re.subn(pattern,lambda _:replacement,block,count=count,flags=re.S)
    if n!=count: raise ValueError(f'Screenshot source pattern changed: {pattern[:65]}')
    return output

def _replace_image(alt_prefix: str, replacement: str, block: str) -> str:
    # The original alt text may contain a literal >. Keep quoted attribute
    # values intact instead of treating that character as the end of the tag.
    pattern = r"<img\b(?:[^>\"']|\"[^\"]*\"|'[^']*')*>"
    matches=[m for m in re.finditer(pattern,block) if (alt:=re.search(r'alt="([^\"]*)"',m[0])) and alt[1].startswith(alt_prefix)]
    if len(matches)!=1: raise ValueError(f'Expected one screenshot: {alt_prefix}')
    m=matches[0]
    return block[:m.start()]+replacement+block[m.end():]

def polish(slide_id: str, block: str) -> str:
    if slide_id=='apercu':
        block=_replace(r'(<figure class="product-shot"[^>]*>).*?(</figure>)', '<figure class="product-shot" data-anim="rise" data-dur=".7">'+SHOTS['market'].render()+'</figure>',block)
    elif slide_id=='argocd':
        block=_replace(r'<div class="status-crop"[^>]*>.*?</div>',SHOTS['argocd'].render(),block)
        block=block.replace('left:760px; top:812px; width:1010px','left:760px; top:690px; width:1010px')
    elif slide_id=='tracabilite':
        views=[SHOTS['run'].render(),SHOTS['acr'].render(),SHOTS['manifest-author'].render()+'<div class="proof-divider"></div>'+SHOTS['manifest-image'].render(),SHOTS['pod'].render()]
        pattern=r'<div class="crop"[^>]*>\s*<img[^>]*>\s*<div class="mk"[^>]*></div>\s*</div>'
        matches=list(re.finditer(pattern,block,re.S))
        if len(matches)!=4: raise ValueError('Expected four traceability captures')
        for match,replacement in reversed(list(zip(matches,views))): block=block[:match.start()]+replacement+block[match.end():]
        block=block.replace('class="shot" style="width:1400px"','class="shot"')
    elif slide_id=='metriques':
        block=_replace_image('Prometheus :',SHOTS['targets'].render(),block)
        # Remove the four old absolute marks, which used a different image scale.
        block,n=re.subn(r'<div class="mk" style="[^"]*"></div>','',block)
        if n!=4: raise ValueError('Expected four Prometheus highlights')
        block=block.replace('top:672px','top:670px')
    elif slide_id=='journaux':
        block=_replace(r'<div class="capture-window"[^>]*>.*?</div>',SHOTS['logs'].render(),block)
        block=block.replace('left:150px; top:480px; width:1000px','left:150px; top:480px; width:1620px')
        block=block.replace('left:1200px; top:500px; width:570px','left:150px; top:840px; width:650px')
        block=block.replace('left:1200px; top:700px; width:570px','left:840px; top:840px; width:930px')
    elif slide_id=='alerte':
        block=_replace_image('Prometheus : ZawedniHighErrorRate',SHOTS['firing'].render(),block)
        block=_replace_image('Gmail :',SHOTS['emails'].render(),block)
        block=block.replace('left:150px; top:660px; width:1620px','left:150px; top:570px; width:1620px')
        block=block.replace('left:150px; top:815px; width:760px','left:150px; top:795px; width:1040px')
        block=block.replace('left:150px; top:990px; width:1620px','left:150px; top:530px; width:1620px')
    return block
