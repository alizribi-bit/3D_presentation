// The prototype's 11 states. Each one is data: source sequence, camera shot, visible panels, the pose of each
// character, and the presenter notes. Speech is copied from the accepted deck (content/source/script_rows.py):
//   script = the speech in order: ['say', text, src?] said · ['read', text, src?] projected and read as is ([lire])
//            · ['added', text, why] a short sentence that is not in the accepted speech (flagged in the presenter window) ;
//   silent = what to do when there is nothing to say ;  next = what the next click does.
// move: 'travel' (between places, ≈ 3 s), 'reveal' (inside a place, ≈ 1 s), 'cut' (cover).

export const STATES = [
  {
    id: 'A0', scene: 'A', source: { seq: 'couverture', step: 0 }, move: 'cut', shot: 'overview',
    panels: ['cover'], cover: 'basmala',
    actors: { guide: { at: 'guideA2', face: 'camera' }, rep: { at: 'repSpot', face: 'easel' } },
    notes: { script: [['say', 'Bonjour à toutes et à tous.']], next: 'La couverture se complète (logos, titre, jury).' },
  },
  {
    id: 'A1', scene: 'A', source: { seq: 'couverture', step: 1 }, move: 'cut', shot: 'overview',
    panels: ['cover'], cover: 'full',
    actors: { guide: { at: 'guideA2', face: 'camera' }, rep: { at: 'repSpot', face: 'easel' } },
    notes: {
      script: [['say', "Madame la Présidente, Mesdames les membres du jury, merci pour votre présence. Merci également à mes encadrantes pour leur accompagnement. Ce mémoire porte sur le développement de la plateforme ZAWEDNI et son déploiement avec une approche DevSecOps."],
        ['say', 'Voici le plan.', 'sommaire, étape 0']],
      next: 'La couverture s’efface : le monde et ses six lieux apparaissent (sommaire).',
    },
  },
  {
    id: 'A2', scene: 'A', source: { seq: 'sommaire', step: 1 }, move: 'reveal', shot: 'overview', duration: 2.6,
    panels: ['sommaire', 'l01', 'l02', 'l03', 'l04', 'l05', 'l06'],
    actors: { guide: { at: 'guideA2', face: 'camera' }, rep: { at: 'repSpot', face: 'easel' } },
    notes: {
      script: [['say', "On commence par ZAWEDNI, le problème et la solution proposée. On passe ensuite au développement de la plateforme. Puis, on explique l'architecture DevSecOps, les étapes de déploiement et la supervision. On termine par les résultats et les perspectives."]],
      next: 'Trajet vers la place de l’achat local (lieu 01).',
    },
  },
  {
    id: 'B1', scene: 'B', source: { seq: 'probleme', step: 1 }, move: 'travel', shot: 'market', duration: 3,
    panels: ['probleme'],
    actors: { guide: { at: 'guideSpot01', face: 'rep', walk: ['guideA2', 'guideSpot01'] }, rep: { at: 'repSpot', face: 'guide' } },
    notes: {
      script: [['say', "Pour comprendre l'idée de ZAWEDNI, on part de trois constats.", 'pendant le trajet'],
        ['read', 'Les actions RSE restent parfois ponctuelles, comme des dons.'], ['read', 'Il manque une stratégie claire pour agir et suivre les résultats.'],
        ['read', 'Il est difficile de comparer les fournisseurs locaux sur leurs pratiques responsables.']],
      next: 'Les quatre réponses de ZAWEDNI ; le représentant désigne la grille.',
    },
  },
  {
    id: 'B2', scene: 'B', source: { seq: 'reponse', step: 1 }, move: 'reveal', shot: 'market', duration: 1.2,
    panels: ['reponse'],
    actors: { guide: { at: 'guideSpot01', face: 'rep' }, rep: { at: 'repSpot', face: 'reponse-key', point: 'reponse-key' } },
    notes: {
      script: [['say', 'ZAWEDNI propose une réponse à ces trois points.'],
        ['read', "Une grille d'évaluation pour mesurer les pratiques de l'entreprise."], ['read', 'Une validation pour rendre les fournisseurs évalués visibles sur le marché.'],
        ['read', 'Un marché local pour trouver des partenaires et suivre les achats.'], ['read', 'Des recommandations, un guide pour une stratégie RSE et un rapport ESG pour suivre les résultats.']],
      next: 'Zoom sur la grille d’évaluation (tableau du marché).',
    },
  },
  {
    id: 'C1', scene: 'C', source: { seq: 'modele', step: 2 }, added: true, move: 'reveal', shot: 'easel', duration: 1.6,
    panels: ['grille', 'grille-cap'],
    actors: { guide: { at: 'guideSpot01', face: 'easel' }, rep: { at: 'repSpot', face: 'easel', point: 'easel' } },
    notes: {
      script: [['say', "On y ajoute la grille d'évaluation, au cœur de la plateforme :", 'modele, étape 2'],
        ['read', "Une grille d'évaluation pour mesurer les pratiques responsables de l'entreprise, avant la validation de son dossier.", 'modele, carte « Complément »'],
        ['say', "Pour le parcours de l'entreprise, on voit le web à gauche et le mobile à droite. La première étape est la grille d'évaluation : ses piliers, puis ses questions.", 'parcours, étape 0']],
      next: 'Recul : la grille dans la chaîne de la solution.',
    },
  },
  {
    id: 'C2', scene: 'C', source: { seq: 'reponse', step: 1 }, added: true, move: 'reveal', shot: 'marketWide', duration: 1.4,
    panels: ['chaine'],
    actors: { guide: { at: 'guideSpot01', face: 'camera' }, rep: { at: 'repSpot', face: 'camera' } },
    notes: {
      script: [], silent: 'Pas de phrase : laisser voir l’enchaînement grille → validation → marché local → suivi, et le retour vers la grille.',
      next: 'Vue générale du parcours.',
    },
  },
  {
    id: 'C3', scene: 'C', source: { seq: 'ch3', step: 0 }, added: true, move: 'reveal', shot: 'overview', duration: 2.4,
    panels: ['l01', 'l02', 'l03', 'l04', 'l05', 'l06'], visited: ['01'],
    actors: { guide: { at: 'guideSpot01', face: 'camera' }, rep: { at: 'repSpot', face: 'camera' } },
    notes: {
      script: [['say', "Une question se pose maintenant : comment mettre une nouvelle version en ligne, réduire les erreurs et protéger les données ? C'est le rôle de l'approche DevSecOps.", 'ch3, sans sa dernière phrase']],
      next: 'Trajet vers la zone DevSecOps (lieu 03).',
    },
  },
  {
    id: 'D1', scene: 'D', source: { seq: 'devsecops', step: 0 }, move: 'travel', shot: 'cloud', duration: 3.4,
    panels: ['cycle-title', 'side-dev', 'side-ops', 'secu', 'stage0', 'stage1', 'stage2', 'stage3', 'stage4', 'stage5'], hot: ['stage2'],
    actors: { guide: { at: 'guideSpot03', face: 'stage2', point: 'stage2', walk: ['guideSpot01', 'guideOut01', '|', 'guideIn03', 'guideSpot03'] }, rep: { at: 'repSpot', face: 'camera' } },
    notes: {
      script: [['added', 'La démarche DevSecOps forme un cycle continu.', 'remplace « Ces outils forment un cycle continu. » : la slide des outils n’est pas dans le prototype'],
        ['say', 'À gauche, on prépare une modification, on écrit le code et on le teste. À droite, on déploie et on observe le service.']],
      next: 'Rapprochement du croisement Sécurité ; le retour des observations s’allume.',
    },
  },
  {
    id: 'D2', scene: 'D', source: { seq: 'devsecops', step: 1 }, move: 'reveal', shot: 'crossing', duration: 1.4,
    panels: ['cycle-title', 'side-dev', 'side-ops', 'secu', 'stage0', 'stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'fb', 'secline'], feedback: true,
    actors: { guide: { at: 'guideSpot03', face: 'crossing', point: 'crossing' }, rep: { at: 'repSpot', face: 'camera' } },
    notes: {
      script: [['say', "Un problème détecté conduit à une correction du code. La sécurité accompagne le cycle : contrôle du code, protection des accès et surveillance. Ce lien entre développement, sécurité et exploitation forme l'approche DevSecOps."]],
      next: 'Retour à la vue du parcours (fin du prototype).',
    },
  },
  {
    id: 'D3', scene: 'D', source: { seq: 'sommaire', step: 1 }, added: true, move: 'reveal', shot: 'overview', duration: 2.6,
    panels: ['l01', 'l02', 'l03', 'l04', 'l05', 'l06'], visited: ['01', '03'],
    actors: { guide: { at: 'guideSpot03', face: 'camera' }, rep: { at: 'repSpot', face: 'camera' } },
    notes: { script: [], silent: 'Fin du prototype : vue du parcours. Dans la version complète, le chapitre 2 se place entre 01 et 03.', next: '—' },
  },
];

export const SCENES = { A: 0, B: 3, C: 5, D: 8 };   // first state of each scene (keys 1–4)
export const indexOf = id => STATES.findIndex(s => s.id === id);
