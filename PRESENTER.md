# Guide présentateur — révision 44

## Lancer

Le build livré fonctionne hors ligne. Python 3 et Google Chrome sont déjà nécessaires
sur la machine préparée. Aucun npm install ni téléchargement n’est requis au lancement.

```bash
/home/ali/Desktop/zawedni-story-3d/present.sh
/home/ali/Desktop/zawedni-story-3d/present.sh --swap
```

Le serveur écoute sur 127.0.0.1:4318. `ZS3D_PORT=4320` change ce port si nécessaire.
Le jury ouvre automatiquement les notes. N les rouvre si la fenêtre a été fermée.
Un profil Chrome distinct est utilisé. En mode miroir ou écran unique, les deux
fenêtres restent sur ce même écran. Les essais automatisés de placement simulent
les écrans ; ils ne constituent pas un essai sur deux écrans physiques.

## Commander

| Touche | Effet |
| --- | --- |
| →, Espace, PageDown | Suivant |
| ←, PageUp | Précédent |
| 1–6 | Début du chapitre |
| Home / End | Début / conclusion |
| N | Rouvrir les notes |
| F | Plein écran du jury |
| M | Mouvement réduit |
| L | Qualité légère et suppression du flou coûteux |
| + / − dans les notes | Taille du discours |

La souris sur le lecteur et la molette ne font pas avancer la présentation.
Les lignes du parcours des notes permettent de sauter directement à un état.
Les notes montrent le discours à dire, les phrases [lire], le prochain clic et le chapitre.
Elles suivent les retours, les sauts et les rechargements, même ouvertes tardivement.

## Repères

44 séquences, 114 états et 113 pressions suivant. Les 70 révélations internes ne
comptent pas les entrées de séquence. Aucun clic supplémentaire n’est consacré aux trajets.
La dernière partie est « Bilan, perspectives et conclusion ».

Les interfaces suivent cinq états : Envoi de la grille, Remplissage, Décision,
Résultats, Marché local. Les deux étapes d’administration n’ont ni téléphone ni APK.
Le diagramme technique conserve trois états, quatre participants et le contrôle API.

Le film final de 90 secondes vient après les perspectives, avant la conclusion.
Avancer de son affiche à sa lecture démarre le film avec le son ; si le navigateur
refuse, utiliser « Lire la vidéo ». Ses commandes permettent pause et reprise.
Quitter arrête et rembobine. Revenir ou recharger garde l’affiche sans lecture fantôme.
Le présentateur reste muet, sans lecteur et sans second WebGL.

## Rythme et secours

Estimation explicite : 2 250 mots, film 90 s, transitions 100,75 s, pauses de lecture
169,5 s. Environ 24 min à 125 mots/min ; 22 à 26,5 min selon le débit.
Cette estimation ne remplace pas une répétition parlée chronométrée.
Le discours intégral est dans docs/SCRIPT-44.md ; ne pas le couper pour compenser les trajets.

Si le rendu est saccadé, L réduit la qualité et le flou. M supprime les mouvements.
Si le serveur sert une autre version, le lanceur refuse sa réutilisation : choisir
un port libre avec ZS3D_PORT. Conserver un exemplaire de l’archive extraite et prête.
