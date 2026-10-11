# Présenter avec deux écrans

## Une seule fois, avec Internet

```bash
cd ~/Desktop/zawedni-story-3d
npm install && npm run build
```

Ensuite, plus rien n'est téléchargé : `dist/` contient la page, les modèles, les images et les fontes.
Il faut seulement `python3` et Google Chrome, déjà présents sur la machine.

## Le jour de la soutenance

1. Brancher le projecteur, puis dans **Paramètres > Écrans**, choisir **« Joindre les écrans »** (pas « Miroir »).
2. Lancer, depuis n'importe quel dossier :

   ```bash
   ~/Desktop/zawedni-story-3d/present.sh          # jury sur le projecteur, notes sur l'ordinateur
   ~/Desktop/zawedni-story-3d/present.sh --swap   # l'inverse
   ```

Le script démarre le serveur local (ou réutilise celui qui tourne), ouvre la fenêtre jury en plein écran sur
le projecteur, et la fenêtre jury ouvre elle-même la vue présentateur sur l'écran de l'ordinateur.
Il utilise un profil Chrome à part (`~/.cache/zawedni-story-3d-chrome`) : votre Chrome habituel n'est pas touché.

Si un seul écran est détecté (ou en miroir), les deux fenêtres s'ouvrent sur le même écran : le dire suffit,
le script l'affiche.

## Pendant la présentation

| Touche (dans l'une ou l'autre fenêtre) | Effet |
| --- | --- |
| → · Espace · PageDown · clicker | suivant |
| ← · PageUp | précédent |
| 1 – 4 | début de la scène A, B, C, D |
| Début (Home) | retour au début |
| F | plein écran (fenêtre jury) |
| N | rouvrir la vue présentateur si on l'a fermée |
| L | qualité légère / normale |
| M | mouvement réduit |
| + / − | taille du texte des notes (vue présentateur) |

Un clic sur une ligne du « Parcours » de la vue présentateur y amène la fenêtre jury.
La souris et la molette n'avancent jamais la présentation.

La vue présentateur montre, pour l'état à l'écran : les **phrases à dire**, les phrases **« À lire à l'écran »**,
les **ajouts (transition)** signalés à part, puis **« Prochain clic → »**. Elle suit seule l'avant, l'arrière et
les sauts ; ouverte en retard ou rechargée, elle affiche aussitôt l'état courant. Elle n'a ni 3D ni son.

## Si quelque chose ne va pas

- **La fenêtre jury n'est pas sur le projecteur** : la glisser dessus, puis **F**.
- **Pas de vue présentateur** : **N** dans la fenêtre jury.
- **« Le port 4317 est déjà pris »** : une autre application l'utilise ; la fermer, ou changer `PORT` dans `present.sh`.
- **Image saccadée** : **L** (qualité légère, même rendu).
- Vérification sans réseau : couper le Wi-Fi, lancer `present.sh`, parcourir A0 → D3.
