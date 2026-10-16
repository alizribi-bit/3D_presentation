# Discours de soutenance

`[clic]` = appuyer sur → . Parlez lentement : une phrase, une respiration.

---

## 1. Une chaîne DevSecOps amène le code de ZAWEDNI jusqu'au cloud

Bonjour à tous. Je m'appelle Ali Zribi. Je remercie les membres du jury, nos encadrantes, Madame Amel Zidi et Madame Sana Ghannay, et Madame Hadil Ben Masseoud, notre encadrante professionnelle. Je vais vous présenter la chaîne DevSecOps construite pour la plateforme ZAWEDNI. Le point vert, c'est un commit : une modification du code enregistrée dans Git. On va suivre son voyage jusqu'au cloud.

---

## 2. ZAWEDNI relie des acheteurs et des fournisseurs locaux vérifiés par une grille RSE

ZAWEDNI est une startup tunisienne qui développe une plateforme B2B d'achat local.

**[clic]** D'un côté, des acheteurs, comme des hôtels et des maisons d'hôtes. De l'autre, des producteurs locaux et des artisans. Un fournisseur devient visible seulement après la validation de sa grille RSE, sur des critères sociaux et environnementaux.

---

## 3. Au départ, le code tournait sur un seul ordinateur, avec quatre manques

Au départ, l'application fonctionnait, mais seulement sur un ordinateur, sans aucune analyse de sécurité automatique.

**[clic]** Il n'y avait pas de mise en ligne automatique,

**[clic]** pas de contrôle de sécurité,

**[clic]** pas d'infrastructure cloud ni d'environnement de test,

**[clic]** et pas de supervision : si un service tombait, personne ne le voyait.

---

## 4. La question : livrer cinq composants en sécurité, avec un budget de startup

D'où la question du projet : comment livrer automatiquement cinq composants, les sécuriser et les surveiller, avec le budget d'une startup ?

**[clic]** On l'a traduite en quinze besoins fonctionnels et sept non fonctionnels. Par exemple, un contrôle doit bloquer un problème critique, et l'infrastructure doit tenir dans un crédit étudiant de cent dollars.

---

## 5. Mon travail dans ce PFE est la chaîne autour de l'application, qui existait déjà

L'application existait avant le PFE : une API Spring Boot, deux sites React, une application mobile Flutter, un service d'IA et une base PostgreSQL.

**[clic]** Mon travail dans ce PFE, c'est la chaîne autour de l'application : préparer les images, créer l'infrastructure, contrôler chaque changement, déployer, surveiller, puis vérifier que les contrôles fonctionnent.

---

## 6. Le travail a suivi Scrum : six sprints en trois releases

Le travail a suivi Scrum. Madame Ben Masseoud est Product Owner, et les encadrantes académiques sont Scrum Master.

**[clic]** Il y a six sprints, regroupés en trois releases : les fondations, la livraison, puis l'exploitation.

**[clic]** Le sprint six vérifie les contrôles de sécurité, en parallèle des autres.

---

## 7. GitHub Actions automatise les contrôles ; AKS héberge les services

On a fait deux choix.

**[clic]** Pour les tests et les constructions, GitHub Actions : le dépôt est déjà sur GitHub, et on n'a pas de serveur CI à entretenir.

**[clic]** Pour exécuter les services, AKS : Azure gère Kubernetes, et on dispose du crédit étudiant. Ces choix répondent aux besoins du projet.

---

## 8. DevSecOps place les analyses de sécurité dans le pipeline, à chaque changement

Pour la sécurité, on a suivi l'approche DevSecOps.

**[clic]** Souvent, la sécurité arrive à la fin, quand corriger coûte cher.

**[clic]** Ici, les analyses sont dans le pipeline : chaque changement est vérifié automatiquement, comme un test.

---

## 9. La chaîne a trois zones : le poste, GitHub et Azure

Voici l'architecture en une image.

**[clic]** Sur le poste du développeur, on code et on pousse le commit vers GitHub.

**[clic]** Dans GitHub Actions, le pipeline teste, analyse et construit les images.

**[clic]** Dans Azure, ArgoCD déploie sur le cluster Kubernetes, et Prometheus et Grafana le surveillent. Prenons chaque brique, avec la raison du choix.

---

## 10. Docker met chaque service serveur dans une image qui tourne partout

