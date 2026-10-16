# Polissage discret des animations dans les slides

Le moteur anime également le tracé des lignes et le déplacement des repères sur les deux slides partagées avec la 3D : voir [LIGNES-CHAPITRE3.md](LIGNES-CHAPITRE3.md). Ce guide décrit les apparitions locales des éléments.

Le seul changement visuel concerne l’apparition des éléments nouvellement révélés par le même clic. Les titres et les éléments déjà visibles restent affichés. Le contenu, le discours, l’ordre, les 86 états, les 85 avances, les cadrages et la disposition du chapitre 3 sont conservés.

Les groupes SVG arrivent en fondu souple sur 320 ms sans déplacement de leurs coordonnées. Les textes montent de 8 pixels sur 300 ms ; les captures font le même mouvement sur 380 ms. Le décalage entre éléments est de 24 ms, plafonné à 96 ms : même un grand groupe termine en moins d’une demi-seconde. La courbe freine l’arrivée, sans rebond ni animation permanente.

Le moteur utilise les Web Animations natives déjà présentes, sans dépendance. La propriété individuelle `translate` conserve les transformations de recadrage des images. Les animations retrouvent les styles canoniques à leur fin ; l’opacité finale originale est conservée, y compris pour les groupes volontairement atténués. Les retours, sauts et nouvelles avances annulent les animations précédentes. Le mouvement réduit termine immédiatement les animations locales, sans toucher à la navigation ni aux mouvements du monde.


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
