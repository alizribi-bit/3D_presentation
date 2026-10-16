# Tracé visible des lignes du chapitre 3

La première retouche adoucissait seulement les nouvelles apparitions. Les changements de ligne, de position et de couleur des SVG exportés restaient instantanés. Cette correction anime précisément ces changements sur « Notre chaîne de livraison » et « Un blocage vérifié en pratique », les deux slides affichées au-dessus du monde 3D.

La ligne verte de la chaîne s’allonge sur une seconde, et son repère suit le même trajet. Une étape explicite au coude horizontal/vertical garde le mouvement sur le chemin vers la supervision. Log4j avance jusqu’à Dependency-Check, où la version rouge s’arrête ; après correction, la ligne continue jusqu’à la publication avec un repère vert. Le repère temporaire disparaît ensuite conformément à la frame validée.

Les couleurs et les zones actives évoluent avec le tracé. Le déplacement du schéma lorsque le tableau se compacte ou retrouve sa taille initiale dure 450 ms. Ces transitions utilisent des animations natives de traits et de transformations, avec une durée et une courbe communes. Aucune animation permanente, attente ou avance supplémentaire.

Les géométries et styles exportés restent identiques. Le moteur capture la pose affichée avant le remplacement du SVG et l’utilise comme point de départ si l’utilisateur revient ou avance pendant le tracé. Les effets natifs se terminent ou s’annulent sans modifier les attributs canoniques. Le mode M supprime les animations immédiatement.

La logique des effets SVG est isolée dans `src/story/svg-slide-motion.ts` et la gestion des animations est partagée dans `src/story/animation-group.ts`. Les cadres rendus sont comparés à la référence validée par les tests et les vérifications de contenu.

Le contrôle navigateur observe plusieurs longueurs intermédiaires distinctes réellement affichées, le passage au coude, la progression du repère vert, l’arrêt à Dependency-Check, les retours et interruptions, la compaction et le mouvement réduit à 1920×1080 et 1366×768. L’horloge reste réelle. Pour observer les effets SVG indépendants sur le rendu logiciel, les dessins GPU continus et les mises à jour du monde sont suspendus pendant l’effet natif ; toute nouvelle entrée est traitée, puis les mises à jour reprennent. Les captures de repos rendent la scène. Le contrôle complet de contenu garde séparément le directeur et les acteurs à temps réel. L’interruption précise est déclenchée par un événement clavier dans une image réellement observée, pour éviter les délais du pilotage distant ; le progrès est comparé juste avant le remplacement du SVG. Ces vérifications ne constituent pas un benchmark de fluidité sur le projecteur.

Sécurité : pas de dépendance, contenu actif ou requête externe ajouté. Les contrôles de contenu inerte et les ressources locales restent appliqués. Les commandes de vérification sont :

```bash
npm test
npm run build
node scripts/verify-chapter3-lines.mjs
QA_LIGHT=1 npm run verify
ZS3D_NO_BROWSER=1 ./present.sh
```
