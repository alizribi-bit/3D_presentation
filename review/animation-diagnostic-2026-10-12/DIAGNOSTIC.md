Diagnostic des animations ZAWEDNI Story 3D — 12 octobre 2026

Le défaut principal est une généralisation du fondu de toute la couche de contenu à chaque navigation. Elle concerne aussi les révélations et changements de capture qui conservent la caméra et la position du guide. Ce comportement est établi par le diff Git et les fonctions de chronologie ; les déplacements avec occultation sont également observés dans le navigateur. Aucune correction n’a été implémentée.

Le lanceur du dossier historique `/home/ali/Desktop/zawedni-video-pfe/zawedni-story-3d/present.sh` délègue à `/home/ali/Desktop/zawedni-story-3d/present.sh`. Le projet servi et diagnostiqué est donc le second. Son HEAD est `b43378cebe8fd7ae2ff1eb9da69078564087945c`, branche `001-prototype-4-scenes`, commit du 12 octobre à 15:08:21 +0100 : « complete accepted 44-sequence 3D story revision ». La version exécutée comprend les modifications locales postérieures à ce commit. Le contrôleur de chronologie et ses changements associés ne sont pas encore commités ; `src/nav/timeline.ts` est un fichier non suivi.

Le dernier point Git précédant ce nouveau mécanisme est précisément **b43378c**, et non son parent. `7458d7c` est le checkpoint antérieur des 41 séquences, et `9729dbb` celui du prototype. Le reflog ne montre pas de checkpoint intermédiaire des transitions. L’historique permet de retrouver le mécanisme précédent ; il ne permet pas d’identifier avec certitude une éventuelle version locale non commitée à laquelle Ali fait référence.

Comparaison effectuée par `git show b43378c:…` et `git diff HEAD -- …`, sans reset, checkout ni restauration. Les copies lisibles du [directeur précédent](before-director.js.txt), du [rig précédent](before-rig.js.txt), de la [marche précédente](before-arrival.ts.txt) et le [diff des mécanismes](animation-before-after.diff) sont joints. Les changements récents de contenu, de mise en page et de correspondance avec le projet classique sont exclus des propositions de correction. Les durées comparées ci-dessous appliquent le mécanisme précédent aux mêmes destinations actuellement acceptées ; ce n’est pas une réexécution de l’ancienne présentation complète.

Le build vérifié et servi par `present.sh` est `f28b99edacde91573e7c308d4bbf9989cfaf4bf447444e96c719b344d64405f0`. Le lanceur vérifie les empreintes des sources et du dist ; le diagnostic porte donc sur un build correspondant aux sources inspectées.

Les décisions sont réparties entre les fonctions suivantes.

