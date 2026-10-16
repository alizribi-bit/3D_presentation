# Ajustement du chapitre 3 vérifié — 13 octobre 2026

Disposition confirmée : **slide en haut / monde 3D en bas**, pendant `chaine-1`, `chaine-2`, `chaine-3`, `log4j-1` et `log4j-2`. Le premier clic utile ouvre la vue ; les étapes suivantes gardent la caméra fixe et animent le colis. Le tableau retrouve son format habituel sur `dix-pipelines-0` et `argocd-0`. Les introductions et les captures gardent le grand tableau.

Le schéma conserve ses textes et son échelle ; seuls ses espaces verticaux inutilisés sont compactés. Le tableau reste visible pendant les zooms. Log4j s’arrête en rouge devant Dependency-Check puis reprend en vert après correction. Une horloge propre au colis permet les retours et interruptions sans bloquer la navigation. Le mouvement réduit place directement le colis à destination.

**48 tests TypeScript et 2 tests HTTP réussis**, typage strict, provenance et build de production validés. Le nouveau test compare tous les états à la base acceptée : mêmes notes, ordre et nombre ; les 81 états hors sélection sont identiques. Les retours, interruptions et mouvements réduits sont couverts. Les sources orales et les frames servies restent identiques octet par octet.

**229 contrôles ciblés réussis à 1920×1080 et 1366×768** : les 31 états du chapitre, textes et notes exacts, contenu dans le tableau, convoyeur sous la slide, légendes sans chevauchement, positions et couleurs du colis, avancées, retours, restauration du grand tableau et clics rapides. Aucun fichier manquant, requête externe ou exception. Rapport : `review/chapter3/browser-report.json` ; captures finales : `review/chapter3/screenshots/`.

**192 contrôles du parcours complet et du présentateur réussis à 1920×1080**, avec 86 états et 85 avances conservés, notes, chapitres, retours, rechargement et reconnexion vérifiés. Rapport : `review/chapter3/full-content-report.json`. Un contrôle navigateur supplémentaire confirme le mouvement réduit, le colis arrêté à la position zéro et la scène visible : `review/chapter3/reduced-motion.json`.

La QA utilise une horloge réelle et conserve les mises à jour du directeur, de la caméra, des acteurs et du DOM. Le dessin GPU continu est suspendu pour éviter les délais du rendu logiciel ; les captures finales rendent réellement la scène au repos. Ces vérifications ne mesurent pas la fluidité du projecteur.

Sécurité : aucun ajout de dépendance, requête externe ni entrée exécutable ; légendes fixes échappées, notes inchangées et serveur local confiné conservé. Le lanceur sert le build actuel `30fd6ccf027f4abe` sur le port 4320. La base acceptée, son build, ses sources et ses contenus sont sauvegardés dans `.backups/chapter3-validated-base/`.

Le discours, le film et les 85 clics restent identiques. L’estimation orale demeure 18:45 à 110 mots/min ; les quatre zooms supplémentaires sont contenus dans le budget existant. Voir `DUREE-20MIN.md`.

**14 contrôles vidéo réussis sur le build final** : lecture, pause/reprise, son, volume, déplacement, fin, sortie, retour, rechargement et reprise du clavier. Rapport : `review/chapter3/media-report.json`.

Les 21 192 fichiers des deux projets 3D originaux correspondent toujours au manifeste précédent. La classique locale présente 20 écarts depuis ce manifeste, dans un travail extérieur à cette copie ; aucune synchronisation éditoriale n’a été appliquée pendant cet ajustement. La référence acceptée figée et les 41 fichiers de sources/contenus de cette copie sont conservés. Rapports : `review/chapter3/preservation.json` et `content-preservation.json`.

Reproduction dans la copie :

```bash
npm test
npm run build
node --import tsx scripts/verify-chapter3.mjs
QA_LIGHT=1 npm run verify
npm run verify:media
ZS3D_NO_BROWSER=1 ./present.sh
```