Pour que le code tourne de la même façon partout, on utilise Docker.

**[clic]** Chaque service serveur devient une image, avec tout ce qu'il faut pour le lancer. Docker Compose lance toute la plateforme en local.

**[clic]** L'image du service d'IA dépassait quatre gigaoctets ; avec PyTorch en version CPU, elle passe à 928 mégaoctets. Le mobile, lui, produit un APK.

---

## 11. Terraform décrit l'infrastructure Azure dans du code

Pour créer l'infrastructure Azure sans clics manuels, on utilise Terraform.

**[clic]** Le cluster AKS, le registre d'images ACR et le stockage sont décrits dans du code.

**[clic]** On relit le plan avant de l'appliquer, et le même code peut recréer l'ensemble.

---

## 12. Le cluster prévoit deux environnements : staging est déployé, la production est seulement configurée

Kubernetes organise les conteneurs : il les lance, les relance et les relie. AKS est le service Kubernetes géré par Azure.

**[clic]** Dans le cluster, deux environnements sont prévus, séparés par des namespaces, c'est-à-dire des espaces logiques. Staging est déployé, et c'est lui qu'on a testé. La production est décrite dans la configuration, mais elle n'est pas déployée sur le cluster actuel.

---

## 13. Le chemin prévu d'un changement passe par develop et staging avant main

Suivons un changement sur le chemin prévu.

**[clic]** Sur une branche feature, on ouvre une pull request vers develop : Semgrep fait une première analyse, sans construire d'image.

**[clic]** Une pull request vers staging lance les contrôles liés aux fichiers modifiés. Après la fusion, la version arrive en staging, et on la teste.

**[clic]** La pull request vers main mènera à la production : cette étape est prévue, pas encore réalisée.

---

## 14. Cinq pipelines suivent un composant chacun, cinq autres vérifient tout le dépôt

Dix pipelines existent.

**[clic]** Cinq suivent chacun un composant, grâce aux filtres de chemins. Sur une pull request vers staging, une modification du backend lance son pipeline. Des contrôles communs au dépôt peuvent s'ajouter.

**[clic]** Les cinq autres vérifient tout le dépôt : les secrets, le code, l'adresse publique, l'infrastructure et les workflows.

---

## 15. Après les tests, les pipelines enchaînent six analyses de sécurité, la construction et la publication

Mis bout à bout, voici une vue de synthèse.

**[clic]** Chaque composant passe d'abord ses tests : JUnit, Vitest, pytest ou flutter test. Puis viennent les analyses, réparties entre plusieurs workflows : les secrets, la qualité du code, les bibliothèques, l'infrastructure, et le scan de l'image.

**[clic]** Au total, six types d'analyses de sécurité dans le dépôt, autour de la construction et de la publication de l'image.

---

## 16. Gitleaks fait échouer le job s'il trouve un secret dans le code

Trois analyses peuvent arrêter le pipeline.

**[clic]** Gitleaks cherche les secrets, comme un mot de passe oublié dans le code. S'il en trouve un, le job échoue, et l'image n'est pas publiée.

---

## 17. Dependency-Check fait échouer le build sur une bibliothèque avec une faille critique

Pour les bibliothèques Java, on utilise Dependency-Check.

**[clic]** Le seuil est fixé à neuf sur dix : à partir de neuf, le build échoue.

---

## 18. Trivy arrête une image avec une faille grave qui a déjà un correctif

Enfin, Trivy scanne l'image construite.

**[clic]** Une faille grave qui a déjà un correctif arrête le pipeline. Une faille sans correctif ne bloque pas, et deux exceptions sont écrites avec une date de fin. Trivy réduit donc le risque, sans promettre zéro faille.

---

## 19. Sans protection de branche, un pipeline rouge n'empêche pas la fusion

Un pipeline rouge signale un échec, mais il n'interdit pas la fusion.

**[clic]** Pour cela, il faut une protection de branche, que l'offre gratuite de GitHub ne donne pas pour un dépôt privé. On applique donc une règle d'équipe : on ne fusionne pas tant que c'est rouge.

---

## 20. Une pull request contrôle ; après la fusion, le push sur staging publie

Contrôler et publier sont deux choses différentes.

**[clic]** Une pull request lance les contrôles liés aux fichiers modifiés. Elle peut construire et scanner une image, mais elle ne publie rien.

