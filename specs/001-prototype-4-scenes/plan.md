# Implementation Plan: Prototype ZAWEDNI Story 3D — quatre scènes

**Branch**: `001-prototype-4-scenes` | **Date**: 2026-10-10 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-prototype-4-scenes/spec.md`

## Summary

Un monde 3D continu (route + six lieux) rendu en WebGL, parcouru par onze états déclenchés au clavier.
Chaque état est une donnée : cadre de caméra, actions des deux personnages, panneaux de contenu visibles,
notes du discours. Un moteur unique interpole d'un état au suivant de façon déterministe (temps de
transition fini, interruptible en sautant à la fin). Les textes et captures de lecture sont rendus en
couche DOM au-dessus du canvas, ancrés au monde : netteté et texte exact garantis. Personnages GLB
articulés (pack gratuit à licence vérifiée), marche synchronisée à l'abscisse sur la route.

## Technical Context

**Language/Version**: JavaScript (ES2022 modules), HTML, CSS ; Node 20.20 / npm 10.8 (installés)
**Primary Dependencies**: `three` (rendu, GLTFLoader, AnimationMixer, MeshoptDecoder) ; `vite` (dev et
build statique). Pas de React, pas de moteur physique, pas de lib de tween (≈ 40 lignes d'easing
maison). Outils de dev seulement : `@gltf-transform/cli` (compression GLB), `playwright` (contrôles).
Versions exactes figées dans `package-lock.json` au moment de l'installation (voir research.md R2).
**Storage**: fichiers statiques ; état courant dans le hash de l'URL (`#C1`) pour rechargement et saut.
**Testing**: script Playwright (navigation, déterminisme par captures, console, réseau externe) ; mesure
de fluidité dans Chrome avec GPU (fenêtre visible) ; contrôle visuel par Ali sur images et vidéo.
**Target Platform**: Chrome/Chromium récent (cible de soutenance) et Firefox ; 1920×1080 plein écran ;
portable ordinaire avec GPU intégré.
**Project Type**: application web statique mono-page (présentation).
**Performance Goals**: ≥ 50 i/s en qualité normale sur la machine disponible, ≥ 30 i/s en qualité légère ;
premier état affiché < 5 s après ouverture, tous assets du prototype préchargés.
**Constraints**: hors ligne total ; aucune requête externe ; navigation clavier seule ; poids total des
assets du prototype visé < 25 Mo ; aucun fichier de l'ancien projet modifié.
**Scale/Scope**: 11 états, 4 scènes, 2 personnages, 6 lieux (2 détaillés, 4 en silhouette lisible).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Comment le plan le respecte | Statut |
|---|---|---|
| I. Source intouchable | Copie ciblée vers `content/source/` et `public/assets/deck/` ; empreintes MD5 rejouées par `scripts/check-source.sh` ; aucune écriture dans `~/Desktop/zawedni-video-pfe` | ✅ |
| II. Contenu fidèle | Textes saisis dans `src/content/states.js` avec l'id source ; `scripts/check-content.mjs` compare chaque phrase projetée à `script_rows.py` / `deck.html` et cherche les mots interdits | ✅ |
| III. Clic déterministe | `src/nav/` : liste d'états, index unique, une touche = ±1, transition interrompue = posée à l'arrivée ; pas d'écoute `wheel`/`scroll` ; hash URL | ✅ |
| IV. Monde 3D lisible | Un seul `World` chargé une fois ; caméra par cadres ; panneaux DOM face au jury en lecture ; règles de non-recouvrement vérifiées sur captures | ✅ |
| V. Preuves et licences | Images du deck copiées telles quelles ; `ASSETS.md` liste chaque fichier, origine, licence lue ; aucun achat | ✅ (dépend de R1) |
| VI. Hors ligne | Fontes extraites du `deck.offline.html` / `scene/fonts` accepté, GLB locaux, décodeur meshopt local ; test Playwright avec routes externes bloquées | ✅ |
| VII. Simple d'abord | Deux dépendances d'exécution ; quatre modules séparés (contenu, navigation, caméra, personnages) sans couche d'abstraction en plus | ✅ |

Re-check après Phase 1 : ✅ (data-model et contrats ne demandent aucune exception).

## Project Structure

### Documentation (this feature)

