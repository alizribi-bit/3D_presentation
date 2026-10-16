# Discours de soutenance

`[clic]` = appuyer sur → . Parlez lentement : une phrase, une respiration.

---

## 1. Conception et déploiement d'une plateforme web et mobile pour l'achat local intégrant une approche DevOps

Bonjour à toutes et à tous. Je m'appelle Ali Zribi. Je remercie les membres du jury, mes encadrantes académiques, Madame Amel Zidi et Madame Sana Ghannay, et mon encadrante professionnelle, Madame Hadil Ben Masseoud. Je vais vous présenter mon projet de fin d'études : la conception et le déploiement de ZAWEDNI, une plateforme web et mobile pour l'achat local, avec une approche DevOps.

---

## 2. Sommaire

La présentation suit six parties : le contexte, la plateforme, l'architecture DevSecOps, la chaîne de livraison, la supervision, puis le bilan.

---

## 3. Contexte et objectifs

Commençons par le contexte.

---

## 4. ZAWEDNI et l'achat local responsable

ZAWEDNI est une startup tunisienne qui développe une plateforme B2B d'achat local et responsable.

**[clic]** Trois constats : un acheteur ne sait pas quels fournisseurs locaux sont vraiment responsables ; les devis se font par e-mail, sans suivi ; et beaucoup de PME ne savent pas améliorer leur démarche RSE.

**[clic]** ZAWEDNI répond avec une grille RSE publique, un certificat vérifiable, et une marketplace de fournisseurs certifiés.

---

## 5. Trois profils d'utilisateurs

La plateforme sert trois profils. Le fournisseur, une PME ou un artisan, remplit sa grille RSE, reçoit son certificat et répond aux devis. L'acheteur, un hôtel ou une entreprise, cherche des fournisseurs certifiés et déclare ses achats locaux. L'administrateur valide les inscriptions et délivre les certificats.

**[clic]** Une entreprise peut d'ailleurs être acheteuse et fournisseuse.

---

## 6. Besoins fonctionnels et exigences de qualité

Les besoins fonctionnels sont donc : évaluer, certifier, trouver un fournisseur et acheter. Il faut aussi livrer chaque changement de code de façon fiable.

**[clic]** Les exigences de qualité disent comment le système doit se comporter : la sécurité, la traçabilité des versions, l'observabilité, et un coût qui tient dans le crédit étudiant Azure de cent dollars.

---

## 7. Démarche de travail

Voici la démarche suivie. J'ai d'abord développé la plateforme : le web, le mobile, l'API, le service d'IA et la base de données.

**[clic]** Quand le développement était déjà bien avancé, à environ quatre-vingt-cinq pour cent selon mon estimation, j'ai intégré la chaîne DevSecOps. Puis viennent le déploiement et la validation continue.

**[clic]** Depuis, chaque nouveau changement passe par cette chaîne. J'ai avancé par étapes courtes, inspirées de Scrum.

---

## 8. Développement de la plateforme

Voyons la plateforme que j'ai développée.

---

## 9. Architecture de la plateforme

Elle a trois interfaces : deux sites en React, le site client et l'administration, et une application mobile en Flutter. Les trois parlent à la même API Spring Boot, avec un jeton JWT qui identifie l'utilisateur et son rôle.

**[clic]** L'API garde les données dans PostgreSQL.

**[clic]** Elle appelle aussi un service d'IA en FastAPI : il calcule le bilan carbone, et un modèle de langage, via Groq, rédige le guide RSE et le texte du rapport ESG. Les chiffres viennent toujours de la base.

---

## 10. Du fournisseur évalué à l'acheteur

Voici un parcours complet, sur la version locale du sept octobre. Le fournisseur remplit sa grille RSE, pilier par pilier, puis la soumet ; l'API calcule le score.

**[clic]** L'administrateur examine la grille et la valide.

**[clic]** La validation crée le certificat, avec un score, un palier et un QR code que n'importe qui peut vérifier.

**[clic]** Enfin, l'acheteur trouve ce fournisseur dans la marketplace, filtre par secteur, région ou distance, et peut lui demander un devis.

---

## 11. L'application mobile

L'application mobile sert surtout sur le terrain. Avec le même compte et la même API, le fournisseur voit son score, remplit sa grille et suit ses transactions.

**[clic]** Il suit aussi la revue de son dossier. L'acheteur parcourt la marketplace. L'application est livrée en APK Android, construit par la chaîne.

---

## 12. Fonctions métier réalisées

Au total, huit ensembles de fonctions sont réalisés, sur le web, le mobile et l'administration, dont deux s'appuient sur le service d'IA.

---

## 13. Outils de développement

Chaque outil a une raison. React et Vite : des composants réutilisables et un build rapide. Flutter : un seul code mobile. Spring Boot : sécurité, données, e-mails et métriques déjà intégrés. FastAPI pour l'IA en Python, et Groq pour ne pas héberger de modèle. PostgreSQL pour des données liées, avec Flyway pour le schéma.

---

## 14. Architecture et démarche DevSecOps

Il fallait ensuite héberger la plateforme et livrer chaque changement de façon sûre : c'est l'architecture DevSecOps.

