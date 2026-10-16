# Fiche privée : questions probables du jury (v6, 10/10/2026)

**Usage personnel. Jamais projetée.** Les questions et réponses ne sont pas dans le deck. Réponses courtes ; le « complément » ne se donne que si le jury insiste.

Faits vérifiés le 07/10/2026 dans le dépôt et `evidence/`, puis harmonisés le 09/10/2026 avec le rapport final (`~/Desktop/New Project/main.pdf`, sections 3.2, 6.1 et 6.3) et avec les sections finales de `~/Desktop/zawedniPFEproject/BILAN_CORRECTIONS_ZAWEDNI.md` (déploiement de la production du 08/10 au soir, ajouts du 09/10). Pour l'état de la production, ces sections finales priment. Ajouts du 10/10 (v6 du deck) : test d'exemple, périmètre de Gitleaks, rôles acheteur/fournisseur, DNS, BMC (questions 7 ter à 7 sexies, 20 et 33 ter), vérifiés dans le dépôt `zawedniPFEproject` sans rien exécuter.

---

## Contribution et développement

1. **Qu'avez-vous réalisé vous-même ?**
J'ai développé la plateforme : les deux sites React, l'application Flutter, l'API Spring Boot, le service d'IA FastAPI et le modèle de données PostgreSQL. Ensuite, j'ai intégré la chaîne : images Docker, Terraform, dix pipelines, GitOps, secrets, supervision, et la vérification des contrôles.

2. **Pourquoi « 85 % » ?**
C'est une estimation de l'avancement du développement au moment où la chaîne a été intégrée, pas une mesure. Le développement a continué ensuite (refonte de l'interface, devis sur mobile en octobre).

3. **Que fait exactement l'IA ?**
Le service FastAPI calcule le bilan carbone (scopes 1, 2, 3) et l'analyse RSE de façon déterministe. Un modèle de langage, appelé via Groq, rédige le guide RSE et le texte du rapport ESG. Les chiffres du rapport viennent de la base, pas du modèle. Seule l'API appelle ce service, avec une clé.
*Complément :* un classement sémantique existe dans le service, mais aucune interface ne l'appelle encore. Pas de pgvector.

4. **Comment le score d'achat local est-il calculé ?**
Pour chaque transaction confirmée : 60 % selon la distance (0 au-delà de 100 km), 40 % selon le type de fournisseur (artisan ou TPE au maximum). Moyenne sur les transactions vérifiées de l'acheteur.

5. **Comment vérifie-t-on un certificat ?**
Le QR code mène à une page publique `/v/<numéro>` qui interroge l'API sans compte.

6. **Le mobile fait-il tout ce que fait le web ?**
Non. Il couvre le score, la grille, la revue, la marketplace, les transactions, le carbone et l'ESG. Trois actions de confirmation des transactions appellent encore des routes absentes de l'API (`transaction_service.dart`) : à corriger. Les devis sur mobile sont arrivés sur `develop` le 07/10. Il n'a pas d'écran de vérification de certificat : le QR mène à la page web.

7. **Les tests couvrent-ils tout ?**
Non. Le deck montre des comportements testés, pas des nombres. Si on demande un ordre de grandeur : le 09/10 sur `origin/staging`, environ 460 déclarations `@Test` (JUnit), 760 tests Vitest pour le site client, 17 pour l'administration, 27 pytest et 540 tests Flutter (comptage des déclarations, pas une mesure de couverture). L'administration est le point faible. SonarCloud exige 80 % de couverture sur le nouveau code avant main : la promotion du 08/10 a d'abord été refusée (71,9 %), puis acceptée après des tests ciblés (86,6 %), sans exclure de code écrit à la main. Les corrections ont aussi été rejouées sur staging (25 vérifications, 0 échec le 08/10).

7 bis. **Comment la grille conditionne-t-elle l'accès au marché ?**
Le filtre `GridCheckFilter` de l'API vérifie, à chaque requête vers certaines routes du marché (fiche d'une entreprise, recherche de produits, déclaration de transaction, envoi de message, favoris), que l'entreprise a une grille au statut `APPROVED` dans PostgreSQL. Sinon : 403 `GRID_REQUIRED`.
*Complément :* dans le code, ce contrôle vise le rôle fournisseur ; les rôles administrateur, acheteur et utilisateur d'entreprise passent ce filtre. Les autres droits restent contrôlés par les rôles et les vérifications de propriété. Je ne dis donc pas que « toute la plateforme » est bloquée.

