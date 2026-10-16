{
// ── batch A: context (2–5) and architecture choices (7–8). Light slides, green = the chosen path.
const GREEN_L = '#cfe8d7';

// 3 · the lone computer (pulsing commit dot), then it moves aside for the four missing pieces
Deck.slide('manques', {
  steps: 4,
  ambient: 24,
  setup(el) {
    const g = el.querySelector('.art');
    el._pc = svg('g', {}, g);
    const P = el._pc; // drawn around (0,0), placed in frame
    svg('rect', { x: -170, y: -115, width: 340, height: 220, rx: 18, fill: '#ffffff', stroke: C.ink, 'stroke-width': 5 }, P);
    [[0, 150], [40, 210], [80, 120]].forEach(([dy, w]) => svg('rect', { x: -120, y: -70 + dy, width: w, height: 14, rx: 7, fill: C.line }, P));
    svg('path', { d: 'M-225,125 H225 L195,160 H-195 Z', fill: C.ink }, P);
    el._halo = svg('circle', { cx: 95, cy: 45, r: 34, fill: C.green, 'fill-opacity': .18 }, P);
    svg('circle', { cx: 95, cy: 45, r: 16, fill: C.green, stroke: '#ffffff', 'stroke-width': 3 }, P);
  },
  frame(el, st) {
    const m = st.p(1, 0, .7, ease.inOutCubic);
    el._pc.setAttribute('transform', `translate(${lerp(1180, 380, m)},${lerp(560, 480, m)}) scale(${lerp(1.25, .62, m)})`);
    el._halo.setAttribute('r', 34 + 10 * st.life(1.8, 1));
  },
});

// 4 · the question moves up and steps back when the requirements arrive
Deck.slide('question', {
  steps: 1,
  setup(el) { el._q = el.querySelector('.q'); },
  frame(el, st) {
    const m = st.p(1, 0, .6, ease.inOutCubic);
    el._q.style.transform = `translateY(${-90 * m}px)`;
    el._q.style.opacity = lerp(1, .5, m);
  },
});

// 5 · the application existed before; the PFE is the ring of work around it
Deck.slide('perimetre', {
  steps: 1,
  setup(el) {
    const g = el.querySelector('.art');
    el._app = svg('g', {}, g);
    svg('text', { x: 150, y: 400, text: 'Avant le PFE : l’application', fill: C.ink, 'font-size': 30, 'font-weight': 600 }, el._app);
    [['API', 'Spring Boot'], ['Site client', 'React'], ['Site admin', 'React'], ['Mobile', 'Flutter'], ['Service IA', ''], ['PostgreSQL', '']].forEach(([t, s], i) => {
      const x = 150 + (i % 2) * 380, y = 450 + Math.floor(i / 2) * 150;
      svg('rect', { x, y, width: 340, height: 110, rx: 20, fill: '#ffffff', stroke: C.line, 'stroke-width': 2.5 }, el._app);
      svg('text', { x: x + 170, y: s ? y + 50 : y + 65, text: t, fill: C.ink, 'font-size': 28, 'font-weight': 600, 'text-anchor': 'middle' }, el._app);
      if (s) svg('text', { x: x + 170, y: y + 86, text: s, fill: C.mutedL, 'font-size': 24, 'text-anchor': 'middle' }, el._app);
    });
    svg('line', { x1: 945, x2: 945, y1: 370, y2: 960, stroke: C.line, 'stroke-width': 3, 'stroke-dasharray': '8 10' }, g);
    svg('text', { x: 1010, y: 400, text: 'Mon travail dans le PFE : la chaîne', fill: C.green, 'font-size': 30, 'font-weight': 600, 'data-step': 1, 'data-anim': 'fade', 'data-dur': .4 }, g);
    const cx = 1390, cy = 700, r = 205;
    svg('circle', { cx, cy, r, fill: 'none', stroke: C.green, 'stroke-width': 8, 'data-step': 1, 'data-anim': 'draw', 'data-dur': 1 }, g);
    svg('text', { x: cx, y: cy + 9, text: 'l’application', fill: C.mutedL, 'font-size': 26, 'text-anchor': 'middle', 'data-step': 1, 'data-anim': 'fade' }, g);
    ['Préparer les images', 'Créer l’infrastructure', 'Contrôler', 'Déployer', 'Surveiller', 'Vérifier'].forEach((t, i) => {
      const a = -Math.PI / 2 + i * Math.PI / 3, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a), w = 300;
      const p = svg('g', { 'data-step': 1, 'data-anim': 'pop', 'data-delay': .5 + i * .12 }, g);
      svg('rect', { x: x - w / 2, y: y - 30, width: w, height: 60, rx: 30, fill: C.green }, p);
      svg('text', { x, y: y + 9, text: t, fill: '#ffffff', 'font-size': 25, 'font-weight': 600, 'text-anchor': 'middle' }, p);
    });
  },
  frame(el, st) { el._app.style.opacity = lerp(1, .4, st.p(1, 0, .6)); },
});

// 7 · two separate choices: the CI tool, then the platform that runs the services
const ROWS = [[['GitHub Actions'], ['Tester et construire', 'automatiquement'], ['Dépôt déjà sur GitHub ;', 'pas de serveur CI à entretenir']],
              [['AKS sur Azure'], ['Exécuter et organiser', 'les services'], ['Kubernetes géré ;', 'crédit étudiant disponible']]];
