# ZAWEDNI 3D — reprise de l’état actuel

Cet export fige le projet `/home/ali/Desktop/zawedni-story-3d` le 12 octobre 2026,
avec ses modifications locales. Lire ce document avant les anciens handoffs.
Pendant cet export : aucune application du plan V11, aucune correction d’animation,
aucune compilation, aucun import de contenu, aucun checkout/reset/commit Git.
Seuls les fichiers d’export ont été écrits. Le projet classique est resté en lecture seule.

## 1. Projet actif, lancement et build livré

Le lanceur maintenu est `present.sh`, à la racine de ce projet. Il sert **son propre
`dist/`**, sur `http://127.0.0.1:4318`, en mode complet par défaut. Il contrôle les
empreintes des sources, du build et de l’identité du serveur avant présentation.
`--swap` inverse les écrans ; `ZS3D_PORT=4320` choisit un autre port.

Le lanceur historique
`/home/ali/Desktop/zawedni-video-pfe/zawedni-story-3d/present.sh` est un **relais** vers
`/home/ali/Desktop/zawedni-story-3d/present.sh`. Son contenu actuel a été relu et
archivé dans `export/historical-launcher.sh.txt`. Il ne sert pas le vieux dossier
imbriqué. `content/history/legacy-nested-present.sh` conserve l’ancienne version.
Dans l’archive extraite, lancer directement le `present.sh` local.
Les README/CLAUDE et certains plans historiques peuvent encore citer le dossier
imbriqué, 41 séquences/106 états ou d’anciens résultats ; ce document et la référence
capturée actuelle font foi pour cette reprise.

Au contrôle d’export, **4318 ne répondait pas** et le service de 4317 renvoyait 404
pour `/build-info.json`. Aucun serveur ni navigateur n’a été démarré pour cet export.
Le dossier réellement servi par le lanceur est donc établi par son code et les
rapports existants, sans prétendre qu’une présentation était en cours.

**Le build existant est fourni, sans recompilation.** Son identité est
`8e7783bbb56931a340228aa368cf2660ee84ec3bdb10fcb7151ccdb7e7e6b395`.
Toutes ses empreintes ont été vérifiées contre les sources actuelles.
Pour éviter de stocker deux fois les médias, fontes, modèles et frames, le ZIP
contient `public/` complet et uniquement les fichiers propres au build dans `dist/`.
Après extraction, restituer les 194 assets identiques, puis lancer :

```bash
cd ZAWEDNI_3D_HANDOFF
python3 EXPORT_TOOLS.py verify
python3 EXPORT_TOOLS.py restore
python3 scripts/check-build.py .
bash present.sh
```

La restitution est une copie locale vérifiée depuis `public/` vers `dist/` :
**aucun npm install ni build requis pour présenter**. Python 3 et Google Chrome,
ainsi qu’un environnement graphique compatible avec le lanceur Linux, sont nécessaires.
Le ZIP brut n’est pas directement présentable avant cette restitution. Le script
refuse une source altérée, un lien symbolique ou un fichier de build différent ;
il n’écrase pas un asset existant différent. Il peut être relancé sans effet supplémentaire.
Le champ `projectRoot` du build garde sa provenance originale ; le contrôle utilise
la racine extraite, sans exiger cet ancien chemin.

## 2. Git et modifications locales

HEAD et baseline demandé : **`b43378cebe8fd7ae2ff1eb9da69078564087945c`**,
`feat: complete accepted 44-sequence 3D story revision`.
Il y a 83 fichiers suivis modifiés/supprimés contre HEAD. Les sources actuelles
incluent aussi les fichiers utiles non suivis et les assets normalement ignorés.

Les différences couvrent notamment la synchronisation classique, les frames et
notes exactes, le présentateur TypeScript, l’identité du build et les transitions.
`src/presenter/presenter.js` est supprimé ; `src/presenter/presenter.ts` est présent.
Les changements préexistants Spec Kit sont conservés dans `.specify/`.

`export/git-status.txt`, `export/tracked-changes.diff` et `export/diff-stat.txt`
conservent l’état Git et le diff complet des modifications suivies pertinentes.
Les ajouts non suivis sont **dans l’archive** ; le diff ne les contient pas.
`export/INCLUDED_FILES.json` distingue fichiers suivis, non suivis et ignorés inclus.
`baseline/src/` est extrait directement du commit avec `git archive`, sans changer
le répertoire de travail. Il représente uniquement l’ancien `src/`, pas un build
complet ni un remplacement des sources actuelles. Aucun `.git` n’est livré.

## 3. Sources du contenu et compteurs

La référence active est
`/home/ali/Desktop/zawedni-video-pfe/soutenance/deck.html`, son bundle de lancement
`deck.offline.html` et `build/script_rows.py`. La capture locale de référence est
dans `content/reference/` : `deck.html`, `script_rows.py`, manifeste, textes et
empreintes des états. L’export ne transporte pas tout le projet classique.

