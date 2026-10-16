# Polissage discret des animations dans les slides

Le seul changement visuel concerne l’apparition des éléments nouvellement révélés par le même clic. Les titres et les éléments déjà visibles restent affichés. Le contenu, le discours, l’ordre, les 86 états, les 85 avances, les cadrages et la disposition du chapitre 3 sont conservés.

Les groupes SVG arrivent en fondu souple sur 320 ms sans déplacement de leurs coordonnées. Les textes montent de 8 pixels sur 300 ms ; les captures font le même mouvement sur 380 ms. Le décalage entre éléments est de 24 ms, plafonné à 96 ms : même un grand groupe termine en moins d’une demi-seconde. La courbe freine l’arrivée, sans rebond ni animation permanente.

Le moteur utilise les Web Animations natives déjà présentes, sans dépendance. La propriété individuelle `translate` conserve les transformations de recadrage des images. Les animations retrouvent les styles canoniques à leur fin ; l’opacité finale originale est conservée, y compris pour les groupes volontairement atténués. Les retours, sauts et nouvelles avances annulent les animations précédentes. Le mouvement réduit termine immédiatement les animations locales, sans toucher à la navigation ni aux mouvements du monde.

La base acceptée précédente, avec son build, ses sources et ses tests, est sauvegardée dans `.backups/slide-polish-accepted-base/`. Les empreintes confirment que le seul fichier d’exécution existant modifié est `src/story/evidence.ts` ; la logique est isolée dans `src/story/reveal-motion.ts`. Sources orales, frames, caméra, monde, itinéraire et CSS de cadrage restent identiques.

Vérifications reproductibles :

```bash
npm test
npm run build
node scripts/verify-slide-polish.mjs
QA_LIGHT=1 npm run verify
ZS3D_NO_BROWSER=1 ./present.sh
```

Les tests couvrent les coordonnées SVG, les transformations des captures, l’opacité finale, les grands groupes, les interruptions et la libération des animations terminées. La QA navigateur observe les animations natives, les clics et une horloge réelle aux deux résolutions, puis compare les frames au contenu canonique. Le dessin GPU continu est suspendu pendant cette QA ; les captures finales rendent la scène au repos. Il ne s’agit pas d’une mesure de fluidité sur le projecteur.

Sécurité : aucune dépendance ou requête externe ajoutée. Les contrôles des exports inertes, les notes exactes, les assets locaux et le serveur confiné sont conservés. Rapports et captures : `review/slide-polish/`.

Résultat final : **52 tests TypeScript et 2 tests HTTP, 137 contrôles ciblés aux deux résolutions et 192 contrôles du parcours complet réussis**. Aucun fichier manquant, requête externe ou exception. Les animations natives intermédiaires sont observées ; les interruptions et le mode M passent. Le lanceur sert le build actuel `05097a323a59d8d2`. Rapport du parcours : `review/slide-polish/full-content-report.json`.
