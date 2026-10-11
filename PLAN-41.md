# Plan court : des 4 scènes aux 41 séquences

À lancer seulement après le retour d'Ali sur le prototype (monde, personnages, pointage, transitions).
Même méthode : chaque état est une ligne de données (`src/content/states.js`) qui cite sa source
(`script_rows.py`) ; le texte projeté reste celui de `deck.html`, vérifié par `npm run check`.

| Lot | Séquences (n° de `script_rows.py`) | Lieu | Mise en scène | Nouveau à construire |
| --- | --- | --- | --- | --- |
| 0 | 1–2 couverture, sommaire | entrée, vue du monde | **déjà fait** | — |
| 1 | 3–7 startup, problème, réponse, acteurs, BMC (3 étapes) | 01 · place de l'achat local | 3–5 déjà faits ; acteurs = les personnages sur la place ; BMC = tableau à 9 cases au format du canvas | panneau BMC, rôle des acteurs |
| 2 | 8–12 ch2, outils-dev, plateforme, séquence, parcours web/mobile | 02 · atelier de la plateforme | écrans web et mobile réels côte à côte, composants reliés par des câbles lumineux | atelier, écrans à captures |
| 3 | 13–20 ch3, outils, cycle, architecture, routage, isolation, secrets | 03 · zone cloud | le cycle existe ; puis on entre dans l'architecture : la requête suit un chemin, zones isolées en îlots | diagrammes d'architecture en volume |
| 4 | 21–30 ch4 → traçabilité (chaîne, 10 pipelines, contrôles, tests, analyses, blocage, log4j, ArgoCD) | 04 · ligne de livraison | une même version (un colis) avance de contrôle en contrôle ; le blocage l'arrête vraiment | ligne, portiques de contrôle |
| 5 | 31–36 ch5 → validation (métriques, journaux, alerte, résultats) | 05 · centre de supervision | écrans de captures réelles, l'alerte circule jusqu'à la notification | salle de supervision |
| 6 | 37–41 ch6, bilan, perspectives, film, conclusion | 06 · belvédère, puis vue finale | recul sur tout le parcours ; film dans un écran de projection (lecteur standard, son, pause) | lecteur vidéo, vue finale |

## Ordre de travail

1. Corrections demandées par Ali sur le prototype (style, personnages, geste de pointage, rythme).
2. Lots 1 à 6 dans l'ordre, un lot = une livraison courte avec images, `npm run verify` et `npm run check` au vert.
3. Le film : `<video>` local, ses commandes ne font pas avancer la présentation, quitter la scène arrête la lecture,
   la vue présentateur reste muette.
4. Répétition complète chronométrée : référence ≈ 20 min film compris ; mesurer ce qu'ajoutent les trajets
   (≈ 3 s chacun) et les compenser par des trajets plus courts, jamais en coupant le discours.

## Points à décider avec Ali

- Rythme : le prototype ajoute un clic par rapport au deck (10 au lieu de 9 pour ces états). Sur 65 clics,
  garder ces ajouts limités aux changements de lieu.
- Les retours en arrière font disparaître et réapparaître les personnages au lieu de les faire marcher à reculons :
  à confirmer.
- Le geste de pointage (main ouverte, index tendu) est à juger sur le rendu réel.
