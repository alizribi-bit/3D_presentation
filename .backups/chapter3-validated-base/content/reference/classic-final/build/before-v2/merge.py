# Merge slide fragments into a deck.
#   build/<batch>.sections.html : <section> elements (ids from notes.py IDS)
#   build/<batch>.js            : Deck.slide(...) calls wrapped in one { } block (no top-level const)
# python3 build/merge.py --out build/deck-A.html --only A   (test one batch on a copy)
# python3 build/merge.py --out deck.html                    (merge every batch into the deck)
import re, sys, glob, os, argparse
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
sys.path.insert(0, '.')
IDS = re.search(r"IDS = '''(.*?)'''", open('notes.py').read(), re.S).group(1).split()
ap = argparse.ArgumentParser(); ap.add_argument('--out', required=True); ap.add_argument('--only', nargs='*'); ap.add_argument('--base', default='deck.html')
a = ap.parse_args()
s = open(a.base).read()
batches = sorted(os.path.basename(p).split('.')[0] for p in glob.glob('build/*.sections.html'))
if a.only: batches = [b for b in batches if b in a.only]
END = '\n</div>\n\n<script id="deck-kit-js">'
assert END in s
for b in batches:
    frag = open(f'build/{b}.sections.html').read()
    for m in re.finditer(r'(?:[ \t]*<!--[^\n]*-->\n)?[ \t]*<section class="slide[^"]*" id="([^"]+)".*?</section>\n', frag, re.S):
        sid, block = m.group(1), m.group(0)
        assert sid in IDS, sid
        if f'id="{sid}"' in s: s = re.sub(r'\n[ \t]*<section class="slide[^"]*" id="%s".*?</section>\n' % re.escape(sid), '\n', s, flags=re.S)
        k = IDS.index(sid)
        later = [m2 for m2 in re.finditer(r'\n([ \t]*<!--[^\n]*-->\n)?[ \t]*<section class="slide[^"]*" id="([^"]+)"', s) if IDS.index(m2.group(2)) > k]
        at = later[0].start() + 1 if later else s.index(END) + 1
        s = s[:at] + block + '\n' + s[at:]
    js = f'build/{b}.js'
    if os.path.exists(js):
        tag = f'<script data-batch="{b}">\n'
        s = re.sub(r'<script data-batch="%s">\n.*?</script>\n' % re.escape(b), '', s, flags=re.S)
        i = s.rindex("\n</body>"); s = s[:i] + "\n" + tag + open(js).read().rstrip() + "\n</script>" + s[i:]
# Slide CSS lives in <head>: exports render one slide at a time, so a <style> inside a section would be lost for its siblings.
head_end = s.index('</head>')
deck_start = s.index('<div class="deck"')
body = s[deck_start:]
css = re.findall(r'[ \t]*<style>\n?(.*?)</style>\n?', body, re.S)
body = re.sub(r'[ \t]*<style>\n?.*?</style>\n?', '', body, flags=re.S)
s = s[:deck_start] + body
s = re.sub(r'<style id="deck-slides-css">.*?</style>\n', '', s, flags=re.S)
if css:
    i = s.index('</head>')
    # the vector PDF clones each slide and renames ids to <id>__pN: match both
    css = [re.sub(r'#([a-z0-9-]+)(?![\w-])', lambda m: f':is(#{m[1]},[id^="{m[1]}__p"])' if m[1] in IDS else m[0], c) for c in css]
    s = s[:i] + '<style id="deck-slides-css">\n' + '\n'.join(c.rstrip() for c in css) + '\n</style>\n' + s[i:]
open(a.out, 'w').write(s)
print('merged', batches, '->', a.out)
