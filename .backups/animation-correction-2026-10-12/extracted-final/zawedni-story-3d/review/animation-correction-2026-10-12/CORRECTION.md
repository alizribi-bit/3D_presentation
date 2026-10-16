# Correction ciblée des animations — 12 octobre 2026

Les transitions de contenu gardent désormais le cadre visible. L'occultation porte
uniquement sur les grands panneaux qui gênent une explication 3D ou un déplacement.
Le contenu accepté, le discours, les captures, les proportions et les modèles n'ont
pas été retouchés. Aucun reset ni restauration globale n'a été effectué.

Le projet modifié est `/home/ali/Desktop/zawedni-story-3d`. Le lanceur historique et
la présentation classique restent inchangés. Le build final est
`8e7783bbb56931a340228aa368cf2660ee84ec3bdb10fcb7151ccdb7e7e6b395`.
HEAD reste `b43378c` : cette session autorise la lecture de `.git`, pas son écriture.
Le checkpoint sélectif antérieur aux corrections est un TAR avec empreintes SHA-256,
dans `.backups/animation-correction-2026-10-12/`, exclu de la livraison.

## Changements et points d'entrée

| Fichier / fonction | Changement |
|---|---|
| [transition-plan.ts](../../src/nav/transition-plan.ts), `classifyTransition()` | Classification typée : contenu, approche, objet, monde, voyage avant, relocalisation. Géométrie réelle et commande priment sur le seul nom de plan ou `move`. |
| `visiblePanels()` | Sélection des panneaux gênants ; les repères partagés restent actifs. |
| [director.js](../../src/nav/director.js), `go()` | Capture de caméra/poses conservée ; une destination de contenu aux mêmes ancres conserve le trajet ou la relocalisation engagée. |
| `frame()` | `#stage` reste opaque et visible. Seuls les panneaux sélectionnés reçoivent l'opacité du directeur. Un panneau absent de la destination reste à zéro. |
| `pose()` | La marche terminale concerne les voyages avant ; précédent/saut utilisent la relocalisation rapide depuis la pose affichée. |
| [timeline.ts](../../src/nav/timeline.ts), `transitionTiming()` | Budgets indépendants ; aucune sortie/entrée globale pour les passages fixes, aucune attente de stabilisation ajoutée. |
| `transitionFrame()`, `contentStart()` | Horloge absolue et continuité du pointage/retour visuel : la fin d'un rapprochement ne redémarre pas les gestes. |
| [rig.js](../../src/camera/rig.js), `shotAt()` | Courbe douce pour les mouvements courts ; rythme central des longs voyages conservé. |
| [evidence.ts](../../src/story/evidence.ts), `show()` | Remplacement atomique des snapshots. Seules les nouvelles révélations détectées reçoivent une entrée locale de 200 ms ; captures et nouvelles slides peuvent être remplacées immédiatement. |
| [styles.css](../../src/styles.css) | Suppression du blocage permanent `.timeline`. `data-directed` neutralise uniquement la transition du panneau piloté, puis est retiré. Géométrie et échelle conservées. |
| [timeline.test.ts](../../tests/timeline.test.ts) | Critères de visibilité, repères, marche, retour/saut, interruption, mouvement réel et horloge des gestes. |
| [verify-animation-correction.mjs](../../scripts/verify-animation-correction.mjs) | Touches jury et véritables commandes des boutons du présentateur ; chronologie réelle, sans modification de l'heure. L'ancien vérificateur délègue maintenant à celui-ci. |
| [package-release.py](../../scripts/package-release.py) | Nouvelle archive ciblée, avec rapport/vidéo et sans sauvegardes de travail ni vidéos brutes. |

`src/main.js`, le film, le présentateur, le parcours, les modèles et les exports du
contenu restent inchangés. La vidéo conserve le démarrage sur la révélation avant
`video-0 → video-1`, la pause lors d'un saut direct et le rembobinage à la sortie.
Le présentateur ne charge aucun `video`, `audio` ou `canvas`.

## Budgets vérifiés et mesures réelles

Les budgets ci-dessous viennent des transitions déclenchées en navigateur. La colonne
« arrivée observée » mesure la commande jusqu'à la première frame échantillonnée dont
le contrôleur a terminé le mouvement. Elle inclut les images perdues du rendu logiciel ;
elle ne mesure pas la latence complète du GPU. Pour un passage fixe, « arrivée » signifie
remplacement du contenu, avant la fin éventuelle de son animation locale.

| Exemple | Caméra | Total contrôleur | Arrivée observée, quatre configurations |
|---|---:|---:|---:|
| `probleme-0 → probleme-1` | 0 s | 0 s ; nouveauté locale 0,20 s | 0,002–0,003 s |
| `parcours-app-1 → parcours-app-2` | 0 s | 0 s ; échange local possible | 0,002–0,004 s |
| `startup-1 → probleme-0` | 0 s | 0 s | 0,001–0,174 s |
| `plateforme-2 → sequence-0` | 0,65 s | 0,65 s | 0,683–1,077 s |
| `devsecops-0 → devsecops-1` | 0,65 s | 0,65 s | 0,677–1,236 s |
| `ch2-0 → outils-dev-0` | 1,00 s | 1,00 s | 1,178–1,584 s |
| `retour-0 → retour-1` | 1,75 s | 2,11 s | 1,918–2,514 s |
| `methodologie-1 → ch2-0` | 4,50 s | 4,86 s | 4,687–5,049 s |
| `ch2-0 → methodologie-1` | 0,75 s | 1,11 s | 0,922–1,341 s |

