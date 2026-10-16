# Discours de soutenance

Trois mentions seulement :

- texte normal = **phrase dite** ;
- `▶ À l’écran :` « … » = **phrase lue à l’écran**, telle qu’elle est projetée ;
- **[clic]** = une seule pression sur → (le passage à la slide suivante n’est pas marqué).

---

## 1. Conception et déploiement d'une plateforme web et mobile pour l'achat local intégrant une approche DevSecOps

Bonjour à toutes et à tous.

**[clic]** Madame la Présidente, Mesdames les membres du jury, merci pour votre présence. Merci également à mes encadrantes pour leur accompagnement. Ce mémoire porte sur le développement de la plateforme ZAWEDNI et son déploiement avec une approche DevSecOps. On va voir son fonctionnement, puis les moyens de contrôler ses versions, de les déployer et de suivre les services.

---

## 2. Sommaire

Voici le plan.

**[clic]** On commence par ZAWEDNI, le problème et la solution proposée. On passe ensuite au développement de la plateforme. Puis, on explique l'architecture DevSecOps, les étapes de déploiement et la supervision. On termine par les résultats et les perspectives.

---

## 3. La startup ZAWEDNI

ZAWEDNI est une startup tunisienne, créée avec Hadil Ben Masseoud et installée à la pépinière d'entreprises de Mahdia.

**[clic]** Elle propose un service qui relie l'achat local à une démarche de responsabilité sociétale des entreprises, ou RSE. Le projet comprend la plateforme web et mobile, puis les moyens de la déployer, de protéger ses données et de suivre son fonctionnement.

---

## 4. Le problème à résoudre

Pour comprendre l'idée de ZAWEDNI, on part de trois constats.

**[clic]**

> ▶ À l’écran : « Les actions RSE restent parfois ponctuelles, comme des dons. »

> ▶ À l’écran : « Il manque une stratégie claire pour agir et suivre les résultats. »

> ▶ À l’écran : « Il est difficile de comparer les fournisseurs locaux sur leurs pratiques responsables. »

---

## 5. La réponse de ZAWEDNI

ZAWEDNI propose une réponse à ces trois points.

**[clic]**

> ▶ À l’écran : « Une grille d'évaluation pour mesurer les pratiques de l'entreprise. »

> ▶ À l’écran : « Une validation pour rendre les fournisseurs évalués visibles sur le marché. »

> ▶ À l’écran : « Un marché local pour trouver des partenaires et suivre les achats. »

> ▶ À l’écran : « Des recommandations, un guide pour une stratégie RSE et un rapport ESG pour suivre les résultats. »

---

## 6. Les acteurs de la plateforme

Ces services sont accessibles à deux catégories d'utilisateurs.

> ▶ À l’écran : « Les entreprises : évaluation, consultation des résultats, marché local, recommandations et rapports. »

Acheteur et fournisseur sont regroupés ici, car les fonctions présentées sont communes.

**[clic]**

> ▶ À l’écran : « L'administrateur : gestion des comptes, examen des grilles d'évaluation et validation des dossiers. »

---

## 7. Business Model Canvas

Le Business Model Canvas résume le modèle économique prévu pour ZAWEDNI. On se concentre sur trois parties.

**[clic]** Les clients visés.

> ▶ À l’écran : « Acheteurs : les hôtels, les maisons d'hôte. »

> ▶ À l’écran : « Vendeurs : producteurs bio, producteurs agroalimentaires, artisans du terroir, fournisseurs agroalimentaires. »

**[clic]** La valeur proposée.

> ▶ À l’écran : « Marketplace B2B pour l'achat et l'approvisionnement des produits agroalimentaires et terroirs, bio et locaux. »

> ▶ À l’écran : « Calcul de l'empreinte carbone. »

> ▶ À l’écran : « Reporting ESG. »

> ▶ À l’écran : « Sécurité et protection des données. »

**[clic]** Les revenus prévus.

> ▶ À l’écran : « Abonnements des clients, avec une offre de base gratuite. »

> ▶ À l’écran : « Publicités. »

> ▶ À l’écran : « Services premium. »

---

## 8. Développement de la plateforme

La solution est définie. On passe à sa réalisation : les outils, l'architecture de l'application et les interfaces.

---

## 9. Langages et outils de développement

Pour réaliser cette plateforme, chaque technologie a un rôle. React sert au web et Flutter au mobile. Spring Boot porte les règles métier et les droits d'accès. FastAPI réalise les calculs spécialisés. PostgreSQL conserve les données. Cette répartition sépare les responsabilités et garde une logique commune pour le web et le mobile.

