# Research: Prototype ZAWEDNI Story 3D

Recherche de planification du 2026-10-10. Les éléments marqués « à revérifier » doivent être confirmés
au téléchargement (T007) : lire le fichier LICENSE fourni dans l'archive et le citer dans `ASSETS.md`.

## R1 — Personnages et kits de décor

**Decision** : personnages = **Quaternius « Ultimate Modular Men »** (CC0), en GLB individuels depuis Poly
Pizza : représentant = « Business Man » (https://poly.pizza/m/JFrLIKqvCH), guide = « Casual Character »
(https://poly.pizza/m/kZ3DmIoGip) ou « Worker » (Yg2bQZO6Hj). Décor = **Kenney** City Kit Roads 2.2, Nature
Kit 2.1, Food Kit 2.0 (CC0) + Quaternius « Market Stand » (DGIM5HGISb) / « Market Scene » (LkNRqxdCKp) (CC0).
Zone technique : **baies de serveurs construites dans le projet** (boîtes arrondies, bandes LED
émissives) + Kenney « Computer Screen » (V5Qo141OcB, CC0) ; aucun kit CC0 de serveurs trouvé.

**Evidence (recherche du 2026-10-10)** :
- Pages Poly Pizza des modèles : `"Username":"Quaternius"`, `"Licence":"CC0 1.0"`, « No login required ».
  Page du pack Quaternius : CC0, « 11 Different characters with 24 animations! ».
- GLB inspectés : Business Man et Casual partagent `CharacterArmature` (62 os, mêmes noms : Hips, Neck,
  Head, UpperArm/LowerArm, Wrist, Index1–4…) ; ≈ 1,3–1,5 Mo chacun ; 3 350 à 4 162 triangles ; matières
  en couleurs unies sans texture (recolorables vers la palette du projet).
- 24 clips communs, dont **Idle**, **Idle_Neutral**, **Walk**, **Interact**, **Wave** (les autres :
  armes, coups, course, roulade — inutilisés). Pas de clip « pointer » (Idle_Gun_Pointing est une visée
  d'arme) ni de regard.
- Kenney : License.txt de chaque zip : « License: (Creative Commons Zero, CC0) … You can use this content
  for personal, educational, and commercial purposes. »

**Gestes** : pointage et regard construits par rotation d'os (bras, poignet, index, cou, tête) au-dessus
d'Idle, avec `CCDIKSolver` pour viser l'ancre du panneau ; Interact/Wave en appoint. On juge sur C1 ; si
ce n'est pas crédible, on le dit à Ali (aucune bibliothèque payante n'a de clip « Point » vérifié non plus).

**Alternatives considered** :
- Quaternius Universal Base Characters (CC0) : niveau gratuit = 2 corps de base en sous-vêtements, tenues
  fantasy seulement → no-go pour un représentant d'entreprise.
- Quaternius Universal Animation Library 1/2 (CC0, 46 et 43 clips gratuits) : pas de « Point » ; utile
  plus tard pour Idle_Talking_Loop / Walk_Formal_Loop si on les reciblait.
- Kenney Mini Characters (CC0) : style miniature en blocs, repli seulement.
- KayKit (CC0) : proportions trapues de cartoon ; noms de clips non vérifiés.
- Exemples three.js : RobotExpressive CC0 mais robot ; Soldier/Xbot/Michelle d'origine Mixamo sans
  licence de fichier → no-go.
- Mixamo : compte Adobe obligatoire ; une FAQ communautaire Adobe (2022) interdit de distribuer les
  fichiers bruts → no-go pour des GLB livrés dans le projet.
- Baie de serveur Poly Pizza (Jeremy Eyring) : CC-BY 3.0 → attribution requise, inutile si on construit.

**À revérifier au téléchargement** : licence du pack via le fichier fourni ; si le dossier Google Drive
de Quaternius demande un compte, utiliser Poly Pizza.

## R2 — Pile et versions

**Decision** : `three` + `vite`, sans React ; `@gltf-transform/cli` (`optimize --compress meshopt`) pour
compresser ; décodeur meshopt fourni par three (`three/examples/jsm/libs/meshopt_decoder.module.js`),
donc local. Versions lues sur npm le 2026-10-10 : three 0.186.1 (24/09), @gltf-transform/cli 4.5.1 (28/09),
vite 8.3.4 (08/10, trop récent : prendre la dernière 8.x publiée depuis au moins deux semaines) ; figées
par `package-lock.json`. Compression **meshopt** (défaut de `gltf-transform optimize`) plutôt que Draco,
dont les décodeurs se chargent souvent depuis gstatic.com : risque hors ligne.

**Rationale** : l'ancien deck est en JS sans framework ; le prototype n'a besoin que d'un rendu, d'un
mixer d'animations et d'une machine à états. React Three Fiber + drei apportent des raccourcis
(ContactShadows, useGLTF, Html) mais ajoutent React et deux couches pour une seule page ; les
équivalents three (`GLTFLoader`, `ShadowMaterial`, projection DOM) tiennent en peu de code.

**Alternatives considered** : R3F + drei (option plus lourde, reste possible si la version complète
devient une vraie application) ; Babylon.js (moteur complet, plus gros, sans gain ici) ; GSAP pour les
trajets (inutile : easing maison déterministe).

## R3 — Références visuelles et de mouvement

**Decision** : à faire en début d'implémentation, avant T013, en regardant les sites animés (pas des
captures) : impress.js (vue d'ensemble → entrée → recul), modèle roadmap Prezi (trajet d'étape en étape,
passage réel → numérique), bruno-simon.com (lieux qui portent le contenu, cohérence des matières),
Refero Styles (palette, échelle typographique, espacements), 21st.dev et React Bits (une ou deux idées
d'apparition de texte pour la couverture et les étiquettes, réécrites sans dépendance). On consigne 3 à
5 décisions dans `DESIGN.md` ; aucun composant importé tel quel.

**Rationale** : le brief demande des références animées et une direction propre ; les composants React
de 21st/React Bits ne s'importent pas dans une page sans React et sont pensés pour le scroll.

## R4 — Fontes hors ligne

**Decision** : Poppins (400/500/600/700) et JetBrains Mono depuis `~/Desktop/zawedni-video-pfe/scene/fonts/`
(TTF déjà locaux) ; Amiri (formule arabe de la couverture) extraite des woff2 intégrés à
`soutenance/deck.offline.html` (27 fontes en base64). Copies seulement.

**Rationale** : le `deck.html` accepté charge Google Fonts ; la version hors ligne du même deck contient
les mêmes fontes, ce qui garde un rendu identique sans réseau.

## R5 — Netteté des textes

**Decision** : textes et captures en couche DOM au-dessus du canvas. En lecture, panneaux plein cadre ou
ancrés et face caméra ; ailleurs, étiquettes DOM positionnées par projection de leur ancre 3D à chaque
image.

**Rationale** : rendu typographique du navigateur (Poppins exacte, net en 1080p), texte sélectionnable
par les scripts de contrôle (vérification mot pour mot), images à leur résolution d'origine.
**Alternatives considered** : texte SDF dans la scène (troika) : bonne qualité mais vérification du texte
plus difficile et risque de flou en perspective ; textures de texte : floues au zoom.

## R6 — Mesure de fluidité

**Decision** : Chrome visible avec GPU (`npm run preview`, `?fps`) ; temps entre `requestAnimationFrame`
enregistrés pendant chaque transition ; moyenne et 5e centile écrits dans la console ; qualité normale
puis légère ; bridage CPU ×4 via DevTools pour simuler une machine plus faible. Résultats chiffrés dans
`HANDOFF.md`.

**Rationale** : Playwright headless rend en logiciel (SwiftShader) : utile pour la navigation et le
déterminisme, pas pour mesurer la fluidité. Matériel présent : Chrome (`/usr/bin/google-chrome`),
Chromium Playwright 1234 en cache, ffmpeg système.
