# Feature Specification: Prototype ZAWEDNI Story 3D — quatre scènes

**Feature Branch**: `001-prototype-4-scenes`
**Created**: 2026-10-10
**Status**: Draft
**Input**: Brief d'Ali, `docs/BRIEF.md` (copie de `PROMPT_CLAUDE_ZAWEDNI_STORY_3D.md`), §8 : « un prototype
de quatre scènes » jouable au clicker, à juger avant d'étendre le style aux 41 séquences.

Source du contenu : deck accepté `~/Desktop/zawedni-video-pfe/soutenance/` (voir constitution, principe I).
Les citations ci-dessous sont reprises mot pour mot de `build/script_rows.py` et `deck.html`.

## Parcours d'états du prototype

Onze états, dix actions « suivant ». Chaque état porte l'identifiant de la séquence source.

| État | Scène | Source | Ce que voit le jury | Clic accepté ? |
|---|---|---|---|---|
| A0 | A | `couverture` étape 0 | La formule arabe seule, sur le fond du monde encore caché | — |
| A1 | A | `couverture` étape 1 | Logos, MEMOIRE DE FIN D'ETUDES, titre, Ali Zribi et la formation, bloc « Les membres du jury » | oui |
| A2 | A | `sommaire` étape 1 | Révélation du monde : la route et les six lieux, chacun avec numéro, titre et ligne d'explication ; le guide au départ | oui |
| B1 | B | `probleme` étape 1 | Caméra et guide rejoignent la place de l'achat local ; les trois constats lisibles | oui (trajet ajouté) |
| B2 | B | `reponse` étape 1 | Les quatre réponses ; la grille en tête ; le représentant d'entreprise se tourne et la désigne | oui |
| C1 | C | `reponse` (détail) | Zoom sur la grille : la phrase de la grille et le support réel ; le représentant pointe la grille | ajouté |
| C2 | C | `reponse` (retour) | Recul : grille → validation → marché local → suivi, avec la flèche de retour vers la grille | ajouté |
| C3 | — | `sommaire` (rappel) | Vue générale du parcours, chapitre 1 marqué comme visité | ajouté |
| D1 | D | `devsecops` étape 0 | Caméra et guide rejoignent la zone technique ; cycle en forme d'infini, six étapes ; le guide indique « Construire et tester » | oui (trajet ajouté) |
| D2 | D | `devsecops` étape 1 | Rapprochement du croisement « Sécurité » ; la ligne Sécurité et le retour des observations s'allument | oui |
| D3 | — | `sommaire` (rappel) | Arrêt stable, retour à la vue du parcours | ajouté |

Les états « ajouté » sont des mouvements de caméra sans nouveau texte de discours, sauf la phrase de
transition signalée en FR-012.

