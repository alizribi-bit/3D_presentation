# Discours de soutenance

`[clic]` = appuyer sur → . Parlez lentement : une phrase, une respiration.

---

## 1. Conception et déploiement d'une plateforme web et mobile pour l'achat local intégrant une approche DevSecOps

Bonjour à toutes et à tous.

**[clic]** Madame la Présidente, Mesdames les membres du jury, merci pour votre présence. Je remercie aussi mes encadrantes pour leur accompagnement. Je suis Ali Zribi. Je vous présente mon mémoire de fin d'études, consacré au développement de ZAWEDNI et à la mise en place d'une chaîne DevSecOps pour livrer et superviser cette plateforme.

---

## 2. Sommaire

Voici le plan.

**[clic]** Je présenterai d'abord le besoin et la startup ZAWEDNI, puis la plateforme que j'ai développée. J'expliquerai ensuite les choix d'architecture, la chaîne de livraison et les résultats de validation, avant de terminer par le bilan et les perspectives.

---

## 3. La startup ZAWEDNI

ZAWEDNI est une startup tunisienne que j'ai fondée avec Hadil Ben Masseoud, à la pépinière d'entreprises de Mahdia.

**[clic]** Notre objectif est d'aider les entreprises à structurer leur responsabilité sociétale, ou RSE, grâce à l'achat local. Dans ce mémoire, ma contribution porte sur le développement de la plateforme et sur son exploitation technique.

---

## 4. Le problème à résoudre

Une entreprise peut mener des actions responsables, comme des dons, sans disposer d'une démarche suivie. Pour acheter local, elle doit aussi trouver des fournisseurs fiables.

**[clic]** La recherche et les devis restent souvent dispersés. Les PME manquent aussi de repères pour améliorer leurs pratiques. Le besoin est donc de relier les achats à une évaluation et à un suivi concrets.

---

## 5. La réponse de ZAWEDNI

ZAWEDNI réunit ces éléments dans une même plateforme. L'entreprise renseigne une grille RSE, puis l'administrateur l'examine. Après approbation, elle peut accéder aux fonctions du marché et rendre son profil visible.

**[clic]** Elle peut ensuite échanger des devis et suivre ses achats locaux. Les recommandations, le guide RSE et le rapport ESG l'aident à comprendre ses résultats et à préparer ses améliorations.

---

## 6. Les acteurs et leurs responsabilités

Les utilisateurs d'entreprise peuvent être acheteurs, fournisseurs, ou les deux. Le fournisseur présente ses produits et répond aux demandes. L'acheteur recherche un partenaire et déclare ses transactions.

**[clic]** L'administrateur contrôle les grilles et les comptes. Cette séparation est importante : une entreprise ne peut pas approuver elle-même sa grille, ni consulter les données privées d'une autre entreprise.

---

## 7. Le modèle économique envisagé

Le Business Model Canvas précise comment ZAWEDNI pourrait créer de la valeur. Les premiers clients visés comprennent les hôtels, les maisons d'hôte et les fournisseurs locaux.

**[clic]** Le modèle prévu repose sur des abonnements, de la publicité et des services premium. Ce sont des revenus envisagés. Pour soutenir ce service, il faut une application utile, mais aussi des livraisons fiables et des données protégées.

---

## 8. Développement de la plateforme

Je vais maintenant présenter les choix de développement, la conception et les interfaces obtenues.

---

## 9. Langages et outils de développement

J'ai choisi React avec JavaScript pour les deux interfaces web, et Flutter avec Dart pour le mobile. Spring Boot, en Java, porte les règles métier et les droits d'accès. Python avec FastAPI convient aux calculs et aux fonctions d'IA. PostgreSQL conserve les données liées entre elles. Ces choix séparent les responsabilités.

---

## 10. Architecture de la plateforme

Les interfaces client, administration et mobile appellent la même API Spring Boot. Le jeton JWT permet d'identifier l'utilisateur, puis l'API vérifie ses droits.

**[clic]** PostgreSQL conserve les données métier.

**[clic]** FastAPI réalise les traitements spécialisés. Groq intervient seulement pour rédiger le guide RSE et la synthèse ESG. Les scores et les chiffres viennent de calculs contrôlés, sans dépendre du modèle de langage.

