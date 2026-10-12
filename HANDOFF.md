# Handoff — révision 44, 12 octobre 2026

La révision autorisée est implantée dans `/home/ali/Desktop/zawedni-story-3d`, sur le code existant. La présentation classique reste en lecture seule. Le checkpoint sélectif avant modification est `7458d7c` ; les changements Spec Kit et configurations préexistants sans rapport sont préservés hors des commits de cette révision.

Le plan et les responsabilités agy1/agy2 sont dans `docs/PLAN-44.md`. Les contributions sont terminées et ont été revues par le coordinateur. Celui-ci a corrigé l’inclinaison du cycle et de l’architecture, l’accumulation des poses animées, les textes à lire, les diagrammes, les trajets visibles, les retours vidéo et la provenance. Les règles temporaires des comptes agy ont été restaurées. Les rapports des travailleurs décrivent leurs contributions ; `docs/REVIEW.md` fait foi pour les vérifications intégrées.

## Contenu et interface

44 séquences, 70 révélations internes, 114 états et 113 pressions Suivant du début à la fin. Les trois séquences académiques suivent `modele` et précèdent `ch2`, dans le premier lieu. Six chapitres et six lieux sont conservés. `src/story/itinerary.ts` définit les états ; `content/source/sequences.json` définit les discours actifs.

Le diagramme technique Entreprise/API Spring Boot/PostgreSQL/Administrateur est un SVG en trois états, avec lignes de vie et alternative d’accès contrôlé. Le parcours des captures comporte cinq états ; les deux états d’administration montrent une seule image, sans téléphone ni APK. L’isolation utilise un tableau propre à quatre colonnes, fidèle aux manifestes staging lus localement. Alerte, validation, startup, plan et conclusion reprennent les formulations acceptées. Le moteur conserve `[lire]` et chaque phrase est contrôlée dans son état projeté.

La capture réelle `public/assets/deck/admin-envoi-grille.png` a été obtenue depuis l’application locale, avec les images Docker existantes et une base de démonstration isolée. Elle montre la modale « Envoyer le Questionnaire » et le bouton « Envoyer la Grille CSR ». Aucune attribution n’a été soumise, aucune réponse n’a été simulée, aucune donnée de production n’a été modifiée. Les conteneurs de capture sont arrêtés. Provenance et empreinte : `content/revision-assets.json`, contexte complet : `review/revision/admin-envoi-grille-full.png`.

Le thème est clair avec verre blanc translucide, texte opaque et vert original #0d7b3c. Le mode léger désactive le flou. Le cycle et l’architecture font face au spectateur ; le cadrage de livraison est conservé. Les poses du mixer sont restaurées avant les rotations procédurales, le regard est borné et lissé, le pointage vise le contenu visible puis cesse. Les longs déplacements de caméra montrent une courte marche locale à l’arrivée.

Le film final local de 90 secondes et son unique piste audio sont inchangés. Le lecteur natif permet pause, reprise et lecture de secours ; sortie, retour et rechargement arrêtent/rembobinent la lecture. Le présentateur reste sans média ni WebGL.

## Lancement et livraison

`./present.sh` fonctionne depuis tout répertoire, attend le serveur du build local puis ouvre jury et présentateur. Port par défaut 4318 ; `--swap` inverse les placements, `--prototype` donne accès au prototype conservé. Python 3 et Chrome doivent être présents ; aucune installation ou téléchargement n’est nécessaire pour présenter le build préparé. `ZS3D_PORT` et `ZS3D_CHROME_PROFILE` permettent une configuration locale.

Le serveur ancien sur 4317 appartient à une copie sous le projet classique : ne pas l’arrêter ni le reconstruire. Le serveur de validation de cette révision sert `dist/` sur 4318.

L’estimation est **24,0 minutes** à 125 mots/minute, plage **22,1–26,5 minutes** à 140–110 mots/minute. Elle comprend 2 250 mots, les transitions, les pauses de lecture et le film. Aucune phrase n’a été supprimée pour compenser les animations. `docs/DURATION.json` expose le calcul ; une répétition orale chronométrée reste à faire.

`docs/SCRIPT-44.md` contient le discours synchronisé complet, `PRESENTER.md` les commandes, `docs/CAPTURES.md` les sources, `docs/FICHE-PRIVEE.md` les périmètres techniques. La provenance v7 est conservée dans `content/history/v7`, la nouvelle révision dans `content/revision`. Ne pas relancer l’ancien import de contenu : il annulerait les corrections locales. Utiliser `node scripts/revise-content.mjs` pour régénérer les cadres actifs.

## Vérification

Voir `docs/REVIEW.md` et `review/revision/index.html` pour les résultats, captures et l’enregistrement à vitesse normale. Les tests unitaires, le typage des modules TypeScript, le build et les contrôles de contenu/provenance passent. Le JavaScript historique conserve `checkJs: false` ; ce projet n’a pas été entièrement converti en TypeScript.

La QA Chrome couvre les deux résolutions 1920×1080 et 1366×768. Elle ne remplace ni un essai sur deux écrans physiques, ni l’écoute réelle du son, ni une vérification du cluster. Les mesures GPU et leurs limites sont rapportées séparément. Les licences locales des modèles, fontes et runtime accompagnent la livraison.

## Changement de référence détecté pendant la session

Le contrôle optionnel `node scripts/check-provenance.mjs --classic-readonly` détecte désormais quatre différences dans les fichiers actifs classiques (deck.html, script_rows.py, soutenance.zip et soutenance-v9.zip), datées de 12:59–13:25 UTC le 12 octobre. Cette tâche n’a écrit aucun de ces fichiers. Le snapshot et les empreintes de départ restent conservés : ne pas les remplacer pour faire passer le contrôle, ni restaurer les fichiers classiques. Détails : `review/revision/classic-drift.json`. Les contrôles des sources historiques et des assets locaux de la révision 3D passent.

## Résultats de livraison

25/25 tests unitaires ; 35/35 contrôles complets et 38/38 contrôles ciblés à chacune des résolutions. Lecteur natif : 7/7 ; prototype conservé : 21/21. Archive extraite : tous les hashes du manifeste vérifiés et 6/6 contrôles Chrome sur serveur distinct. GPU Intel UHD : moyennes de 44,4–59,2 FPS normal et 42,9–52,9 FPS léger ; mesures headless, navigateurs de QA séquentiels. L’extrait de revue fait 60 secondes, sans accélération ni piste sonore ; le film final original conserve son audio.
