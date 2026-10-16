// ── Batch B · scrum, docker, terraform, environnements, dix-pipelines, r-ip
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

  // ── 6 · Scrum: eleven weeks, five sprints in a row, three releases, sprint 6 in parallel (Gantt of the report, ch1)
  Deck.slide('scrum', {
    steps: 2,
    setup(el) {
      const g = el.querySelector('.art'), X = 470, W = 1300 / 11, x = w => X + (w - 1) * W;
      for (let w = 1; w <= 12; w++) svg('line', { x1: x(w), x2: x(w), y1: 430, y2: 905, stroke: C.line, 'stroke-width': 2, 'stroke-dasharray': '4 8' }, g);
      for (let w = 1; w <= 11; w++) T(g, x(w) + W / 2, 948, 'S' + w, { size: 22, fill: C.mutedL, a: 'middle' });
      T(g, 150, 948, 'Semaines', { size: 22, fill: C.mutedL });
      const S = [['Sprint 1', 'Docker', 1, 2], ['Sprint 2', 'Infra Azure', 3, 4], ['Sprint 3', 'Pipeline CI', 5, 7],
                 ['Sprint 4', 'GitOps', 8, 9], ['Sprint 5', 'Supervision', 10, 11]];
      el._bars = S.map(([n, what, a, b], i) => {
        const y = 440 + i * 78, w = (b - a + 1) * W - 6;
        T(g, 150, y + 36, n, { w: 600 });
        const r = svg('rect', { x: x(a), y, width: 0, height: 54, rx: 12, fill: G }, g);
        const t = T(g, x(a) + 18, y + 35, what, { size: 22, w: 600, fill: '#ffffff' });
        return { r, t, w, i };
      });
      // sprint 6: the check, in parallel from week 5 to week 11
      const y6 = 838;
      el._s6 = svg('g', {}, g);
      T(el._s6, 150, y6 + 36, 'Sprint 6', { w: 600, fill: G });
      el._s6r = svg('rect', { x: x(5), y: y6, width: 0, height: 54, rx: 12, fill: '#ffffff', stroke: G, 'stroke-width': 3, 'stroke-dasharray': '10 7' }, el._s6);
      el._s6t = T(el._s6, x(5) + 18, y6 + 35, 'Vérification des contrôles, en parallèle', { size: 22, w: 600, fill: GD });
      el._s6w = 7 * W - 6;
      // releases (step 1): three bands over the weeks
      const R = [['Release 1', 'fondations', 1, 4], ['Release 2', 'livraison', 5, 9], ['Release 3', 'exploitation', 10, 11]];
      R.forEach(([r, what, a, b], i) => {
        const band = svg('g', { 'data-step': 1, 'data-anim': 'drop', 'data-delay': i * .1 }, g);
        svg('rect', { x: x(a), y: 336, width: (b - a + 1) * W - 6, height: 70, rx: 12, fill: '#e3ebe5' }, band);
        T(band, x(a) + 16, 363, r, { size: 22, w: 600 });
        T(band, x(a) + 16, 393, what, { size: 22, fill: C.mutedL });
      });
    },
    frame(el, st) {
      for (const b of el._bars) {
        const p = st.p(0, .3 + b.i * .12, .7, ease.outCubic);
        b.r.setAttribute('width', +(b.w * p).toFixed(1));
        b.t.style.opacity = clamp(p * 2 - 1, 0, 1);
      }
      const q = st.p(2, .1, 1, ease.inOutCubic);
      el._s6r.setAttribute('width', +(el._s6w * q).toFixed(1));
      el._s6.style.opacity = st.p(2, 0, .3);
      el._s6t.style.opacity = clamp(q * 2 - 1, 0, 1);
    },
  });

  // ── 10 · Docker: the same image on the laptop and in the cloud, Compose in local (step 1);
  //         then the image sizes (report ch4): backend 138, client 30, admin 26 Mo; AI over 4 Go → 928 Mo; mobile → APK (step 2)
  Deck.slide('docker', {
    steps: 2,
    setup(el) {
      const g = el.querySelector('.art');
      const d = svg('g', { 'data-step': 0, 'data-anim': 'fade', 'data-out': 2 }, g);
      // laptop
      svg('rect', { x: 330, y: 370, width: 360, height: 230, rx: 18, fill: '#ffffff', stroke: C.ink, 'stroke-width': 4 }, d);
      svg('path', { d: 'M290,612 H730 L700,642 H320 Z', fill: C.ink }, d);
      T(d, 510, 696, 'Sur l’ordinateur', { a: 'middle', w: 600, size: 28 });
      // the cloud (Azure)
      svg('path', { d: 'M1250,602 C1185,602 1170,530 1222,512 C1210,452 1282,420 1325,455 C1350,390 1460,388 1482,460 C1545,440 1600,490 1572,542 C1620,560 1605,602 1560,602 Z',
        fill: '#e8f0fd', stroke: AZ, 'stroke-width': 4 }, d);
      T(d, 1390, 696, 'Dans le cloud (AKS)', { a: 'middle', w: 600, size: 28, fill: AZT });
      // step 1: the image appears on the laptop, then the same one in the cloud
      imageIcon(svg('g', { 'data-step': 1, 'data-anim': 'pop' }, d), 425, 425);
      const way = svg('g', { 'data-step': 1, 'data-anim': 'fade', 'data-delay': .35 }, d);
      arrow(way, 780, 500, 1150, 500);
      T(way, 965, 476, 'la même image', { a: 'middle', size: 24, fill: C.mutedL });
      imageIcon(svg('g', { 'data-step': 1, 'data-anim': 'pop', 'data-delay': .7 }, d), 1305, 472, .8, AZ);
      const one = svg('g', { 'data-step': 1, 'data-anim': 'rise', 'data-delay': 1 }, d);
      T(one, 150, 822, 'Une image par service serveur', { w: 600, size: 30 });
      T(one, 150, 866, 'backend, site client, site admin, IA', { size: 28, fill: C.mutedL });
      const cmp = svg('g', { 'data-step': 1, 'data-anim': 'rise', 'data-delay': 1.2 }, d);
      svg('rect', { x: 1190, y: 785, width: 580, height: 76, rx: 14, fill: C.ink }, cmp);
      T(cmp, 1222, 834, '$ docker compose up', { mono: true, size: 28, fill: '#e8f3ec' });
      T(cmp, 1190, 906, 'toute la plateforme, en local', { size: 28, fill: C.mutedL });

      // step 2: image sizes on one scale
      const X = 430, k = 1000 / 4500, x = v => X + v * k;
      const axes = svg('g', { 'data-step': 2, 'data-anim': 'fade', 'data-delay': .3 }, g);
      for (const v of [1000, 2000, 3000, 4000]) {
        svg('line', { x1: x(v), x2: x(v), y1: 400, y2: 880, stroke: C.line, 'stroke-width': 2, 'stroke-dasharray': '4 8' }, axes);
        T(axes, x(v), 922, `${v / 1000} 000 Mo`, { size: 22, fill: C.mutedL, a: 'middle' });
      }
      svg('line', { x1: X, x2: X, y1: 400, y2: 880, stroke: C.mutedL, 'stroke-width': 2 }, axes);
      const rows = [['Backend', 138, 430], ['Site client', 30, 520], ['Site admin', 26, 610]];
      el._rows = rows.map(([n, v, y], i) => {
        const r = svg('g', { 'data-step': 2, 'data-anim': 'fade', 'data-delay': .4 + i * .1 }, g);
        T(r, 150, y + 37, n, { w: 600, size: 28 });
        const bar = svg('rect', { x: X, y, width: 0, height: 52, rx: 8, fill: G }, r);
        T(r, x(v) + 18, y + 37, `${v} Mo`, { w: 600, size: 28, fill: G });
        return { bar, w: v * k, i };
      });
      // the AI image: a ghost of the old size, then the real one
      T(svg('g', { 'data-step': 2, 'data-anim': 'fade', 'data-delay': .7 }, g), 150, 787, 'Service IA', { w: 600, size: 28 });
      el._ghost = svg('rect', { x: X, y: 750, width: 0, height: 52, rx: 8, fill: '#f3e9d6', stroke: AMBT, 'stroke-width': 3, 'stroke-dasharray': '10 7' }, g);
      el._gw = 4096 * k;
      el._ghostLab = T(g, x(4096), 728, 'avant : plus de 4 Go', { size: 24, w: 600, fill: AMBT, a: 'end' });
      el._ai = svg('rect', { x: X, y: 750, width: 0, height: 52, rx: 8, fill: G }, g);
      el._aiLab = T(g, x(928) + 18, 842, '928 Mo avec PyTorch CPU', { w: 600, size: 28, fill: G });
      el._aw = 928 * k;
      // mobile: no image, an APK
      const m = svg('g', { 'data-step': 2, 'data-anim': 'pop', 'data-delay': 2.4 }, g);
      svg('rect', { x: 1480, y: 420, width: 290, height: 220, rx: 20, fill: '#ffffff', stroke: C.line, 'stroke-width': 3 }, m);
      T(m, 1510, 476, 'Mobile', { size: 34, w: 600 });
      arrow(m, 1512, 528, 1570, 528, G);
      T(m, 1588, 538, 'APK', { size: 30, w: 600, mono: true, fill: G });
      T(m, 1510, 600, 'pas d’image', { size: 28, fill: C.mutedL });
    },
    frame(el, st) {
      for (const r of el._rows) r.bar.setAttribute('width', +(r.w * st.p(2, .5 + r.i * .1, .6, ease.outCubic)).toFixed(1));
      const up = st.p(2, .8, .8, ease.inOutCubic), down = st.p(2, 1.9, .8, ease.inOutCubic);
      el._ghost.setAttribute('width', +(el._gw * up).toFixed(1));
      el._ghost.style.opacity = st.at(2) ? 1 : 0;
      el._ghostLab.style.opacity = st.p(2, 1.4, .4);
      el._ai.setAttribute('width', +(el._gw * up + (el._aw - el._gw) * down).toFixed(1));
      el._ai.style.fillOpacity = lerp(.35, 1, down);
      el._aiLab.style.opacity = st.p(2, 2.6, .4);
    },
  });

  // ── 11 · Terraform (code-side): main.tf in Git; AKS, ACR and storage described in it (step 1); plan, read, apply (step 2)
  Deck.slide('terraform', {
    setup(el) {
      const g = el.querySelector('.infra');
      svg('rect', { x: 10, y: 20, width: 500, height: 96, rx: 18, fill: '#ffffff', stroke: C.ink, 'stroke-width': 3 }, g);
      svg('path', { d: 'M40,42 h34 l14,14 v40 h-48 Z', fill: '#eef3ef', stroke: C.ink, 'stroke-width': 3 }, g);
      T(g, 110, 62, 'main.tf', { mono: true, w: 600, size: 26 });
      T(g, 110, 96, 'dans le dépôt Git', { size: 22, fill: C.mutedL });
      T(svg('g', { 'data-step': 1, 'data-anim': 'rise' }, g), 10, 166, 'Décrits dans ce code :', { size: 24, w: 600, fill: G });
      [['AKS', 'cluster Kubernetes'], ['ACR', 'registre d’images'], ['Stockage', 'compte Azure']].forEach(([n, sub], i) => {
        const t = svg('g', { 'data-step': 1, 'data-anim': 'pop', 'data-delay': .2 + i * .12 }, g);
        const y = 186 + i * 74;
        svg('rect', { x: 10, y, width: 500, height: 62, rx: 14, fill: '#e8f0fd', stroke: AZ, 'stroke-width': 3 }, t);
        T(t, 32, y + 40, n, { w: 600, fill: AZT });
        T(t, 170, y + 40, sub, { size: 22, fill: C.ink });
      });
      [['terraform plan', 'on relit'], ['terraform apply', 'on applique']].forEach(([cmd, what], i) => {
        const r = svg('g', { 'data-step': 2, 'data-anim': 'rise', 'data-delay': i * .45 }, g);
        const y = 430 + i * 72;
        svg('rect', { x: 10, y, width: 280, height: 54, rx: 12, fill: C.ink }, r);
        T(r, 150, y + 36, cmd, { mono: true, size: 24, fill: '#e8f3ec', a: 'middle' });
        T(r, 310, y + 36, what, { size: 24, w: i ? 600 : 400, fill: i ? G : C.ink });
      });
    },
  });

  // ── 12 · Kubernetes in one sentence (step 0); then one cluster, two lanes: staging deployed, production configured only
  Deck.slide('environnements', {
    steps: 1,
    setup(el) {
      const g = el.querySelector('.art');
      // step 0: what Kubernetes does
      const k = svg('g', { 'data-step': 0, 'data-anim': 'fade', 'data-out': 1 }, g);
      T(k, 150, 380, 'Kubernetes', { size: 40, w: 600 });
      const glyph = [
        (cx, cy) => svg('path', { d: `M${cx - 12},${cy - 18} L${cx + 18},${cy} L${cx - 12},${cy + 18} Z`, fill: '#ffffff' }, k),
        (cx, cy) => svg('path', { d: `M${cx + 18},${cy} A18,18 0 1 1 ${cx + 9},${cy - 15.6} M${cx + 2},${cy - 24} L${cx + 10},${cy - 15} L${cx},${cy - 7}`,
          fill: 'none', stroke: '#ffffff', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, k),
        (cx, cy) => { svg('path', { d: `M${cx - 16},${cy} H${cx + 16}`, stroke: '#ffffff', 'stroke-width': 5 }, k);
          [-1, 1].forEach(s => svg('circle', { cx: cx + 16 * s, cy, r: 8, fill: '#ffffff' }, k)); },
      ];
      [['lance', 'les conteneurs'], ['relance', 's’ils s’arrêtent'], ['relie', 'les conteneurs entre eux']].forEach(([v, sub], i) => {
        const x = 150 + i * 570;
        svg('rect', { x, y: 420, width: 480, height: 290, rx: 22, fill: '#ffffff', stroke: C.line, 'stroke-width': 3 }, k);
        svg('circle', { cx: x + 80, cy: 500, r: 44, fill: G }, k);
        glyph[i](x + 80, 500);
        T(k, x + 40, 620, v, { size: 40, w: 600, fill: G });
        T(k, x + 40, 666, sub, { size: 28, fill: C.mutedL });
      });
      svg('rect', { x: 150, y: 770, width: 1620, height: 120, rx: 22, fill: '#e8f0fd', stroke: AZ, 'stroke-width': 3 }, k);
      T(k, 960, 843, 'AKS = Kubernetes géré par Azure', { size: 36, w: 600, fill: AZT, a: 'middle' });

      // step 1: the cluster and its two lanes
      const c = svg('g', { 'data-step': 1, 'data-anim': 'fade', 'data-delay': .25 }, g);
      svg('rect', { x: 150, y: 330, width: 1620, height: 670, rx: 30, fill: '#f8fbff', stroke: AZ, 'stroke-width': 3 }, c);
      T(c, 190, 386, 'Cluster AKS', { w: 600, fill: AZT, size: 30 });
      T(c, 1730, 386, 'namespaces = séparation logique', { size: 26, fill: C.mutedL, a: 'end' });
      const lane = (x, w, i) => {
        const l = svg('g', { 'data-step': 1, 'data-anim': 'rise', 'data-delay': .4 + i * .14 }, g);
        svg('rect', { x, y: 410, width: w, height: 566, rx: 22, fill: '#ffffff', stroke: i === 1 ? C.line : G, 'stroke-width': i === 1 ? 3 : 4,
          ...(i === 2 ? { 'stroke-dasharray': '14 10' } : {}) }, l);
        return l;
      };
      const ns = (l, x, w, list, dashed, pad = 26, size = 30) => list.forEach(([n, id], j) => {
        const y = 576 + j * 128;
        svg('rect', { x: x + 28, y, width: w - 56, height: 100, rx: 14, fill: dashed ? '#ffffff' : '#eef3ef',
          ...(dashed ? { stroke: '#9fc9ad', 'stroke-width': 3, 'stroke-dasharray': '10 8' } : {}) }, l);
        T(l, x + 28 + pad, y + 50, n, { size, w: 600 });
        if (id) T(l, x + 54, y + 84, id, { size: 22, mono: true, fill: C.mutedL });
      });
      const sg = lane(190, 610, 0);
      T(sg, 218, 466, 'Staging', { size: 36, w: 600, fill: G });
      pill(sg, 218, 490, 'déployé · testé', G, '#ffffff');
      ns(sg, 190, 610, [['backend', 'zawedni-backend'], ['frontend', 'zawedni-frontend'], ['données', 'zawedni-data']]);
      const sh = lane(830, 260, 1);
      T(sh, 858, 466, 'Partagés', { size: 30, w: 600 });
      ns(sh, 830, 260, [['ArgoCD'], ['Supervision']], false, 16, 28);
      const pr = lane(1120, 610, 2);
      T(pr, 1148, 466, 'Production', { size: 36, w: 600, fill: GD });
      pill(pr, 1148, 490, 'configurée dans Git · non déployée', GL, GD);
      ns(pr, 1120, 610, [['backend', 'zawedni-prod-backend'], ['frontend', 'zawedni-prod-frontend'], ['données', 'zawedni-prod-data']], true);
    },
  });

  // ── 14 · Night map, zone 2 lit: ten pipelines in two groups; a backend change lights only ci-backend
  Deck.slide('dix-pipelines', {
    steps: 2, ambient: 24,
    setup(el) {
      const root = el.querySelector('.world'), W = buildWorld(root);
      el._w = W;
      for (const t of W.zones[1].g.querySelectorAll('text')) if (t.textContent.startsWith('8 étapes')) t.style.display = 'none';
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
      cap(2, 0, ['Secrets, Semgrep, adresse publique : à chaque push sur staging ou main.',
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

  // ── 37 · Reserve: sprint 2, the IP changed and four places needed an update; since then k8s/PUBLIC_HOST is the single source,
  //         ci-public-host checks the whole repository, and the APK build reads it too. Everything visible at rest (0 steps).
  Deck.slide('r-ip', {
    steps: 0,
    setup(el) {
      const g = el.querySelector('.art');
      T(g, 150, 384, 'Sprint 2 · panne du load balancer Azure, recréé', { size: 26, w: 600, fill: C.redText });
      // old IP, struck; the new one
      svg('rect', { x: 150, y: 414, width: 340, height: 124, rx: 20, fill: '#ffffff', stroke: C.red, 'stroke-width': 3 }, g);
      T(g, 178, 456, 'ancienne IP', { size: 24, fill: C.mutedL });
      T(g, 178, 506, '20.216.x.x', { size: 24, mono: true, fill: C.redText });
      svg('line', { x1: 172, x2: 330, y1: 498, y2: 498, stroke: C.red, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      arrow(g, 504, 476, 556, 476);
      svg('rect', { x: 570, y: 414, width: 340, height: 124, rx: 20, fill: '#ffffff', stroke: C.ink, 'stroke-width': 3 }, g);
      T(g, 598, 456, 'nouvelle IP', { size: 24, fill: C.mutedL });
      T(g, 598, 506, '20.40.x.x', { size: 24, mono: true });
      arrow(g, 924, 476, 976, 476);
      // cascade: four places to update
      T(g, 990, 440, '4 endroits à mettre à jour', { size: 24, w: 600, fill: AMBT });
      ['manifestes', 'CORS', 'CSP', 'pare-feu'].forEach((n, i) => {
        const x = 990 + i * 198, y = 466;
        svg('rect', { x, y, width: 184, height: 64, rx: 14, fill: '#fdf4e3', stroke: AMB, 'stroke-width': 3 }, g);
        T(g, x + 92, y + 41, n, { size: 24, w: 600, a: 'middle' });
      });
      // since then
      arrow(g, 960, 586, 960, 660, G);
      T(g, 984, 632, 'depuis', { size: 24, fill: C.mutedL });
      // center: the single source
      svg('rect', { x: 660, y: 690, width: 600, height: 230, rx: 22, fill: '#ffffff', stroke: G, 'stroke-width': 4 }, g);
      svg('path', { d: 'M700,724 h44 l18,18 v60 h-62 Z', fill: '#eef3ef', stroke: C.ink, 'stroke-width': 3 }, g);
      T(g, 790, 760, 'k8s/PUBLIC_HOST', { size: 36, w: 600, mono: true });
      pill(g, 790, 782, 'source unique', G, '#ffffff');
      T(g, 700, 884, '<adresse>.nip.io', { size: 26, mono: true, fill: C.mutedL });
      // left: the pipeline that checks the repository
      svg('rect', { x: 150, y: 720, width: 450, height: 170, rx: 20, fill: '#ffffff', stroke: G, 'stroke-width': 3 }, g);
      svg('path', { d: shield(198, 790, 1.6), fill: G }, g);
      T(g, 238, 790, 'ci-public-host', { size: 28, w: 600, mono: true });
      T(g, 238, 834, 'vérifie tout le dépôt', { size: 26 });
      arrow(g, 604, 805, 652, 805, G);
      // right: the APK build reads it
      arrow(g, 1268, 805, 1316, 805, G);
      svg('rect', { x: 1320, y: 720, width: 450, height: 170, rx: 20, fill: '#ffffff', stroke: C.line, 'stroke-width': 3 }, g);
      svg('rect', { x: 1352, y: 752, width: 54, height: 92, rx: 10, fill: 'none', stroke: C.ink, 'stroke-width': 3 }, g);
      T(g, 1430, 790, 'build de l’APK', { size: 28, w: 600 });
      T(g, 1430, 834, 'reçoit l’adresse', { size: 26, fill: C.mutedL });
    },
  });
}
