# Discours de soutenance

`[clic]` = appuyer sur → . Parlez lentement : une phrase, une respiration.

---

## 1. Une chaîne DevSecOps amène le code de ZAWEDNI jusqu'au cloud

Bonjour à tous. Je m'appelle Ali Zribi. Merci aux membres du jury d'être là. Merci à nos encadrantes, Madame Amel Zidi et Madame Sana Ghannay, et à Madame Hadil Ben Masseoud, notre encadrante professionnelle. Le projet : conception et déploiement d'une plateforme web et mobile pour l'achat local, intégrant une approche DevOps. Le point vert, c'est un commit : une modification du code. On va suivre son voyage jusqu'au cloud.

---

## 2. ZAWEDNI relie des acheteurs et des fournisseurs locaux qui respectent des critères RSE

ZAWEDNI est une startup tunisienne, une SARL à Mahdia. On l'a fondée avec Madame Hadil Ben Masseoud. Mon rôle : fondateur et CTO.

**[clic]** C'est une plateforme B2B. Elle vise d'abord les hôtels et les maisons d'hôtes, comme acheteurs. Et des producteurs locaux et des artisans, comme fournisseurs, vérifiés avec des critères RSE : sociaux et environnementaux.

**[clic]** Le modèle envisagé : un abonnement, avec une offre gratuite. Les prix ne sont pas encore fixés.

---

## 3. Un fournisseur devient visible seulement après l'approbation de sa grille RSE

La plateforme a une règle centrale.

**[clic]** Le fournisseur remplit une grille RSE, et un administrateur la vérifie.

**[clic]** Si elle est approuvée, le fournisseur devient visible sur le marketplace. Sinon, il reste caché. La plateforme doit donc être livrée de façon fiable, sécurisée et surveillée.

---

## 4. La plateforme compte cinq composants et une base de données

Voici la plateforme.

**[clic]** Au centre, l'API en Spring Boot. Autour, deux sites React, pour les clients et pour l'administration. Une application mobile Flutter. Et un service d'IA en Python, avec FastAPI.

**[clic]** Les données sont dans PostgreSQL. Cinq composants à construire et à déployer.

---

## 5. Le PFE porte sur la chaîne autour de l'application, pas sur l'application

Une précision importante. L'application, on l'avait développée avant le projet. Elle ne fait pas partie du PFE.

**[clic]** Le projet de fin d'études porte sur la chaîne autour de l'application : l'empaqueter, la contrôler, la déployer dans le cloud, et la surveiller.

---

## 6. Au départ, le code tournait seulement sur un ordinateur

Au début du projet, le code marchait, mais seulement sur l'ordinateur du développeur. Aucun serveur, aucun environnement de test, aucune mise en ligne. Le compteur en bas affiche zéro contrôle de sécurité.

---

## 7. Quatre manques empêchaient de mettre la plateforme en production

On a trouvé quatre manques.

**[clic]** Un : pas de mise en ligne. Tout se faisait à la main.

**[clic]** Deux : pas de contrôle de sécurité.

**[clic]** Trois : pas d'infrastructure cloud, pas d'environnements séparés.

**[clic]** Quatre : pas de supervision. Si un service tombe, personne ne le voit.

---

## 8. La question est de livrer cinq services en sécurité, avec un budget de startup

D'où la question du projet. Comment livrer automatiquement une plateforme de cinq services ? Comment la sécuriser, et comment la surveiller ? Et tout cela avec le budget d'une startup qui n'a pas encore de revenu.

---

## 9. Le déploiement manuel et Jenkins ne suffisent pas pour cinq services

Avant de construire, on a comparé quatre approches.

**[clic]** Le déploiement manuel : c'est la situation de départ.

**[clic]** Une machine virtuelle avec Jenkins : ça automatise. Mais il faut gérer et sécuriser le serveur Jenkins lui-même. Et une seule machine n'isole pas les environnements.

---

## 10. GitHub Actions avec AKS couvre les quatre besoins, avec un crédit étudiant Azure

[clic] Azure DevOps et GitLab CI sont très bons, mais leurs offres gratuites sont limitées pour nous.

**[clic]** On a choisi GitHub Actions, gratuit pour notre usage, et AKS, le Kubernetes d'Azure. AKS est payé par le crédit Azure for Students : cent dollars. Le coût est estimé à trente-cinq ou quarante dollars par mois.

---

## 11. DevSecOps met la sécurité dans le pipeline, à chaque changement

L'approche s'appelle DevSecOps.

