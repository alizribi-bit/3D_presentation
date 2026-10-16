{
// ── Batch D · slides 31–37: supervision, its limits, and the sprint 6 verification.
const G = { green: '#0d7b3c', greenD: '#083f1f', greenL: '#cfe8d7', amber: '#e39a0b', amberText: '#8f5a00',
            grey: '#9aa89f', redFill: '#c22d2d', bg: '#f4f7f2', white: '#ffffff' };
const box = (g, x, y, w, h, title, sub, o = {}) => {
  const r = svg('rect', { x, y, width: w, height: h, rx: 18, fill: G.white, stroke: o.stroke || C.line, 'stroke-width': o.sw || 2.5, ...(o.dash ? { 'stroke-dasharray': o.dash } : {}) }, g);
  svg('text', { x: x + 28, y: y + 44, text: title, fill: C.ink, 'font-size': 26, 'font-weight': 600 }, g);
  svg('text', { x: x + 28, y: y + 78, text: sub, fill: o.subFill || C.mutedL, 'font-size': 21 }, g);
  return r;
};
const arrow = (g, x1, y1, x2, y2, col, attrs = {}) => {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 12;
  const p = svg('path', { d: `M${x1},${y1} L${x2},${y2} M${x2 - h * Math.cos(a - .5)},${y2 - h * Math.sin(a - .5)} L${x2},${y2} L${x2 - h * Math.cos(a + .5)},${y2 - h * Math.sin(a + .5)}`,
    fill: 'none', stroke: col, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...attrs }, g);
  return p;
};

// 32 · three sources feed Grafana; Alertmanager's email is planned, not verified (amber).
Deck.slide('grafana', {
  steps: 1,
  setup(el) {
    const g = el.querySelector('.art');
    el._prom = svg('g', {}, g); box(el._prom, 150, 340, 470, 104, 'Prometheus', 'les métriques');
    el._loki = svg('g', { 'data-anim': 'pop', 'data-delay': .3 }, g);
    el._lokiR = box(el._loki, 150, 480, 470, 104, 'Loki + Promtail', 'les journaux de tous les pods', { stroke: G.green, sw: 4 });
    const am = svg('g', { 'data-step': 1, 'data-anim': 'rise', 'data-delay': .7 }, g);
    box(am, 150, 620, 470, 104, 'Alertmanager', 'les alertes par email', { stroke: G.amber, sw: 3, dash: '10 8', subFill: G.amberText });
    const ar = svg('g', { 'data-step': 1, 'data-anim': 'draw', 'data-delay': .4, 'data-stagger': .12 }, g);
    [392, 532, 672].forEach((y, i) => arrow(ar, 628, y, 728, 560 + (i - 1) * 40, i === 2 ? G.amber : C.mutedL, i === 2 ? { 'stroke-dasharray': '8 7' } : {}));
  },
  frame(el, st) {
    el._lokiR.style.stroke = mix(G.green, C.line, st.p(1, 0, .5));
    el._lokiR.style.strokeWidth = lerp(4, 2.5, st.p(1, 0, .5));
  },
});

// 33 · two limits, each with a small picture inside its amber card.
Deck.slide('limites-supervision', {
  setup(el) {
    const g = el.querySelector('.art');
    const a = svg('g', { 'data-step': 1, 'data-anim': 'fade', 'data-delay': .4 }, g);
    svg('rect', { x: 190, y: 540, width: 680, height: 76, rx: 14, fill: G.bg, stroke: C.line, 'stroke-width': 2 }, a);
    svg('circle', { cx: 226, cy: 578, r: 10, fill: G.green }, a);
    svg('text', { x: 252, y: 586, text: 'Cluster et supervision', fill: C.ink, 'font-size': 24 }, a);
    svg('text', { x: 846, y: 586, text: '13 cibles Up', fill: G.greenD, 'font-size': 24, 'font-weight': 600, 'text-anchor': 'end' }, a);
    svg('rect', { x: 190, y: 640, width: 680, height: 76, rx: 14, fill: G.white, stroke: G.amber, 'stroke-width': 2.5, 'stroke-dasharray': '10 8' }, a);
    svg('circle', { cx: 226, cy: 678, r: 9, fill: 'none', stroke: G.amber, 'stroke-width': 3 }, a);
    svg('text', { x: 252, y: 686, text: 'Services ZAWEDNI', fill: C.ink, 'font-size': 24 }, a);
    svg('text', { x: 846, y: 686, text: 'aucune cible', fill: G.amberText, 'font-size': 24, 'font-weight': 600, 'text-anchor': 'end' }, a);

    const b = svg('g', { 'data-step': 2, 'data-anim': 'fade', 'data-delay': .4 }, g);
    [[1120, 'site'], [1390, 'API'], [1660, 'base']].forEach(([x, t]) => {
      svg('circle', { cx: x, cy: 620, r: 46, fill: G.greenL, stroke: G.green, 'stroke-width': 3 }, b);
      svg('text', { x, y: 628, text: t, fill: G.greenD, 'font-size': 22, 'font-weight': 600, 'text-anchor': 'middle' }, b);
    });
    [1255, 1525].forEach(x => svg('line', { x1: x, x2: x, y1: 545, y2: 700, stroke: G.amber, 'stroke-width': 5, 'stroke-dasharray': '10 10', 'stroke-linecap': 'round' }, b));
    svg('path', { d: 'M1166,620 H1344 M1436,620 H1614', fill: 'none', stroke: C.ink, 'stroke-width': 3 }, b);
    svg('text', { x: 1390, y: 742, text: 'rien n’est filtré', fill: G.amberText, 'font-size': 22, 'text-anchor': 'middle' }, b);
  },
  frame() {},
});

// 35 · three gestures; a mini pipeline goes grey (read), red (break on purpose), green (repair).
Deck.slide('methode', {
  steps: 3,
  setup(el) {
    const g = el.querySelector('.art');
    const T = [['Lire', 'la configuration du contrôle'], ['Casser exprès', 'ajouter une vraie erreur'], ['Réparer', 'retirer l’erreur']];
    el._cards = T.map(([t, s], i) => {
      const x = 150 + i * 560, c = svg('g', { 'data-step': i + 1, 'data-anim': 'rise' }, g);
      const r = svg('rect', { x, y: 340, width: 500, height: 210, rx: 24, fill: G.white, stroke: C.line, 'stroke-width': 2.5 }, c);
      svg('circle', { cx: x + 56, cy: 400, r: 28, fill: G.green }, c);
      svg('text', { x: x + 56, y: 410, text: String(i + 1), fill: G.white, 'font-size': 28, 'font-weight': 700, 'text-anchor': 'middle' }, c);
      svg('text', { x: x + 104, y: 412, text: t, fill: C.ink, 'font-size': 34, 'font-weight': 600 }, c);
      svg('text', { x: x + 36, y: 490, text: s, fill: C.mutedL, 'font-size': 25 }, c);
      return r;
    });
    svg('path', { d: 'M1520,560 C1520,640 400,640 400,560', fill: 'none', stroke: C.mutedL, 'stroke-width': 3, 'stroke-dasharray': '9 9', 'data-step': 3, 'data-anim': 'draw', 'data-delay': .8 }, g);
    svg('path', { d: 'M388,576 L400,560 L412,576', fill: 'none', stroke: C.mutedL, 'stroke-width': 3, 'stroke-linecap': 'round', 'data-step': 3, 'data-anim': 'fade', 'data-delay': 1.8 }, g);
    const pipe = svg('g', { 'data-step': 1, 'data-anim': 'fade', 'data-delay': .3 }, g);
    svg('text', { x: 640, y: 802, text: 'le pipeline', fill: C.mutedL, 'font-size': 24, 'text-anchor': 'end' }, pipe);
    svg('line', { x1: 690, x2: 1250, y1: 792, y2: 792, stroke: C.line, 'stroke-width': 4 }, pipe);
    el._blocks = [0, 1, 2, 3, 4, 5, 6].map(k => svg('rect', { x: 668 + k * 90, y: 764, width: 56, height: 56, rx: 12, fill: G.grey }, pipe));
    [['gris : on lit, rien ne change', C.mutedL, 1], ['rouge : le pipeline doit échouer', C.redText, 2], ['vert : le pipeline doit repasser', G.greenD, 3]]
      .forEach(([t, col, n]) => svg('text', { x: 960, y: 890, text: t, fill: col, 'font-size': 28, 'font-weight': 600, 'text-anchor': 'middle',
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

// 36 · the real backend pipeline: log4j 2.14.1 stops at Dependency-Check, then goes away and all turns green.
const BACK = [['Gitleaks', 'secrets'], ['Tests', 'JUnit'], ['Dependency-|Check', 'bibliothèques'], ['SonarCloud', 'qualité'],
              ['Docker|build', 'construction'], ['Trivy', 'image'], ['ACR push', 'publication']];
Deck.slide('log4j', {
  steps: 2,
  setup(el) {
    const g = el.querySelector('.art'), RY = 660, DC = 2;
    el._RY = RY;
    svg('line', { x1: 150, x2: 1770, y1: RY, y2: RY, stroke: C.line, 'stroke-width': 4 }, g);
    el._lit = svg('line', { x1: 150, x2: 150, y1: RY, y2: RY, stroke: G.green, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    el._cards = BACK.map(([name, role], i) => {
      const x = 150 + i * 238, c = svg('g', {}, g);
      const r = svg('rect', { x, y: 390, width: 190, height: 200, rx: 22, fill: G.white, stroke: C.line, 'stroke-width': 2.5 }, c);
      svg('text', { x: x + 22, y: 432, text: String(i + 1), fill: C.mutedL, 'font-size': 22, 'font-weight': 600, 'font-family': 'var(--mono)' }, c);
      const lines = name.split('|');
      lines.forEach((t, k) => svg('text', { x: x + 95, y: 492 + k * 30 - (lines.length - 1) * 15, text: t, fill: C.ink, 'font-size': 24, 'font-weight': 600, 'text-anchor': 'middle' }, c));
      svg('text', { x: x + 95, y: 556, text: role, fill: C.mutedL, 'font-size': 20, 'text-anchor': 'middle' }, c);
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
    svg('text', { x: 150, y: 826, text: 'Rien n’est publié.', fill: C.ink, 'font-size': 26 }, m1);
    const m2 = svg('g', { 'data-step': 2, 'data-anim': 'rise', 'data-delay': 1.6 }, g);
    svg('text', { x: 150, y: 780, text: 'Bibliothèque retirée : le pipeline redevient vert', fill: G.greenD, 'font-size': 30, 'font-weight': 600 }, m2);
    svg('text', { x: 150, y: 826, text: 'Le rouge venait de log4j.', fill: C.ink, 'font-size': 26 }, m2);
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

// 37 · the eight steps, coloured by what the report found: green tested · light green configured · amber report only.
const KIND = ['g', 'a', 'a', 'g', 'a', 'l', 'l', 'l'], AT = { g: 1, l: 2, a: 3 };
Deck.slide('resultats', {
  steps: 3,
  setup(el) {
    const g = el.querySelector('.art');
    el._cards = STEPS.map(([name, role], i) => {
      const x = 151 + i * 206, c = svg('g', {}, g);
      const r = svg('rect', { x, y: 380, width: 176, height: 200, rx: 22, fill: G.white, stroke: C.line, 'stroke-width': 2.5 }, c);
      const n = svg('text', { x: x + 22, y: 424, text: String(i + 1), fill: C.mutedL, 'font-size': 22, 'font-weight': 600, 'font-family': 'var(--mono)' }, c);
      const lines = name.split('|');
      const ts = lines.map((t, k) => svg('text', { x: x + 88, y: 484 + k * 30 - (lines.length - 1) * 15, text: t, fill: C.ink, 'font-size': 24, 'font-weight': 600, 'text-anchor': 'middle' }, c));
      const ro = svg('text', { x: x + 88, y: 548, text: role, fill: C.mutedL, 'font-size': 20, 'text-anchor': 'middle' }, c);
      return { r, ts, n, ro, k: KIND[i] };
    });
  },
  frame(el, st) {
    for (const c of el._cards) {
      const on = st.p(AT[c.k], .1, .5, ease.outCubic);
      if (c.k === 'g') {
        c.r.style.fill = mix(G.white, G.green, on); c.r.style.stroke = mix(C.line, G.green, on);
        c.ts.forEach(t => (t.style.fill = mix(C.ink, G.white, on)));
        c.ro.style.fill = mix(C.mutedL, '#eef7f1', on); c.n.style.fill = mix(C.mutedL, '#eef7f1', on);
      } else if (c.k === 'l') {
        c.r.style.fill = mix(G.white, G.greenL, on); c.r.style.stroke = mix(C.line, G.green, on);
      } else {
        c.r.style.stroke = mix(C.line, G.amber, on);
      }
      c.r.style.strokeWidth = lerp(2.5, 4, on);
      c.r.parentNode.style.opacity = st.step === 0 || st.at(AT[c.k]) ? 1 : .55;
    }
  },
});
}
