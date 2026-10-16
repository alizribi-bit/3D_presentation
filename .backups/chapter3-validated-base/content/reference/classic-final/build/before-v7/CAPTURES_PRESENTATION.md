# Captures pour la présentation

Préparé le 06/10/2026 à partir du tableau vérifié. Le cluster AKS est **arrêté**
(`az aks show … powerState = Stopped`, lu le 06/10). Dernier test sur le cluster :
03/10/2026 à 13:49 UTC (`evidence/20261003-run-1349` dans le dépôt).

Dépôt : https://github.com/alizribi-bit/zawedniPFEproject

---

## A — Maintenant (cluster arrêté)

Ces captures se font dans le navigateur, sans démarrer le cluster.

### A1. Pipeline backend (version déployée en dernier)

| Quoi ouvrir | Résultat attendu | Fichier | Ce que ça prouve |
|---|---|---|---|
| https://github.com/alizribi-bit/zawedniPFEproject/actions/runs/37134883935 | Run « CI — ZawedniServer (Spring Boot) », `staging`, commit `62c42e1`, 03/10 15:54 UTC, vert | `A1-ci-backend-run.png` | Le commit déployé a été construit et testé par la CI |
| Même run → job `build-test-scan-push`, liste des étapes déroulée | Gitleaks, Maven build+tests, OWASP Dependency Check, SonarCloud, Trivy, push ACR et « Update K8s manifest » en vert | `A1-ci-backend-steps.png` | Les contrôles de sécurité sont dans le même job que le build : pas d'image poussée sans eux |

Run de secours (celui qui figure dans la preuve du 03/10 13:49) :
https://github.com/alizribi-bit/zawedniPFEproject/actions/runs/37126711968, commit `ba2b5ef`.

### A2. Tests et contrôles transverses (commit `7a21eb7`, 03/10 15:48 UTC)

| Quoi ouvrir | Fichier |
|---|---|
| Semgrep SAST : https://github.com/alizribi-bit/zawedniPFEproject/actions/runs/37134547062 | `A2-semgrep.png` |
| Secrets dans l'arbre : https://github.com/alizribi-bit/zawedniPFEproject/actions/runs/37134547094 | `A2-secrets.png` |
| Infrastructure (Terraform + K8s) : https://github.com/alizribi-bit/zawedniPFEproject/actions/runs/37134547054 | `A2-infra.png` |
| Workflow guards : https://github.com/alizribi-bit/zawedniPFEproject/actions/runs/37134547090 | `A2-workflow-guards.png` |
| Public host single-source : https://github.com/alizribi-bit/zawedniPFEproject/actions/runs/37134547100 | `A2-public-host.png` |
| Vue d'ensemble : https://github.com/alizribi-bit/zawedniPFEproject/actions?query=branch%3Astaging | `A2-actions-overview.png` |

**Résultat attendu :** les cinq runs en vert. **Ce que ça prouve :** les contrôles tournent à chaque push sur `staging`.
**Ce que ça ne prouve pas :** qu'un contrôle *bloque* un build fautif. Aucun run récent ne montre un échec bloquant.
Waiver actif à mentionner si on le demande : CVE-2026-47884, accepté jusqu'à Spring Boot 4.

### A3. Publication de l'APK

Run : https://github.com/alizribi-bit/zawedniPFEproject/actions/runs/37132644183
(commit `b8ee4ed`, 03/10 15:16 UTC, branche `staging`, cible `stage.20.19.44.34.nip.io`).

