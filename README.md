# ZAWEDNI_3D_20MIN

Copie indépendante du projet réellement servi par le lanceur original, avec toutes ses corrections locales. Référence : **ZAWEDNI_CLASSIQUE_20MIN finale locale du 13 octobre 2026**, 35 slides, 51 révélations, cinq chapitres et **86 états / 85 avances**. Le discours oral est conservé exactement. Aucune avance supplémentaire.

```bash
/home/ali/Desktop/ZAWEDNI_3D_20MIN/present.sh
```

Le serveur local gère les requêtes de plage pour permettre le déplacement dans la vidéo. Le lanceur sert exclusivement le `dist/` de cette copie sur **http://127.0.0.1:4320**, contrôle ses empreintes et utilise son propre profil Chrome. `--swap` inverse les deux écrans. Le build et les médias sont livrés ; le lancement fonctionne sans accès réseau ni dossier original.

→ / Espace / PageDown : suivant ; ← / PageUp : précédent ; **1–5 : chapitres** ; Home / End ; F : plein écran ; N : notes ; M : mouvement réduit ; L : qualité légère. La liste des notes permet l’accès direct à chaque état. Le film demeure en slide 34, avec lecture, pause/reprise, son, volume et déplacement ; quitter arrête et rembobine. Le présentateur n’a aucun lecteur audio.

La zone de développement est retirée par son contenu. Le marché est rapproché de l’architecture ; le chemin suit cinq zones, sans arrêt intermédiaire supprimé. Les identifiants physiques `01,03,04,05,06` restent stables, et les chapitres affichés sont numérotés de 1 à 5. Le sommaire et les cinq ouvertures correspondent à la classique. Caméra stable entre les étapes d’un même schéma ; sortie vers le monde conservée à la conclusion. Les éléments nouveaux des schémas SVG apparaissent localement ; le cadre et le décor restent visibles.

Au chapitre 3, les explications de la chaîne de livraison et de l’essai Log4j ouvrent doucement une vue **slide en haut / convoyeur 3D en bas**. Le colis suit les étapes, s’arrête au contrôle bloquant puis reprend après correction. La slide suivante retrouve le grand tableau. Les autres passages gardent leur mise en scène. La base acceptée est sauvegardée dans `.backups/chapter3-validated-base/`.

Les nouveaux éléments des slides apparaissent avec une arrivée douce et un décalage discret. Les textes et captures montent de 8 pixels ; les groupes SVG gardent leurs coordonnées. Le mouvement reste inférieur à une demi-seconde, sans attente ni avance supplémentaire. Les clics rapides et le mouvement réduit interrompent proprement les apparitions locales.

Les repères des cinq chapitres restent visibles en haut de chaque slide, avec le chapitre actuel en vert. Le numéro de slide figure tout en bas à droite et reste identique pendant ses révélations. Ces repères suivent la slide affichée, y compris pendant les déplacements, sans modifier le contenu ni les animations. Vérification : `node --import tsx scripts/verify-slide-chrome.mjs` ; captures et rapport dans `review/slide-chrome/`.

Les slides « Notre chaîne de livraison » et « Un blocage vérifié en pratique » ont en plus un **tracé progressif d’une seconde** : la ligne verte avance avec son repère, suit le coude vers la supervision, s’arrête à Dependency-Check puis reprend après correction. Leur ouverture et leur retour au grand tableau sont également lissés. Voir [les animations des lignes](docs/LIGNES-CHAPITRE3.md).

- [Discours avec repères 3D](docs/SCRIPT-ACTUEL.md)
- [Correspondance courte](docs/CORRESPONDANCE-COURTE.md), [détail de chaque état](docs/CORRESPONDANCE.md)
- [Vérifications et limites](docs/VERIFICATION-20MIN.md)
- [Ajustement du chapitre 3 vérifié](docs/VERIFICATION-CHAPITRE3.md)
- [Polissage des animations des slides](docs/ANIMATIONS-SLIDES.md)
- [Durée estimée](docs/DUREE-20MIN.md)

```bash
cd /home/ali/Desktop/ZAWEDNI_3D_20MIN
npm test
npm run build
npm run sync:classic
```

Node ≥20.20, Python 3 et Chrome. `npm run build` inclut le contrôle de provenance, le contenu exact et le typage strict. `npm run sync:classic` lit la référence complète figée dans `content/reference/classic-final/`, sans exécuter de générateur ni modifier cette référence ; il reconstruit les frames, la correspondance et les notes dans la copie. La classique locale et les deux originaux 3D restent protégés par `review/20min/originals-before.json`.

Les anciens rapports et notes figurent dans `content/history/20min-original-docs/` et les autres dossiers historiques copiés. Ils décrivent l’ancienne 3D, pas cette livraison. Le mode prototype de l’ancienne édition est désactivé dans cette copie.


## Discours synchronisé depuis la classique actuelle

Seul le discours a été actualisé depuis `/home/ali/Desktop/zawedni-video-pfe/ZAWEDNI_CLASSIQUE_20MIN/build/content_20min.py`. Les 35 slides et 86 états ont été comparés par ID et clic ; quatre passages différaient encore : ouverture, outils d’infrastructure, tests à l’entrée et au clic. Les autres passages restent exacts. Le texte est synchronisé dans les notes natives et `docs/SCRIPT-ACTUEL.md`.

Les frames, captures, caméra, parcours, animations, film et clics 3D sont inchangés. La référence visuelle figée `content/reference/classic-final/` est préservée. Le discours actuel a son instantané indépendant `content/reference/speech-content_20min.py` et son empreinte `speechSource` dans le manifeste. `sync:classic` reste une réimportation complète de l’ancienne référence figée, pas une commande de mise à jour du seul discours.

Build reconstruit ; 55 tests TypeScript et 2 tests serveur réussis. Durée estimée du script classique actuellement lu : 19:06 à 110 mots/min, film et pauses inclus, pas une répétition chronométrée. Vérification dans `review/speech-sync/`.