const CXS = [150, 590, 1110], RY = i => 430 + i * 190;
const lines = (g, x, yc, ls, a) => ls.forEach((t, j) => svg('text', { x, y: yc + 10 + (j - (ls.length - 1) / 2) * 40, text: t, ...a }, g));
Deck.slide('approches', {
  steps: 2,
  setup(el) {
    const g = el.querySelector('.art');
    ['Choix', 'Besoin', 'Raison du choix'].forEach((t, k) => svg('text', { x: CXS[k], y: 395, text: t, fill: C.mutedL, 'font-size': 26, 'font-weight': 600 }, g));
    svg('line', { x1: 150, x2: 1770, y1: RY(0), y2: RY(0), stroke: C.line, 'stroke-width': 2 }, g);
    ROWS.forEach((r, i) => {
      const row = svg('g', { 'data-step': i + 1, 'data-anim': 'rise', 'data-dur': .5 }, g);
      svg('rect', { x: 130, y: RY(i) + 12, width: 1660, height: 166, rx: 22, fill: '#ffffff', stroke: C.green, 'stroke-width': 3 }, row);
      lines(row, CXS[0] + 20, RY(i) + 95, r[0], { fill: C.green, 'font-size': 34, 'font-weight': 700 });
      lines(row, CXS[1], RY(i) + 95, r[1], { fill: C.ink, 'font-size': 30 });
      lines(row, CXS[2], RY(i) + 95, r[2], { fill: C.ink, 'font-size': 30 });
    });
    svg('text', { x: 150, y: 880, text: 'Contrainte : crédit Azure for Students de 100 $', fill: C.green, 'font-size': 28, 'font-weight': 600, 'data-step': 2, 'data-anim': 'rise', 'data-delay': .5 }, g);
    svg('text', { x: 150, y: 940, text: 'Autres solutions possibles : Jenkins, GitLab CI, Azure Pipelines', fill: C.mutedL, 'font-size': 26, 'data-step': 2, 'data-anim': 'fade', 'data-delay': .8 }, g);
  },
});

// 8 · the DevOps loop: security first sits at the end, then moves into every stage
Deck.slide('devsecops', {
  steps: 2,
  setup(el) {
    const g = el.querySelector('.art'), Y = 600, W = 230;
    const names = ['Coder', 'Construire', 'Tester', 'Livrer', 'Déployer', 'Superviser'];
    names.forEach((t, i) => {
      const x = 150 + i * 278;
      svg('rect', { x, y: Y - 40, width: W, height: 80, rx: 40, fill: '#ffffff', stroke: C.line, 'stroke-width': 3 }, g);
      svg('text', { x: x + W / 2, y: Y + 10, text: t, fill: C.ink, 'font-size': 28, 'font-weight': 600, 'text-anchor': 'middle' }, g);
      if (i < 5) svg('path', { d: `M${x + W + 8},${Y} h30 m-10,-9 l10,9 l-10,9`, stroke: C.mutedL, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      const b = svg('g', { 'data-step': 2, 'data-anim': 'pop', 'data-delay': .5 + (5 - i) * .1 }, g);
      svg('circle', { cx: x + W - 10, cy: Y - 40, r: 24, fill: C.green }, b);
      svg('path', { d: shield(x + W - 10, Y - 40, .8), fill: 'none', stroke: '#ffffff', 'stroke-width': 2.5 }, b);
    });
    svg('path', { d: `M1655,${Y + 40} V${Y + 150} H265 V${Y + 52} m-9,12 l9,-12 l9,12`, stroke: C.line, 'stroke-width': 3, fill: 'none', 'stroke-linejoin': 'round' }, g);
    svg('text', { x: 960, y: Y + 192, text: 'la boucle recommence', fill: C.mutedL, 'font-size': 24, 'text-anchor': 'middle' }, g);
    el._late = svg('g', {}, g);
    svg('circle', { cx: 1700, cy: 430, r: 40, fill: C.mutedL }, el._late);
    svg('path', { d: shield(1700, 430, 1.4), fill: 'none', stroke: '#ffffff', 'stroke-width': 3 }, el._late);
    svg('text', { x: 1635, y: 420, text: 'DevOps : la sécurité arrive à la fin', fill: C.ink, 'font-size': 28, 'font-weight': 600, 'text-anchor': 'end' }, el._late);
    svg('text', { x: 1635, y: 458, text: 'après la livraison : corriger coûte cher', fill: C.mutedL, 'font-size': 28, 'text-anchor': 'end' }, el._late);
    svg('text', { x: 150, y: 440, text: 'DevSecOps : un contrôle dans chaque étape, à chaque changement', fill: C.green, 'font-size': 30, 'font-weight': 600, 'data-step': 2, 'data-anim': 'rise', 'data-delay': .9 }, g);
  },
  frame(el, st) {
    const out = st.p(2, 0, .8, ease.inOutCubic);
    el._late.style.opacity = st.p(1, 0, .5) * (1 - out);
    el._late.setAttribute('transform', `translate(${-300 * out},0)`);
  },
});
}
