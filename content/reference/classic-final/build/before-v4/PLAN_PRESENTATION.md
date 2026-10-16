# Plan de la soutenance ZAWEDNI (v3, 07/10/2026)

Source : `../INSTRUCTIONS_CLAUDE_PRESENTATION_V3.md`. Le discours mot pour mot est dans `build/script_rows.py` → `SCRIPT.md` → `DISCOURS.md` et les notes du deck. Les questions du jury sont dans `FICHE_PRIVEE_QUESTIONS.md`, jamais projetée.

## 0. Fil et durée

Fil : besoin utilisateur → plateforme développée par Ali → architecture → automatisation de la livraison → observation du système → résultats. Le point vert du changement attend au départ sur la couverture et traverse toute la chaîne à la conclusion.

| Élément | Durée estimée |
|---|---|
| Parole (1 930 mots à 115 mots/min, animatic deck-kit) | ≈ 16:40 |
| 58 clics et 6 transitions de chapitre (pauses) | ≈ 0:50 |
| Vidéo | 1:30 |
| Manipulation, regard vers le jury | ≈ 0:15 |
| **Total** | **≈ 19:15** (estimation, pas une répétition chronométrée) |

À un rythme plus naturel (125 mots/min), la parole tombe à ≈ 15:30, soit ≈ 18:05 au total. Chronométrer une répétition avec la vraie vidéo.

## 1. Déroulé (42 slides, 58 clics)

Transitions : `camera` dans un chapitre, `dip` à chaque ouverture de chapitre (slides 3, 8, 14, 22, 32, 38). Chaque ouverture montre le numéro, le titre et le sommaire avec le chapitre allumé ; le kicker « Chapitre · Sujet » garde le chapitre visible sur les slides suivantes.

| # | Slide | Clics | Message | Preuve / source |
|---|---|---|---|---|
| 1 | Couverture | 0 | Sujet, ISIMa, ZAWEDNI, Ali Zribi, formation, encadrants | logos : `assets/logo-isima.png` (présentation fournie par Ali), `assets/logo-green.png` |
| 2 | Sommaire | 0 | Six chapitres | — |
| 3 | 01 Contexte et objectifs | 0 | — | — |
| 4 | ZAWEDNI et l'achat local responsable | 2 | trois constats, la réponse | accueil, version locale du 07/10 |
| 5 | Trois profils d'utilisateurs | 1 | fournisseur, acheteur, administrateur | rapport ch. 1 et 3, rôles du code |
| 6 | Besoins fonctionnels et exigences de qualité | 1 | fonctionnel ≠ qualité, avec exemples | rapport ch. 3 |
| 7 | Démarche de travail | 2 | développement → chaîne (≈ 85 %, estimation) → déploiement → validation continue | instructions V3 ; pas de sprints ni de dates |
| 8 | 02 Développement de la plateforme | 0 | — | — |
| 9 | Architecture de la plateforme | 2 | 3 clients → API (JWT) → PostgreSQL ; API → IA → Groq | `AIProxyConfig`, `zawedni-ia/main.py` |
| 10 | Du fournisseur évalué à l'acheteur | 3 | évaluation → revue admin → certificat QR → marketplace | captures Playwright du 07/10, pile locale `develop` |
| 11 | L'application mobile | 1 | rôle terrain, même API, APK | écrans Flutter du 06/10 (`design/audit/008/after/mobile`) |
| 12 | Fonctions métier réalisées | 0 | huit modules, canaux | contrôleurs et clients |
| 13 | Outils de développement | 0 | tâche + raison, sans comparaison | `pom.xml`, `package.json`, `pubspec.yaml`, `requirements.txt` |
| 14 | 03 Architecture et démarche DevSecOps | 0 | — | — |
| 15 | Architecture de déploiement | 3 | AKS, namespaces, Ingress, ArgoCD, ACR, GitHub hors Azure ; staging déployé, production non | `k8s/`, `bootstrap/README.md` |
| 16 | Le cycle DevSecOps | 2 | sécurité à la fin → une vérification par étape | workflows |
| 17 | Outils d'infrastructure | 0 | Docker, Terraform, AKS, ACR | `infrastructure/terraform` |
| 18 | Outils de livraison, contrôle, supervision | 0 | rôle + raison | workflows, `k8s/bootstrap` |
| 19 | Routage des requêtes | 2 | hôte puis chemin ; IA interne ; PUBLIC_HOST | Ingress, `ci-public-host` |
| 20 | Isolation réseau | 1 | refus par défaut ; Calico expliqué par son rôle ; 10/11, DNS à clarifier | `evidence/20261003-run-1349/netpol-verify.txt` |
| 21 | Secrets et données | 3 | secrets GitHub ; Sealed Secrets ; volumes ≠ sauvegarde | SealedSecrets, PVC |
| 22 | 04 Notre chaîne CI/CD et déploiement | 0 | — | — |
| 23 | Notre chaîne de livraison | 3 | poste → GitHub Actions → Azure | carte animée v2 |
| 24 | Dix pipelines | 2 | 5 par composant (filtres de chemins), 5 transversaux | workflows |
| 25 | Ce que déclenche chaque événement | 3 | PR : rien publié ; push staging : ACR + manifeste ; mobile : APK ; main : configuré | conditions `if:` ; PR #19 (06/10) |
| 26 | Ce que les tests vérifient | 1 | règles testées puis outils ; admin peu testée | JUnit, Vitest, pytest, flutter test |
| 27 | Cinq familles d'analyses | 1 | code, bibliothèques, secrets, images, infrastructure ; pas toutes dans chaque job | workflows |
| 28 | Bloquer, signaler, protéger la fusion | 2 | conditions effectives ; pas de protection de branche | `failBuildOnCVSS` 9, Trivy, `SONAR_WAIT`, Semgrep sans `--error`, Checkov `continue-on-error` |
| 29 | Un contrôle bloquant mis à l'épreuve | 2 | log4j 2.14.1 arrêté puis retiré | essais de validation (rapport) |
| 30 | Déploiement GitOps avec ArgoCD | 2 | Git → ArgoCD → pods | capture du 06/10 |
| 31 | Traçabilité d'un changement | 4 | un seul identifiant `62c42e1` : run → ACR → manifeste → pod | captures du 03/10 et du 06/10 ; poussé directement sur staging (dit à l'oral) |
| 32 | 05 Supervision et validation | 0 | — | — |
| 33 | Quatre outils de supervision | 3 | Prometheus/Grafana ; Alloy → Loki ; Alertmanager → e-mail | `k8s/bootstrap/20,25,26-*.yaml` |
| 34 | Métriques des services | 1 | cibles UP ; CPU et mémoire | captures du 06/10 |
| 35 | Journaux centralisés | 1 | connexion échouée → Loki → Grafana ; accès limité | `evidence/20261007-loki/chain-proof.txt`, capture 04 (adresse masquée) |
| 36 | Une alerte, de bout en bout | 2 | 500 → attente → FIRING → e-mail → résolue → e-mail ; 1 règle sur 5 | `alert-test-timeline.txt`, capture 02, Gmail du 07/10 |
| 37 | Ce qui a été validé | 1 | chaque vérification et ce qu'elle démontre ; non validé : production, arrêt/redémarrage | evidence 03/10, 06/10, 07/10 |
| 38 | 06 Bilan et perspectives | 0 | — | — |
| 39 | Bilan du projet | 2 | plateforme + chaîne ; deux limites | — |
| 40 | Perspectives | 3 | sécurité (HTTPS, branches, Semgrep/Checkov), exploitation (production, sauvegardes), supervision (alertes prod, base) | `docs/PERSPECTIVES.md`, `ROADMAP.md` |
| 41 | Vidéo | 1 | récapitulatif 1:30 | `../output/zawedni-devsecops.mp4` |
| 42 | Conclusion | 1 | le point vert traverse la chaîne ; « Merci pour votre attention » | — |

