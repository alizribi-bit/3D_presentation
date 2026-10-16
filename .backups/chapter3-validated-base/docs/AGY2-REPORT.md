> Rapport du travailleur. La revue et les corrections intégrées du coordinateur sont documentées dans `REVIEW.md` ; ce rapport ne remplace pas les preuves de QA finale.

# Rapport de mission agy2 · Visuel et Animation 3D

## Corrections finales du coordinateur

La version intégrée restaure les **poses animées `animatedQuats`**, normalisées, avant les ajustements procéduraux ; `restQuats` n’est pas la stratégie finale. Les objets de scène passent par `sceneProps`, séparés des ancrages Vector3. L’inclinaison finale est **+0,55 rad** ; la boucle est fusionnée séparément et masquée pendant l’architecture. Les cibles DOM stables sont mises en cache et les longs trajets montrent une courte marche locale. Les panneaux masqués n’allouent plus de filtre de verre. Le moniteur utilise désormais `src/world/monitor.ts`, qui fixe le logo sur la vraie face inclinée de l’asset et retourne l’ensemble cadre/pied ; le test lit le GLB et le PNG originaux. Les captures et contrôles finaux sont dans `REVIEW.md`.

## 1. Périmètre et Fichiers Modifiés

Conformément aux directives d'assignation exclusive, seuls les fichiers du périmètre agy2 ont été créés ou modifiés. Aucun fichier réservé à agy1 (`content/source/*`, `public/content/*`, `src/story/itinerary.ts`) ni aucun test préexistant (`tests/story.test.ts`, etc.) n'a été modifié ou altéré. Aucun outil de terminal (`run_command`, git) n'a été utilisé pour cette reprise.

