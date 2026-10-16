{
// ── batch A: context (2–8) and approaches (9–12). Light slides, green = the chosen path.
const AMBER_T = '#8f5a00', GREEN_L = '#cfe8d7';
const arrow = (g, x1, y1, x2, y2, col, step, delay, dash) => {
  const a = { stroke: col, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' };
  if (dash) a['stroke-dasharray'] = '10 10';
  svg('path', { d: `M${x1},${y1} L${x2},${y2}`, ...a, 'data-step': step, 'data-anim': 'draw', 'data-dur': .5, 'data-delay': delay }, g);
  const ang = Math.atan2(y2 - y1, x2 - x1), h = 14;
  const p = (k) => `${x2 - h * Math.cos(ang + k)},${y2 - h * Math.sin(ang + k)}`;
  svg('path', { d: `M${p(.5)} L${x2},${y2} L${p(-.5)}`, ...a, 'data-step': step, 'data-anim': 'fade', 'data-delay': delay + .4 }, g);
};

Deck.slide('grille-rse', {
  steps: 2,
  setup(el) {
    const g = el.querySelector('.art'), Y = 525;
    arrow(g, 462, Y, 578, Y, C.mutedL, 1, 0);
    arrow(g, 902, Y, 1018, Y, C.mutedL, 1, .6);
    arrow(g, 1342, Y, 1458, Y, C.green, 2, 0);
    svg('text', { x: 1400, y: Y - 22, text: 'approuvée', fill: C.green, 'font-size': 22, 'font-weight': 600, 'text-anchor': 'middle', 'data-step': 2, 'data-anim': 'fade', 'data-delay': .3 }, g);
    arrow(g, 1180, 590, 1180, 768, C.mutedL, 2, .3, true);
    svg('text', { x: 1200, y: 690, text: 'refusée', fill: C.mutedL, 'font-size': 22, 'data-step': 2, 'data-anim': 'fade', 'data-delay': .6 }, g);
    el._mkt = el.querySelector('.mkt');
  },
  frame(el, st) {
    const on = st.p(2, .4, .6);
    el._mkt.style.opacity = lerp(.4, 1, on);
    el._mkt.style.borderColor = mix(C.line, C.green, on);
    el._mkt.style.background = mix('#ffffff', GREEN_L, on);
  },
});

Deck.slide('composants', {
  setup(el) {
    const g = el.querySelector('.art');
    [[780, 530, 540, 425], [780, 575, 540, 695], [1140, 530, 1380, 425], [1140, 575, 1380, 695]].forEach(([x1, y1, x2, y2], i) =>
      svg('path', { d: `M${x1},${y1} L${x2},${y2}`, stroke: C.line, 'stroke-width': 4, fill: 'none', 'data-step': 1, 'data-anim': 'draw', 'data-dur': .6, 'data-delay': i * .08 }, g));
    svg('path', { d: 'M960,610 L960,810', stroke: C.green, 'stroke-width': 4, fill: 'none', 'data-step': 2, 'data-anim': 'draw', 'data-dur': .5 }, g);
  },
});

Deck.slide('perimetre', {
  steps: 1,
  setup(el) {
    const g = el.querySelector('.art');
    svg('text', { x: 150, y: 400, text: 'Avant le PFE : l’application', fill: C.mutedL, 'font-size': 30, 'font-weight': 600 }, g);
    svg('line', { x1: 940, x2: 940, y1: 380, y2: 960, stroke: C.line, 'stroke-width': 3, 'stroke-dasharray': '8 10' }, g);
    el._app = svg('g', {}, g);
    [['API', 480, 650], ['Site client', 330, 545], ['Site admin', 630, 545], ['Mobile', 330, 755], ['IA', 630, 755]].forEach(([t, x, y]) => {
      svg('rect', { x: x - 110, y: y - 34, width: 220, height: 68, rx: 18, fill: '#e9eee9', stroke: C.line, 'stroke-width': 2 }, el._app);
      svg('text', { x, y: y + 9, text: t, fill: C.mutedL, 'font-size': 24, 'font-weight': 600, 'text-anchor': 'middle' }, el._app);
    });
    svg('text', { x: 480, y: 880, text: 'développée avant le projet', fill: C.mutedL, 'font-size': 24, 'text-anchor': 'middle' }, g);
    const R = svg('g', { 'data-step': 1, 'data-anim': 'fade', 'data-dur': .3 }, g);
    svg('text', { x: 1010, y: 400, text: 'Pendant le PFE : la chaîne', fill: C.green, 'font-size': 30, 'font-weight': 600 }, R);
    const cx = 1385, cy = 680, r = 200;
    svg('circle', { cx, cy, r, fill: 'none', stroke: C.green, 'stroke-width': 8, 'data-step': 1, 'data-anim': 'draw', 'data-dur': 1 }, g);
    svg('text', { x: cx, y: cy + 8, text: 'l’application', fill: C.mutedL, 'font-size': 24, 'text-anchor': 'middle', 'data-step': 1, 'data-anim': 'fade' }, g);
    [['Empaqueter', cx, cy - r], ['Contrôler', cx + r, cy], ['Déployer', cx, cy + r], ['Surveiller', cx - r, cy]].forEach(([t, x, y], i) => {
      const p = svg('g', { 'data-step': 1, 'data-anim': 'pop', 'data-delay': .5 + i * .15 }, g);
      svg('rect', { x: x - 105, y: y - 29, width: 210, height: 58, rx: 29, fill: C.green }, p);
      svg('text', { x, y: y + 8, text: t, fill: '#ffffff', 'font-size': 24, 'font-weight': 600, 'text-anchor': 'middle' }, p);
    });
  },
  frame(el, st) { el._app.style.opacity = lerp(1, .55, st.p(1, 0, .6)); },
});

Deck.slide('depart', {
  ambient: 24,
  setup(el) {
    const g = el.querySelector('.art'), cx = 1300, cy = 560;
    svg('rect', { x: cx - 170, y: cy - 115, width: 340, height: 220, rx: 18, fill: '#ffffff', stroke: C.ink, 'stroke-width': 5 }, g);
    [[0, 150], [40, 210], [80, 120]].forEach(([dy, w]) => svg('rect', { x: cx - 120, y: cy - 70 + dy, width: w, height: 14, rx: 7, fill: C.line }, g));
    svg('path', { d: `M${cx - 225},${cy + 125} H${cx + 225} L${cx + 195},${cy + 160} H${cx - 195} Z`, fill: C.ink }, g);
    el._halo = svg('circle', { cx: cx + 95, cy: cy + 45, r: 34, fill: C.green, 'fill-opacity': .18 }, g);
    svg('circle', { cx: cx + 95, cy: cy + 45, r: 16, fill: C.green, stroke: '#ffffff', 'stroke-width': 3 }, g);
    svg('text', { x: cx, y: cy + 230, text: 'Aucun serveur · aucun environnement de test', fill: C.mutedL, 'font-size': 24, 'text-anchor': 'middle' }, g);
    svg('text', { x: cx, y: cy + 266, text: 'aucune mise en ligne', fill: C.mutedL, 'font-size': 24, 'text-anchor': 'middle' }, g);
  },
  frame(el, st) { el._halo.setAttribute('r', 34 + 10 * st.life(1.8, 1)); },
});

// ── The comparison matrix, shared by slides 9 and 10 (same layout, so the camera move reads as "same table").
const COLS = [['Manuel'], ['VM + Jenkins'], ['Azure DevOps'], ['GitHub Actions', '+ AKS']];
const ROWS = [['Automatisation', 'Aucune', 'Partielle', 'Complète', 'Complète'],
              ['Sécurité intégrée', 'Absente', 'Limitée', 'Partielle', 'Dans le pipeline'],
              ['Mise à l’échelle', 'Nulle', 'Faible', 'Élevée', 'Élevée'],
              ['Coût pour nous', 'Faible', 'Moyen', 'Élevé', 'Crédit étudiant'],
              ['GitOps', 'Non', 'Non', 'Partiel', 'Oui (ArgoCD)']];
const WHY = [['Rien', 'd’automatique'], ['Serveur à gérer,', 'une seule machine'], ['Trop cher', 'pour une startup'], null];
const CX = k => 560 + k * 300 + 150;
const matrix = el => {
  const g = el.querySelector('.art');
  el._hl = svg('rect', { x: 1466, y: 318, width: 288, height: 520, rx: 22, fill: GREEN_L, stroke: C.green, 'stroke-width': 3 }, g);
  el._cols = COLS.map((name, k) => {
    const c = svg('g', {}, g);
    name.forEach((t, j) => svg('text', { x: CX(k), y: 365 + j * 32 - (name.length - 1) * 14, text: t, fill: C.ink, 'font-size': 26, 'font-weight': 600, 'text-anchor': 'middle' }, c));
    ROWS.forEach((r, i) => svg('text', { x: CX(k), y: 478 + i * 80, text: r[k + 1], fill: C.ink, 'font-size': 24, 'text-anchor': 'middle' }, c));
    const why = WHY[k] && svg('g', {}, g);
    if (why) WHY[k].forEach((t, j) => svg('text', { x: CX(k), y: 878 + j * 30, text: t, fill: C.mutedL, 'font-size': 22, 'text-anchor': 'middle' }, why));
    return { c, why };
  });
  ROWS.forEach((r, i) => {
    svg('line', { x1: 150, x2: 1770, y1: 430 + i * 80, y2: 430 + i * 80, stroke: C.line, 'stroke-width': 2 }, g);
    svg('text', { x: 150, y: 478 + i * 80, text: r[0], fill: C.mutedL, 'font-size': 24, 'font-weight': 500 }, g);
  });
}
// out[k] = how far column k has been ruled out (0..1); win = how lit the chosen column is
const paintMatrix = (el, out, win) => {
  el._cols.forEach((col, k) => {
    col.c.style.opacity = lerp(1, .28, out[k]);
    if (col.why) col.why.style.opacity = out[k];
  });
  el._hl.style.opacity = win;
}
Deck.slide('approches', {
  steps: 2,
  setup: matrix,
  frame(el, st) { paintMatrix(el, [st.p(1, 0, .6), st.p(2, 0, .6), 0, 0], 0); },
});
Deck.slide('choix', {
  steps: 2,
  setup(el) {
    matrix(el);
    svg('text', { x: 960, y: 968, text: 'Crédit Azure for Students : 100 $ · coût estimé : 35 à 40 $ par mois', fill: C.green, 'font-size': 26, 'font-weight': 600, 'text-anchor': 'middle', 'data-step': 2, 'data-anim': 'rise', 'data-delay': .4 }, el.querySelector('.art'));
  },
  frame(el, st) { paintMatrix(el, [1, 1, st.p(1, 0, .6), 0], st.p(2, 0, .6)); },
});

// ── The DevOps loop: security first sits at the end, then moves into every stage.
Deck.slide('devsecops', {
  steps: 2,
  setup(el) {
    const g = el.querySelector('.art'), Y = 600, W = 230;
    const names = ['Coder', 'Construire', 'Tester', 'Livrer', 'Déployer', 'Superviser'];
    names.forEach((t, i) => {
      const x = 150 + i * 278;
      svg('rect', { x, y: Y - 40, width: W, height: 80, rx: 40, fill: '#ffffff', stroke: C.line, 'stroke-width': 3 }, g);
      svg('text', { x: x + W / 2, y: Y + 9, text: t, fill: C.ink, 'font-size': 26, 'font-weight': 600, 'text-anchor': 'middle' }, g);
      if (i < 5) svg('path', { d: `M${x + W + 8},${Y} h30 m-10,-9 l10,9 l-10,9`, stroke: C.mutedL, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      const b = svg('g', { 'data-step': 2, 'data-anim': 'pop', 'data-delay': .5 + (5 - i) * .1 }, g);
      svg('circle', { cx: x + W - 10, cy: Y - 40, r: 24, fill: C.green }, b);
      svg('path', { d: shield(x + W - 10, Y - 40, .8), fill: 'none', stroke: '#ffffff', 'stroke-width': 2.5 }, b);
    });
    svg('path', { d: `M1655,${Y + 40} V${Y + 150} H265 V${Y + 52} m-9,12 l9,-12 l9,12`, stroke: C.line, 'stroke-width': 3, fill: 'none', 'stroke-linejoin': 'round' }, g);
    svg('text', { x: 960, y: Y + 190, text: 'la boucle recommence', fill: C.mutedL, 'font-size': 22, 'text-anchor': 'middle' }, g);
    el._late = svg('g', {}, g);
    svg('circle', { cx: 1700, cy: 430, r: 40, fill: C.mutedL }, el._late);
    svg('path', { d: shield(1700, 430, 1.4), fill: 'none', stroke: '#ffffff', 'stroke-width': 3 }, el._late);
    svg('text', { x: 1640, y: 422, text: 'DevOps : la sécurité arrive à la fin', fill: C.ink, 'font-size': 26, 'font-weight': 600, 'text-anchor': 'end' }, el._late);
    svg('text', { x: 1640, y: 456, text: 'après la livraison : corriger coûte cher', fill: C.mutedL, 'font-size': 24, 'text-anchor': 'end' }, el._late);
    svg('text', { x: 150, y: 440, text: 'DevSecOps : un contrôle dans chaque étape, à chaque changement', fill: C.green, 'font-size': 28, 'font-weight': 600, 'data-step': 2, 'data-anim': 'rise', 'data-delay': .9 }, g);
  },
  frame(el, st) {
    const out = st.p(2, 0, .8, ease.inOutCubic);
    el._late.style.opacity = st.p(1, 0, .5) * (1 - out);
    el._late.setAttribute('transform', `translate(${-300 * out},0)`);
  },
});
}