| Décision | Fonction exacte et emplacement | Condition actuelle |
|---|---|---|
| Traduire une touche ou un bouton en navigation | `bindKeys`, [keys.js](/home/ali/Desktop/zawedni-story-3d/src/nav/keys.js:13) ; `command`, [main.js](/home/ali/Desktop/zawedni-story-3d/src/main.js:101) ; `parseCommand`, [commands.ts](/home/ali/Desktop/zawedni-story-3d/src/nav/commands.ts:2) | →/espace/PageDown : suivant ; ←/PageUp : précédent ; chiffres : chapitres. Les boutons des notes envoient les mêmes commandes par BroadcastChannel. La répétition automatique d’une touche tenue est ignorée. |
| Construire les destinations | `makeItinerary`, [itinerary.ts](/home/ali/Desktop/zawedni-story-3d/src/story/itinerary.ts:15) | Définit `source.seq/step`, `shot`, `panels`, les positions des acteurs, `move`, `duration`. `reveal` comprend aussi des changements de caméra ; ce champ seul ne décrit donc pas le mouvement réel. |
| Créer ou interrompre une transition | `Director.go`, [director.js](/home/ali/Desktop/zawedni-story-3d/src/nav/director.js:33) | Toute destination différente crée une transition, sauf `instant:true`. Capture le cadrage et les poses affichés ; construit un trajet pour chaque acteur dont la position de destination diffère. |
| Calculer les durées | `transitionTiming`, [timeline.ts](/home/ali/Desktop/zawedni-story-3d/src/nav/timeline.ts:24), avec `shotDistance`, [rig.js](/home/ali/Desktop/zawedni-story-3d/src/camera/rig.js:20) et `minimumArrivalDuration`, [arrival.ts](/home/ali/Desktop/zawedni-story-3d/src/characters/arrival.ts:12) | Dépend de la longueur caméra et de la marche, des modes réduit/fast. N’utilise plus `to.duration`, ni une durée spécifique pour précédent/saut. |
| Choisir sortie, mouvement, stabilisation, entrée | `transitionFrame`, [timeline.ts](/home/ali/Desktop/zawedni-story-3d/src/nav/timeline.ts:38) | Évalue le temps absolu depuis `tr.t0`, l’opacité et la progression. Même sans mouvement : sortie puis entrée. |
| Masquer et réafficher toute la couche | `Director.frame`, [director.js](/home/ali/Desktop/zawedni-story-3d/src/nav/director.js:71) | Écrit `#stage.style.opacity/visibility`. Pendant `move/settle`, le Set de panneaux est vide. Pendant `exit`, conserve le contenu sortant ; pendant `enter/done`, montre le contenu cible. |
| Appliquer la visibilité de chaque panneau | `updatePanels`, [panels.js](/home/ali/Desktop/zawedni-story-3d/src/content/panels.js:106), `setCover`, [panels.js](/home/ali/Desktop/zawedni-story-3d/src/content/panels.js:123) ; `EvidencePanel.show`, [evidence.ts](/home/ali/Desktop/zawedni-story-3d/src/story/evidence.ts:88) | Bascule `.on` et `inert`. `EvidencePanel.show` remplace la frame HTML quand la clé `seq-step` change, même lorsque le panneau est caché. |
| Déplacer la caméra | `Director.frame` → `shotAt`, [rig.js](/home/ali/Desktop/zawedni-story-3d/src/camera/rig.js:41), avec `ease` ligne 11 | `k=0` durant la sortie, interpolation durant `move`, `k=1` durant stabilisation/entrée. Interpole position, cible et FOV ; ajoute éventuellement le `LIFT` défini dans `shots.js`. |
| Déplacer et faire marcher le personnage | `Director.pose`, [director.js](/home/ali/Desktop/zawedni-story-3d/src/nav/director.js:169) ; `arrivalWalk`, [arrival.ts](/home/ali/Desktop/zawedni-story-3d/src/characters/arrival.ts:17) ; `TravelPath.sample` / `routePath`, [path.ts](/home/ali/Desktop/zawedni-story-3d/src/characters/path.ts:3) | Marche seulement lorsqu’un trajet existe et que sa progression de marche est entre 0 et 1. Pour un trajet long, masque la relocalisation puis montre au maximum les 2,6 derniers mètres. Sans translation, `walkW=0` ; orientation/regard/pointage peuvent changer. |
| Appliquer le cycle et l’opacité du personnage | `Actor.apply`, [actors.js](/home/ali/Desktop/zawedni-story-3d/src/characters/actors.js:62) | Le temps du clip Walk vient de `walkDist/cycle`. Son poids est `walkW`. L’opacité concerne les matériaux 3D et la visibilité de `root`, indépendamment de `#stage`. |
| Synchroniser le film et les objets 3D | `stateChanged` / callback `onFrame`, [main.js](/home/ali/Desktop/zawedni-story-3d/src/main.js:78), `FilmPlayer.show`, [player.ts](/home/ali/Desktop/zawedni-story-3d/src/media/player.ts:21), `StoryWorld.frame`, [story.ts](/home/ali/Desktop/zawedni-story-3d/src/world/story.ts:133) | Le film est suspendu à la commande et apparaît à destination. Les props 3D sont évalués depuis l’état affiché et la progression ; ils ne font pas partie de la couche DOM occultée. |

Les états essentiels du directeur sont `i` (destination logique), `tr` (transition active), `renderedState` (état évalué pour l’affichage, y compris lorsqu’il est caché), `renderedPoses` et `contentOpacity`. `moving` signifie uniquement phase `move` ; `settled` signifie absence de `tr`, donc fin également de l’entrée. Les notes et le hash passent à la destination dès la commande, avant son apparition effective. Un chargement par hash ou un `hashchange` utilise `instant:true` et contourne la chronologie normale : un test qui ne fait que changer les hashes ne reproduit pas les transitions du clicker.

