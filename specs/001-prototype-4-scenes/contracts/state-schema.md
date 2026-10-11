# Contract: Schéma d'un état

```js
// src/content/states.js
export const STATES = [
  { id: 'A0', scene: 'A', source: { seq: 'couverture', step: 0 }, added: false,
    shot: 'cover', panels: ['cover-basmala'], move: 'cut',
    actors: { guide: { at: 0.0, clip: 'idle', face: 'camera' }, rep: { at: 'B-stall', clip: 'idle' } },
    notes: { said: 'Bonjour à toutes et à tous.', read: [] } },
  // … A1 → D3, voir spec.md « Parcours d'états »
];
```

Invariants vérifiés au démarrage (erreur console bloquante en dev) :

- ids uniques, 11 états, ordre A0 … D3 ;
- chaque `shot`, panneau et lieu référencé existe ;
- chaque `notes.read[i]` figure mot pour mot dans un panneau visible de l'état ;
- `added: true` ⇒ `notes.added` présent ou `said` vide.