| Capture | Quoi ouvrir | Résultat attendu | Fichier | Ce que ça prouve |
|---|---|---|---|---|
| Build + étapes | Job `build-apk`, étapes déroulées | Build APK Release, Upload GitHub Artifacts, Upload Azure Blob en vert | `A3-apk-run.png` | L'APK est construite et publiée par la CI |
| Artefact | Bas de la page du run, section *Artifacts* | `zawedni-apk-b8ee4ed…` présent | `A3-apk-artifact.png` | L'APK est téléchargeable depuis GitHub |
| Drive : **étape verte** | Étapes « Upload APK to Google Drive » et « Report Google Drive Upload Status » | Les deux en vert | `A3-drive-step.png` | **Seulement** que l'étape n'a pas fait échouer le job. Elle a `continue-on-error: true`, donc elle est verte même quand l'upload échoue. |
| Drive : **fichier réellement présent** | Le dossier Drive cible (lien dans l'e-mail de build, ou Drive → dossier des builds) | Un fichier APK daté du 03/10 vers 15:2x UTC | `A3-drive-file.png` | Que l'upload a vraiment eu lieu |

> **Point non vérifié :** les logs du job ne sont plus lisibles via `gh`, donc la ligne
> `Google Drive upload result: success|failure` n'a pas pu être relue. Seule la capture
> du fichier dans Drive prouve l'upload. Si le fichier manque, dire « étape verte,
> upload non confirmé ».

> **Urgent :** l'artefact GitHub `zawedni-apk-b8ee4ed…` **expire le 10/10/2026**, avant
> la soutenance. Le télécharger et faire `A3-apk-artifact.png` avant cette date.

### A4. Optionnel, faisable cluster arrêté (ACR tourne indépendamment d'AKS)

```bash
az acr repository show-tags --name zawedniacr --repository zawedni-backend --orderby time_desc --top 5 -o table
az acr repository show --name zawedniacr --image zawedni-backend:62c42e1d02f81db4725b3e35dc57fa1d7c2c1c0c-staging -o table
```

Résultat lu le 06/10 : digest `sha256:7cce45ffa937…`, créé le 03/10 16:01 UTC.
Fichier : `A4-acr-tag-backend.png`. C'est le maillon 2 de la traçabilité (B3).

---

## B — Au prochain démarrage manuel

Préalable : `az aks start -g zawedni-rg -n zawedni-aks`, puis `az aks get-credentials`.
Ensuite `kubectl get ingress -A` doit afficher `20.19.44.34`. Si l'IP a changé, s'arrêter :
il faut d'abord lancer `scripts/set-public-host.sh` dans le projet, c'est un autre chantier.

### B1. Application staging : connexion et parcours simple

| Étape | Quoi ouvrir | Résultat attendu | Fichier | Ce que ça prouve |
|---|---|---|---|---|
| Accueil | http://stage.20.19.44.34.nip.io | Landing page chargée | `B1-client-home.png` | Le client est servi par l'ingress |
| Connexion admin | http://stage.admin.20.19.44.34.nip.io, avec `admin@zawedni.com` et le mot de passe de `secrets-local/staging-admin-password` | Tableau de bord admin | `B1-admin-login.png` | Le secret scellé est déchiffré et utilisé (non testé jusqu'ici) |
| Parcours | Admin → liste des entreprises, puis une page de détail | Page qui charge sans erreur | `B1-admin-parcours.png` | L'API et la base répondent de bout en bout |

Staging n'a **aucun compte de démo** (choix de conception) : le marketplace peut être vide.
Ne pas cadrer de mot de passe à l'écran.

### B2. ArgoCD : applications, états et révisions

```bash
kubectl -n argocd port-forward svc/argocd-server 8443:443 &
argocd admin initial-password -n argocd
kubectl get applications -n argocd
```

- **Quoi ouvrir :** https://localhost:8443, utilisateur `admin`.
- **Résultat attendu :** `zawedni-platform`, `zawedni-monitoring` et `zawedni-staging` en Synced et Healthy. La révision de `zawedni-staging` doit être `dbc437f` ou plus récente.
- **Fichiers :** `B2-argocd-apps.png` pour l'UI, `B2-argocd-cli.txt` pour la sortie `kubectl`.
- **Ce que ça prouve :** le cluster suit Git. La prod est **configurée** (`k8s/bootstrap/40-prod.yaml`) mais **non déployée**, donc il y a 3 applications et non 4.

### B3. Traçabilité d'une même version (backend `62c42e1`)

| Maillon | Quoi ouvrir / commande | Valeur attendue | Fichier |
|---|---|---|---|
| 1. Run CI | Capture A1 | commit `62c42e1` | `A1-ci-backend-run.png` |
| 2. Tag ACR | Capture A4 | `zawedni-backend:62c42e1…-staging`, digest `7cce45ff…` | `A4-acr-tag-backend.png` |
| 3. Manifeste Git | https://github.com/alizribi-bit/zawedniPFEproject/commit/dbc437f (commit `ZAWEDNI CI Bot`) | `image: …zawedni-backend:62c42e1…-staging` | `B3-manifest-commit.png` |
| 4. Image exécutée | `kubectl -n zawedni-backend get pod -l app=zawedni-backend -o jsonpath='{.items[0].spec.containers[0].image}{"\n"}{.items[0].status.containerStatuses[0].imageID}{"\n"}'` | même tag, et `imageID` se terminant par `7cce45ff…` | `B3-running-image.txt` + `.png` |

**Ce que ça prouve :** il y a un seul SHA de bout en bout (BNF07), et c'est le bot CI qui fait la promotion, pas un `kubectl` manuel.
Le maillon 4 est le seul à faire cluster démarré. À la capture du 03/10 13:49, le pod tournait encore
l'image précédente (`a824afc2…`) : ne pas réutiliser cette capture pour ce maillon.

### B4. Prometheus : cibles backend et IA actives

```bash
kubectl -n zawedni-monitoring port-forward svc/kube-prometheus-kube-prome-prometheus 9090:9090 &
```

- **Quoi ouvrir :** http://localhost:9090/targets, filtré sur `zawedni`.
- **Résultat attendu :** `zawedni-backend` et `zawedni-ai` en **UP**.
- **Fichier :** `B4-prometheus-targets.png`.
- **Ce que ça prouve :** la collecte des métriques des deux services. **Ça ne prouve pas** que les alertes fonctionnent (voir C3).

### B5. Grafana : dashboard avec données réelles

```bash
kubectl -n zawedni-monitoring get secret kube-prometheus-grafana -o jsonpath='{.data.admin-password}' | base64 -d; echo
kubectl -n zawedni-monitoring port-forward svc/kube-prometheus-grafana 3000:80 &
```

- **Quoi ouvrir :** http://localhost:3000, utilisateur `admin`. Ouvrir le dashboard *Kubernetes / Compute Resources / Namespace (Pods)* sur le namespace `zawedni-backend`, période « Last 1 hour ».
- **Résultat attendu :** des courbes CPU et mémoire non vides pour `zawedni-backend` et `zawedni-ai`.
- **Fichier :** `B5-grafana-backend.png`.
- **Ce que ça prouve :** la chaîne de supervision affiche des données réelles du namespace applicatif.
- **À savoir :** aucun dashboard spécifique ZAWEDNI n'est versionné dans `k8s/`. Ce sont les dashboards livrés par le chart. Ne pas cadrer le mot de passe.
- **Loki n'est pas déployé** (retiré exprès) : pas de capture de logs Grafana.

### B6. APK installée : connexion à staging

| Étape | Quoi faire | Résultat attendu | Fichier |
|---|---|---|---|
| Installation | Installer l'APK du run 37132644183 (artefact ou Drive) sur un téléphone | App `com.example.zawedni` installée | — |
| Connexion | Se connecter avec le compte admin staging (le seul compte qui existe) | Écran d'accueil connecté, données chargées | `B6-apk-login.png` |
| Preuve réseau | Pendant la connexion : `kubectl -n ingress-nginx logs deploy/ingress-nginx-controller --since=2m \| grep stage.20.19.44.34` | Une requête `POST /api/auth/login` en 200 | `B6-apk-ingress-log.txt` |

**Ce que ça prouve :** l'APK publiée par la CI appelle bien l'hôte staging.
Si l'app mobile refuse le rôle ADMIN, noter « APK atteint staging (log ingress), connexion
UI non démontrable sans compte non-admin » plutôt que de créer un compte à la main.

---

## C — Vérifications séparées (pas des captures de démo)

À faire au même démarrage. Chacune a été vue en défaut ou n'a jamais été vérifiée.

1. **DNS (NetworkPolicy).** Relancer `scripts/verify-networkpolicies.sh staging` dans le projet. Le 03/10, le cas `backend → DNS` a échoué alors que le nom complet `zawedni-ai.zawedni-backend.svc.cluster.local` a été résolu dans la même sortie. C'est probablement le test qui est faux, pas la policy : à confirmer avant de citer « 11/11 ».
2. **Uploads.** `curl -sI http://stage.20.19.44.34.nip.io/uploads/inexistant.png` doit répondre **404**. Le 03/10 13:49, la réponse était **500**. Le correctif (`62c42e1`, `7a21eb7`) n'a jamais été vérifié sur le cluster.
3. **Alertes.** Une cible UP ne prouve pas qu'une alerte fonctionne. Le 03/10, `alert-bindings.txt` indiquait les 5 règles ZAWEDNI « NOT BOUND » alors que les cibles étaient UP. Il faut deux vérifications :
   - http://localhost:9090/rules : les 5 règles `Zawedni*` présentes et évaluées sans erreur ;
   - une alerte réellement déclenchée, par exemple en réduisant le backend à 0 réplique. **Ce n'est pas faisable sans enfreindre la règle GitOps** (pas de `kubectl scale` sur le cluster) : soit une PR dédiée dans `k8s/`, soit présenter les alertes comme « configurées, non déclenchées ».
4. **IP après stop/start.** Noter si `20.19.44.34` a survécu au redémarrage (préalable de B).
5. **E-mail OTP.** Déclencher « mot de passe oublié » sur staging et vérifier la réception. Cela valide le secret Gmail rescellé après l'erreur 535 du 03/10.

---

## Captures déjà disponibles (texte, dépôt `zawedniPFEproject`)

- `evidence/20261003-run-1349/` : `argocd-applications.txt`, `netpol-verify.txt`, `prometheus-targets.json`, `ingress-rules.txt`, `running-images.txt`, `ci-backend-steps.json`, `pods-all-namespaces.txt`. C'est l'état le plus récent du cluster.
- `evidence/20260906-0908-walkthrough/` : 8 captures texte de l'ancien cluster (IP `4.178.207.250`), à citer comme historique seulement.
- **Aucune capture PNG** d'ArgoCD, de Prometheus ou de Grafana n'existe. Toutes sont à faire en B.

## C — Ajouts v6 (10/10/2026), générés par `build/crop-v6.py`

| Fichier du deck | Source | Slide |
|---|---|---|
| `assets/v6-bmc.png`, `v6-bmc-segments.png`, `v6-bmc-valeur.png`, `v6-bmc-revenus.png` | BMC réel, annexe B du rapport (figure B.1), `~/Desktop/New Project/figures/annexeB_business-model-canvas.png` ; zooms découpés à l'intérieur des cadres | 7 |
| `assets/v6-sup-piliers.jpg` | `assets/originals-v3/sup-evaluation.png` (stack locale, 07/10), seulement la liste des piliers | 12, étape 0 |
| `assets/v6-sup-revue.jpg` | `zawedniPFEproject/design/audit/008/after/shots/sup-1440-light-fr_evaluation_status.png`, barre latérale coupée | 12, étape 2 |
| `assets/v6-mob-status_submitted.jpg` | `zawedniPFEproject/design/audit/008/after/mobile/M2/status_submitted_fr_light.png` (écran Flutter) | 12, étape 1 |

Les anciennes slides 12 (web) et 13 (mobile) sont fusionnées en une slide 12 ; aucune capture web d'une grille en cours de saisie n'existe. Photo de la pépinière d'entreprises de Mahdia : à fournir par Ali.
