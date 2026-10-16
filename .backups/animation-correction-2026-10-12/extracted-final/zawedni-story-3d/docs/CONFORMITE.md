# Conformité à la présentation classique active

Référence lue le 12 octobre 2026 : `/home/ali/Desktop/zawedni-video-pfe/soutenance/deck.html`. Le lanceur classique utilise `deck.offline.html`, son bundle autonome. L’ordre, les titres, les clics et le discours viennent de `build/script_rows.py` ; les notes intégrées du deck ont été comparées paragraphe par paragraphe. Aucun ancien ZIP ni prompt n’a fourni les contenus actifs.

## Référence et couverture

Les compteurs calculés sont **44 slides, 70 révélations, 114 états et 113 avances**. Les 114 correspondances sont dans `CORRESPONDANCE.md` et `CORRESPONDANCE.json`, avec position, titre, texte visible, images, empreintes des diagrammes, révélations, disparitions au prochain clic et discours exact. Le snapshot courant et ses empreintes sont dans `content/reference`; la provenance ancienne reste dans `content/history`.

Les tableaux glass utilisent 106 cadres rendus de la référence actuelle, comprenant les diagrammes produits par son JavaScript. La couverture, les deux états du sommaire, les deux états du cycle DevSecOps et le lecteur vidéo gardent leur mise en scène spécifique. Les contenus de la couverture, de la roadmap et du cycle sont comparés à ceux de la référence. Les six lieux, cadrages, personnages, éclairages et moniteurs sont conservés.

## Écarts corrigés

- Le diagramme de séquence provient maintenant du rendu classique complet : quatre participants, lignes de vie, inscription et attribution, soumission et décision, puis vérification API et alternative accès autorisé/refusé. Ses trois états remplacent la simplification 3D manuelle.
- Les cinq états du parcours utilisent exactement les captures classiques. L’envoi emploie `v9-adm-attribution.png` ; l’envoi et la décision montrent l’administration seule. Les trois autres états gardent le web et le mobile. Les fichiers sont copiés sans retouche et contrôlés par SHA-256.
- Les autres cadres, notamment isolation, alerte, méthodologie, validation et bilan, ont été réextraits intégralement. Les anciennes annotations et dates publiques absentes de la référence ne sont plus réintroduites par le générateur 3D. Les dates présentes dans la référence, notamment la création de la startup et l’année universitaire, restent fidèles à celle-ci.
- Le bilan conserve la synthèse validée sous `[lire]`. Le discours du chapitre final reprend « On termine avec le bilan, les perspectives et la conclusion. » Le descriptif du sixième lieu reprend le sommaire actuel.
- L’architecture, les quatre étapes de la chaîne de livraison et le blocage Log4j affichent désormais aussi leur cadre classique complet ; les accessoires animés de ces lieux restent présents.
- Le tableau a été agrandi et son contenu tient à son format complet. L’ancien placement négatif du contenu rognait ses bords ; l’affichage actuel conserve le ratio 1920 × 1080 et les recadrages volontaires des captures.
- La vue présentateur affiche le titre et l’étape, le discours courant à 34 px avec interligne 1,65, les passages à lire dans une section distincte et les consignes silencieuses. L’ordre exact entre parole et lecture est préservé. Aperçu suivant et navigation détaillée sont repliés ; progression et minuteur sont secondaires. La taille choisie et le minuteur survivent au rechargement.
- Le lanceur imbriqué du chemin demandé redirige vers le projet 3D indépendant maintenu. La vieille copie sur 4317 ne fournit plus la présentation lancée. L’identité du build couvre ses fichiers et ses sources ; le lancement refuse un build périmé ou un serveur différent. Le mode par défaut est complet.

## Vérifications effectuées

