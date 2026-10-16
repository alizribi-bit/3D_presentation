# Plan de la soutenance ZAWEDNI (v7, 10/10/2026)

Source : les corrections ciblées d'Ali du 10/10 au soir (v7 : BMC, parcours, outils, isolation, métriques, alerte, retour de la vidéo) sur la base de la consigne de discours d'Ali du 10/10 (« reprendre le discours de ZAWEDNI, avec les supports nécessaires à l'oral »), qui prime sur `../INSTRUCTIONS_CLAUDE_CODE_ZAWEDNI.md` pour le discours. Discours mot pour mot : `build/script_rows.py` → `SCRIPT.md` → `DISCOURS.md` et notes du deck. Questions du jury : `FICHE_PRIVEE_QUESTIONS.md`, jamais projetée. Faits : rapport final `~/Desktop/New Project/main.pdf` ; état de la production : sections finales de `~/Desktop/zawedniPFEproject/BILAN_CORRECTIONS_ZAWEDNI.md`.

## 0. Fil et durée

Problème : des actions RSE parfois ponctuelles, sans stratégie claire ni suivi. La plateforme ZAWEDNI relie l'achat local à une grille d'évaluation, à une validation, au marché local et au suivi des résultats. La démarche DevSecOps contrôle, déploie et supervise ses versions, en staging comme en production.

| Élément | Durée estimée |
|---|---|
| Parole : 2 125 mots dits ou lus à l'écran (dont 298 lus sur les slides), 65 clics | ≈ 18:29 à 115 mots/min |
| Vidéo (slide 40, film corrigé le 10/10) | 1:30 |
| **Total** | **≈ 20:00** : estimation, pas une répétition chronométrée |

Chronométrer une vraie répétition avec `./presenter.sh`.

## 1. Déroulé (41 slides, 65 clics)

Transitions : `camera` dans une partie, `dip` à l'ouverture d'une partie (slides 3, 8, 13, 21, 31, 37). La vidéo (slide 40) est placée après les perspectives, juste avant la conclusion : un clic la lance. La couverture et le sommaire : **un seul clic** lance une séquence automatique (≈ 3 s et ≈ 2,5 s). Ailleurs, un clic = un `[clic]` du discours. Les anciennes slides 12 (parcours web) et 13 (mobile) forment la slide 12 « Un même parcours sur le web et le mobile ».

| # | Slide | Clics | Mise en scène |
|---|---|---|---|
| 1 | Conception et déploiement d'une plateforme web et mobile pour l'achat local intégrant une approche DevSecOps | 1 | étape 0 = la formule arabe seule ; un clic lance une séquence automatique d'environ 2,8 s : logos, MEMOIRE DE FIN D'ETUDES, titre, Ali Zribi et la formation, puis le bloc « Les membres du jury » (présidente, rapporteure, encadrantes) |
| 2 | Sommaire | 1 | étape 0 = « Sommaire » seul ; un clic fait apparaître les six parties l'une après l'autre (≈ 2,5 s), numéro, titre et une ligne d'explication |
| 3 | La startup ZAWEDNI | 1 | à gauche l'identité (startup tunisienne, fondateurs, lieu « Pépinière d'entreprises de Mahdia, Tunisie ») ; au clic, à droite le service (achat local et RSE : évaluation, achat local, guide, suivi) et le bloc « Le projet ZAWEDNI » (plateforme web et mobile, infrastructure de déploiement, contrôles de sécurité et supervision) |
| 4 | Le problème à résoudre | 1 | étape 0 = trois numéros 01 02 03 ; au clic, les trois constats apparaissent en grand, l'un après l'autre : Ali les lit |
| 5 | La réponse de ZAWEDNI | 1 | quatre cartes reliées, la grille d'évaluation en tête et mise en valeur (valeur ajoutée), puis validation, marché local, suivi, avec une flèche de retour vers la grille ; étape 0 = les titres seuls ; au clic, les quatre phrases : Ali les lit |
| 6 | Les acteurs de la plateforme | 1 | bloc Entreprises (repère acheteur · fournisseur, fonctions communes) ; au clic, bloc Administrateur : Ali lit les deux listes |
| 7 | Business Model Canvas | 3 | le BMC réel de l'annexe B en entier à gauche ; à droite, les trois parties choisies ; chaque clic entoure une partie (impulsion discrète puis contour fixe), atténue les autres et l'agrandit à droite : segments de clientèle, propositions de valeur (avec, à côté, une carte « Complément » sur la grille d'évaluation, absente de l'annexe), sources de revenus |
| 8 | Développement de la plateforme | 0 | 02, chapitre 2 allumé dans le sommaire |
| 9 | Langages et outils de développement | 0 | cinq rôles (web, mobile, API, service spécialisé, données) avec langage, framework et raison ; Groq à part, avec son périmètre limité au texte |
| 10 | Architecture de la plateforme | 2 | site client, administration, mobile → API Spring Boot (REST + JWT) ; puis PostgreSQL (SQL, JPA) ; puis service d'IA FastAPI (REST interne + clé) et Groq |
| 11 | De l'évaluation à l'accès au marché | 1 | UML sequence: Fournisseur, API Spring Boot, PostgreSQL, Administrateur ; soumission puis approbation enregistrées ; au clic, un accès ultérieur au marché, GridCheckFilter interroge la base, cadre alt : APPROUVÉE → ACCÈS AUTORISÉ, NON APPROUVÉE → ACCÈS REFUSÉ (403 en petit) |
| 12 | Un même parcours sur le web et le mobile | 3 | à gauche une capture web, à droite un écran mobile, sur la même étape ; chaque clic change les deux : grille d'évaluation (piliers web, question mobile) → examen (espace d'administration web seul, agrandi et centré, repère « Examen de la grille par l'administrateur », pas de téléphone) → résultats (suivi de la revue, certification accordée, web et mobile) → marché local (web et mobile) ; rail des quatre étapes à droite |
| 13 | Architecture et démarche DevSecOps | 0 | 03, chapitre 3 allumé |
| 14 | Outils d'infrastructure | 0 | Docker (image) → ACR (registre) → AKS (exécution), avec Terraform en dessous qui décrit les ressources Azure ; une phrase de raison sous chaque outil |
| 15 | Les outils de la chaîne DevSecOps | 0 | automatisation, déploiement GitOps, contrôles (« Analyses de sécurité », détaillées outil par outil en slide 26), secrets, supervision ; chaque famille avec ses outils et son rôle en une ligne |
| 16 | Le cycle DevSecOps | 1 | Développement à gauche (planifier, coder, construire et tester), Exploitation à droite (livrer et déployer, exploiter, superviser), Sécurité au croisement ; un point parcourt la boucle ; au clic, le retour « observer → corriger » s'allume |
| 17 | Architecture de déploiement | 3 | utilisateurs → Ingress NGINX → frontend et API (trafic utilisateur en vert) ; puis IA et PostgreSQL internes ; puis GitHub, ArgoCD, ACR (déploiement en orange) ; au dernier clic, l'encadré lu à l'écran : staging et production dans un même cluster à deux nœuds |
| 18 | Le chemin d'une requête | 2 | une adresse d'exemple en haut (nom du site, puis chemin) ; étape 0 = adresse publique → Ingress NGINX ; au clic 1, le nom du site est souligné et les deux hôtes apparaissent ; au clic 2, le chemin est souligné et les flèches / → site, /api et /uploads → backend apparaissent ; service IA interne |
| 19 | Isolation réseau | 1 | flux autorisés en vert, flux refusés barrés (client → base, vers internet) ; au clic, un encadré sur le rôle des NetworkPolicies et de Calico (aucun résultat de test affiché) |
| 20 | Secrets et sauvegardes | 3 | secrets GitHub → pipeline (masqués) ; Sealed Secret chiffré dans Git → déchiffré dans le cluster → variable → capture admin connecté (06/10) ; puis bandeau données : volumes, sauvegarde quotidienne, restauration isolée, copie externe dans Azure Blob |
| 21 | Chaîne CI/CD et déploiement | 0 | 04, chapitre 4 allumé |
| 22 | Notre chaîne de livraison | 3 | le monde de la chaîne sur fond nuit ; zones poste, GitHub Actions, Azure s'allument une à une ; le point vert traverse |
| 23 | Organisation des dix pipelines | 2 | zone 2 allumée ; cinq pipelines de composant (backend allumé) avec leur filtre de chemins, puis cinq contrôles transversaux |
| 24 | Vérifier avant de publier | 3 | pull request (contrôles, rien n'est publié) ; push sur staging après fusion (image ACR, manifeste) avec la capture PR #19 ; puis mobile (APK dans Azure Blob, pas de pod) et main (production) |
| 25 | Que vérifient les tests ? | 1 | comportement attendu (l'entreprise A tente de modifier un employé de B → refus, données inchangées) → résultat du test (comparaison) → effet sur la livraison ; au clic : « Résultat conforme : le pipeline continue » / « Test en échec : la publication s'arrête » ; en petit : EmployeeServiceOwnershipTest et les frameworks par composant |
| 26 | Que recherchent les analyses de sécurité ? | 6 | six outils dans un tableau ; chaque clic entoure une ligne et affiche à droite une seule carte lisible avec son rôle : Gitleaks, Semgrep, SonarCloud, Dependency-Check, Trivy, Checkov ; au dernier clic, le bandeau sur les périmètres |
| 27 | Quels contrôles arrêtent la livraison ? | 2 | arrête le pipeline (Gitleaks, Dependency-Check CVSS ≥ 9, Trivy HIGH/CRITICAL corrigeable, SonarCloud sur PR et main) ; au clic, signale seulement (Semgrep, Checkov) ; au clic, protège la fusion (protection de branche : règle GitHub distincte, prévue dans les perspectives) |
| 28 | Un blocage vérifié en pratique | 2 | étape 0 = pipeline backend normal, la dépendance log4j 2.14.1 ajoutée exprès ; au clic, Dependency-Check rouge, les étapes suivantes grisées ; au clic, dépendance retirée, tout redevient vert |
| 29 | Déploiement GitOps avec ArgoCD | 2 | Git (état attendu) ; au clic, ArgoCD compare et applique ; au clic, la capture ArgoCD du 06/10, applications Synced et Healthy |
| 30 | Traçabilité d'une version | 4 | quatre maillons révélés un à un, l'identifiant 62c42e1 surligné : run vert (03/10) → tag ACR (03/10) → commit du bot dans le manifeste (03/10) → pod staging (06/10) |
| 31 | Supervision et validation | 0 | 05, chapitre 5 allumé |
| 32 | Métriques, journaux et alertes | 3 | services → Prometheus → Grafana (métriques) ; puis services → Alloy → Loki → Grafana (journaux) ; puis Prometheus → Alertmanager → e-mail |
| 33 | Métriques des services | 1 | étape 0, les deux cibles Prometheus en pleine largeur, noms et états UP repérés (06/10) ; au clic, Grafana prend toute la slide : panneau CPU et panneau mémoire avec leurs légendes (06/10, bas du panneau mémoire absent de la capture d'origine) |
| 34 | Journaux centralisés | 1 | chaîne action → backend → Alloy → Loki → Grafana ; au clic, la capture du tableau de bord « ZAWEDNI — Journaux » (07/10, adresse de test masquée) et l'intérêt pour le diagnostic |
| 35 | De l'erreur à la notification | 2 | erreurs 500 → en attente → alerte active → e-mail FIRING (Prometheus, Alertmanager) et la règle déclenchée ; au clic, arrêt des erreurs de test (12:34) → condition d'alerte disparue (≈ 12:38, Prometheus) → e-mail RESOLVED (12:38, Alertmanager) et la capture Gmail ; au clic, le rôle de chaque outil |
| 36 | Résultats de validation | 1 | staging et données ; au clic, production (parcours, guide pour une stratégie RSE, supervision) et mobile |
| 37 | Bilan et perspectives | 0 | 06, chapitre 6 allumé |
| 38 | Bilan du mémoire | 2 | au clic, Plateforme réalisée (web client et administration, mobile, API, données et IA) ; au clic, Déploiement et exploitation (infrastructure en code, contrôles et GitOps, supervision et sauvegardes) ; en bas, staging validé, production déployée et vérifiée ; ligne d'auteur discrète |
| 39 | Perspectives | 3 | court terme, consolider les mécanismes ; moyen terme, renforcer l'exploitation ; plus long terme, améliorer la disponibilité |
| 40 | Le parcours d'une version, du code au suivi | 1 | le film de 90 s (media/zawedni-devsecops.mp4, corrigé le 10/10 : production déployée par GitOps) ; étape 0 = affiche et bouton « Lire la vidéo » ; au clic, lecture avec le son dans la fenêtre projetée seulement ; pause, volume et reprise par les contrôles du lecteur ; quitter la slide arrête et rembobine |
| 41 | Conclusion | 1 | le besoin → la plateforme ZAWEDNI → la démarche DevSecOps ; puis « Merci pour votre attention » |

## 2. Règle du discours (v6)

Français B1, surtout « on » et le présent (« on a testé » pour un essai passé) ; une idée par phrase ; chaque explication donne un point concret ; une transition relie deux idées. Mots techniques expliqués à leur première utilisation (API, image, registre, cluster, routage, test automatique, manifeste). Trois modes : **lire à l'écran** (problème, solution, acteurs, BMC, cartes des analyses, encadrés d'architecture et d'isolation : la phrase projetée est le discours, marquée `[lire] « … »`), **expliquer avec le schéma** (le support montre les mots clés, le discours explique les liens), **transition** (intercalaires). Les réserves techniques ne se répètent pas : améliorations dans Perspectives (slide 39), détails dans la fiche privée. Isolation (slide 19) : rôle des NetworkPolicies et de Calico seulement, aucun résultat de test ; l'historique du test DNS reste dans la fiche privée (Q20).
