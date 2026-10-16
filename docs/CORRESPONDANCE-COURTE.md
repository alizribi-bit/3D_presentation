# Correspondance courte — classique finale → 3D

Les mêmes 35 slides et 51 révélations donnent 86 états 3D. Les IDs restent stables ; les numéros de chapitres sont recalculés. Aucun état ajouté. La zone supprimée `02` n’est pas le nouveau chapitre 2, qui utilise la zone stable `03`.

| Slide | Identifiant et titre | États 3D | Zone / chapitre | Cadrage |
|---|---|---|---|---|
| 1 | couverture · Conception et déploiement d'une plateforme web et mobile pour l'achat local intégrant une approche DevSecOps | couverture-0 → couverture-1 | monde / ouverture | overview |
| 2 | sommaire · Sommaire | sommaire-0 → sommaire-1 | monde / ouverture | overview |
| 3 | ch1 · Contexte et objectifs | ch1-0 → ch1-0 | 01 / 1 | chapter01 |
| 4 | startup · La startup ZAWEDNI | startup-0 → startup-1 | 01 / 1 | market |
| 5 | probleme · Du besoin à la solution ZAWEDNI | probleme-0 → probleme-1 | 01 / 1 | market |
| 6 | modele · Business Model Canvas | modele-0 → modele-1 | 01 / 1 | market |
| 7 | problematique · Enjeux et besoins du projet | problematique-0 → problematique-1 | 01 / 1 | market |
| 8 | methodologie · Organisation du travail | methodologie-0 → methodologie-1 | 01 / 1 | market |
| 9 | ch3 · Architecture et démarche DevSecOps | ch3-0 → ch3-0 | 03 / 2 | chapter03 |
| 10 | outils-infra · Outils d'infrastructure | outils-infra-0 → outils-infra-0 | 03 / 2 | cloud |
| 11 | outils-livraison · Les outils de la chaîne DevSecOps | outils-livraison-0 → outils-livraison-0 | 03 / 2 | cloud |
| 12 | devsecops · Le cycle DevSecOps | devsecops-0 → devsecops-1 | 03 / 2 | crossing |
| 13 | architecture · Architecture de déploiement | architecture-0 → architecture-3 | 03 / 2 | architecture |
| 14 | routage · Le chemin d'une requête | routage-0 → routage-2 | 03 / 2 | cloud |
| 15 | isolation · Isolation réseau | isolation-0 → isolation-1 | 03 / 2 | cloud |
| 16 | secrets · Secrets | secrets-0 → secrets-2 | 03 / 2 | cloud |
| 17 | ch4 · Chaîne CI/CD et déploiement | ch4-0 → ch4-0 | 04 / 3 | chapter04 |
| 18 | chaine · Notre chaîne de livraison | chaine-0 → chaine-3 | 04 / 3 | delivery → deliveryReveal |
| 19 | dix-pipelines · Organisation des dix pipelines | dix-pipelines-0 → dix-pipelines-2 | 04 / 3 | delivery |
| 20 | tests · Que vérifient les tests ? | tests-0 → tests-1 | 04 / 3 | delivery |
| 21 | analyses · Que recherchent les analyses de sécurité ? | analyses-0 → analyses-6 | 04 / 3 | delivery |
| 22 | blocage · Quels contrôles arrêtent la livraison ? | blocage-0 → blocage-2 | 04 / 3 | delivery |
| 23 | log4j · Un blocage vérifié en pratique | log4j-0 → log4j-2 | 04 / 3 | delivery → deliveryReveal |
| 24 | argocd · Déploiement GitOps avec ArgoCD | argocd-0 → argocd-2 | 04 / 3 | delivery |
| 25 | tracabilite · Traçabilité d'une version | tracabilite-0 → tracabilite-4 | 04 / 3 | delivery |
| 26 | ch5 · Supervision et validation | ch5-0 → ch5-0 | 05 / 4 | chapter05 |
| 27 | supervision · Métriques, journaux et alertes | supervision-0 → supervision-3 | 05 / 4 | monitoring |
| 28 | metriques · Métriques des services | metriques-0 → metriques-1 | 05 / 4 | monitoring |
| 29 | journaux · Journaux centralisés | journaux-0 → journaux-1 | 05 / 4 | monitoring |
| 30 | validation · Résultats de validation | validation-0 → validation-1 | 05 / 4 | monitoring |
| 31 | ch6 · Bilan, perspectives et conclusion | ch6-0 → ch6-0 | 06 / 5 | chapter06 |
| 32 | bilan · Bilan du mémoire | bilan-0 → bilan-2 | 06 / 5 | belvedere |
| 33 | limites · Perspectives | limites-0 → limites-3 | 06 / 5 | belvedere |
| 34 | video · Le parcours d'une version, du code au suivi | video-0 → video-1 | 06 / 5 | theater |
| 35 | retour · Conclusion | retour-0 → retour-1 | 06 / 5 | belvedere → overview |

BMC : `modele-0` montre l’image complète ; `modele-1` révèle simultanément clients et valeur. Vidéo : `video-0` introduit le film en slide 34 ; `video-1` lance la lecture. `retour-0` reprend après le film, `retour-1` ouvre le cadrage sur le monde.

Discours exact et repères de clic : `SCRIPT-ACTUEL.md`. Le JSON détaillé `CORRESPONDANCE.json` donne les textes, images et notes par état.

`deliveryReveal` réserve le haut au schéma et le bas au convoyeur, sur cinq états seulement : `chaine-1..3` et `log4j-1..2`. Le cadrage reste fixe entre leurs étapes et revient à `delivery` à la slide suivante.