**[clic]** Après la fusion, si un composant a changé, le push sur staging publie sa nouvelle image et met à jour son manifeste. Exemple, le 6 octobre : la pull request 19 ne touchait que la configuration du cluster. Ses contrôles ont tourné, sans construire d'image.

---

## 21. Le pipeline publie l'image, puis change une seule ligne dans Git

Voyons la publication.

**[clic]** L'image est envoyée dans ACR, le registre d'images d'Azure. Son nom contient l'identifiant du commit : on sait d'où elle vient.

**[clic]** Puis le pipeline modifie le manifeste, le fichier Kubernetes qui décrit l'image à lancer. Il ne touche pas le cluster : il fait un commit dans Git.

---

## 22. ArgoCD applique au cluster la version décrite dans Git

Reste à appliquer cette version.

**[clic]** ArgoCD tourne dans le cluster. Il compare Git et le cluster, puis applique la différence. On l'a choisi pour son interface et pour revenir en arrière par Git.

**[clic]** Le pipeline change le manifeste dans Git, et ArgoCD applique cette version. Sur la capture du 6 octobre, les trois applications du cluster sont synchronisées et saines.

---

## 23. L'Ingress envoie chaque adresse vers le bon service

Comment les utilisateurs arrivent-ils jusqu'à cette version ?

**[clic]** Une seule adresse publique arrive sur l'Ingress NGINX. Il lit le nom d'hôte : stage pour le site client, stage.admin pour l'administration.

**[clic]** Puis il lit le chemin : /api et /uploads vont au backend, le reste au site. Le service d'IA reste interne : seul le backend l'appelle. Et l'adresse publique est écrite à un seul endroit, vérifié par un pipeline.

---

## 24. Des NetworkPolicies limitent les échanges entre les pods

À l'intérieur du cluster, des NetworkPolicies limitent les échanges. Le site client, par exemple, ne peut pas joindre la base de données.

**[clic]** Le moteur réseau Calico les applique depuis la reconstruction d'octobre. Le 3 octobre, dix tests réseau sur onze passaient ; le cas du DNS reste à valider.

---

## 25. Les données vivent sur des disques persistants, et la sauvegarde reste à ajouter

Les données de PostgreSQL sont sur un disque persistant de cinq gigaoctets : si le pod redémarre, elles restent. Les fichiers envoyés ont leur propre volume, et le 6 octobre, un fichier absent renvoie bien une erreur 404, et non plus 500.

**[clic]** Mais un disque persistant n'est pas une sauvegarde : la sauvegarde automatique reste à ajouter.

---

## 26. Les secrets ne sont jamais écrits en clair dans Git

Restent les secrets : mots de passe, clés et tokens.

**[clic]** Pour le pipeline, ils sont dans les secrets GitHub, jamais affichés.

**[clic]** Pour l'application, ils sont chiffrés dans Git avec Sealed Secrets, et seul le cluster peut les déchiffrer. Par exemple, le mot de passe admin de staging vient d'un de ces secrets, et la connexion admin fonctionne.

---

## 27. Prometheus collecte les métriques du backend et du service IA

Une fois la version déployée, il faut voir si elle fonctionne.

**[clic]** Prometheus collecte les métriques du backend et du service IA. Sur la capture du 6 octobre, leurs deux cibles sont UP. Dans le rapport, ces métriques applicatives n'étaient pas encore collectées.

---

## 28. Grafana montre les ressources réelles des pods du backend et de l'IA

Grafana affiche les tableaux de bord.

**[clic]** On y voit les ressources utilisées par les pods du backend et de l'IA : le CPU et la mémoire, sur la dernière heure. Les règles d'alerte sont écrites, mais leur déclenchement n'est pas encore validé. Et Loki, pour les journaux, n'est pas installé sur ce cluster.

---

## 29. Le même identifiant relie le commit testé à l'image qui tourne en staging

L'image qui tourne est-elle celle qui a été testée ? On suit l'identifiant de la version : le SHA du commit.

**[clic]** Le 3 octobre, le pipeline réussit pour ce commit.

**[clic]** L'image porte le même identifiant dans ACR.

**[clic]** Le bot l'écrit dans le manifeste.

**[clic]** Et le 6 octobre, le pod de staging déclare exactement cette image.

---

## 30. Le sprint six vérifie si une analyse bloque vraiment, en trois gestes

