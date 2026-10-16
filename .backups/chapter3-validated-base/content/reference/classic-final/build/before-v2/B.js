// ── Batch B · slides 14–21 (scrum … dix-pipelines)
{
  const G = '#0d7b3c', GD = '#083f1f', AZ = '#2f6fde', AZT = '#1f57bd', AMB = '#e39a0b', AMBT = '#8f5a00';
  const T = (g, x, y, text, o = {}) => svg('text', { x, y, text, fill: o.fill || C.ink, 'font-size': o.size || 24,
    'font-weight': o.w || 400, 'text-anchor': o.a || 'start', ...(o.mono ? { 'font-family': 'var(--mono)' } : {}) }, g);
  // the image icon used on the Trivy slide: a box with three slats
  const imageIcon = (g, x, y, s = 1, stroke = C.ink) => {
    const b = svg('g', {}, g);
    svg('rect', { x, y, width: 170 * s, height: 120 * s, rx: 16 * s, fill: '#ffffff', stroke, 'stroke-width': 3 }, b);
    [0, 1, 2].forEach(k => svg('rect', { x: x + (18 + k * 50) * s, y: y + 22 * s, width: 38 * s, height: 76 * s, rx: 6 * s, fill: C.line }, b));
    return b;
  };

  // ── 14 · Scrum: eleven weeks, five sprints in a row, three releases, sprint 6 in parallel (Gantt of the report, ch1)
  Deck.slide('scrum', {
    steps: 2,
    setup(el) {
      const g = el.querySelector('.art'), X = 470, W = 1300 / 11, x = w => X + (w - 1) * W;
      for (let w = 1; w <= 12; w++) svg('line', { x1: x(w), x2: x(w), y1: 430, y2: 905, stroke: C.line, 'stroke-width': 2, 'stroke-dasharray': '4 8' }, g);
      for (let w = 1; w <= 11; w++) T(g, x(w) + W / 2, 945, 'S' + w, { size: 20, fill: C.mutedL, a: 'middle' });
      T(g, 150, 945, 'Semaines', { size: 20, fill: C.mutedL });
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
        svg('rect', { x: x(a), y: 338, width: (b - a + 1) * W - 6, height: 66, rx: 12, fill: '#e3ebe5' }, band);
        T(band, x(a) + 16, 364, r, { size: 21, w: 600 });
        T(band, x(a) + 16, 392, what, { size: 21, fill: C.mutedL });
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

  // ── 15 · Docker: the same image on the laptop and in the cloud; a multi-stage build keeps only the result
  Deck.slide('docker', {
    steps: 1,
    setup(el) {
      const g = el.querySelector('.art');
      // laptop with the image on its screen
      svg('rect', { x: 330, y: 380, width: 360, height: 230, rx: 18, fill: '#ffffff', stroke: C.ink, 'stroke-width': 4 }, g);
      svg('path', { d: 'M290,622 H730 L700,652 H320 Z', fill: C.ink }, g);
      imageIcon(g, 425, 435);
      T(g, 510, 700, 'Sur l’ordinateur', { a: 'middle', w: 600 });
      // the cloud with the same image
      svg('path', { d: 'M1250,612 C1185,612 1170,540 1222,522 C1210,462 1282,430 1325,465 C1350,400 1460,398 1482,470 C1545,450 1600,500 1572,552 C1620,570 1605,612 1560,612 Z',
        fill: '#e8f0fd', stroke: AZ, 'stroke-width': 4 }, g);
      imageIcon(g, 1305, 482, .8, AZ);
      T(g, 1390, 700, 'Dans le cloud (AKS)', { a: 'middle', w: 600, fill: AZT });
      svg('path', { d: 'M780,520 H1150', stroke: C.mutedL, 'stroke-width': 4, 'stroke-dasharray': '12 10', fill: 'none' }, g);
      svg('path', { d: 'M1134,506 L1156,520 L1134,534', stroke: C.mutedL, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, g);
      T(g, 965, 498, 'la même image', { a: 'middle', size: 22, fill: C.mutedL });
      // step 1: multi-stage build, then one command for the whole platform
      const ms = svg('g', { 'data-step': 1, 'data-anim': 'rise' }, g);
      svg('rect', { x: 150, y: 770, width: 520, height: 190, rx: 20, fill: '#eef3ef', stroke: C.line, 'stroke-width': 3 }, ms);
      T(ms, 180, 822, 'Étape 1 · compiler', { w: 600 });
      T(ms, 180, 862, 'sources et outils de build', { size: 22, fill: C.mutedL });
      T(ms, 180, 896, 'grosse étape, jetée ensuite', { size: 22, fill: C.mutedL });
      svg('path', { d: 'M700,865 H800 M784,851 L804,865 L784,879', stroke: G, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, ms);
      svg('rect', { x: 830, y: 800, width: 330, height: 130, rx: 20, fill: '#ffffff', stroke: G, 'stroke-width': 4 }, ms);
      T(ms, 860, 852, 'Étape 2 · image', { w: 600, fill: G });
      T(ms, 860, 892, 'le résultat seulement', { size: 22, fill: C.mutedL });
      const cmp = svg('g', { 'data-step': 1, 'data-anim': 'rise', 'data-delay': .35 }, g);
      svg('rect', { x: 1250, y: 800, width: 520, height: 70, rx: 14, fill: C.ink }, cmp);
      T(cmp, 1280, 845, '$ docker compose up', { mono: true, size: 26, fill: '#e8f3ec' });
      T(cmp, 1250, 912, 'toute la plateforme, en local', { size: 24, fill: C.mutedL });
    },
  });

  // ── 16 · Image sizes (report ch4): backend 138, client 30, admin 26 Mo; AI over 4 Go, then 928 Mo
  Deck.slide('image-ia', {
    steps: 2,
    setup(el) {
      const g = el.querySelector('.art'), X = 470, k = 1150 / 4500, x = v => X + v * k;
      el._x = x;
      for (const v of [1000, 2000, 3000, 4000]) {
        svg('line', { x1: x(v), x2: x(v), y1: 400, y2: 880, stroke: C.line, 'stroke-width': 2, 'stroke-dasharray': '4 8' }, g);
        T(g, x(v), 920, `${v / 1000} 000 Mo`, { size: 20, fill: C.mutedL, a: 'middle' });
      }
      svg('line', { x1: X, x2: X, y1: 400, y2: 880, stroke: C.mutedL, 'stroke-width': 2 }, g);
      const rows = [['Backend', 138, 430], ['Site client', 30, 520], ['Site admin', 26, 610]];
      el._rows = rows.map(([n, v, y], i) => {
        const r = svg('g', { 'data-step': 1, 'data-anim': 'fade', 'data-delay': i * .12 }, g);
        T(r, 150, y + 37, n, { w: 600 });
        const bar = svg('rect', { x: X, y, width: 0, height: 52, rx: 8, fill: G }, r);
        const lab = T(r, x(v) + 18, y + 36, `${v} Mo`, { w: 600, fill: G });
        return { bar, w: v * k, i, lab };
      });
      // the AI image: a ghost of the old size, then the real one
      T(svg('g', { 'data-step': 2, 'data-anim': 'fade' }, g), 150, 787, 'Service IA', { w: 600 });
      el._ghost = svg('rect', { x: X, y: 750, width: 0, height: 52, rx: 8, fill: '#f3e9d6', stroke: AMBT, 'stroke-width': 3, 'stroke-dasharray': '10 7' }, g);
      el._gw = 4096 * k;
      el._ghostLab = svg('g', {}, g);
      T(el._ghostLab, x(4096), 728, 'avant : plus de 4 Go (outils GPU)', { size: 22, w: 600, fill: AMBT, a: 'end' });
      el._ai = svg('rect', { x: X, y: 750, width: 0, height: 52, rx: 8, fill: G }, g);
      el._aiLab = svg('g', {}, g);
      T(el._aiLab, x(928) + 18, 840, '928 Mo avec PyTorch CPU', { w: 600, fill: G });
      el._aw = 928 * k;
    },
    frame(el, st) {
      for (const r of el._rows) r.bar.setAttribute('width', +(r.w * st.p(1, .1 + r.i * .12, .8, ease.outCubic)).toFixed(1));
      const up = st.p(2, .1, 1.1, ease.inOutCubic), down = st.p(2, 1.6, 1, ease.inOutCubic);
      el._ghost.setAttribute('width', +(el._gw * up).toFixed(1));
      el._ghost.style.opacity = st.at(2) ? 1 : 0;
      el._ghostLab.style.opacity = st.p(2, .9, .4);
      el._ai.setAttribute('width', +(el._gw * up + (el._aw - el._gw) * down).toFixed(1));
      el._ai.style.fillOpacity = lerp(.35, 1, down);
      el._aiLab.style.opacity = st.p(2, 2.3, .4);
    },
  });

  // ── 17 · Terraform (code-side): code in Git, then terraform apply creates AKS, ACR and storage
  Deck.slide('terraform', {
    setup(el) {
      const g = el.querySelector('.infra');
      svg('rect', { x: 10, y: 20, width: 500, height: 96, rx: 18, fill: '#ffffff', stroke: C.ink, 'stroke-width': 3 }, g);
      svg('path', { d: 'M40,42 h34 l14,14 v40 h-48 Z', fill: '#eef3ef', stroke: C.ink, 'stroke-width': 3 }, g);
      T(g, 110, 62, 'main.tf', { mono: true, w: 600, size: 26 });
      T(g, 110, 96, 'dans le dépôt Git', { size: 22, fill: C.mutedL });
      const cap = svg('g', { 'data-step': 1, 'data-anim': 'rise' }, g);
      T(cap, 10, 160, 'Le cluster est décrit en code.', { size: 24, w: 600, fill: G });
      T(cap, 10, 194, 'Rien n’est créé à la main.', { size: 24, fill: C.ink });
      const ap = svg('g', { 'data-step': 2, 'data-anim': 'rise' }, g);
      svg('path', { d: 'M260,212 V246 M246,232 L260,250 L274,232', stroke: G, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, ap);
      svg('rect', { x: 120, y: 256, width: 280, height: 56, rx: 12, fill: C.ink }, ap);
      T(ap, 260, 292, 'terraform apply', { mono: true, size: 24, fill: '#e8f3ec', a: 'middle' });
      [['AKS', '2 nœuds · Standard_B2s'], ['ACR', 'registre d’images'], ['Stockage', 'compte de stockage Azure']].forEach(([n, sub], i) => {
        const t = svg('g', { 'data-step': 2, 'data-anim': 'pop', 'data-delay': .4 + i * .12 }, g);
        const y = 336 + i * 74;
        svg('rect', { x: 10, y, width: 500, height: 62, rx: 14, fill: '#e8f0fd', stroke: AZ, 'stroke-width': 3 }, t);
        T(t, 32, y + 40, n, { w: 600, fill: AZT });
        T(t, 170, y + 40, sub, { size: 22, fill: C.ink });
      });
    },
  });

  // ── 18 · One cluster, two lanes: staging and production, each with its own namespaces
  Deck.slide('environnements', {
    steps: 1,
    setup(el) {
      const g = el.querySelector('.art');
      svg('rect', { x: 150, y: 350, width: 1620, height: 620, rx: 30, fill: '#f8fbff', stroke: AZ, 'stroke-width': 3 }, g);
      T(g, 190, 404, 'Cluster AKS · 2 nœuds', { w: 600, fill: AZT, size: 26 });
      const lane = (x, w, head, sub, chips, col, i) => {
        const l = svg('g', { 'data-step': 1, 'data-anim': 'rise', 'data-delay': i * .12 }, g);
        svg('rect', { x, y: 440, width: w, height: 500, rx: 22, fill: '#ffffff', stroke: col, 'stroke-width': 3 }, l);
        T(l, x + 28, 492, head, { w: 600, fill: col === C.line ? C.ink : col, size: 26 });
        T(l, x + 28, 526, sub, { size: 21, fill: C.mutedL });
        chips.forEach((c, k) => {
          svg('rect', { x: x + 28, y: 566 + k * 110, width: w - 56, height: 80, rx: 14, fill: '#eef3ef' }, l);
          T(l, x + 52, 616 + k * 110, c, { mono: true, size: 22 });
        });
      };
      lane(200, 600, 'Staging', 'pour tester · namespaces', ['zawedni-backend', 'zawedni-frontend', 'zawedni-data'], G, 0);
      lane(840, 240, 'Partagés', 'un seul exemplaire', ['ArgoCD', 'Supervision'], C.line, 1);
      lane(1120, 600, 'Production', 'les vrais utilisateurs', ['zawedni-prod-backend', 'zawedni-prod-frontend', 'zawedni-prod-data'], C.ink, 2);
    },
  });

  // ── 19 · The public IP is lost, a new one comes, four places to update
  Deck.slide('panne-ip', {
    steps: 2,
    setup(el) {
      const g = el.querySelector('.art');
      el._old = svg('rect', { x: 150, y: 370, width: 620, height: 150, rx: 22, fill: '#ffffff', stroke: G, 'stroke-width': 4 }, g);
      T(g, 182, 418, 'Adresse IP publique', { size: 22, fill: C.mutedL });
      el._oldIp = T(g, 182, 482, '20.216.206.15', { mono: true, size: 44, w: 600 });
      el._strike = svg('line', { x1: 176, x2: 176, y1: 467, y2: 467, stroke: C.red, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
      const why = svg('g', { 'data-step': 1, 'data-anim': 'rise', 'data-delay': .4 }, g);
      T(why, 150, 572, 'Panne du load balancer, côté Azure', { size: 24, w: 600, fill: C.redText });
      const nw = svg('g', { 'data-step': 1, 'data-anim': 'rise', 'data-delay': .8 }, g);
      svg('rect', { x: 150, y: 620, width: 620, height: 150, rx: 22, fill: '#ffffff', stroke: G, 'stroke-width': 4 }, nw);
      T(nw, 182, 668, 'Nouvelle adresse, load balancer recréé', { size: 22, fill: C.mutedL });
      T(nw, 182, 732, '20.40.132.70', { mono: true, size: 44, w: 600, fill: G });
      el._todo = ['Manifestes Kubernetes', 'CORS du backend', 'CSP des sites web', 'Pare-feu Azure (NSG)'].map((n, i) => {
        const y = 380 + i * 132, c = svg('g', { 'data-step': 2, 'data-anim': 'left', 'data-delay': i * .25 }, g);
        svg('path', { d: `M790,695 C900,695 900,${y + 50} 1010,${y + 50}`, fill: 'none', stroke: C.line, 'stroke-width': 3 }, c);
        svg('rect', { x: 1010, y, width: 760, height: 100, rx: 18, fill: '#ffffff', stroke: G, 'stroke-width': 3 }, c);
        svg('circle', { cx: 1060, cy: y + 50, r: 20, fill: G }, c);
        svg('path', { d: `M1050,${y + 50} l7,8 l14,-16`, fill: 'none', stroke: '#ffffff', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, c);
        T(c, 1100, y + 59, n, { w: 600 });
        return c;
      });
    },
    frame(el, st) {
      const p = st.p(1, 0, .5, ease.outCubic);
      el._old.style.stroke = mix(G, C.red, p);
      el._oldIp.style.fill = mix(C.ink, C.redText, p);
      el._strike.setAttribute('x2', 176 + 340 * st.p(1, .2, .5, ease.inOutCubic));
    },
  });

  // ── 21 · Night map, zone 2 lit: ten pipelines in two groups; a backend change lights only ci-backend
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
      svg('text', { x: 575, y: 532, text: 'Composants', fill: C.on, 'font-size': 20, 'font-weight': 600 }, g);
      el._comp = row(['backend', 'client', 'admin', 'ia', 'mobile'], 575, 548);
      const m = el._comp[4].r, mx = +m.getAttribute('x') + +m.getAttribute('width');
      svg('path', { d: `M${mx + 6},569 h22 M${mx + 20},561 l8,8 l-8,8`, stroke: C.muted, 'stroke-width': 2.5, fill: 'none' }, g);
      el._apk = chip(mx + 34, 548, 'APK', 58);
      svg('text', { x: 575, y: 742, text: 'Transversaux', fill: C.on, 'font-size': 20, 'font-weight': 600 }, g);
      el._trans = [...row(['secrets', 'semgrep', 'public-host'], 575, 758), ...row(['infra', 'workflow-guards'], 575, 810)];
      const cap = (step, out, lines) => {
        const c = svg('g', { 'data-step': step, 'data-anim': 'rise', ...(out ? { 'data-out': out } : {}) }, root);
        lines.forEach((l, i) => svg('text', { x: 150, y: 950 + i * 34, text: l, fill: i ? C.muted : C.on, 'font-size': i ? 22 : 24, 'font-weight': i ? 400 : 600 }, c));
      };
      cap(1, 2, ['Un fichier du backend change : seul ci-backend se lance (path filters).']);
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
}
