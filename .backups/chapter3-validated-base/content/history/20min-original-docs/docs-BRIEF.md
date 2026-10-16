> Référence actuelle (12 octobre 2026) : la présentation classique active prend priorité pour les contenus. Voir `docs/CONFORMITE.md`, `docs/CORRESPONDANCE.md` et `HANDOFF.md`. Les exigences propres au monde 3D restent applicables ; les anciens discours, compteurs et résultats ci-dessous sont historiques.

# Directive actuelle — révision 44

Le prompt complet d’Ali du 11/12 octobre 2026 remplace les anciens transferts de contenu.
La mise à jour 3D est autorisée : voir PLAN-44.md, SCRIPT-44.md et ../HANDOFF.md.
Le texte ci-dessous est conservé comme historique du prototype ; ses anciens jalons et totaux ne sont plus les exigences courantes.

# ZAWEDNI — nouveau projet de présentation 3D narrative

Tu travailles avec Ali sur sa soutenance de mémoire. La présentation actuelle est terminée et acceptée. Elle reste son premier choix. Ali veut maintenant explorer une deuxième version dans un projet indépendant : une présentation qui raconte l'histoire de ZAWEDNI à travers un monde 3D, une roadmap et des déplacements de caméra, avec des personnages animés.

Construis du code réellement exécutable et une expérience que l'on peut regarder. Ce prompt définit la direction de la version complète, mais **la livraison immédiate est un prototype de quatre scènes**. On évalue son rendu avant de transformer toute la présentation, pour éviter de consacrer beaucoup de temps et de tokens à une direction visuelle qui ne convient pas.

## 1. Protéger la présentation acceptée et créer le nouveau projet

La source acceptée correspond à la dernière archive `soutenance(6).zip` : **41 séquences et 65 clics**, avec une vidéo corrigée de **90 secondes**, placée après les perspectives et avant la conclusion. Le discours est rédigé en français simple, principalement avec « on ». Les phrases lues à l'écran sont marquées `[lire]`.

Identifie la version locale correspondant à cette archive dans le projet existant, vraisemblablement `~/Desktop/zawedni-video-pfe/soutenance`. Vérifie ce chemin avant de l'utiliser. Prends cette version acceptée, pas un ancien dossier `build/before-*` ni une archive de sauvegarde.

Crée un dossier indépendant, par exemple **`~/Desktop/zawedni-story-3d`**. Si ce nom existe déjà, inspecte-le et choisis un nouveau nom sans écraser son contenu. Copie dans ce projet les sources de contenu et les assets utiles. Conserve une référence immuable à la version acceptée pour comparer le contenu. Ne modifie aucun fichier de l'ancien projet, de sa vidéo, de son archive ou de l'application ZAWEDNI. Les builds et exports de la nouvelle version doivent rester dans le nouveau dossier.

Ne copie pas inutilement les anciens films, captures intermédiaires et multiples sauvegardes. La vidéo de référence est **`soutenance/media/zawedni-devsecops.mp4`**, accompagnée de son affiche corrigée. Les anciennes vidéos disant que la production n'est pas déployée ne doivent jamais devenir les assets de cette version.

## 2. Utiliser les skills disponibles et les références ciblées

Commence par lire les instructions du projet et la liste de skills qu'Ali a installés ou fournis. Utilise les skills réellement pertinents pour la direction artistique, les interfaces, le mouvement, la 3D, les personnages, l'accessibilité et les vérifications dans le navigateur. Ne prétends pas avoir utilisé un skill absent. Ne charge pas toute la liste et tout le dépôt sans raison : cible ce qui sert au prototype.

Références demandées par Ali :

- **Refero Styles** : https://styles.refero.design/ — pour préciser les couleurs, la typographie, les espacements et les compositions, tout en restant proche du deck actuel.
- **21st** : https://21st.dev/ — pour repérer quelques composants ou idées de mouvement utiles. Sélectionne-les, adapte-les à la présentation et évite un assemblage de composants aux styles différents.
- **React Bits** : https://reactbits.dev/ — pour des effets ciblés, notamment dans l'ouverture et les transitions. Les effets doivent servir l'histoire.

