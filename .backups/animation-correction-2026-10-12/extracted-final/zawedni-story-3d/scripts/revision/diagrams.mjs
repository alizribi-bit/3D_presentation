// Authoring-only SVG primitives. The three sequence states share lifelines, each with its own readable exchanges.
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const ink = '#151a17', green = '#0d7b3c', red = '#b42020';
const text = (x, y, value, size = 27, color = ink, anchor = 'middle') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${escape(value)}</text>`;
const defs = `<defs>${[['arrow', green], ['deny', red]].map(([id, color]) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto"><path d="M0 0L10 5L0 10Z" fill="${color}"/></marker>`).join('')}</defs>`;
const arrow = (x1, x2, y, label, { color = green, dashed = false, focus = false, labelX = (x1 + x2) / 2 } = {}) =>
  `<g${focus ? ' data-focus' : ''}><path d="M${x1} ${y}H${x2}" stroke="${color}" stroke-width="3" fill="none" ${dashed ? 'stroke-dasharray="10 8"' : ''} marker-end="url(#${color === red ? 'deny' : 'arrow'})"/>${text(labelX, y - 14, label)}</g>`;
const section = (id, title, body, kicker) => `<section class="slide revision-diagram" id="${id}"><p class="kicker">${escape(kicker)}</p><h2>${escape(title)}</h2>${body}</section>`;

export function sequenceDiagramFrames() {
  const actors = [['Entreprise', 300], ['API Spring Boot', 770], ['PostgreSQL', 1190], ['Administrateur', 1620]];
  const participants = actors.map(([name, x]) => `<g><rect x="${x - 160}" y="270" width="320" height="74" rx="16" fill="${name === 'API Spring Boot' ? '#cfe8d7' : '#fff'}" stroke="${green}"/>${text(x, 316, name, 27)}<line x1="${x}" y1="344" x2="${x}" y2="914" stroke="#b9c8bd" stroke-width="2" stroke-dasharray="8 8"/></g>`).join('');
  const states = [
    { phase: '1 · Compte et envoi de la grille', exchanges:
      arrow(300, 770, 438, 'Créer un compte') + arrow(770, 1190, 502, 'Enregistrer le compte')
      + arrow(1620, 770, 590, 'Attribuer et envoyer la grille', { labelX: 1260, focus: true })
      + arrow(770, 1190, 654, 'Enregistrer la grille attribuée')
      + arrow(770, 300, 746, 'Grille d’évaluation disponible', { dashed: true }),
      caption: "Le compte et l'évaluation restent accessibles. Les fonctions métier concernées attendent l'approbation." },
    { phase: '2 · Réponses et décision', exchanges:
      arrow(300, 770, 430, 'Remplir et soumettre la grille') + arrow(770, 1190, 496, 'Enregistrer les réponses')
      + arrow(1620, 770, 592, 'Examiner les réponses', { labelX: 1320 })
      + arrow(770, 1620, 658, 'Présenter la grille soumise', { dashed: true, labelX: 1320 })
      + arrow(1620, 770, 752, 'Approuver ou rejeter', { labelX: 1320, focus: true })
      + arrow(770, 1190, 818, 'Enregistrer la décision'), caption: "La décision de l'administrateur est conservée dans PostgreSQL." },
    { phase: '3 · Accès contrôlé côté API', exchanges:
      arrow(300, 770, 430, 'Demander une fonction concernée')
      + arrow(770, 1190, 512, 'Vérifier la décision enregistrée', { focus: true })
      + arrow(1190, 770, 580, 'Décision de la grille', { dashed: true })
      + `<rect x="170" y="652" width="1460" height="218" rx="12" fill="rgba(255,255,255,.68)" stroke="#536459" stroke-width="2"/>
        ${text(212, 684, 'alt', 24, ink, 'start')}${text(920, 699, 'Grille approuvée', 26, green)}
        ${arrow(770, 300, 737, 'Accès autorisé', { dashed: true })}
        <line x1="170" y1="770" x2="1630" y2="770" stroke="#536459" stroke-dasharray="7 7"/>
        ${text(1110, 801, "Rejet ou absence d'approbation", 26, red)}
        ${arrow(770, 300, 840, 'Accès refusé', { dashed: true, color: red })}`,
      caption: 'Contrôle serveur des fonctions concernées · GridCheckFilter · refus HTTP 403' },
  ];
  return states.map(state => section('sequence', "De l'inscription à l'accès au marché",
    `<svg class="art" viewBox="0 0 1920 1080" role="img" aria-label="Diagramme de séquence : ${escape(state.phase)}">${defs}${participants}${text(150, 385, state.phase, 28, green, 'start')}${state.exchanges}</svg><p class="revision-caption">${escape(state.caption)}</p>`, 'Développement de la plateforme · Conception'));
}

export function isolationDiagramFrames() {
  const box = (x, y, width, lines, { fill = '#fff', color = green } = {}) => `<g><rect x="${x}" y="${y}" width="${width}" height="90" rx="16" fill="${fill}" stroke="${color}" stroke-width="2"/>${lines.map((line, i) => text(x + width / 2, y + (lines.length === 1 ? 53 : 36 + i * 30), line, 25)).join('')}</g>`;
  const path = d => `<path d="${d}" fill="none" stroke="${green}" stroke-width="4" marker-end="url(#arrow)"/>`;
  const common = `${defs}
    <rect x="815" y="330" width="940" height="448" rx="24" fill="rgba(207,232,215,.18)" stroke="${green}" stroke-width="2" stroke-dasharray="8 7"/>
    ${text(1290, 365, 'Périmètre des services concernés', 23, green)}
    ${[['Accès public', 270], ["Point d'entrée", 610], ['Application', 1020], ['Services internes', 1515]].map(([label, x]) => text(x, 286, label, 25, '#536459')).join('')}
    ${box(150, 404, 245, ['Navigateur'])}${box(150, 598, 245, ['Application mobile'])}
    ${box(482, 508, 250, ['Ingress NGINX'], { fill: '#cfe8d7' })}
    ${box(870, 404, 300, ['Interfaces', 'client / admin'])}${box(870, 632, 300, ['Backend API'])}
    ${box(1365, 404, 300, ['Service IA', '8081'])}${box(1365, 632, 300, ['PostgreSQL', '5432'])}
    ${path('M395 449H438V538H482')}${path('M395 643H455V567H482')}
    ${path('M732 538H790V449H870')}${text(805, 410, 'Pages', 22, green)}
    ${path('M732 567H790V677H870')}${text(805, 720, '/api', 23, green)}
    ${path('M1170 658H1270V449H1365')}${path('M1170 690H1365')}`;
  return [0, 1].map(step => section('isolation', 'Isolation réseau',
    `<svg class="art" data-focus viewBox="0 0 1920 1080" role="img" aria-label="Flux autorisés et isolation des services">${common}${step ? `
      <path d="M1170 476H1230V590H1515V632" fill="none" stroke="${red}" stroke-width="4" stroke-dasharray="9 7"/>
      <circle cx="1295" cy="590" r="20" fill="#fff" stroke="${red}" stroke-width="3"/>
      <path d="M1282 577L1308 603M1308 577L1282 603" stroke="${red}" stroke-width="4"/>
      ${text(1430, 556, 'Pod interface → PostgreSQL : refusé', 23, red)}` : ''}</svg>
      ${step ? `<div class="network-reading" data-focus><p>NetworkPolicies : elles définissent les échanges autorisés entre les services concernés.</p><p>Calico : il applique ces règles et bloque les échanges non autorisés.</p></div>` : '<p class="revision-caption">Le navigateur appelle l’API via Ingress. Les pods d’interface ne contactent pas directement la base.</p>'}`,
    'Architecture et démarche DevSecOps · S5 · Isolation réseau'));
}