```text
specs/001-prototype-4-scenes/
├── plan.md              # ce fichier
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   ├── state-schema.md  # forme d'un état de présentation
│   └── keyboard.md      # contrat de navigation et raccourcis présentateur
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
index.html                 # fenêtre jury : canvas + couche DOM des panneaux ; aucune commande visible
presenter.html             # fenêtre présentateur : notes seules, aucun WebGL, aucun son
present.sh                 # lanceur : serveur local (réutilisé) + fenêtres jury et présentateur
src/
├── main.js                # amorçage : préchargement, World, Director, clavier
├── content/
│   ├── states.js          # les 11 états : id source, étape, panneaux, notes, cadre, acteurs
│   └── panels.js          # panneaux DOM (textes exacts, images réelles) et leur ancrage 3D
├── presenter/
│   ├── link.js            # BroadcastChannel « zawedni-story-3d » : état, commandes, hello/snapshot
│   └── presenter.js       # rendu des notes (à dire / À lire à l'écran / ajout / prochain clic)
├── nav/
│   ├── director.js        # index courant, aller/retour/saut, interruption, hash URL
│   └── keys.js            # → Espace PageDown / ← PageUp / raccourcis présentateur
├── camera/
│   └── rig.js             # cadres {position, cible, fov}, easing, mouvement réduit
├── characters/
│   ├── actors.js          # chargement GLB, mixer, fondus walk/idle/look/point
│   └── path.js            # route = courbe, abscisse ↔ position, vitesse de pas
├── world/
│   ├── world.js           # scène, lumière, ombres, sol, route, six lieux
│   ├── places.js          # positions et couleurs de rôle des lieux, ancres de panneaux
│   └── quality.js         # normal / léger (pixel ratio, ombres, effets)
└── styles.css             # tokens de couleur, Poppins / JetBrains Mono locales
public/
├── fonts/                 # Poppins, JetBrains Mono, Amiri (formule arabe) — copies locales
├── models/                # GLB compressés (personnages, kits d'environnement)
├── assets/deck/           # logos et captures copiés du deck accepté, intacts
└── draco|meshopt/         # décodeur local si compression
content/source/            # copies en lecture seule : script_rows.py, PLAN_PRESENTATION.md, SOURCE.md (md5)
scripts/
├── check-source.sh        # rejoue les md5 de la source acceptée
├── check-content.mjs      # textes projetés = source ; mots interdits absents
└── verify.mjs             # Playwright : parcours, déterminisme, console, réseau, captures
review/                    # captures 1920×1080 et enregistrement du parcours
DESIGN.md  HANDOFF.md  ASSETS.md  PLAN-41.md
```

**Structure Decision**: application statique unique à la racine du projet ; la séparation demandée par le
brief (contenu / navigation / caméra / personnages) correspond aux dossiers `content`, `nav`, `camera`,
`characters` ; `world` porte le décor. Pas de dossier tests séparé : les contrôles sont trois scripts.

## Approche par scène

- **A — Ouverture.** A0/A1 en couche DOM reprenant la couverture acceptée (formule arabe Amiri, logos
  originaux, séquence d'apparition ≈ 2,8 s), monde déjà chargé mais caché. A1 → A2 : la couverture se
  retire, la caméra descend d'une plongée haute vers la vue du parcours ; six étiquettes de lieux (DOM
  ancrées) apparaissent dans l'ordre de la route, comme la liste du sommaire.
- **B — Achat local.** Trajet du guide sur la route (≈ 2,5 s), caméra en suivi décalé puis cadre fixe sur
  la place (étals, caisses, ocre). Panneaux des constats puis des réponses posés sur des supports du lieu,
  face caméra. Représentant : regard puis geste vers la carte « grille ».
- **C — Grille.** Cadre resserré sur le support de la grille ; phrase et images réelles (piliers web,
  question mobile) en grand ; pointage dont la cible est l'ancre 3D du panneau. C2 : recul, les quatre
  cartes reliées et la flèche de retour. C3 : vue du parcours, lieu 01 marqué visité.
- **D — DevSecOps.** Trajet vers la zone technique (bleu, serveurs, écrans). La boucle en infini est un
  ruban 3D au sol ou en relief, six bornes d'étapes ; étiquettes DOM. D2 : cadre vers le croisement
  Sécurité, le retour s'allume (menthe), ligne Sécurité affichée. D3 : recul vers le parcours.

## Deux fenêtres et lanceur

- **Autorité unique** : la fenêtre jury possède l'index courant (`director.js`). La fenêtre présentateur
  ne calcule rien : ses touches envoient `{cmd:'next'|'prev'|'go', i}` sur un `BroadcastChannel` ; la
  fenêtre jury applique puis diffuse `{state: id}`. À son ouverture (ou rechargement) le présentateur
  envoie `hello`, la fenêtre jury répond par l'état courant : rattrapage immédiat. Si aucune réponse en
  1 s : « Fenêtre jury absente ». Le hash d'URL de la fenêtre jury garde l'état au rechargement ; à son
  retour elle rediffuse son état.
- **Présentateur** : page `presenter.html` séparée (aucun module 3D importé, aucun média) ; affiche
  l'état courant, sa source (`probleme`, étape 1), les phrases à dire, les phrases « À lire à l'écran »
  mises en évidence, les ajouts signalés « ajout », le repère « Prochain clic : … » et un aperçu textuel
  de l'état suivant ; minuteur cliquable pour remise à zéro.