Références de narration spatiale déjà retenues :

- https://impress.js.org/ : vue d'ensemble, entrée dans une idée, zoom-out pour retrouver les relations.
- https://prezibase.com/shop/digital-roadmap-prezi-next-template/ : trajet entre des étapes et passage du monde réel au numérique.
- https://bruno-simon.com/ : cohérence d'un monde 3D dont les lieux portent le contenu.

Regarde des exemples animés, pas seulement des screenshots. Tire de ces références une direction propre à ZAWEDNI. Le portfolio de Bruno Simon sert à comprendre le monde et ses lieux : la soutenance doit avoir un parcours guidé au clicker, pas une conduite libre de véhicule.

Tu peux consulter les documentations officielles des outils retenus. Une base possible est Three.js avec React Three Fiber, un chargeur GLTF, les animations de personnages et une timeline de caméra. Choisis la pile la plus adaptée aux skills et au projet. N'impose pas React à l'ancien deck et ne migre pas ce dernier. Les composants conçus pour le scroll doivent être adaptés à des états de présentation déclenchés par clic.

## 3. Direction artistique : un monde 3D réellement construit

La direction est **un monde ZAWEDNI continu**, avec une route qui relie les chapitres et des lieux que l'on découvre. L'image doit être soignée dès le prototype : volumes, éclairage, matières, ombres et composition.

Le premier essai montré à Ali représentait des plaques, des cercles et des blocs dans un canvas avec une perspective CSS. Il a apprécié l'idée, mais pas le dessin ni le niveau visuel. **Ne reproduis pas ce rendu.** Construis une vraie scène 3D avec des lieux reconnaissables et des assets cohérents. Quelques rectangles inclinés, des emojis ou un mannequin composé de primitives ne constituent pas le rendu final attendu.

Un style possible : personnages et architecture stylisés, volumes simples mais travaillés, matières mates, détails choisis, lumière douce et ombres de contact. Vise une présentation professionnelle et chaleureuse, avec du relief et de la profondeur. Les lieux peuvent évoquer un marché local, un atelier numérique, un espace cloud et un centre de suivi. Il s'agit d'un univers illustré, pas d'une reproduction documentaire de bâtiments réels.

Ali n'a pas encore fourni de photo de la pépinière. Ne présente pas un bâtiment inventé comme une image de la pépinière de Mahdia, et ne bloque pas le prototype pour cette photo.

### Identité visuelle à conserver

Le deck accepté utilise notamment :

- fond clair : `#f4f7f2` ;
- texte : `#10261a` ;
- texte secondaire : `#536459` ;
- vert ZAWEDNI : `#0d7b3c` ;
- vert profond : `#083f1f` ;
- vert clair : `#cfe8d7` ;
- accent menthe : `#5be38f` ;
- typographie principale : Poppins ;
- typographie technique : JetBrains Mono.

Garde un lien évident avec cette identité : logo original, vert, fond clair et typographie proche. **Ali autorise l'ajout d'autres couleurs et une évolution mesurée du style.** Tu peux utiliser un bleu pour les zones techniques, une teinte terre ou ocre pour l'achat local et un orange pour les points d'attention. Définis une palette courte et cohérente. Les couleurs doivent aider à comprendre les lieux et leur rôle, sans repeindre chaque objet d'une couleur différente.

Conserve les logos originaux et leurs proportions. Ne génère pas de variantes du logo ZAWEDNI, des logos d'établissement ou des logos techniques.

## 4. Organisation de l'histoire : roadmap, scènes locales et zoom

Trois niveaux doivent rester cohérents :