---

## 15. Architecture de déploiement

Les services tournent dans AKS, le Kubernetes géré par Azure. Les utilisateurs arrivent par une seule adresse sur l'Ingress NGINX, qui envoie la racine aux sites et /api à l'API. Chaque groupe de services a son namespace, un espace séparé.

**[clic]** L'API appelle le service d'IA et PostgreSQL.

**[clic]** ArgoCD lit les manifestes dans GitHub et synchronise le cluster, avec les images d'ACR.

**[clic]** La supervision a son namespace. Staging est déployé et testé ; la production est décrite dans Git, pas déployée.

---

## 16. Le cycle DevSecOps

La démarche suit le cycle DevSecOps.

**[clic]** Souvent, la sécurité arrive à la fin, quand corriger coûte cher.

**[clic]** Ici, chaque étape a sa vérification : secrets et code à l'écriture, bibliothèques à la construction, tests, scan de l'image, secrets chiffrés au déploiement, puis supervision.

---

## 17. Outils d'infrastructure

Pour l'infrastructure : Docker met chaque service dans une image identique en local et dans le cluster. Terraform crée le cluster, le registre et le stockage à partir de code, et peut tout recréer, comme début octobre. AKS héberge les conteneurs, ACR garde les images versionnées.

---

## 18. Outils de livraison, de contrôle et de supervision

Pour la livraison, GitHub Actions lance tests et analyses, sans serveur à entretenir, et ArgoCD synchronise le cluster avec Git. Voyons trois mécanismes du cluster.

---

## 19. Routage des requêtes

D'abord le routage : il faut une seule adresse publique pour tous les services.

**[clic]** L'Ingress lit le nom d'hôte : stage pour le site client, stage.admin pour l'administration.

**[clic]** Puis le chemin : /api et /uploads vont à l'API, le reste au site. Le service d'IA reste interne. Et l'adresse publique est écrite à un seul endroit, vérifié par un pipeline.

---

## 20. Isolation réseau

Ensuite l'isolation réseau : un pod compromis ne doit pas joindre tout le reste. Tout est refusé par défaut, et des NetworkPolicies ouvrent seulement les flux utiles. Le site client, par exemple, ne peut pas joindre la base.

**[clic]** Pour appliquer ces règles, il faut un moteur réseau : c'est Calico, activé par Terraform. Le trois octobre, dix tests sur onze étaient conformes ; le cas DNS reste à clarifier.

---

## 21. Secrets et données

Enfin, les secrets : mots de passe, clés et tokens.

**[clic]** Pour le pipeline, ils sont dans les secrets GitHub, masqués dans les journaux.

**[clic]** Pour l'application, ils sont chiffrés dans Git avec Sealed Secrets ; seul le cluster peut les déchiffrer.

**[clic]** Les données et les fichiers sont sur des volumes persistants. Mais un volume n'est pas une sauvegarde : elle reste à automatiser.

---

## 22. Notre chaîne CI/CD et déploiement

Passons à la chaîne CI/CD.

---

## 23. Notre chaîne de livraison

Voici notre chaîne en une image.

**[clic]** Le développeur écrit le code et l'envoie sur GitHub.

**[clic]** GitHub Actions teste, analyse et construit les images.

**[clic]** Dans Azure, l'image va dans ACR, ArgoCD la déploie, et la supervision observe.

---

## 24. Dix pipelines

Dix pipelines existent.

**[clic]** Cinq suivent chacun un composant : l'API, les deux sites, l'IA et le mobile. Un filtre sur les chemins choisit lesquels démarrent : si on modifie l'API, son pipeline se lance.

**[clic]** Les cinq autres vérifient tout le dépôt : secrets, code, adresse publique, infrastructure et workflows.

---

## 25. Ce que déclenche chaque événement

Tout dépend de l'événement.

**[clic]** Une pull request lance les contrôles des fichiers modifiés ; elle peut construire et scanner une image, mais ne publie rien.

**[clic]** Après la fusion, le push sur staging publie l'image dans ACR et met à jour le manifeste. Exemple : la pull request dix-neuf, sans image.

**[clic]** Le mobile produit un APK, sans pod. Et sur main, la publication est configurée, mais la production n'est pas déployée.

---

## 26. Ce que les tests vérifient

Chaque composant passe d'abord ses tests, sur des règles concrètes : le score d'achat local ou la limite de connexions pour l'API, l'accès bloqué sans grille validée pour le site, le calcul carbone pour l'IA, le palier pour le mobile.

**[clic]** Si un test échoue, l'image n'est pas construite. L'administration a encore peu de tests : c'est à compléter.

---

## 27. Cinq familles d'analyses

Viennent ensuite cinq familles d'analyses : Gitleaks pour les secrets, SonarCloud et Semgrep pour le code, Dependency-Check pour les bibliothèques Java, Trivy pour les images, et Checkov pour l'infrastructure.

**[clic]** Chaque pipeline lance seulement celles qui concernent ses fichiers : SonarCloud et Dependency-Check, par exemple, ne tournent que pour l'API.