---

## 10. Architecture de la plateforme

On peut maintenant voir comment ces éléments travaillent ensemble. Le web et le mobile envoient leurs demandes à la même API Spring Boot : le serveur qui applique les règles. L'API identifie l'utilisateur avec son jeton JWT et vérifie ses droits.

**[clic]** Elle lit et enregistre les données dans PostgreSQL.

**[clic]** Pour les traitements spécialisés, elle appelle FastAPI. Groq intervient pour rédiger le guide pour une stratégie RSE et la synthèse ESG. Les scores et les chiffres sont calculés par l'application.

---

## 11. De l'évaluation à l'accès au marché

Cette organisation permet d'appliquer une règle importante. Le fournisseur envoie la grille d'évaluation de son entreprise. Le serveur l'enregistre, puis l'administrateur l'examine et valide sa décision.

**[clic]** Quand le fournisseur demande l'accès à une fonction du marché concernée, le serveur vérifie cette décision. Si la grille est approuvée, l'accès est autorisé. Sinon, la demande est refusée. La règle reste donc appliquée côté serveur, même si l'utilisateur passe directement par l'API.

---

## 12. Un même parcours sur le web et le mobile

On retrouve cette logique dans les écrans de la plateforme. À gauche, le web ; à droite, le mobile. La première étape est la grille d'évaluation : ses piliers, puis ses questions.

**[clic]** On suit ensuite son état pendant l'examen par l'administrateur.

**[clic]** Après validation, on consulte les résultats de l'évaluation.

**[clic]** On peut aussi parcourir le marché local et consulter les entreprises. Les deux interfaces utilisent la même API : les données et les règles restent cohérentes.

---

## 13. Architecture et démarche DevSecOps

Jusqu'ici, on a vu la plateforme et son fonctionnement. Une autre question se pose maintenant : comment mettre une nouvelle version en ligne, réduire les erreurs et protéger les données ? C'est le rôle de l'approche DevSecOps. On commence par l'environnement qui accueille l'application.

---

## 14. Outils d'infrastructure

Pour cet environnement, on utilise quatre outils complémentaires. Docker prépare une image qui contient le service et ce qu'il faut pour l'exécuter. ACR, le registre, conserve ces images. AKS les utilise pour faire tourner les services dans un cluster, c'est-à-dire un groupe de machines. Terraform décrit les ressources Azure dans des fichiers. On peut ainsi retrouver la configuration et reproduire l'environnement sans tout régler à la main.

---

## 15. Livraison, sécurité et supervision

Cet environnement accueille l'application. On organise maintenant ses nouvelles versions. GitHub Actions lance les tests et les analyses. ArgoCD applique la configuration de déploiement enregistrée dans Git. Sealed Secrets conserve les secrets chiffrés. Les outils de supervision suivent les services après le déploiement. On relie ainsi les contrôles avant la mise en ligne au suivi de l'application.

---

## 16. Le cycle DevSecOps

Ces outils forment un cycle continu. À gauche, on prépare une modification, on écrit le code et on le teste. À droite, on déploie et on observe le service.

**[clic]** Un problème détecté conduit à une correction du code. La sécurité accompagne le cycle : contrôle du code, protection des accès et surveillance. Ce lien entre développement, sécurité et exploitation forme l'approche DevSecOps.

---

## 17. Architecture de déploiement

Voici l'architecture déployée sur Azure. L'Ingress, la porte d'entrée du cluster, reçoit les demandes des utilisateurs et les dirige vers les sites ou l'API.

**[clic]** PostgreSQL et le service d'IA sont accessibles par l'API, à l'intérieur du cluster.

**[clic]** ArgoCD lit la configuration dans Git ; AKS récupère les images dans ACR.

**[clic]**

> ▶ À l’écran : « Staging et production : un même cluster à deux nœuds, avec des namespaces, des secrets et des données distincts. »

> ▶ À l’écran : « Parcours principaux vérifiés en production. »

---

## 18. Le chemin d'une requête

Pour comprendre le routage, on suit une demande depuis le navigateur. Plusieurs sites utilisent la même adresse IP publique. L'Ingress reçoit la demande et choisit le bon service.

**[clic]** Il regarde d'abord le nom du site : le nom client mène au site client, et le nom admin au site d'administration.

**[clic]** Il regarde ensuite le chemin. Une page du site va vers l'interface ; une demande qui commence par /api va vers le backend. Les fichiers /uploads passent aussi par le backend. Le service d'IA est appelé par l'API et reste interne.

