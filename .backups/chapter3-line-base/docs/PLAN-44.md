# Révision 44 — plan de mise à jour, 11 octobre 2026

Base restaurée depuis l'archive 3D existante, checkpoint sélectif `7458d7c`.
La présentation classique reste en lecture seule. Ne pas relancer l'ancien import.

1. agy1 : révision locale des contenus, 44 séquences, notes exactes, diagramme de séquence
   en trois états, parcours des interfaces en cinq états, isolation, alerte et validation.
   Propriété : content/source (sauf assets-manifest.json), public/content, src/story/itinerary.ts,
   scripts/check-content.mjs, scripts/check-source.sh, tests/content-revision.test.ts.
2. agy2 : thème clair/verre, six lieux et roadmap, cycle/architecture redressés,
   écrans, gestes/tête/marche. Préserver le cadrage livraison et les contrôles bloquants.
   Propriété : src/styles.css, src/content/panels.js, src/story/evidence.ts, src/world,
   src/camera, src/characters, src/nav/director.js, tests/characters.test.ts.
3. Coordinateur : vraie capture d'administration depuis l'interface locale,
   provenance historique, intégration, lanceur, QA, durée, documentation et archive.
4. Revue des diffs et tests intégrés ; Chrome séquentiel à 1920×1080 et 1366×768,
   retours/interruptions, notes/film, enregistrement normal, performances isolées.
5. Livraison : résultats réellement mesurés, captures, enregistrement, handoff,
   archive extraite puis vérifiée ; aucun test physique ou cluster revendiqué sans exécution.

Deux travailleurs maximum, sans sous-délégation, fichiers distincts, durée maximale
par mission de 60 minutes. Aucun commit des travailleurs. La revue et l'intégration
appartiennent au coordinateur. Les sorties des travailleurs sont vérifiées indépendamment.

Contributions agy1 et agy2 terminées et revues. Le coordinateur a corrigé les défauts détectés, intégré la vraie capture et prend en charge la validation finale. Les règles temporaires agy ont été restaurées à leurs valeurs originales.

Validation terminée : 44 séquences, 114 états, 113 pressions ; 25 tests unitaires, 35 contrôles complets et 38 contrôles ciblés à chacune des deux résolutions. Enregistrement sur GPU Intel UHD à vitesse normale, mesures séquentielles normal/léger et revue des captures effectués. Livraison et vérification de l’archive : voir REVIEW.md.