1. **Le monde général** : la roadmap et ses six grands chapitres. Le jury comprend le parcours et la position actuelle.
2. **Le lieu du chapitre** : la caméra entre dans une zone et découvre ses idées ou étapes.
3. **Le détail expliqué** : la caméra et la mise en évidence dirigent l'attention vers une grille, un écran, un outil ou une étape.

Quand on termine une partie, on revient à une vue plus large pour rejoindre la suite. La route et les lieux donnent des repères continus. On ne doit pas avoir l'impression de charger un décor indépendant à chaque clic.

Utilise une boucle là où le contenu décrit un cycle, surtout pour DevSecOps. Pour le BMC, garde la disposition du canvas et ses parties. Pour une architecture, garde les relations entre composants. Pour une suite d'étapes, garde leur ordre. La métaphore doit respecter le sens du contenu.

La couverture et l'ouverture acceptées restent la base. La révélation du monde peut suivre l'ouverture. Le monde général peut ensuite tenir le rôle du sommaire. Évite d'ajouter un long prologue qui augmenterait la durée sans apporter d'information.

### Correspondance de la version complète

| Partie du contenu accepté | Lieu ou mise en scène proposée | Mouvement et attention |
| --- | --- | --- |
| Accueil, couverture, sommaire | Point d'entrée et découverte du monde | Révélation de la roadmap, puis arrêt lisible sur le parcours |
| Chapitre 1 : startup, problème, solution, acteurs, BMC | Place de l'achat local et espace de préparation | Approche du marché, découverte de l'évaluation, puis zoom sur le BMC |
| Chapitre 2 : développement, architecture applicative, validation, interfaces | Atelier de la plateforme | Découverte du web et du mobile, puis des composants qui les relient |
| Chapitre 3 : infrastructure et démarche DevSecOps | Zone cloud et parcours en forme d'infini | Vue du cycle, puis entrée dans l'architecture, le routage et l'isolation |
| Chapitre 4 : chaîne CI/CD, tests, analyses, blocage, GitOps, traçabilité | Ligne de préparation et de livraison d'une version | On suit la même version et on s'arrête aux contrôles et au déploiement |
| Chapitre 5 : métriques, journaux, alertes, validation | Centre de supervision | Zoom sur les preuves réelles et sur la circulation des informations |
| Chapitre 6 : bilan et perspectives | Vue du projet réalisé et de ses extensions | Recul pour relier les résultats aux parties présentées |
| Vidéo, conclusion | Espace de projection, puis vue finale du monde | Lecture du film corrigé, puis conclusion sobre |

Ce tableau est une direction artistique. Tu peux améliorer la composition et les transitions sans changer l'ordre, les faits ou le discours accepté.

## 5. Personnages : des gestes qui accompagnent l'explication

Ali demande explicitement des personnages dans le monde. Ils peuvent se déplacer, montrer un objet et pointer une information. Ils doivent être intégrés à la mise en scène.

Prévois un petit nombre de personnages cohérents :

- **Un guide** : accompagne les transitions entre les lieux, puis s'écarte de la zone de lecture.
- **Un représentant d'entreprise** : porte ou présente un dossier d'évaluation et attire l'attention vers la grille ou un écran pertinent.
- **Un personnage technique**, si utile dans la version complète : accompagne le déploiement ou montre une information de supervision.

Pour le prototype, deux personnages de bonne qualité suffisent. Un modèle partagé avec des variations de tenue est possible si le rendu reste cohérent. Choisis des modèles 3D articulés, avec de vraies animations de marche, d'arrêt et de geste. Vérifie la provenance et la licence des assets, conserve ces informations et regroupe les fichiers dans le nouveau projet. N'achète pas d'assets ou de service sans accord spécifique.

Les personnages ne représentent pas nécessairement Ali ou une personne réelle. Ne crée pas sa ressemblance sans référence fournie.

### Chorégraphie attendue

