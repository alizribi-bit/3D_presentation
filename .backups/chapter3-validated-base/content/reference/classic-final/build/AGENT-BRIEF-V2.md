> **Superseded on 09/10/2026 for the speech:** follow the « Règle du discours v4 » at the top of `../HANDOFF.md` (B1 French, complete explanations, « j'ai » / « nous »), not any older « très facile / phrases courtes / on » rule.

# Brief commun — refonte v2 des slides (06/10/2026)

Tu modifies **un seul lot** de fragments d'un deck HTML animé (deck-kit) pour une soutenance de PFE en français.
Dossier : `~/Desktop/zawedni-video-pfe/soutenance/` (appelé `S/` ci-dessous).

## À lire d'abord
1. `S/SCRIPT.md` : source unique. Pour chaque slide de ton lot : titre (colonne 3), nombre d'étapes (col. 4), visuel attendu (col. 5), discours (col. 8, `[clic]` = une étape). **Le visuel doit suivre le discours clic par clic.**
2. `S/PLAN_PRESENTATION.md` §2 (preuves), §3 (message et preuve par slide), §5–§6 (faits), §10 (matrice des exigences).
3. `S/HANDOFF.md` §5 « Design system » (canevas 1920×1080, couleurs et leur sens, nuit/clair, carte du monde, règles deck-kit).
4. deck-kit : `~/.claude/skills/deck-kit/00-agent-brief.md` (règles obligatoires), `01-runtime.md`, `04-slide-design.md`, `05-motion.md`, `08-diagrams.md` ; `14-code-slides.md` si tu touches un slide code.
5. Les fragments existants de ton lot (`S/build/<X>.sections.html` + `S/build/<X>.js`) et le script principal de `S/deck.html` (fonctions globales : `svg`, `C`, `ease`, `lerp`, `mix`, `clamp`, `buildWorld`, `paintWorld`, `shield`, `AT_RAIL_END`…). Inspire-toi des slides voisins pour garder exactement le même style.

## Règles strictes
- **Tu ne modifies que** `S/build/<X>.sections.html` et `S/build/<X>.js` de ton lot (le lot G est un nouveau couple de fichiers). **Jamais** `deck.html`, `notes.py`, `SCRIPT.md`, `merge.py`, `export.sh`, les autres lots, ni le dépôt du projet ou le rapport. Ne lance **jamais** `notes.py`, `export.sh` ni `merge.py --out deck.html`.
- `<X>.js` reste **un seul bloc `{ … }`** (pas de const au niveau global). CSS dans un `<style>` à l'intérieur de la section, sélecteurs préfixés par `#<id>` (merge les déplace dans `<head>`).
- Chaque section : `<section class="slide" id="…">` (ajoute ` night` si fond nuit). **Ne mets pas** `data-pos`, `data-transition`, `data-color` : merge les calcule depuis SCRIPT.md. Garde `data-layout="code-side"` etc. si besoin.
- Contenu : `<p class="kicker">Partie · Sujet</p>`, puis `<h2 data-fit="2">` avec **le titre exact de SCRIPT.md**, puis le visuel, puis exactement :
  ```
      <aside class="notes">
        <p></p>
      </aside>
  ```
  (notes.py remplira le titre et les notes ; garde l'indentation `    </aside>`.)
- Kickers selon les nouvelles parties : `Contexte · …`, `Architecture · …`, `Parcours d'un changement · …`, `Accès, données et secrets · …`, `Supervision et résultats · …`, `Conclusion · …`, `Réserve · Questions`.
- Supprime **entièrement** (section + `Deck.slide(...)`) les ids qui n'existent plus dans `notes.py` IDS ; merge échoue sinon. Pour renommer un id, renomme section, CSS et `Deck.slide`.
- `steps` du `Deck.slide` = nombre d'étapes de SCRIPT.md. Slides de réserve : 0 étape (tout visible au repos).
- deck-kit : tout est calculé depuis `st` dans `frame` ou déclaré par `data-step`/`data-anim` ; pas de transition CSS, `@keyframes`, `setTimeout` (exception documentée : le slide `video`).
- Lisibilité (passe d'espace blanc faite maintenant) : texte courant ≥ 28 px, étiquettes ≥ 22 px, titres de carte ≥ 34 px ; le contenu occupe environ y 300–1000 et x 150–1770 ; pas de page dense : si ça déborde, enlève des mots, pas de taille. Moins de 40 mots à l'écran par étape. Pas de mise à l'échelle par `transform` d'un bloc entier.
- Couleurs = sens fixe : vert = fonctionne/prouvé, vert clair = configuré/non testé, ambre = à faire/limite, rouge = bloqué/danger, bleu = Azure seulement.
- **Preuves** : images dans `S/assets/` (liste §2 du plan), à insérer `<img src="assets/p….jpg">` dans le cadre « navigateur » déjà utilisé par les captures existantes (voir le CSS des slides grafana/prometheus/argocd actuels), avec une légende courte **datée** (« Capture du 06/10 », « Run du 03/10 »). Recadrer en CSS (`object-fit`, `object-position`) si besoin ; jamais d'IP en grand (écrire `<adresse>.nip.io`).
- Faits : n'écris rien qui ne soit pas dans SCRIPT.md ou le plan. Pas de « sans coupure », pas de « jamais par kubectl », pas de « offres gratuites trop limitées », pas de « fondateur/CTO », pas de « /ai vers l'IA » (l'Ingress envoie `/api` et `/uploads` au backend, `/` au site ; l'IA est interne).
- Français simple, sans majuscules intégrales.

## Boucle de test (dans `S/`)
```bash
K=~/.claude/skills/deck-kit
python3 build/merge.py --only <X> --out deck-test-<X>.html      # dans S/, pas dans build/ (sinon les images assets/ cassent)
node $K/export/deck.mjs check deck-test-<X>.html                 # 0 erreur sur tes slides
node $K/export/deck.mjs still deck-test-<X>.html <n>.<step> --out /tmp/claude-1000/<X>-stills   # n = numéro du slide dans ce fichier de test
```
Le fichier de test ne contient que les 4 slides de base + ton lot ; trouve les numéros avec `grep -o 'id="[a-z0-9-]*" data-pos' deck-test-<X>.html`. **Regarde** les stills (outil Read) de chaque étape de chaque slide : débordements, chevauchements, texte trop petit, cohérence avec le discours. Corrige, recommence. À la fin, supprime `deck-test-<X>.html`.

## Compte rendu final (court)
Ids livrés et supprimés, nombre d'étapes par slide, preuves utilisées, résultat du `check` (erreurs/avertissements), tout doute factuel ou visuel restant.