**Rythme comparé au deck** : pour le même contenu, le deck demande 9 appuis (étape de la couverture ;
passage au sommaire + son étape ; passage au problème + son étape ; passage à la réponse + son étape ;
passage au cycle + son étape). Le prototype en demande 10 : il fusionne « passage + étape » en un appui
pour le sommaire, le problème et la réponse (−3), garde l'étape de la couverture et l'étape du cycle, et
ajoute 4 appuis de caméra (C1, C2, C3, D3). La phrase dite avant le clic dans le deck (« Pour comprendre
l'idée de ZAWEDNI, on part de trois constats. », « ZAWEDNI propose une réponse à ces trois points. ») se
dit pendant le trajet ou l'arrivée ; les phrases `[lire]` apparaissent une fois le cadre immobile.

**Raccord D1** : la note acceptée de `devsecops` commence par « Ces outils forment un cycle continu. »,
qui renvoie à la slide des outils, absente du prototype. Une courte phrase d'amorce, marquée « ajout »
dans `notes.added`, la précède dans le prototype (FR-012). Le prototype relie directement l'idée à DevSecOps ; la version complète
replacera le chapitre 2 entre les deux.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Ouverture et révélation du monde (Priority: P1)

Ali ouvre le prototype en plein écran et appuie sur son clicker. La couverture acceptée apparaît, puis le
monde ZAWEDNI se dévoile : une route relie six lieux, un par chapitre, et un guide attend au départ. Le jury
comprend le parcours d'un coup d'œil, comme avec le sommaire actuel.

**Why this priority**: c'est la première image du style 3D ; si elle ne convainc pas, rien d'autre ne compte.

**Independent Test**: ouvrir le prototype, faire A0 → A1 → A2 et juger l'image A2 en 1920×1080.

**Acceptance Scenarios**:

1. **Given** l'état A0, **When** Ali appuie sur →, **Then** la couverture se complète comme dans le deck
   accepté (logos originaux, titre « Conception et déploiement d'une plateforme web et mobile pour l'achat
   local intégrant une approche DevSecOps », Ali Zribi, formation, jury).
2. **Given** l'état A1, **When** Ali appuie sur →, **Then** la caméra révèle la route et six lieux
   distincts, chacun étiqueté avec les textes du sommaire : « 01 Contexte et objectifs — La startup, le
   problème et la solution proposée », « 02 Développement de la plateforme — Les choix techniques, la
   conception et les interfaces », « 03 Architecture et démarche DevSecOps — Les outils, le cluster, le
   réseau et les secrets », « 04 Chaîne CI/CD et déploiement — Le trajet d’un changement jusqu’au
   déploiement », « 05 Supervision et validation — Le suivi des services et les résultats des essais »,
   « 06 Bilan et perspectives — Les apports du mémoire et les prochaines étapes ».
3. **Given** l'état A2 atteint, **When** le mouvement se termine, **Then** le cadre est immobile, les six
   étiquettes sont lisibles et le guide est visible à une échelle cohérente avec les bâtiments.

---

### User Story 2 — Lieu de l'achat local et zoom sur la grille (Priority: P1)

Depuis la vue du monde, un clic emmène la caméra et le guide jusqu'à la place de l'achat local. On y lit
les trois constats, puis les quatre réponses de ZAWEDNI. Un représentant d'entreprise désigne la grille
d'évaluation ; un clic rapproche le cadre de la grille, qu'il pointe précisément. Un clic de recul montre
la relation de la grille avec le reste de la solution, puis la vue générale permet de repartir.

**Why this priority**: c'est le test des personnages, de la synchronisation geste-texte et de la mise en
valeur de la grille, valeur ajoutée du mémoire.

**Independent Test**: lancer directement l'état A2, parcourir B1 → C3 et vérifier textes, gestes et
cadrages.

**Acceptance Scenarios**:

1. **Given** A2, **When** →, **Then** le guide marche sur la route jusqu'à la place, la caméra
   l'accompagne puis s'arrête ; ensuite seulement apparaissent, dans l'ordre : « Les actions RSE restent
   parfois ponctuelles, comme des dons. » ; « Il manque une stratégie claire pour agir et suivre les
   résultats. » ; « Il est difficile de comparer les fournisseurs locaux sur leurs pratiques
   responsables. »
2. **Given** B1, **When** →, **Then** les quatre réponses sont lisibles mot pour mot : « Une grille
   d'évaluation pour mesurer les pratiques de l'entreprise. » ; « Une validation pour rendre les
   fournisseurs évalués visibles sur le marché. » ; « Un marché local pour trouver des partenaires et
   suivre les achats. » ; « Des recommandations, un guide pour une stratégie RSE et un rapport ESG pour
   suivre les résultats. » ; la grille est en tête et mise en valeur ; le représentant tourne le regard
   vers elle au moment où elle apparaît.
3. **Given** B2, **When** →, **Then** le cadre se rapproche de la grille ; la phrase de la grille est face
   au jury ; un support réel du deck l'accompagne (piliers web `v6-sup-piliers.jpg` et question mobile
   `v3-mob-evaluation.jpg`), proportions conservées ; la main du représentant désigne la grille sans
   couvrir ni texte ni capture.
4. **Given** C1, **When** →, **Then** le cadre recule et montre l'enchaînement grille → validation →
   marché local → suivi, avec la flèche de retour vers la grille.
5. **Given** C2, **When** →, **Then** la vue générale revient, le lieu 01 est marqué comme visité et le
   guide est sur la route.

---

### User Story 3 — Zone DevSecOps (Priority: P2)

Un clic emmène la caméra et le guide vers la zone technique du même monde. Le cycle DevSecOps y forme une
boucle en infini, avec ses six étapes. Le guide indique une étape. Un clic rapproche le cadre du croisement
« Sécurité » et allume le retour des observations vers le développement. On finit par un arrêt stable, puis
le retour à la vue du parcours.

**Why this priority**: valide que le style tient pour la partie technique ; dépend du monde de US1.

**Independent Test**: lancer l'état C3, parcourir D1 → D3.

**Acceptance Scenarios**:

