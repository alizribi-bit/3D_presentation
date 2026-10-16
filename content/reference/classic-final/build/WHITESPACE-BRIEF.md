# Brief: use the empty space, make the content bigger

Deck: `~/Desktop/zawedni-video-pfe/soutenance/deck.html`, a deck-kit deck (runtime docs in `~/.claude/skills/deck-kit/`, read `04-slide-design.md` and `09-typography.md` quickly). Canvas is 1920×1080; every slide has a kicker + h2 title at the top (padding 110px 150px 90px), and the content below is absolutely positioned in px (HTML) or drawn in SVG by JS (`build/<X>.js`, `Deck.slide(id, {setup, frame})`).

The user (presenting a PFE defence on a projector) says: "a lot of white space; make use of it or make the fonts bigger". On most slides the content is small and sits in the upper part, the lower third is empty, and the text inside cards/tables/diagrams is 18–24px, which is hard to read on a projector.

## Your job (only your batch)

You own ONE batch: `build/<X>.sections.html` (sections + their `<style>`) and `build/<X>.js` (if present). Edit only those two files. Never edit `deck.html`, `notes.py`, `SCRIPT.md`, other batches or the runtime.

For each slide of your batch:

1. **Fill the content area**: the content block should span from about 40px under the title (titles are 1 or 2 lines: content starts around y=300–360) down to about y=980–1000 (leave room for a `.src`/caption line at bottom ~1010–1024 if the slide has one), and use the width x=150→1770. Enlarge diagrams, cards, screenshots, charts, tables to fill it. Spread rows/columns, increase gaps proportionally.
2. **Bigger text**: minimum sizes on the 1920 canvas — body/card text ≥ 28px, small labels/captions/axis labels ≥ 22px (captions `.src` can stay 21–22px), card titles ≥ 34px, table cells ≥ 26px, chips ≥ 24px, mono code in small boxes ≥ 24px. Where a slide is very dense (tables, reserve slides), go as big as fits without overlap.
3. Keep everything else: the same words (do NOT change any text content), the same elements, the same `data-step` / `data-anim` / `data-stagger` / `data-delay` build order, the same colours/classes semantics, the notes `<aside class="notes">` untouched, ids untouched, `data-pos`/`data-transition` attributes untouched.
4. In JS (`setup`/`frame`), SVG coordinates and font sizes are hardcoded: scale them consistently (positions, sizes, stroke widths, font-size attributes). Keep the animation logic (`st.p(...)` timings) identical.
5. Night slides with the 3-zone "chain map" (laptop → GitHub Actions → Azure, used on slides 1, 13, 21, 39, 40) must keep that map's geometry and position unchanged (camera/zoom continuity, slide 22 zooms from a point on slide 21: data-origin "850 665"). You may enlarge text around the map (captions, chip labels) but not move/resize the map's three zones.
6. Code slides (`data-layout="code-side"`): the code block is laid out by the plugin; you may enlarge the side content (claims, figures) and the code font only via the existing variables if any; do not break the layout.
7. Do not add or remove slides, steps or animations. No new colours. No emojis.

## How to test (on a copy, never on deck.html)

```bash
cd ~/Desktop/zawedni-video-pfe/soutenance
python3 build/merge.py --out build/deck-<X>.html --only <X>     # test copy; other batches' CSS is absent in it, ignore their slides
K=~/.claude/skills/deck-kit
node $K/export/deck.mjs check build/deck-<X>.html 2>&1 | grep -E "^\s*(err|warn)\s+(<your slide numbers>)\b" ; node $K/export/deck.mjs check build/deck-<X>.html | tail -1
node build/rest.mjs build/deck-<X>.html /tmp/<scratch>/<X> <first> <last>   # last-step PNG per slide + 12-slide grids; LOOK at them (Read the PNGs)
```

`check` must report **0 errors on your slides** (overlap, overflow, off-canvas, contrast). Density warnings are fine. Also look at intermediate steps for slides with builds: `node $K/export/deck.mjs still build/deck-<X>.html <slide>.<step> out.png` (or `deck.mjs strip`) to make sure nothing overlaps mid-build (`check --timeline` also works: `node $K/export/deck.mjs check --timeline build/deck-<X>.html`).

Then delete your `build/deck-<X>.html` test copy.

## Report back (short)

Per slide: what you enlarged (one line), and the final `check` line for your slides. Mention anything you could not fit.
