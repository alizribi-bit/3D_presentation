# Livraison ZAWEDNI_3D_20MIN

Source 3D réellement lancée : `/home/ali/Desktop/zawedni-story-3d`. Le lanceur historique de `zawedni-video-pfe/zawedni-story-3d` délègue à ce dossier. La copie complète conserve les modifications locales et son historique Git ; aucun retour Git n’a été effectué.

Source du contenu : `/home/ali/Desktop/zawedni-video-pfe/ZAWEDNI_CLASSIQUE_20MIN`, état final local de 35 slides. L’archive POUR_IA de 28 slides n’est pas utilisée. Le modèle de discours est `build/content_20min.py`, vérifié contre les notes intégrées du deck exécuté avant export. Les mêmes fichiers et assets sont figés dans `content/reference/classic-final/` pour rendre la copie autonome.

Avant modification : `docs/PLAN-ADAPTATION-20MIN.md`. Correspondance finale : `docs/CORRESPONDANCE-COURTE.md`, `docs/CORRESPONDANCE.json`. Notes actives : `docs/SCRIPT-ACTUEL.md`, générées depuis le même parcours typé que le présentateur. 86 états, aucune avance supplémentaire.

Zones : suppression du développement, identifiant stable `02` ; conservation de l’architecture, identifiant stable `03`, nouveau chapitre éditorial 2. Les ouvertures `ch1,ch3,ch4,ch5,ch6` suivent les cinq chapitres. Les anciennes scènes non retenues et leurs exports servis sont retirés. Le BMC garde deux états ; aucun focus revenu. Caméra fixe dans chaque construction locale, sauf le retour final au monde.

L’animation corrigée actuelle de l’original est préservée : navigation interruptible depuis la pose affichée, fondu réservé aux panneaux gênant un vrai déplacement, marche terminale à vitesse bornée. L’adaptation ajoute la comparaison des révélations SVG et des captures pour animer leurs seuls éléments nouveaux. Aucun schéma converti en image.

Lancement : `/home/ali/Desktop/ZAWEDNI_3D_20MIN/present.sh`. Construction dans cette copie : `npm run build`. Serveur 4320 et profil Chrome propres. Voir `README.md`, `docs/VERIFICATION-20MIN.md` et `docs/DUREE-20MIN.md` pour les résultats, les hypothèses et les limites matérielles.
# Dernier ajustement : chapitre 3

Disposition confirmée : slide en haut, convoyeur 3D en bas pour `chaine-1..3` et `log4j-1..2`. Retour au grand tableau sur la slide suivante. Le discours, les 86 états et les 85 avances restent identiques à la base acceptée sauvegardée dans `.backups/chapter3-validated-base/`. Les 81 autres états sont identiques à cette base.

Build actuel : `30fd6ccf027f4abe`. 50 tests, 229 contrôles ciblés aux deux résolutions, 192 contrôles du parcours complet et 14 contrôles vidéo réussis. Voir `docs/VERIFICATION-CHAPITRE3.md` et `docs/PLAN-CHAPITRE3.md`. Le rapport de la livraison précédente ci-dessous décrit la base avant cet ajustement.

# Polissage des animations des slides

Dernier ajustement : entrées locales douces, décalage plafonné à 96 ms, mouvement HTML de 8 px et aucun déplacement des coordonnées SVG. Les cadres, la caméra, le monde et l’itinéraire du chapitre 3 restent identiques. Les 86 états et 85 avances sont conservés. Voir `docs/ANIMATIONS-SLIDES.md` et `review/slide-polish/`. Base précédente sauvegardée dans `.backups/slide-polish-accepted-base/`.

# Dernière correction : lignes du chapitre 3

Les changements des SVG de `chaine` et `log4j` sont désormais animés : trait progressif d’une seconde, repères synchronisés, coude conservé, arrêt puis reprise Log4j, compaction du schéma lissée. Les effets sont natifs et ne réécrivent aucun attribut canonique. Disposition haut/bas, caméra, monde, notes, contenu, 86 états et 85 avances conservés. Voir `docs/LIGNES-CHAPITRE3.md` et `review/chapter3-lines/`. Base précédente : `.backups/chapter3-line-base/`.



## Discours synchronisé depuis la classique actuelle

Seul le discours a été actualisé depuis `/home/ali/Desktop/zawedni-video-pfe/ZAWEDNI_CLASSIQUE_20MIN/build/content_20min.py`. Les 35 slides et 86 états ont été comparés par ID et clic ; quatre passages différaient encore : ouverture, outils d’infrastructure, tests à l’entrée et au clic. Les autres passages restent exacts. Le texte est synchronisé dans les notes natives et `docs/SCRIPT-ACTUEL.md`.

Les frames, captures, caméra, parcours, animations, film et clics 3D sont inchangés. La référence visuelle figée `content/reference/classic-final/` est préservée. Le discours actuel a son instantané indépendant `content/reference/speech-content_20min.py` et son empreinte `speechSource` dans le manifeste. `sync:classic` reste une réimportation complète de l’ancienne référence figée, pas une commande de mise à jour du seul discours.

Build reconstruit ; 55 tests TypeScript et 2 tests serveur réussis. Durée estimée du script classique actuellement lu : 19:06 à 110 mots/min, film et pauses inclus, pas une répétition chronométrée. Vérification dans `review/speech-sync/`.
