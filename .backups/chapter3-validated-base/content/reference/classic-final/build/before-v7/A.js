{
// ── BMC focus ring (also used on the analyses slide): fades in with one small pulse (x1.05), then stays still.
Deck.anim('ring', { dur: .9, curve: Deck.ease.inOutCubic, f: (el, e) => ({ opacity: Math.min(1, e * 3), transform: `scale(${1 + .05 * Math.sin(Math.PI * e)})` }) });
// ── batch A: context slides are pure HTML builds; only the DevSecOps loop is drawn here.
// The loop is a lemniscate: development on the left lobe, operations on the right, security at the crossing.
// Travel (t growing): centre → Planifier → Coder → Construire et tester → centre → Livrer et déployer → Exploiter → Superviser → centre.
const IX = 960, IY = 610, IA = 520, ISY = 1.15;
const inf = t => { const s = Math.sin(t), c = Math.cos(t), d = 1 + s * s; return { x: IX + IA * c / d, y: IY + ISY * IA * s * c / d }; };
const infPath = (a, b, n = 90) => Array.from({ length: n + 1 }, (_, i) => inf(a + (b - a) * i / n)).map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('');
const PI = Math.PI;
Deck.slide('devsecops', {
  steps: 1, ambient: 30,
  setup(el) {
    const g = el.querySelector('.art');
    // the two lobes as thick bands, each drawn in on entry
    svg('path', { d: infPath(.5 * PI, 1.5 * PI), fill: 'none', stroke: C.green, 'stroke-width': 34, 'stroke-linecap': 'round', 'data-anim': 'draw', 'data-delay': .15, 'data-dur': 1.1 }, g);
    svg('path', { d: infPath(1.5 * PI, 2.5 * PI), fill: 'none', stroke: '#083f1f', 'stroke-width': 34, 'stroke-linecap': 'round', 'data-anim': 'draw', 'data-delay': .7, 'data-dur': 1.1 }, g);
    // direction: white chevrons on the band
    [.9, 1.1, 1.9, .1, .65, 1.35].forEach((k, i) => {
      const a = inf(k * PI - .01), b = inf(k * PI + .01), p = inf(k * PI), ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / PI;
      svg('path', { d: 'M-7,-9 L4,0 L-7,9', fill: 'none', stroke: '#ffffff', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        transform: `translate(${p.x.toFixed(1)},${p.y.toFixed(1)}) rotate(${ang.toFixed(1)})`, 'data-anim': 'fade', 'data-delay': 1.5 + i * .05 }, g);
    });
    // the feedback (step 1): from Superviser, through the crossing, back to Planifier
    el._fb = svg('path', { d: infPath(.2 * PI, .8 * PI, 60), fill: 'none', stroke: C.mint, 'stroke-width': 12, 'stroke-linecap': 'round', pathLength: 1 }, g);
    // stages: a marker on the band, the label outside the loop
    const ST = [[.80, 'Planifier', 'middle', -1], [1, 'Coder', 'end', 0], [1.20, 'Construire et tester', 'middle', 1],
                [1.80, 'Livrer et déployer', 'middle', -1], [2, 'Exploiter', 'start', 0], [.20, 'Superviser', 'middle', 1]];
    ST.forEach(([k, name, anchor, v], i) => {
      const p = inf(k * PI), dev = k > .5 && k < 1.5;
      const b = svg('g', { 'data-anim': 'pop', 'data-delay': (dev ? .5 : 1.05) + (i % 3) * .14 }, g);
      svg('circle', { cx: p.x, cy: p.y, r: 13, fill: '#ffffff', stroke: dev ? C.green : '#083f1f', 'stroke-width': 5 }, b);
      const x = p.x + (anchor === 'end' ? -40 : anchor === 'start' ? 40 : 0), y = p.y + (v < 0 ? -36 : v > 0 ? 56 : 10);
      svg('text', { x, y, text: name, fill: C.ink, 'font-size': 28, 'font-weight': 600, 'text-anchor': anchor, 'data-anim': 'fade', 'data-delay': (dev ? .6 : 1.15) + (i % 3) * .14 }, g);
    });
    // the two sides, inside their lobe
    [[IX - .58 * IA, 'Développement', 'Préparer et vérifier', C.green, .35], [IX + .58 * IA, 'Exploitation', 'Déployer et observer', '#083f1f', .9]].forEach(([x, t, s, col, d]) => {
      svg('text', { x, y: IY - 4, text: t, fill: col, 'font-size': 34, 'font-weight': 700, 'text-anchor': 'middle', 'data-anim': 'fade', 'data-delay': d }, g);
      svg('text', { x, y: IY + 34, text: s, fill: C.mutedL, 'font-size': 24, 'text-anchor': 'middle', 'data-anim': 'fade', 'data-delay': d + .1 }, g);
    });
    // security at the crossing
    const sg = svg('g', { 'data-anim': 'pop', 'data-delay': 1.35 }, g);
    svg('circle', { cx: IX, cy: IY, r: 50, fill: '#ffffff', stroke: C.mint, 'stroke-width': 6 }, sg);
    svg('path', { d: shield(IX, IY, 1.7), fill: C.green, stroke: '#083f1f', 'stroke-width': 2.5 }, sg);
    svg('path', { d: `M${IX - 9},${IY + 1} l6,6 l12,-13`, fill: 'none', stroke: '#ffffff', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, sg);
    svg('path', { d: `M${IX},${IY - 205} V${IY - 58}`, fill: 'none', stroke: C.mutedL, 'stroke-width': 2, 'stroke-dasharray': '5 6', 'data-anim': 'fade', 'data-delay': 1.45 }, g);
    svg('text', { x: IX, y: IY - 250, text: 'Sécurité', fill: C.ink, 'font-size': 30, 'font-weight': 700, 'text-anchor': 'middle', 'data-anim': 'fade', 'data-delay': 1.45 }, g);
    svg('text', { x: IX, y: IY - 220, text: 'tout au long du cycle', fill: C.mutedL, 'font-size': 22, 'text-anchor': 'middle', 'data-anim': 'fade', 'data-delay': 1.5 }, g);
    svg('text', { x: IX, y: IY + 320, text: 'Les observations reviennent vers le développement pour préparer les corrections', fill: '#0a6a33', 'font-size': 25, 'font-weight': 600, 'text-anchor': 'middle', 'data-step': 1, 'data-anim': 'fade', 'data-delay': .7 }, g);
    // the change that travels the loop (ambient, frozen at Planifier in rest frames)
    el._halo = svg('circle', { r: 20, fill: C.mint, 'fill-opacity': .3 }, g);
    el._dot = svg('circle', { r: 9, fill: '#ffffff', stroke: C.mint, 'stroke-width': 4 }, g);
  },
  frame(el, st) {
    const f = st.p(1, 0, 1.1, ease.inOutCubic);
    el._fb.style.strokeDasharray = `${f} 1`;
    el._fb.style.opacity = f > 0 ? 1 : 0;
    const seen = st.p(0, 1.6, .5, ease.outCubic), u = st.rest ? 0 : (st.T * .055) % 1;
    const p = inf((.8 + 2 * u) * PI);
    for (const c of [el._dot, el._halo]) { c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.style.opacity = seen; }
  },
});
}
