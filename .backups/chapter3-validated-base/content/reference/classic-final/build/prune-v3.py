# One-off for v3: drop slides that left the deck from deck.html and the fragments (sections + Deck.slide blocks).
import re, glob, os
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
IDS = re.search(r"IDS = '''(.*?)'''", open('notes.py').read(), re.S).group(1).split()
def drop_js(s):
    out, i = '', 0
    for m in re.finditer(r"([ \t]*)Deck\.slide\('([^']+)'", s):
        if m.group(2) in IDS or m.start() < i: continue
        j = s.index('{', m.end()); depth = 0
        for k in range(j, len(s)):
            depth += {'{': 1, '}': -1}.get(s[k], 0)
            if depth == 0: break
        end = s.index(';', k) + 1
        if s[end:end + 1] == '\n': end += 1
        out += s[i:m.start()]; i = end
        print('  js -', m.group(2))
    return out + s[i:]
def drop_sections(s):
    def f(m):
        if m.group(2) in IDS: return m.group(0)
        print('  section -', m.group(2)); return ''
    return re.sub(r'(?:[ \t]*<!--[^\n]*-->\n)?([ \t]*)<section class="slide[^"]*" id="([^"]+)".*?</section>\n\n?', f, s, flags=re.S)
for p in sorted(glob.glob('build/*.sections.html')) + ['deck.html']:
    print(p); s = open(p).read(); s = drop_sections(s)
    if p == 'deck.html':
        a = s.index('<script>\nconst { svg, ease'); b = s.index('</script>', a)
        s = s[:a] + drop_js(s[a:b]) + s[b:]
        s = re.sub(r'<script data-batch="F">\n.*?</script>\n', '', s, flags=re.S)
    open(p, 'w').write(s)
for p in sorted(glob.glob('build/*.js')):
    print(p); s = open(p).read(); open(p, 'w').write(drop_js(s))