La règle précédente conservait explicitement les panneaux partagés :

```js
// b43378c, Director.frame
const appear = !tr ? 0 : motion.reduced ? 0 : tr.back ? D * .6
  : to.move === 'travel' ? D * .96
  : from.shot !== to.shot ? D * .82 : .25;
to.panels.forEach((p, n) => {
  const lab = /^l0\d$/.test(p) && !from.panels.includes(p) ? n * .22 : 0;
  if (from.panels.includes(p) || t >= appear + lab) vis.add(p);
});
```

Ainsi, pour `evidence → evidence`, la frame HTML suivante était remplacée dès la première frame sans retirer `.on` au contenant. Un panneau absent de la destination perdait `.on` et sortait via son CSS. Un nouveau panneau pouvait attendre `appear` et bénéficier de son entrée CSS. Les repères du sommaire étaient échelonnés ; le titre partagé restait présent.

La règle actuelle supprime cette continuité :

```js
// Director.frame
const outgoing = timeline.phase === 'exit';
const display = outgoing ? tr.from : to;
const visible = outgoing || timeline.phase === 'enter' || timeline.phase === 'done';
stage.style.opacity = String(timeline.opacity);
stage.style.visibility = timeline.opacity > 0 ? 'visible' : 'hidden';
const vis = new Set(visible ? display.panels : []);
```

Le contrôleur ne distingue pas une révélation, une capture différente et une nouvelle slide à cadrage identique. `moves=false` supprime seulement le déplacement et la stabilisation ; il conserve 120 ms de sortie et 180 ms d’entrée. L’opacité atteint zéro au basculement à 120 ms. **Ce cas ne comporte pas 300 ms de plateau entièrement caché** : il comporte un fondu complet de 300 ms avec un passage à zéro. Lors d’un vrai mouvement, le plateau caché dure `movement + 180 ms`.

Le recensement des 114 états donne 113 passages successifs : **95 sans changement de caméra ni translation du guide** (67 étapes internes, 28 nouvelles slides) et 18 changements de caméra, dont 6 avec changement de position du guide. Le fondu global concerne les 113 passages. Aucun déclenchement systématique de marche n’a été constaté pour les 95 passages fixes depuis un état arrivé.

Les six situations demandées existent réellement, mais leurs frontières ne correspondent pas toutes aux valeurs `move`.

| Cas et exemple actuel | Avant : mécanisme b43378c | Maintenant : comportement et durée nominale |
|---|---|---|
| Révélation de texte : `probleme-0 → probleme-1` | `evidence` restait actif ; frame suivante remplacée immédiatement. Caméra et guide fixes. Pour les panneaux natifs conservés, seules les nouveautés apparaissaient ; le sommaire avait un échelonnement. | Toute la surface sort puis rentre en **0,30 s**, malgré `movement=0`. Aucun déplacement ni marche. Ce n’est pas une frappe progressive : les textes viennent de frames exportées. |
| Changement de capture : `parcours-app-1 → parcours-app-2` | Même contenant actif ; échange du HTML et de la capture active sans sortie globale. Caméra `workshopProof` fixe. | Même fondu global **0,30 s**. Le cadre entier est concerné, et non la seule image. Le guide reste au même point. `StoryWorld.frame` masque aussi le téléphone du décor aux étapes 0 et 2 : cette règle 3D est distincte de la disparition de `#stage`. |
| Nouvelle slide avec caméra inchangée : `startup-1 → probleme-0` | `source.seq` changeait mais le panneau `evidence` partagé restait visible ; seul son contenu changeait. | Traitée comme une révélation interne : sortie/entrée de **0,30 s**, sans déplacement ni marche. |
| Rapprochement : `plateforme-2 → sequence-0`, `devsecops-0 → devsecops-1` | Caméra déplacée sur **D=0,65 s**. Panneaux partagés maintenus. Nouveaux panneaux non partagés autorisés après `0,82D≈0,533 s`, puis leur CSS. Guide fixe. | **0,24 + 0,65 + 0,18 + 0,30 = 1,37 s**. Caméra commence après la sortie ; titres/repères/preuves cachés pendant 0,83 s ; réapparition à 1,07 s. Aucune marche. Le second cas rapproche réellement la caméra du cycle 3D, tout en ajoutant les textes de retour et de sécurité. |
| Retour au monde : `retour-0 → retour-1` | Changement `belvedere → overview` classé `reveal` ; caméra sur **D=0,65 s**. `evidence` partagé restait actif. Guide inchangé. | Distance caméra élevée, mouvement plafonné à **6,50 s**, total **7,22 s**. Preuve masquée pendant 6,68 s ; entrée à 6,92 s. Guide fixe, donc aucun trajet de retour à pied. Le plan s’élargit mais ne réactive pas les six étiquettes du sommaire : les panneaux de cet état sont toujours `['evidence']`. |
| Déplacement entre chapitres : `methodologie-1 → ch2-0` | Voyage avant sur **D=5,20 s** ; marche terminale courte déjà présente. Le panneau d’ouverture spécifique `chapter-02` devenait éligible à `0,96D=4,992 s`, avant son entrée CSS. En arrière/saut : **D=0,80 s**, acteurs relocalisés par fondu, sans ce trajet marché. | Avant et arrière observés : mouvement **4,3195 s**, total **5,0395 s**, contenu caché 4,4995 s, entrée à 4,7395 s. Trajet et marche terminale aussi en retour/saut si les positions diffèrent. Le panneau de chapitre utilise désormais `evidence`, changement de représentation conservé dans les propositions. |