| Contrôle | Résultat |
|---|---|
| Tests unitaires, dont conservation du discours et absence de dérive des cadres | 29/29 |
| Typage strict des modules TypeScript, dont la nouvelle vue présentateur | PASS |
| Provenance historique, assets courants, contenu et build | PASS |
| Parcours complet à 1920 × 1080 | 249/249 |
| Parcours complet à 1366 × 768 | 249/249 |
| Lecteur natif, pause, reprise, retour, rechargement et sortie | 12/12 |
| Fichiers actifs classiques et médias relus après travail | 37/37 empreintes inchangées |
| Lanceur, écran unique, deux géométries simulées, inversion et prototype explicite | PASS |
| Bundle classique réellement lancé (`deck.offline.html`) : 114 états, images, diagrammes et notes | 3/3 |
| Archive extraite, runtime, captures, notes et film sur serveur distinct | 6/6 |
| Build périmé et ancien serveur 4317 refusés | PASS |

Chaque état est atteint par de vraies touches Suivant et contrôlé avec ses notes exactes. Les 114 retours, les six raccourcis de chapitre, Home/End, le hash, les rechargements et l’ouverture tardive sont couverts. Le délai maximal observé du présentateur est de 379 ms à 1920 × 1080 et 256 ms à 1366 × 768. Aucun élément visible ne déborde du tableau après prise en compte des recadrages volontaires. Aucun appel externe, ressource locale en échec ou exception navigateur n’a été constaté dans ces deux parcours.

Le film accepté reste byte pour byte identique : 90 secondes, vidéo H.264 et une piste AAC stéréo. La lecture non muette avance dans le jury, pause/reprise fonctionnent, et la sortie arrête/rembobine. Le présentateur ne contient ni canvas, ni vidéo, ni audio. La piste contient un signal sonore (moyenne −22,1 dB, pic −6,6 dB). Ceci vérifie le fichier et le comportement du lecteur ; l’écoute des haut-parleurs physiques reste à faire.

Le lancement réel depuis `~/Desktop/zawedni-video-pfe/zawedni-story-3d` avec `./present.sh` a ouvert le build de `/home/ali/Desktop/zawedni-story-3d/dist` sur `http://127.0.0.1:4318`. L’environnement indique un écran unique ou des écrans en miroir. Le placement sur deux écrans physiques n’est donc pas validé.

Les premières captures headless ont rencontré un blocage de rendu sous isolation. Les rapports ci-dessus viennent des exécutions complètes terminées avec l’accès graphique local. Les vérifications attendent la révélation des panneaux avant comparaison et mesurent les zones visibles des captures recadrées.

## Preuves et limites

`review/classic/index.html` regroupe six paires jury/présentateur au même état et les images aux deux résolutions. L’enregistrement côte à côte de 56,3 secondes montre les clics normaux, des commandes depuis les notes, un retour et la lecture du bilan corrigé. Cet extrait de contrôle est sans audio ; le film livré conserve sa piste audio.

Aucun écart de contenu, de révélation, d’image ou de discours ne reste détecté dans le parcours vérifié. Les différences visuelles assumées sont la mise en scène 3D, les surfaces glass, la couverture animée, le sommaire spatial, le cycle en volume et le lecteur natif. Les tableaux affichent les états stabilisés de chaque clic ; le rythme des petites animations internes du classique est remplacé par les transitions et animations du monde 3D. Les petites légendes techniques gardent la densité de la référence classique : une vérification à la distance réelle du jury reste utile.

Restent à réaliser physiquement : deux écrans séparés, le clicker et les haut-parleurs du projecteur, ainsi qu’une répétition orale chronométrée. L’estimation complète est de 24 minutes à 125 mots/minute ; le discours n’a pas été raccourci. Le JavaScript historique conserve `checkJs: false`; les nouveaux modules présentateur sont en TypeScript strict.

## Archive

`release/zawedni-story-3d-classique-validee.zip` contient le build prêt, les sources 3D, la référence capturée, les médias locaux et les preuves. L’extraction dans `/tmp/zs3d-classic-extracted` vérifie chaque empreinte du manifeste et l’identité du build. Le serveur distinct sur 4319 charge les captures acceptées, synchronise le présentateur, atteint la conclusion et charge le film local de 90 secondes. Les six contrôles Chrome passent. Une simulation de source modifiée est refusée par le garde de build ; la restauration exacte est ensuite acceptée. Le serveur ancien sur 4317 a également été refusé.
