{
// ── Batch C: Gitleaks, Dependency-Check, team rule, secrets, GitOps, ArgoCD, the path of a change.
const T = (p, x, y, text, o = {}) => svg('text', { x, y, text, fill: C.ink, 'font-size': 24, ...o }, p);
const box = (p, x, y, w, h, o = {}) => svg('rect', { x, y, width: w, height: h, rx: 18, fill: '#ffffff', stroke: C.line, 'stroke-width': 2.5, ...o }, p);
const arrow = (p, x1, y1, x2, y2, o = {}) => {
  const g = svg('g', {}, p), a = Math.atan2(y2 - y1, x2 - x1), k = 14;
  svg('line', { x1, y1, x2, y2, stroke: o.col || C.mutedL, 'stroke-width': 3, 'stroke-dasharray': o.dash || 'none' }, g);
  svg('path', { d: `M${x2},${y2} L${x2 - k * Math.cos(a - .45)},${y2 - k * Math.sin(a - .45)} L${x2 - k * Math.cos(a + .45)},${y2 - k * Math.sin(a + .45)} Z`, fill: o.col || C.mutedL }, g);
  return g;
};
const lock = (p, x, y, col) => {          // a padlock; returns its shackle so it can open
  const g = svg('g', {}, p);
  const sh = svg('path', { d: `M${x - 14},${y} V${y - 14} A14 14 0 0 1 ${x + 14},${y - 14} V${y}`, fill: 'none', stroke: col, 'stroke-width': 6 }, g);
  const body = svg('rect', { x: x - 22, y, width: 44, height: 34, rx: 7, fill: col }, g);
  return { g, sh, body };
};

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
  T(msg, 0, 430, 'exit-code 1 : le pipeline s’arrête', { fill: C.redText, 'font-size': 28, 'font-weight': 600 });
  T(msg, 0, 476, o.after, { 'font-size': 26 });
}
function gateFrame(el, st) {
  const p = st.p(1, .2, 1.1, ease.outBack);
  el._img.setAttribute('transform', `translate(${lerp(0, 96, p)},0)`);
  el._gate.style.fill = mix('#536459', C.red, st.p(1, .9, .3));
}
Deck.slide('gitleaks', {
  setup(el) { gateSetup(el, { what: 'commit', badge: 'SECRET', gate: 'Gitleaks', after: 'Rien n’est publié. Rapport JSON gardé.' }); },
  frame: gateFrame,
});

