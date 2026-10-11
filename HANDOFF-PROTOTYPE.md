# HANDOFF — prototype 4 scènes (2026-10-11)

## Ouvrir

Une fois, avec Internet : `npm install && npm run build`. Puis, depuis n'importe quel dossier :
`~/Desktop/zawedni-story-3d/present.sh` (détails, touches et dépannage : `PRESENTER.md`).

Parcours : 11 états, 10 clics. A0 basmala → A1 couverture → A2 monde/Sommaire → B1 trajet vers la place,
le problème → B2 la réponse, le représentant désigne la grille → C1 zoom sur le tableau de la grille (web + mobile)
→ C2 recul : la chaîne grille → validation → marché → suivi → C3 vue du parcours (ouverture du ch. 3)
→ D1 trajet vers la zone DevSecOps, le cycle → D2 croisement Sécurité, retour des observations → D3 vue du parcours.

## Projet source préservé

Rien n'a été modifié dans `~/Desktop/zawedni-video-pfe` (deck, `soutenance.zip`, film, launcher, application).
`scripts/check-source.sh` vérifie les empreintes MD5 de `deck.html`, `script_rows.py`, du film et du deck dans
l'archive : tout est identique. Le `git status` de ce dépôt est le même qu'au début du travail.
Copies de référence du discours : `content/source/` (`script_rows.py`, `SCRIPT.md`, `PLAN_PRESENTATION.md`).

## Fichiers principaux

| Fichier | Rôle |
| --- | --- |
| `src/content/states.js` | les 11 états : source, plan caméra, panneaux, personnages, notes (à dire / à lire / ajout) |
| `src/content/panels.js` | panneaux du jury, texte exact des slides |
| `src/world/places.js`, `world.js` | route, six lieux, décor, ancres 3D |
| `src/camera/shots.js` | plans de caméra par lieu |
| `src/characters/actors.js` | personnages : marche, pointage, regard |
| `src/nav/director.js`, `keys.js` | navigation déterministe, touches |
| `src/main.js`, `index.html` | fenêtre jury |
| `presenter.html`, `src/presenter/` | vue présentateur, synchronisée par `BroadcastChannel` |
| `present.sh` | lanceur deux écrans |
| `specs/001-prototype-4-scenes/` | spec, plan, tâches (Spec Kit) |

## Assets et licences (tous CC0 1.0)

| Asset | Auteur | Source |
| --- | --- | --- |
| Casual Character (guide), Business Man (représentant) | Quaternius | poly.pizza `kZ3DmIoGip`, `JFrLIKqvCH` |
| Market Stand, Market Scene | Quaternius | poly.pizza `DGIM5HGISb`, `LkNRqxdCKp` |
| Computer Screen | Quaternius | poly.pizza `V5Qo141OcB` |
| City Kit Commercial, Suburban, Roads ; Food Kit ; Nature Kit | Kenney | kenney.nl (`License.txt` : CC0) |

Logos, captures (`v6-sup-piliers.jpg`, `v3-mob-evaluation.jpg`) et fontes viennent du deck accepté, sans retouche.
Téléchargements bruts dans `assets-src/` (hors git) ; `scripts/import-assets.sh` recopie la sélection dans `public/models/`.

## Vérifications réellement faites

- `npm run verify` (Chrome réel, GPU de la machine, deux fenêtres ensemble) : **21/21**. Avant/arrière, 20 clics
  rapides, touches après un clic souris, molette sans effet, sauts de scène, vue présentateur ouverte en retard
  (état affiché en 147 ms), rechargement de chaque fenêtre, présentateur sans 3D ni média, même image pour chaque
  état en avant, en arrière et après rechargement, **aucune requête hors 127.0.0.1**, aucune erreur JavaScript.
- `npm run check` : empreintes des sources ; chaque phrase à dire ou à lire existe dans `script_rows.py` ;
  les 69 textes projetés existent dans `deck.html` ; aucun mot interdit.
- `present.sh` lancé pour de vrai depuis `/tmp` : serveur démarré, fenêtre jury en plein écran sur le HDMI
  (1366×768), vue présentateur sur l'écran du portable, statut « Fenêtre jury connectée ».
- Images : `review/states/*.png` (les 11 états en 1920×1080), `review/contact-sheet.png`.
  Enregistrement : `review/parcours.mp4` (39 s).
- Fluidité, Chrome sans fenêtre (headless) sur l'Intel UHD de cette machine, 1920×1080, images/s moyennes
  pendant chaque mouvement :

  | | A1 | A2 | B1 | B2 | C1 | C2 | C3 | D1 | D2 | D3 |
  | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
  | normal | 64 | 59 | 48 | 53 | 46 | 55 | 54 | 51 | 40 | 42 |
  | léger | 62 | 57 | 48 | 52 | 52 | 49 | 52 | 48 | 36 | 51 |

## Limites connues

- Les mesures d'images/s viennent d'un Chrome headless (capture d'écran comprise) ; le niveau léger n'y change
  presque rien, ce qui montre que la limite n'est pas le GPU. À juger sur la vraie fenêtre plein écran.
- Le test « sans réseau » est fait en bloquant toute requête externe dans le navigateur, pas en coupant le Wi-Fi :
  à refaire une fois à la main (voir `PRESENTER.md`).
- Les contrôles automatiques ne valident pas l'esthétique : le jugement des personnages et du pointage reste à Ali.
- En arrière, les personnages disparaissent et réapparaissent à leur place au lieu de remarcher à reculons.
- Le geste de pointage est un bras tendu, main ouverte, index aligné : pas de vraie main à un doigt (modèle CC0).
- C1, C2, C3 et D3 sont des états ajoutés (signalés « ajout » dans la vue présentateur) ; une phrase ajoutée en D1
  remplace « Ces outils forment un cycle continu. », car la slide des outils n'est pas dans le prototype.

## Reste à faire

Après le retour d'Ali : corrections du prototype, puis l'extension aux 41 séquences (`PLAN-41.md`).
