> Référence actuelle (12 octobre 2026) : la présentation classique active prend priorité pour les contenus. Voir `docs/CONFORMITE.md`, `docs/CORRESPONDANCE.md` et `HANDOFF.md`. Les exigences propres au monde 3D restent applicables ; les anciens discours, compteurs et résultats ci-dessous sont historiques.

# Revue intégrée — révision 44

La mise à jour conserve le framework et les six lieux existants. Les deux travailleurs agy1/agy2 ont produit des changements séparés ; le coordinateur a revu les diffs, corrigé les défauts, intégré la capture et exécuté les contrôles ci-dessous. Checkpoint avant modification : `7458d7c`. La présentation classique et ses empreintes historiques restent préservées.

## Résultat

44 séquences, 70 révélations, 114 états et 113 pressions Suivant. Académique, startup, plan, conclusion, diagramme technique à quatre participants, parcours de captures à cinq états, isolation, alerte et validation reprennent les textes acceptés. Les phrases [lire] correspondent à leurs états visibles. Le tableau d’architecture remplace la boucle pendant sa lecture, sans superposition de géométrie. Le cadrage de livraison est conservé. Les poses animées sont restaurées et les gestes cessent pendant la lecture.

La vraie capture d’administration est `public/assets/deck/admin-envoi-grille.png`. Modale réelle ouverte sur l’entreprise locale de démonstration, aucune attribution soumise, aucune réponse simulée, aucune donnée de production modifiée. Empreinte et source JSX dans `content/revision-assets.json`. Les conteneurs locaux de capture sont arrêtés.

## Contrôles exécutés

- Build Vite, 25/25 tests unitaires, typage TypeScript et vérification de contenu/provenance réussis. Le JavaScript historique reste hors de checkJs.
- 29 assets d’origine et la capture nouvelle vérifiés par SHA-256 ; film original inchangé, 90 secondes, une piste vidéo et une piste audio. Le contrôle des sept fichiers classiques a passé les vérifications précédentes, puis a détecté quatre modifications hors de cette tâche entre 12:59 et 13:25 UTC (deck.html, script_rows.py et les deux ZIP actifs). Le snapshot initial et les fichiers historiques locaux restent inchangés ; les différences sont consignées dans review/revision/classic-drift.json. Aucun fichier classique n’a été écrit par cette tâche.
- Audit npm : zéro vulnérabilité signalée. Commandes réseau localisées, messages de navigation validés, absence de secrets dans les artefacts de capture ; aucun service externe nécessaire au runtime. Licences modèles, fontes et Three.js livrées.
- Lanceur depuis /tmp : serveur actuel prêt avant lancement, placement simulé des deux fenêtres, inversion, repli écran unique, prototype, arguments invalides. Aucun essai physique de placement n’est revendiqué.
- `review/full/verify/1920x1080/report.json` : **35/35** (2026-10-12T13:33:43.994Z).
- `review/full/verify/1366x768/report.json` : **35/35** (2026-10-12T13:36:58.454Z).
- `review/revision/1920x1080/report.json` : **38/38** (2026-10-12T13:37:25.173Z, rendu vulkan).
- `review/revision/1366x768/report.json` : **38/38** (2026-10-12T13:37:49.462Z, rendu vulkan).
- `review/revision/media-report.json` : **7/7** (2026-10-12T12:22:46.809Z, rendu default).
- `review/verify/report.json` : **21/21** (2026-10-12T11:52:27.219Z, rendu default, qualité normal).

Les parcours complets contrôlent l’ordre, toutes les traversées avant/arrière, preuves canoniques, notes, retours/rechargements, clics rapides, interruptions réelles, touches après la souris, film et requêtes locales. Les contrôles ciblés vérifient les six repères dans le cadre, les textes à lire, les captures et l’absence de téléphone en administration, les diagrammes, le verre, la stabilité de caméra et du squelette. L’enregistrement `review/revision/revision-normal-speed.webm` montre un parcours représentatif animé à vitesse normale (sans ralenti, sans still/fast). Il n’est pas une répétition intégrale ni un enregistrement sonore.

## Durée et performances

Estimation : 24.0 minutes à 125 mots/minute, plage 22.1–26.5 minutes. 2250 mots, transitions, pauses et film sont comptés explicitement ; aucune suppression de discours. Répétition orale chronométrée à faire.

Rendu mesuré : **ANGLE (Intel, Vulkan 1.4.318 (Intel(R) UHD Graphics (ICL GT1) (0x00008A56)), Intel open-source Mesa driver)**. Chrome headless 1920×1080, Vulkan, mesures séquentielles sans autre navigateur de QA ; les fenêtres Chrome personnelles existantes n’ont pas été fermées.

- normal : moyennes des six transitions 44.4–59.2 FPS ; cinquièmes percentiles 18.7–25.5 FPS.
- light : moyennes des six transitions 42.9–52.9 FPS ; cinquièmes percentiles 20.7–29.4 FPS.

Le mode léger retire les filtres de verre et réduit le coût graphique. Le sandbox ne donne pas accès au GPU et ses résultats logiciels de 1,4–7,3 FPS ne représentent pas la machine réelle ; ils sont conservés dans review/revision/performance-software.json. Les mesures Intel ci-dessus ont été exécutées hors sandbox, sans autre navigateur de QA concurrent. Un blocage du compositor logiciel llvmpipe a été observé dans le sandbox avec Vulkan forcé et le verre actif lors du test du prototype, y compris après l’optimisation des panneaux masqués. Le mode léger passe les 21 contrôles. Le prototype est aussi vérifié avec le moteur choisi automatiquement par Chrome headless (SwiftShader logiciel dans le sandbox). L’enregistrement final et les mesures sont effectués hors sandbox sur le GPU Intel UHD ; les rapports indiquent le mode réellement utilisé. Le lanceur de soutenance ne force pas Vulkan. Les mesures headless ne prédisent pas exactement le comportement du projecteur. Ni deux écrans physiques, ni l’écoute réelle du son, ni le cluster n’ont été testés.

## Livraison

Archive : `release/zawedni-story-3d-44.zip`, somme externe SHA-256 et manifeste interne des fichiers. Le build offline, les sources, les scripts, les notes, les licences et les preuves de revue sont inclus ; anciennes sauvegardes, dépendances de développement, configurations d’agents et secrets sont exclus. Après extraction, tous les fichiers du manifeste sont vérifiés et le build est ouvert dans Chrome sur un serveur indépendant. Le résultat est dans `review/revision/extraction-report.json`.
