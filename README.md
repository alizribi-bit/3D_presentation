# ZAWEDNI Story 3D — révision 44

Présentation guidée dans six lieux 3D, avec jury et présentateur synchronisés.
44 séquences, 70 révélations, 114 états, 113 pressions suivant. Discours complet :
[docs/SCRIPT-44.md](docs/SCRIPT-44.md). Durée estimée : environ 24 minutes,
avec une fourchette de 22 à 26,5 minutes ; aucun discours n’est supprimé.

## Présenter hors ligne

Le build `dist/` est livré prêt. Python 3 et Google Chrome doivent déjà être installés.
Depuis n’importe quel dossier :

```bash
/home/ali/Desktop/zawedni-story-3d/present.sh
/home/ali/Desktop/zawedni-story-3d/present.sh --swap
```

Le port local est **4318**. `ZS3D_PORT=4320 ./present.sh` permet de le changer.
Le lanceur vérifie que le serveur sert le build courant. Deux fenêtres s’ouvrent ;
le présentateur n’a ni rendu WebGL ni lecteur média. Guide : [PRESENTER.md](PRESENTER.md).

## Développement et vérification

```bash
npm ci                       # préparation seulement, pas le jour de la soutenance
npm test
npm run typecheck
npm run check
npm run build
python3 -m http.server 4318 --bind 127.0.0.1 --directory dist
npm run verify
VIEWPORT=1366x768 npm run verify
node scripts/verify-revision.mjs
VIEWPORT=1366x768 node scripts/verify-revision.mjs
QA_RENDERER=default npm run verify:prototype
QA_RENDERER=default node scripts/verify-media.mjs
node scripts/test-launcher.mjs
node scripts/measure-full.mjs  # seul navigateur QA actif
```

Touches →/Espace/PageDown, ←/PageUp, 1–6, Home/End, F, N, M, L.
Le film final dure 90 secondes ; un retour ou rechargement affiche l’affiche sans
lecture automatique. Les commandes du lecteur ne changent pas de séquence.

Les sources classiques restent en lecture seule. Leur provenance v7 est conservée
sans changement d’empreinte. La révision locale et ses phrases exactes sont contrôlées
séparément. **Ne pas relancer l’ancien import de contenu** ; le générateur local est
`node scripts/revise-content.mjs`. Il conserve les captures existantes, utilise la
capture réelle d’envoi, puis applique les diagrammes et corrections locales.

Plan : [docs/PLAN-44.md](docs/PLAN-44.md). Handoff : [HANDOFF.md](HANDOFF.md).
Résultats et limites : [docs/REVIEW.md](docs/REVIEW.md). Licences :
[public/licenses/README.md](public/licenses/README.md).