- Au clic de transition, le guide rejoint le prochain lieu ou en indique la direction. La caméra l'accompagne brièvement.
- À l'arrivée, le personnage s'arrête. Le cadre devient stable pour la parole et la lecture.
- Au clic qui révèle une information, un personnage peut tourner le regard et pointer cette information. Le geste correspond à la position réelle de l'objet et à son moment d'apparition.
- La marche doit suivre le sol ou la route, avec une vitesse cohérente. Pas de pieds qui glissent, de personnage qui traverse un panneau ou de bras qui pointe à côté.
- Les personnages ne masquent jamais un texte, une capture, une légende ou un élément de preuve.
- Pendant les explications et la vidéo, évite les déplacements et gestes répétés. Une attitude calme suffit. Aucun son ou commentaire de personnage n'est nécessaire : Ali fait le discours.

Ne transforme pas les rôles acheteur et fournisseur en interfaces ou permissions distinctes inventées. Le contenu accepté les regroupe pour les fonctions présentées. Leur représentation dans le décor peut illustrer les entreprises du marché sans modifier cette explication.

## 6. Caméra et navigation : uniquement au clic

La présentation avance par clics successifs, comme le deck actuel. **Aucun scrolling ne doit piloter les scènes, la caméra ou les personnages.** Ne fais pas apparaître d'icônes de flèches précédent/suivant dans l'écran projeté. Ali parle des touches, pas de boutons visibles.

Conserve une navigation adaptée à la soutenance :

- flèche droite, Espace et PageDown : état suivant ;
- flèche gauche et PageUp : état précédent ;
- fonctionnement avec les touches envoyées par un clicker ;
- un état reproductible après navigation arrière, saut vers une scène et redémarrage ;
- des raccourcis qui continuent à fonctionner après utilisation de la souris.

Construis un parcours d'états explicite. Une action de navigation doit produire exactement une avance. Ne cumule pas les animations ni les clics pendant un déplacement. Définis le comportement de manière déterministe si Ali avance rapidement ou revient en arrière. La caméra ne doit pas dépendre d'une dérive physique, d'un timer de scroll ou d'une animation infinie.

Les déplacements de caméra doivent donner une direction et une profondeur, puis se terminer. Évite les rotations arbitraires, les longs tours autour d'un objet et le zoom permanent. Dans les vues de lecture, le texte et les screenshots restent face au jury, avec une taille suffisante. Prévois une variante de mouvement réduit.

Le mouvement entre chapitres peut être plus ample que la révélation d'une phrase dans une scène. Réserve les trajets visibles aux moments utiles pour ne pas rallonger le discours à chaque clic.

## 7. Préserver le contenu et les corrections déjà acceptés

Le chantier porte sur la mise en scène et l'interaction. Le discours actuel est apprécié : ne le réécris pas entièrement et ne change pas les faits métier ou techniques. Lis les fichiers utiles du deck, notamment `build/script_rows.py`, `SCRIPT.md`, `DISCOURS.md`, `PLAN_PRESENTATION.md`, `PRESENTER.md`, les fragments de slides et les assets utilisés. Prends les sections récentes du handoff, pas ses vieux états contradictoires.

La version complète doit couvrir les **41 séquences logiques**, même si plusieurs deviennent des vues d'un même lieu. Conserve les identifiants de contenu ou une correspondance claire pour retrouver chaque partie et ses notes. Les **65 clics** constituent la référence de rythme, pas une obligation d'ajouter 65 grandes animations de caméra. Toute variation du nombre de clics doit être limitée et expliquée.

Points à préserver impérativement :