Le passage suivant `ch2-0 → outils-dev-0` est encore un autre cas : rapprochement `chapter02 → workshop`, guide inchangé, sans marche. Il dure désormais **1,9259 s** au total, dont 1,2059 s de mouvement, contre 0,65 s de mouvement auparavant. Une ouverture de chapitre n’implique donc pas nécessairement que le clic suivant fasse marcher le personnage.

La durée précédente était :

```js
const D = this.fast ? .03 : motion.reduced ? .35
  : back || jump ? .8 : to.duration || .9;
```

La durée actuelle est :

```ts
const moves = distance > 1e-5 || walkingLength > 1e-5;
const movement = fast ? (moves ? .03 : 0) : reduced ? 0
  : moves ? clamp(Math.max(distance / 14, walkMinimum), .65, 6.5) : 0;
const exit = fast ? .01 : moves && !reduced ? .24 : .12;
const settle = movement ? .18 : 0;
const enter = fast ? .01 : moves && !reduced ? .3 : .18;
```

`shotDistance` prend le maximum entre la longueur de la courbe caméra, la distance de la cible regardée et `|ΔFOV|×0,25`. La courbe est échantillonnée sur 32 segments et inclut sa surélévation. `walkMinimum = min(2,6, longueur du trajet)/(0,38×0,88×1,8)`, soit **4,3195 s** pour un trajet d’au moins 2,6 m. Cette contrainte devient souvent dominante pour un voyage et s’applique désormais également en retour et en saut.

La sortie maintient la caméra et la pose capturées. La marche est évaluée sur `elapsed - exit` ; elle se déroule entre 54 % et 92 % du mouvement. Le personnage disparaît pendant une partie de la relocalisation, puis parcourt ses derniers mètres, avec un poids de clip ramené à zéro à l’arrêt. Le cycle reste lié à la distance, pas au nombre de frames. Pour un voyage avant de 5,2 s dans la version précédente, le pic de cette marche terminale était environ 1,50 m/s ; avec le nouveau minimum de 4,3195 s il peut atteindre 1,80 m/s. Le changement n’est donc pas un ralentissement uniforme de toutes les animations.

L’easing caméra a aussi changé : avant `easeInOutCubic`, pic de dérivée normalisée 3 au milieu ; maintenant accélération et freinage courts de 18 %, avec une dérivée centrale constante d’environ 1,2195. Cela change la perception du mouvement même à durée identique. Le calcul `distance/14` n’impose pas une vitesse physique constante exacte : easing, minimum et plafond modifient la vitesse, et le cadrage peut être la distance dominante.

