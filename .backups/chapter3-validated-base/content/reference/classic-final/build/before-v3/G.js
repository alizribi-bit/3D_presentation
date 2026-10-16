{
// ── Batch G: routing (Ingress), isolation (NetworkPolicies), storage (volumes).
const AZ = '#2f6fde', AZT = '#1f57bd', MONO = 'var(--mono)';
const T = (p, x, y, text, o = {}) => svg('text', { x, y, text, fill: C.ink, 'font-size': 28, ...o }, p);
const box = (p, x, y, w, h, o = {}) => svg('rect', { x, y, width: w, height: h, rx: 18, fill: '#ffffff', stroke: C.line, 'stroke-width': 3, ...o }, p);
const head = (p, x, y, ang, col) => svg('path', { d: `M${x},${y} L${x - 16 * Math.cos(ang - .45)},${y - 16 * Math.sin(ang - .45)} L${x - 16 * Math.cos(ang + .45)},${y - 16 * Math.sin(ang + .45)} Z`, fill: col }, p);
const arrow = (p, x1, y1, x2, y2, o = {}) => {        // straight edge with its head
  const g = svg('g', {}, p), col = o.col || C.green;
  svg('line', { x1, y1, x2, y2, stroke: col, 'stroke-width': 4, 'stroke-dasharray': o.dash || 'none' }, g);
  head(g, x2, y2, Math.atan2(y2 - y1, x2 - x1), col);
  return g;
};
const node = (p, x, y, w, h, title, sub, o = {}) => {  // a box with a centred title and an optional detail line
  const g = svg('g', {}, p);
  box(g, x, y, w, h, o.box || {});
  const cx = x + w / 2, ty = sub ? y + h / 2 - 4 : y + h / 2 + 12;
  T(g, cx, ty, title, { 'font-size': 34, 'font-weight': 600, 'text-anchor': 'middle', fill: o.tcol || C.ink });
  if (sub) T(g, cx, ty + 40, sub, { 'font-size': o.subSize || 24, 'text-anchor': 'middle', fill: C.mutedL, ...(o.mono ? { 'font-family': MONO } : {}) });
  return g;
};
const cross = (p, x, y) => svg('path', { d: `M${x - 16},${y - 16} L${x + 16},${y + 16} M${x + 16},${y - 16} L${x - 16},${y + 16}`, stroke: C.red, 'stroke-width': 8, 'stroke-linecap': 'round', fill: 'none' }, p);

// ── Routing: one public address → Ingress NGINX → host → path → internal service. The AI service is never exposed.
Deck.slide('routage', {
  steps: 2,
  setup(el) {
    const a = el.querySelector('.art');
    const s1 = svg('g', { 'data-step': 1, 'data-anim': 'rise' }, a);
    const two = (x, l1, l2, o) => { box(s1, x, 480, 210, 140, o); [l1, l2].forEach((t, k) => T(s1, x + 105, 540 + k * 44, t, { 'font-size': 34, 'font-weight': 600, 'text-anchor': 'middle' })); };
    two(150, 'Adresse', 'publique');
    arrow(s1, 362, 550, 406, 550);
    two(410, 'Ingress', 'NGINX', { stroke: C.green });
    svg('path', { d: 'M622,550 H660 V420 H692 M660,550 V680 H692', fill: 'none', stroke: C.green, 'stroke-width': 4 }, s1);
    head(s1, 698, 420, 0, C.green); head(s1, 698, 680, 0, C.green);
    node(s1, 700, 360, 420, 120, 'Hôte client', 'stage.<adresse>.nip.io', { mono: true, subSize: 22 });
    node(s1, 700, 620, 420, 120, 'Hôte admin', 'stage.admin.<adresse>.nip.io', { mono: true, subSize: 22 });

    const s2 = svg('g', { 'data-step': 2, 'data-anim': 'rise' }, a);
    const ok = { box: { stroke: C.green } };
    node(s2, 1350, 365, 250, 100, 'Site client', null, ok);
    node(s2, 1350, 490, 250, 120, 'Backend', ':8080', { ...ok, mono: true });
    node(s2, 1350, 635, 250, 100, 'Site admin', null, ok);
    arrow(s2, 1122, 415, 1346, 415);
    arrow(s2, 1122, 685, 1346, 685);
    arrow(s2, 1122, 455, 1346, 530);
    arrow(s2, 1122, 645, 1346, 570);
    T(s2, 1234, 400, '/', { 'font-size': 26, 'font-family': MONO, 'font-weight': 600, 'text-anchor': 'middle', fill: C.green });
    T(s2, 1234, 670, '/', { 'font-size': 26, 'font-family': MONO, 'font-weight': 600, 'text-anchor': 'middle', fill: C.green });
    T(s2, 1236, 558, '/api · /uploads', { 'font-size': 22, 'font-family': MONO, 'font-weight': 600, 'text-anchor': 'middle', fill: C.green });
    // the AI service: internal, only the backend calls it
    node(s2, 1350, 800, 250, 120, 'Service IA', ':8081', { mono: true, tcol: C.mutedL, box: { fill: '#eef2ee', 'stroke-dasharray': '10 8' } });
    svg('path', { d: 'M1602,550 H1660 V860 H1612', fill: 'none', stroke: C.mutedL, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, s2);
    head(s2, 1604, 860, Math.PI, C.mutedL);
    T(s2, 1350, 965, 'interne, appelé par le backend', { 'font-size': 24, fill: C.mutedL });
    // the single source of the public address
    const ph = svg('g', { 'data-step': 2, 'data-anim': 'rise', 'data-delay': .5 }, a);
    box(ph, 700, 800, 600, 130, { stroke: C.green });
    T(ph, 730, 850, 'PUBLIC_HOST', { 'font-size': 28, 'font-family': MONO, 'font-weight': 600, fill: C.green });
    T(ph, 928, 850, '· source unique', { 'font-size': 28 });
    T(ph, 730, 898, 'vérifiée par ci-public-host', { 'font-size': 28, fill: C.mutedL });
  },
});

// ── Isolation: deny by default, then only the useful flows. Green = allowed, red crossed = refused.
Deck.slide('isolation', {
  steps: 1,
  setup(el) {
    const a = el.querySelector('.art');
    svg('rect', { x: 150, y: 345, width: 1620, height: 440, rx: 26, fill: 'none', stroke: AZ, 'stroke-width': 3, 'stroke-dasharray': '12 10' }, a);
    T(a, 180, 388, 'Cluster staging · refus par défaut', { 'font-size': 24, fill: AZT, 'font-weight': 600 });
    // allowed flows first, so the nodes sit on top of them
    arrow(a, 460, 470, 616, 552);
    arrow(a, 460, 660, 616, 588);
    arrow(a, 880, 570, 1026, 570);
    arrow(a, 1290, 548, 1456, 470);
    arrow(a, 1290, 592, 1456, 660);
    // refused flows
    svg('line', { x1: 460, y1: 710, x2: 1452, y2: 710, stroke: C.red, 'stroke-width': 4, 'stroke-dasharray': '12 10' }, a);
    cross(a, 960, 710);
    T(a, 990, 754, 'client → base : refusé', { 'font-size': 24, fill: C.redText, 'font-weight': 600 });
    svg('line', { x1: 325, y1: 722, x2: 325, y2: 868, stroke: C.red, 'stroke-width': 4, 'stroke-dasharray': '12 10' }, a);
    cross(a, 325, 820);
    T(a, 360, 828, 'refusé', { 'font-size': 24, fill: C.redText, 'font-weight': 600 });
    node(a, 190, 420, 270, 100, 'Site admin', null);
    node(a, 190, 620, 270, 100, 'Site client', null);
    node(a, 620, 520, 260, 100, 'Ingress', null, { box: { stroke: C.green } });
    node(a, 1030, 520, 260, 100, 'Backend', null);
    node(a, 1460, 420, 280, 100, 'Service IA', null);
    // PostgreSQL as a cylinder
    const pg = svg('g', {}, a), px = 1460, pw = 280, py = 625, ph = 110, ry = 16;
    svg('path', { d: `M${px},${py} V${py + ph} A${pw / 2} ${ry} 0 0 0 ${px + pw},${py + ph} V${py} A${pw / 2} ${ry} 0 0 0 ${px},${py} Z`, fill: '#ffffff', stroke: C.line, 'stroke-width': 3 }, pg);
    svg('path', { d: `M${px},${py} A${pw / 2} ${ry} 0 0 0 ${px + pw},${py}`, fill: 'none', stroke: C.line, 'stroke-width': 3 }, pg);
    T(pg, px + pw / 2, py + 72, 'PostgreSQL', { 'font-size': 34, 'font-weight': 600, 'text-anchor': 'middle' });
    node(a, 190, 870, 270, 100, 'Internet', null, { box: { fill: '#eef2ee' } });
    // step 1: Calico enforces them; one case still open
    const s1 = svg('g', { 'data-step': 1, 'data-anim': 'rise' }, a);
    svg('rect', { x: 620, y: 868, width: 580, height: 84, rx: 42, fill: C.green }, s1);
    T(s1, 910, 920, 'Calico · 10 tests sur 11 · 03/10', { 'font-size': 28, 'font-weight': 600, 'text-anchor': 'middle', fill: '#ffffff' });
  },
});

// ── Storage: PostgreSQL on a 5 GB persistent volume (Azure disk); uploads on their own volume.
Deck.slide('stockage', {
  steps: 1,
  setup(el) {
    const a = el.querySelector('.art');
    node(a, 150, 360, 390, 130, 'PostgreSQL 16', '1 pod');
    arrow(a, 542, 425, 636, 425);
    node(a, 640, 360, 420, 130, 'Volume 5 Go', 'ReadWriteOnce', { mono: true, box: { stroke: C.green } });
    arrow(a, 1062, 425, 1156, 425, { col: AZ });
    node(a, 1160, 360, 360, 130, 'Disque Azure', null, { tcol: AZT, box: { stroke: AZ } });
    T(a, 150, 540, 'Si le pod redémarre, les données restent.', { 'font-size': 28, fill: C.mutedL });
    node(a, 150, 590, 390, 130, 'Backend', 'fichiers envoyés');
    arrow(a, 542, 655, 636, 655);
    node(a, 640, 590, 420, 130, 'Volume uploads', '5 Go · séparé', { box: { stroke: C.green } });
  },
});
}