**[clic]** Le DevOps automatise le chemin du code jusqu'à la production. Mais souvent, la sécurité arrive à la fin. Là, corriger coûte cher.

**[clic]** Le DevSecOps place la sécurité dans le pipeline lui-même. Chaque changement est contrôlé automatiquement, comme un test.

---

## 12. Quinze besoins fonctionnels et sept non fonctionnels guident la chaîne

Ensuite, on a écrit les besoins : quinze fonctionnels, et sept non fonctionnels.

**[clic]** Trois exemples. BF05 : un contrôle de sécurité doit bloquer un problème critique. BF06 : le déploiement se fait avec GitOps. Et BNF07 : tout doit tenir dans un crédit de cent dollars.

---

## 13. La solution est une chaîne en trois zones : le poste, GitHub et Azure

Voici la solution, en une seule image.

**[clic]** Zone un : le poste du développeur. On code, et on pousse sur GitHub.

**[clic]** Zone deux : GitHub Actions. Le pipeline teste, contrôle, et construit l'image.

**[clic]** Zone trois : Azure. ArgoCD déploie sur le cluster AKS, et Grafana surveille. On va zoomer sur chaque zone.

---

## 14. Le travail a suivi Scrum : six sprints en trois releases, sur onze semaines

On a travaillé avec Scrum. Madame Hadil Ben Masseoud est la Product Owner, et les encadrantes académiques sont Scrum Master.

**[clic]** Trois releases : les fondations, la livraison, puis l'exploitation.

**[clic]** Le sprint six, en parallèle, vérifie les contrôles de sécurité.

---

## 15. Docker met chaque composant dans une image qui marche partout

Release un, sprint un : Docker. Docker met chaque composant dans une image. La même image marche sur l'ordinateur et dans le cloud.

**[clic]** La première étape du build compile, la deuxième garde seulement le résultat. Et en local, docker compose up lance toute la plateforme.

---

## 16. L'image IA tombe de plus de 4 Go à 928 Mo

[clic] Le backend fait 138 mégaoctets, les deux sites 30 et 26.

**[clic]** L'image IA dépassait quatre gigaoctets, à cause des outils pour carte graphique. Avec la version CPU de PyTorch, elle est tombée à 928 mégaoctets.

---

## 17. Terraform crée toute l'infrastructure Azure à partir de code

Sprint deux : l'infrastructure Azure, sans rien créer à la main.

**[clic]** On l'a écrite en code, avec Terraform.

**[clic]** terraform apply crée le cluster AKS avec deux nœuds, le registre ACR, et un stockage. Et on peut tout recréer à l'identique.

---

## 18. Un seul cluster porte deux environnements : staging et production

Dans le cluster, il y a deux environnements.

**[clic]** Staging, pour tester. Et production, pour les vrais utilisateurs. Chacun a ses propres namespaces : backend, frontend et données. Les deux partagent la supervision et ArgoCD. Un seul cluster, pour rester dans le budget.

---

## 19. Un jour, Azure a perdu notre adresse IP publique

Un jour, notre adresse IP publique ne répondait plus.

**[clic]** La panne venait du load balancer d'Azure. On l'a recréé, avec une nouvelle adresse.

**[clic]** Il a fallu mettre à jour les manifestes, le CORS, la CSP et le pare-feu.

---

## 20. La plateforme était en ligne, mais chaque mise à jour restait manuelle

À la fin de la release un, la plateforme était en ligne, en staging et en production. Voici les deux sites et les pods en marche.

**[clic]** Mais chaque mise à jour restait manuelle. C'est le travail de la release deux.

---

## 21. Cinq pipelines suivent chacun un composant, cinq autres surveillent tout le dépôt

Release deux : l'automatisation. Il y a dix pipelines.

**[clic]** Cinq suivent chacun un composant. Grâce aux path filters, si on modifie le backend, seul son pipeline se lance. Le mobile produit un APK, pas une image.

**[clic]** Les cinq autres sont transversaux : ils vérifient les secrets, le code, l'adresse publique, l'infrastructure et les workflows.

---

## 22. Mis bout à bout, les pipelines couvrent huit étapes, dont six contrôles de sécurité

Voici une vue de synthèse en huit étapes. Chaque pipeline prend celles qui le concernent.

**[clic]** Gitleaks cherche des secrets. SonarCloud et Semgrep analysent le code. Dependency-Check vérifie les bibliothèques. Checkov vérifie l'infrastructure. Docker construit l'image, Trivy la scanne, puis elle part dans ACR. Les tests de chaque composant tournent aussi.