## 2. Déclencheurs CI (workflows identiques sur 49839ac et 51dd6ed)

- Garde commune : un job tourne seulement sur `pull_request` ou un push vers `staging`/`main`. Un push sur `develop` ne lance que `ci-workflow-guards` (si workflows ou `k8s/` changent).
- PR : contrôles des fichiers modifiés ; image construite et scannée si un composant change ; ACR et manifeste sautés (`if: github.event_name != 'pull_request'`).
- Push `staging` : image `:<sha>-staging` + `:staging`, commit du bot dans `k8s/staging/...`.
- Push `main` : `:<sha>-latest` + `:latest`, bot vers `k8s/prod/...` ; production non déployée (manifestes encore `:latest`).
- Mobile : `flutter test`, APK ; artefact GitHub à chaque run ; sur push : Azure Blob `apk-releases`, Google Drive (non bloquant), e-mail.

## 3. Vidéo

`../output/zawedni-devsecops.mp4`, 90 s, son présent, reconstruite le 07/10 avec `../build.sh`. Modifications de `../scene/index.html` : icône micro remplacée par l'icône de commit ; sous-titres « Secret trouvé : pipeline rouge, l'équipe ne fusionne pas », « le secret est chiffré avec Sealed Secrets », « Métriques, journaux et alertes surveillent staging » ; titre « de la branche feature à staging » ; SonarCloud « BLOQUANT · GATE SUR PR » ; cartes Journaux (Alloy, Loki) et Alertes (e-mail, testée le 07/10) mises à jour. Sauvegardes : `build/before-v3/scene-index.html`, `build/before-v3/zawedni-devsecops-v2.mp4`. Image d'attente : `assets/video-poster.jpg` (88 s).

## 4. Hors du deck projeté

- Plus de slides de réserve : leurs informations utiles sont dans le discours (production non déployée, volume ≠ sauvegarde, déclencheurs, mobile) ou dans `FICHE_PRIVEE_QUESTIONS.md` (exigences BF/BNF, retour arrière, coûts, nip.io…).
- Le PDF s'arrête à la conclusion (42 pages).

## 5. Reporté

Production, sauvegardes, HTTPS, protection de branche, Semgrep/Checkov bloquants, ZAP, Falco/OPA, métriques PostgreSQL, historique Prometheus persistant, test d'arrêt/redémarrage du cluster, démonstration de l'APK sur téléphone.