---

## 28. Bloquer, signaler, protéger la fusion

Une analyse peut avoir trois effets. D'abord, arrêter le pipeline. Gitleaks bloque sur un secret, Dependency-Check sur une faille de score neuf ou plus, Trivy sur une faille grave qui a un correctif. SonarCloud bloque sur les pull requests et sur main.

**[clic]** Ensuite, signaler : Semgrep et Checkov produisent des rapports.

**[clic]** Enfin, protéger la fusion : c'est le rôle de GitHub, indisponible pour un dépôt privé gratuit. Notre règle d'équipe le remplace : on ne fusionne pas tant que c'est rouge.

---

## 29. Un contrôle bloquant mis à l'épreuve

Un contrôle bloquant doit être testé. On a ajouté exprès log4j 2.14.1, connue pour la faille Log4Shell.

**[clic]** Dependency-Check a arrêté le pipeline.

**[clic]** Après son retrait, tout est redevenu vert. Même essai avec un faux secret et une ancienne adresse publique.

---

## 30. Déploiement GitOps avec ArgoCD

Il faut ensuite déployer l'image.

**[clic]** ArgoCD tourne dans le cluster : il compare Git avec ce qui tourne, et applique la différence. Le pipeline ne touche donc pas le cluster ; il fait un commit dans Git.

**[clic]** Le six octobre, les applications sont synchronisées et saines.

---

## 31. Traçabilité d'un changement

L'image qui tourne est-elle celle qui a été testée ? Suivons un vrai correctif, poussé sur staging le trois octobre, d'identifiant 62c42e1.

**[clic]** Le pipeline réussit pour ce commit.

**[clic]** L'image porte le même identifiant dans ACR.

**[clic]** Le bot l'écrit dans le manifeste.

**[clic]** Et le six octobre, le pod de staging tourne avec cette image. Reste à vérifier que le service fonctionne.

---

## 32. Supervision et validation

C'est la cinquième partie : supervision et validation.

---

## 33. Quatre outils de supervision

La supervision a quatre rôles.

**[clic]** Prometheus collecte les métriques, Grafana les affiche.

**[clic]** Alloy lit les journaux des pods et les envoie à Loki, qui les stocke ; Grafana les affiche aussi.

**[clic]** Si une règle d'alerte est dépassée, Alertmanager envoie un e-mail.

---

## 34. Métriques des services

L'API et le service d'IA exposent leurs métriques : le six octobre, leurs cibles sont actives.

**[clic]** Grafana montre le processeur et la mémoire de leurs pods.

---

## 35. Journaux centralisés

Pour les journaux, essai réel le sept octobre : une connexion à staging avec une adresse de test, sans compte. L'API répond 401 et écrit deux lignes ; Alloy les collecte, Loki les stocke.

**[clic]** Une seconde plus tard, elles sont dans le tableau de bord. Et l'accès à Loki est limité : un pod non autorisé est bloqué.

---

## 36. Une alerte, de bout en bout

Le sept octobre, on a provoqué des erreurs 500 avec une requête en lecture seule, pendant cinq minutes. Le seuil est dépassé : l'alerte passe en attente, puis se déclenche.

**[clic]** Alertmanager envoie un e-mail FIRING ; après l'arrêt, l'alerte se résout et un e-mail RESOLVED arrive.

**[clic]** Portée exacte : cinq règles sont chargées et saines, mais une seule a été déclenchée.

---

## 37. Ce qui a été validé

Les écrans web ont été parcourus en local, le mobile est couvert par ses tests. Staging répond, ArgoCD est synchronisé, les contrôles bloquent, la supervision alerte. L'isolation est partielle, à cause du DNS.

**[clic]** La production et un redémarrage du cluster ne sont pas validés.

---

## 38. Bilan et perspectives

Pour terminer, le bilan et les perspectives.

---

## 39. Bilan du projet

Le projet couvre la plateforme et sa chaîne.

**[clic]** J'ai développé la plateforme web et mobile, et l'infrastructure est décrite en code.

**[clic]** Un changement est publié en staging et suivi jusqu'au pod, les contrôles bloquent les risques principaux, et une vraie alerte a validé la supervision. Deux limites restent : la production n'est pas déployée, et la fusion n'est pas protégée.

---

## 40. Perspectives

La suite tient en trois priorités.

**[clic]** La sécurité : HTTPS, protection des branches, et Semgrep et Checkov bloquants.

**[clic]** L'exploitation : déployer la production et sauvegarder la base automatiquement.

**[clic]** La supervision : des alertes en production et des métriques pour la base.

---

## 41. Le voyage d'un changement, en une minute trente

Pour récapituler, voici le voyage d'un changement, en une minute trente.

**[clic]** (vidéo, 1 min 30)

---

## 42. Conclusion

Au début, le point vert attendait au départ.

**[clic]** Aujourd'hui, un changement est testé, analysé, publié et déployé en staging sans geste manuel, et on peut le suivre jusqu'au pod. Pendant ce projet, j'ai développé la plateforme ZAWEDNI et construit la chaîne qui la livre et la surveille. Merci pour votre attention.
