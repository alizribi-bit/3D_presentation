# SCRIPT.md -> deck.html: copy each slide's title and speech (one <p data-step> per [clic]) into its section.
# Run after any SCRIPT.md change: python3 notes.py
import re, html
IDS = '''couverture zawedni manques question perimetre scrum approches devsecops chaine docker terraform environnements
parcours dix-pipelines huit-etapes gitleaks dependency-check trivy regle-equipe controle-publication gitops
argocd routage isolation stockage secrets prometheus grafana tracabilite sprint6 log4j resultats limites bilan
video retour r-ip r-postgres r-rollback r-choix r-matrice r-mobile r-exigences r-etat'''.split()
rows = {int(m.group(1)): [c.strip() for c in m.group(0).split('|')[1:-1]]
        for m in re.finditer(r'^\| (\d+) \|.*$', open('SCRIPT.md').read(), re.M)}
assert len(rows) == len(IDS), (len(rows), len(IDS))
s = open('deck.html').read()
done = []
for n, sid in enumerate(IDS, 1):
    if f'id="{sid}"' not in s: continue
    parts = rows[n][7].split(' [clic] ')
    ps = [f'      <p>{html.escape(parts[0], quote=False)}</p>'] + \
         [f'      <p data-step="{i}">{html.escape(t, quote=False)}</p>' for i, t in enumerate(parts[1:], 1)]
    sec = re.compile(r'(<section class="slide[^"]*" id="%s"[^>]*>.*?<aside class="notes">\n).*?(    </aside>)' % re.escape(sid), re.S)
    s, k = sec.subn(lambda m: m.group(1) + '\n'.join(ps) + '\n' + m.group(2), s, count=1); assert k == 1, sid
    tit = re.compile(r'(<section class="slide[^"]*" id="%s"[^>]*>(?:(?!</section>).)*?<h[12][^>]*>)(.*?)(</h[12]>)' % re.escape(sid), re.S)
    s, k = tit.subn(lambda m: m.group(1) + html.escape(rows[n][2], quote=False) + m.group(3), s, count=1)
    done.append(f'{n}:{sid}')
open('deck.html', 'w').write(s)
print(len(done), 'slides synced:', ' '.join(done))
