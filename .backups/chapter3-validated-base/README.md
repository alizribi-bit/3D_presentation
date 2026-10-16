# ZAWEDNI_3D_20MIN

Copie indépendante du projet réellement servi par le lanceur original, avec toutes ses corrections locales. Référence : **ZAWEDNI_CLASSIQUE_20MIN finale locale du 13 octobre 2026**, 35 slides, 51 révélations, cinq chapitres et **86 états / 85 avances**. Le discours oral est conservé exactement. Aucune avance supplémentaire.

```bash
/home/ali/Desktop/ZAWEDNI_3D_20MIN/present.sh
```

Le serveur local gère les requêtes de plage pour permettre le déplacement dans la vidéo. Le lanceur sert exclusivement le `dist/` de cette copie sur **http://127.0.0.1:4320**, contrôle ses empreintes et utilise son propre profil Chrome. `--swap` inverse les deux écrans. Le build et les médias sont livrés ; le lancement fonctionne sans accès réseau ni dossier original.

→ / Espace / PageDown : suivant ; ← / PageUp : précédent ; **1–5 : chapitres** ; Home / End ; F : plein écran ; N : notes ; M : mouvement réduit ; L : qualité légère. La liste des notes permet l’accès direct à chaque état. Le film demeure en slide 34, avec lecture, pause/reprise, son, volume et déplacement ; quitter arrête et rembobine. Le présentateur n’a aucun lecteur audio.

La zone de développement est retirée par son contenu. Le marché est rapproché de l’architecture ; le chemin suit cinq zones, sans arrêt intermédiaire supprimé. Les identifiants physiques `01,03,04,05,06` restent stables, et les chapitres affichés sont numérotés de 1 à 5. Le sommaire et les cinq ouvertures correspondent à la classique. Caméra stable lors des révélations locales ; sortie vers le monde conservée à la conclusion. Les éléments nouveaux des schémas SVG apparaissent localement ; le cadre et le décor restent visibles.

- [Discours avec repères 3D](docs/SCRIPT-ACTUEL.md)
- [Correspondance courte](docs/CORRESPONDANCE-COURTE.md), [détail de chaque état](docs/CORRESPONDANCE.md)
- [Vérifications et limites](docs/VERIFICATION-20MIN.md)
- [Durée estimée](docs/DUREE-20MIN.md)

```bash
cd /home/ali/Desktop/ZAWEDNI_3D_20MIN
npm test
npm run build
npm run sync:classic
```

Node ≥20.20, Python 3 et Chrome. `npm run build` inclut le contrôle de provenance, le contenu exact et le typage strict. `npm run sync:classic` lit la référence complète figée dans `content/reference/classic-final/`, sans exécuter de générateur ni modifier cette référence ; il reconstruit les frames, la correspondance et les notes dans la copie. La classique locale et les deux originaux 3D restent protégés par `review/20min/originals-before.json`.

Les anciens rapports et notes figurent dans `content/history/20min-original-docs/` et les autres dossiers historiques copiés. Ils décrivent l’ancienne 3D, pas cette livraison. Le mode prototype de l’ancienne édition est désactivé dans cette copie.
