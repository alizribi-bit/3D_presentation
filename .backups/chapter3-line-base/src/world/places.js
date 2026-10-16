// Layout of the ZAWEDNI world (metres; x to the right, z towards the viewer, y up).
// The road is the roadmap: it links the five chapters in the order of the accepted deck's Sommaire.
// Titles and lines are the Sommaire's text, word for word (deck.html #sommaire).

export const ROAD = [
  [-40, 17], [-30, 13], [-19, 8.5], [-10, 6.5], [-1, 5.5], [8, 3.5],
  [17, 1], [26, -2.5], [35, -6], [44, -8], [56, -9],
];

export const ROLE = { local: '#c98a3c', green: '#0d7b3c', tech: '#2f6db3', attention: '#e8742c' };

export const PLACES = [
  { id: '01', title: 'Contexte et objectifs', line: "ZAWEDNI, le besoin et l’organisation du projet",
    role: 'local', center: [-19, -1.5], label: [-19, 7, -8] },
  { id: '03', title: 'Architecture et démarche DevSecOps', line: 'Les outils, le cluster, le réseau et les secrets',
    role: 'tech', center: [5, -9.5], label: [5, 9.5, -17] },
  { id: '04', title: 'Chaîne CI/CD et déploiement', line: 'Le trajet d’un changement jusqu’au déploiement',
    role: 'tech', center: [24, 12], label: [24, 0, 19.5], below: true },
  { id: '05', title: 'Supervision et validation', line: 'Le suivi des services et les résultats des essais',
    role: 'tech', center: [37, -17], label: [37, 11, -21] },
  { id: '06', title: 'Bilan, perspectives et conclusion', line: 'Les apports du mémoire, ses limites et la suite',
    role: 'green', center: [52, 2], label: [48, 7.5, -1] },
];

export const place = id => PLACES.find(p => p.id === id);

// Display order comes from the five retained chapters, never the stable place ID.
PLACES.forEach((p, i) => { p.chapter = i + 1; });