// ── CVSS gauge: 0 to 10, the band from 9 up fails the build.
Deck.slide('dependency-check', {
  setup(el) {
    const g = el.querySelector('.gauge'), X = v => 30 + v * 44, Y = 230;
    T(g, 0, 90, 'Score CVSS : la gravité d’une faille', { fill: C.mutedL, 'font-size': 24 });
    svg('rect', { x: X(0), y: Y - 22, width: X(10) - X(0), height: 44, rx: 22, fill: C.line }, g);
    el._band = svg('rect', { x: X(9), y: Y - 22, width: X(10) - X(9), height: 44, rx: 0, fill: C.line }, g);
    svg('path', { d: `M${X(10) - 22},${Y - 22} A22 22 0 0 1 ${X(10) - 22},${Y + 22}`, fill: 'none' }, g);
    [0, 5, 9, 10].forEach(v => {
      svg('line', { x1: X(v), x2: X(v), y1: Y + 30, y2: Y + 44, stroke: C.mutedL, 'stroke-width': 2 }, g);
      T(g, X(v), Y + 76, String(v), { fill: C.mutedL, 'font-size': 22, 'text-anchor': 'middle', 'font-family': 'var(--mono)' });
    });
    el._mark = svg('g', {}, g);
    svg('path', { d: `M0,${Y - 40} L-12,${Y - 62} H12 Z`, fill: C.ink }, el._mark);
    el._X = X;
    const msg = svg('g', { 'data-step': 1, 'data-anim': 'rise', 'data-delay': 1.2 }, g);
    T(msg, 0, 400, '9 ou plus : faille critique', { fill: C.redText, 'font-size': 28, 'font-weight': 600 });
    T(msg, 0, 446, 'Le build échoue, rien n’est publié.', { 'font-size': 26 });
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
    T(g, 190, 712, 'Pull request : staging → main', { 'font-size': 26, 'font-weight': 600 });
    svg('circle', { cx: 206, cy: 760, r: 15, fill: C.red }, g);
    svg('path', { d: 'M199,753 L213,767 M213,753 L199,767', stroke: '#fff', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
    T(g, 236, 768, 'Pipeline rouge', { fill: C.redText, 'font-size': 24, 'font-weight': 600 });
    svg('rect', { x: 1330, y: 696, width: 400, height: 78, rx: 14, fill: C.green }, g);
    T(g, 1530, 744, 'Fusionner quand même', { fill: '#ffffff', 'font-size': 24, 'font-weight': 600, 'text-anchor': 'middle' });
    T(g, 1300, 744, 'bouton actif', { fill: C.mutedL, 'font-size': 22, 'text-anchor': 'end' });
  },
});

// ── Two lanes: GitHub Secrets feed the pipeline; a sealed secret crosses Git and opens only in the cluster.
Deck.slide('secrets', {
  setup(el) {
    const a = el.querySelector('.art');
    const top = svg('g', { 'data-step': 1, 'data-anim': 'rise' }, a);
    T(top, 150, 450, 'Pour le pipeline', { fill: C.mutedL, 'font-weight': 600 });
    box(top, 150, 480, 430, 110);
    svg('circle', { cx: 205, cy: 535, r: 16, fill: 'none', stroke: C.green, 'stroke-width': 5 }, top);
    svg('path', { d: 'M221,535 H262 M248,535 V550 M260,535 V546', stroke: C.green, 'stroke-width': 5, fill: 'none' }, top);
    T(top, 290, 528, 'Secrets GitHub', { 'font-weight': 600 });
    T(top, 290, 560, 'ACR_*, SONAR_TOKEN…', { fill: C.mutedL, 'font-size': 21, 'font-family': 'var(--mono)' });
    arrow(top, 600, 535, 1080, 535, { col: C.green });
    box(top, 1100, 480, 520, 110);
    T(top, 1130, 528, 'Pipeline', { 'font-weight': 600 });
    T(top, 1130, 560, 'valeur affichée : ***  (jamais en clair)', { fill: C.mutedL, 'font-size': 21 });

    const bot = svg('g', { 'data-step': 2, 'data-anim': 'rise' }, a);
    T(bot, 150, 700, 'Pour l’application', { fill: C.mutedL, 'font-weight': 600 });
    box(bot, 150, 730, 430, 130);
    T(bot, 180, 780, 'Dépôt Git', { 'font-weight': 600 });
    T(bot, 180, 814, 'SealedSecret : chiffré', { fill: C.mutedL, 'font-size': 22 });
    svg('line', { x1: 600, x2: 1250, y1: 795, y2: 795, stroke: C.line, 'stroke-width': 4, 'stroke-dasharray': '10 10' }, bot);
    const hx = 1400, hy = 795, hr = 82;
    svg('path', { d: [0, 1, 2, 3, 4, 5].map(k => { const t = Math.PI / 3 * k - Math.PI / 2; return `${k ? 'L' : 'M'}${(hx + hr * Math.cos(t)).toFixed(1)},${(hy + hr * Math.sin(t)).toFixed(1)}`; }).join('') + 'Z', fill: '#ffffff', stroke: '#2f6fde', 'stroke-width': 3 }, bot);
    T(bot, hx, hy + 8, 'Cluster', { fill: '#1f57bd', 'font-weight': 600, 'text-anchor': 'middle' });
    T(bot, 1510, 786, 'Seul le cluster', { 'font-size': 24 });
    T(bot, 1510, 818, 'peut l’ouvrir.', { 'font-size': 24 });
    el._lk = lock(bot, 0, 0, C.ink);
  },
  frame(el, st) {
    const p = st.p(2, .5, 1.4, ease.inOutCubic), x = lerp(530, 1295, p);
    el._lk.g.setAttribute('transform', `translate(${x},${778})`);
    const open = st.p(2, 1.9, .5, ease.outBack);
    el._lk.sh.setAttribute('transform', `translate(0,${-10 * open})`);
    const col = mix(C.ink, C.green, open);
    el._lk.sh.style.stroke = col; el._lk.body.style.fill = col;
  },
});

// ── GitOps companion: the manifest's image line takes the new tag, then the bot commits it.
Deck.slide('gitops', {
  setup(el) {
    const g = el.querySelector('.bump');
    T(g, 0, 40, 'k8s/staging/backend/spring-boot.yaml', { fill: C.mutedL, 'font-size': 20, 'font-family': 'var(--mono)' });
    box(g, 0, 60, 440, 150);
    T(g, 24, 108, 'image: …/zawedni-backend:', { 'font-size': 21, 'font-family': 'var(--mono)' });
    el._old = T(g, 24, 160, 'ba2b5ef…-staging', { fill: C.mutedL, 'font-size': 24, 'font-family': 'var(--mono)', 'font-weight': 600 });
    el._new = T(g, 24, 160, '1e6a01e…-staging', { fill: '#083f1f', 'font-size': 24, 'font-family': 'var(--mono)', 'font-weight': 600 });
    el._hl = svg('rect', { x: 14, y: 128, width: 300, height: 46, rx: 10, fill: '#cfe8d7' }, g);
    g.insertBefore(el._hl, el._old);
    const c = svg('g', { 'data-step': 2, 'data-anim': 'rise' }, g);
    box(c, 0, 250, 440, 140, { stroke: C.green });
    T(c, 24, 296, 'Commit de ZAWEDNI CI Bot', { 'font-size': 22, 'font-weight': 600 });
    T(c, 24, 332, 'ci: update backend image', { 'font-size': 20, 'font-family': 'var(--mono)', fill: C.mutedL });
    T(c, 24, 366, 'Vérifié sur staging.', { 'font-size': 22, fill: C.green, 'font-weight': 600 });
    const pr = svg('g', { 'data-step': 2, 'data-anim': 'rise', 'data-delay': .5 }, g);
    box(pr, 0, 430, 440, 140, { stroke: '#e39a0b', 'stroke-dasharray': '10 8' });
    T(pr, 24, 476, 'Production : même mécanisme', { 'font-size': 22, fill: '#8f5a00', 'font-weight': 600 });
    T(pr, 24, 510, 'prévu, pas encore démontré.', { 'font-size': 22, fill: '#8f5a00' });
    T(pr, 24, 546, 'Manifeste encore en :latest', { 'font-size': 20, 'font-family': 'var(--mono)', fill: C.mutedL });
  },
  frame(el, st) {
    const p = st.p(1, .3, .8, ease.inOutCubic);
    el._old.style.opacity = 1 - p; el._new.style.opacity = p;
    el._old.setAttribute('transform', `translate(0,${-20 * p})`);
    el._new.setAttribute('transform', `translate(0,${20 * (1 - p)})`);
    el._hl.style.opacity = p;
  },
});

// ── ArgoCD loop: Git → ArgoCD → pods, then the screenshot.
Deck.slide('argocd', {
  steps: 2,
  setup(el) {
    const a = el.querySelector('.art'), g = svg('g', { 'data-step': 1, 'data-anim': 'rise' }, a);
    box(g, 170, 370, 250, 96, { stroke: C.green });
    T(g, 295, 412, 'Git', { 'font-weight': 600, 'text-anchor': 'middle' });
    T(g, 295, 444, 'manifestes', { fill: C.mutedL, 'font-size': 21, 'text-anchor': 'middle' });
    arrow(g, 295, 470, 295, 540, { col: C.green });
    svg('circle', { cx: 295, cy: 610, r: 64, fill: '#ffffff', stroke: '#2f6fde', 'stroke-width': 3 }, g);
    T(g, 295, 618, 'ArgoCD', { fill: '#1f57bd', 'font-weight': 600, 'text-anchor': 'middle' });
    arrow(g, 295, 678, 295, 748, { col: '#2f6fde' });
    const hx = 295, hy = 820, hr = 68;
    svg('path', { d: [0, 1, 2, 3, 4, 5].map(k => { const t = Math.PI / 3 * k - Math.PI / 2; return `${k ? 'L' : 'M'}${(hx + hr * Math.cos(t)).toFixed(1)},${(hy + hr * Math.sin(t)).toFixed(1)}`; }).join('') + 'Z', fill: '#ffffff', stroke: '#2f6fde', 'stroke-width': 3 }, g);
    T(g, hx, hy + 8, 'Pods', { fill: '#1f57bd', 'font-weight': 600, 'text-anchor': 'middle' });
    T(g, 400, 600, 'compare Git', { 'font-size': 24 });
    T(g, 400, 632, 'et le cluster', { 'font-size': 24 });
    T(g, 400, 802, 'staging ← branche staging', { 'font-size': 21, fill: C.mutedL });
    T(g, 400, 834, 'production ← branche main', { 'font-size': 21, fill: C.mutedL });
    el._sync = svg('circle', { r: 9, fill: '#2f6fde' }, g);
    const r = svg('g', { 'data-step': 2, 'data-anim': 'rise', 'data-delay': .3 }, a);
    T(r, 150, 950, 'Tout passe par Git,', { 'font-size': 24, 'font-weight': 600, fill: C.green });
    T(r, 150, 982, 'jamais par kubectl.', { 'font-size': 24, 'font-weight': 600, fill: C.green });
  },
  frame(el, st) {
    const p = st.p(1, .5, 1.6, ease.inOutCubic);
    el._sync.setAttribute('cx', 295); el._sync.setAttribute('cy', lerp(470, 752, p));
    el._sync.style.opacity = p > 0 && p < 1 ? 1 : 0;
  },
});

// ── The path of a change: feature → develop → staging → main, what runs at each PR, the fix loop in staging.
Deck.slide('parcours', {
  steps: 3,
  setup(el) {
    const a = el.querySelector('.art'), Y = 410, XS = [300, 700, 1100, 1500];
    const names = ['feature', 'develop', 'staging', 'main'];
    svg('line', { x1: 300, x2: 1500, y1: Y, y2: Y, stroke: C.line, 'stroke-width': 4 }, a);
    el._lit = svg('line', { x1: 300, x2: 300, y1: Y, y2: Y, stroke: C.green, 'stroke-width': 6, 'stroke-linecap': 'round' }, a);
    el._nodes = XS.map((x, i) => {
      const g = svg('g', {}, a);
      const r = svg('rect', { x: x - 90, y: Y - 30, width: 180, height: 60, rx: 30, fill: '#ffffff', stroke: C.line, 'stroke-width': 3 }, g);
      T(g, x, Y + 9, names[i], { 'font-weight': 600, 'text-anchor': 'middle', 'font-family': 'var(--mono)' });
      return r;
    });
    [500, 900, 1300].forEach((x, i) => {
      const b = svg('g', { 'data-step': i + 1, 'data-anim': 'pop' }, a);
      svg('rect', { x: x - 34, y: Y - 64, width: 68, height: 36, rx: 18, fill: C.ink }, b);
      T(b, x, Y - 38, 'PR', { fill: '#ffffff', 'font-size': 20, 'font-weight': 700, 'text-anchor': 'middle' });
    });
    const card = (step, x, title, lines, o = {}) => {
      const g = svg('g', { 'data-step': step, 'data-anim': 'rise', 'data-delay': o.delay || .3 }, a);
      box(g, x - 175, 480, 350, o.h || 230, o.box || {});
      T(g, x - 150, 526, title, { 'font-weight': 600, 'font-size': 24, fill: o.tcol || C.ink });
      lines.forEach((t, k) => T(g, x - 150, 566 + k * 34, t, { 'font-size': 22, fill: C.mutedL, ...(o.line && o.line[k] || {}) }));
      return g;
    };
    card(0, 300, 'On code ici', ['une branche par', 'modification']);
    card(1, 700, 'PR vers develop', ['Semgrep', 'mobile, workflow-guards :', 'si leurs fichiers changent', 'aucune image']);
    card(2, 1100, 'PR, puis fusion', ['tous les contrôles', 'image :sha-staging', 'ArgoCD → staging'], { h: 380, line: [{}, {}, { fill: C.green, 'font-weight': 600 }] });
    // human check + the fix loop, inside the staging card
    const v = svg('g', { 'data-step': 2, 'data-anim': 'rise', 'data-delay': .8 }, a);
    svg('circle', { cx: 966, cy: 690, r: 9, fill: C.green }, v);
    svg('path', { d: 'M952,714 Q966,698 980,714', fill: 'none', stroke: C.green, 'stroke-width': 5, 'stroke-linecap': 'round' }, v);
    T(v, 994, 712, 'validation humaine', { 'font-size': 22, fill: C.green, 'font-weight': 600 });
    const chip = (y, t, col, tcol, d) => {
      const g = svg('g', { 'data-step': 2, 'data-anim': 'pop', 'data-delay': d }, a);
      svg('circle', { cx: 958, cy: y - 8, r: 10, fill: col }, g);
      T(g, 978, y, t, { 'font-size': 21, fill: tcol, 'font-weight': 600 });
    };
    chip(760, 'anomalie trouvée', '#e39a0b', '#8f5a00', 1.3);
    T(svg('g', { 'data-step': 2, 'data-anim': 'fade', 'data-delay': 1.7 }, a), 950, 796, 'correction, nouveau commit', { 'font-size': 21, fill: C.mutedL });
    chip(834, 'pipeline vert', C.green, C.green, 2.1);
    card(3, 1500, 'PR vers main', ['les mêmes contrôles', 'tournent encore']);
    const pr = svg('g', { 'data-step': 3, 'data-anim': 'rise', 'data-delay': .7 }, a);
    box(pr, 1325, 760, 350, 190, { stroke: '#e39a0b', 'stroke-dasharray': '10 8', fill: '#fffaf0' });
    T(pr, 1350, 804, 'Production', { 'font-weight': 600, fill: '#8f5a00' });
    T(pr, 1350, 842, 'image :sha-latest', { 'font-size': 22, fill: C.mutedL });
    T(pr, 1350, 876, 'déploiement GitOps prévu,', { 'font-size': 22, fill: '#8f5a00' });
    T(pr, 1350, 910, 'pas encore démontré', { 'font-size': 22, fill: '#8f5a00' });
  },
  frame(el, st) {
    const seg = [st.p(1, 0, .7, ease.inOutCubic), st.p(2, 0, .7, ease.inOutCubic), st.p(3, 0, .7, ease.inOutCubic)];
    const x = 300 + 400 * (seg[0] + seg[1] + seg[2]);
    el._lit.setAttribute('x2', x);
    el._nodes.forEach((r, i) => {
      const on = i === 0 ? 1 : seg[i - 1];
      r.style.stroke = mix(C.line, C.green, on);
    });
  },
});
}
