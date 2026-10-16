# Plan de la soutenance ZAWEDNI (v5, 09/10/2026)

Source : `../INSTRUCTIONS_CLAUDE_CODE_ZAWEDNI.md` (proposition à 41 slides, perfectionnée). Discours mot pour mot : `build/script_rows.py` → `SCRIPT.md` → `DISCOURS.md` et notes du deck. Questions du jury : `FICHE_PRIVEE_QUESTIONS.md`, jamais projetée. Faits : rapport final `~/Desktop/New Project/main.pdf` (09/10) ; état de la production : sections finales de `~/Desktop/zawedniPFEproject/BILAN_CORRECTIONS_ZAWEDNI.md` (08/10 soir et 09/10).

## 0. Fil et durée

Question de départ : comment relier l'achat local à une démarche RSE structurée et suivie ? ZAWEDNI y répond par une plateforme web et mobile ; Ali montre comment il l'a conçue, développée, livrée et supervisée. Deux contributions visibles : le développement de la plateforme, puis l'infrastructure et la chaîne DevSecOps.

| Élément | Durée estimée |
|---|---|
| Parole (2 187 mots comptés par l'animatic deck-kit, 115 mots/min, pauses de clic comprises) | ≈ 19:01 |
| Vidéo | retirée du déroulé (voir HANDOFF) |
| **Total** | **≈ 19:05 à 19:25** avec la manipulation : estimation, pas une répétition chronométrée |

À 125 mots/min (rythme naturel), la parole tombe vers 17:30. Chronométrer une vraie répétition avec `./presenter.sh`.

## 1. Déroulé (41 slides, 58 clics)

Transitions : `camera` dans une partie, `dip` à l'ouverture d'une partie (slides 3, 8, 14, 22, 32, 38 ; la partie 1 s'ouvre directement sur la startup). La couverture et le sommaire sont deux cas particuliers : **un seul clic** lance une séquence automatique (≈ 3 s et ≈ 2,5 s). Ailleurs, chaque clic correspond à un `[clic]` du discours.

| # | Slide | Clics | Mise en scène |
|---|---|---|---|
| 1 | Couverture | 1 | étape 0 = la formule arabe seule ; un clic lance une séquence automatique d'environ 2,8 s : logos, MEMOIRE DE FIN D'ETUDES, titre, Ali Zribi et la formation, puis le bloc « Les membres du jury » (présidente, rapporteure, encadrantes) |
| 2 | Sommaire | 1 | étape 0 = « Sommaire » seul ; un clic fait apparaître les six parties l'une après l'autre (≈ 2,5 s), numéro, titre et une ligne d'explication, lecture de gauche à droite |
| 3 | La startup ZAWEDNI | 1 | à gauche l'identité (startup tunisienne, plateforme B2B, pépinière de Mahdia) et l'idée portée à deux ; au clic, à droite la mission RSE et ma contribution (développement, puis infrastructure et livraison) |
| 4 | Le problème à résoudre | 1 | une démarche RSE difficile à suivre ; au clic, des achats encore dispersés, puis la question centrale en bandeau vert |
| 5 | La réponse de ZAWEDNI | 1 | Évaluer (grille RSE, validation par l'administrateur) → Acheter local ; au clic, Progresser (recommandations, guide RSE, rapport ESG) et la flèche de retour vers l'évaluation |
| 6 | Les acteurs et leurs responsabilités | 1 | acheteur et fournisseur (deux rôles d'une même entreprise, reliés) ; au clic, l'administrateur ZAWEDNI et la règle « une entreprise n'approuve pas sa propre grille, les droits sont contrôlés par l'API » |
| 7 | Le modèle économique envisagé | 1 | clients visés et valeur proposée ; au clic, revenus prévus (abonnements, publicité, premium) et la conséquence technique, qui annonce la suite |
| 8 | Développement de la plateforme | 0 | 02, chapitre 2 allumé dans le sommaire |
| 9 | Langages et outils de développement | 0 | cinq rôles (web, mobile, API, service spécialisé, données) avec langage, framework et raison ; Groq à part, avec son périmètre limité au texte |
| 10 | Architecture de la plateforme | 2 | site client, administration, mobile → API Spring Boot (REST + JWT) ; puis PostgreSQL (SQL, JPA) ; puis service d'IA FastAPI (REST interne + clé) et Groq |
| 11 | Conception du parcours de validation | 1 | Fournisseur, API Spring Boot, PostgreSQL, Administrateur ; soumission puis approbation enregistrées ; au clic, un accès ultérieur au marché, GridCheckFilter interroge la base, cadre alt : approuvée → autorisé, sinon 403 GRID_REQUIRED |
| 12 | Le parcours réalisé sur le web | 3 | rail de quatre étapes à gauche ; à droite une seule capture à la fois, celle de l'étape dite : grille RSE (fournisseur), revue (administrateur), certificat avec QR, marketplace (acheteur) ; version locale du 07/10, données de démonstration |
| 13 | L'application mobile | 1 | quatre écrans Flutter ; d'abord accueil et score, grille RSE ; au clic, suivi de la revue et marketplace, puis la ligne « APK Android distribué par Azure Blob » |
| 14 | Architecture et démarche DevSecOps | 0 | 03, chapitre 3 allumé |
| 15 | Outils d'infrastructure | 0 | Docker (image) → ACR (registre) → AKS (exécution), avec Terraform en dessous qui décrit les ressources Azure ; une phrase de raison sous chaque outil |
| 16 | Livraison, sécurité et supervision | 0 | automatisation, déploiement GitOps, contrôles, secrets, supervision ; chaque famille avec ses outils et son rôle en une ligne |
| 17 | Le cycle DevSecOps | 1 | Développement à gauche (planifier, coder, construire et tester), Exploitation à droite (livrer et déployer, exploiter, superviser), Sécurité au croisement ; un point parcourt la boucle ; au clic, le retour « observer → corriger » s'allume |
| 18 | Architecture de déploiement | 3 | utilisateurs → Ingress NGINX → frontend et API ; puis IA et PostgreSQL internes ; puis GitHub, ArgoCD, ACR ; puis staging et production dans le même cluster à deux nœuds, namespaces, secrets et données distincts |
| 19 | Routage des requêtes | 2 | adresse publique → Ingress NGINX → hôtes (client, administration) → chemins (/api et /uploads → API, / → site) ; service IA interne ; petite capture admin staging (06/10) |
| 20 | Isolation réseau | 1 | flux autorisés en vert, flux refusés barrés (client → base, vers internet) ; au clic, « Calico · 10 tests sur 11 · 03/10 » et la case orange « DNS : à clarifier » |
| 21 | Secrets et sauvegardes | 3 | secrets GitHub → pipeline (masqués) ; Sealed Secret chiffré dans Git → déchiffré dans le cluster → variable → capture admin connecté (06/10) ; puis bandeau données : volumes, sauvegarde quotidienne, restauration testée, copie externe manuelle |
| 22 | Chaîne CI/CD et déploiement | 0 | 04, chapitre 4 allumé |
| 23 | Notre chaîne de livraison | 3 | le monde de la chaîne sur fond nuit ; zones poste, GitHub Actions, Azure s'allument une à une ; le point vert traverse |
| 24 | Organisation des dix pipelines | 2 | zone 2 allumée ; cinq pipelines de composant (backend allumé) avec leur filtre de chemins, puis cinq contrôles transversaux |
| 25 | Contrôler puis publier | 3 | pull request (contrôles, rien n'est publié) ; push sur staging après fusion (image ACR, manifeste) avec la capture PR #19 ; puis mobile (APK dans Azure Blob, pas de pod) et main (production déployée par GitOps, parcours principaux vérifiés) |
| 26 | Tests des règles métier | 1 | API (JUnit), site client (Vitest), IA (pytest), mobile (flutter test), avec des exemples de règles testées ; au clic, « un test en échec arrête le pipeline » et le rappel des comportements vérifiés |
| 27 | Les analyses de sécurité | 1 | secrets, code, bibliothèques, images, infrastructure · outil · où il tourne ; au clic, la note « chaque pipeline lance seulement les analyses de son périmètre » |
| 28 | Blocage et protection de la fusion | 2 | arrête le pipeline (Gitleaks, Dependency-Check CVSS ≥ 9, Trivy HIGH/CRITICAL corrigeable, SonarCloud sur PR et main) ; au clic, signale seulement (Semgrep, Checkov) ; au clic, protège la fusion (protection de branche absente, règle d'équipe) |
| 29 | Un contrôle bloquant mis à l'épreuve | 2 | étape 0 = pipeline backend normal, la dépendance log4j 2.14.1 ajoutée exprès ; au clic, Dependency-Check rouge, les étapes suivantes grisées ; au clic, dépendance retirée, tout redevient vert |
| 30 | Déploiement GitOps avec ArgoCD | 2 | Git (état attendu) ; au clic, ArgoCD compare et applique ; au clic, la capture ArgoCD du 06/10, applications Synced et Healthy, avec la portée de ces états |
| 31 | Traçabilité d'un changement | 4 | quatre maillons révélés un à un, l'identifiant 62c42e1 surligné : run vert (03/10) → tag ACR (03/10) → commit du bot dans le manifeste (03/10) → pod staging (06/10) |
| 32 | Supervision et validation | 0 | 05, chapitre 5 allumé |
| 33 | Métriques, journaux et alertes | 3 | services → Prometheus → Grafana (métriques) ; puis services → Alloy → Loki → Grafana (journaux) ; puis Prometheus → Alertmanager → e-mail |
| 34 | Métriques des services | 1 | cibles Prometheus backend et IA UP (06/10) ; au clic, Grafana CPU et mémoire des pods (06/10) |
| 35 | Journaux centralisés | 1 | chaîne action → backend → Alloy → Loki ; au clic, Grafana et la capture du tableau de bord « ZAWEDNI — Journaux » (07/10, adresse de test masquée), puis l'accès limité à Loki |
| 36 | Validation d'une alerte complète | 2 | erreurs 500 → en attente → déclenchée ; au clic, e-mail FIRING → résolue → e-mail RESOLVED et les captures Prometheus et Gmail ; au clic, la portée de l'essai |
| 37 | Résultats de validation | 1 | staging et données ; au clic, production (parcours, guide RSE, supervision) et mobile |
| 38 | Bilan et perspectives | 0 | 06, chapitre 6 allumé |
| 39 | Bilan du mémoire | 2 | au clic, 01 développement (web client et administration, mobile, API, données et IA) ; au clic, 02 livraison et exploitation (infrastructure en code, contrôles et GitOps, supervision et sauvegardes) ; en bas, staging validé, production déployée avec le parcours fournisseur/acheteur et le guide RSE vérifiés |
| 40 | Perspectives | 3 | court terme, consolider les mécanismes ; moyen terme, renforcer l'exploitation ; plus long terme, améliorer la disponibilité |
| 41 | Conclusion | 1 | rappel besoin → plateforme → chaîne ; le point vert fait tout le chemin jusqu'au cluster, chaque zone s'allume ; puis « Merci pour votre attention » |

## 2. Règle du discours (v4)

Français B1 naturel : mots courants, phrases directes, transitions claires, vocabulaire technique expliqué. « Court » veut dire sans répétition, **pas télégraphique** : une slide importante dit ce que le jury voit, comment les éléments sont liés, pourquoi ce choix et ce que le résultat prouve. Un intercalaire se limite à une transition. « J'ai » pour le travail technique d'Ali, « nous » pour l'idée et le projet entrepreneurial. Jamais « dans le rapport » à l'oral. Le texte projeté reste synthétique ; les détails pour les questions restent dans la fiche privée.