Les compteurs de `content/reference/manifest.json` sont **44 slides, 70 révélations,
114 états et 113 avances**. `content/source/sequences.json` reprend les 44 lignes.
`public/content/` contient les frames locales et leurs styles ; le monde 3D les
affiche avec les preuves réelles. Discours : `docs/SCRIPT-ACTUEL.md`.
Correspondance de chaque clic : `docs/CORRESPONDANCE.md` et JSON.
Provenance historique v7 conservée dans `content/history/v7/`, nécessaire aux contrôles.

Les captures, logos, fontes, modèles runtime et le film final sont inclus dans
`public/`. **Le film final accepté dure 90 s et conserve son audio** ; il est distinct
de la courte vidéo de revue séparée. Licences originales : `public/licenses/`.
Durée orale : consulter `docs/DURATION.json` et `PRESENTER.md` ; les estimations
historiques de transitions peuvent précéder les derniers changements d’animation.
Une répétition parlée reste nécessaire.

## 4. V11 et synchronisation classique : état étayé

**Aucun plan V11 n’a été trouvé dans les fichiers du projet examinés**, par noms
de fichiers et recherche textuelle dans les documents/configurations. Aucun fichier
V11 n’est donc ajouté ni inventé ; rien n’a été appliqué pendant l’export.
Il est impossible d’attester l’achèvement d’un plan absent. Les corrections déjà
présentes sont documentées comme telles dans
`review/animation-correction-2026-10-12/CORRECTION.md`, sans les assimiler à V11.
Un plan fourni dans un autre chat devra être transmis séparément.

La conformité du contenu actuel est étayée par les tests et contrôles exécutés
pendant l’export : ordre, discours, empreintes des 114 frames et référence locale
passent. Les huit fichiers sources classiques et les 29 assets référencés ont été
relus et leurs empreintes sont inchangées par rapport au manifeste.

Les rapports classiques livrés doivent être lus avec leurs dates et limites :
`review/classic/1366x768/report.json` contient **249/249 réussites**
(2026-10-12T16:07:47Z). Le fichier 1920×1080 le plus récent contient
**239 réussites et un échec sur 240**, un timeout de `page.reload`
(2026-10-12T16:50:40Z). Il remplace dans le dossier une preuve antérieure :
les mentions « 249/249 aux deux résolutions » dans les anciens documents ne décrivent
pas exactement ce dernier fichier. Le rapport média historique contient 12/12 réussites,
et celui d’extraction classique 6/6. Ce sont des contrôles antérieurs, pas une nouvelle
validation intégrale en navigateur du présent export.

## 5. Animation, captures et vidéo récente

Le diagnostic **antérieur aux corrections déjà présentes** est inclus dans
`review/animation-diagnostic-2026-10-12/` : diagnostic, mesures, rapport, diff et
copies des mécanismes avant modification. Il ne décrit pas à lui seul le comportement
actuel. Le rapport de correction, les mesures, le diff ciblé, les journaux de build/tests
et huit captures jury/notes plus récentes sont inclus dans
`review/animation-correction-2026-10-12/`.

Ce rapport déclare 84 scénarios d’animation sur le build final, répartis en 21 scénarios
pour chacune des quatre configurations normal/léger × 1920×1080/1366×768,
sans erreurs JS, appels externes ni échecs réseau. Le parcours navigateur des 95 passages
fixes concernait un build intermédiaire ; les tests unitaires actuels les recontrôlent.
Le détail des builds et limites figure dans `CORRECTION.md`.

La vidéo séparée `ZAWEDNI_3D_RECENT.mp4` est une copie exacte de
`review/animation-correction-2026-10-12/animations-normal.mp4`, modifiée le
12 octobre vers 20:30 heure locale. H.264, 960×540, **59,600 s**, sans audio.
Sa provenance détaillée et son SHA-256 sont dans `VIDEO_PROVENANCE.json`
(également livré séparément). Coupes et légendes seulement, vitesse originale,
aucune interpolation. La capture vient d’ANGLE/Mesa **llvmpipe**, rendu logiciel,
viewport 1366×768. Les 25 images/s encodées ne prouvent pas une fluidité GPU à 25 fps ;
les mesures indiquent environ 2,04 échantillons/s. La vidéo ne remplace pas l’essai
sur le GPU réel d’Ali. Elle n’est pas dupliquée dans le ZIP.

Pour rétablir le lien du rapport de correction vers la vidéo, copier cette vidéo
à `review/animation-correction-2026-10-12/animations-normal.mp4` dans l’export extrait.
Cela n’est nécessaire ni au build ni à la présentation. Les anciennes vidéos,
galeries exhaustives et images QA non sélectionnées sont omises ; consulter
`export/OMISSIONS.json` et `export/CAPTURES.md`.