Les panneaux sélectionnés sortent en 160 ms et entrent en 200 ms. Si l'interruption
commence depuis une opacité nulle, la sortie n'est pas répétée : retour de 0,75 + 0,20 s.
Les rapprochements gardent le cadre ; celui du cycle conserve titre, étiquettes et
boucle. Les états d'administration 0 et 2 cachent les deux objets téléphone et l'APK,
sans retirer le panneau. Les autres états web/mobile les rétablissent localement.

Le voyage avant conserve les derniers 2,6 mètres de marche. Avec un mouvement de
4,50 s, la pointe théorique est d'environ 1,728 m/s, sous la limite de 1,8 m/s.
La marche a été effectivement échantillonnée dans les quatre configurations ; aucun
poids de marche n'a été observé lors des rapprochements, reculs ou relocalisations.

Les rafales au même lieu conservent `t0`, les chemins et la progression de marche.
Les six commandes du scénario ont toutes été comptées et la dernière destination
`outils-dev-0` est apparue. Les retours partent de la caméra et des poses affichées,
sans atterrir sur la cible abandonnée. La rafale sur un saut conserve son mouvement
de 0,75 s. Les rafales pendant une entrée finissent sur la destination attendue.

## Contrôles exécutés

- `npm test` : **39 tests réussis**, zéro échec.
- Build : contrôle de provenance/contenu, `tsc --noEmit`, compilation Vite réussis ;
  `scripts/check-build.py` valide les fichiers et leur identité.
- **84 scénarios navigateur** : 21 par configuration, normal/léger à 1920×1080 et
  1366×768, deux fenêtres synchronisées. Aucune erreur JavaScript, requête externe
  ou réponse HTTP en erreur dans ces scénarios.
- **95 passages fixes** parcourus par les commandes réelles du présentateur, avec
  cadre actif, caméra fixe et marche nulle. Ce parcours a été réalisé sur le build
  `c99bb51c…`; les changements ultérieurs concernent la relocalisation interrompue
  et l'horloge des gestes après mouvement. Classification, visibilité et remplacement
  des passages fixes sont inchangés ; les 39 tests finaux recontrôlent les 95 cas.
  Les 84 scénarios détaillés portent tous sur le build final `8e7783bb…`.
- Animations CSS de couverture observées **en cours d'exécution** après plusieurs
  voyages, sans classe `.timeline`. Révélations locales de texte également observées.
- Film : saut direct en pause, révélation avant déclenchant la lecture, aucun départ
  pendant le mouvement, pause/rembobinage à la sortie, aucun média dans les notes.
- Mouvement réduit vérifié par la touche M ; `fast` testé séparément par les tests
  de chronologie et le contrôle de l'archive, jamais utilisé pour la vidéo de revue.
- **44 slides, 70 révélations, 114 états, 113 avances** conservés. Discours et frames
  comparés aux références par les contrôles existants. Les 226 fichiers protégés
  recensés et les 524 fichiers du dossier historique ont conservé leurs empreintes.

Audit de sécurité ciblé : commandes toujours validées par `parseCommand()`, exports
HTML toujours filtrés, aucune dépendance ajoutée, aucun accès réseau externe introduit.
Les nouveaux effets utilisent des paramètres constants et les fichiers locaux acceptés.

Le détail est dans [report.json](report.json), [measurements.json](measurements.json),
[preservation.json](preservation.json) et [correction.diff](correction.diff).

## Enregistrement et limites

[La vidéo à vitesse normale, 59,60 s](animations-normal.mp4) reprend les neuf exemples et deux
interruptions/rafales. Les préparations instantanées sont coupées ; les actions filmées
sont des touches ou commandes réelles. Seules des coupes et légendes sont ajoutées,
sans accélération, ralentissement ni interpolation. La vidéo ne contient pas d'audio.
La capture finale utilise un viewport réel de 1366×768 et un fichier de 960×540,
vérifiés en navigateur, avec onze scénarios supplémentaires à vitesse normale.
Le découpage et le moteur de rendu sont dans [recording.json](recording.json).

Tous les contrôles visuels utilisent **ANGLE / Mesa llvmpipe, LLVM 20.1.2**, un rendu
logiciel. La médiane d'échantillonnage des scénarios est d'environ **2,04 images/s** ;
les 25 images/s du MP4 contiennent des répétitions et ne prouvent pas une animation 3D
à 25 images/s. Les compositions, repères, longues phases et marche d'arrivée sont
observables ; les fondus locaux de 200 ms restent moins fidèlement visibles.
**Aucune observation du GPU réel d'Ali n'est revendiquée.** L'agrément et la fluidité
sur sa machine restent à apprécier sur ce GPU.

L'archive finale `release/zawedni-story-3d-animations-corrigees.zip` est reconstruite
avec sources, build, preuves locales et revue courante. Son manifeste SHA-256 et sa
vérification après extraction sont fournis séparément. La provenance immuable v7
reste incluse car les contrôles de source en dépendent ; les checkpoints, essais
échoués, anciens scripts sauvegardés et enregistrements bruts restent hors archive.
