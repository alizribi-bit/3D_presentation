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

// Application flows only. Frontend pods serve static pages; browser /api requests
// originate at the public client and reach the backend through Ingress.
// Policy scope: application namespaces frontend/backend/data, not all staging.
Deck.slide('isolation', {
  steps: 1,
  setup(el) {
    const a = el.querySelector('.art');
    const label = (x, y, text, opts = {}) => T(a, x, y, text, { 'font-size': 24, ...opts });
    svg('rect', { x: 900, y: 325, width: 870, height: 410, rx: 22,
      fill: '#cfe8d7', 'fill-opacity': .25, stroke: C.green, 'stroke-width': 2, 'stroke-dasharray': '9 7' }, a);
    label(920, 354, 'Périmètre protégé : interfaces, backend, IA, données', { 'font-size': 22, fill: C.green });
    [['Accès public',150], ["Point d'entrée",520], ['Application',920], ['Services internes',1470]].forEach(([text,x]) => label(x,310,text,{ 'font-weight':600 }));
    // Short orthogonal routes occupy dedicated rows; there is no interface → API edge.
    arrow(a, 430, 575, 555, 575);
    svg('path', { d:'M815,575 H860 V420 H920 M860,575 V660 H920', fill:'none', stroke:C.green, 'stroke-width':4 }, a);
    head(a,920,420,0,C.green); head(a,920,660,0,C.green);
    label(450,550,'web / API',{ 'font-size':20 });
    label(842,400,'pages',{ 'font-size':20, 'text-anchor':'end' }); label(865,635,'/api',{ 'font-size':20 });
    // Internal API → AI and API → PostgreSQL paths remain distinct.
    arrow(a, 1290, 670, 1470, 670);
    svg('path', { d:'M1290,640 H1360 V465 H1470', fill:'none', stroke:C.green, 'stroke-width':4 }, a);
    head(a,1470,465,0,C.green);
    label(1310,700,'5432',{ 'font-size':20 }); label(1375,450,'8081',{ 'font-size':20 });
    const component = (x,y,w,title,kind) => {
      const group=svg('g',{},a);
      box(group,x,y,w,100,{stroke:C.line});
      // Minimal line icons distinguish actors and services without logos or detail clutter.
      const icon=svg('g',{transform:`translate(${x+18},${y+25})`,stroke:C.green,'stroke-width':3,fill:'none'},group);
      if(kind==='browser') { svg('rect',{x:0,y:0,width:42,height:34,rx:4},icon); svg('path',{d:'M0,10 H42'},icon); }
      else if(kind==='gateway') { svg('path',{d:'M5,40 V0 H36 V40 M16,20 H48 M40,12 L48,20 L40,28'},icon); }
      else if(kind==='phone') { svg('rect',{x:10,y:-5,width:24,height:48,rx:5},icon); svg('path',{d:'M17,34 H27'},icon); }
      else { svg('rect',{x:0,y:0,width:42,height:16,rx:3},icon); svg('rect',{x:0,y:25,width:42,height:16,rx:3},icon); }
      T(group,x+76,y+60,title,{'font-size':28,'font-weight':600});
      return group;
    };
    component(150,490,280,'Navigateur','browser');
    component(150,625,280,'App mobile','phone');
    // Both real public clients use the same API route; mobile has its own incoming edge.
    svg('path',{d:'M430,675 H485 V600 H555',fill:'none',stroke:C.green,'stroke-width':4},a); head(a,555,600,0,C.green);
    component(555,525,260,'Ingress','gateway');
    component(920,370,370,'Site client','browser');
    component(920,490,370,'Site admin','browser');
    svg('path',{d:'M860,420 V540 H920',fill:'none',stroke:C.green,'stroke-width':4},a);head(a,920,540,0,C.green);
    component(920,610,370,'Backend API','server');
    component(1470,415,280,'Service IA','server');
    const pg = svg('g',{},a), x=1470,y=625,w=280,h=90;
    svg('path',{d:`M${x},${y} V${y+h} A140 16 0 0 0 ${x+w},${y+h} V${y} A140 16 0 0 0 ${x},${y} Z`,fill:'#fff',stroke:C.green,'stroke-width':3},pg);
    svg('ellipse',{cx:x+w/2,cy:y,rx:w/2,ry:16,fill:'#fff',stroke:C.green,'stroke-width':3},pg);
    T(pg,x+w/2,y+58,'PostgreSQL',{'font-size':28,'font-weight':600,'text-anchor':'middle'});
    label(150,760,'Flux autorisés entre les services',{ 'font-weight':600,fill:C.green });
    label(920,590,'Pods servant les interfaces · fichiers statiques',{ 'font-size':20,fill:C.mutedL });
    // Demonstrate an attempted pod-to-database exchange, not a browser TCP call.
    const denied=svg('g',{'data-step':1,'data-anim':'fade'},a);
    svg('path',{d:'M1290,395 H1800 V670 H1750',fill:'none',stroke:C.red,'stroke-width':4,'stroke-dasharray':'12 10'},denied);
    cross(denied,1605,395);
    T(denied,1160,824,'Pod d’interface → PostgreSQL : accès direct refusé',{'font-size':24,fill:C.redText,'font-weight':600});
    // Legend is textual as well as coloured; refusal needs no reliance on red alone.
    arrow(a,150,805,210,805); label(230,814,'Autorisé · flèche pleine',{ 'font-size':22 });
    svg('line',{x1:570,y1:805,x2:630,y2:805,stroke:C.red,'stroke-width':4,'stroke-dasharray':'9 7'},a);cross(a,600,805);
    label(650,814,'Refusé · blocage',{ 'font-size':22 });
  },
});

// ── Storage: PostgreSQL on a 5 GB persistent volume (Azure disk); uploads on their own volume.
}
