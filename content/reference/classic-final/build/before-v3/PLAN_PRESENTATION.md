# Plan de la soutenance ZAWEDNI (v2)

Mis à jour le 06/10/2026 selon `../INSTRUCTIONS_CLAUDE_PRESENTATION.md`.

- **Source unique du discours : `SCRIPT.md`**, généré par `build/script_rows.py`. `DISCOURS.md` et les notes du deck en sont dérivés. Ce plan ne recopie pas le discours : il donne, pour chaque slide, le message, la preuve, la transition et la durée.
- Faits vérifiés en lecture seule dans le dépôt (branche `staging`, HEAD distant `195f4ab`), les sources du rapport et les captures. Le rapport, l'application, les workflows et les manifestes n'ont pas été modifiés.

---

## 0. Durée

Les durées sont **estimées** (115 mots/min, avec les clics, les transitions et le temps de lecture des preuves). Ce ne sont pas des durées mesurées en répétition.

| Élément | Durée estimée |
|---|---|
| Slides 1 à 34 et 36 (≈ 1 815 mots, soit ≈ 15:50 de parole seule à 115 mots/min ; avec clics, transitions et lecture des captures) | ≈ 17:00 |
| Slide 35 : présentation de la vidéo, lancement et retour | ≈ 0:15 |
| Vidéo | 1:30 (90 s mesurées) |
| **Total** | **≈ 18:45** (estimation : viser au plus 19:00 en répétition chronométrée avec la vraie vidéo) |

| Partie | Slides | Durée estimée |
|---|---|---|
| 1 · Contexte, besoin et contribution | 1–6 | 2:50 |
| 2 · Architecture et choix techniques | 7–12 | 2:55 |
| 3 · Parcours d'un changement | 13–22 | 4:35 |
| 4 · Accès, données et secrets | 23–26 | 2:05 |
| 5 · Supervision et résultats prouvés | 27–32 | 2:45 |
| 6 · Suite et conclusion (hors vidéo) | 33, 34, 36 | 1:30 |
| Vidéo et passage | 35 | 1:45 |

À la répétition, chronométrer avec `presenter.sh`. Si le total dépasse 19 min, raccourcir d'abord les slides 20, 23 et 29.

---

## 1. Changements par rapport au plan v1

