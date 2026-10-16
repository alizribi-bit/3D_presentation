# Vérification ZAWEDNI_3D_20MIN — 13 octobre 2026

La copie fonctionnelle reprend la **classique finale locale : 35 slides, 51 révélations, 86 états, 85 avances et cinq chapitres**. Discours exact, BMC complet puis clients et valeur ensemble, ouverture de chaque chapitre, bilan, perspectives et vidéo slide 34. Aucun état ajouté ni focus revenu. Les scènes retirées et leurs exports servis sont absents ; la zone stable `02` de développement est supprimée. Le nouveau chapitre 2 conserve l’architecture en zone stable `03`.

**41 tests TypeScript et 2 tests HTTP réussis**. Le parcours, les citations, le nombre et l’ordre des états, les empreintes de chaque frame et du discours, les commandes non fiables, les retours vidéo asynchrones et les limites de vitesse de marche sont vérifiés. Les tests HTTP couvrent les plages bornées, ouvertes et suffixes, HEAD, 206/416 et le refus d’un lien sortant du dossier servi. Typage strict, contrôle de provenance et build de production passent.

**384 contrôles de contenu et de présentateur réussis**, à 1920×1080 et 1366×768 : chacun des 86 états, notes exactes, textes et images projetés, chargement et confinement dans le tableau, les 85 avances et 85 retours aux deux résolutions, cinq accès aux chapitres, Home/End, rechargement et reconnexion des notes. Zéro exception, fichier manquant ou requête externe. Rapports : `review/20min/content-1920x1080.json` et `content-1366x768.json`.

**149 contrôles du parcours normal réussis**, avec rendu 3D continu, sans mode fast/still ni horloge modifiée. Les 86 arrivées sont parcourues au clavier. Les 50 révélations locales gardent la caméra et le guide stables ; la dernière révélation de conclusion revient au monde. La couche globale reste à opacité 1 ; les nouveaux groupes SVG et captures s’animent localement. Le BMC déclenche les deux surlignages dans la même étape. Sauts aux chapitres et interruption d’un voyage récupèrent la destination correcte. 120 animations locales observées. Une assertion d’égalité exacte a détecté un écart numérique de 1,78×10⁻¹⁵ m ; la validation géométrique utilise une tolérance de 10⁻⁶ m et conserve les observations brutes. Rapport : `review/20min/normal-route.json`.

Les comparaisons de contenu utilisent le mode léger et suspendent le dessin GPU continu tout en conservant le directeur, les caméras, acteurs, DOM et navigation à temps réel. Cela évite les délais du rendu logiciel dans ces vérifications textuelles. Le monde et les mouvements sont vérifiés séparément dans la traversée normale ci-dessus ; les vues de repos projetées sont dans `review/20min/projection/`. Des captures normales 1920 existent aussi dans `review/classic/1920x1080/`. Les premiers essais avec plusieurs rendus logiciels continus ont rencontré des délais de QA ; aucune exception applicative n’a été détectée. Ces essais ne constituent pas un benchmark de fluidité matérielle.

**14 contrôles vidéo réussis** : film H.264/AAC local de 90 secondes avec une piste audio, démarrage avec son ou bouton de secours, lecture réelle, pause/reprise, volume, déplacement, fin, arrêt/rembobinage en sortie, retour et rechargement sans lecture fantôme, puis reprise du parcours au clavier après la souris. Le présentateur n’a aucun lecteur. Le serveur hérité ignorait Range et faisait revenir le déplacement à zéro ; le serveur local propre à la copie répond maintenant 206 et permet la recherche dans le film. Rapport : `review/20min/media-report.json`.

Sécurité : **zéro vulnérabilité signalée par npm audit** sur les dépendances installées, assets locaux, notes affichées par textContent, exports sans scripts ni gestionnaires d’événements, validation des commandes, serveur uniquement sur 127.0.0.1 et fichiers confinés dans dist. Les en-têtes de plage sont bornés, les copies s’effectuent par blocs de 64 Kio, et les annulations normales du lecteur ferment le flux sans erreur.

Préservation : **22 670 fichiers contrôlés inchangés** dans le projet 3D maintenu (11 019), le dossier 3D historique (10 173) et la classique validée (1 478). Liste et SHA-256 comparés avant/après, hors métadonnées Git. Aucune restauration Git ; les modifications locales sont copiées. Aucun lien symbolique ne sort de la copie. Rapport : `review/20min/preservation.json`. Les lanceurs, le build, la référence figée, les captures et le film utilisent les fichiers propres de la copie.

Durée : **18:45 estimées**, 1 486 mots à 110 mots/min, film de 90 s compris et budget validé de lecture/respiration conservé. La chronologie normale de la 3D cumule 19,84 s de mouvements, dans ce budget. À 105 mots/min : 19:24. Ce n’est pas une répétition orale chronométrée. Voir `DUREE-20MIN.md`.

Limites matérielles : le son est présent et non muet dans le navigateur, mais le haut-parleur du projecteur, deux écrans physiques et la télécommande n’ont pas été essayés. Le rendu logiciel SwiftShader utilisé pour la QA ne mesure pas la fluidité sur le GPU de soutenance. Les preuves techniques de la classique restent historiques ; aucun pipeline ou déploiement applicatif nouveau n’a été exécuté.

Lancement : `/home/ali/Desktop/ZAWEDNI_3D_20MIN/present.sh`. Les commandes de reproduction, à exécuter dans cette copie après lancement, sont :

```bash
npm test
npm run build
npm run verify
VIEWPORT=1366x768 npm run verify
npm run verify:20min
npm run verify:media
```

Build final `c2d1d41a79863b07` : lanceur testé depuis `/tmp` puis depuis la copie, réutilisation du serveur propre confirmée. Le navigateur charge le titre ZAWEDNI_3D_20MIN et ses 86 états ; une requête vidéo de 16 octets reçoit bien 206 et 16 octets. Aucun fichier manquant ni exception. Rapport : `review/20min/final-build-smoke.json`. Les 14 contrôles vidéo sont également repassés sur le port final 4320.
