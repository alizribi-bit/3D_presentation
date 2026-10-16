# Script oral ZAWEDNI_CLASSIQUE_20MIN

35 slides · 51 révélations · cible **18:45**, film de 90 s inclus.

`[clic]` = une révélation ; les passages entre slides et les respirations sont inclus dans les créneaux. Les indications entre parenthèses ne sont pas dites. Source unique : `build/content_20min.py`.

---

## 1. Conception et déploiement d'une plateforme web et mobile pour l'achat local intégrant une approche DevSecOps

Bonjour à toutes et à tous.

**[clic]** Madame la Présidente, Mesdames les membres du jury, merci pour votre présence. Je vous présente mon mémoire sur la plateforme ZAWEDNI et son déploiement avec une approche DevSecOps.

---

## 2. Sommaire

Voici le plan.

**[clic]** Je présente le contexte et l'organisation du travail, puis l'architecture DevSecOps, la livraison et la supervision. Je termine par le bilan et les perspectives.

---

## 3. Contexte et objectifs

Je commence par ZAWEDNI, le besoin et l'organisation du projet.

---

## 4. La startup ZAWEDNI

ZAWEDNI est une startup tunisienne créée en décembre 2025 par Ali Zribi et Hadil Ben Masseoud. C'est une SARL installée à la pépinière d'entreprises de Mahdia.

**[clic]** Son service relie l'achat local à la responsabilité sociétale des entreprises, ou RSE. Le projet comprend la plateforme et son environnement DevSecOps.

---

## 5. Du besoin à la solution ZAWEDNI

Les actions RSE des entreprises restent parfois ponctuelles, sans stratégie claire ni suivi des résultats. Il est aussi difficile de comparer les fournisseurs locaux sur leurs pratiques responsables.

**[clic]** ZAWEDNI accompagne l’entreprise dans sa démarche RSE. Une grille permet d’évaluer ses pratiques. Le marché local permet de trouver des fournisseurs évalués, rendus visibles après validation de leur dossier. Enfin, les recommandations, le guide RSE et le rapport ESG l’aident à construire sa stratégie et à suivre ses résultats.

---

## 6. Business Model Canvas

Voici le Business Model Canvas complet de ZAWEDNI. Il situe le service et ses partenaires. Je retiens deux blocs pour expliquer à qui la plateforme s'adresse et ce qu'elle apporte.

**[clic]** Les clients sont les hôtels et maisons d'hôte ; les vendeurs sont les producteurs et fournisseurs locaux. La proposition de valeur réunit le marché B2B, l'évaluation des pratiques, l'empreinte carbone et le reporting ESG, avec la protection des données.

---

## 7. Enjeux et besoins du projet

La plateforme doit gérer les comptes et les dossiers, permettre l'évaluation et les échanges, puis restituer les résultats.

**[clic]** Pour l'exploiter, il faut automatiser la livraison, protéger les accès et les données, et suivre les services. La traçabilité, la maintenance et le coût orientent mes choix DevSecOps.

---

## 8. Organisation du travail

J’ai organisé le travail selon la méthode Scrum, avec un backlog et des sprints pour réaliser, tester et améliorer progressivement la solution.

**[clic]** Dans mon projet, le travail est réparti en trois releases et cinq sprints : conteneurisation et Azure ; pipelines sécurisés et GitOps ; puis observabilité, cloisonnement et sauvegarde. Les contrôles sont vérifiés au fil de ces étapes.

---

## 9. Architecture et démarche DevSecOps

Je passe à l'environnement qui accueille et protège les services.

---

## 10. Outils d'infrastructure

Docker prépare les services dans des images. ACR les conserve, puis AKS les exécute dans le cluster. Terraform décrit les ressources Azure dans des fichiers versionnés. J'ai choisi cette chaîne pour retrouver la configuration et reproduire l'environnement, plutôt que refaire les réglages à la main.

---

## 11. Les outils de la chaîne DevSecOps

Cet environnement accueille l'application. Pour livrer ses nouvelles versions, on organise les outils en cinq familles. GitHub Actions automatise les étapes. ArgoCD déploie la configuration enregistrée dans Git. Les analyses de sécurité contrôlent chaque composant ; on les détaille plus loin. Sealed Secrets protège les secrets, et la supervision suit les services.

---