| Point | v1 | v2 |
|---|---|---|
| Ouverture | 5 slides de contexte, rôle de CTO, modèle économique | 4 slides de contexte, puis la contribution en slide 5. Formulation neutre sur ZAWEDNI. La grille RSE tient en une phrase (l'ancienne slide `grille-rse` est retirée) |
| « je » | interdit | autorisé pour l'ouverture, la contribution et la conclusion |
| ArgoCD | « aucune capture actuelle » | capture du 06/10 retrouvée (3 apps Synced/Healthy) |
| GitOps | « tout passe par Git, jamais par kubectl » | « pour les mises à jour de l'application, le pipeline change le manifeste ; ArgoCD applique ». L'amorçage manuel est expliqué en réserve |
| Routage | « /ai vers le service IA » | **faux** : l'Ingress envoie `/api` et `/uploads` au backend, `/` au site. L'IA reste interne |
| Supervision | Prometheus et Grafana présentés comme la même preuve | deux preuves distinctes : cibles UP d'un côté, ressources des pods de l'autre |
| Résultats | « le compteur tombe à 3 » | lecture neutre : 6 analyses, 3 bloquantes sur staging, une 4ᵉ conditionnelle sur PR et main |
| Limites | dispersées et en fin de partie | regroupées avec leur suite en slide 33 ; la conclusion reste positive |
| Fin | « Merci », puis la vidéo | bilan → vidéo (récapitulatif) → retour du commit, conclusion positive, « Merci » |
| Vidéo | une phrase d'avertissement | sous-titres **et visuels** corrigés dans `../scene/index.html` (§7) |
| APK | télécharger l'artefact avant le 10/10 | tâche **annulée**. Le mobile est couvert par la réserve R42 |
| Couverture du rapport | noms des fichiers LaTeX | numérotation du PDF + colonne fichier source, avec la matrice BF/BNF (§9, §10) |

---

## 2. Preuves utilisées

Les copies recadrées sont dans `assets/`, générées par `build/crop-proofs.py`. Barres du navigateur, avatar et invite du terminal sont retirés. Les fichiers originaux ne sont pas modifiés.

| Copie dans le deck | Original | Date | Ce qu'elle démontre | Slide |
|---|---|---|---|---|
| `p0610-client-home.jpg` | corbeille, `Screenshot … 13-59-19.png` (équivalent de `B1-client-home`) | 06/10 | site client de staging servi | 2 |
| `p0310-ci-run.jpg` | `A1-ci-backend-run.png` | 03/10 | run backend réussi pour `62c42e1`, 7 min 19 s | 29 |
| `p0310-ci-steps.jpg` | `A1-ci-backend-steps.png` | 03/10 | étapes dans un seul job | réserve |
| `p0310-actions-staging.jpg` | `A2-actions-overview.png` | 03/10 | runs staging des contrôles transversaux | 14 (option) |
| `p0310-apk-run.jpg` | `A3-apk-run.png.png` | 03/10 | build APK et étapes de distribution ; Drive vert en 0 s, donc non prouvé | R42 |
| `p0310-acr-tags.jpg` | `A4-acr-tag-backend.png` | 03/10 (lu le 06/10) | tag `62c42e1…-staging` dans ACR | 21, 29 |
| `p0310-manifest-commit.jpg` | `B3-manifest-commit.png` | 03/10 | commit `dbc437f` du ZAWEDNI CI Bot | 21, 29 |
| `p0610-pod-image.jpg` | `B3-running-image.png` | 06/10 | pod staging Ready avec le tag attendu | 29 |
| `p0610-admin-entreprises.jpg` | `B1-admin-parcours.png` | 06/10 | connexion admin et parcours réussis | 23, 26 |
| `p0610-argocd-apps.jpg` | corbeille, `Screenshot … 14-10-55.png` (équivalent de `B2-argocd-apps`) | 06/10 | platform, monitoring et staging Synced/Healthy | 22 |
| `p0610-prometheus-targets.jpg` | `B4-prometheus-targets.png` | 06/10 | cibles backend et IA UP | 27 |
| `p0610-grafana.jpg` | `B5-grafana-backend.png.png` | 06/10 18:14 | CPU et mémoire réels des pods backend et IA | 28 |
| `p0610-uploads-404.jpg` | haut de `Screenshot … 17-13-02.png` (équivalent de `C2-uploads-404`) | 06/10 | fichier absent → 404 (avant : 500) | 25 |
| `p0610-pr19-actions.jpg` | bas de `Screenshot … 17-13-02.png` | 06/10 | PR #19 : 5 contrôles transversaux, aucune image | 20 |

**Exclues :**
- `15-07-54` et `18-08-02` : mot de passe visible ;
- `17-35-22` : « No data » ;
- `17-18-39` : accueil vide ;
- `B1-admin-login.png` : affiche « Core API UNREACHABLE » ;
- la capture ArgoCD du rapport avec la prod, qui n'est pas l'état actuel.

**Contexte vérifié :**
- Correctif Grafana des PR #19 et #20 : limite 512Mi, GOMEMLIMIT 384MiB, nouveau pod Ready, aucun redémarrage pendant 10 minutes d'observation, ArgoCD Synced/Healthy. Ce n'est pas une garantie de disponibilité.
- Le cluster est arrêté après les captures, pour économiser le crédit.

---

## 3. Déroulé, slide par slide

Le discours exact de chaque slide est dans `SCRIPT.md`, à la ligne du même numéro.

### 1 · Contexte, besoin et contribution (2:50)

| # | id | Message | À montrer / preuve | Transition vers la suivante | Durée |
|---|---|---|---|---|---|
| 1 | `couverture` | Une chaîne DevSecOps amène le code jusqu'au cloud | carte nuit, point du commit (« commit » expliqué) | « D'abord, le projet. » | 0:33 |
| 2 | `zawedni` | Plateforme B2B d'achat local, fournisseurs vérifiés par une grille RSE | `p0610-client-home.jpg` + 3 cartes | « Au départ… » | 0:27 |
| 3 | `manques` | Un seul ordinateur, quatre manques | ordinateur seul, compteur 0, puis 4 cartes barrées | « D'où la question. » | 0:28 |
| 4 | `question` | Livrer 5 composants en sécurité, avec un budget de startup | problématique, 15 BF + 7 BNF (BF05, BNF07) | « L'application existait déjà. » | 0:28 |
| 5 | `perimetre` | **Ma contribution** : la chaîne autour de l'application | composants grisés → anneau du PFE | « Organisation du travail. » | 0:28 |
| 6 | `scrum` | Scrum : 6 sprints, 3 releases | Gantt | « Premières décisions. » | 0:26 |

### 2 · Architecture et choix techniques (2:55)

Chaque outil apparaît avec le besoin qu'il couvre et la raison du choix.

| # | id | Message | À montrer / preuve | Transition | Durée |
|---|---|---|---|---|---|
| 7 | `approches` | Deux choix distincts : GitHub Actions pour tester et construire (dépôt déjà sur GitHub, pas de serveur CI) ; AKS pour exécuter les services (Kubernetes géré, crédit étudiant) | tableau choix · besoin · raison, 2 lignes ; contrainte « crédit de 100 $ » ; « autres solutions possibles : Jenkins, GitLab CI, Azure Pipelines ». Détail en réserve 40 ; le 35–40 $/mois (estimation du rapport) reste en réserve | « Et la sécurité ? » | 0:37 |
| 8 | `devsecops` | Les analyses sont dans le pipeline | bouclier qui glisse dans la boucle | « L'architecture. » | 0:20 |
| 9 | `chaine` | Trois zones : poste, GitHub, Azure | carte nuit, zones allumées | « Brique par brique. » | 0:30 |
| 10 | `docker` | Une image par service serveur ; le mobile produit un APK | même boîte partout, Compose, IA de plus de 4 Go → 928 Mo | « Où tournent ces images ? » | 0:32 |
| 11 | `terraform` | L'infrastructure est écrite en code | bloc Terraform du rapport, `.src` avec l'état actuel | « Le cluster. » | 0:22 |
| 12 | `environnements` | Kubernetes et AKS expliqués ; staging déployé, prod configurée | staging en plein, prod en pointillés ; namespace = séparation logique | « Suivons un changement. » | 0:33 |

### 3 · Parcours d'un changement (4:35)

Ordre : PR → pipeline → tests et analyses → règle de fusion → contrôle ou publication → registre et manifeste → ArgoCD.

| # | id | Message | À montrer / preuve | Transition | Durée |
|---|---|---|---|---|---|
| 13 | `parcours` | Chemin **prévu** : feature → develop → staging → main | 4 couloirs, main en pointillés | « Quel pipeline démarre ? » | 0:37 |
| 14 | `dix-pipelines` | 5 pipelines par composant (filtres de chemins) : sur une PR vers staging, un changement backend lance ci-backend, et des contrôles communs au dépôt peuvent s'ajouter ; 5 transversaux | zone 2 nuit | zoom | 0:22 |
| 15 | `huit-etapes` | Vue de synthèse : tests, puis 6 types d'analyses présents dans le dépôt, puis construction et publication. Les analyses sont réparties entre plusieurs workflows : chaque composant ne reçoit pas les six | rail, mention « vue globale : analyses réparties entre plusieurs workflows », compteur 0 → 6 types d'analyses dans le dépôt | « Trois analyses peuvent arrêter. » | 0:31 |
| 16 | `gitleaks` | Un secret trouvé fait échouer le job | code réel | enchaîner | 0:18 |
| 17 | `dependency-check` | Seuil 9 sur 10 : à partir de 9, le build échoue | `pom.xml` | enchaîner | 0:16 |
| 18 | `trivy` | Une faille grave corrigeable arrête l'image ; pas de promesse « zéro faille » | étape Trivy réelle | « Rouge ne veut pas dire interdit. » | 0:23 |
| 19 | `regle-equipe` | Pas de protection de branche → règle d'équipe | bouton de fusion actif | « Contrôler ou publier. » | 0:26 |
| 20 | `controle-publication` | Une PR contrôle (elle peut construire et scanner) ; le push sur staging publie, si un composant a changé | 2 colonnes + `p0610-pr19-actions.jpg` | « La publication. » | 0:40 |
| 21 | `gitops` | Image dans ACR (registre expliqué), puis une ligne du manifeste (expliqué) changée par commit | `p0310-acr-tags.jpg`, `p0310-manifest-commit.jpg` | « Appliquer cette version. » | 0:28 |
| 22 | `argocd` | ArgoCD applique la version décrite dans Git | boucle + `p0610-argocd-apps.jpg` | « Comment y accède-t-on ? » | 0:33 |

### 4 · Accès, données et secrets (2:05)

| # | id | Message | À montrer / preuve | Transition | Durée |
|---|---|---|---|---|---|
| 23 | `routage` | Hôte puis chemin ; l'IA reste interne ; adresse unique vérifiée | schéma + `p0610-admin-entreprises.jpg` (petit) | « À l'intérieur du cluster. » | 0:36 |
| 24 | `isolation` | NetworkPolicies appliquées par Calico ; 10/11 le 03/10, DNS à valider | flux autorisés et interdits | « Les données. » | 0:27 |
| 25 | `stockage` | Disques persistants ; 404 vérifié ; un disque n'est pas une sauvegarde | `p0610-uploads-404.jpg` | « Les secrets. » | 0:30 |
| 26 | `secrets` | Secrets GitHub et Sealed Secrets ; le mot de passe admin vient d'un SealedSecret | schéma + connexion admin | « Est-ce que ça fonctionne ? » | 0:31 |

Vérifié dans les fichiers : `k8s/staging/backend/spring-boot.yaml` lit `ADMIN_DEFAULT_PASSWORD` dans `zawedni-backend-secrets`, qui est un `kind: SealedSecret` (`sealed-backend-secrets.yaml`). `DataInitializer` crée l'admin à partir de cette variable. La connexion réussie du 06/10 montre donc que le cluster a déchiffré ce secret.

### 5 · Supervision et résultats prouvés (2:45)

| # | id | Message | À montrer / preuve | Transition | Durée |
|---|---|---|---|---|---|
| 27 | `prometheus` | Collecte des métriques du backend et de l'IA (absente du rapport) | `p0610-prometheus-targets.jpg` | « Grafana. » | 0:23 |
| 28 | `grafana` | Ressources des pods (CPU, mémoire) ; alertes non validées ; Loki absent | `p0610-grafana.jpg` + 2 cases | « Image testée = image qui tourne ? » | 0:29 |
| 29 | `tracabilite` | Le même identifiant, du run au pod | 4 maillons révélés un par un, identifiant surligné | « Bloquent-elles vraiment ? » | 0:31 |
| 30 | `sprint6` | Lire, casser exprès, réparer | boucle gris → rouge → vert | « Un essai réel. » | 0:22 |
| 31 | `log4j` | log4j 2.14.1 arrêté (essai daté du sprint 6) | rail | « La lecture finale. » | 0:27 |
| 32 | `resultats` | 6 types d'analyses dans le dépôt ; parcours du backend sur staging : 3 bloquantes ; + SonarCloud sur PR et main. Les compteurs décrivent la configuration vérifiée, pas une publication en production | grille des statuts, puis « backend, chemin de staging : 3 » et « PR et main : 4 » | « Ce qui reste. » | 0:32 |

- La slide 29 parle de correspondance de tags, pas de preuve cryptographique du contenu de l'image.
- La slide 32 décrit une classification de configuration, pas un déploiement récent de main.

### 6 · Suite et conclusion (3:15 avec la vidéo)

| # | id | Message | À montrer / preuve | Transition | Durée |
|---|---|---|---|---|---|
| 33 | `limites` | Trois priorités : sécurité (HTTPS, protection des branches, analyses bloquantes), exploitation (production, sauvegardes), supervision (alertes, journaux). Semgrep, Checkov, ZAP, Falco, OPA : en réserve et en réponse | carte nuit, 3 repères orange (3 clics) ; badge « 3 sur staging · 4 sur PR et main » | « En bilan. » | 0:34 |
| 34 | `bilan` | Ce qui fonctionne et ce qui est prouvé ; « dix pipelines automatisent les tests et les analyses selon les fichiers modifiés et les événements » | avant/après | « Pour récapituler, la vidéo. » | 0:26 |
| 35 | `video` | Récapitulatif en 1:30 | la vidéo dans le deck (§7) | — | 0:15 + 1:30 |
| 36 | `retour` | Le commit va jusqu'à staging ; ma contribution ; Merci | point vert sur tout le chemin | — | 0:27 |

---

## 4. Réserve (slides 37 à 44)

| # | id | Contenu |
|---|---|---|
| 37 | `r-ip` | Incident de l'IP Azure → `k8s/PUBLIC_HOST`, source unique vérifiée par `ci-public-host` ; injecté aussi dans l'APK |
| 38 | `r-postgres` | Deployment (et non StatefulSet), PVC 5 Go RWO, une réplique, aucune sauvegarde |
| 39 | `r-rollback` | Ce qui passe par GitOps (mises à jour applicatives), ce qui est appliqué à la main (`k8s/bootstrap/`, exemple : Grafana le 06/10) ; `git revert` jamais testé ; leçon `rollout undo` |
| 40 | `r-choix` | Critères de choix des outils ; budget estimé, sans mesure réelle |
| 41 | `r-matrice` | Déclencheurs (§5) + contrôles par workflow + les 3 essais réels |
| 42 | `r-mobile` | Chaîne APK : tests, build, artefact, Blob (date + SHA), Drive non prouvé, e-mail ; démo sur téléphone après l'UI/UX |
| 43 | `r-exigences` | Grille BF01–BF15 et BNF01–BNF07 colorée selon la §10 |
| 44 | `r-etat` | Rapport `699b99f` / déjà dans le code / après le rapport |

---

## 5. Déclencheurs CI (branche `staging`, sans changement de workflow depuis `62c42e1`)

| Événement | Workflow déclenché ? | Jobs exécutés | Construction de l'image | Publication ACR + manifeste |
|---|---|---|---|---|
| Push sur feature ou develop | oui, si le filtre de chemins correspond (composants, secrets, semgrep, public-host, infra) | **sautés** (`if` = PR, staging ou main) ; seul `ci-workflow-guards` s'exécute, si `.github/workflows/` ou `k8s/` changent | non | non |
| PR vers develop | `ci-semgrep`, `ci-mobile` (si `zawedni/**` ou `k8s/PUBLIC_HOST`), guards (selon les chemins) | Semgrep (un résultat ne fait pas échouer : pas de `--error`) ; tests + build APK sans distribution | non | non |
| PR vers staging ou main | pipelines des composants touchés + secrets, semgrep, public-host, infra (selon les chemins) | Gitleaks, tests, Dependency-Check, SonarCloud (attente de la quality gate : `SONAR_WAIT` vrai sur PR), Trivy, Checkov (avis) | **oui**, si un composant est touché | **non** (`if: github.event_name != 'pull_request'`) |
| Push sur staging (après fusion) | idem, selon les chemins | mêmes contrôles ; SonarCloud n'attend pas la gate (`SONAR_WAIT` faux) | oui, si un composant a changé | oui : `:staging`, `:<sha>-staging`, commit du bot dans `k8s/staging/` |
| Push sur main | idem | quality gate attendue | oui | **prévu** : `:latest`, `:<sha>-latest`, commit dans `k8s/prod/`. Non démontré : les workflows de `main` datent du 03/09 (`git push \|\| true`, sans permission d'écriture) |

**Observé le 06/10 :**
- le push de la branche `infra/grafana-oom` n'a lancé que les guards (run #18) ;
- la PR #19 a lancé 5 transversaux verts, sans image ;
- la PR #20 a donné le même résultat ;
- la fusion sur staging a relancé les 5 transversaux, toujours sans image : seuls `k8s/` et un runbook avaient changé.

**SonarCloud :** la raison de la condition est écrite dans le workflow. L'analyse d'une branche n'est pas conservée par SonarCloud (constat B10), alors que celle d'une PR l'est. La PR #8 a montré un vrai blocage : run 33576703581, `QUALITY GATE STATUS: FAILED`, puis job en échec. À l'oral, on parle de la condition du workflow, pas de « l'offre gratuite ».

**Chemin de branches :** feature → develop → staging → main est le chemin **prévu**. Les PR #16 à #18 l'ont suivi en septembre. Les PR d'infrastructure #19 et #20 visaient directement staging, et beaucoup de commits historiques sont allés directement sur staging.

---

## 6. Corrections techniques appliquées au discours

- **GitOps :** « Pour les mises à jour de l'application, le pipeline change le manifeste dans Git. ArgoCD applique ensuite cette version au cluster. » L'amorçage par `k8s/bootstrap/` est appliqué à la main, documenté, et expliqué en R39.
- **Supervision :** Prometheus = collecte des endpoints. Grafana = ressources des pods (CPU, mémoire), pas la latence ni le taux d'erreur. Alertes configurées, déclenchement non validé. Loki absent : retiré exprès (`20-monitoring.yaml` : chart marqué déprécié, 3 pods sur 10).
- **Environnements :** staging déployé et testé ; prod décrite dans la configuration, non déployée sur le cluster actuel.
- **CI :** distinction entre workflow déclenché, job exécuté et job sauté ; une PR peut construire sans publier ; une fusion documentaire ne publie rien.
- **Contrôles :** 6 analyses, 3 bloquantes sur staging, une 4ᵉ conditionnelle sur PR et main. Les essais log4j, faux secret et ancienne adresse sont datés du sprint 6. Un scan vert ne prouve pas qu'un défaut aurait été bloqué.
- **Traçabilité :** « identifiant de la version », correspondance de tags.
- **Stockage :** un disque persistant n'est pas une sauvegarde. Le 404 prouve le statut corrigé, pas un upload complet.
- **Retiré du discours :**
  - « fondée avec… fondateur et CTO » (non confirmé) ;
  - « recréé ainsi » pour Terraform (non prouvé) ;
  - « offres gratuites trop limitées » ;
  - « tout passe par Git, jamais par kubectl ».

---

## 7. Vidéo

- **Sources corrigées dans `../scene/index.html`**, en gardant le style.

| Où | Avant | Après |
|---|---|---|
| sous-titre t=0 | « …du code jusqu'à la production. » | « …du code jusqu'au cloud. » |
| sous-titre t=9 + badge | « Sur develop, Gitleaks et Semgrep… » ; badge « push develop : Gitleaks · Semgrep » | « Pull request vers develop : Semgrep analyse déjà le code. » ; badge « PR → develop : Semgrep · aucune image » |
| sous-titre t=59 | « Même chaîne, mêmes portes, cette fois pour la production. » | « Vers main : les mêmes contrôles, avant la production. » |
| sous-titre t=67.5 + scène 10 | « ArgoCD déploie la production… » ; pods prod qui apparaissent, « production à jour » | « La production suivra le même chemin : configurée, pas encore déployée. » ; pods prod en pointillés, puce « production : prévue » ; sons des pods retirés |
| sous-titre t=76 + cartes | « Prometheus, Grafana et Loki » ; « 13 / 13 » ; carte Loki ; cloche qui sonne | « Prometheus et Grafana surveillent les services. » ; « backend + IA : UP » ; carte « Journaux : Loki non installé » ; cloche fixe « règles écrites » |
| sous-titre t=82.5 + générique | « Chaque commit est vérifié avant d'arriver en production. » ; « Vérifié à chaque commit. Rien n'arrive en production… » | « Chaque changement applicatif est contrôlé avant staging. » ; « Contrôlé jusqu'au staging. » / « Les changements applicatifs passent les contrôles avant d'être déployés. » |

- **Reconstruction séparée :** `cd .. && ./build.sh` (environ 5 min), qui produit `output/zawedni-devsecops.mp4`. Vérification : `node render.mjs --stills 10,70,80,88`.
- **Dans le deck :** slide 35 `video`, qui lit `../output/zawedni-devsecops.mp4`. Le fichier doit rester à côté du dossier `soutenance/`. La lecture se fait uniquement dans la fenêtre du public, jamais dans la vue présentateur ni dans l'aperçu.

---

## 8. Sujets peu couverts, vérifiés dans la configuration

| Sujet | État dans les fichiers | Où on le dit |
|---|---|---|
| Docker Compose | `docker-compose.yml` ; capture « compose up » du rapport | slide 10 |
| Non-root | backend et IA : `USER zawedni` ; client et admin : `nginx:alpine` sans `USER`, donc root | R43 (BF15 partiel), Q |
| Sondes de santé | readiness et liveness sur le backend et l'IA seulement | Q |
| HPA, PDB | absents | R43 (BNF02 et BNF03 non réalisés) |
| Disponibilité | `replicas: 1` partout, aucune mesure ; ne jamais dire « sans coupure » | Q |
| Durée des pipelines | backend 7 min 19 s (03/10) ; APK 15 min 25 s ; synchronisation ArgoCD non mesurée | R43 (BNF01 partiel) |
| Budget | estimations du rapport ; aucune mesure, aucune alerte de budget | slide 7, R40 |
| HTTP/TLS | Ingress sans `tls:`, pas de cert-manager : accès en HTTP | Q |
| Retour arrière | théorie, non testé | R39 |
| Sauvegarde | aucune | slide 25, R38 |
| Métriques ressources ou applicatives | Grafana = ressources ; Prometheus collecte les endpoints applicatifs ; aucun tableau latence/erreurs montré | slides 27–28 |
| Capacité | `k8s/bootstrap/README.md` : staging + prod + supervision demandent 5020Mi, contre 4644Mi allouables sur 2 × B2s (calcul documenté, pas une observation) | Q |

---

## 9. Sujets du rapport (numérotation du PDF) → slide → preuve

**S** = slide principale · **R** = réserve · **Q** = réponse orale.

| Section PDF | Sujet | Fichier source | Où | Preuve |
|---|---|---|---|---|
| 1.2–1.3 | Organisme, dimension entrepreneuriale | chapitre1.tex | S2 (neutre) | annexe B, `p0610-client-home` |
| 1.4–1.5 | Contexte, existant, approches | chapitre1.tex | S3, S7 | §1.5.2 |
| 1.6 | Problématique | chapitre1.tex | S4 | — |
| 1.7 | Solution proposée | chapitre1.tex | S5, S9 | — |
| 1.8–1.9 | Scrum, backlog, planification | chapitre1.tex | S6 | Gantt |
| 2.2 | DevOps → DevSecOps | chapitre2.tex | S8 | — |
| 2.3–2.8 | Cloud, Docker, Kubernetes, CI/CD, GitOps, IaC | chapitre2.tex | S7, S10, S11, S12, S22 | tableaux comparatifs 2.x |
| 2.9 | Sécurité dans le pipeline (2.9.6 ZAP, 2.9.7 vérification) | chapitre2.tex | S15–S18, S30, S33 | workflows |
| 2.10 | Falco | chapitre2.tex | S33 | non réalisé |
| 2.11–2.12 | Observabilité, ACR | chapitre2.tex | S27, S28, S21 | B4, B5, A4 |
| 2.13 | Synthèse des choix | chapitre2.tex | R40 | — |
| 3.2 | Plateforme, acteurs, architecture applicative | chapitre3.tex | S2, S5 | — |
| 3.3–3.4 | BF et BNF | chapitre3.tex | S4, R43 | §10 |
| 3.5 | Architecture globale, GitFlow | chapitre3.tex | S9, S13 | — |
| 3.6 | Pipeline CI/CD, huit étapes, flux | chapitre3.tex | S14, S15, S20, R41 | §5 |
| 3.7 | Kubernetes sur AKS : namespaces, Ingress, secrets, stockage, haute disponibilité | chapitre3.tex | S12, S23, S26, S25 ; HA en Q | manifestes |
| 3.8 | Architecture de sécurité | chapitre3.tex | S24, S26, R43 | `netpol-verify.txt` |
| 3.9 | Architecture d'observabilité | chapitre3.tex | S27, S28 | B4, B5 |
| 4.1 | Sprint 1, conteneurisation | chapitre4.tex | S10 | compose up |
| 4.2 | Sprint 2 : Terraform, staging/prod, correctifs, incident IP, CORS, PVC RWO | chapitre5.tex | S11, S12 ; IP en R37 ; PVC en R38 | — |
| 5.1 | Sprint 3 : branches et tags, secrets GitHub, pipelines, règles de merge | chapitre6.tex | S13–S20 | A1, A2, PR #19 |
| 5.2 | Sprint 4 : ArgoCD, deux applications, règle GitOps, boucle, flux validé | chapitre7.tex | S21, S22, S29 ; R39 | A4, B3, ArgoCD 06/10 |
| 6.1 | Sprint 5 : Prometheus, Grafana, Loki, Alertmanager, NetworkPolicies, revue de code | chapitre8.tex | S24, S27, S28 ; revue en Q | B4, B5, `netpol-verify.txt` |
| 6.2 | Sprint 6 : vérification des contrôles (référentiel, méthode, résultats, limites) | chapitre9.tex | S30–S33 | §6.2.5, annexe A |
| Conclusion | Bilan, perspectives | conclusion.tex | S33, S34, S36 | — |
| Annexe A | Détail des vérifications | annexe.tex | R41 | — |
| Annexe B | BMC | annexeB.tex | S2 (3 cartes) | — |
| Annexe C | Cahier des charges | annexeC.tex | Q (vision, pas résultat) | — |

**Coquilles du rapport à connaître :**
- tag de main `:<sha>` dans le rapport, `:<sha>-latest` dans le code (§5.1.3) ;
- PostgreSQL décrit comme StatefulSet (3.7.4 et 4.2), alors que c'est un Deployment ;
- « sans interruption » (3.7.5).

---

## 10. Matrice des exigences (réserve R43 et préparation orale)

Légende : **D** = démontré · **P** = configuré ou partiel · **N** = non réalisé.

| Exigence | État | Limite | Où | Preuve |
|---|---|---|---|---|
| BF01 Conteneurisation | D | le mobile → APK, pas d'image | S10 | images ACR, A3 |
| BF02 Environnement local Compose | D | — | S10 | rapport 4.1 |
| BF03 Provisionnement Terraform | D (création) | destruction et recréation par Terraform non prouvées ici | S11 | rapport 4.2, `variables.tf` |
| BF04 Déclenchement par composant | D | — | S14, S20 | A2, PR #19 |
| BF05 Contrôles bloquants | P | 3 bloquants sur staging, 2 testés ; Semgrep et Checkov en rapport | S32 | rapport 6.2, workflows |
| BF06 GitOps | D en staging | prod non démontrée | S21, S22, S29 | A4, B3, ArgoCD |
| BF07 Isolation des environnements | P | namespaces logiques ; NetworkPolicies 10/11 ; prod non déployée | S12, S24 | `netpol-verify.txt` |
| BF08 OWASP ZAP | N | — | S33 | — |
| BF09 Supervision des métriques | P | ressources et endpoints ; pas de tableau latence/erreurs | S27, S28 | B4, B5 |
| BF10 Journaux Loki | N (cluster actuel) | retiré exprès | S28 | `20-monitoring.yaml` |
| BF11 Alertes | P | 5 règles écrites ; déclenchement non validé ; pas de receiver e-mail dans Git | S28 | `zawedni-alerts.yaml` |
| BF12 Falco | N | — | S33 | — |
| BF13 Secrets | D | — | S26 | SealedSecret + connexion admin |
| BF14 APK publiée dans Blob (date + SHA) | D | Drive non prouvé | R42 | A3 |
| BF15 Communications et images | P | Ingress seul exposé, IA interne ; frontends en root ; pas de TLS | S23, R43 | Dockerfiles, Ingress |
| BNF01 Performance | P | backend 7 min 19 s (< 10) ; APK 15 min 25 s ; synchronisation non mesurée | R43 | A1, A3 |
| BNF02 Disponibilité 99,9 % | N | 1 réplique, pas de PDB, aucune mesure | Q | manifestes |
| BNF03 Scalabilité (HPA) | N | pas de HPA | Q | manifestes |
| BNF04 Maintenabilité (PR, GitOps) | P | amorçage manuel ; commits directs sur staging | R39 | historique Git |
| BNF05 Portabilité | P | images standard ; pas d'essai sur un autre cluster | Q | — |
| BNF06 Traçabilité | D en staging | correspondance de tags | S29 | A1, A4, B3 |
| BNF07 Coût | P | estimation du rapport, aucune mesure | S7, R40 | rapport 1.5, 2.x |

**Total :** 8 D · 9 P · 5 N.

---

## 11. Questions probables du jury

Réponses courtes. Les compléments sont à donner seulement si le jury insiste.

1. **Votre contribution, si l'application existait ?**
Toute la chaîne autour d'elle : les images, Terraform, les dix pipelines, GitOps, la supervision et la vérification des contrôles.

2. **L'image qui tourne est-elle celle qui a été testée ?**
Le même identifiant `62c42e1` apparaît dans le run, le tag ACR, le manifeste et le pod staging (slide 29).
*Complément :* c'est une correspondance de tags, pas une signature cryptographique.

3. **Pourquoi la production n'est-elle pas déployée ?**
Le cluster actuel n'a qu'un nœud : on y a mis staging et la supervision, pour le coût. La production est décrite dans Git, et sa promotion par GitOps n'a pas été démontrée.
*Complément :* la prod tournait aux sprints 2 à 4 (captures du rapport). Le calcul de capacité de `k8s/bootstrap/README.md` donne 5020Mi demandés contre 4644Mi allouables sur 2 × B2s. Les workflows de `main` datent du 03/09.

4. **Pourquoi le cluster est-il arrêté ?**
Pour économiser le crédit. On l'a démarré pour les captures du 6 octobre, puis arrêté.

5. **SonarCloud bloque-t-il ?**
Sur les pull requests et sur main, le pipeline attend la quality gate. Sur staging, non. C'est la condition `SONAR_WAIT` du workflow.
*Complément :* PR #8, run 33576703581 : gate en échec, job en échec. C'était déjà le cas au commit du rapport, mais le rapport ne le décrit pas.

6. **Un pipeline rouge empêche-t-il la fusion ?**
Non. Sans protection de branche, c'est une règle d'équipe.

7. **Que lance un push sur develop ?**
Les workflows démarrent, mais leurs jobs sont sautés. Seuls les guards tournent, si les workflows ou `k8s/` changent. Une PR vers develop lance Semgrep, et le mobile si ses fichiers changent.

8. **Une PR construit-elle une image ?**
Oui, si elle touche un composant : l'image est construite et scannée, mais jamais publiée.

9. **Les alertes fonctionnent-elles ?**
Les règles sont écrites, mais leur déclenchement n'est pas validé. Aucun receiver e-mail n'est dans Git.

10. **Pourquoi Loki n'est-il pas là ?**
Il n'a pas été réinstallé : le chart est marqué déprécié et prenait 3 des 10 pods de la supervision.

11. **Les NetworkPolicies fonctionnent-elles ?**
Calico les applique. Le 03/10, 10 tests sur 11 passaient. Le cas DNS reste à valider.

12. **Y a-t-il des sauvegardes ?**
Non. Le disque est persistant, mais ce n'est pas une sauvegarde.

13. **Un retour arrière a-t-il été testé ?**
Non. Un `git revert` est possible en staging, mais il n'a pas été testé.

14. **Tout passe-t-il par Git ?**
Les mises à jour de l'application, oui. L'amorçage des applications ArgoCD est appliqué à la main, dans un ordre documenté ; c'était le cas du correctif Grafana du 6 octobre.

15. **Combien coûte Azure ?**
Pas de mesure. Le rapport estime 35 à 40 $ par mois pour le cluster, payés par le crédit de 100 $.

16. **Zéro coupure ?**
Non garanti : une réplique, pas de PDB, aucune mesure.

17. **HTTPS ?**
Non. L'Ingress n'a pas de TLS ; c'est une suite à donner.

18. **Les images tournent-elles en non-root ?**
Le backend et l'IA, oui. Les deux sites (nginx), non.

19. **StatefulSet ?**
Non : c'est un Deployment avec un volume. Le rapport se trompe sur ce point.

20. **L'APK est-elle sur Drive ?**
Ce n'est pas prouvé : l'étape est non bloquante et a duré 0 s. L'APK est publiée dans le stockage Azure et dans les artefacts GitHub. La démo sur téléphone viendra après les changements d'interface.

21. **Pourquoi nip.io ?**
Il donne un nom d'hôte sans acheter de domaine, ce qui permet à l'Ingress de séparer staging et admin.

22. **La revue de code du rapport (6.1) ?**
Le code actuel de staging contient `@PreAuthorize` sur les routes d'écriture des secteurs, et un `RateLimitFilter` avec son test. La date et la validation de ces correctifs ne sont pas vérifiées : on le dit tel quel.

23. **Ces analyses arrêtent-elles vraiment un défaut ?**
Gitleaks et Dependency-Check, oui : essais datés du sprint 6. Pour les autres, un scan vert ne prouve pas qu'un défaut aurait été bloqué.

24. **Quel modèle économique est envisagé pour ZAWEDNI ?**
Un abonnement, avec une offre d'entrée gratuite. Les prix ne sont pas encore fixés : c'est une proposition, pas une offre commerciale validée.

25. **Quel intérêt de cette chaîne pour ZAWEDNI ?**
Préparer, contrôler et déployer les nouvelles versions de façon régulière, avec peu de tâches manuelles, et suivre les services dans le cloud.

26. **Pourquoi pas Jenkins, GitLab CI ou Azure Pipelines ?**
Ils étaient possibles. Jenkins demande un serveur à entretenir ; GitLab CI et Azure Pipelines fonctionnent avec GitHub, mais ajoutent un service à configurer. Le dépôt était déjà sur GitHub (réserve 40).

---

## 12. Reporté (réellement)

- Démonstration de l'APK sur téléphone : après la fin des changements d'interface.
- Tests des alertes et du DNS : pas à cette étape.
- Déploiement de la production, sauvegardes, ZAP, Falco et OPA, protection des branches : perspectives (slide 33).
- Rapport : non modifié. Les coquilles de la §9 sont à corriger plus tard.
