// ── Batch B · dix-pipelines
{
  const G = '#0d7b3c', GD = '#083f1f', GL = '#cfe8d7', AZ = '#2f6fde', AZT = '#1f57bd', AMB = '#e39a0b', AMBT = '#8f5a00';
  const T = (g, x, y, text, o = {}) => svg('text', { x, y, text, fill: o.fill || C.ink, 'font-size': o.size || 24,
    'font-weight': o.w || 400, 'text-anchor': o.a || 'start', ...(o.mono ? { 'font-family': 'var(--mono)' } : {}) }, g);
  // an image: a box with three slats
  const imageIcon = (g, x, y, s = 1, stroke = C.ink) => {
    const b = svg('g', {}, g);
    svg('rect', { x, y, width: 170 * s, height: 120 * s, rx: 16 * s, fill: '#ffffff', stroke, 'stroke-width': 3 }, b);
    [0, 1, 2].forEach(k => svg('rect', { x: x + (18 + k * 50) * s, y: y + 22 * s, width: 38 * s, height: 76 * s, rx: 6 * s, fill: C.line }, b));
    return b;
  };
  const arrow = (g, x1, y1, x2, y2, col = C.mutedL, o = {}) => {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 14, p = (k) => `${x2 - h * Math.cos(a + k)},${y2 - h * Math.sin(a + k)}`;
    return svg('path', { d: `M${x1},${y1} L${x2},${y2} M${p(.6)} L${x2},${y2} L${p(-.6)}`, stroke: col, 'stroke-width': 4, fill: 'none',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...o }, g);
  };
  const pill = (g, x, y, text, fill, ink) => {
    const w = text.length * 12.6 + 40;
    svg('rect', { x, y, width: w, height: 44, rx: 22, fill }, g);
    T(g, x + w / 2, y + 30, text, { size: 24, w: 600, fill: ink, a: 'middle' });
  };

  // ── 14 · Night map, zone 2 lit: ten pipelines in two groups; a backend change lights only ci-backend
  Deck.slide('dix-pipelines', {
    steps: 2, ambient: 24,
    setup(el) {
      const root = el.querySelector('.world'), W = buildWorld(root);
      el._w = W;
      for (const t of W.zones[1].g.querySelectorAll('text')) if (t.textContent.startsWith('Tests')) t.style.display = 'none';
      const g = svg('g', {}, root), chip = (x, y, name, w) => {
        const r = svg('rect', { x, y, width: w, height: 42, rx: 10, fill: C.night2, stroke: C.faint, 'stroke-width': 2 }, g);
        const t = svg('text', { x: x + w / 2, y: y + 29, text: name, fill: C.muted, 'font-size': 20, 'font-family': 'var(--mono)', 'text-anchor': 'middle' }, g);
        return { r, t };
      };
      const row = (names, x, y) => names.map(n => { const w = n.length * 12.2 + 24, c = chip(x, y, n, w); x += w + 10; return c; });
      svg('text', { x: 575, y: 532, text: 'Composants', fill: C.on, 'font-size': 22, 'font-weight': 600 }, g);
      el._comp = row(['backend', 'client', 'admin', 'ia', 'mobile'], 575, 548);
      const m = el._comp[4].r, mx = +m.getAttribute('x') + +m.getAttribute('width');
      svg('path', { d: `M${mx + 6},569 h22 M${mx + 20},561 l8,8 l-8,8`, stroke: C.muted, 'stroke-width': 2.5, fill: 'none' }, g);
      el._apk = chip(mx + 34, 548, 'APK', 58);
      svg('text', { x: 575, y: 742, text: 'Transversaux', fill: C.on, 'font-size': 22, 'font-weight': 600 }, g);
      el._trans = [...row(['secrets', 'semgrep', 'public-host'], 575, 758), ...row(['infra', 'workflow-guards'], 575, 810)];
      const cap = (step, out, lines) => {
        const c = svg('g', { 'data-step': step, 'data-anim': 'rise', ...(out ? { 'data-out': out } : {}) }, root);
        lines.forEach((l, i) => svg('text', { x: 150, y: 950 + i * 34, text: l, fill: i ? C.muted : C.on, 'font-size': i ? 22 : 24, 'font-weight': i ? 400 : 600 }, c));
      };
      cap(1, 2, ['Pull request vers staging : un fichier du backend change, ci-backend se lance.',
                 'Des contrôles communs au dépôt peuvent s’ajouter.']);
      cap(2, 0, ['Secrets, Semgrep, adresse publique : à chaque pull request et push sur staging ou main.',
                 'Infrastructure et workflows : quand leurs fichiers changent.']);
    },
    frame(el, st) {
      const go = st.p(1, .1, 1.1, ease.inOutCubic), atZone2 = (575 - X0) / L;
      paintWorld(el._w, st, [st.p(1, 0, .4) * .6, 1, 0], atZone2 * go, st.p(1, 0, .4));
      const paint = (c, on) => { c.r.style.stroke = mix('#2a5a41', C.mint, on); c.r.style.fill = mix(C.night2, '#11583a', on); c.t.style.fill = mix(C.muted, '#ffffff', on); };
      const b = st.p(1, .9, .4);
      el._comp.forEach((c, i) => paint(c, i === 0 ? b : 0));
      paint(el._apk, 0);
      el._trans.forEach((c, i) => paint(c, st.p(2, .1 + i * .08, .4)));
    },
  });

}
