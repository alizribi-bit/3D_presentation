# Data Model: Prototype ZAWEDNI Story 3D

Toutes les entités sont des objets JS littéraux dans `src/content/` et `src/world/places.js`. Aucune
persistance hors du hash d'URL.

## État (`State`)

| Champ | Type | Règle |
|---|---|---|
| `id` | `'A0'…'D3'` | unique, ordre = ordre du tableau `STATES` |
| `scene` | `'A'\|'B'\|'C'\|'D'` | sert au saut de scène (premier état de la scène) |
| `source` | `{ seq: string, step: number }` | `seq` ∈ identifiants de `script_rows.py` (`couverture`, `sommaire`, `probleme`, `reponse`, `devsecops`) |
| `added` | `boolean` | `true` si l'état n'existe pas dans le deck (clic de caméra ajouté) |
| `shot` | `ShotRef` | nom d'un cadre de `SHOTS` |
| `panels` | `string[]` | ids des panneaux visibles à l'arrivée |
| `actors` | `{ guide: Action, rep: Action }` | pose finale de chaque personnage |
| `notes` | `{ said: string, read: string[], added?: string }` | discours accepté de l'étape ; `read` = phrases `[lire]` |
| `move` | `'travel'\|'reveal'\|'cut'` | `travel` ≤ 2,5 s (trajet), `reveal` ≤ 0,8 s, `cut` = fondu (mouvement réduit) |

Transitions : `next` = index + 1, `prev` = index − 1, bornées. Arriver dans un état = appliquer
`shot`, `panels`, `actors` finaux ; la transition n'est qu'une interpolation vers ces valeurs.

## Cadre (`Shot`)

`{ pos: [x,y,z], target: [x,y,z], fov: number, follow?: 'guide' }` — `follow` seulement pendant un trajet.

## Panneau (`Panel`)

| Champ | Type | Règle |
|---|---|---|
| `id` | string | unique |
| `place` | id de lieu | |
| `anchor` | `[x,y,z]` ou `'screen'` | ancre 3D projetée en DOM, ou plein cadre en lecture |
| `kind` | `'text'\|'image'\|'label'\|'cover'` | |
| `text` | string | texte exact de la source (vérifié par `check-content.mjs`) |
| `src` | chemin | image réelle dans `public/assets/deck/`, ratio d'origine |
| `order` | number | rang d'apparition dans l'état |

## Lieu (`Place`)

`{ id: '01'…'06', title, line, roadT: 0…1, color: token, detail: 'full'|'silhouette', labelAnchor }` —
`title`/`line` = textes exacts du sommaire.

## Personnage (`Character`)

`{ id: 'guide'|'rep', model: chemin GLB, outfit, clips: { walk, idle, look?, point? }, scale, footSpeed }` —
`footSpeed` = mètres par cycle de marche, calibré pour supprimer le glissement.

## Action (`Action`)

`{ at: roadT | [x,y,z], face: [x,y,z] | panelId, clip: 'idle'|'point'|'look', aim?: panelId }` —
`aim` impose que la main vise l'ancre du panneau ; un personnage ne peut pas se trouver dans la boîte
écran d'un panneau visible (règle vérifiée sur captures).

## Asset

`{ path, origin: 'deck'|'third-party', source URL, license, licenseQuote, modified: bool }` — tenu dans
`ASSETS.md`.