1. **Given** C3, **When** →, **Then** caméra et guide quittent la place, suivent la route vers la zone
   technique et s'arrêtent face à la boucle ; les étapes sont lisibles : « Planifier », « Coder »,
   « Construire et tester », « Livrer et déployer », « Exploiter », « Superviser » ; les côtés
   « Développement — Préparer et vérifier » et « Exploitation — Déployer et observer » ; au croisement
   « Sécurité — tout au long du cycle » ; le guide pointe « Construire et tester ».
2. **Given** D1, **When** →, **Then** le cadre se rapproche du croisement ; le retour s'allume avec
   « Les observations reviennent vers le développement pour préparer les corrections » et la ligne
   « Sécurité : analyses avant publication · accès protégés au déploiement · surveillance pendant
   l’exploitation » apparaît, synchronisée avec le geste du guide.
3. **Given** D2, **When** →, **Then** la caméra recule jusqu'à la vue du parcours, cadre immobile.

---

### User Story 4 — Pilotage fiable pendant la soutenance (Priority: P2)

Ali avance, recule, se trompe, appuie deux fois vite, touche la souris, recharge la page ou saute à une
scène. Le prototype reste dans un état connu et produit toujours la même image pour un état donné. Les
commandes de présentateur existent sans être visibles pour le jury.

**Why this priority**: sans cela le prototype n'est pas présentable, mais il se juge après le rendu.

**Independent Test**: suite de manipulations clavier et rechargements, comparaison des captures d'un même
état atteint par des chemins différents.

**Acceptance Scenarios**:

1. **Given** n'importe quel état, **When** →, Espace ou PageDown, **Then** exactement un état de plus ;
   **When** ← ou PageUp, **Then** exactement un état de moins.
2. **Given** une transition en cours, **When** Ali appuie de nouveau, **Then** la transition en cours se
   termine aussitôt à son état d'arrivée et l'appui est appliqué une seule fois ; trois appuis rapides
   depuis A2 mènent à C1, jamais au-delà.
3. **Given** l'état C1 atteint en avançant, **When** on recharge la page, on recule depuis C2, ou on saute
   directement à la scène C, **Then** l'image finale de C1 est identique.
4. **Given** Ali a cliqué dans la page avec la souris, **When** il appuie sur →, **Then** la navigation
   fonctionne toujours ; le défilement de la molette ne change rien.
5. **Given** une scène quelconque, **When** Ali utilise les raccourcis présentateur (plein écran, retour au
   début, saut à une scène, qualité légère, mouvement réduit), **Then** l'effet a lieu sans qu'aucun
   bouton, flèche ou panneau de commande soit visible du jury.
6. **Given** le réseau coupé, **When** on ouvre le prototype, **Then** toutes les scènes s'affichent avec
   leurs fontes, modèles et images.

---

### User Story 5 — Matériel de revue pour Ali (Priority: P3)

Ali reçoit de quoi juger vite : des images en taille réelle des quatre scènes, un court enregistrement du
parcours, un `DESIGN.md`, un `HANDOFF.md` et un plan court pour les 41 séquences.

**Why this priority**: c'est la forme de la livraison, produite une fois le prototype stable.

**Independent Test**: les fichiers existent, les images correspondent aux états listés, l'enregistrement
se lit.

**Acceptance Scenarios**:

1. **Given** le prototype terminé, **When** Ali ouvre le dossier de revue, **Then** il trouve au moins une
   image 1920×1080 par scène (A2, B2, C1, D2 au minimum) et un enregistrement du parcours complet.
2. **Given** `HANDOFF.md`, **When** Ali le lit, **Then** il y trouve la commande exacte pour ouvrir le
   prototype, les touches, la liste des assets avec provenance et licence, les vérifications réellement
   faites avec leurs mesures et les limites rencontrées.

### User Story 6 — Deux fenêtres : jury et présentateur, lancées par une commande (Priority: P1)

Ali lance `./present.sh`. La fenêtre jury s'ouvre en plein écran sur le projecteur et ne montre que la
présentation. La fenêtre présentateur s'ouvre d'elle-même sur l'écran de l'ordinateur et montre le
discours de l'état affiché : phrases à dire, phrases « À lire à l'écran », transitions ajoutées, repère du
prochain clic. Les deux fenêtres restent synchronisées quoi qu'Ali fasse.

**Why this priority**: c'est le fonctionnement de l'ancienne version ; sans lui, le prototype n'est pas
présentable en conditions réelles. Exigence d'Ali du 2026-10-10 : livré dès le prototype.