Les analyses existent. Mais bloquent-elles vraiment ? C'est la question du sprint six.

**[clic]** On lit d'abord la configuration du contrôle.

**[clic]** Puis on ajoute une erreur exprès : le pipeline doit devenir rouge.

**[clic]** Enfin, on retire l'erreur : il doit redevenir vert.

---

## 31. Dependency-Check a arrêté une bibliothèque log4j vulnérable

Voici un essai réel du sprint six.

**[clic]** On a ajouté la bibliothèque log4j 2.14.1, qui contient la faille Log4Shell. Dependency-Check a arrêté le pipeline.

**[clic]** Après son retrait, le pipeline est redevenu vert. Les mêmes essais ont été faits avec un faux secret et avec une ancienne adresse publique.

---

## 32. Six types d'analyses : trois bloquent le backend sur staging, une quatrième s'ajoute sur les pull requests et main

Voici la lecture finale, d'après la configuration vérifiée. Six types d'analyses sont présents dans le dépôt.

**[clic]** Dans le parcours du backend sur staging, Gitleaks, Dependency-Check et Trivy bloquent. Les deux premières ont été testées avec une erreur volontaire.

**[clic]** Sur les pull requests et sur main, le pipeline attend aussi la quality gate de SonarCloud. Semgrep et Checkov produisent des rapports.

---

## 33. Trois priorités complètent la chaîne

La suite se concentre sur trois priorités.

**[clic]** D'abord, renforcer la sécurité : HTTPS, protection des branches et analyses bloquantes.

**[clic]** Ensuite, préparer la production et automatiser les sauvegardes.

**[clic]** Enfin, valider les alertes et centraliser les journaux. Entre les sessions de test, on arrête le cluster pour économiser le crédit.

---

## 34. En bilan, la plateforme est passée d'un ordinateur à une chaîne cloud contrôlée

En bilan, la plateforme est passée d'un ordinateur à une chaîne cloud contrôlée.

**[clic]** L'infrastructure est décrite en code. Dix pipelines automatisent les tests et les analyses selon les fichiers modifiés et les événements.

**[clic]** Le déploiement GitOps fonctionne en staging, avec une traçabilité de bout en bout, et la supervision affiche des données réelles.

---

## 35. Le voyage d'un commit, en une minute trente

Pour récapituler, voici le voyage d'un commit, en une minute trente.

**[clic]** (vidéo, 1 min 30)

---

## 36. Le commit va maintenant jusqu'à staging, contrôlé, publié et déployé sans geste manuel

Au début, notre commit restait sur un ordinateur.

**[clic]** Aujourd'hui, il est testé, analysé, publié et déployé en staging sans geste manuel, et on peut le suivre jusqu'au pod. C'est la chaîne que j'ai construite pendant ce PFE. Merci pour votre attention. Je suis prêt pour vos questions.

---

# Réserve : réponses aux questions (après la conclusion)

---

## 37. Après un changement d'adresse IP, l'adresse publique est devenue une source unique

Pendant le sprint deux, l'adresse IP publique ne répondait plus. La panne venait du load balancer d'Azure, qu'on a recréé, avec une nouvelle adresse. Il a fallu mettre à jour les manifestes, le CORS, la CSP et le pare-feu. Depuis, l'adresse est écrite à un seul endroit, le fichier PUBLIC_HOST, et un pipeline vérifie que le dépôt l'utilise partout. L'application mobile la reçoit aussi au moment du build.

---

## 38. PostgreSQL garde ses données sur un disque persistant, mais aucune sauvegarde n'est automatisée

La base PostgreSQL 16 tourne dans un seul pod, avec un volume persistant de cinq gigaoctets sur un disque Azure. Si le pod redémarre, les données restent. Le rapport parle de StatefulSet, mais dans les fichiers, c'est un Deployment avec ce volume. Le volume est en ReadWriteOnce : un seul nœud peut l'utiliser à la fois. Le mot de passe est dans un secret chiffré. Il n'y a aucune sauvegarde automatique : si le disque est perdu, les données sont perdues. C'est le premier point à ajouter.

---

## 39. GitOps couvre les mises à jour de l'application ; l'amorçage reste manuel et documenté

