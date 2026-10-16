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

// ── CVSS gauge: 0 to 10, the band from 9 up fails the build.

// ── A red pull request whose merge button stays green.

// ── ArgoCD loop: Git → ArgoCD → pods, the dot carries the version down; then the app capture.
Deck.slide('argocd', {
  steps: 2,
  setup(el) {
    const a = el.querySelector('.art'), g0 = svg('g', { 'data-anim': 'rise' }, a), g = svg('g', { 'data-step': 1, 'data-anim': 'rise' }, a);
    box(g0, 170, 350, 250, 104, { stroke: C.green });
    T(g0, 295, 396, 'Git', { 'font-size': 30, 'font-weight': 600, 'text-anchor': 'middle' });
    T(g0, 295, 430, 'état attendu', { fill: C.mutedL, 'font-size': 22, 'text-anchor': 'middle' });
    const g0t = svg('g', { 'data-anim': 'fade', 'data-delay': .3, 'data-out': 1 }, a);
    T(g0t, 450, 396, 'Git décrit ce qui doit tourner :', { 'font-size': 28 });
    T(g0t, 450, 434, 'images, réplicas, configuration', { 'font-size': 26, fill: C.mutedL });
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
//    becomes ADMIN_DEFAULT_PASSWORD, and the admin login shows it worked.
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
