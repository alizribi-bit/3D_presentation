# ZAWEDNI Story 3D

Présentation de soutenance guidée dans un monde 3D continu : achat local, atelier de la plateforme,
zone DevSecOps, livraison, supervision, bilan. Les 41 séquences et le discours du deck accepté
sont conservés. Les 65 révélations internes et les entrées de séquence donnent 106 états et
105 pressions « suivant ». Le prototype initial reste disponible avec `?prototype`.

## Préparer et présenter

```bash
npm ci
npm run build
./present.sh
./present.sh --swap
./present.sh --prototype
```

Node 20.20 ou ultérieur pour les outils ; Python 3 et Google Chrome pour le lancement et la QA.
Lanceur hors ligne : jury en plein écran sur le projecteur, notes sur l'ordinateur.
Touches → / Espace / PageDown, ← / PageUp ; 1–6 : chapitres ; Home / End ; F : plein écran ;
N : notes ; M : mouvement réduit ; L : qualité légère. Les commandes natives de la vidéo restent
utilisables ; les touches reprennent le parcours après usage de la souris.

## Développer et vérifier

```bash
npm run dev
npm test
npm run typecheck
npm run check
npm run build
# Le build doit être servi sur 127.0.0.1:4317 : present.sh ou le serveur Python ci-dessous.
python3 -m http.server 4317 --bind 127.0.0.1 --directory dist
npm run verify
npm run verify:prototype
node scripts/measure-full.mjs
```

`npm run check` contrôle les empreintes de la source, chaque segment du discours, les 106 frames
canoniques et les copies des assets. `npm run verify` exerce réellement Chrome : navigation complète,
notes synchronisées, retours/rechargements, commandes vidéo, console et requêtes hors machine.
`npm run import:content` régénère les preuves depuis le deck immuable (lecture seule) : ne pas lancer
ceci contre un ancien deck ou un autre film. Les preuves exportées sont du DOM/SVG/image local,
sans scripts de l'ancien deck. Le navigateur livré ne dépend pas du dossier source.

Architecture : `src/story/` porte le modèle typé, le parcours et les preuves ; `src/nav/` le pilotage ;
`src/characters/path.ts` les trajets ; `src/world/story.ts` les lieux et objets narratifs ;
`src/media/` le lecteur et son cycle de vie. Plan : `specs/002-full-presentation/`.
Voir `AGENTS.md`, `HANDOFF.md`, `PRESENTER.md` et `content/source/assets-manifest.json`.
