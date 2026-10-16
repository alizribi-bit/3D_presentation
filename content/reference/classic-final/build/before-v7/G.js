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
    // step 0: one public address, one entry point
    const s0 = svg('g', { 'data-anim': 'rise' }, a);
    const two = (p, x, l1, l2, o) => { box(p, x, 480, 210, 140, o); [l1, l2].forEach((t, k) => T(p, x + 105, 540 + k * 44, t, { 'font-size': 34, 'font-weight': 600, 'text-anchor': 'middle' })); };
    two(s0, 150, 'Adresse', 'publique');
    arrow(s0, 362, 550, 406, 550);
    two(s0, 410, 'Ingress', 'NGINX', { stroke: C.green });
    // step 1: the site name picks the site
    const s1 = svg('g', { 'data-step': 1, 'data-anim': 'rise' }, a);
    svg('path', { d: 'M622,550 H660 V420 H692 M660,550 V680 H692', fill: 'none', stroke: C.green, 'stroke-width': 4 }, s1);
    head(s1, 698, 420, 0, C.green); head(s1, 698, 680, 0, C.green);
    node(s1, 700, 360, 420, 120, 'Nom client', 'stage.<adresse>.nip.io', { mono: true, subSize: 22, box: { stroke: C.green } });
    node(s1, 700, 620, 420, 120, 'Nom admin', 'stage.admin.<adresse>.nip.io', { mono: true, subSize: 22, box: { stroke: C.green } });
    // step 2: the path picks the service
    const s2 = svg('g', { 'data-step': 2, 'data-anim': 'rise' }, a);
    const ok = { box: { stroke: AZ } };
    node(s2, 1350, 365, 250, 100, 'Site client', null, ok);
    node(s2, 1350, 490, 250, 120, 'Backend', ':8080', { ...ok, mono: true });
    node(s2, 1350, 635, 250, 100, 'Site admin', null, ok);
    arrow(s2, 1122, 415, 1346, 415, { col: AZ });
    arrow(s2, 1122, 685, 1346, 685, { col: AZ });
    arrow(s2, 1122, 455, 1346, 530, { col: AZ });
    arrow(s2, 1122, 645, 1346, 570, { col: AZ });
    T(s2, 1234, 400, '/', { 'font-size': 26, 'font-family': MONO, 'font-weight': 600, 'text-anchor': 'middle', fill: AZT });
    T(s2, 1234, 670, '/', { 'font-size': 26, 'font-family': MONO, 'font-weight': 600, 'text-anchor': 'middle', fill: AZT });
    T(s2, 1236, 558, '/api · /uploads', { 'font-size': 22, 'font-family': MONO, 'font-weight': 600, 'text-anchor': 'middle', fill: AZT });
    // the AI service: internal, only the backend calls it
    node(s2, 1350, 800, 250, 120, 'Service IA', ':8081', { mono: true, tcol: C.mutedL, box: { fill: '#eef2ee', 'stroke-dasharray': '10 8' } });
    svg('path', { d: 'M1602,550 H1660 V860 H1612', fill: 'none', stroke: C.mutedL, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, s2);
    head(s2, 1604, 860, Math.PI, C.mutedL);
    T(s2, 1350, 965, 'interne, appelé par l\'API', { 'font-size': 24, fill: C.mutedL });
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
  },
});

// ── Storage: PostgreSQL on a 5 GB persistent volume (Azure disk); uploads on their own volume.
}
