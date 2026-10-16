{
// ── Batch D · slides 27–32: supervision (Prometheus, Grafana), traceability, the sprint 6 verification and the final reading.
const G = { green: '#0d7b3c', greenD: '#083f1f', greenL: '#cfe8d7', amber: '#e39a0b', amberText: '#8f5a00',
            grey: '#9aa89f', redFill: '#c22d2d', bg: '#f4f7f2', white: '#ffffff' };

// 27 · 28 · captures only: builds are declared in the markup.
Deck.slide('prometheus', { steps: 1 });
Deck.slide('grafana', { steps: 1 });

// 29 · one identifier, four links: the current link is the big capture, the earlier ones shrink to pills.
Deck.slide('tracabilite', {
  steps: 4,
  setup(el) {
    const g = el.querySelector('.art');
    // small arrows in the gaps between the pills (pill row: x 150 + k * 415, width 375, y 336..400)
    [1, 2, 3].forEach(k => {
      const x = 150 + k * 415 - 30;
      svg('path', { d: `M${x - 8},368 H${x + 14} M${x + 6},360 L${x + 14},368 L${x + 6},376`, fill: 'none', stroke: G.green, 'stroke-width': 3,
        'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'data-step': k + 1, 'data-anim': 'fade' }, g);
    });
    el._pills = [...el.querySelectorAll('.pill')];
  },
  frame(el, st) {
    el._pills.forEach((p, i) => {
      const past = st.p(i + 2, 0, .5, ease.outCubic);
      p.style.background = mix(G.green, G.greenL, past);
      p.style.color = mix(G.white, G.greenD, past);
    });
  },
});

// 30 · the question, then three gestures; a mini pipeline goes grey (read), red (break on purpose), green (repair).
Deck.slide('sprint6', {
  steps: 3,
  setup(el) {
    const g = el.querySelector('.art'), Y = 530;
    const T = [['Lire', 'la configuration du contrôle'], ['Casser exprès', 'ajouter une erreur exprès'], ['Réparer', 'retirer l’erreur']];
    el._cards = T.map(([t, s], i) => {
      const x = 150 + i * 560, c = svg('g', { 'data-step': i + 1, 'data-anim': 'rise' }, g);
      const r = svg('rect', { x, y: Y, width: 500, height: 170, rx: 24, fill: G.white, stroke: C.line, 'stroke-width': 2.5 }, c);
      svg('circle', { cx: x + 56, cy: Y + 58, r: 28, fill: G.green }, c);
      svg('text', { x: x + 56, y: Y + 68, text: String(i + 1), fill: G.white, 'font-size': 28, 'font-weight': 700, 'text-anchor': 'middle' }, c);
      svg('text', { x: x + 104, y: Y + 70, text: t, fill: C.ink, 'font-size': 34, 'font-weight': 600 }, c);
      svg('text', { x: x + 36, y: Y + 134, text: s, fill: C.mutedL, 'font-size': 28 }, c);
      return r;
    });
    svg('path', { d: `M1520,${Y + 180} C1520,${Y + 240} 400,${Y + 240} 400,${Y + 180}`, fill: 'none', stroke: C.mutedL, 'stroke-width': 3, 'stroke-dasharray': '9 9', 'data-step': 3, 'data-anim': 'draw', 'data-delay': .8 }, g);
    svg('path', { d: `M388,${Y + 196} L400,${Y + 180} L412,${Y + 196}`, fill: 'none', stroke: C.mutedL, 'stroke-width': 3, 'stroke-linecap': 'round', 'data-step': 3, 'data-anim': 'fade', 'data-delay': 1.8 }, g);
    const pipe = svg('g', { 'data-step': 1, 'data-anim': 'fade', 'data-delay': .3 }, g), PY = 820;
    svg('text', { x: 640, y: PY + 10, text: 'le pipeline', fill: C.mutedL, 'font-size': 26, 'text-anchor': 'end' }, pipe);
    svg('line', { x1: 690, x2: 1250, y1: PY, y2: PY, stroke: C.line, 'stroke-width': 4 }, pipe);
    el._blocks = [0, 1, 2, 3, 4, 5, 6].map(k => svg('rect', { x: 668 + k * 90, y: PY - 28, width: 56, height: 56, rx: 12, fill: G.grey }, pipe));
    [['gris : on lit, rien ne change', C.mutedL, 1], ['rouge : le pipeline doit échouer', C.redText, 2], ['vert : le pipeline doit repasser', G.greenD, 3]]
      .forEach(([t, col, n]) => svg('text', { x: 960, y: PY + 100, text: t, fill: col, 'font-size': 28, 'font-weight': 600, 'text-anchor': 'middle',
        'data-step': n, 'data-anim': 'fade', 'data-delay': .5, ...(n < 3 ? { 'data-out': n + 1 } : {}) }, g));
  },
  frame(el, st) {
    const red = st.p(2, .3, .5) * (1 - st.p(3, .3, .5)), green = st.p(3, .3, .5);
    const col = st.at(3) ? mix('#d93f3f', G.green, green) : mix(G.grey, '#d93f3f', red);   // mix() takes hex only: never nest it
    el._blocks.forEach((b, k) => { b.style.fill = k === 3 ? col : mix(G.grey, G.green, green); });
    el._cards.forEach((r, i) => {
      const on = st.p(i + 1, 0, .4) * (1 - st.p(i + 2, 0, .4));
      r.style.stroke = mix(C.line, G.green, on);
      r.style.strokeWidth = lerp(2.5, 4, on);
    });
  },
});

// 31 · the real backend pipeline: log4j 2.14.1 stops at Dependency-Check, then goes away and all turns green.
const BACK = [['Gitleaks', 'secrets'], ['Tests', 'JUnit'], ['Dependency-|Check', 'bibliothèques'], ['SonarCloud', 'qualité'],
              ['Docker|build', 'construction'], ['Trivy', 'image'], ['ACR push', 'publication']];
Deck.slide('log4j', {
  steps: 2,
  setup(el) {
    const g = el.querySelector('.art'), RY = 660, DC = 2;
    svg('line', { x1: 150, x2: 1770, y1: RY, y2: RY, stroke: C.line, 'stroke-width': 4 }, g);
    el._lit = svg('line', { x1: 150, x2: 150, y1: RY, y2: RY, stroke: G.green, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    el._cards = BACK.map(([name, role], i) => {
      const x = 150 + i * 238, c = svg('g', {}, g);
      const r = svg('rect', { x, y: 390, width: 190, height: 200, rx: 22, fill: G.white, stroke: C.line, 'stroke-width': 2.5 }, c);
      svg('text', { x: x + 22, y: 432, text: String(i + 1), fill: C.mutedL, 'font-size': 22, 'font-weight': 600, 'font-family': 'var(--mono)' }, c);
      const lines = name.split('|');
      lines.forEach((t, k) => svg('text', { x: x + 95, y: 492 + k * 30 - (lines.length - 1) * 15, text: t, fill: C.ink, 'font-size': 24, 'font-weight': 600, 'text-anchor': 'middle' }, c));
      svg('text', { x: x + 95, y: 558, text: role, fill: C.mutedL, 'font-size': 22, 'text-anchor': 'middle' }, c);
      const tick = svg('circle', { cx: x + 95, cy: RY, r: 9, fill: G.white, stroke: C.line, 'stroke-width': 3 }, g);
      return { x: x + 95, r, c, tick };
    });
    el._stop = el._cards[DC].x;
    el._pkg = svg('g', {}, g);
    svg('rect', { x: -92, y: RY - 32, width: 184, height: 64, rx: 16, fill: G.redFill }, el._pkg);
    svg('text', { x: 0, y: RY + 8, text: 'log4j 2.14.1', fill: G.white, 'font-size': 24, 'font-weight': 700, 'text-anchor': 'middle' }, el._pkg);
    const cx = el._stop;
    svg('path', { d: `M${cx + 52},${380} l30,30 m0,-30 l-30,30`, stroke: C.red, 'stroke-width': 8, 'stroke-linecap': 'round', 'data-step': 1, 'data-anim': 'pop', 'data-delay': 1.7, 'data-out': 2 }, g);
    const m1 = svg('g', { 'data-step': 1, 'data-anim': 'rise', 'data-delay': 1.9, 'data-out': 2 }, g);
    svg('text', { x: 150, y: 780, text: 'CVE-2021-44228 (Log4Shell) : le pipeline devient rouge', fill: C.redText, 'font-size': 30, 'font-weight': 600 }, m1);
    svg('text', { x: 150, y: 828, text: 'Rien n’est publié.', fill: C.ink, 'font-size': 28 }, m1);
    const m2 = svg('g', { 'data-step': 2, 'data-anim': 'rise', 'data-delay': 1.6 }, g);
    svg('text', { x: 150, y: 780, text: 'Bibliothèque retirée : le pipeline redevient vert', fill: G.greenD, 'font-size': 30, 'font-weight': 600 }, m2);
    svg('text', { x: 150, y: 828, text: 'Le rouge venait de log4j.', fill: C.ink, 'font-size': 28 }, m2);
    el._dot = svg('circle', { cy: RY, r: 15, fill: G.green, stroke: G.white, 'stroke-width': 4 }, g);
  },
  frame(el, st) {
    const p1 = st.p(1, .2, 1.5, ease.outCubic), p2 = st.p(2, .3, 1.6, ease.inOutCubic);
    const head = lerp(150, el._stop, p1), run = lerp(el._stop, 1770, p2), x = st.at(2) ? run : head;
    el._pkg.setAttribute('transform', `translate(${head},0)`);
    el._pkg.style.opacity = st.p(1, 0, .3) * (1 - st.p(2, 0, .4));
    el._lit.setAttribute('x2', st.at(1) ? clamp(x, 150, 1770) : 150);
    el._dot.setAttribute('cx', run); el._dot.style.opacity = st.at(2) && p2 < 1 ? 1 : 0;
    const red = st.p(1, 1.5, .3) * (1 - st.p(2, .1, .4));
    el._cards.forEach((c, i) => {
      const passed = st.at(1) ? clamp((x - c.x + 30) / 50, 0, 1) : 0;
      const ok = i === 2 ? (st.at(2) ? passed : 0) : passed;
      const col = i !== 2 ? mix(C.line, G.green, ok) : st.at(2) ? mix('#d93f3f', G.green, ok) : mix(C.line, '#d93f3f', red);
      c.r.style.stroke = col;
      c.r.style.strokeWidth = lerp(2.5, 4, Math.max(ok, i === 2 ? red : 0));
      c.tick.style.fill = i === 2 && !st.at(2) ? mix(G.white, '#d93f3f', red) : mix(G.white, G.green, ok);
      c.c.style.opacity = st.at(1) && i > 2 ? lerp(.45, 1, ok) : 1;
    });
  },
});

// 32 · six analyses, neutral at first; step 1 colours each by its status (green tested · light green configured · amber report).
const LOOK = { ok: [G.green, G.green, G.white, '#e6f3ea'], nt: [G.greenL, G.green, C.ink, G.greenD], rp: [G.white, G.amber, C.ink, G.amberText] };
Deck.slide('resultats', {
  steps: 2,
  setup(el) {
    el._an = [...el.querySelectorAll('.an')].map(d => ({ d, k: d.dataset.k, sonar: d.hasAttribute('data-sonar'), h: d.querySelector('h3'), p: d.querySelector('p') }));
  },
  frame(el, st) {
    const on = st.p(1, 0, .6, ease.outCubic), sq = st.p(2, .2, .5, ease.outCubic);
    for (const a of el._an) {
      const [bg, bd, ink, sub] = LOOK[a.k];
      a.d.style.background = mix(G.white, bg, on);
      a.d.style.borderColor = mix(C.line, bd, on);
      a.d.style.boxShadow = a.sonar ? `0 0 0 ${lerp(0, 5, sq)}px ${G.green}` : 'none';
      a.h.style.color = mix(C.ink, ink, on);
      a.p.style.color = sub;
      a.p.style.opacity = on;
    }
  },
});
}