---

## 11. Conception du parcours de validation

Ce diagramme montre une règle centrale de ma conception. Le fournisseur soumet la grille de son entreprise. L'API enregistre la demande, puis l'administrateur prend une décision, qui est aussi enregistrée.

**[clic]** Ensuite, à chaque accès à une fonction du marché, le serveur vérifie que la grille est approuvée. Il autorise la requête, ou la refuse avec un code 403. Ce contrôle côté serveur reste actif même si quelqu'un contourne l'interface. Il relie donc le besoin métier à la sécurité du code.

---

## 12. Le parcours réalisé sur le web

Voici ce parcours dans les interfaces réalisées. Le fournisseur remplit sa grille RSE.

**[clic]** L'administrateur consulte le dossier et le valide.

**[clic]** L'entreprise obtient alors un certificat avec un code QR vérifiable.

**[clic]** Elle apparaît dans la marketplace, où un acheteur peut la rechercher et demander un devis. Ce parcours relie les rôles à la validation.

---

## 13. L'application mobile

Sur mobile, j'ai repris les fonctions utiles aux entreprises : consulter le score et remplir la grille RSE.

**[clic]** L'utilisateur peut aussi suivre la validation et parcourir la marketplace. Le mobile utilise la même API et les mêmes règles d'accès que le web. L'APK Android est distribué par Azure Blob.

---

## 14. Architecture et démarche DevSecOps

Voici maintenant les outils et l'architecture pour livrer et exploiter la plateforme.

---

## 15. Outils d'infrastructure

Docker prépare une image pour chaque service. Terraform décrit les ressources Azure dans des fichiers versionnés. AKS exécute les conteneurs et ACR conserve leurs images. Cette organisation permet de retrouver les versions et de reproduire l'infrastructure. Elle limite aussi les différences entre environnements.

---

## 16. Livraison, sécurité et supervision

GitHub Actions exécute les tests et les analyses. ArgoCD applique au cluster la configuration enregistrée dans Git. Sealed Secrets permet de versionner les secrets sous forme chiffrée. Enfin, les outils de supervision suivent le fonctionnement des services.

---

## 17. Le cycle DevSecOps

La boucle représente un travail continu. Côté développement, on prépare le changement, on écrit le code, puis on construit et on teste. Côté exploitation, on déploie et on observe le service.

**[clic]** Les résultats reviennent vers le développement pour préparer les corrections. La sécurité traverse cette boucle : analyses avant publication, protection des accès au déploiement, puis surveillance. Les contrôles exacts dépendent du composant concerné.

---

## 18. Architecture de déploiement

Les services s'exécutent sur AKS. L'Ingress reçoit les requêtes et les dirige vers les interfaces ou l'API.

**[clic]** L'API communique avec PostgreSQL et le service d'IA, qui restent internes.

**[clic]** ArgoCD lit les manifestes dans Git, et le cluster récupère les images dans ACR.

**[clic]** Staging et production partagent un cluster à deux nœuds, avec des namespaces, des secrets et des données distincts. Les parcours principaux ont été vérifiés en production.

---

## 19. Routage des requêtes

Le routage permet de servir plusieurs composants derrière une adresse publique.

**[clic]** L'Ingress reconnaît d'abord le nom d'hôte, pour distinguer le site client de l'administration.

**[clic]** Il lit ensuite le chemin : les requêtes API vont au backend, les autres au site concerné. Le service d'IA reste accessible seulement en interne. Il est donc protégé des accès directs.

---

## 20. Isolation réseau

Séparer les namespaces ne suffit pas à bloquer les communications. J'ai donc ajouté des NetworkPolicies : elles refusent les échanges par défaut, puis autorisent les flux nécessaires. Par exemple, un frontend ne doit pas joindre directement la base.

**[clic]** Calico applique ces règles. Dix tests sur onze étaient conformes lors de l'essai présenté ; le cas DNS reste à clarifier. Je garde donc cette limite explicite.

---

## 21. Secrets et sauvegardes

Il faut aussi protéger les secrets et les données.

**[clic]** Les pipelines utilisent les secrets GitHub, qui restent masqués dans les journaux.

**[clic]** Dans Git, Sealed Secrets conserve les valeurs chiffrées, que le contrôleur déchiffre dans le cluster.

