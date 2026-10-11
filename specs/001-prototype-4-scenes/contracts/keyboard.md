# Contract: Clavier et pilotage

| Touche | Effet | Visible jury |
|---|---|---|
| →, Espace, PageDown | état suivant (borné à D3) | non |
| ←, PageUp | état précédent (borné à A0) | non |
| Home | A0 | non |
| 1 / 2 / 3 / 4 | premier état des scènes A / B / C / D | non |
| F | plein écran (bascule) | non |
| L | qualité légère (bascule) | non |
| M | mouvement réduit (bascule ; aussi `prefers-reduced-motion`) | non |
| N | rouvre la fenêtre présentateur (ouverte d'office par `present.sh`) | non |

Règles :

1. Un `keydown` (hors répétition `e.repeat`) = une commande.
2. Commande pendant une transition : la transition se pose sur son état d'arrivée, puis la commande
   s'applique ; jamais deux transitions superposées.
3. `wheel`, `scroll`, `touchmove` : ignorés, `preventDefault`.
4. Le focus n'est jamais capturé par un élément interactif : clic souris sur la page ⇒ les touches marchent.
5. Le hash d'URL reflète l'état (`#C1`) ; à l'ouverture, le hash est lu et l'état posé sans transition.
6. Les touches de navigation marchent aussi dans la fenêtre présentateur : elles sont transmises à la
   fenêtre jury, seule à décider de l'état.

## Messages entre fenêtres (`BroadcastChannel('zawedni-story-3d')`)

| Message | Émetteur | Effet |
|---|---|---|
| `{t:'hello'}` | présentateur à l'ouverture | la fenêtre jury répond `{t:'state'}` |
| `{t:'state', id, i, total}` | jury, à chaque état posé ou demandé | le présentateur affiche les notes de `id` |
| `{t:'cmd', cmd:'next'\|'prev'\|'home'\|'scene', arg?}` | présentateur | la fenêtre jury l'applique comme une touche |