Attention à la comparaison des durées : l’ancien directeur gardait `tr` jusqu’à `D+2,6 s` pour les gestes et révélations CSS. Cette valeur n’était pas une attente de panneau entièrement caché. Le nouveau termine à `exit+movement+settle+enter`. Les chiffres « avant D » et « maintenant total » sont donc volontairement distingués.

Deux autres règles généralisent la disparition des effets locaux : [styles.css](/home/ali/Desktop/zawedni-story-3d/src/styles.css:39) désactive `transition` et `animation` sur toutes les `.pane` et leurs descendants quand `body.timeline` est présent ; [evidence.ts](/home/ali/Desktop/zawedni-story-3d/src/story/evidence.ts:84) fait de même dans le Shadow DOM des preuves. `Director.frame` ajoute `timeline` à chaque frame et ne le retire pas après arrivée. Les entrées locales, délais de couverture et effets internes concernés restent donc désactivés même en lecture. Le contenu apparaît via le fondu commun de `#stage`.

Les interruptions ont été examinées séparément. Avant, `go()` appelait `settle()` avant de repartir : suppression de la transition courante et nouveau départ depuis la destination logique nominale. La destination interrompue pouvait ainsi être sautée visuellement, sans garantie de continuité de pose. Maintenant, le départ vient de `captureShot(camera)`, `renderedPoses` et `contentOpacity`, sans finir l’ancienne destination. C’est une amélioration à conserver. Les commandes comptent depuis `i`, même si le contenu correspondant n’a pas encore été montré.

Le test réel de retour pendant un voyage capture `initialOpacity=0` et repart vers `methodologie-1` depuis la caméra courante. Le retour restant dure **1,5839 s** dans cette capture. Il ne révèle pas la destination interrompue. Les poses et l’opacité capturées sont conservées au départ de la nouvelle transition.

Un second enregistrement utilise les boutons DOM des notes pour envoyer une rafale : quatre commandes à cadrage fixe, puis six pendant l’occultation d’un voyage. Le navigateur logiciel retarde/coalesce certains timers ; les timestamps effectifs sont enregistrés, et le rapport ne prétend pas que toutes les commandes arrivent exactement toutes les 65 ms demandées. Plusieurs arrivent à moins de 2 ms d’intervalle. Pendant la rafale masquée, **les six nouvelles transitions prennent chacune environ 5,0395 s et démarrent avec une opacité nulle**. Le panneau finit par revenir et le guide s’arrête, mais chaque interruption peut repousser sa réapparition. Ce test ne révèle pas de panneau définitivement perdu.

Le mode léger `L` change le rendu (DPR, ombres, verre), pas la chronologie : les durées normales et légères mesurées pour les mêmes trajets sont identiques. Le mouvement réduit `M`/préférence système supprime le voyage et la marche, mais conserve le fondu global de 0,30 s. Il est mémorisé dans le navigateur et figé au départ de la transition courante. Le mode `fast` exige `?test&fast` ; il était absent de tous les enregistrements remis. `?still` était également absent.

La proposition est limitée aux décisions démontrées ci-dessus, sans restauration générale :

1. Pour une étape interne sans mouvement de caméra ni translation des acteurs, conserver le contenant visible. Révéler les textes ou échanger la capture à l’intérieur, sans réinitialiser le fondu de `#stage`.
2. Pour une nouvelle slide à cadrage identique, traiter le remplacement de contenu indépendamment du voyage : remplacement immédiat ou fondu local court. Conserver le monde, le guide et le cadre extérieur.
3. Pour un rapprochement 3D, choisir explicitement les panneaux qui gênent l’objet ; préserver les repères partagés utiles. Garder une interpolation courte et ne pas ajouter de marche lorsque les acteurs restent au même endroit. Examiner séparément les 180 ms de stabilisation pour ces petits mouvements.
4. Pour un retour au monde, définir une durée de ce trajet précis. L’écart 0,65 → 7,22 s explique une forte modification du rythme ; rétablir aveuglément 0,65 s pour un trajet de cette longueur produirait un déplacement très rapide. L’animation peut être retunée sans toucher à ses preuves ou au discours.
5. Pour les vrais changements de lieu, conserver la continuité depuis les poses affichées, la marche terminale liée à la distance et la limite de vitesse. Décider explicitement si précédent/saut doit marcher ou seulement relocaliser, au lieu de déduire une marche de toute différence d’ancre.
6. Limiter la désactivation CSS aux animations qui concurrencent effectivement un déplacement, et préserver les révélations locales autorisées. Garder la suspension/déclenchement différé du film ; la correction des révélations ne doit pas réintroduire sa lecture pendant un voyage.
7. Compléter les tests d’acceptation avec : cadre encore visible après révélation/capture ; absence de translation et de marche à caméra fixe ; rapprochement sans marche ; retour et voyage avec budgets distincts ; rafale pendant l’entrée et le voyage qui aboutit au bon panneau. Les tests actuels vérifient surtout l’occultation pendant les mouvements et la durée courte du texte, sans garantir la continuité du cadre pour le texte.