Pour les mises à jour de l'application, tout passe par le manifeste dans Git, puis par ArgoCD. Revenir en arrière voudrait dire faire un git revert : sur staging, chaque image a son identifiant dans Git, donc c'est possible, mais ce n'a pas été testé. L'amorçage est différent : les définitions des applications ArgoCD, dans k8s/bootstrap, s'appliquent à la main, dans un ordre documenté. Le correctif de Grafana du 6 octobre en est un exemple : fusionné par pull request, puis appliqué. Après, aucun redémarrage pendant dix minutes d'observation. Et une leçon des sprints : un kubectl rollout undo à la main entre en conflit avec ArgoCD, et les pods sont recréés en boucle.

---

## 40. Chaque outil a été choisi selon des critères simples, avec le budget comme contrainte

Pour chaque outil, on a gardé un critère simple. GitHub Actions, car il est intégré au dépôt et n'a pas de serveur à entretenir. AKS, car Azure gère le plan de contrôle de Kubernetes. Terraform, car on relit le plan avant de l'appliquer. ArgoCD, pour son interface et le retour par Git. D'autres solutions étaient possibles : Jenkins demande un serveur à entretenir ; GitLab CI et Azure Pipelines fonctionnent avec GitHub, mais ajoutent un service à configurer. Pour le budget : cent dollars de crédit. Les coûts du rapport sont des estimations : trente-cinq à quarante dollars par mois pour le cluster, environ cinq pour ACR. On n'a pas de mesure réelle de la consommation. C'est pour ça qu'on arrête le cluster entre les tests.

---

## 41. Ce qui tourne dépend de l'événement : push, pull request, branche et fichiers modifiés

Ce qui tourne dépend de l'événement. Sur un push vers une branche feature ou develop, les workflows démarrent, mais leurs jobs sont sautés ; seuls les guards tournent si les workflows ou k8s changent. Une pull request vers develop lance Semgrep, et le mobile si ses fichiers changent. Une pull request vers staging ou main lance les contrôles des composants touchés et les contrôles transversaux : l'image peut être construite et scannée, mais rien n'est publié. Le push sur staging publie l'image avec l'identifiant du commit et met à jour le manifeste. Sur main, le même mécanisme est prévu, mais pas encore démontré. Les trois essais réels sont log4j, un faux secret et une ancienne adresse publique.

---

## 42. Le mobile est testé et construit en APK par la CI ; l'upload Drive n'est pas prouvé

Le mobile est l'un des cinq composants, mais il ne tourne pas dans le cluster : il produit un APK. Son pipeline lance Gitleaks, les tests Flutter, puis construit l'APK avec l'adresse de staging. Sur une pull request, l'APK reste un artefact GitHub. Sur un push, il est aussi envoyé dans le stockage Azure, avec la date et l'identifiant du commit dans son nom, puis un e-mail part. L'envoi vers Google Drive ne bloque pas le pipeline : son étape est verte, mais cela ne prouve pas que le fichier est arrivé. La démonstration sur téléphone viendra après les changements d'interface.

---

## 43. Sur 22 exigences, l'état démontré est connu pour chacune

Voici les vingt-deux exigences, avec leur état réel. En vert, ce qui est démontré : la conteneurisation, l'environnement local, l'infrastructure en code, le déclenchement par composant, le déploiement GitOps en staging, la gestion des secrets, l'APK, et la traçabilité. En vert clair, ce qui est configuré ou partiel, par exemple les analyses, l'isolation, la supervision, les alertes, et le coût, qui reste une estimation. En orange, ce qui n'est pas réalisé : OWASP ZAP, Loki, Falco, la haute disponibilité et la montée en charge.

---

## 44. Le rapport, le code au même commit et le travail d'après sont trois états différents

Il faut séparer trois états. Un : le rapport décrit le commit 699b99f, du 7 septembre. Deux : à ce même commit, le code attendait déjà la quality gate de SonarCloud sur les pull requests et sur main, et chiffrait les secrets avec Sealed Secrets ; le rapport ne le décrit pas. Trois, après le rapport : le premier commit du bot sur staging date du 3 octobre. Le même jour, on a reconstruit un cluster d'un seul nœud, avec staging et la supervision. Les métriques du backend et de l'IA sont collectées, Calico applique les NetworkPolicies, et le 6 octobre, Grafana a été stabilisé et la réponse 404 des uploads vérifiée. Loki n'a pas été réinstallé.