## 12. Le cycle DevSecOps

Ces outils forment un cycle continu. À gauche, on prépare une modification, on écrit le code et on le teste. À droite, on déploie et on observe le service.

**[clic]** Un problème détecté conduit à une correction du code. La sécurité accompagne le cycle : contrôle du code, protection des accès et surveillance. Ce lien entre développement, sécurité et exploitation forme l'approche DevSecOps.

---

## 13. Architecture de déploiement

L'Ingress reçoit les demandes et les dirige vers les interfaces ou l'API, dans AKS.

**[clic]** Le backend accède à PostgreSQL et au service d'IA ; ces services restent internes.

**[clic]** ArgoCD lit les manifestes Git et le cluster récupère les images dans ACR.

**[clic]** Staging et production partagent un cluster à deux nœuds, avec des namespaces, secrets et données distincts. Cette séparation reste logique : elle n'isole pas physiquement les environnements.

---

## 14. Le chemin d'une requête

Plusieurs sites partagent la même adresse IP publique.

**[clic]** L'Ingress utilise le nom du site pour choisir l'interface client ou l'administration.

**[clic]** Il regarde ensuite le chemin : une page va vers l'interface ; /api et /uploads vont vers le backend. Le service d'IA reste interne.

---

## 15. Isolation réseau

Le routage dirige une demande vers le bon service. L'isolation réseau limite ensuite les échanges. Le backend peut joindre la base, mais une interface ne peut pas y accéder directement.

**[clic]** À lire : « NetworkPolicies : elles définissent les échanges autorisés entre les services concernés. » À lire : « Calico : il applique ces règles et bloque les échanges non autorisés. »

---

## 16. Secrets

On protège aussi les identifiants et les données.

**[clic]** Les secrets GitHub fournissent les identifiants aux pipelines, sans les écrire dans le code.

**[clic]** Sealed Secrets conserve les secrets applicatifs chiffrés dans Git. Le contrôleur les déchiffre dans le cluster.

---

## 17. Chaîne CI/CD et déploiement

On suit maintenant une modification du code, depuis GitHub jusqu'à la version déployée dans le cluster.

---

## 18. Notre chaîne de livraison

Cette chaîne organise une nouvelle version.

**[clic]** On enregistre la modification dans GitHub.

**[clic]** GitHub Actions lance les tests et les analyses. Si la publication est autorisée et les contrôles passent, l'image est envoyée dans ACR.

**[clic]** Le pipeline change le manifeste : le fichier qui indique quelle image utiliser. ArgoCD applique cette version dans le cluster.

---

## 19. Organisation des dix pipelines

La chaîne comporte dix pipelines.

**[clic]** Cinq suivent les composants : backend, client web, administration, IA et mobile. Les chemins modifiés indiquent quel composant reconstruire.

**[clic]** Les autres portent sur des contrôles communs, comme les secrets ou l'infrastructure. Cela évite les reconstructions inutiles et facilite la recherche d'une étape en échec.

---

## 20. Que vérifient les tests ?

Une entreprise ne doit pas modifier un employé d'une autre entreprise. EmployeeServiceOwnershipTest prépare ce cas, vérifie le refus et la conservation des données.

**[clic]** Si le résultat respecte la règle, la chaîne continue. Si le test échoue, elle s'arrête avant publication.

---

## 21. Que recherchent les analyses de sécurité ?

Les tests vérifient le fonctionnement. Les analyses recherchent des risques.

**[clic]** Gitleaks repère les secrets présents dans le code.

**[clic]** Semgrep recherche des pratiques à risque.

**[clic]** SonarCloud vérifie les critères configurés de qualité, de couverture et de sécurité.

**[clic]** Dependency-Check examine les bibliothèques Java.

**[clic]** Trivy recherche les vulnérabilités des images.

**[clic]** Checkov analyse l'infrastructure. Chaque analyse intervient sur le composant concerné.

---

## 22. Quels contrôles arrêtent la livraison ?

Ces outils ne produisent pas tous le même effet. Gitleaks, Dependency-Check, Trivy et SonarCloud peuvent arrêter le pipeline selon les critères configurés.

**[clic]** Dans cette configuration, Semgrep et Checkov signalent les problèmes sans arrêter la livraison.

**[clic]** La fusion dans GitHub dépend d'une autre règle : la protection des branches.