**Independent Test**: lancer `./present.sh` depuis un autre dossier, réseau coupé ; avancer, reculer,
sauter de scène, recharger, cliquer à la souris dans chaque fenêtre puis utiliser le clavier ; fermer et
rouvrir la fenêtre présentateur en cours de route.

**Acceptance Scenarios**:

1. **Given** la préparation initiale faite, **When** Ali lance `./present.sh` (depuis n'importe quel
   dossier), **Then** le serveur local démarre ou est réutilisé, le script attend qu'il réponde, puis la
   fenêtre jury et la fenêtre présentateur s'ouvrent sans autre action ; aucune installation ni
   téléchargement n'a lieu.
2. **Given** les deux fenêtres ouvertes, **When** Ali avance, recule ou saute à une scène depuis l'une ou
   l'autre fenêtre, **Then** la fenêtre présentateur affiche aussitôt le discours de l'état courant et du
   clic suivant, et la fenêtre jury l'état correspondant.
3. **Given** la présentation en cours à l'état C1, **When** la fenêtre présentateur est ouverte (touche
   `N`) ou rechargée, **Then** elle affiche immédiatement C1, sans revenir au début.
4. **Given** la fenêtre jury rechargée, **When** elle se rouvre, **Then** elle reprend l'état courant et
   la fenêtre présentateur reste synchronisée.
5. **Given** la fenêtre présentateur, **When** on l'observe, **Then** elle ne lance aucune scène 3D,
   aucun son, et la fenêtre jury ne montre ni notes ni commandes.
6. **Given** un seul écran ou des écrans en miroir, **When** Ali lance `./present.sh`, **Then** les deux
   fenêtres s'ouvrent quand même et un message simple explique comment passer en mode « Joindre ».

### Edge Cases

- → sur le dernier état (D3) ou ← sur le premier (A0) : rien ne bouge, aucune erreur.
- Appuis très rapides et alternés (→ ← → ←) pendant un trajet : état final = somme des appuis, image
  stable, pas de personnage figé à mi-pas.
- Fenêtre redimensionnée ou plein écran activé en pleine transition : le cadrage final reste correct.
- Un modèle ou une texture n'est pas encore chargé à l'entrée d'une scène : on ne montre pas d'objet qui
  apparaît en retard (préchargement avant le premier état).
- Machine lente : le mode qualité légère garde lisibilité et style ; les textes restent nets.
- Préférence système « réduire les animations » active : trajets remplacés par des fondus courts, mêmes
  états finaux.
- Saut direct vers un état où un personnage pointe : le personnage est déjà à sa position et dans sa pose
  finale.
- Fenêtre présentateur ouverte sans fenêtre jury : elle l'indique (« Fenêtre jury absente ») et ses
  touches ne font rien d'autre.
- Serveur local déjà lancé par une autre application sur le port prévu : le script ne le réutilise pas et
  le signale.

## Requirements *(mandatory)*

### Functional Requirements

**Monde et rendu**

- **FR-001**: Le prototype MUST présenter un seul monde 3D continu où une route relie six lieux, un par
  chapitre ; les lieux 01 (achat local : marché) et 03 (zone technique : cloud) sont détaillés, les quatre
  autres sont lisibles à l'échelle de la vue générale.
- **FR-002**: Le rendu MUST montrer volumes, matières mates, lumière douce et ombres de contact ; plaques
  inclinées, emojis et personnages en primitives sont exclus.
- **FR-003**: Le monde MUST garder l'identité du deck : fond clair, verts ZAWEDNI, Poppins et JetBrains
  Mono ; au plus trois couleurs ajoutées (bleu technique, ocre achat local, orange attention), chacune liée
  au rôle d'un lieu.
- **FR-004**: Les logos MUST être les fichiers originaux du deck, sans déformation ni variante.
- **FR-005**: Aucun bâtiment ne MUST être présenté comme la pépinière de Mahdia.

**Personnages**