- Discours simple au « on », notes distinguant phrase dite, clic et phrase `[lire]`. Le texte lu doit correspondre exactement au texte projeté.
- Grille d'évaluation mise en avant comme valeur ajoutée. Formulation « guide pour une stratégie RSE ».
- BMC : image réelle, zoom des parties, complément sur la grille d'évaluation et repère « Sources de revenus ». Ne remets pas le bandeau défensif sur les revenus et n'invente pas de revenus déjà obtenus.
- Parcours web/mobile : au clic de l'examen par l'administrateur, montrer uniquement l'administration web. Le téléphone disparaît, puis les paires web/mobile reviennent pour les étapes suivantes.
- Vue générale des outils séparée du détail des analyses de sécurité. Conserver la mise en évidence successive et les explications des outils.
- Isolation réseau : montrer les communications et le rôle des NetworkPolicies et de Calico. **Aucune mention DNS, 10/11, faux négatif ou erreur de commande dans la projection ou le discours.** Les détails historiques restent seulement dans la fiche privée.
- Captures Prometheus et Grafana : utiliser les images réelles, garder leurs proportions et les informations lisibles. Ne recrée pas les zones absentes d'une capture.
- Alerte : conserver la séquence du test présenté, l'arrêt des erreurs provoquées et la disparition de la condition d'alerte. Prometheus détecte et Alertmanager notifie. Ils ne réparent pas l'application. Ne mélange pas les preuves staging et production.
- Vidéo corrigée : garder son contenu et son son, après les perspectives et avant la conclusion. Ne reconstruis pas le film pour changer simplement son cadre de projection.

Si tu dois ajouter une courte transition pour accompagner une nouvelle scène, reste proche du discours accepté, signale-la et conserve les phrases importantes. Ne remplace pas les preuves par des illustrations décoratives.

## 8. Livraison immédiate : un prototype de quatre scènes

Construis un prototype jouable dans le navigateur, avec assets réels et finitions suffisantes pour évaluer le style. Limite-le à environ **8 à 12 actions de navigation**. Il doit contenir :

### Scène A — ouverture et monde général

Une ouverture cohérente avec la couverture acceptée, suivie d'une révélation du monde. On distingue une route et les lieux des six chapitres. Le guide est présent à une échelle adaptée. Les couleurs, l'éclairage, les matières et les proportions donnent immédiatement la direction de la version complète.

### Scène B — arrivée dans la zone de l'idée

Au clic, la caméra et le guide rejoignent le lieu de l'achat local. Un représentant d'entreprise attire l'attention vers l'évaluation. Utilise des phrases ou éléments déjà présents dans les slides Problème et Solution pour conserver le sens. Les personnages s'arrêtent quand le contenu devient lisible.

### Scène C — zoom sur la grille d'évaluation

Un clic rapproche le cadre de la grille ou du support explicatif. Le personnage pointe précisément l'élément mis en évidence. La phrase approuvée sur la grille est lisible, face au jury. Un clic de retour montre la relation de cet élément avec la solution, puis la vue générale permet de repartir.

Utilise un asset réel pertinent du deck. La version acceptée n'a pas de capture web d'une grille en cours de saisie : ne fabrique pas ce screenshot. Les piliers web et la question mobile existants ou un support explicatif fidèle peuvent servir dans ce prototype.

### Scène D — arrivée dans la zone DevSecOps

La caméra rejoint la zone technique dans le même monde. Découvre le cycle en forme d'infini. Le guide indique une étape, puis un clic se rapproche des contrôles avant livraison. Les gestes, la caméra et l'apparition du texte sont synchronisés. Termine avec un arrêt stable et un retour possible à la vue du parcours.

Pour ce prototype, le trajet peut relier directement la zone de l'idée à DevSecOps. Il ne représente pas encore tout le déroulé. Dans la version complète, le chapitre Développement et les autres parties retrouveront leur place exacte.

**Arrête-toi après ce prototype réellement exécutable et présenté.** Ali veut voir le résultat avant que l'on applique le style aux 41 séquences. Ne transforme pas cette étape de revue visuelle en demande d'autorisation pour chaque modification courante. Tu es autorisé à créer le nouveau projet, ses assets et son code, et à corriger le prototype jusqu'à ce qu'il soit présentable.

