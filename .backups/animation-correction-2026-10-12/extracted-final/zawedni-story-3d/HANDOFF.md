# Handoff — classique validée, 12 octobre 2026

La présentation classique active remplace désormais les adaptations textuelles de la révision 44. Sources : `/home/ali/Desktop/zawedni-video-pfe/soutenance/deck.html`, son bundle `deck.offline.html` et `build/script_rows.py`. Ces sources et les médias sont restés inchangés, avec 37 empreintes relues après travail.

44 slides, 70 révélations, 114 états, 113 avances, tous calculés depuis la référence courante. Discours : `docs/SCRIPT-ACTUEL.md`. Correspondance détaillée : `docs/CORRESPONDANCE.md` et JSON. Rapport : `docs/CONFORMITE.md`. Captures appariées et enregistrement : `review/classic/index.html`.

Les cadres classiques complets et exacts s’affichent dans les tableaux glass, notamment la séquence à quatre participants, les cinq captures du parcours, le bilan corrigé et les annotations publiques actualisées. Architecture et livraison gardent les accessoires 3D et leurs cadrages tout en affichant les diagrammes complets. Couverture, roadmap, cycle, personnages, moniteurs et éclairages sont conservés.

Le présentateur est en TypeScript strict : grand titre, clic courant, À dire et À lire à l’écran, ordre du discours préservé, long aperçu suivant replié, minuteur/progression en bas. Il suit avances, retours, raccourcis, hash et rechargements, même ouvert tard. Il n’a aucun WebGL ni média.

Lancement demandé : `cd ~/Desktop/zawedni-video-pfe/zawedni-story-3d && ./present.sh`. Seul le `present.sh` de ce sous-dossier 3D a été remplacé par un relais vers le projet indépendant actuel. Son ancien contenu est sauvegardé dans `content/history/legacy-nested-present.sh`. Le build servi est `/home/ali/Desktop/zawedni-story-3d/dist`, port 4318, mode complet. Le lanceur vérifie les empreintes des sources, du build et du serveur. La vieille copie 4317 est conservée et n’est pas réutilisée.

29 tests unitaires, typage, contenu, provenance et build passent. Chrome : 249/249 contrôles à chacune des deux résolutions, 12/12 sur le lecteur natif. Les deux fenêtres ouvertes partagent un seul lecteur sonore dans le jury ; le film accepté de 90 secondes reste identique. Galerie et enregistrement livrés dans `review/classic`.

Pour réextraire la référence active : `npm run sync:classic`, puis exports du discours et de la durée, tests et build. Les commandes d’import/révision historiques redirigent vers l’extraction actuelle ; leurs anciennes implémentations restent archivées. Les fichiers historiques ne doivent pas reprendre priorité.

Archive : `release/zawedni-story-3d-classique-validee.zip`, avec manifeste SHA-256 et build préparé. L’archive extraite et son build passent les contrôles de toutes les empreintes, ainsi que 6/6 contrôles Chrome sur le serveur distinct 4319. Aucun npm install n’est nécessaire pour la présenter sur une machine disposant de Python 3 et Chrome.

Limites : aucun essai sur deux écrans physiques, clicker ou haut-parleurs du projecteur, aucune répétition orale chronométrée. Quelques légendes techniques conservent la densité du classique. Estimation : 24 minutes à 125 mots/minute. Le JavaScript historique reste sous `checkJs: false`, tandis que les nouveaux modules présentateur sont typés strictement. Les changements préexistants Spec Kit et configurations sans rapport sont préservés.