---

## 23. Un blocage vérifié en pratique

Voici un essai volontaire : une version vulnérable de Log4j a été ajoutée au backend.

**[clic]** Dependency-Check a détecté la vulnérabilité et arrêté le pipeline.

**[clic]** Après le retrait de cette dépendance, le pipeline est revenu au vert. Le contrôle bloque donc réellement la livraison pour ce risque.

---

## 24. Déploiement GitOps avec ArgoCD

Après la publication, il reste à déployer la version. Avec GitOps, la configuration est enregistrée dans Git.

**[clic]** ArgoCD compare cet état au cluster et applique les changements.

**[clic]** Synced indique que la configuration est synchronisée. Healthy indique que les ressources sont dans l'état de santé attendu.

---

## 25. Traçabilité d'une version

Pour retrouver la version déployée, on suit le même identifiant.

**[clic]** Il apparaît dans le pipeline,

**[clic]** dans l'image ACR,

**[clic]** dans le manifeste Git,

**[clic]** puis dans l'image utilisée par le pod. On relie ainsi le code au service qui fonctionne, ce qui facilite le diagnostic.

---

## 26. Supervision et validation

La version est en ligne. On passe à la supervision : suivre les services, repérer les problèmes et vérifier les résultats.

---

## 27. Métriques, journaux et alertes

La supervision réunit trois chaînes.

**[clic]** Prometheus collecte les métriques, affichées dans Grafana.

**[clic]** Alloy collecte les journaux, conservés dans Loki et consultés dans Grafana.

**[clic]** Prometheus évalue les règles d'alerte ; Alertmanager notifie. Ces outils aident au diagnostic, sans corriger eux-mêmes l'application.

---

## 28. Métriques des services

Les cibles backend et IA sont UP dans Prometheus : la collecte répond au moment de la capture.

**[clic]** Grafana affiche le processeur et la mémoire des pods. Cela vérifie la collecte et l'affichage, sans constituer une mesure de performance sous charge.

---

## 29. Journaux centralisés

Pour comprendre un événement, on consulte les journaux. Ici, une connexion refusée a produit un journal du backend. Alloy l'a collecté et Loki l'a conservé.

**[clic]** Dans Grafana, on retrouve l'événement, son service et son heure, sans ouvrir chaque conteneur.

---

## 30. Résultats de validation

On commence par les vérifications sur staging et les données. À lire : « Parcours et droits vérifiés. » À lire : « Restauration vérifiée. »

**[clic]** On passe ensuite à la production et au mobile. À lire : « Parcours métier et guide pour une stratégie RSE testés. » À lire : « APK Android distribué par Azure Blob. »

---

## 31. Bilan, perspectives et conclusion

On termine avec le bilan, les perspectives et la conclusion.

---

## 32. Bilan du mémoire

Ce mémoire réunit deux volets.

**[clic]** La plateforme web et mobile relie l'évaluation, le marché local et le suivi RSE.

**[clic]** L'environnement DevSecOps contrôle les versions, les déploie et suit les services. À lire : « Les essais en staging et en production montrent comment ces deux volets fonctionnent ensemble. »

---

## 33. Perspectives

Les horizons donnent des priorités, pas un calendrier promis.

**[clic]** À court terme : automatiser la copie externe, versionner les migrations et rendre Semgrep et Checkov bloquants après traitement des constats.

**[clic]** À moyen terme : HTTPS, protection des branches et analyses après déploiement avec OWASP ZAP.

**[clic]** À plus long terme : plusieurs réplicas, des ressources adaptées à la charge, puis Falco et OPA Gatekeeper. Ce sont des perspectives, pas des réalisations annoncées.

---

## 34. Le parcours d'une version, du code au suivi

Le film résume le parcours d'une version dans la chaîne DevSecOps.

**[clic]** (Laisser jouer les 90 secondes sans parler. Le lecteur permet pause, reprise, volume et déplacement. À la fin, passer à la conclusion.)

---

## 35. Conclusion

ZAWEDNI relie l'achat local à l'évaluation et au suivi des pratiques RSE. Le projet associe cette plateforme web et mobile à une chaîne DevSecOps.

**[clic]** On automatise la livraison, on intègre les contrôles de sécurité et on suit les services. Cela répond à la problématique présentée au début. Merci pour votre attention.