## 9. Lisibilité et technique

La priorité est une scène belle et fluide qui permet au jury de comprendre. Les captures, diagrammes et textes doivent rester nets. Le monde constitue l'espace de narration, sans faire disparaître les informations académiques.

- Utilise une scène et un parcours cohérents, avec des éléments chargés localement.
- Précharge les modèles, textures et animations nécessaires à la prochaine scène pour éviter des objets qui apparaissent tard.
- Ajuste la résolution, les ombres et les effets pour une machine de soutenance ordinaire. Prévois un niveau de qualité plus léger qui conserve le style.
- Évite les dépendances à un serveur externe pour les assets, les fontes ou les modèles au moment de présenter.
- Prévois le plein écran, le retour au début et une façon de retrouver un chapitre depuis la vue présentateur. Les commandes de présentation ne doivent pas devenir un tableau de bord visible pour le jury.
- Organise séparément le contenu, les états de navigation, la caméra et les actions des personnages, pour étendre le prototype sans tout reconstruire.
- Le contenu et les positions de scène doivent rester éditables. Garde une correspondance avec les notes de la source acceptée.

La future lecture vidéo doit rester un lecteur standard fiable avec son, pause et reprise. Un clic sur ses commandes ne doit pas faire avancer la présentation. Quitter sa scène arrête la lecture. La vue présentateur doit rester muette pour éviter une double piste sonore.

La référence de durée de l'ancien deck est environ 20 minutes film compris, mais elle reste une estimation. Les nouvelles transitions devront être prises en compte dans la version complète. Ne rallonge pas artificiellement le parcours et ne raccourcis pas le discours accepté sans justification.

## 10. Vérifier le prototype avant de le livrer

Exécute le prototype et examine les scènes en taille réelle. Si le rendu ne correspond pas au brief, corrige-le avant de le présenter.

Vérifie :

- les quatre scènes et leurs déplacements de caméra ;
- les gestes de marche et de pointage, leur synchronisation et les personnages correctement posés au sol ;
- le cadrage, les intersections, les textes lisibles et l'absence d'objets qui masquent le contenu ;
- la navigation avant/arrière, les clics rapides et les touches après utilisation de la souris ;
- les erreurs JavaScript, les ressources manquantes et la stabilité des états ;
- le fonctionnement sans réseau des assets regroupés dans le nouveau projet ;
- la fluidité sur la machine disponible, avec un compte rendu des mesures réellement effectuées.

Ne présente pas un contrôle automatisé comme une validation artistique. Donne des images représentatives des quatre scènes et, si possible, un court enregistrement du parcours. Indique clairement les limites de vérification réellement rencontrées, sans inventer des résultats de tests.

## 11. Ce qu'Ali doit recevoir à la fin de cette première étape

Livre :

1. **Le prototype interactif**, dans le nouveau projet, avec la façon exacte de l'ouvrir et de le parcourir.
2. Quelques vues représentatives ou un court enregistrement pour juger immédiatement le niveau visuel.
3. Un `DESIGN.md` concis : palette, typographie, matières, éclairage, style des personnages et règles de caméra retenues.
4. Un `HANDOFF.md` bref : projet source préservé, fichiers principaux du nouveau projet, assets et licences, navigation, vérifications réalisées et ce qui reste à étendre.
5. Un plan court pour couvrir les 41 séquences après retour d'Ali sur le prototype.

Ne livre pas de PDF et ne remplace pas l'archive acceptée. Une éventuelle archive du prototype doit porter un nom distinct, par exemple `zawedni-story-3d-prototype.zip`.

Commence par une courte synthèse de la direction choisie et des skills pertinents, puis réalise le prototype. Ne te limite pas à proposer un plan ou à demander à Ali de réexpliquer sa présentation. Tu as le contenu accepté et les décisions de ce prompt. Le prochain retour attendu concerne le rendu réel du monde, des personnages et des transitions.
