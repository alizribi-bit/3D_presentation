# Mise en scène des transitions

Un clic ne masque pas automatiquement la slide. Le contenu, les exports et les notes
acceptés sont conservés. Les corrections sont limitées au projet autonome ; le lanceur
historique continue à lui déléguer la présentation.

`src/nav/transition-plan.ts` classe chaque commande depuis le cadrage **réel** et les
positions affichées. `move: reveal` seul n'est pas un critère : il contient aussi des
rapprochements et le recul final. La chronologie absolue reste dans `timeline.ts`.

| Cas | Panneaux | Budget de mouvement normal |
|---|---|---|
| Texte, capture, slide fixe | Cadre opaque et actif ; remplacement DOM atomique | 0 s ; nouveauté de texte locale 0,20 s |
| Rapprochement | Contenu et repères partagés conservés | 0,65–1,00 s |
| Présentation d'objet | Seulement les grands panneaux gênants retirés ; repères conservés | 0,65–1,00 s |
| Recul final `retour-1` | Carte libérée ; aucun déplacement du guide | 1,75 s |
| Voyage avant | Grande carte retirée ; caméra et marche terminale | 4,50–5,20 s |
| Précédent / saut avec déplacement | Relocalisation douce sans clip de marche | 0,75 s |

Lorsque des panneaux sont sélectionnés pour l'occultation, leur sortie dure 0,16 s et
leur entrée 0,20 s. Aucune pause de stabilisation vide n'est ajoutée. Une sortie déjà
complètement cachée n'est pas rejouée. Le cycle `devsecops-0 → devsecops-1` n'a aucun
grand panneau gênant : ses titres, étiquettes et étapes restent visibles.

Le budget de voyage respecte `minimumArrivalDuration()` : jusqu'à 2,6 mètres sur la
fenêtre terminale de 38 % du mouvement, pointe de vitesse ≤ 1,8 m/s. Le déplacement
intermédiaire du personnage est une relocalisation masquée, pas une course à travers
le monde. Les petits mouvements utilisent une courbe douce ; les voyages conservent
leurs épaules d'accélération et une vitesse centrale presque constante.

## Opacité et contenu

`#stage` reste visible et opaque. Le directeur contrôle uniquement l'opacité des
panneaux `evidence`, `cover`, `sommaire`, `film-title` sélectionnés par la classification.
`data-directed` suspend la transition CSS du panneau concerné, puis est retiré à la
fin. Les descendants et les autres panneaux gardent leurs animations. Aucun
`body.timeline` permanent n'est ajouté.

Les snapshots HTML d'EvidencePanel sont validés et remplacés atomiquement, sans vider
le cadre. Les nouvelles révélations `data-step` sont repérées avant le remplacement
et reçoivent une animation locale d'opacité de 200 ms. Les autres éléments ne sont pas
réanimés. Captures et nouvelles slides peuvent être remplacées immédiatement.
Les états d'administration et les proportions de la composition restent identiques.

## Interruptions

Chaque commande capture la caméra et les poses affichées. Précédent ou saut rejoint
rapidement la nouvelle destination sans terminer le trajet abandonné. Si le trajet
avant ou une relocalisation rapide est encore engagé vers les mêmes ancres, la nouvelle destination de contenu
remplace la précédente **sans changer son heure de départ, sa durée ou la progression
de marche**. La caméra reçoit un segment depuis sa pose actuelle jusqu'au nouveau
cadrage, sur le temps restant. Les commandes de contenu à cadrage déjà arrivé conservent
l'entrée en cours. Un nouveau cadrage après l'arrivée reçoit un rapprochement distinct.

L'horloge du pointage et du retour visuel démarre avec le contenu visible : au départ
d'un rapprochement qui conserve le panneau, ou à l'arrivée si celui-ci était masqué.
La fin du mouvement ne rejoue donc pas les gestes.

Les notes suivent l'index demandé et les pressions répétées involontaires du clavier
sont ignorées. Le film est suspendu à chaque navigation, démarre à son état visible,
et sa sortie rembobine la lecture. Le présentateur ne charge aucune piste média.

Le mode léger conserve les mêmes budgets. Le mode réduit supprime caméra et marche,
avec une occultation sélectionnée de 0,08 + 0,12 s si nécessaire ; les cadres fixes
restent opaques. Le mode `test&fast` n'est utilisé que pour des contrôles séparés,
jamais pour l'enregistrement de revue.

## Vérification

```sh
npm test
npm run build
ZS3D_NO_BROWSER=1 XDG_RUNTIME_DIR=/tmp ./present.sh
node --import tsx scripts/verify-animation-correction.mjs
python3 scripts/package-release.py
```

Le serveur du lanceur doit rester actif pendant la vérification. Le script exécute
normal/léger à 1920×1080 et 1366×768, utilise les touches et boutons des deux fenêtres,
contrôle les 95 passages fixes en navigateur et enregistre les exemples à vitesse
normale. Les placements instantanés préparent seulement les cas ; les observations
proviennent des commandes réelles, sans modification de l'horloge.
Les anciennes revues dans `review/transitions` concernent le mécanisme global antérieur.
Les résultats courants sont dans `review/animation-correction-2026-10-12`.