**[clic]** Les volumes assurent la persistance, et une sauvegarde quotidienne protège la base. Une restauration a été testée dans un environnement isolé. La copie externe a été vérifiée manuellement ; son automatisation reste à faire.

---

## 22. Chaîne CI/CD et déploiement

Suivons maintenant un changement de code jusqu'au cluster.

---

## 23. Notre chaîne de livraison

Cette vue relie les étapes de livraison.

**[clic]** Je pousse un changement dans GitHub.

**[clic]** GitHub Actions exécute les tests et les analyses du composant concerné. Si les conditions sont satisfaites, le pipeline construit et publie son image.

**[clic]** Il met ensuite à jour le manifeste dans Git. ArgoCD synchronise le cluster, puis la supervision permet d'observer le résultat.

---

## 24. Organisation des dix pipelines

J'ai réparti la chaîne en dix pipelines.

**[clic]** Cinq correspondent aux composants : backend, client web, administration, IA et mobile. Des filtres de chemins évitent de reconstruire un composant inchangé.

**[clic]** Les cinq autres portent sur des contrôles transversaux, comme les secrets et l'infrastructure. Cette séparation facilite le diagnostic et évite des exécutions inutiles.

---

## 25. Contrôler puis publier

Une vérification et une publication sont deux actions différentes.

**[clic]** Sur une pull request vers staging ou main, les contrôles concernés s'exécutent, sans publier d'image.

**[clic]** Après la fusion, le push peut publier dans ACR et mettre à jour le manifeste.

**[clic]** Staging et main ciblent leurs environnements respectifs. Le mobile suit un autre résultat : un APK distribué par Azure Blob, sans conteneur dans AKS.

---

## 26. Tests des règles métier

Les tests vérifient le comportement du code. Par exemple, l'API teste des règles de score, le client vérifie les restrictions liées à la grille, et le service Python teste le calcul carbone.

**[clic]** Un échec de test arrête le pipeline avant la publication. Cela réduit les régressions. J'ai aussi rejoué des parcours réels pour vérifier le fonctionnement de l'ensemble.

---

## 27. Les analyses de sécurité

Les analyses cherchent d'autres risques. Gitleaks détecte les secrets, Semgrep et SonarCloud examinent le code. Dependency-Check analyse les dépendances Java, Trivy les images, et Checkov l'infrastructure.

**[clic]** Chaque outil intervient sur son périmètre. Par exemple, Dependency-Check concerne le backend Java. Il ne faut donc pas comprendre ce tableau comme six contrôles identiques dans tous les pipelines.

---

## 28. Blocage et protection de la fusion

Un rapport d'analyse ne bloque pas forcément une livraison. Certains contrôles arrêtent le pipeline : Gitleaks sur un secret, Dependency-Check au-dessus de son seuil, Trivy sur une faille grave corrigeable. SonarCloud bloque sur pull request et sur main.

**[clic]** Semgrep et Checkov restent consultatifs dans cette configuration.

**[clic]** Enfin, protéger la fusion nécessite une règle GitHub distincte. Cette protection automatique reste à mettre en place ; une consigne d'équipe ne lui est pas équivalente.

---

## 29. Un contrôle bloquant mis à l'épreuve

Pour vérifier un contrôle, j'ai introduit volontairement une dépendance vulnérable : Log4j 2.14.1.

**[clic]** Dependency-Check a identifié la vulnérabilité et arrêté le pipeline.

**[clic]** Après le retrait de cette dépendance, l'exécution est redevenue conforme. Ce test montre que le contrôle agit réellement sur la livraison. Sa présence dans un fichier ne suffirait pas à le démontrer.

---

## 30. Déploiement GitOps avec ArgoCD

Avec GitOps, Git décrit l'état attendu du déploiement.

**[clic]** ArgoCD compare cet état à celui du cluster et applique les changements nécessaires. Le pipeline publie donc un manifeste, sans effectuer directement le déploiement applicatif.

**[clic]** La capture montre des applications synchronisées et saines. Ces états confirment la synchronisation et la santé Kubernetes ; ils ne prouvent pas, à eux seuls, que tous les parcours métier fonctionnent.

---

## 31. Traçabilité d'un changement

