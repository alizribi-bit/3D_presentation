# Présenter ZAWEDNI_3D_20MIN

Lancer `/home/ali/Desktop/ZAWEDNI_3D_20MIN/present.sh`. Le jury et les notes s’ouvrent sur les écrans détectés. Utiliser `--swap` pour inverser le placement. En miroir ou avec un seul écran, les deux fenêtres partagent l’écran ; N rouvre les notes.

Le discours, le titre et le repère d’entrée/clic suivent les 86 états du jury. La liste « Aller à une étape » donne les accès directs. 1–5 ouvre chaque chapitre ; Home et End rejoignent l’ouverture et la conclusion. Le minuteur se remet à zéro au clic. + et − règlent la taille des notes.

Le film se présente en slide 34 : une avance démarre les 90 secondes, ou affiche le bouton de lecture si Chrome refuse l’autoplay. Les commandes natives gèrent pause, reprise, son, volume et déplacement. À la fin, avancer vers la conclusion. Revenir restaure le film arrêté au début. La fenêtre des notes reste silencieuse.

Le port par défaut est 4320. Pour le changer : `ZS3D_PORT=4321 ./present.sh`. Le lanceur refuse un serveur étranger, un build périmé ou des fichiers manquants. Construction : `cd /home/ali/Desktop/ZAWEDNI_3D_20MIN && npm run build`.

Voir `docs/DUREE-20MIN.md` et `docs/VERIFICATION-20MIN.md`. La durée est une estimation du discours et des mouvements, à confirmer en répétition avec le matériel de projection.
