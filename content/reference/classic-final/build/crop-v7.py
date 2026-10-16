# v7 assets: the admin review alone (parcours-app click 1) and real <img> crops for the metrics slide.
# python3 build/crop-v7.py   (sources are read, never modified; crops only, nothing redrawn or completed)
from PIL import Image
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
SHOTS = os.path.expanduser('~/Pictures/Screenshots/')
def save(im, name, w=None):
    im = im.convert('RGB')
    if w and im.width != w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    path = f'assets/v7-{name}.jpg'
    im.save(path, quality=90, optimize=True); print(path, im.size)
# admin: the evaluations table without the side menu and the cut last row (the header with the e-mail stays out, as in v3)
save(Image.open('assets/originals-v3/adm-submissions.png').crop((445, 137, 2101, 1233)), 'adm-revue', w=1400)
# Prometheus 06/10 (same source as p0610-prometheus-targets): the two target cards, without the search bar and the info banner
save(Image.open(SHOTS + 'B4-prometheus-targets.png').crop((22, 333, 1898, 735)), 'prom-targets')
# Grafana 06/10 (same source as p0610-grafana): the CPU panel and the memory panel, each with its legend.
# The memory panel is cut at the bottom in the original screenshot itself: nothing is added.
g = Image.open(SHOTS + 'B5-grafana-backend.png.png')
save(g.crop((370, 247, 1830, 530)), 'grafana-cpu')
save(g.crop((370, 833, 1830, 1077)), 'grafana-mem')