Ces propositions ne sont pas une nouvelle règle globale. `move==='reveal'` ne suffit pas à choisir un traitement : le rapprochement du cycle et le retour au monde portent aussi cette valeur. La future correction devrait distinguer les changements de contenu et les vrais changements de cadrage/position, avec des exceptions nommées pour les scènes concernées.

La [vidéo de diagnostic](diagnostic-normal.mp4) dure environ **45 secondes**, à vitesse réelle, sans audio. Elle montre les six cas, deux rapprochements, un retour qui interrompt un voyage, une rafale à cadrage fixe et une rafale pendant occultation. Le montage effectue uniquement des coupes entre les cas ; aucun changement de temps, ralentissement, accélération ou reconstruction de frames 3D. [Sous-titres des cas](diagnostic-normal.vtt) et [index temporel](recording.json) sont joints. Les enregistrements continus sont [jury-normal.webm](jury-normal.webm) et [rapid/jury.webm](rapid/jury.webm).

La capture utilise Chrome avec ANGLE/Mesa **llvmpipe**, un rendu logiciel d’environ 2–4 frames évaluées par seconde dans ces séquences. Les phases de 120–180 ms peuvent être sautées : la vidéo n’est donc pas une mesure fidèle de fluidité sur le GPU d’Ali et ne prouve pas visuellement chaque passage à zéro des révélations. Ces passages sont établis par le code et les sondes de chronologie ; les périodes d’occultation des vrais mouvements sont observées sur les frames effectivement rendues. Les rapports conservent les phases vues et les durées nominales séparément.

Commande de lancement utilisée : `ZS3D_NO_BROWSER=1 XDG_RUNTIME_DIR=/tmp ./present.sh`. Chrome a ensuite ouvert l’URL produite, sans mode fast/still/test ; les vraies notes se sont ouvertes automatiquement. Les cas ordinaires utilisent les touches du jury ; les deux rafales supplémentaires utilisent les handlers existants des boutons de notes. L’instrumentation ne fait que capturer les entrées et sorties du directeur ; l’horloge des séquences enregistrées n’a pas été modifiée. Le recensement des 113 paires a été fait séparément, hors montage, avec des placements instantanés et des évaluations au temps courant pour mesurer leur constructeur de transition.

Validation terminée : **34 tests existants passent**, typecheck et contrôle de provenance/contenu passent. Le contrôle de contenu confirme 44 slides, 70 révélations, 114 états et les notes/frames exactes. **8 sondes de caractérisation supplémentaires**, exécutées depuis `/tmp` sans toucher aux tests de l’application, passent ; leur [résultat](characterization-tests.txt) est joint. Les [mesures du navigateur](report.json), les échantillons par cas et le [rapport des rafales](rapid/report.json) sont joints. Zéro exception de page, zéro requête externe et zéro réponse HTTP ≥400 dans le parcours principal. L’audit limité aux chemins concernés retrouve la validation des commandes et les filtres de HTML/attributs locaux de `EvidencePanel.show` ; aucun nouvel accès externe n’a été introduit.

Les [empreintes de préservation](preservation.json) confirment que les 395 fichiers préexistants examinés dans le projet maintenu et les 524 du dossier historique sont inchangés. Aucun fichier du projet classique n’a été écrit. Seuls les nouveaux rapports et enregistrements dans `review/animation-diagnostic-2026-10-12/` et les outils temporaires dans `/tmp` ont été créés. Le build reste validé après le diagnostic.