**[clic]** Six contrôles de sécurité. Le compteur passe de zéro à six.

---

## 23. Gitleaks arrête le pipeline s'il trouve un secret dans le code

Voyons comment un contrôle arrête le pipeline. Premier exemple : Gitleaks.

**[clic]** S'il trouve un secret, comme un mot de passe, il renvoie une erreur, et le pipeline s'arrête. Rien n'est publié, et un rapport reste dans GitHub.

---

## 24. Dependency-Check bloque toute bibliothèque avec une faille critique

Deuxième exemple : Dependency-Check, pour les bibliothèques Java.

**[clic]** Dans le fichier pom.xml : failBuildOnCVSS égal à neuf. Le score CVSS mesure la gravité d'une faille, de zéro à dix. À neuf ou plus, la faille est critique, et le build échoue.

---

## 25. Trivy arrête une image avec une faille grave qui a déjà un correctif

Troisième exemple : Trivy, qui scanne l'image Docker.

**[clic]** Une faille HIGH ou CRITICAL arrête le pipeline. Mais une faille sans correctif ne bloque pas : c'est ignore-unfixed. Et deux exceptions sont écrites, avec une date de fin. Trivy réduit le risque, sans garantir zéro faille.

---

## 26. Sans protection de branche, un pipeline rouge n'empêche pas la fusion

Attention à ne pas confondre. Un pipeline rouge, c'est un échec. Une fusion interdite demande une protection de branche.

**[clic]** L'offre gratuite de GitHub ne la permet pas pour un dépôt privé. Alors c'est une règle d'équipe : on ne fusionne pas tant que c'est rouge.

---

## 27. Les secrets ne sont jamais écrits en clair dans Git

Un secret, c'est un mot de passe, une clé ou un token.

**[clic]** Pour le pipeline : les secrets GitHub, jamais affichés.

**[clic]** Pour l'application : des secrets Kubernetes, chiffrés dans le dépôt avec Sealed Secrets. Seul le cluster peut les ouvrir.

---

## 28. Le pipeline ne déploie pas : il change une seule ligne dans Git, ce qui est vérifié en staging

Sprint quatre : GitOps.

**[clic]** Le pipeline ne touche pas le cluster. Il change une ligne dans un fichier Kubernetes : le tag de la nouvelle image, avec le SHA du commit.

**[clic]** Puis il fait un commit dans Git. Ce chemin est vérifié sur staging. En production, il est prévu, mais pas encore démontré : le fichier garde le tag latest.

---

## 29. ArgoCD voit la différence et met le cluster à jour

[clic] ArgoCD tourne dans le cluster. Il compare Git et le cluster, et met à jour les pods s'il voit une différence. Staging suit la branche staging, la production suit main.

**[clic]** Sur la capture, les deux applications sont Synced et Healthy. La règle : tout passe par Git, jamais par kubectl.

---

## 30. Une correction passe par develop et staging avant la demande de fusion vers main

Voici le chemin d'une modification.

**[clic]** On code sur une branche feature, puis pull request vers develop. Semgrep se lance. Le mobile et la vérification des workflows, seulement si leurs fichiers changent. Aucune image n'est construite.

**[clic]** Puis pull request vers staging : tous les contrôles tournent. Après la fusion, ArgoCD déploie en staging, et on teste à la main. En cas d'anomalie, on corrige, et le nouveau commit refait le chemin.

**[clic]** Staging validé, pull request vers main : les mêmes contrôles tournent encore.

---

## 31. Prometheus collecte les métriques de treize cibles du cluster

Release trois : la supervision.

**[clic]** Prometheus collecte les métriques : CPU, mémoire, état des pods. Ici, treize cibles actives, du cluster et de la supervision.

---

## 32. Grafana montre les métriques et les journaux sur un seul écran

Loki collecte les journaux des pods, avec Promtail.

**[clic]** Grafana affiche les métriques et les journaux. Voici le tableau de bord du cluster. Les alertes email d'Alertmanager étaient prévues, mais pas vérifiées de bout en bout.

---

## 33. Deux limites restent : pas de métriques applicatives, et des NetworkPolicies non appliquées

Deux limites.

**[clic]** Un : les métriques des services ZAWEDNI n'étaient pas collectées. Les alertes sur l'application ne pouvaient donc pas se déclencher.

**[clic]** Deux : les NetworkPolicies, pour isoler les pods, étaient écrites. Mais sans le moteur réseau Calico, elles n'étaient pas appliquées.

---

## 34. Le sprint six vérifie si un contrôle bloque vraiment, ou s'il signale seulement