---

## 19. Isolation réseau

Le routage choisit le service. L'isolation réseau limite les échanges autorisés. Les NetworkPolicies décrivent les règles et Calico les applique. L'API peut joindre la base, mais une interface ne peut pas y accéder directement.

**[clic]** Dix contrôles réseau sont conformes. Pour le test DNS, le nom a été résolu, mais la commande de test a signalé une erreur : c'est cette commande qui reste à corriger.

---

## 20. Secrets et sauvegardes

On protège aussi les identifiants et les données.

**[clic]** Les secrets GitHub fournissent les identifiants aux pipelines, sans les écrire dans le code.

**[clic]** Sealed Secrets conserve les secrets applicatifs chiffrés dans Git. Le contrôleur les déchiffre dans le cluster.

**[clic]** Les volumes conservent les données ; les sauvegardes permettent de les récupérer. Une restauration isolée et une copie externe dans Azure Blob ont été vérifiées.

---

## 21. Chaîne CI/CD et déploiement

On suit maintenant une modification du code, depuis GitHub jusqu'à la version déployée dans le cluster.

---

## 22. Notre chaîne de livraison

Cette chaîne organise une nouvelle version.

**[clic]** On enregistre la modification dans GitHub.

**[clic]** GitHub Actions lance les tests et les analyses. Si la publication est autorisée et les contrôles passent, l'image est envoyée dans ACR.

**[clic]** Le pipeline change le manifeste : le fichier qui indique quelle image utiliser. ArgoCD applique cette version dans le cluster. La supervision permet ensuite de suivre le résultat.

---

## 23. Organisation des dix pipelines

La chaîne comporte dix pipelines.

**[clic]** Cinq suivent les composants : backend, client web, administration, IA et mobile. Les chemins modifiés indiquent quel composant reconstruire.

**[clic]** Les autres portent sur des contrôles communs, comme les secrets ou l'infrastructure. Cela évite les reconstructions inutiles et facilite la recherche d'une étape en échec.

---

## 24. Vérifier avant de publier

Il y a deux moments à distinguer.

**[clic]** Avant la fusion, on ouvre une pull request : une demande pour intégrer le changement. Les contrôles s'exécutent, mais aucune image n'est publiée.

**[clic]** Après la fusion, le push déclenche les étapes de livraison prévues. Si les contrôles passent, l'image est publiée et le manifeste est mis à jour.

**[clic]** Staging reçoit la version de test ; main sert à la production. Pour le mobile, le résultat est un APK distribué par Azure Blob.

---

## 25. Que vérifient les tests ?

Avant de publier, on vérifie le comportement du code avec des tests automatiques. Par exemple, une entreprise ne doit pas modifier un employé d'une autre entreprise. Le test prépare ce cas et vérifie que la modification est refusée.

**[clic]** Si le résultat correspond à la règle, le test passe. Sinon, il échoue et la publication s'arrête. On détecte ainsi une erreur avant la mise en ligne.

---

## 26. Que recherchent les analyses de sécurité ?

Les tests vérifient le fonctionnement. Les analyses recherchent des risques.

**[clic]** Gitleaks :

> ▶ À l’écran : « Repère les mots de passe, clés et jetons présents dans le code. »

**[clic]** Semgrep :

> ▶ À l’écran : « Analyse le code pour repérer des pratiques à risque. »

**[clic]** SonarCloud :

> ▶ À l’écran : « Vérifie la qualité du code, la couverture des tests et les critères de sécurité configurés. »

**[clic]** Dependency-Check :

> ▶ À l’écran : « Recherche les vulnérabilités connues dans les bibliothèques Java du backend. »

**[clic]** Trivy :

> ▶ À l’écran : « Recherche les vulnérabilités connues dans les images des services. »

**[clic]** Checkov :

> ▶ À l’écran : « Analyse les fichiers d'infrastructure pour repérer des configurations à risque. »

> ▶ À l’écran : « Les analyses sont choisies selon le composant : dépendances Java pour le backend, images pour les services conteneurisés, configuration pour l'infrastructure. »

---

## 27. Quels contrôles arrêtent la livraison ?

Ces outils ne produisent pas tous le même effet. Gitleaks, Dependency-Check, Trivy et SonarCloud peuvent arrêter le pipeline selon les critères configurés.

**[clic]** Dans cette configuration, Semgrep et Checkov signalent les problèmes sans arrêter la livraison.

