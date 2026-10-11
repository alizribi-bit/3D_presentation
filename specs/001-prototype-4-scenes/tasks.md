# Tasks: Prototype ZAWEDNI Story 3D — quatre scènes

**Input**: `specs/001-prototype-4-scenes/` — plan.md, spec.md, research.md, data-model.md, contracts/
**Tests**: pas de TDD demandé ; les contrôles exigés par la constitution sont trois scripts (T009, T010,
T040) et des vérifications navigateur réelles (phase 8).

Format : `- [ ] T### [P?] [US?] description avec chemin`. Chemins relatifs à `~/Desktop/zawedni-story-3d`.

## Phase 1: Setup

- [x] T001 Créer `package.json` (scripts `dev`, `build`, `preview`), installer `three` et `vite` ; dev : `@gltf-transform/cli`, `playwright` ; versions figées par `package-lock.json` ; `npx playwright install chromium` tant que le réseau est disponible (le cache `chromium-1234` ne sert que si la version de playwright correspond)
- [x] T002 Créer `vite.config.js` (base relative `./`, sortie `dist/`, aucun CDN) et `.gitignore` (`node_modules`, `dist`)
- [x] T003 [P] Copier depuis `~/Desktop/zawedni-video-pfe/soutenance/` (lecture seule) vers `content/source/` : `build/script_rows.py`, `PLAN_PRESENTATION.md`, `SCRIPT.md` ; écrire `content/source/SOURCE.md` (chemin, date de l'archive, md5 de `deck.html`, `script_rows.py`, `zawedni-devsecops.mp4`)
- [x] T004 [P] Copier intacts vers `public/assets/deck/` : `logo-green.png`, `logo-white.png`, `logo-isima.png`, `v6-sup-piliers.jpg`, `v3-mob-evaluation.jpg` (+ `v6-bmc.png` pour la suite) ; aucune retouche
- [x] T005 [P] Fontes locales dans `public/fonts/` : Poppins 400/500/600/700, JetBrains Mono 400/600 (TTF de `~/Desktop/zawedni-video-pfe/scene/fonts/`), Amiri extraite des woff2 de `deck.offline.html` ; `@font-face` dans `src/styles.css`
- [x] T006 [P] Tokens de couleur dans `src/styles.css` (base deck + bleu technique, ocre achat local, orange attention) selon research.md R3

## Phase 2: Foundational (bloque toutes les stories)

- [x] T007 Télécharger les packs retenus en R1 (Ultimate Modular Men : Business Man + Casual/Worker ; Kenney Roads, Nature, Food ; Market Stand) dans `assets-src/` (hors `public/`), lire leurs licences, compresser les GLB utiles (`gltf-transform`, meshopt) vers `public/models/` ; décodeur meshopt servi localement
- [x] T008 Écrire `ASSETS.md` : chaque fichier de `public/`, origine (deck ou tiers), URL, licence citée, modifications faites — *fait dans `HANDOFF.md` (section Assets et licences), pas de fichier séparé*
- [x] T009 [P] `scripts/check-source.sh` : recalcule les md5 de la source acceptée et échoue s'ils diffèrent de `content/source/SOURCE.md` — *empreintes écrites dans le script, pas de `SOURCE.md`*
- [x] T010 [P] `scripts/check-content.mjs` : extrait les textes de `src/content/` et vérifie chacun mot pour mot contre `content/source/script_rows.py` et le texte de `deck.html` ; échoue sur DNS, « 10/11 », « faux négatif », « erreur de commande »
- [x] T011 `src/content/states.js` : les 11 états A0…D3 au format de `contracts/state-schema.md`, notes copiées de `script_rows.py`, `added: true` pour C1, C2, C3, D3 seulement (B1 et D1 existent dans le deck, avec un trajet en plus) ; amorce courte `notes.added` avant la note de D1 (« Ces outils… » renvoie à une slide absente) ; validation des invariants au démarrage
- [x] T012 [P] `src/world/places.js` : six lieux (`roadT`, couleur de rôle, `detail`), titres et lignes exacts du sommaire, ancres de panneaux
- [x] T013 `src/world/world.js` : renderer (ACES, sRGB), lumière douce (hémisphère + soleil à ombres), sol, route en courbe, ombres de contact ; six emplacements (01 et 03 détaillés plus tard)
- [x] T014 [P] `src/world/quality.js` : niveaux normal/léger (pixel ratio, taille de shadow map, effets) ; bascule `L`
- [x] T015 `src/camera/rig.js` : cadres nommés `SHOTS`, interpolation position/cible/fov avec easing, `settle()` qui pose l'arrivée, mode réduit = fondu court ; aucune animation sans fin
- [ ] T016 `src/characters/path.js` : route = `CatmullRomCurve3`, abscisse ↔ position, orientation selon la tangente — *non créé : la marche suit les points d'ancrage dans `director.js`, suffisant pour 2 lieux*
- [x] T017 `src/characters/actors.js` : chargement GLB, `AnimationMixer`, fondus walk/idle/look/point ; vitesse de clip liée à la vitesse au sol (`footSpeed`) ; pose finale posée sans transition ; geste de pointage par `CCDIKSolver` (`three/examples/jsm/animation/CCDIKSolver.js`) sur les os du bras vers l'ancre du panneau si le pack n'a pas de clip adapté (R1)
- [x] T018 `src/content/panels.js` + couche DOM dans `index.html` : panneaux texte/image, projection de l'ancre 3D en coordonnées écran à chaque image, apparition ordonnée, `cover` plein cadre
- [x] T019 `src/nav/director.js` : index courant, `go(i)` qui pose l'état courant si une transition est en cours puis lance la suivante, bornes, hash d'URL lu à l'ouverture et écrit à chaque état
- [x] T020 `src/nav/keys.js` selon `contracts/keyboard.md` ; `wheel`/`scroll`/`touchmove` ignorés ; `e.repeat` ignoré
- [x] T021 `src/main.js` : précharge tous les assets du prototype avant A0 (écran neutre clair pendant le chargement), construit monde, acteurs, director, clavier

**Checkpoint** : on parcourt 11 états vides (cadres seuls) au clavier, avant/arrière/rechargement stables.

## Phase 3: User Story 1 — Ouverture et révélation du monde (P1) 🎯 MVP

**Goal** : A0 → A1 → A2, couverture acceptée puis monde révélé avec ses six lieux.
**Independent Test** : ouvrir `#A0`, deux appuis, juger l'image A2 en 1920×1080.

- [x] T022 [US1] Panneau `cover` dans `src/content/panels.js` : formule arabe seule (A0), puis séquence ≈ 2,8 s reprise de `deck.html` `#couverture` (logos, MEMOIRE DE FIN D'ETUDES, titre, Ali Zribi et formation, jury) — textes et ordre identiques
- [x] T023 [US1] Habillage des quatre lieux en silhouette (02, 04, 05, 06) dans `src/world/world.js` avec les kits retenus : volumes reconnaissables, couleur de rôle discrète
- [x] T024 [US1] Cadres `cover` et `overview` dans `src/camera/rig.js` ; transition A1 → A2 (retrait de la couverture, plongée vers la vue du parcours ≤ 2,5 s)
- [x] T025 [US1] Étiquettes des six lieux (numéro, titre, ligne) en DOM ancrées, apparition dans l'ordre de la route ; guide au départ, pose `idle`
- [x] T026 [US1] Contrôle visuel A2 (lisibilité, échelle du guide, aucune étiquette coupée), capture `review/A2.png`, ajustements dans `src/world/world.js` / `src/camera/rig.js`

**Checkpoint** : US1 jugeable seule.

## Phase 4: User Story 2 — Achat local et zoom sur la grille (P1)

**Goal** : B1 → C3 avec trajet, constats, réponses, zoom grille, recul, vue générale.
**Independent Test** : ouvrir `#A2`, cinq appuis, contrôler textes, gestes, cadrages.

- [x] T027 [P] [US2] Lieu 01 détaillé dans `src/world/world.js` : place de marché (étals, caisses, produits, ocre), supports de panneaux, emplacement du représentant hors des zones de texte
- [x] T028 [US2] Trajet A2 → B1 : guide en marche sur `path.js` jusqu'à la place, caméra en suivi décalé puis cadre `place01` fixe ; constats `probleme` révélés après l'arrêt
- [x] T029 [US2] État B2 : quatre réponses `reponse` (grille en tête, mise en valeur) ; représentant `look` puis `point` vers l'ancre de la carte grille au moment de son apparition
- [x] T030 [US2] État C1 : cadre `grille`, phrase de la grille et images réelles `v6-sup-piliers.jpg` / `v3-mob-evaluation.jpg` à ratio d'origine ; main du représentant sur l'ancre, hors de la boîte des panneaux
- [x] T031 [US2] État C2 : recul, chaîne grille → validation → marché local → suivi avec flèche de retour
- [x] T032 [US2] État C3 : cadre `overview`, lieu 01 marqué visité, guide sur la route

**Checkpoint** : US1 + US2 parcourables.

## Phase 5: User Story 3 — Zone DevSecOps (P2)

**Goal** : D1 → D3, boucle en infini, geste, rapprochement du croisement Sécurité, recul.
**Independent Test** : ouvrir `#C3`, trois appuis.

- [x] T033 [P] [US3] Lieu 03 détaillé : zone technique bleue (baies de serveurs construites en boîtes arrondies + LED émissives, écrans Kenney), boucle en infini en relief avec six bornes dans l'ordre source, croisement Sécurité
- [x] T034 [US3] Trajet C3 → D1 ; étiquettes des six étapes, côtés Développement/Exploitation, « Sécurité — tout au long du cycle » ; guide pointe « Construire et tester »
- [x] T035 [US3] État D2 : cadre `croisement`, retour menthe allumé, phrase des observations et ligne Sécurité exactes, geste du guide synchronisé
- [x] T036 [US3] État D3 : recul vers `overview`, cadre immobile

## Phase 6: User Story 4 — Pilotage fiable (P2)

**Goal** : déterminisme, interruptions, raccourcis invisibles, hors ligne, mouvement réduit, qualité légère.
**Independent Test** : `node scripts/verify.mjs` + manipulations manuelles.

- [x] T037 [US4] Raccourcis `Home`, `1`–`4`, `F`, `L`, `M` dans `src/nav/keys.js` ; `prefers-reduced-motion` respecté
- [x] T039 [US4] Instrumentation `?fps` : moyenne et 5e centile par transition dans la console, rien à l'écran
- [x] T040 [US4] `scripts/verify.mjs` (Playwright, 1920×1080) : parcours avant/arrière, 20 appuis rapides, chaque état atteint par 4 chemins comparé pixel à pixel (tolérance faible), console sans erreur, toute requête hors `localhost` bloquée et signalée, captures dans `review/`

## Phase 6b: User Story 6 — Deux fenêtres et lanceur (P1)

**Goal** : `./present.sh` ouvre fenêtre jury et fenêtre présentateur synchronisées, hors ligne.
**Independent Test** : lancer depuis `/tmp`, réseau coupé ; avance, retour, saut, rechargements, notes ouvertes tard.

- [x] T051 [US6] `src/presenter/link.js` : canal `zawedni-story-3d`, messages `hello` / `state` / `cmd` selon `contracts/keyboard.md`
- [x] T052 [US6] `presenter.html` + `src/presenter/presenter.js` : notes de l'état (à dire, « À lire à l'écran », ajout, prochain clic, suivant), position, minuteur, « Fenêtre jury absente » ; aucune importation 3D ; entrée multipage dans `vite.config.js`
- [x] T053 [US6] Fenêtre jury : diffusion de l'état dans `src/nav/director.js`, application des `cmd`, ouverture auto avec `?pv=`, touche `N` dans `src/nav/keys.js`
- [x] T054 [US6] `present.sh` : dossier propre, contrôle de `dist/`, serveur 127.0.0.1:4317 réutilisé ou lancé (fichier témoin `public/.zawedni-story-3d`), attente, profil Chrome dédié, géométrie `xrandr`, `--swap`, message un écran
- [x] T055 [US6] `PRESENTER.md` : préparation unique (`npm install`, `npm run build`), lancement, écrans « Joindre », plein écran, touches, dépannage
- [x] T056 [US6] Vérification réelle deux fenêtres : `scripts/verify.mjs` (deux pages, même contexte) + essai `./present.sh` sur les deux écrans réels, réseau coupé ; résultats dans `HANDOFF.md`

## Phase 7: User Story 5 — Matériel de revue (P3)

- [x] T041 [P] [US5] Captures 1920×1080 des 11 états dans `review/` (Chrome avec GPU, pas le rendu logiciel)
- [x] T042 [P] [US5] Enregistrement du parcours A0 → D3 (`review/parcours.mp4`, ffmpeg, ≤ 60 s)
- [x] T043 [P] [US5] `DESIGN.md` : palette, typographie, matières, éclairage, style des personnages, règles de caméra
- [x] T044 [P] [US5] `PLAN-41.md` : correspondance des 41 séquences / 65 clics vers lieux et états, lieux à construire, écarts de clics expliqués
- [x] T045 [US5] `HANDOFF.md` : source préservée (md5), fichiers principaux, assets et licences, commande d'ouverture et touches, vérifications réellement faites avec mesures, limites

## Phase 8: Polish & vérification finale

- [x] T046 Parcours réel en Chrome plein écran 1920×1080 : contrôle image par image des arrivées et gestes (glissement, pointage, recouvrement) ; constats notés dans `review/NOTES.md`, corrections dans `src/`
- [x] T047 Mesure `?fps` en qualité normale puis légère (et bridage CPU ×4) ; résultats chiffrés dans `HANDOFF.md` — *normal et léger mesurés ; bridage CPU ×4 non fait*
- [x] T048 Test réseau coupé (`npm run build && npm run preview`, interface réseau désactivée ou blocage Playwright) ; résultat dans `HANDOFF.md` — *blocage Playwright fait ; Wi-Fi coupé à faire à la main*
- [x] T049 `scripts/check-source.sh` et `node scripts/check-content.mjs` au vert ; `git status` de `~/Desktop/zawedni-video-pfe` inchangé par ce travail
- [ ] T050 Optionnel : `zawedni-story-3d-prototype.zip` (sans `node_modules`) — *non fait (optionnel)*

## Dependencies & Execution Order

- Setup (T001–T006) → Foundational (T007–T021) → US1 → US2 → US3 ; US4 et US6 peuvent commencer après
  T021 en parallèle de US2/US3 ; US5 et Phase 8 en dernier.
- T007 dépend de la décision R1 (research.md). T017 dépend de T007 et T016. T018 dépend de T013.
- US2 et US3 partagent `world.js` : T027 et T033 touchent des fonctions séparées (`buildMarket`,
  `buildTech`) pour rester parallélisables.

## Parallel Examples

- Setup : T003, T004, T005, T006 ensemble.
- Foundational : T009, T010, T012, T014 ensemble après T011/T013 lancés.
- US2 + US3 : T027 et T033 (deux lieux) en parallèle, éventuellement l'un via `agy-delegate`.
- US5 : T041, T042, T043, T044 ensemble.

## Implementation Strategy

1. MVP = Setup + Foundational + US1 : première image A2 montrée à Ali en interne si le style hésite.
2. US2 (personnages et grille) : test décisif des gestes.
3. US3, puis US4 (robustesse) et US5 (livraison).
4. On s'arrête après la phase 8 : pas d'extension aux 41 séquences sans retour d'Ali.
