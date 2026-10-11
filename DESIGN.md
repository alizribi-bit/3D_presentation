# DESIGN — ZAWEDNI Story 3D (prototype, 4 scènes)

Un petit monde low-poly, clair et chaleureux : une route verte relie six lieux, un par chapitre du Sommaire.
Le monde porte le récit ; les informations académiques restent des panneaux nets, au texte exact des slides.

## Palette (identité du deck accepté)

| Rôle | Couleur |
| --- | --- |
| Fond, ciel, brume | `#f4f7f2` |
| Texte | `#10261a` · secondaire `#536459` |
| Vert ZAWEDNI | `#0d7b3c` · foncé `#083f1f` · clair `#cfe8d7` · accent `#5be38f` |
| Couverture (nuit) | `#06251a`, texte `#e8f3ec` |
| Achat local (lieu 01) | ocre `#c98a3c` · toits terre cuite |
| Zones techniques (03, 04, 05) | bleu `#2f6db3` |
| Attention | orange `#e8742c` (réservé, peu utilisé) |

Pas de nouvelle variante du logo : `logo-green.png`, `logo-white.png` et `logo-isima.png` sont ceux du deck.

## Typographie

Poppins 400–700 pour tout le texte, JetBrains Mono pour les numéros, Amiri pour la basmala.
Fontes locales (`public/fonts`), `font-display: block` : aucun texte n'apparaît dans une fonte de secours.
Les panneaux vivent sur une scène DOM de 1920×1080 mise à l'échelle de l'écran : même mise en page sur
1366×768 et sur 1920×1080.

## Matières et lumière

- Modèles CC0 (Kenney, Quaternius), recolorés vers la palette : végétation vert sauge, toits terre cuite,
  plateau crème, route claire à tirets verts. Matières mates (rugosité ≈ 0,8, pas de métal).
- Le décor statique est fusionné par matière (1 078 → 167 appels de dessin).
- Tone mapping Neutral, exposition 1,0 ; ciel hémisphérique blanc / vert ; un soleil chaud `#fff1dc` ;
  RoomEnvironment faible (0,25) pour le volume. Brume légère au loin.
- Ombres : carte d'ombre statique (calculée une fois) pour le décor, tache d'ombre douce sous chaque personnage.
- Captures réelles (piliers de la grille, mobile) affichées telles quelles, jamais recréées.

## Personnages

- **Guide** (Casual Character, Quaternius) : chemise verte ZAWEDNI. Il conduit le parcours et désigne les étapes.
- **Représentant d'entreprise** (Business Man, Quaternius) : costume bleu nuit, cravate verte. Il présente la grille.
- Taille réelle (1,78 m) mesurée sur le squelette ; marche au rythme de la distance parcourue (pas de glisse) ;
  pointage : coude tendu, bras visé vers la vraie position de la cible, index aligné, tête qui suit.
- Ils accompagnent l'explication, ne parlent pas et ne masquent jamais un texte ou une capture.

## Caméra

- Trois niveaux : **monde** (vue de la roadmap, sert de Sommaire) → **lieu** (trajet ≈ 3 s le long de la route)
  → **détail** (rapprochement ≈ 1–1,6 s vers un tableau, une boucle, un croisement).
- On revient à la vue du monde entre deux chapitres. Les trajets longs montent légèrement pour garder le repère.
- Un clic = un état. Chaque image est fonction de l'état de départ, de l'état d'arrivée et du temps :
  avant, arrière et rechargement donnent la même image. Une touche pendant un mouvement le termine d'abord.
- Les panneaux apparaissent à l'arrivée, jamais pendant le trajet. Aucun mouvement à la molette ou au défilement.
- Une boucle là où le contenu est un cycle (DevSecOps : Développement à gauche, Exploitation à droite,
  Sécurité au croisement, retour des observations en vert clair).

## Qualité

`normal` (pixel ratio ≤ 2, ombres 4096) et `léger` (ratio 1, ombres 2048), même rendu ; touche **L**,
mémorisé dans le navigateur. Mouvement réduit respecté (`prefers-reduced-motion` ou touche **M**).