## 6. Commandes pour poursuivre dans le nouveau chat

Pour présenter le build fourni : commandes de la section 1. Pour développer ou
reconstruire **après cet export**, avec Node compatible avec le lockfile :

```bash
npm ci
npm run dev                  # Vite, 127.0.0.1:5317
npm test
npm run typecheck
npm run check
npm run build                # produit dist/ ; ne pas lancer pour exporter
npm run preview              # preview sur 4318
```

Pages : `/` pour le jury et `/presenter.html` pour les notes. `present.sh` ouvre les
deux fenêtres. Il utilise Python pour servir le build, indépendamment du serveur Vite.
Le présentateur reste sans WebGL ni média ; le film/audio est uniquement chez le jury.

Vérifications navigateur futures : `npm run verify:classic`,
`VIEWPORT=1366x768 npm run verify:classic`,
`node --import tsx scripts/verify-animation-correction.mjs` et
`node scripts/verify-media.mjs`. Ces scripts peuvent écrire leurs rapports/captures.
Certains vérificateurs et la resynchronisation dépendent du projet classique local ;
l’export contient les captures nécessaires aux tests/builds, pas toutes ses sources.

**Ne pas exécuter `npm run sync:classic` pour une simple reprise** : cette commande
réextrait et réécrit les contenus du projet 3D. Pour une future synchronisation
explicitement décidée : `CLASSIC_SOURCE=/chemin/vers/soutenance npm run sync:classic`.
Le classique doit rester en lecture seule. Les exports de notes et de durée suivent
ensuite, avec tests et build. Les scripts d’import d’assets originaux ne sont pas
nécessaires pour reconstruire ou présenter l’état livré.

`.codex/config.toml` conserve le chemin original de workspace : revoir ce chemin
si l’export est installé ailleurs. Les configurations n’annulent jamais les permissions
gérées de l’environnement. Les consignes métier et d’ingénierie restent dans `AGENTS.md`.

## 7. Derniers contrôles et problèmes ouverts

Pendant cet export : **39/39 tests**, typage sans émission, conformité du contenu,
provenance historique et classique, identité du build existant et ffprobe passent.
Journaux dans `export/current-unit-tests.txt` et `export/current-checks.txt`.
Le rapport externe `ZAWEDNI_3D_HANDOFF_VERIFICATION.json` consigne CRC, empreintes
de chaque entrée, extraction, restitution du build, tests du restituteur et préservation
des fichiers du projet et des sources classiques surveillées. Aucun build ni contrôle
visuel nouveau n’a été exécuté pendant l’export.

Restent ouverts : essai sur GPU réel, fluidité perceptuelle, timeout du dernier parcours
classique 1920×1080 à réévaluer, essai sur deux écrans physiques/clicker/audio projecteur,
lisibilité à distance et répétition orale chronométrée. TypeScript strict est configuré,
mais le JavaScript historique reste sous `checkJs: false`. L’absence du plan V11 empêche
d’en vérifier les objectifs ou de le présenter comme terminé.

## 8. Assets séparés, omissions et intégrité

**Aucun asset runtime ne manque et aucun pack séparé n’est requis.** Les packs originaux
volumineux `assets-src/`, sauvegardes, anciennes archives `release/`, `node_modules`,
caches, `.git`, données locales de credentials et QA redondante sont exclus.
Les ressources runtime et licences restent incluses. Pour refaire un import original,
restituer `assets-src/` depuis la machine d’Ali à la même racine et avec les sous-dossiers
attendus par `scripts/import-assets.sh` ; les textes de licences/pages de provenance
de `public/licenses/` identifient les packs. Ces originaux ne sont pas livrés séparément.

`RUNTIME_RESTORE.json` documente chaque asset dédupliqué. `MANIFEST_SHA256.json` et
`SHA256SUMS` couvrent tous les fichiers livrés sauf ces deux manifestes eux-mêmes
(leur intégrité est couverte par le SHA-256 externe du ZIP). `python3 EXPORT_TOOLS.py verify`
vérifie les empreintes après extraction. Après restitution, les copies ajoutées dans
`dist/` sont vérifiées par `scripts/check-build.py` ; le manifeste de l’export continue
à vérifier les entrées originales.

Vérification du conteneur et de la vidéo, depuis leur dossier de livraison :

```bash
sha256sum -c ZAWEDNI_3D_HANDOFF.zip.sha256
sha256sum -c ZAWEDNI_3D_RECENT.mp4.sha256
```

Les omissions exactes, leur taille et la sélection des captures sont détaillées
dans `export/OMISSIONS.json` et `export/CAPTURES.md`. Le scan de secrets porte sur
les noms sensibles et les signatures fortes de credentials, sans modifier les preuves
ou les slides consacrées à la gestion des secrets ; aucun credential de ce type n’a été détecté.