Sprint six : la vérification. La question est simple : quand un contrôle trouve un problème, est-ce qu'il arrête le pipeline ? Ou est-ce qu'il affiche seulement un message ? Les références sont le guide DevSecOps de l'OWASP et le cadre NIST SSDF.

---

## 35. La méthode tient en trois gestes : lire, casser exprès, réparer

La méthode a trois étapes.

**[clic]** Un : lire la configuration du contrôle.

**[clic]** Deux : ajouter une erreur exprès. Le pipeline doit devenir rouge.

**[clic]** Trois : retirer l'erreur. Le pipeline doit redevenir vert. Ça prouve que le rouge venait bien de l'erreur.

---

## 36. Dependency-Check a arrêté une bibliothèque log4j vulnérable

Un exemple réel.

**[clic]** On a ajouté log4j 2.14.1 au backend. Elle contient la faille Log4Shell. Dependency-Check a arrêté le pipeline.

**[clic]** On l'a retirée, et le pipeline est redevenu vert. Même test avec un faux secret pour Gitleaks, et avec une ancienne adresse IP.

---

## 37. Sur huit étapes, deux bloquent et sont testées, trois ne font que signaler

Voici le résultat du rapport, pour les huit étapes.

**[clic]** En vert plein : Gitleaks et Dependency-Check. Ils bloquent, et c'est testé.

**[clic]** En vert clair : Docker build, Trivy et ACR push. Ils bloquent dans la configuration, sans test réel.

**[clic]** En orange : SonarCloud, Semgrep et Checkov, notés comme simples rapports.

---

## 38. Six contrôles sont installés, mais sur staging seulement trois bloquent vraiment

Le compteur tombe. Sur le chemin de staging, sur six contrôles, seulement trois arrêtent le pipeline. Un contrôle installé ne bloque pas toujours.

**[clic]** Une précision sur SonarCloud. Sur staging, il ne bloque pas : l'offre gratuite ne garde pas cette analyse. Mais sur les pull requests et sur main, sa quality gate arrête le job. Là, le compteur monte à quatre.

---

## 39. Quatre exigences restent ouvertes, et chacune a une cause connue

La vérification montre aussi ce qui manque.

**[clic]** Pas de test dynamique OWASP ZAP. Pas de protection des branches. Pas de Falco ni d'OPA Gatekeeper. Pas de métriques de l'application.

**[clic]** Et pour le budget, le cluster a été arrêté : les preuves sont les captures des sprints.

---

## 40. Le commit fait maintenant tout le chemin jusqu'à staging, sans déploiement manuel

Pour conclure, revenons à notre commit. Au début, il restait sur l'ordinateur.

**[clic]** Maintenant, il est contrôlé dans GitHub Actions, publié dans ACR, déployé par ArgoCD et surveillé. Sans geste manuel. Ce trajet complet est vérifié jusqu'à staging.

---

## 41. En bilan, la plateforme est passée d'un ordinateur à une chaîne cloud contrôlée

Voici le bilan.

**[clic]** Déploiement : d'un ordinateur à AKS, avec ArgoCD, vérifié en staging. Infrastructure : Terraform. Automatisation : dix pipelines. Les captures le montrent.

**[clic]** Sécurité : six contrôles. Trois bloquent toujours, quatre sur les pull requests et main. Deux sont testés avec une vraie erreur. Supervision : en place, mais sans métriques de l'application ni alertes vérifiées.

---

## 42. La suite rend tous les contrôles bloquants, puis fait tester la chaîne par elle-même

Et la suite ?

**[clic]** À court terme : rendre Semgrep et Checkov bloquants, et protéger les branches.

**[clic]** À moyen terme : OWASP ZAP, Falco, les métriques de l'application, et des sauvegardes de la base.

**[clic]** À long terme : que la chaîne teste elle-même ses contrôles. Merci pour votre attention. Je suis prêt pour vos questions.

---

# Réserve : réponses aux questions (après la conclusion)

---

## 43. L'Ingress envoie chaque adresse vers le bon Service, puis vers les Pods

Une seule adresse IP publique arrive sur l'Ingress NGINX. L'Ingress lit le nom d'hôte et le chemin. Avec stage devant l'adresse, on va en staging. L'adresse seule, c'est la production. Le chemin /api va vers le backend, /ai vers le service IA, et le reste vers le site. Chaque Service est interne, de type ClusterIP. Derrière, il y a un seul Pod par service. Les environnements sont séparés par namespaces : zawedni pour staging, zawedni-prod pour la production. C'est une séparation logique, dans le même cluster. Les NetworkPolicies sont écrites, mais dans le rapport, elles n'étaient pas appliquées.

