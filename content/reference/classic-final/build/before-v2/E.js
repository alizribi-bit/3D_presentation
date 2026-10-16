{
// ── 38 · The counter falls from 6 to 3 on the staging path; pull requests and main add SonarCloud (4).
Deck.slide('compteur', {
  setup(el) { el._n = el.querySelector('.n6'); },
  frame(el, st) {
    el._n.textContent = String(Math.round(lerp(6, 3, st.p(0, .5, 1.2, ease.inOutCubic))));
  },
});

// ── 39 · The world of the chain, with four amber holes: what the check found missing.
const HOLES = [
  { t: 'Protection des branches', lx: 400, ly: 380, x: 522, y: 665 },
  { t: 'OWASP ZAP (test dynamique)', lx: 960, ly: 380, x: 1150, y: 665 },
  { t: 'Falco et OPA', lx: 1440, ly: 380, x: 1600, y: 600 },
  { t: 'Métriques applicatives', lx: 1640, ly: 965, x: 1640, y: 885 },
];
Deck.slide('manques-ouverts', {
  steps: 2, ambient: 24,
  setup(el) {
    el._w = buildWorld(el.querySelector('.world'));
    const g = el.querySelector('.holes');
    HOLES.forEach((h, i) => {
      const k = svg('g', { 'data-step': 1, 'data-anim': 'pop', 'data-delay': .15 + i * .12 }, g);
      const up = h.ly < h.y;
      svg('line', { x1: h.x, y1: h.y + (up ? -22 : 22), x2: h.x, y2: h.ly + (up ? 14 : -30), stroke: '#e39a0b', 'stroke-width': 2.5, 'stroke-dasharray': '6 7' }, k);
      if (up) svg('line', { x1: Math.min(h.x, h.lx), x2: Math.max(h.x, h.lx), y1: h.ly + 14, y2: h.ly + 14, stroke: '#e39a0b', 'stroke-width': 2.5, 'stroke-dasharray': '6 7' }, k);
      svg('circle', { cx: h.x, cy: h.y, r: 22, fill: '#06251a', stroke: '#e39a0b', 'stroke-width': 3, 'stroke-dasharray': '7 6' }, k);
      svg('text', { x: h.x, y: h.y + 9, text: '!', fill: '#f0b44a', 'font-size': 26, 'font-weight': 700, 'text-anchor': 'middle' }, k);
      svg('text', { x: h.lx, y: h.ly, text: h.t, fill: '#f0b44a', 'font-size': 24, 'font-weight': 600, 'text-anchor': 'middle' }, k);
    });
  },
  frame(el, st) { paintWorld(el._w, st, [.8, .8, .8], 1, 0); },
});

// ── 40 · Bookend: the cover image again, and this time the commit makes the whole trip.
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

// ── 42 · Three horizons on a road; each click lights the road up to the next milestone.
const MILES = [420, 960, 1500];
Deck.slide('suite', {
  steps: 3,
  setup(el) {
    const g = el.querySelector('.road');
    svg('line', { x1: 150, x2: 1770, y1: 560, y2: 560, stroke: C.line, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    el._lit = svg('line', { x1: 150, x2: 150, y1: 560, y2: 560, stroke: '#e39a0b', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    el._m = MILES.map((x, i) => {
      const c = svg('circle', { cx: x, cy: 560, r: 20, fill: '#ffffff', stroke: C.line, 'stroke-width': 4 }, g);
      svg('line', { x1: x, x2: x, y1: 584, y2: 620, stroke: C.line, 'stroke-width': 3 }, g);
      return c;
    });
  },
  frame(el, st) {
    let x = 150;
    MILES.forEach((m, i) => { x = lerp(x, m, st.p(i + 1, 0, .8, ease.inOutCubic)); });
    el._lit.setAttribute('x2', x);
    el._m.forEach((c, i) => {
      const on = st.p(i + 1, .6, .3);
      c.style.fill = mix('#ffffff', '#e39a0b', on);
      c.style.stroke = mix(C.line, '#e39a0b', on);
    });
  },
});
}
