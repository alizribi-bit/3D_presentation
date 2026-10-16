# SCRIPT.md -> deck.html: copy each slide's title and speech (one <p data-step> per [clic]) into its section.
# Run after any SCRIPT.md change: python3 notes.py
import re, html
IDS = '''couverture sommaire startup probleme reponse acteurs modele ch2 outils-dev plateforme sequence parcours-app
ch3 outils-infra outils-livraison devsecops architecture routage isolation secrets ch4 chaine dix-pipelines controle-publication
tests analyses blocage log4j argocd tracabilite ch5 supervision metriques journaux alerte validation ch6 bilan limites retour'''.split()
rows = {int(m.group(1)): [c.strip() for c in m.group(0).split('|')[1:-1]]
        for m in re.finditer(r'^\| (\d+) \|.*$', open('SCRIPT.md').read(), re.M)}
assert len(rows) == len(IDS), (len(rows), len(IDS))
s = open('deck.html').read()
done = []
for n, sid in enumerate(IDS, 1):
    if f'id="{sid}"' not in s: continue
    parts = rows[n][7].split(' [clic] ')
    # [lire] « … » = a projected sentence Ali reads as it is: shown as a cue, never said
    say = lambda t: html.escape(t, quote=False).replace('[lire] ', '<b>À lire :</b> ')
    ps = [f'      <p>{say(parts[0])}</p>'] + \
         [f'      <p data-step="{i}">{say(t)}</p>' for i, t in enumerate(parts[1:], 1)]
    sec = re.compile(r'(<section class="slide[^"]*" id="%s"[^>]*>.*?<aside class="notes">\n).*?(    </aside>)' % re.escape(sid), re.S)
    s, k = sec.subn(lambda m: m.group(1) + '\n'.join(ps) + '\n' + m.group(2), s, count=1); assert k == 1, sid
    tit = re.compile(r'(<section class="slide[^"]*" id="%s"[^>]*>(?:(?!</section>).)*?<h[12][^>]*>)(.*?)(</h[12]>)' % re.escape(sid), re.S)
    s, k = tit.subn(lambda m: m.group(1) + html.escape(rows[n][2], quote=False) + m.group(3), s, count=1)
    done.append(f'{n}:{sid}')
open('deck.html', 'w').write(s)
print(len(done), 'slides synced:', ' '.join(done))
