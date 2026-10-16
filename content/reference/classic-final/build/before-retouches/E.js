{
// ── 33 · The world of the chain with amber markers: each open point sits where its next step will happen.
//    Numbers match the two lists (1–4 sécurité at step 1, 5–8 exploitation at step 2).
const MARKS = [
  [1, 1, 740, 606], [1, 1, 890, 606],   // Semgrep and Checkov gates
  [2, 1, 522, 665],                     // branch protection: the way into GitHub
  [3, 1, 1195, 665],                    // OWASP ZAP: a dynamic test after the build
  [4, 1, 1728, 598],                    // Falco and OPA: inside the cluster
  [5, 2, 1488, 610],                    // production: Argo deploys it
  [6, 2, 1578, 742],                    // database backup, in the cluster
  [7, 2, 1702, 800], [8, 2, 1712, 862], // alerts and logs: supervision
];
Deck.slide('limites', {
  steps: 2, ambient: 24,
  setup(el) {
    el._w = buildWorld(el.querySelector('.world'));
    const g = el.querySelector('.marks');
    MARKS.forEach(([n, step, x, y], i) => {
      const k = svg('g', { 'data-step': step, 'data-anim': 'pop', 'data-delay': .3 + i % 4 * .1 }, g);
      svg('circle', { cx: x, cy: y, r: 20, fill: '#06251a', stroke: '#e39a0b', 'stroke-width': 3, 'stroke-dasharray': '6 5' }, k);
      svg('text', { x, y: y + 7, text: String(n), fill: '#f0b44a', 'font-size': 20, 'font-weight': 700, 'text-anchor': 'middle' }, k);
    });
  },
  frame(el, st) { paintWorld(el._w, st, [.8, .8, .8], 1, 0); },
});

// ── 35 · The recap video. Step 0: poster and band; step 1: it plays, in the audience window only.
//    Exception assumed to the deck-kit rules: a <video> keeps its own clock and cannot be a pure function of st.
//    frame() only starts it; an interval notices when the slide is no longer drawn and rewinds it.
Deck.slide('video', {
  steps: 1, ambient: 5,
  setup(el) {
    const q = new URLSearchParams(location.search);
    const live = el._live = !q.has('presenter') && !q.has('embed') && !q.has('render');   // presenter.sh adds ?pv=…: still live
    const v = el._v = el.querySelector('video');
    el._seen = 0;
    if (!live) { v.muted = true; return; }   // presenter view, previews, exports: poster only, never play()
    // pause() + load(): back to 0 and the poster shows again (if the file cannot load, the poster simply stays)
    el._reset = () => { if (!v.paused || v.currentTime > 0) { v.pause(); v.currentTime = 0; v.load(); } };
    setInterval(() => { if (performance.now() - el._seen > 600) el._reset(); }, 300);
  },
  frame(el, st) {
    if (!el._live || st.rest) return;      // st.rest: the overview draws every slide at its last step
    void st.T;                             // reading the clock keeps frame() running (5 times a second) while the slide is on screen
    el._seen = performance.now();
    const v = el._v;
    if (!st.at(1)) el._reset();
    // only right after the click: landing back on step 1 from the next slide keeps the poster
    else if (v.paused && !v.ended && st.t < 1.5) v.play().catch(() => {});
  },
});

// ── 36 · Bookend: the cover image again, and this time the commit makes the whole trip.
Deck.slide('retour', {
  steps: 1, ambient: 24,
  setup(el) {
    el._w = buildWorld(el.querySelector('.world'));
    const pill = svg('g', { 'data-step': 1, 'data-anim': 'pop', 'data-delay': 4.1 }, el.querySelector('.world'));
    svg('rect', { x: 1530, y: 512, width: 220, height: 40, rx: 20, fill: '#11583a', stroke: C.mint, 'stroke-width': 2 }, pill);
    svg('text', { x: 1640, y: 539, text: 'vérifié : staging', fill: C.mint, 'font-size': 22, 'font-weight': 600, 'text-anchor': 'middle' }, pill);
  },
  frame(el, st) {
    const t = st.p(1, .3, 3.6, ease.inOutCubic);
    paintWorld(el._w, st, [st.p(1, 0, .5), clamp((t - .04) / .08, 0, 1), clamp((t - AT_RAIL_END) / .06, 0, 1)], t, 1);
  },
});
}