- **FR-006**: Le prototype MUST inclure deux personnages articulés et animés (un guide, un représentant
  d'entreprise), cohérents entre eux, avec au moins marche, arrêt/repos, regard et pointage.
- **FR-007**: La marche MUST suivre la route, à une vitesse cohérente avec le pas (pas de glissement), et
  se terminer avant l'apparition du texte à lire.
- **FR-008**: Un geste de pointage MUST viser la position réelle de l'élément révélé, au moment où il
  apparaît.
- **FR-009**: Aucun personnage ne MUST masquer un texte, une capture ou une étiquette dans un état de
  lecture ; aucun ne traverse un objet.
- **FR-010**: Pendant un état de lecture, les personnages MUST rester calmes (pas de geste répété) ; aucun
  son.

**Contenu**

- **FR-011**: Chaque texte projeté MUST correspondre mot pour mot à la source citée dans le tableau des
  états ; chaque état MUST garder l'identifiant de la séquence source et les notes du discours accepté
  correspondantes.
- **FR-012**: Toute phrase de transition ajoutée MUST être courte, marquée « ajout » dans les notes et
  absente de la projection sauf nécessité.
- **FR-013**: Les supports de la grille MUST être des images réelles du deck, proportions conservées ;
  aucune capture de grille en cours de saisie n'est fabriquée.
- **FR-014**: La métaphore MUST respecter le contenu : le cycle DevSecOps est une boucle en infini, ses six
  étapes dans l'ordre de la source.

**Navigation et caméra**

- **FR-015**: La navigation MUST passer uniquement par le clavier : →, Espace, PageDown (suivant) ;
  ←, PageUp (précédent) ; les touches d'un clicker standard. La molette et le défilement sont ignorés.
- **FR-016**: Chaque appui MUST produire exactement un changement d'état ; un appui pendant une
  transition termine celle-ci à son état d'arrivée puis s'applique une seule fois.
- **FR-017**: Chaque état MUST être décrit par des données (cadre de caméra, position et action des
  personnages, éléments visibles), de sorte qu'un même état produise la même image quel que soit le
  chemin pour l'atteindre, y compris après rechargement.
- **FR-018**: L'état courant MUST survivre à un rechargement de la page et pouvoir être atteint
  directement (lien ou raccourci).
- **FR-019**: Les mouvements de caméra MUST avoir un début et une fin, sans rotation arbitraire, tour
  prolongé ni zoom permanent ; les trajets entre lieux peuvent être amples, les révélations dans un lieu
  restent courtes.
- **FR-020**: Dans un état de lecture, textes et images MUST être face au jury et lisibles en 1920×1080.
- **FR-021**: Un mode « mouvement réduit » MUST exister (raccourci et préférence système), avec les mêmes
  états finaux.

**Présentateur et technique**

- **FR-022**: Le prototype MUST offrir sans élément visible pour le jury : plein écran, retour au début,
  saut vers chacune des quatre scènes, bascule qualité légère, bascule mouvement réduit.
- **FR-023**: Le prototype MUST fonctionner réseau coupé : fontes, modèles, animations, textures et images
  sont dans le projet.
- **FR-024**: Les assets de la scène suivante MUST être chargés avant que l'on en ait besoin ; au premier
  état, tout ce qui sert au prototype est déjà chargé.
- **FR-025**: Un niveau de qualité léger MUST exister et garder le style et la lisibilité.
- **FR-026**: Contenu (textes et notes), états de navigation, cadres de caméra et actions des personnages
  MUST être séparés et éditables sans toucher au moteur de rendu.
- **FR-027**: Chaque asset tiers MUST avoir sa provenance et sa licence lues et consignées ; aucun achat.
- **FR-028**: Aucun fichier de l'ancien projet ne MUST être modifié ; seules des copies sont faites dans
  le nouveau projet.

**Fenêtre présentateur et lancement**

- **FR-030**: Le prototype MUST fournir une fenêtre présentateur distincte de la fenêtre jury ; la fenêtre
  jury ne montre ni notes, ni discours, ni commande.
- **FR-031**: La fenêtre présentateur MUST afficher, pour l'état courant : les phrases à dire, les phrases
  `[lire]` signalées « À lire à l'écran », les transitions ajoutées signalées comme telles, le repère du
  prochain clic (ce qu'il déclenche) et la position dans le parcours.
- **FR-032**: Les deux fenêtres MUST rester synchronisées à chaque avance, retour, saut ou rechargement,
  quelle que soit la fenêtre où la touche est pressée ; une fenêtre présentateur ouverte ou rechargée en
  cours de route récupère immédiatement l'état courant.
- **FR-033**: La fenêtre présentateur MUST rester muette et ne MUST pas créer de seconde scène 3D.
- **FR-034**: `present.sh`, à la racine du projet, MUST démarrer ou réutiliser le serveur local du
  projet, attendre qu'il réponde, puis ouvrir la fenêtre jury (plein écran, écran externe) et la fenêtre
  présentateur (écran de l'ordinateur) ; il MUST fonctionner depuis n'importe quel dossier, hors ligne,
  sans installation ni téléchargement ; la touche `N` rouvre la fenêtre présentateur si besoin.

**Livrables**

- **FR-029**: La livraison MUST comprendre : le prototype et sa commande d'ouverture, des images 1920×1080
  des quatre scènes, un court enregistrement du parcours, `DESIGN.md`, `HANDOFF.md`, un plan court pour les
  41 séquences ; pas de PDF ; toute archive se nomme `zawedni-story-3d-prototype.zip`.

### Key Entities

- **Séquence source**: une des 41 séquences du deck accepté ; identifiant (`couverture`, `probleme`…),
  titre, nombre de clics, notes du discours, phrases `[lire]`.
- **État de présentation**: un arrêt du parcours ; référence à une séquence source et à une étape, cadre de
  caméra, éléments de contenu visibles, action de chaque personnage, notes du présentateur.
- **Lieu**: zone du monde associée à un chapitre ; position sur la route, couleur de rôle, éléments 3D,
  points d'ancrage des panneaux de contenu.
- **Panneau de contenu**: texte ou image réelle placé dans un lieu, face caméra en lecture ; texte exact
  ou fichier d'image, taille minimale lisible.
- **Personnage**: guide ou représentant ; modèle, tenue, animations disponibles, provenance et licence.
- **Action de personnage**: pour un état, position d'arrivée sur la route, animation (marche, repos,
  regard, pointage) et cible visée.
- **Asset**: fichier embarqué ; chemin, origine (deck accepté ou tiers), provenance, licence.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Le parcours complet A0 → D3 se fait en 10 appuis « suivant », et en 10 appuis « précédent »
  pour revenir, sans aucun état sauté ni doublé, sur 3 essais consécutifs.
- **SC-002**: Pour chacun des 11 états, l'image atteinte en avançant, en reculant, par saut direct et après
  rechargement est visuellement identique (comparaison des captures).
- **SC-003**: 20 appuis rapides au hasard (moins de 150 ms d'écart) laissent le prototype dans l'état égal
  à la somme des appuis, sans erreur dans la console.
- **SC-004**: Dans chaque état de lecture, 100 % des textes projetés sont identiques à la source et aucun
  n'est recouvert, même partiellement, par un personnage ou un objet (vérification sur captures).
- **SC-005**: Le plus petit texte de lecture mesure au moins 24 px de hauteur de capitale sur une image
  1920×1080.
- **SC-006**: Réseau coupé, le prototype s'ouvre et se parcourt entièrement ; aucune requête vers un
  domaine externe n'est observée.
- **SC-007**: Sur la machine disponible, en qualité normale, les trajets tiennent au moins 50 images par
  seconde en moyenne (mesure réellement effectuée et rapportée) ; en qualité légère, au moins 30 sur une
  machine plus faible ou avec bridage simulé.
- **SC-008**: Aucun personnage ne glisse visiblement ni ne pointe à côté de sa cible sur l'enregistrement
  du parcours (contrôle visuel image par image aux arrivées et aux gestes).
- **SC-009**: La durée parlée du prototype n'augmente pas de plus de 15 s par rapport aux mêmes séquences
  du deck accepté (trajets compris).
- **SC-011**: Sur 10 manipulations (avance, retour, saut, rechargement de chaque fenêtre, ouverture
  tardive des notes), la fenêtre présentateur affiche le bon état en moins de 0,5 s, sans exception.
- **SC-012**: `./present.sh` lancé réseau coupé depuis un autre dossier ouvre les deux fenêtres en moins
  de 10 s.
- **SC-010**: Ali peut juger le style en moins de 2 minutes à partir des images et de l'enregistrement,
  sans avoir à lancer le code.

## Assumptions

- Prototype joué sur un ordinateur portable ordinaire, navigateur Chromium ou Firefox récent, projection
  1920×1080, clicker qui envoie →/← ou PageDown/PageUp.
- Ali n'a pas fourni de photo de la pépinière : le monde ne la représente pas, le prototype n'attend pas.
- Les personnages viennent de packs gratuits à licence permissive (vérifiée avant usage) ; s'il n'en
  existe pas d'assez bons, le plan le signale avant d'en acheter (aucun achat sans accord).
- La vidéo n'apparaît pas dans le prototype ; ses règles de lecture valent pour la version complète.
- La vue présentateur (seconde fenêtre muette, ouverte par `present.sh`) fait partie du prototype
  (décision d'Ali du 2026-10-10). Préparation unique avant hors ligne : `npm install` et `npm run build`.
- La version complète (41 séquences, 65 clics de référence) est hors périmètre ; elle fait l'objet d'un
  plan court livré avec le prototype.