Pour relier le code au service exécuté, je suis le même identifiant de version.

**[clic]** Il apparaît dans l'exécution réussie du pipeline.

**[clic]** On le retrouve dans le tag de l'image ACR,

**[clic]** puis dans le manifeste enregistré dans Git.

**[clic]** Enfin, le pod utilise cette image. Cette continuité permet de retrouver la version déployée et facilite le diagnostic d'un problème.

---

## 32. Supervision et validation

Après le déploiement, il faut vérifier le fonctionnement réel.

---

## 33. Métriques, journaux et alertes

La supervision combine plusieurs sources.

**[clic]** Prometheus collecte les métriques et Grafana les affiche.

**[clic]** Alloy transmet les journaux à Loki, également consultable dans Grafana.

**[clic]** Prometheus évalue les règles d'alerte, puis Alertmanager envoie les notifications. Les métriques montrent un comportement, les journaux aident à l'expliquer, et les alertes signalent quand il faut intervenir.

---

## 34. Métriques des services

Les cibles actives de Prometheus montrent que les métriques du backend et du service d'IA sont bien collectées.

**[clic]** Grafana permet ensuite de suivre le processeur et la mémoire des pods. Ces vues donnent des repères pour diagnostiquer une surcharge. Elles me permettent de suivre le fonctionnement des services.

---

## 35. Journaux centralisés

J'ai suivi une connexion refusée sur staging. L'API a produit un journal, qu'Alloy a transmis à Loki.

**[clic]** La ligne est ensuite visible dans Grafana. Je peux donc rechercher un événement sans ouvrir chaque conteneur. Un essai a aussi montré qu'un pod non autorisé ne pouvait pas accéder à Loki. La centralisation reste ainsi associée à un contrôle d'accès.

---

## 36. Validation d'une alerte complète

J'ai déclenché un test contrôlé en provoquant des erreurs serveur, avec une requête en lecture seule. La règle a dépassé son seuil, puis l'alerte est devenue active.

**[clic]** Un e-mail FIRING a été reçu. Après l'arrêt du test, l'alerte s'est résolue et un e-mail RESOLVED est arrivé.

**[clic]** Ce résultat montre le fonctionnement de toute la chaîne pour cette règle, depuis la détection jusqu'à la notification de résolution.

---

## 37. Résultats de validation

Sur staging, j'ai vérifié les parcours, les droits d'accès et la restauration d'une sauvegarde.

**[clic]** En production, j'ai aussi rejoué le parcours fournisseur et acheteur, les uploads, les insights et le guide RSE via l'API. Les métriques et les journaux sont disponibles, et la réception des notifications anglaises de déclenchement et de résolution est confirmée. Ces résultats relient le déploiement technique au fonctionnement de la plateforme.

---

## 38. Bilan et perspectives

Je termine par les apports du mémoire et les améliorations prioritaires.

---

## 39. Bilan du mémoire

Ce travail apporte deux résultats complémentaires.

**[clic]** J'ai développé la plateforme web et mobile, avec ses règles métier et ses interfaces.

**[clic]** J'ai ensuite construit une chaîne qui contrôle, livre et supervise ses évolutions. Les essais sur staging démontrent son fonctionnement. La production est également déployée, avec un parcours fournisseur et acheteur vérifié. J'ai appris à justifier mes choix et à vérifier leur efficacité.

---

## 40. Perspectives

Les perspectives prolongent les limites observées.

**[clic]** À court terme, il faut rendre Semgrep et Checkov bloquants, automatiser la copie externe des sauvegardes et activer les migrations de base versionnées.

**[clic]** Ensuite, les priorités sont le HTTPS, la protection des branches et des essais de sécurité après déploiement.

**[clic]** À plus long terme, plusieurs réplicas et une adaptation automatique des ressources pourront améliorer la disponibilité. Ces évolutions demandent aussi davantage de moyens.

---

## 41. Conclusion

ZAWEDNI relie un besoin d'achat local responsable à une solution web et mobile.

**[clic]** Ma contribution couvre son développement et la chaîne qui accompagne ses évolutions, du code jusqu'à la supervision. Les limites observées définissent la suite du travail. Je vous remercie pour votre attention et je suis prêt à répondre à vos questions.