- **Ouverture automatique** : la fenêtre jury lancée avec `?pv=x,y,w,h` (ou `?pv=auto`) ouvre elle-même
  `presenter.html` à cette position (`window.open`, popups autorisés par le profil dédié) — même
  mécanisme que l'ancien `presenter.sh`. `N` la rouvre.
- **`present.sh`** : se place dans son propre dossier (`cd "$(dirname "$(readlink -f "$0")")"`) ; vérifie
  que `dist/` existe (sinon explique `npm install && npm run build`, une seule fois) ; teste
  `http://127.0.0.1:4317/.zawedni-story-3d` (fichier témoin du build) : réponse attendue ⇒ réutilise,
  port occupé par autre chose ⇒ message et arrêt, rien ⇒ lance `python3 -m http.server 4317 --bind
  127.0.0.1 --directory dist` en arrière-plan et attend la réponse (10 s max). Puis Chrome avec un profil
  dédié (`~/.cache/zawedni-story-3d-chrome`), `--ozone-platform=x11` (Wayland ignore les positions),
  écran externe en plein écran pour le jury, `?pv=` = géométrie de l'écran `eDP` (lue par `xrandr`) ;
  `--swap` inverse. Un seul écran ⇒ message « Joindre » et ouverture des deux fenêtres quand même.
  Python 3 et Chrome sont déjà sur la machine : rien à installer au lancement.

## Phase 0 — Recherche (research.md)

- **R1 personnages et kits** : fait — Quaternius Ultimate Modular Men (CC0, rig commun, Walk/Idle/
  Interact/Wave), Kenney (CC0), baies de serveurs construites ; pointage et regard par rotation d'os.
- **R2 versions** : three, vite, gltf-transform, playwright ; décodeur meshopt local.
- **R3 références visuelles** : impress.js, roadmap Prezi, bruno-simon.com, Refero Styles, 21st.dev, React
  Bits — en animation, pas en captures ; retenir 3–5 décisions, aucun composant importé tel quel.
- **R4 fontes hors ligne** : extraction des woff2 de `deck.offline.html` ou TTF de `scene/fonts`.
- **R5 texte net** : panneaux DOM projetés vs texte SDF 3D ; choix et raison.
- **R6 mesure de fluidité** : méthode réelle (Chrome visible avec GPU, `requestAnimationFrame`, moyenne
  et p5 sur chaque trajet) ; le headless (rendu logiciel) ne sert pas à mesurer.

## Phase 1 — Conception

- `data-model.md` : État, Cadre, Panneau, Lieu, Personnage, Action, Asset, règles de validation.
- `contracts/state-schema.md`, `contracts/keyboard.md`.
- `quickstart.md` : installer, lancer, parcourir, vérifier, exporter les images.

## Skills mobilisés

Réellement installés dans cette session : `impeccable` et `frontend-design` (direction artistique,
typographie, palette), `animate` + `emil-design-eng` + `apple-design` (courbes, durées, interruption,
mouvement réduit), `ui-design:accessibility-compliance` (contraste, mouvement réduit), `claude-in-chrome`
ou `example-skills:webapp-testing` (contrôles navigateur), `ffmpeg-skill` (enregistrement, images),
`agy-delegate` (option : confier des tâches isolées, comme les kits de lieux, à Antigravity, revue du diff
avant commit). Aucun skill 3D ou personnages dédié n'est installé : on ne le prétend pas.

## Risques

| Risque | Effet | Parade |
|---|---|---|
| Pas de pack gratuit avec geste « pointer » | Geste raté ou absent | Rotation d'os + `CCDIKSolver` sur Idle ; sinon montrer le résultat à Ali (aucun pack payant vérifié n'a de clip « Point » ; Mixamo exclu pour des fichiers livrés) |
| Kits disparates entre eux | Monde incohérent | Un seul éditeur de kits ; matière commune réappliquée (palette, rugosité) |
| GPU intégré faible | Saccades | Qualité légère : pixel ratio 1, ombres baked/contact seulement, pas de post-traitement |
| Texte 3D flou | Illisible au jury | Textes et captures en DOM (R5) |
| Trajets trop longs | Discours rallongé | Trajets ≤ 2,5 s, révélations ≤ 0,8 s ; SC-009 |

## Suite (après retour d'Ali) — plan court pour les 41 séquences

Livré à part dans `PLAN-41.md` à la fin du prototype : correspondance des 41 séquences et 65 clics vers
lieux et états (tableau du brief §4), lieux à construire (atelier chapitre 2, ligne de livraison chapitre 4,
centre de supervision chapitre 5, belvédère chapitre 6, salle de projection pour la vidéo), personnage
technique éventuel, vue présentateur muette en seconde fenêtre, lecteur vidéo. Ce n'est pas une seconde
fonctionnalité Spec Kit tant qu'Ali n'a pas validé le style.

## Complexity Tracking

Aucune exception à la constitution.