**[clic]** La fusion dans GitHub dépend d'une autre règle : la protection des branches. Un contrôle de livraison et une protection de fusion sont donc deux mécanismes différents.

---

## 28. Un blocage vérifié en pratique

Voici un essai volontaire : une version vulnérable de Log4j a été ajoutée au backend.

**[clic]** Dependency-Check a détecté la vulnérabilité et arrêté le pipeline. Les étapes suivantes n'ont pas été exécutées.

**[clic]** Après le retrait de cette dépendance, le pipeline est revenu au vert. Le contrôle bloque donc réellement la livraison pour ce risque.

---

## 29. Déploiement GitOps avec ArgoCD

Après la publication, il reste à déployer la version. Avec GitOps, la configuration est enregistrée dans Git.

**[clic]** ArgoCD la compare avec le cluster et applique les changements.

**[clic]** Synced indique que la configuration est synchronisée. Healthy indique que les ressources sont dans l'état de santé attendu. Les essais de l'application complètent cette vérification.

---

## 30. Traçabilité d'une version

Pour retrouver la version déployée, on suit le même identifiant.

**[clic]** Il apparaît dans le pipeline,

**[clic]** dans l'image ACR,

**[clic]** dans le manifeste Git,

**[clic]** puis dans l'image utilisée par le pod. On relie ainsi le code au service qui fonctionne, ce qui facilite le diagnostic.

---

## 31. Supervision et validation

La version est en ligne. On passe à la supervision : suivre les services, repérer les problèmes et vérifier les résultats.

---

## 32. Métriques, journaux et alertes

La supervision utilise trois types d'informations.

**[clic]** Les métriques donnent des mesures, comme la mémoire ou le nombre d'erreurs. Prometheus les collecte et Grafana les affiche.

**[clic]** Les journaux décrivent les événements de l'application. Alloy les collecte, Loki les conserve et Grafana permet de les consulter.

**[clic]** Si une mesure dépasse un seuil configuré, Prometheus déclenche une alerte et Alertmanager envoie la notification. On peut ainsi suivre un problème, comprendre son contexte et être averti.

---

## 33. Métriques des services

Dans Prometheus, UP indique que les métriques du backend et de l'IA sont accessibles.

**[clic]** Dans Grafana, on suit la mémoire et le processeur utilisés par les pods. Ces graphiques permettent de repérer une hausse de charge et de comprendre le comportement des services.

---

## 34. Journaux centralisés

Pour comprendre un événement, on consulte les journaux. Ici, une connexion refusée a produit un journal du backend. Alloy l'a collecté et Loki l'a conservé.

**[clic]** Dans Grafana, on retrouve l'événement, son service et son heure, sans ouvrir chaque conteneur.

---

## 35. De l'erreur à la notification

On vérifie aussi la notification. Dans un test contrôlé sur staging, des erreurs serveur ont déclenché la règle.

**[clic]** Un e-mail FIRING a été reçu, puis un e-mail RESOLVED après l'arrêt du test.

**[clic]** Le parcours complet a été vérifié : erreur, détection, notification et résolution.

---

## 36. Résultats de validation

Les essais comprennent aussi des parcours réels. Sur staging, les droits, les parcours et la restauration d'une sauvegarde ont été vérifiés.

**[clic]** En production, les parcours, les fichiers, les insights et le guide pour une stratégie RSE ont été testés. Les métriques et journaux sont disponibles, et les notifications anglaises ont été reçues.

---

## 37. Bilan et perspectives

On termine avec le bilan et les prochaines étapes du projet.

---

## 38. Bilan du mémoire

Ce mémoire réunit deux volets.

**[clic]** La plateforme web et mobile relie l'évaluation, le marché local et le suivi RSE.

**[clic]** L'environnement DevSecOps contrôle les versions, les déploie et suit les services. Les essais en staging et en production montrent comment ces deux volets fonctionnent ensemble.

---

## 39. Perspectives

Les prochaines étapes prolongent le projet.

**[clic]** On prévoit d'automatiser la copie externe des sauvegardes, de versionner les migrations et de renforcer les contrôles.

**[clic]** On prévoit aussi le HTTPS, la protection des branches et des analyses après déploiement.

**[clic]** Plusieurs réplicas et une adaptation des ressources à la charge peuvent ensuite améliorer la disponibilité.

---

## 40. Conclusion

ZAWEDNI relie l'achat local à l'évaluation et au suivi des pratiques RSE.

**[clic]** Le projet associe une plateforme web et mobile à une démarche DevSecOps, du code jusqu'à l'exploitation. Merci pour votre attention.
