<!--
Sync Impact Report
- Version: 1.0.0 → 1.0.1 (authorization to extend recorded on 2026-10-11)
- Principles: I. Source acceptée intouchable · II. Contenu et discours fidèles · III. Navigation au clic,
  déterministe · IV. Monde 3D cohérent et lisible · V. Preuves réelles, assets traçables · VI. Autonome
  hors ligne · VII. Prototype d'abord, le plus simple qui marche
- Added sections: Contraintes de projection et d'identité ; Flux de travail et contrôles
- Templates: plan-template.md ✅ (Constitution Check générique, gates listées dans chaque plan) ;
  spec-template.md ✅ (aucune section obligatoire ajoutée) ; tasks-template.md ✅ (tâches de vérification
  navigateur couvertes par la phase Polish)
- Deferred TODOs: aucun
-->

# ZAWEDNI Story 3D Constitution

Projet : seconde version, narrative et en 3D, de la soutenance de mémoire ZAWEDNI d'Ali Zribi.
La présentation acceptée (deck HTML, 41 séquences, 65 clics) reste le premier choix ; ce projet
l'explore sans la remplacer.

## Core Principles

### I. Source acceptée intouchable

- La référence immuable est `~/Desktop/zawedni-video-pfe/soutenance/` telle qu'archivée dans
  `~/Desktop/zawedni-video-pfe/soutenance.zip` (10/10/2026 23:06). Empreintes MD5 vérifiées le
  2026-10-10 : `deck.html` b4484a6001d7307e9e463c85864a7dce, `build/script_rows.py`
  de8730144fad3e645d211dc7bf2355f4, `media/zawedni-devsecops.mp4` 4d3093eaafb0ba2ea9f80e062cf12985
  (identiques dans l'archive et sur disque).
- Aucun fichier de l'ancien projet, de son archive, de sa vidéo ou de l'application ZAWEDNI n'est
  modifié. On copie seulement ; tous les builds et exports restent dans `~/Desktop/zawedni-story-3d`.
- Les dossiers `build/before-*`, les sauvegardes et les anciennes vidéos (qui disent la production non
  déployée) ne sont jamais une source.

### II. Contenu et discours fidèles

- Le discours accepté (français simple, au « on ») n'est pas réécrit ; les faits métier et techniques ne
  changent pas. Chaque vue garde l'identifiant de sa séquence source (`couverture`, `probleme`, …).
- Une phrase `[lire]` projetée correspond mot pour mot au texte de la source.
- Toute phrase de transition ajoutée est courte, signalée comme ajout et ne remplace aucune phrase
  importante.
- Interdits en projection et dans le discours : DNS, « 10/11 », faux négatif, erreur de commande. Pas de
  bandeau défensif sur les revenus, pas de revenus inventés. Formulation imposée : « guide pour une
  stratégie RSE ». Acheteur et fournisseur ne deviennent pas des interfaces ou permissions distinctes.

### III. Navigation au clic, déterministe

- Seules les touches avancent : →, Espace, PageDown (suivant) ; ←, PageUp (précédent) ; touches d'un
  clicker. Aucun scroll, timer ou dérive physique ne pilote caméra, scènes ou personnages.
- Une touche = exactement un changement d'état. Un appui pendant une transition termine immédiatement
  la transition en cours (état d'arrivée posé) puis applique l'appui suivant : pas de cumul.
- Chaque état est une donnée explicite (caméra, personnages, textes visibles). Atteindre un état par
  avance, retour, saut ou rechargement produit la même image finale.
- Aucune flèche ni bouton de navigation visible pour le jury. Les raccourcis marchent après usage de la
  souris. Une variante « mouvement réduit » existe.

### IV. Monde 3D cohérent et lisible

- Un seul monde continu : une route relie les lieux des six chapitres ; trois niveaux (monde → lieu →
  détail) ; on revient à une vue plus large en fin de partie. Pas de décor rechargé à chaque clic.
- Vraie scène 3D : volumes, matières mates, lumière douce, ombres de contact. Interdit : plaques
  inclinées en perspective CSS, emojis, mannequins en primitives comme rendu final.
- La métaphore respecte le contenu : boucle pour un cycle, disposition du canvas pour le BMC, relations
  pour une architecture, ordre pour une suite d'étapes.
- Dans une vue de lecture, textes et captures sont face au jury, nets et assez grands ; aucun personnage
  ni objet ne masque un texte, une capture ou une preuve. Les personnages se posent au sol, sans pieds
  qui glissent, et pointent la position réelle de l'élément révélé.

### V. Preuves réelles, assets traçables

- Captures, BMC et logos sont les fichiers réels du deck, proportions conservées, sans zones recréées ni
  screenshot fabriqué. Pas de variante générée des logos.
- Chaque asset tiers (modèle, animation, texture, fonte) a sa provenance et sa licence lues et notées
  dans le projet. Aucun achat d'asset ou de service sans accord explicite d'Ali.
- Aucun bâtiment inventé n'est présenté comme la pépinière de Mahdia. Aucun personnage ne reproduit Ali
  ou une personne réelle.

### VI. Autonome hors ligne

- Fontes, modèles, textures, animations et vidéo sont servis depuis le projet. La présentation tourne
  réseau coupé.
- Les assets de la scène suivante sont préchargés. Un niveau de qualité léger (résolution, ombres,
  effets) garde le style sur une machine de soutenance ordinaire.

### VII. Prototype d'abord, le plus simple qui marche

- On livre d'abord le prototype de quatre scènes ; Ali a autorisé le 2026-10-11 la reprise et l'extension aux 41 séquences sans confirmations répétées (AGENTS.md).
- Contenu, états de navigation, caméra et actions des personnages sont séparés et éditables, sans
  couche d'abstraction de plus que nécessaire. Dépendances minimales ; pas de code « pour plus tard ».

## Contraintes de projection et d'identité

- Palette de base : fond `#f4f7f2`, texte `#10261a`, secondaire `#536459`, vert `#0d7b3c`, vert profond
  `#083f1f`, vert clair `#cfe8d7`, menthe `#5be38f`. Ajouts permis et limités : un bleu (zones
  techniques), une teinte terre/ocre (achat local), un orange (points d'attention).
- Typographies : Poppins (principale), JetBrains Mono (technique), embarquées localement.
- Cible : projection 16:9 en 1920×1080, plein écran.
- Vidéo (version complète) : lecteur standard avec son, pause, reprise ; un clic sur ses commandes
  n'avance pas ; quitter la scène l'arrête ; la vue présentateur reste muette.
- Prometheus détecte, Alertmanager notifie, ils ne réparent pas ; preuves staging et production jamais
  mélangées.

## Flux de travail et contrôles

- Spec Kit : constitution → spec → plan → tasks → implement, une fonctionnalité par dossier `specs/`.
- Avant livraison : exécution réelle dans le navigateur, captures en taille réelle des scènes, test de la
  navigation (avant, arrière, clics rapides, après souris, rechargement), console sans erreur, assets
  sans requête réseau externe, mesure de fluidité réellement effectuée et rapportée.
- Un contrôle automatisé n'est pas une validation artistique : Ali juge le rendu sur images et
  enregistrement. Les limites de vérification sont dites telles quelles.
- Pas de PDF ; une éventuelle archive porte un nom distinct (`zawedni-story-3d-prototype.zip`).

## Governance

Cette constitution prime sur les autres pratiques du projet. Une modification passe par une mise à jour
de ce fichier avec son rapport d'impact, une version incrémentée (MAJOR : principe retiré ou redéfini ;
MINOR : principe ou section ajouté ; PATCH : précision) et la vérification des plans et tâches en cours.
Chaque plan contient une « Constitution Check » qui reprend les principes I à VII ; toute exception est
justifiée dans sa « Complexity Tracking ».

**Version**: 1.0.1 | **Ratified**: 2026-10-10 | **Last Amended**: 2026-10-11
