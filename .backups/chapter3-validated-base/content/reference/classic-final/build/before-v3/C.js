{
// ── Batch C: the planned path, Gitleaks, Dependency-Check, team rule, control vs publish, GitOps, ArgoCD, secrets.
const T = (p, x, y, text, o = {}) => svg('text', { x, y, text, fill: C.ink, 'font-size': 24, ...o }, p);
const box = (p, x, y, w, h, o = {}) => svg('rect', { x, y, width: w, height: h, rx: 18, fill: '#ffffff', stroke: C.line, 'stroke-width': 2.5, ...o }, p);
const arrow = (p, x1, y1, x2, y2, o = {}) => {
  const g = svg('g', o.attrs || {}, p), a = Math.atan2(y2 - y1, x2 - x1), k = 14;
  svg('line', { x1, y1, x2, y2, stroke: o.col || C.mutedL, 'stroke-width': 3, 'stroke-dasharray': o.dash || 'none' }, g);
  svg('path', { d: `M${x2},${y2} L${x2 - k * Math.cos(a - .45)},${y2 - k * Math.sin(a - .45)} L${x2 - k * Math.cos(a + .45)},${y2 - k * Math.sin(a + .45)} Z`, fill: o.col || C.mutedL }, g);
  return g;
};
const hex = (p, x, y, r, o = {}) => svg('path', { d: [0, 1, 2, 3, 4, 5].map(k => { const t = Math.PI / 3 * k - Math.PI / 2; return `${k ? 'L' : 'M'}${(x + r * Math.cos(t)).toFixed(1)},${(y + r * Math.sin(t)).toFixed(1)}`; }).join('') + 'Z', fill: '#ffffff', stroke: '#2f6fde', 'stroke-width': 3, ...o }, p);
const lock = (p, x, y, col) => {          // a padlock; returns its shackle so it can open
  const g = svg('g', {}, p);
  const sh = svg('path', { d: `M${x - 14},${y} V${y - 14} A14 14 0 0 1 ${x + 14},${y - 14} V${y}`, fill: 'none', stroke: col, 'stroke-width': 6 }, g);
  const body = svg('rect', { x: x - 22, y, width: 44, height: 34, rx: 7, fill: col }, g);
  return { g, sh, body };
};
const AMBER = '#e39a0b', AMBER_T = '#8f5a00', AZ = '#2f6fde', AZ_T = '#1f57bd';

// ── The planned path: feature → develop → staging → main, one PR per merge. Staging is done and tested; main is planned.
Deck.slide('parcours', {
  steps: 3,
  setup(el) {
    const a = el.querySelector('.art'), Y = 410;
    const cols = [[150, 280, 'feature'], [470, 400, 'develop'], [910, 480, 'staging'], [1430, 340, 'main']];
    const cx = cols.map(([x, w]) => x + w / 2);
    svg('line', { x1: cx[0], x2: cx[2], y1: Y, y2: Y, stroke: C.line, 'stroke-width': 4 }, a);
    el._lit = svg('line', { x1: cx[0], x2: cx[0], y1: Y, y2: Y, stroke: C.green, 'stroke-width': 6, 'stroke-linecap': 'round' }, a);
    el._plan = svg('line', { x1: cx[2], x2: cx[2], y1: Y, y2: Y, stroke: AMBER, 'stroke-width': 5, 'stroke-dasharray': '12 10' }, a);
    el._cx = cx;
    el._nodes = cols.map(([x, w, name], i) => {
      const g = svg('g', {}, a);
      const r = svg('rect', { x: cx[i] - 100, y: Y - 32, width: 200, height: 64, rx: 32, fill: '#ffffff', stroke: C.line, 'stroke-width': 3, 'stroke-dasharray': i === 3 ? '10 8' : 'none' }, g);
      T(g, cx[i], Y + 10, name, { 'font-size': 28, 'font-weight': 600, 'text-anchor': 'middle', 'font-family': 'var(--mono)' });
      return r;
    });
    [0, 1, 2].forEach(i => {
      const x = (cx[i] + cx[i + 1]) / 2, b = svg('g', { 'data-step': i + 1, 'data-anim': 'pop' }, a);
      svg('rect', { x: x - 36, y: Y - 70, width: 72, height: 38, rx: 19, fill: C.ink }, b);
      T(b, x, Y - 42, 'PR', { fill: '#ffffff', 'font-size': 22, 'font-weight': 700, 'text-anchor': 'middle' });
    });
    const top = 490, pad = 28;
    // feature: where the change is written
    const f = svg('g', { 'data-anim': 'rise', 'data-delay': .3 }, a);
    box(f, 150, top, 280, 190);
    T(f, 150 + pad, top + 56, 'On code ici', { 'font-size': 34, 'font-weight': 600 });
    T(f, 150 + pad, top + 104, 'une branche', { 'font-size': 28, fill: C.mutedL });
    T(f, 150 + pad, top + 142, 'par changement', { 'font-size': 28, fill: C.mutedL });
    // develop: first analysis, no image
    const d = svg('g', { 'data-step': 1, 'data-anim': 'rise', 'data-delay': .4 }, a);
    box(d, 470, top, 400, 190, { stroke: C.green });
    T(d, 470 + pad, top + 56, 'PR vers develop', { 'font-size': 34, 'font-weight': 600 });
    T(d, 470 + pad, top + 104, 'Semgrep', { 'font-size': 28, 'font-weight': 600, fill: C.green });
    T(d, 470 + pad, top + 142, 'aucune image', { 'font-size': 28, fill: C.mutedL });
    // staging: the part that is done and tested, in solid green
    const s = svg('g', { 'data-step': 2, 'data-anim': 'rise', 'data-delay': .4 }, a);
    svg('rect', { x: 910, y: top, width: 480, height: 420, rx: 18, fill: C.green }, s);
    T(s, 910 + pad + 4, top + 56, 'PR vers staging', { 'font-size': 34, 'font-weight': 600, fill: '#ffffff' });
    const seq = [['contrôles des', 'fichiers modifiés'], ['fusion'], ['déploiement staging'], ['test']];
    let y = top + 108;
    seq.forEach((lines, k) => {
      const g = svg('g', { 'data-step': 2, 'data-anim': 'fade', 'data-delay': .8 + k * .25 }, s);
      if (k) { arrow(g, 960, y - 56, 960, y - 24, { col: '#ffffff' }); }
      lines.forEach((t, j) => T(g, 942, y + j * 36, t, { 'font-size': 28, fill: '#ffffff', 'font-weight': k === 3 ? 600 : 400 }));
      y += lines.length * 36 + 46;
    });
    // main: planned, not done
    const m = svg('g', { 'data-step': 3, 'data-anim': 'rise', 'data-delay': .4 }, a);
    box(m, 1430, top, 340, 190, { stroke: AMBER, 'stroke-dasharray': '12 9', fill: '#fffaf0' });
    T(m, 1430 + pad, top + 56, 'PR vers main', { 'font-size': 34, 'font-weight': 600 });
    T(m, 1430 + pad, top + 104, 'prévu ·', { 'font-size': 28, fill: AMBER_T, 'font-weight': 600 });
    T(m, 1430 + pad, top + 142, 'pas encore réalisé', { 'font-size': 28, fill: AMBER_T });
  },
  frame(el, st) {
    const cx = el._cx, s1 = st.p(1, 0, .7, ease.inOutCubic), s2 = st.p(2, 0, .7, ease.inOutCubic), s3 = st.p(3, 0, .7, ease.inOutCubic);
    el._lit.setAttribute('x2', cx[0] + (cx[1] - cx[0]) * s1 + (cx[2] - cx[1]) * s2);
    el._plan.setAttribute('x2', cx[2] + (cx[3] - cx[2]) * s3);
    el._plan.style.opacity = s3 > 0 ? 1 : 0;
    const on = [1, s1, s2];
    el._nodes.forEach((r, i) => { r.style.stroke = i < 3 ? mix(C.line, C.green, on[i]) : mix(C.line, AMBER, s3); });
  },
});

// A blocked item rolls toward the next stage and stops at the gate (same drawing as the Trivy slide).
function gateSetup(el, o) {
  const g = el.querySelector('.gate');
  el._img = svg('g', {}, g);
  svg('rect', { x: 0, y: 150, width: 170, height: 120, rx: 16, fill: '#ffffff', stroke: C.ink, 'stroke-width': 3 }, el._img);
  [0, 1, 2].forEach(k => svg('rect', { x: 22, y: 178 + k * 24, width: [120, 90, 106][k], height: 10, rx: 5, fill: C.line }, el._img));
  T(el._img, 85, 310, o.what, { 'font-weight': 600, 'text-anchor': 'middle' });
  svg('rect', { x: 8, y: 126, width: 116, height: 40, rx: 20, fill: '#c22d2d' }, el._img);
  T(el._img, 66, 153, o.badge, { fill: '#ffffff', 'font-size': 20, 'font-weight': 700, 'text-anchor': 'middle' });
  svg('line', { x1: 250, x2: 420, y1: 210, y2: 210, stroke: C.line, 'stroke-width': 4, 'stroke-dasharray': '10 10' }, g);
  el._gate = svg('rect', { x: 286, y: 110, width: 18, height: 200, rx: 9, fill: C.mutedL }, g);
  T(g, 295, 92, o.gate, { 'font-weight': 600, 'text-anchor': 'middle' });
  svg('rect', { x: 420, y: 168, width: 96, height: 84, rx: 16, fill: '#ffffff', stroke: C.line, 'stroke-width': 3 }, g);
  T(g, 468, 218, 'suite', { fill: C.mutedL, 'font-size': 22, 'text-anchor': 'middle' });
  svg('path', { d: 'M350,186 L394,234 M394,186 L350,234', stroke: C.red, 'stroke-width': 8, 'stroke-linecap': 'round', 'data-step': 1, 'data-anim': 'pop', 'data-delay': 1.1 }, g);
  const msg = svg('g', { 'data-step': 1, 'data-anim': 'rise', 'data-delay': 1.3 }, g);
  T(msg, 0, 430, o.stop, { fill: C.redText, 'font-size': 28, 'font-weight': 600 });
  T(msg, 0, 476, o.after, { 'font-size': 28 });
}
function gateFrame(el, st) {
  const p = st.p(1, .2, 1.1, ease.outBack);
  el._img.setAttribute('transform', `translate(${lerp(0, 96, p)},0)`);
  el._gate.style.fill = mix('#536459', C.red, st.p(1, .9, .3));
}
Deck.slide('gitleaks', {
  setup(el) { gateSetup(el, { what: 'commit', badge: 'SECRET', gate: 'Gitleaks', stop: 'exit-code 1 : le job échoue', after: 'Rien n’est publié.' }); },
  frame: gateFrame,
});

// ── CVSS gauge: 0 to 10, the band from 9 up fails the build.
Deck.slide('dependency-check', {
  setup(el) {
    const g = el.querySelector('.gauge'), X = v => 30 + v * 44, Y = 230;
    T(g, 0, 90, 'Score CVSS : la gravité d’une faille', { fill: C.mutedL, 'font-size': 24 });
    svg('rect', { x: X(0), y: Y - 22, width: X(10) - X(0), height: 44, rx: 22, fill: C.line }, g);
    el._band = svg('rect', { x: X(9), y: Y - 22, width: X(10) - X(9), height: 44, rx: 0, fill: C.line }, g);
    [0, 5, 9, 10].forEach(v => {
      svg('line', { x1: X(v), x2: X(v), y1: Y + 30, y2: Y + 44, stroke: C.mutedL, 'stroke-width': 2 }, g);
      T(g, X(v), Y + 76, String(v), { fill: C.mutedL, 'font-size': 22, 'text-anchor': 'middle', 'font-family': 'var(--mono)' });
    });
    el._mark = svg('g', {}, g);
    svg('path', { d: `M0,${Y - 40} L-12,${Y - 62} H12 Z`, fill: C.ink }, el._mark);
    el._X = X;
    const msg = svg('g', { 'data-step': 1, 'data-anim': 'rise', 'data-delay': 1.2 }, g);
    T(msg, 0, 400, '9 ou plus : faille critique', { fill: C.redText, 'font-size': 28, 'font-weight': 600 });
    T(msg, 0, 446, 'Le build échoue, rien n’est publié.', { 'font-size': 28 });
  },
  frame(el, st) {
    const p = st.p(1, .2, 1.2, ease.outCubic);
    el._mark.setAttribute('transform', `translate(${el._X(lerp(2, 9.5, p))},0)`);
    el._band.style.fill = mix(C.line, C.red, st.p(1, 1, .3));
  },
});

// ── A red pull request whose merge button stays green.
Deck.slide('regle-equipe', {
  setup(el) {
    const g = svg('g', { 'data-step': 1, 'data-anim': 'rise' }, el.querySelector('.art'));
    box(g, 150, 660, 1620, 150, { rx: 22 });
    T(g, 190, 712, 'Pull request : staging → main', { 'font-size': 28, 'font-weight': 600 });
    svg('circle', { cx: 206, cy: 760, r: 15, fill: C.red }, g);
    svg('path', { d: 'M199,753 L213,767 M213,753 L199,767', stroke: '#fff', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
    T(g, 236, 769, 'Pipeline rouge', { fill: C.redText, 'font-size': 26, 'font-weight': 600 });
    svg('rect', { x: 1310, y: 696, width: 420, height: 78, rx: 14, fill: C.green }, g);
    T(g, 1520, 745, 'Fusionner quand même', { fill: '#ffffff', 'font-size': 26, 'font-weight': 600, 'text-anchor': 'middle' });
    T(g, 1280, 745, 'bouton actif', { fill: C.mutedL, 'font-size': 24, 'text-anchor': 'end' });
  },
});

// ── ArgoCD loop: Git → ArgoCD → pods, the dot carries the version down; then the 06/10 capture.
Deck.slide('argocd', {
  steps: 2,
  setup(el) {
    const a = el.querySelector('.art'), g = svg('g', { 'data-step': 1, 'data-anim': 'rise' }, a);
    box(g, 170, 350, 250, 104, { stroke: C.green });
    T(g, 295, 396, 'Git', { 'font-size': 30, 'font-weight': 600, 'text-anchor': 'middle' });
    T(g, 295, 430, 'manifestes', { fill: C.mutedL, 'font-size': 22, 'text-anchor': 'middle' });
    arrow(g, 295, 458, 295, 528, { col: C.green });
    svg('circle', { cx: 295, cy: 600, r: 68, fill: '#ffffff', stroke: AZ, 'stroke-width': 3 }, g);
    T(g, 295, 609, 'ArgoCD', { fill: AZ_T, 'font-size': 26, 'font-weight': 600, 'text-anchor': 'middle' });
    arrow(g, 295, 672, 295, 742, { col: AZ });
    hex(g, 295, 812, 66);
    T(g, 295, 821, 'Pods', { fill: AZ_T, 'font-size': 26, 'font-weight': 600, 'text-anchor': 'middle' });
    // the loop: ArgoCD keeps comparing what runs with what Git describes
    svg('path', { d: 'M232,790 C150,760 150,650 226,612', fill: 'none', stroke: AZ, 'stroke-width': 3, 'stroke-dasharray': '8 8' }, g);
    svg('path', { d: 'M226,612 l-16,-2 l8,14 Z', fill: AZ }, g);
    T(g, 392, 590, 'compare et applique', { 'font-size': 28 });
    T(g, 392, 628, 'la différence', { 'font-size': 28 });
    el._sync = svg('circle', { r: 9, fill: C.green }, g);
  },
  frame(el, st) {
    const p = st.p(1, .5, 1.6, ease.inOutCubic);
    el._sync.setAttribute('cx', 295); el._sync.setAttribute('cy', lerp(458, 746, p));
    el._sync.style.opacity = p > 0 && p < 1 ? 1 : 0;
  },
});

// ── Two lanes: GitHub Secrets feed the pipeline; a sealed secret crosses Git, opens only in the cluster,
//    becomes ADMIN_DEFAULT_PASSWORD, and the admin login of 06/10 shows it worked.
Deck.slide('secrets', {
  setup(el) {
    const a = el.querySelector('.art');
    const top = svg('g', { 'data-step': 1, 'data-anim': 'rise' }, a);
    T(top, 150, 432, 'Pour le pipeline', { fill: C.mutedL, 'font-weight': 600 });
    box(top, 150, 452, 450, 110);
    svg('circle', { cx: 205, cy: 507, r: 16, fill: 'none', stroke: C.green, 'stroke-width': 5 }, top);
    svg('path', { d: 'M221,507 H262 M248,507 V522 M260,507 V518', stroke: C.green, 'stroke-width': 5, fill: 'none' }, top);
    T(top, 290, 500, 'Secrets GitHub', { 'font-size': 28, 'font-weight': 600 });
    T(top, 290, 536, 'ACR_*, SONAR_TOKEN…', { fill: C.mutedL, 'font-size': 22, 'font-family': 'var(--mono)' });
    arrow(top, 620, 507, 1080, 507, { col: C.green });
    box(top, 1100, 452, 670, 110);
    T(top, 1130, 500, 'Pipeline', { 'font-size': 28, 'font-weight': 600 });
    T(top, 1130, 536, 'valeur masquée : ***', { fill: C.mutedL, 'font-size': 22 });

    const bot = svg('g', { 'data-step': 2, 'data-anim': 'rise' }, a);
    T(bot, 150, 652, 'Pour l’application', { fill: C.mutedL, 'font-weight': 600 });
    box(bot, 150, 672, 330, 136);
    T(bot, 178, 728, 'Dépôt Git', { 'font-size': 28, 'font-weight': 600 });
    T(bot, 178, 764, 'Sealed Secret', { fill: C.mutedL, 'font-size': 22 });
    T(bot, 178, 792, 'chiffré', { fill: C.mutedL, 'font-size': 22 });
    svg('line', { x1: 490, x2: 612, y1: 740, y2: 740, stroke: C.line, 'stroke-width': 4, 'stroke-dasharray': '10 10' }, bot);
    hex(bot, 690, 740, 80);
    T(bot, 690, 646, 'Cluster', { fill: AZ_T, 'font-size': 26, 'font-weight': 600, 'text-anchor': 'middle' });
    T(bot, 690, 856, 'déchiffré seulement ici', { fill: AZ_T, 'font-size': 22, 'text-anchor': 'middle' });
    const v = svg('g', { 'data-step': 2, 'data-anim': 'fade', 'data-delay': 2 }, a);
    arrow(v, 780, 740, 846, 740, { col: C.green });
    box(v, 856, 682, 380, 116, { stroke: C.green });
    T(v, 882, 726, 'variable', { fill: C.mutedL, 'font-size': 22 });
    T(v, 882, 766, 'ADMIN_DEFAULT_PASSWORD', { 'font-size': 22, 'font-weight': 600, 'font-family': 'var(--mono)' });
    arrow(v, 1244, 740, 1290, 740, { col: C.green });
    T(svg('g', { 'data-step': 2, 'data-anim': 'fade', 'data-delay': 2.3 }, a), 1300, 650, 'connexion admin', { fill: C.green, 'font-size': 26, 'font-weight': 600 });
    el._lk = lock(bot, 0, 0, C.ink);
  },
  frame(el, st) {
    const p = st.p(2, .5, 1.2, ease.inOutCubic), x = lerp(520, 690, p);
    el._lk.g.setAttribute('transform', `translate(${x},${724})`);
    const open = st.p(2, 1.6, .4, ease.outBack);
    el._lk.sh.setAttribute('transform', `translate(0,${-10 * open})`);
    const col = mix(C.ink, C.green, clamp(open, 0, 1));
    el._lk.sh.style.stroke = col; el._lk.body.style.fill = col;
  },
});
}
