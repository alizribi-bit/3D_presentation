"""Compatibility rows derived from the short model, never a second speech source."""
try:
    from .content_20min import PARTS, SLIDES
except ImportError:
    from content_20min import PARTS, SLIDES
SlideRow = tuple[str,str,str,int,str,str,str,str]
R: list[SlideRow] = [
    (s.id, PARTS[s.part] if i==0 or SLIDES[i-1].part!=s.part else '',
     s.title,s.steps,'Schéma/capture ou synthèse','camera','du code au service',s.note)
    for i,s in enumerate(SLIDES)
]
if __name__=='__main__':
    from build_20min import build
    build()
