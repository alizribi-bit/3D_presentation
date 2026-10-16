# ZAWEDNI Story 3D — classique validée

Six lieux 3D, jury et présentateur synchronisés. La référence est la présentation classique active dans `../zawedni-video-pfe/soutenance`, lue sans modification. Les compteurs extraits sont **44 slides, 70 révélations, 114 états et 113 avances**.

Discours exact : [docs/SCRIPT-ACTUEL.md](docs/SCRIPT-ACTUEL.md). Correspondance de chaque clic, avec les textes, images et disparitions : [docs/CORRESPONDANCE.md](docs/CORRESPONDANCE.md) et son JSON. Preuves et limites : [docs/CONFORMITE.md](docs/CONFORMITE.md).

## Présenter

```bash
cd ~/Desktop/zawedni-video-pfe/zawedni-story-3d
./present.sh
```

Ce point d’entrée redirige vers le projet indépendant `~/Desktop/zawedni-story-3d`. Il ouvre son **build actuel**, sur `127.0.0.1:4318`, en mode complet. Une archive extraite utilise directement son propre `./present.sh`. Python 3 et Google Chrome sont nécessaires ; le build préparé fonctionne sans installation ni Internet.

Le lanceur compare l’identité des fichiers servis et refuse un build périmé. `ZS3D_PORT=4320 ./present.sh` change le port ; `--swap` inverse les écrans. Le présentateur ne charge ni WebGL ni média. Guide : [PRESENTER.md](PRESENTER.md).

## Préparer et vérifier

```bash
npm ci
npm run sync:classic          # extraction depuis les sources actives, en lecture seule
node --import tsx scripts/export-notes.mjs
node --import tsx scripts/estimate-duration.mjs
npm test
npm run build                # provenance, contenu, typage, puis build
ZS3D_NO_BROWSER=1 ./present.sh
npm run verify:classic
VIEWPORT=1366x768 npm run verify:classic
node scripts/verify-media.mjs
node scripts/test-launcher.mjs
node scripts/record-synchronization.mjs
python3 scripts/package-release.py
```

Les imports historiques sont redirigés vers l’extraction actuelle. Les anciens textes et résultats restent dans l’historique et ne fournissent plus le contenu actif. Les graphismes acceptés du monde, les personnages, les moniteurs, les éclairages, la roadmap et les cadrages sont conservés ; les tableaux affichent les cadres classiques complets avec leur composition et leurs diagrammes.

Licences locales : [public/licenses/README.md](public/licenses/README.md).