---

## 44. PostgreSQL garde ses données sur un disque persistant, mais aucune sauvegarde n'est automatisée

La base PostgreSQL 16 tourne dans un seul pod, avec un volume persistant de cinq gigaoctets sur un disque Azure. Si le pod redémarre, les données restent. Une précision : le rapport parle de StatefulSet, mais dans les fichiers, c'est un Deployment avec ce volume. Le mot de passe est dans un secret chiffré. Flyway est désactivé : Hibernate met à jour les tables. Et il n'y a aucune sauvegarde automatique : pas de pg_dump, pas de tâche planifiée. Si le disque est perdu, les données sont perdues. C'est le premier point à ajouter.

---

## 45. Avec GitOps, revenir en arrière veut dire revenir en arrière dans Git

En théorie, avec GitOps, on ne touche pas le cluster pour revenir en arrière. On fait un git revert. ArgoCD voit le changement et remet l'ancienne image. Mais ce retour en arrière n'a pas été testé. Pendant les sprints, le commit du pipeline échouait en silence, à cause d'une permission. Git ne savait donc pas quelle image tournait. Le correctif date du 6 septembre. Aujourd'hui, sur staging, chaque image a son SHA dans Git, donc un revert peut marcher. En production, le tag latest ne le permet pas encore. Et une leçon : un kubectl rollout undo à la main entre en conflit avec ArgoCD. Les pods sont créés puis détruits en boucle.

---

## 46. Chaque outil a été choisi face à des alternatives, avec le budget comme contrainte

Pour chaque outil, on a comparé plusieurs solutions. Azure, car le crédit étudiant ne demande pas de carte bancaire. Kubernetes, car c'est le standard, et AKS gère le plan de contrôle. GitHub Actions, car il n'y a aucun serveur à gérer. Terraform, car on voit le plan avant d'appliquer. ArgoCD plutôt que Flux, pour son interface. Loki plutôt que ELK, car il consomme peu de mémoire. Pour le budget : cent dollars de crédit. Les coûts sont des estimations : trente-cinq à quarante dollars par mois pour le cluster, environ cinq pour ACR. On n'a pas de mesure de consommation réelle, et pas d'alerte de budget. Donc on arrête le cluster quand on ne s'en sert pas.

---

## 47. Chaque workflow a ses propres contrôles, et trois contrôles ont été testés avec une vraie erreur

Voici le détail, workflow par workflow. Le backend a la chaîne la plus complète : Gitleaks, les tests JUnit, Dependency-Check, SonarCloud, Docker, Trivy, puis la publication. Les deux sites ont Gitleaks, les tests Vitest, Docker et Trivy. Le service IA a les tests pytest. Le mobile a flutter test. Il produit un APK : un artefact GitHub sur une pull request, et sur un push, un envoi dans le stockage Azure et sur Google Drive, avec un email. Checkov et Semgrep sont dans des pipelines à part, et font seulement un rapport. Sur une pull request, rien n'est publié : pas d'image dans ACR, pas de changement de manifeste. Trois contrôles ont été testés avec une vraie erreur : log4j pour Dependency-Check, un faux secret pour Gitleaks, et une ancienne adresse IP pour le contrôle de l'adresse publique. Le rapport ne donne pas de taux de couverture des tests.

---

## 48. Après le rapport, des corrections ont été faites, mais plusieurs points restent ouverts

Il faut séparer trois choses. Un : le rapport décrit l'état au commit 699b99f, le 7 septembre. Deux : à ce même commit, le code faisait déjà deux choses que le rapport ne décrit pas. SonarCloud bloquait sur les pull requests et sur main, mais pas sur staging. Et les secrets étaient chiffrés avec Sealed Secrets. Trois, après le rapport : le premier commit réussi du pipeline dans Git date du 3 octobre, sur staging. Le même jour, on a reconstruit un cluster plus petit : un seul nœud, avec staging et la supervision, sans la production. Là, Prometheus collecte les métriques du backend et de l'IA, et Calico applique les NetworkPolicies : dix tests réseau sur onze passent. Loki n'a pas été réinstallé. Pour la production, le déploiement GitOps d'une nouvelle version n'est pas démontré : rien n'a été fusionné vers main depuis le 3 septembre, et le fichier garde le tag latest. Il reste aussi OWASP ZAP, la protection des branches, Falco et OPA, les sauvegardes, et rendre Semgrep et Checkov bloquants.
