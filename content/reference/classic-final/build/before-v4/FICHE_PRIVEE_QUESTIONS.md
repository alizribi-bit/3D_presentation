# Fiche privée : questions probables du jury (v3, 07/10/2026)

**Usage personnel. Jamais projetée.** Les questions et réponses ne sont pas dans le deck. Réponses courtes ; le « complément » ne se donne que si le jury insiste.

Faits vérifiés le 07/10/2026 dans le dépôt (`origin/staging` 49839ac, workflows identiques sur 51dd6ed) et dans `evidence/`.

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
Non. Environ 180 tests JUnit, 760 Vitest pour le site client, 27 pytest, 540 tests Flutter. L'administration n'a presque pas de tests : c'est à compléter. Pas de chiffre de couverture présenté.

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
Non. La protection de branche n'est pas disponible pour un dépôt privé avec l'offre gratuite de GitHub. Règle d'équipe : on ne fusionne pas tant que c'est rouge.

13. **Trivy laisse-t-il passer des failles ?**
Il bloque HIGH et CRITICAL quand un correctif existe (`ignore-unfixed`). Deux exceptions documentées, valables jusqu'au 24/02/2027. Il réduit le risque ; il ne promet pas zéro faille.

14. **Dependency-Check a-t-il des exceptions ?**
Oui, 7 suppressions datées dans `dependency-check-suppressions.xml`. L'une expire le **31/10/2026** : après cette date, le job peut repasser au rouge tout seul.

15. **Semgrep et Checkov ?**
Ils produisent des rapports. Semgrep tourne sans `--error` ; Checkov est en `continue-on-error`. Les rendre bloquants fait partie des perspectives.

16. **Le mobile est-il déployé ?**
Non, il produit un APK : artefact GitHub à chaque run ; sur push, envoi vers le stockage Azure (`apk-releases`), Google Drive (non bloquant) et e-mail. L'APK de staging vise `http://stage.<adresse>`, sans HTTPS.

17. **Pourquoi la production n'est-elle pas déployée ?**
Le cluster actuel a un seul nœud, pour le coût : staging et la supervision. La production est décrite dans Git (manifestes encore en `:latest`) ; sa promotion GitOps n'a pas été démontrée.

18. **Un retour arrière a-t-il été testé ?**
Non. Un `git revert` du manifeste staging est possible, mais pas testé. À éviter : `kubectl rollout undo` à la main, ArgoCD le corrige aussitôt.

19. **Tout passe-t-il par Git ?**
Les mises à jour de l'application, oui. L'amorçage des applications ArgoCD (`k8s/bootstrap`) s'applique à la main, dans un ordre documenté ; c'était le cas de Loki et Alloy le 07/10.

## Architecture et sécurité

20. **Les NetworkPolicies fonctionnent-elles ?**
Calico les applique. 12 règles par environnement. Le 03/10, 10 tests sur 11 conformes ; le cas DNS depuis l'API reste à clarifier. Le 07/10, un pod non autorisé ne joignait pas Loki.

21. **Y a-t-il des sauvegardes ?**
Non. Les volumes sont persistants (5 Go pour PostgreSQL, 5 Go pour les fichiers), mais ce n'est pas une sauvegarde.

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
*Complément :* avant le 07/10, Alertmanager n'avait aucun destinataire ; c'est corrigé (PR #21). Les alertes e-mail ne concernent que staging.

29. **Loki est-il installé ?**
Oui depuis le 07/10 (Loki 3.6, Alloy 1.20), avec le tableau de bord « ZAWEDNI — Journaux ». Rétention 7 jours, volume 5 Go.

30. **Les métriques sont-elles conservées ?**
Prometheus et Alertmanager n'ont pas de volume persistant : l'historique se perd au redémarrage. C'est une perspective.

31. **Qu'est-ce qui n'est pas validé ?**
La production ; un arrêt puis redémarrage du cluster ; la tenue sur plusieurs jours (observée environ 40 minutes) ; quatre des cinq règles d'alerte.

32. **Pourquoi une erreur 500 pour le test d'alerte ?**
Un identifiant non numérique sur `/api/public/companies/{id}` renvoie 500 au lieu de 400. C'est un défaut connu, utilisé pour provoquer l'alerte sans rien modifier ; la correction est simple.

## Contexte

33. **Modèle économique ?**
Un abonnement, avec une offre d'entrée gratuite. Les prix ne sont pas fixés : c'est une proposition, pas un revenu.

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
| BF06 GitOps | D en staging | production non démontrée |
| BF07 Isolation | P | NetworkPolicies 10/11, DNS à clarifier ; production non déployée |
| BF08 OWASP ZAP | N | perspective |
| BF09 Supervision des métriques | D | API et IA collectées |
| BF10 Centralisation des journaux | D en staging | depuis le 07/10 |
| BF11 Alertes | P | 1 règle sur 5 déclenchée de bout en bout |
| BF12 Menaces à l'exécution | N | Falco, OPA : perspectives |
| BF13 Secrets | D | Sealed Secrets, secrets GitHub |
| BF14 APK | D | Drive non prouvé |
| BF15 Communications et images | P | pas de TLS ; sites en root |
| BNF01 Performance | P | durées de pipeline seulement |
| BNF02 Disponibilité | N | une réplique |
| BNF03 Scalabilité | N | pas de HPA |
| BNF04 Maintenabilité | P | amorçage manuel ; commits directs sur staging |
| BNF05 Portabilité | P | images standard ; pas d'essai sur un autre cluster |
| BNF06 Traçabilité | D en staging | correspondance d'identifiants |
| BNF07 Coût | P | aucune mesure de consommation |