7 ter. **Quel test montrez-vous sur la slide des tests ?**
`EmployeeServiceOwnershipTest` (API, JUnit, Mockito). L'employé 2 appartient à l'entreprise 4. Une modification demandée par l'entreprise 6 lève une `ResponseStatusException` 404, le prénom reste « Old » et `save` n'est jamais appelé ; même chose pour la suppression (l'employé reste actif). Deux tests vérifient que la propriétaire peut modifier et désactiver. Origine : la correction P3 de `BILAN_CORRECTIONS_ZAWEDNI.md`. La slide montre le rôle du test (continuer ou arrêter), pas une nouvelle exécution.

7 quater. **Gitleaks analyse-t-il tout l'historique ?**
Non. Les pipelines de composant analysent les commits de la PR ou du push (`gitleaks git` sur la plage de commits) ; sur staging → main et sur main, ils analysent l'arbre de travail (`gitleaks dir`). `ci-secrets` analyse l'arbre de travail du dépôt. Un inventaire de l'historique a été fait une fois, à la main. Bloquant partout (`--exit-code 1`). D'où la phrase « présents dans le code ».

7 quinquies. **Acheteur et fournisseur ont-ils vraiment les mêmes fonctions ?**
Pour ce qui est présenté (évaluation, résultats et certificat, marché, guide pour une stratégie RSE, rapport ESG, carbone, devis, transactions), oui : les routes acceptent les deux rôles. Différences dans le code : le filtre de grille ne vise que le fournisseur ; la confirmation d'une transaction et l'ajout d'utilisateurs sont réservés au fournisseur ; l'ancien questionnaire et l'envoi de certifications excluent l'acheteur ; « devis reçus » est masqué pour l'acheteur dans l'interface seulement. Le mobile n'a pas d'interface administrateur.

7 sexies. **La capture web de la première étape montre un score : la grille n'est-elle pas déjà remplie ?**
Oui : il n'existe pas de capture web d'une grille en cours de saisie (le compte de démonstration avait déjà une évaluation validée). La slide montre donc les piliers de la grille sur le web et une question sur le mobile.

## Chaîne CI/CD

8. **L'image qui tourne est-elle celle qui a été testée ?**
Le même identifiant `62c42e1` apparaît dans le run, le tag ACR, le manifeste et le pod staging.
*Complément :* c'est une correspondance d'identifiants, pas une signature. Pour le backend, une étape vérifie aussi que l'image contient le jar testé (même empreinte sha256).

9. **Ce changement est-il passé par une pull request ?**
Non, `62c42e1` a été poussé directement sur staging. Sur une PR, les mêmes contrôles tournent sans publication (exemple : PR #19 du 06/10).

10. **Que lance un push sur develop ?**
Les jobs sont sautés ; seul `ci-workflow-guards` tourne si les workflows ou `k8s/` changent. Une PR vers develop lance Semgrep, et le mobile si ses fichiers changent.

11. **SonarCloud bloque-t-il ?**
Sur les pull requests et sur main, le pipeline attend la quality gate (condition `SONAR_WAIT`). Sur un push staging, non. SonarCloud ne tourne que pour l'API.

12. **Un pipeline rouge empêche-t-il la fusion ?**
Pas automatiquement. La protection de branche n'est pas disponible pour un dépôt privé avec l'offre gratuite de GitHub. La consigne d'équipe (ne pas fusionner en rouge) n'est pas équivalente à une protection : c'est une perspective (offre adaptée ou dépôt public).

13. **Trivy laisse-t-il passer des failles ?**
Il bloque HIGH et CRITICAL quand un correctif existe (`ignore-unfixed`). Exceptions documentées et datées. Le 08/10, il a bloqué deux CVE publiées le jour même : `tiff` (images web) corrigée par mise à jour du paquet ; Spring CVE-2026-47890 exemptée jusqu'au 31/12/2026, avec une condition d'inapplicabilité vérifiée à chaque build (son correctif impose Spring Boot 4). Il réduit le risque ; il ne promet pas zéro faille.

14. **Dependency-Check a-t-il des exceptions ?**
Oui, 7 suppressions datées dans `dependency-check-suppressions.xml`. L'une expire le **31/10/2026** : après cette date, le job peut repasser au rouge tout seul.

15. **Semgrep et Checkov ?**
Ils produisent des rapports. Semgrep tourne sans `--error` ; Checkov est en `continue-on-error`. Les rendre bloquants fait partie des perspectives.

16. **Le mobile est-il déployé ?**
Il produit un APK, pas un pod. Sur push, l'APK est déposé dans Azure Blob : le fichier se télécharge sans compte et son empreinte SHA-256 est identique à l'artefact du pipeline. Azure Blob est le canal retenu ; Google Drive a été abandonné (décision du 09/10 : le dossier était un My Drive personnel, sans quota pour un compte de service). Le push sur main construit aussi l'APK qui vise l'API de production. L'application fonctionne ; aucune campagne formelle de tests sur téléphone n'est documentée, c'est une précision de preuve, pas une panne.

17. **La production est-elle déployée ?**
Oui, dans le même cluster, sur un second nœud, par l'Application ArgoCD `zawedni-prod` qui suit `k8s/prod` sur main. Elle est Synced et Healthy ; les empreintes des quatre images correspondent à ACR. Deux nœuds Standard_B2as_v2 ; la production tourne sur le second. Vérifié le 08/10 au soir : isolement (secrets, PVC de données, d'uploads et de sauvegarde propres à la prod ; un jeton de staging est refusé en prod et inversement, 401) ; surface HTTP (`/api/companies` anonyme 401, actuator et swagger 401) ; parcours fournisseur/acheteur avec des données AUDIT-PROD (inscriptions, approbations, IDOR refusés, grille approuvée, certification, insights 200, logo servi par `/uploads`, produit, transaction visible par l'admin), puis données masquées ou désactivées ; cibles Prometheus `up=1`, cinq règles prod chargées, journaux prod dans Loki ; un Job de sauvegarde prod terminé (120 273 octets).
*Guide RSE via l'API :* 503 pour une entreprise sans ville avant la PR #43 ; après le déploiement de c9766c7, 200 en FR (3,4 s) et en EN (16,3 s). Un troisième appel rapproché a donné 503 parce que Groq (palier gratuit) a renvoyé 429 ; 200 lors d'un nouvel essai. Le guide répond toujours en français (le prompt ignore la langue) ; testé via le chemin admin, le chemin propriétaire n'a pas été rejoué après le correctif.
*Alertes en prod :* une alerte synthétique de test a été envoyée (FIRING puis RESOLVED, 0 échec). Réception confirmée par Ali le 09/10 : e-mails anglais FIRING (00:05, heure de Tunis) et RESOLVED (00:09) de l'alerte `InfoInhibitor`. C'est une alerte technique qui ne devrait pas partir par e-mail (défaut non corrigé). Ne pas la confondre avec le test `ZawedniHighErrorRate` de staging.
*Restent ouverts :* restauration testée en production, HTTP sans TLS, profil Spring `dev` en production, arrêt nocturne du cluster qui arrête aussi la prod.
*Défauts corrigés pendant le déploiement :* NetworkPolicy copiée de staging (#41/#42) ; `strategy: Recreate` parce que le PVC d'uploads est RWO et que le RollingUpdate créait un Multi-Attach sur deux nœuds (#44).

18. **Un retour arrière a-t-il été testé ?**
Non. Un `git revert` du manifeste staging est possible, mais pas testé. À éviter : `kubectl rollout undo` à la main, ArgoCD le corrige aussitôt.

19. **Tout passe-t-il par Git ?**
Les mises à jour de l'application, oui. L'amorçage des applications ArgoCD (`k8s/bootstrap`) s'applique à la main, dans un ordre documenté ; c'était le cas de Loki et Alloy le 07/10.

## Architecture et sécurité

20. **Les NetworkPolicies fonctionnent-elles ?**
Calico les applique. 12 règles par environnement. Le script de contrôle donne 10 résultats conformes sur 11 (03/10, puis à nouveau le 07/10). Le 11e, le DNS depuis l'API, n'est pas une panne : la commande `nslookup` du test interroge le nom court, Kubernetes ajoute des suffixes de recherche, et une de ces tentatives renvoie une erreur (NXDOMAIN, code 1) alors que le nom est bien résolu. Le 07/10, le même essai avec le nom complet (FQDN) renvoie une adresse (`evidence/20261007-audit-final/cluster/netpol-dns-and-uids.txt`) ; l'audit final conclut à un faux négatif de la sonde (`AUDIT_FINAL_ZAWEDNI.md`, K4). Le script n'a pas été corrigé : je ne dis donc ni « DNS cassé » ni « 11 sur 11 ». Le 07/10, un pod non autorisé ne joignait pas Loki.
*Pour comprendre :* le DNS permet à un service de retrouver l'adresse IP d'un autre service à partir de son nom (documentation Kubernetes : DNS for Services and Pods ; Debug Services).

21. **Y a-t-il des sauvegardes ?**
Oui. Un CronJob fait un `pg_dump` quotidien, garde les sept dernières sauvegardes sur un volume de 2 Gio, et des NetworkPolicies limitent la tâche à la base. Sur staging, une sauvegarde a été restaurée dans un PostgreSQL isolé : 39 tables, mêmes nombres d'enregistrements que l'API. Une copie a été déposée à la main dans un conteneur Blob privé, puis restaurée. En production, un Job de sauvegarde lancé depuis le CronJob s'est terminé ; sa restauration n'a pas été testée.
*Limite :* la copie hors du cluster n'est pas automatisée. Un volume persistant et une sauvegarde sont deux choses différentes.

21 bis. **Le schéma de la base est-il versionné ?**
Pas encore : Hibernate met le schéma à jour ; les migrations Flyway ne sont pas activées. C'est une perspective à court terme.

22. **StatefulSet ?**
Non : PostgreSQL est un Deployment avec un volume.

23. **HTTPS ?**
Non. L'Ingress n'a pas de TLS. C'est la première priorité de sécurité.

24. **Zéro coupure ?**
Non garanti : une réplique, pas de PDB, aucune mesure.

25. **Combien coûte Azure ?**
Pas de mesure de consommation. Le crédit étudiant est de 100 $ ; on arrête le cluster entre les sessions de test.

26. **Pourquoi nip.io ?**
Un nom d'hôte sans acheter de domaine, pour que l'Ingress sépare le site client et l'administration.

27. **Les images tournent-elles en non-root ?**
L'API et l'IA, oui. Les deux sites (nginx), non : c'est dans la liste à faire.

## Supervision

28. **Les alertes fonctionnent-elles ?**
Cinq règles sont chargées et saines. Une seule a été déclenchée le 07/10 : `ZawedniHighErrorRate`, avec e-mails FIRING et RESOLVED reçus. Les quatre autres n'ont pas été déclenchées.
*Complément :* avant le 07/10, Alertmanager n'avait aucun destinataire ; c'est corrigé (PR #21). Depuis le 08/10, les e-mails existent en anglais, français et arabe, avec la notification de résolution, et la production a son propre récepteur. Réception confirmée en production pour l'anglais (voir 17, `InfoInhibitor`) ; la réception des tests synthétiques de staging n'a pas été confirmée.

29. **Loki est-il installé ?**
Oui depuis le 07/10 (Loki 3.6, Alloy 1.20), avec le tableau de bord « ZAWEDNI — Journaux ». Rétention 7 jours, volume 5 Go.

30. **Les métriques sont-elles conservées ?**
Prometheus et Alertmanager n'ont pas de volume persistant : l'historique se perd au redémarrage. C'est une perspective.

31. **Qu'est-ce qui n'est pas validé ?**
La restauration en production, le TLS et le profil de production (voir 17) ; la conservation des journaux après un arrêt puis un redémarrage du cluster ; le déclenchement réel de quatre des cinq règles d'alerte ; la copie externe automatique des sauvegardes ; une campagne formelle de tests sur téléphone.

32. **Pourquoi une erreur 500 pour le test d'alerte ?**
À ce moment, un identifiant non numérique sur `/api/public/companies/{id}` renvoyait 500. Cette requête en lecture seule a servi à provoquer l'alerte sans modifier de données. Ce défaut a ensuite été corrigé : la réponse est maintenant 400.

## Contexte

33. **Modèle économique ?**
Un SaaS B2B par abonnement, avec une offre d'entrée gratuite. Le BMC retient abonnements, publicité et services premium ; le cahier des charges propose Starter (gratuit), Business, Pro Export et Enterprise. Ce sont des revenus prévus, aucun n'est acquis.

33 bis. **Qui a eu l'idée, et quel est le rôle de Hadil Ben Masseoud ?**
Nous avons fondé ZAWEDNI à deux et défini ensemble le besoin et la proposition de valeur. Dans le mémoire, elle est mon encadrante professionnelle (mention administrative) ; la réalisation technique est la mienne : conception et développement de la plateforme, puis infrastructure, livraison, sécurité et supervision.

33 ter. **Le BMC parle de « matching intelligent » : est-il en place ?**
Le BMC (annexe B) exprime la vision de la startup. Dans la plateforme actuelle, le classement sémantique existe côté service d'IA mais rien ne l'appelle : je ne le présente pas comme une fonction livrée. C'est pour cela que je ne lis pas cette ligne sur la slide.

34. **Pourquoi GitHub Actions et AKS, pas Jenkins ou un autre cloud ?**
Le dépôt était déjà sur GitHub, sans serveur CI à entretenir. AKS est un Kubernetes géré, payé par le crédit étudiant, et compatible avec Terraform et ACR. Jenkins, GitLab CI ou Azure Pipelines étaient possibles.

---

## Exigences (préparation orale)

Légende : **D** démontré · **P** partiel ou configuré · **N** non réalisé.

| Exigence | État | Limite |
|---|---|---|
| BF01 Conteneurisation | D | le mobile produit un APK, pas d'image |
| BF02 Environnement local | D | — |
| BF03 Provisionnement Terraform | D | cluster recréé le 03/10 |
| BF04 Déclenchement par composant | D | filtres de chemins |
| BF05 Contrôles automatisés | P | Gitleaks, Dependency-Check, Trivy bloquent ; Sonar sur PR et main ; Semgrep et Checkov en rapport |
| BF06 GitOps | D | staging et production (zawedni-prod) ; parcours prod rejoués le 08/10 |
| BF07 Isolation | P | NetworkPolicies 10/11 ; DNS : nom résolu (FQDN, 07/10), commande de test à corriger ; monitoring et ingress-nginx sans refus par défaut |
| BF08 OWASP ZAP | N | perspective |
| BF09 Supervision des métriques | D | API et IA collectées |
| BF10 Centralisation des journaux | D en staging | depuis le 07/10 |
| BF11 Alertes | P | 1 règle sur 5 déclenchée de bout en bout |
| BF12 Menaces à l'exécution | N | Falco, OPA : perspectives |
| BF13 Secrets | D | Sealed Secrets, secrets GitHub |
| BF14 APK | D | Azure Blob, canal retenu (Drive abandonné) ; pas de campagne formelle sur téléphone |
| BF15 Communications et images | P | pas de TLS ; sites en root |
| BNF01 Performance | P | durées de pipeline seulement |
| BNF02 Disponibilité | N | une réplique |
| BNF03 Scalabilité | N | pas de HPA |
| BNF04 Maintenabilité | P | amorçage manuel ; commits directs sur staging |
| BNF05 Portabilité | P | images standard ; pas d'essai sur un autre cluster |
| BNF06 Traçabilité | D en staging | correspondance d'identifiants |
| BNF07 Coût | P | aucune mesure de consommation |