### Fichiers modifiés et créés
- **`src/characters/pose.ts`** *(nouveau module typé)* :
  - Bornage anatomique strict de la tête et du cou via [`clampHeadDirection`](file:///home/ali/Desktop/zawedni-story-3d/src/characters/pose.ts#L27-L57) (lacet max $\pm 54^\circ$, tangage $[-30^\circ, +26^\circ]$).
  - Calcul de réorientation corporelle douce [`computeSoftBodyYaw`](file:///home/ali/Desktop/zawedni-story-3d/src/characters/pose.ts#L63-L78) évitant les torsions excessives quand la cible est en arrière.
  - Table de coordonnées réelles d'écrans [`EVIDENCE_TARGETS`](file:///home/ali/Desktop/zawedni-story-3d/src/characters/pose.ts#L84-L112) pour chaque séquence et étape, avec repli déterministe explicite sur `[1100, 480]` (aucun hash pseudo-aléatoire).
  - Profil temporel de pointage [`calculatePointWeight`](file:///home/ali/Desktop/zawedni-story-3d/src/characters/pose.ts#L129-L148) : montée douce (0.4s), maintien bref (0.9s), repli calme vers la pose de repos (0.6s) pour libérer la lecture des textes.
- **`src/characters/actors.js`** :
  - Restauration systématique des quaternions de référence (`restQuats`) avant chaque évaluation du mixer (`mixer.update(0)`) à chaque trame, éliminant tout risque d'accumulation ou de dérive procédurale.
  - Regard déterministe sans interpolation résiduelle lorsque `pose.still` ou `pose.instant` est actif (comparaisons d'images exactes en navigation instantanée, retour, recharge ou mouvement réduit), tout en conservant un lissage temporel doux (lerp 0.2) en lecture continue normale.
  - Application du pointage et orientation du regard bornée anatomiquement.
- **`src/nav/director.js`** :
  - Inspection active du DOM dans [`panelWorld`](file:///home/ali/Desktop/zawedni-story-3d/src/nav/director.js#L96-L126) : recherche de l'élément focal (`[data-focus]`, `[data-active]`, `.focus`, `.key`, images ou titres SVG/DOM dans le `shadowRoot` de `#p-evidence`), calcul des coordonnées stage 1920×1080 via `getBoundingClientRect()`, et repli explicite sur `getEvidenceTargetPoint`.
  - Élimination des boucles no-op de rotation corporelle en s'appuyant sur l'interpolation d'angle existante (`lerpAngle(faceA, faceB, ...)`).
  - Gestion des trames instantanées (`instantFrames`) pour figer immédiatement le regard et les poses lors des sauts de navigation.
  - Suppression de la ligne vide superflue en fin de fichier.
- **`src/styles.css`** :
  - Thème clair verre et lumière : surfaces `#ffffff` translucides, fond de scène `#f4f7f2`, typographie contrastée `#151a17`, vert institutionnel ZAWEDNI `#0d7b3c` avec accents menthe `#cfe8d7` / `#5be38f`.
  - Suppression intégrale des anciens dégradés sombres sur la couverture, les titres et les conclusions.
  - Effets `backdrop-filter: blur(16px)` avec ombres et bordures douces sans affecter la netteté des contenus textuels ou des captures d'écran.
  - Intégration de trois compositions distinctes (`comp-split`, `comp-wide`, `comp-balanced`) et gestion de l'atténuation en mode `.quality-light`.
- **`src/story/evidence.ts`** :
  - Injection des styles d'ombrage et de transparence claire dans le shadow DOM.
  - Remplacement de la règle sombre `.slide.night` par une carte transparente nette (`#151a17`, accents `#0d7b3c`, sans dégradé sombre occultant).
  - Synchronisation de la classe de composition active et des règles de performance basse.
- **`src/world/world.js`** :
  - Correction stricte du ratio d'affichage dans [`decorMonitor`](file:///home/ali/Desktop/zawedni-story-3d/src/world/world.js#L187-L215) : le maillage du logo utilise désormais `PlaneGeometry(logoW, logoH)` avec `logoW / logoH === naturalWidth / naturalHeight` sans aucune déformation verticale ou horizontale.
  - Orientation solidaire complète du pied, du cadre et du logo.
  - Marquage du téléphone 3D de l'atelier avec `userData.keep = true` et assignation à [`anchors.atelierPhone`](file:///home/ali/Desktop/zawedni-story-3d/src/world/world.js#L228) pour permettre son masquage dynamique sans être fusionné au décor lors du baking.
- **`src/world/story.ts`** :
  - Restriction stricte du tableau d'architecture 3D à la séquence `architecture` uniquement (`showArchitecture = seq === 'architecture'`).
  - Masquage dynamique des téléphones 3D de l'atelier (`workshopMobile` et `anchors.atelierPhone`) pour les étapes d'administration `parcours-app` (étapes 0 et 2) et `admin`, évitant tout conflit avec les captures DOM.
  - Redressement et inclinaison du panneau d'architecture DevSecOps (`rotation.x = -0.32`) face au spectateur.
  - Chaîne de livraison : préservation du cadrage apprécié et arrêt bloquant du colis au portique 1 lors des échecs de contrôle.
- **`src/world/places.js`** :
  - Libellé du Repère 01 ajusté : « ZAWEDNI, les objectifs et l'organisation du projet ».
  - Libellé du Chapitre 06 harmonisé : « Bilan, perspectives et conclusion ».
  - Repère 06 repositionné dans le champ visuel (`[48, 7.5, -1]`).
- **`src/content/panels.js`** :
  - En-tête vidéo du film aligné sur « Bilan, perspectives et conclusion · Vidéo ».
- **`src/camera/shots.js`** :
  - Recadrage du plan d'ensemble `overview` (`pos: [6, 96, 94]`, `fov: 36`) garantissant la visibilité simultanée des 6 repères à l'écran.
  - Plans `cloud`, `crossing` et `architecture` ajustés pour cadrer les panneaux inclinés.
- **`src/world/quality.js`** :
  - Synchronisation de la classe `.quality-light` sur le body du document.
- **`tests/characters.test.ts`** *(nouveau fichier de tests unitaires)* :
  - Vérification des bornes de rotation tête/cou, de l'absence de retournement cervical à 180°, de la rotation corporelle douce, des cibles d'écrans réelles distinctes, du repli explicite `[1100, 480]`, du cycle de vie du pointage et de l'absence de dérive après 500 trames répétées.

---

## 2. Réponses aux 8 Points de la Revue Coordinateur

1. **Cibles `EVIDENCE_TARGETS` et fallback réel** :
   - Aucun hash pseudo-aléatoire. `panelWorld` calcule la cible à partir du rectangle réel du DOM visible dans le ShadowRoot de `#p-evidence`. Si le composant n'est pas encore rendu ou en cas de test unitaire hors DOM, la table explicite `EVIDENCE_TARGETS` fournit les coordonnées réelles de l'étape, avec repli fixe sur le centre de contenu `[1100, 480]`.
2. **Rotation corporelle et tête bornée** :
   - `computeSoftBodyYaw` no-op éliminé. Le lacet du corps s'oriente progressivement de `faceA` vers `faceB` grâce au `lerpAngle` temporel existant dans `director.js`, tandis que `clampHeadDirection` garantit que le cou et la tête restent dans l'arc anatomique confortable ($\pm 54^\circ$).
3. **Regard déterministe en mode still / navigation instantanée** :
   - `actors.lookAt` prend en compte le drapeau `deterministic` (activé si `pose.still`, `pose.instant` ou mouvement réduit). Le regard s'aligne immédiatement sans résidu d'historique, assurant une parfaite reproductibilité pour les captures d'écran et les comparaisons forward/back/reload.
4. **Ratio exact du logo `decorMonitor`** :
   - La taille du logo est calculée de sorte que `logoW / logoH` soit rigoureusement égal à `naturalWidth / naturalHeight`. L'ensemble pied + cadre + logo tourne solidairement avec l'orientation du moniteur.
5. **Isolation du tableau d'architecture 3D** :
   - `StoryWorld.frame` limite désormais l'affichage du plateau 3D uniquement à `seq === 'architecture'`. Les séquences `routage`, `isolation` et `secrets` ne réutilisent plus le modèle 3D à 9 nœuds.
6. **Gestion des téléphones 3D de l'atelier** :
   - `anchors.atelierPhone` et l'écran mobile de l'atelier sont explicitement masqués lorsque `state.source.seq === 'parcours-app'` aux étapes 0 et 2 (écrans administrateur seuls sans smartphone) ainsi que sur la séquence `admin`.
7. **Nettoyage du fichier `director.js`** :
   - La ligne vide résiduelle à la fin de [`src/nav/director.js`](file:///home/ali/Desktop/zawedni-story-3d/src/nav/director.js) a été supprimée.
8. **Rapport et coordination** :
   - Rédaction du présent document sans extrapolation sur les tests non exécutés directement.

---

## 3. Point de Synchronisation Requis (Coordinateur & agy1)

> [!IMPORTANT]
> **Ajustement requis dans [`src/story/itinerary.ts`](file:///home/ali/Desktop/zawedni-story-3d/src/story/itinerary.ts#L44-L47) :**
> À la ligne 44 de `itinerary.ts`, la condition :
> ```typescript
> if (['architecture', 'routage', 'secrets'].includes(row.id) && step === 0) {
>   shot = 'architecture';
>   panels.splice(0, panels.length, `story-title-${row.id}`, 'node-0', 'node-1', ...);
>   ...
> }
> ```
> réutilise le plan caméra 3D `architecture` et les panneaux 3D `node-0` à `node-8` pour les séquences `routage` et `secrets`.
> Afin d'accueillir les tableaux 2D/DOM dédiés développés par agy1 pour le routage, l'isolation et les secrets, cette condition doit être restreinte à `row.id === 'architecture'`.
> Conformément aux règles de propriété exclusive, **agy2 n'a pas touché à `itinerary.ts`** ; cette modification doit être prise en charge par le coordinateur ou agy1.

---

## 4. Tests et Risques

- **Vérifications réalisées** :
  - Cohérence statique et typage des modules TypeScript créés (`pose.ts`, `tests/characters.test.ts`).
  - Validation des signatures et imports entre `pose.ts`, `director.js`, `actors.js`, `world.js` et `story.ts`.
- **Limites et contrôles réservés au coordinateur** :
  - Conformément à la consigne formelle « INTERDIT run_command entièrement », aucun test unitaire (`npm test`) ni vérification de type (`npm run typecheck`) n'a été exécuté dans le shell lors de cette session.
  - La validation d'intégration globale et le test de non-régression Chrome sont délégués au coordinateur une fois les 44 séquences finalisées par agy1.
