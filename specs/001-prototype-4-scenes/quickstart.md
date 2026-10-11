# Quickstart: Prototype ZAWEDNI Story 3D

```bash
cd ~/Desktop/zawedni-story-3d
npm install                 # une fois, avec réseau
npm run dev                 # développement : http://localhost:5173
npm run build && npm run preview   # version de présentation : http://localhost:4173
```

Présenter : ouvrir l'adresse dans Chrome, `F` pour le plein écran, puis clicker ou →/←.
Raccourcis : voir `specs/001-prototype-4-scenes/contracts/keyboard.md`.

Vérifier :

```bash
scripts/check-source.sh        # md5 de la source acceptée inchangés
node scripts/check-content.mjs # textes projetés = source ; mots interdits absents
node scripts/verify.mjs        # parcours, déterminisme, console, réseau externe bloqué, captures → review/
```

Mesure de fluidité : `npm run preview`, Chrome visible, ajouter `?fps` à l'URL, parcourir A0 → D3 ;
la moyenne et le 5e centile par trajet s'affichent dans la console (rien à l'écran).

Hors ligne : couper le réseau, relancer `npm run preview`, parcourir tout le prototype.
