# Lancer la soutenance sur deux écrans

Avec `presenter.sh`, la présentation s'affiche en plein écran sur le **projecteur (HDMI)**. La **vue présentateur** s'ouvre sur l'**ordinateur** : notes, minuteur et diapositive suivante.

## Avant de commencer

1. Branchez le câble HDMI.
2. Ouvrez **Paramètres > Écrans** et choisissez **Joindre**, pas **Miroir**.
3. Fermez les fenêtres inutiles et coupez les notifications (**Ne pas déranger**).

## Lancer

Dans un terminal :

```bash
~/Desktop/zawedni-video-pfe/soutenance/presenter.sh
```

Si vous êtes dans Claude Code, tapez `! ~/Desktop/zawedni-video-pfe/soutenance/presenter.sh`.

Au bout de quelques secondes :
- le **projecteur** affiche la première diapositive en plein écran ;
- l'**ordinateur** affiche la vue présentateur.

### Quel écran reçoit quoi ?

Le script ne choisit pas au hasard. Il lit le nom des écrans :
- l'écran **intégré de l'ordinateur** (`eDP`) reçoit **toujours les notes** ;
- l'**autre écran** (HDMI, DisplayPort…) reçoit **toujours la présentation**.

Le script lit aussi la position de chaque écran. Testé avec l'écran HDMI placé au-dessus de l'ordinateur. Pour une autre disposition (gauche, droite), faites un essai avant le jour J.

### Inverser les écrans

Pour la présentation sur l'ordinateur et les notes sur l'écran HDMI :

```bash
~/Desktop/zawedni-video-pfe/soutenance/presenter.sh --swap
```

Pour revenir au réglage normal, relancez sans `--swap`. Chaque lancement ferme d'abord l'ancienne fenêtre. Vous pouvez donc changer à tout moment : la présentation reprend à la première diapositive, puis tapez le numéro et **Entrée** pour revenir où vous étiez.

Le script lance `deck.offline.html`, qui marche **sans Internet** (polices et images incluses). Pour lancer un autre fichier, donnez son nom : `./presenter.sh deck.html` (ou `./presenter.sh --swap deck.html`).

## Pendant la présentation

| Touche | Action |
|---|---|
| **→**, **Espace**, **Page suivante** | étape ou diapositive suivante (lance l'animation) |
| **←**, **Page précédente** | revenir en arrière |
| **B** | écran noir, appuyez encore pour revenir |
| numéro + **Entrée** | aller à cette diapositive (ex. `22` puis Entrée pour le chapitre 4) |
| **O** | vue d'ensemble de toutes les diapositives |
| **L** | pointeur laser |
| **D** | stylo (appuyez encore ou **Échap** pour arrêter) |
| **E** | effacer les traits de la diapositive |

- Les touches marchent dans **les deux fenêtres** : on peut avancer depuis l'ordinateur ou depuis le projecteur. Une télécommande de présentation marche aussi.
- Dans la vue présentateur :
  - **cliquez sur le minuteur** pour le remettre à zéro ;
  - **A− / A+** change la taille des notes ;
  - le passage en cours est surligné.
- Le deck a **41 diapositives** et s'arrête à la conclusion. Il n'y a pas de réserve : les questions probables sont dans `FICHE_PRIVEE_QUESTIONS.md` (à lire, jamais projetée).
- **Couverture et sommaire :** à l'ouverture, seule la formule « بسم الله الرحمن الرحيم » (puis seul le titre « Sommaire ») est affichée. **Un seul appui** lance la suite, qui s'affiche toute seule en 2 à 3 secondes : ne pas appuyer plusieurs fois.
- La vidéo n'est plus dans le déroulé (version 4).
- **F** : plein écran · **P** : vue présentateur · **O** ou **Échap** : vue d'ensemble · **?** : aide.

## En cas de problème

| Problème | Solution |
|---|---|
| Message « Un seul écran, ou deux écrans en miroir » | Paramètres > Écrans > **Joindre**, puis relancez |
| Les deux fenêtres sont sur le même écran | Fermez tout et relancez le script |
| La présentation est sur le mauvais écran | Relancez avec `--swap` (ou sans) |
| Le script ne fait rien | Il ferme d'abord l'ancienne fenêtre : attendez 2 secondes et relancez |
| La vue présentateur ne s'ouvre pas | Cliquez sur la présentation et appuyez sur **P** |
| Rien ne marche | Ouvrez `deck.offline.html` dans Chrome, appuyez sur **P**, glissez la fenêtre de la présentation sur le projecteur (ou **Super + Maj + ↑**), puis **F** pour le plein écran |
| Dernier recours | `deck.offline.html` sur un seul écran, notes imprimées (`DISCOURS.md`) |

## Bon à savoir

- Le script utilise un profil Chrome à part (`~/.cache/zawedni-soutenance-chrome`), donc votre Chrome habituel n'est pas touché. Pour le remettre à zéro, supprimez ce dossier.
- Faites un **essai complet sur la machine et le projecteur du jour**, avec le minuteur.
