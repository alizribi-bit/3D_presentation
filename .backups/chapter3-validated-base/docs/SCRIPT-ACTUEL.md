# Discours 3D — référence classique actuelle

35 slides, 86 états, 85 pressions suivant. Les blocs `[lire]` correspondent à l’écran.

## 01 · couverture — Conception et déploiement d'une plateforme web et mobile pour l'achat local intégrant une approche DevSecOps

### couverture-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État couverture-0, cadrage overview.

Bonjour à toutes et à tous.

Prochain clic : Conception et déploiement d'une plateforme web et mobile pour l'achat local intégrant une approche DevSecOps · étape 1

### couverture-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État couverture-1, cadrage overview.

Madame la Présidente, Mesdames les membres du jury, merci pour votre présence. Je vous présente mon mémoire sur la plateforme ZAWEDNI et son déploiement avec une approche DevSecOps.

Prochain clic : Sommaire

## 02 · sommaire — Sommaire

### sommaire-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État sommaire-0, cadrage overview.

Voici le plan.

Prochain clic : Sommaire · étape 1

### sommaire-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État sommaire-1, cadrage overview.

Je présente le contexte et l'organisation du travail, puis l'architecture DevSecOps, la livraison et la supervision. Je termine par le bilan et les perspectives.

Prochain clic : Contexte et objectifs

## 03 · ch1 — Contexte et objectifs

### ch1-0 · Entrée

Repère 3D (ne pas dire) : arrivée dans la zone 01 ; parler pendant le déplacement. État ch1-0, cadrage chapter01.

Je commence par ZAWEDNI, le besoin et l'organisation du projet.

Prochain clic : La startup ZAWEDNI

## 04 · startup — La startup ZAWEDNI

### startup-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État startup-0, cadrage market.

ZAWEDNI est une startup tunisienne créée en décembre 2025 par Ali Zribi et Hadil Ben Masseoud. C'est une SARL installée à la pépinière d'entreprises de Mahdia.

Prochain clic : La startup ZAWEDNI · étape 1

### startup-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État startup-1, cadrage market.

Son service relie l'achat local à la responsabilité sociétale des entreprises, ou RSE. Le projet comprend la plateforme et son environnement DevSecOps.

Prochain clic : Du besoin à la solution ZAWEDNI

## 05 · probleme — Du besoin à la solution ZAWEDNI

### probleme-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État probleme-0, cadrage market.

Les actions RSE des entreprises restent parfois ponctuelles, sans stratégie claire ni suivi des résultats. Il est aussi difficile de comparer les fournisseurs locaux sur leurs pratiques responsables.

Prochain clic : Du besoin à la solution ZAWEDNI · étape 1

### probleme-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État probleme-1, cadrage market.

ZAWEDNI accompagne l’entreprise dans sa démarche RSE. Une grille permet d’évaluer ses pratiques. Le marché local permet de trouver des fournisseurs évalués, rendus visibles après validation de leur dossier. Enfin, les recommandations, le guide RSE et le rapport ESG l’aident à construire sa stratégie et à suivre ses résultats.

Prochain clic : Business Model Canvas

## 06 · modele — Business Model Canvas

### modele-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État modele-0, cadrage market.

Voici le Business Model Canvas complet de ZAWEDNI. Il situe le service et ses partenaires. Je retiens deux blocs pour expliquer à qui la plateforme s'adresse et ce qu'elle apporte.

Prochain clic : Business Model Canvas · étape 1

### modele-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État modele-1, cadrage market.

Les clients sont les hôtels et maisons d'hôte ; les vendeurs sont les producteurs et fournisseurs locaux. La proposition de valeur réunit le marché B2B, l'évaluation des pratiques, l'empreinte carbone et le reporting ESG, avec la protection des données.

Prochain clic : Enjeux et besoins du projet

## 07 · problematique — Enjeux et besoins du projet

### problematique-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État problematique-0, cadrage market.

La plateforme doit gérer les comptes et les dossiers, permettre l'évaluation et les échanges, puis restituer les résultats.

Prochain clic : Enjeux et besoins du projet · étape 1

### problematique-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État problematique-1, cadrage market.

Pour l'exploiter, il faut automatiser la livraison, protéger les accès et les données, et suivre les services. La traçabilité, la maintenance et le coût orientent mes choix DevSecOps.

Prochain clic : Organisation du travail

## 08 · methodologie — Organisation du travail

### methodologie-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État methodologie-0, cadrage market.

J’ai organisé le travail selon la méthode Scrum, avec un backlog et des sprints pour réaliser, tester et améliorer progressivement la solution.

Prochain clic : Organisation du travail · étape 1

### methodologie-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État methodologie-1, cadrage market.

Dans mon projet, le travail est réparti en trois releases et cinq sprints : conteneurisation et Azure ; pipelines sécurisés et GitOps ; puis observabilité, cloisonnement et sauvegarde. Les contrôles sont vérifiés au fil de ces étapes.

Prochain clic : Architecture et démarche DevSecOps

## 09 · ch3 — Architecture et démarche DevSecOps

### ch3-0 · Entrée

Repère 3D (ne pas dire) : arrivée dans la zone 03 ; parler pendant le déplacement. État ch3-0, cadrage chapter03.

Je passe à l'environnement qui accueille et protège les services.

Prochain clic : Outils d'infrastructure

## 10 · outils-infra — Outils d'infrastructure

### outils-infra-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État outils-infra-0, cadrage cloud.

Docker prépare les services dans des images. ACR les conserve, puis AKS les exécute dans le cluster. Terraform décrit les ressources Azure dans des fichiers versionnés. J'ai choisi cette chaîne pour retrouver la configuration et reproduire l'environnement, plutôt que refaire les réglages à la main.

Prochain clic : Les outils de la chaîne DevSecOps

## 11 · outils-livraison — Les outils de la chaîne DevSecOps

### outils-livraison-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État outils-livraison-0, cadrage cloud.

Cet environnement accueille l'application. Pour livrer ses nouvelles versions, on organise les outils en cinq familles. GitHub Actions automatise les étapes. ArgoCD déploie la configuration enregistrée dans Git. Les analyses de sécurité contrôlent chaque composant ; on les détaille plus loin. Sealed Secrets protège les secrets, et la supervision suit les services.

Prochain clic : Le cycle DevSecOps

## 12 · devsecops — Le cycle DevSecOps

### devsecops-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État devsecops-0, cadrage crossing.

Ces outils forment un cycle continu. À gauche, on prépare une modification, on écrit le code et on le teste. À droite, on déploie et on observe le service.

Prochain clic : Le cycle DevSecOps · étape 1

### devsecops-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État devsecops-1, cadrage crossing.

Un problème détecté conduit à une correction du code. La sécurité accompagne le cycle : contrôle du code, protection des accès et surveillance. Ce lien entre développement, sécurité et exploitation forme l'approche DevSecOps.

Prochain clic : Architecture de déploiement

## 13 · architecture — Architecture de déploiement

### architecture-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État architecture-0, cadrage architecture.

L'Ingress reçoit les demandes et les dirige vers les interfaces ou l'API, dans AKS.

Prochain clic : Architecture de déploiement · étape 1

### architecture-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État architecture-1, cadrage architecture.

Le backend accède à PostgreSQL et au service d'IA ; ces services restent internes.

Prochain clic : Architecture de déploiement · étape 2

### architecture-2 · Clic 2

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État architecture-2, cadrage architecture.

ArgoCD lit les manifestes Git et le cluster récupère les images dans ACR.

Prochain clic : Architecture de déploiement · étape 3

### architecture-3 · Clic 3

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État architecture-3, cadrage architecture.

Staging et production partagent un cluster à deux nœuds, avec des namespaces, secrets et données distincts. Cette séparation reste logique : elle n'isole pas physiquement les environnements.

Prochain clic : Le chemin d'une requête

## 14 · routage — Le chemin d'une requête

### routage-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État routage-0, cadrage cloud.

Plusieurs sites partagent la même adresse IP publique.

Prochain clic : Le chemin d'une requête · étape 1

### routage-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État routage-1, cadrage cloud.

L'Ingress utilise le nom du site pour choisir l'interface client ou l'administration.

Prochain clic : Le chemin d'une requête · étape 2

### routage-2 · Clic 2

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État routage-2, cadrage cloud.

Il regarde ensuite le chemin : une page va vers l'interface ; /api et /uploads vont vers le backend. Le service d'IA reste interne.

Prochain clic : Isolation réseau

## 15 · isolation — Isolation réseau

### isolation-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État isolation-0, cadrage cloud.

Le routage dirige une demande vers le bon service. L'isolation réseau limite ensuite les échanges. Le backend peut joindre la base, mais une interface ne peut pas y accéder directement.

Prochain clic : Isolation réseau · étape 1

### isolation-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État isolation-1, cadrage cloud.

[lire] « NetworkPolicies : elles définissent les échanges autorisés entre les services concernés. »

[lire] « Calico : il applique ces règles et bloque les échanges non autorisés. »

Prochain clic : Secrets

## 16 · secrets — Secrets

### secrets-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État secrets-0, cadrage cloud.

On protège aussi les identifiants et les données.

Prochain clic : Secrets · étape 1

### secrets-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État secrets-1, cadrage cloud.

Les secrets GitHub fournissent les identifiants aux pipelines, sans les écrire dans le code.

Prochain clic : Secrets · étape 2

### secrets-2 · Clic 2

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État secrets-2, cadrage cloud.

Sealed Secrets conserve les secrets applicatifs chiffrés dans Git. Le contrôleur les déchiffre dans le cluster.

Prochain clic : Chaîne CI/CD et déploiement

## 17 · ch4 — Chaîne CI/CD et déploiement

### ch4-0 · Entrée

Repère 3D (ne pas dire) : arrivée dans la zone 04 ; parler pendant le déplacement. État ch4-0, cadrage chapter04.

On suit maintenant une modification du code, depuis GitHub jusqu'à la version déployée dans le cluster.

Prochain clic : Notre chaîne de livraison

## 18 · chaine — Notre chaîne de livraison

### chaine-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État chaine-0, cadrage delivery.

Cette chaîne organise une nouvelle version.

Prochain clic : Notre chaîne de livraison · étape 1

### chaine-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État chaine-1, cadrage delivery.

On enregistre la modification dans GitHub.

Prochain clic : Notre chaîne de livraison · étape 2

### chaine-2 · Clic 2

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État chaine-2, cadrage delivery.

GitHub Actions lance les tests et les analyses. Si la publication est autorisée et les contrôles passent, l'image est envoyée dans ACR.

Prochain clic : Notre chaîne de livraison · étape 3

### chaine-3 · Clic 3

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État chaine-3, cadrage delivery.

Le pipeline change le manifeste : le fichier qui indique quelle image utiliser. ArgoCD applique cette version dans le cluster.

Prochain clic : Organisation des dix pipelines

## 19 · dix-pipelines — Organisation des dix pipelines

### dix-pipelines-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État dix-pipelines-0, cadrage delivery.

La chaîne comporte dix pipelines.

Prochain clic : Organisation des dix pipelines · étape 1

### dix-pipelines-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État dix-pipelines-1, cadrage delivery.

Cinq suivent les composants : backend, client web, administration, IA et mobile. Les chemins modifiés indiquent quel composant reconstruire.

Prochain clic : Organisation des dix pipelines · étape 2

### dix-pipelines-2 · Clic 2

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État dix-pipelines-2, cadrage delivery.

Les autres portent sur des contrôles communs, comme les secrets ou l'infrastructure. Cela évite les reconstructions inutiles et facilite la recherche d'une étape en échec.

Prochain clic : Que vérifient les tests ?

## 20 · tests — Que vérifient les tests ?

### tests-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État tests-0, cadrage delivery.

Une entreprise ne doit pas modifier un employé d'une autre entreprise. EmployeeServiceOwnershipTest prépare ce cas, vérifie le refus et la conservation des données.

Prochain clic : Que vérifient les tests ? · étape 1

### tests-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État tests-1, cadrage delivery.

Si le résultat respecte la règle, la chaîne continue. Si le test échoue, elle s'arrête avant publication.

Prochain clic : Que recherchent les analyses de sécurité ?

## 21 · analyses — Que recherchent les analyses de sécurité ?

### analyses-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État analyses-0, cadrage delivery.

Les tests vérifient le fonctionnement. Les analyses recherchent des risques.

Prochain clic : Que recherchent les analyses de sécurité ? · étape 1

### analyses-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État analyses-1, cadrage delivery.

Gitleaks repère les secrets présents dans le code.

Prochain clic : Que recherchent les analyses de sécurité ? · étape 2

### analyses-2 · Clic 2

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État analyses-2, cadrage delivery.

Semgrep recherche des pratiques à risque.

Prochain clic : Que recherchent les analyses de sécurité ? · étape 3

### analyses-3 · Clic 3

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État analyses-3, cadrage delivery.

SonarCloud vérifie les critères configurés de qualité, de couverture et de sécurité.

Prochain clic : Que recherchent les analyses de sécurité ? · étape 4

### analyses-4 · Clic 4

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État analyses-4, cadrage delivery.

Dependency-Check examine les bibliothèques Java.

Prochain clic : Que recherchent les analyses de sécurité ? · étape 5

### analyses-5 · Clic 5

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État analyses-5, cadrage delivery.

Trivy recherche les vulnérabilités des images.

Prochain clic : Que recherchent les analyses de sécurité ? · étape 6

### analyses-6 · Clic 6

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État analyses-6, cadrage delivery.

Checkov analyse l'infrastructure. Chaque analyse intervient sur le composant concerné.

Prochain clic : Quels contrôles arrêtent la livraison ?

## 22 · blocage — Quels contrôles arrêtent la livraison ?

### blocage-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État blocage-0, cadrage delivery.

Ces outils ne produisent pas tous le même effet. Gitleaks, Dependency-Check, Trivy et SonarCloud peuvent arrêter le pipeline selon les critères configurés.

Prochain clic : Quels contrôles arrêtent la livraison ? · étape 1

### blocage-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État blocage-1, cadrage delivery.

Dans cette configuration, Semgrep et Checkov signalent les problèmes sans arrêter la livraison.

Prochain clic : Quels contrôles arrêtent la livraison ? · étape 2

### blocage-2 · Clic 2

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État blocage-2, cadrage delivery.

La fusion dans GitHub dépend d'une autre règle : la protection des branches.

Prochain clic : Un blocage vérifié en pratique

## 23 · log4j — Un blocage vérifié en pratique

### log4j-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État log4j-0, cadrage delivery.

Voici un essai volontaire : une version vulnérable de Log4j a été ajoutée au backend.

Prochain clic : Un blocage vérifié en pratique · étape 1

### log4j-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État log4j-1, cadrage delivery.

Dependency-Check a détecté la vulnérabilité et arrêté le pipeline.

Prochain clic : Un blocage vérifié en pratique · étape 2

### log4j-2 · Clic 2

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État log4j-2, cadrage delivery.

Après le retrait de cette dépendance, le pipeline est revenu au vert. Le contrôle bloque donc réellement la livraison pour ce risque.

Prochain clic : Déploiement GitOps avec ArgoCD

## 24 · argocd — Déploiement GitOps avec ArgoCD

### argocd-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État argocd-0, cadrage delivery.

Après la publication, il reste à déployer la version. Avec GitOps, la configuration est enregistrée dans Git.

Prochain clic : Déploiement GitOps avec ArgoCD · étape 1

### argocd-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État argocd-1, cadrage delivery.

ArgoCD compare cet état au cluster et applique les changements.

Prochain clic : Déploiement GitOps avec ArgoCD · étape 2

### argocd-2 · Clic 2

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État argocd-2, cadrage delivery.

Synced indique que la configuration est synchronisée. Healthy indique que les ressources sont dans l'état de santé attendu.

Prochain clic : Traçabilité d'une version

## 25 · tracabilite — Traçabilité d'une version

### tracabilite-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État tracabilite-0, cadrage delivery.

Pour retrouver la version déployée, on suit le même identifiant.

Prochain clic : Traçabilité d'une version · étape 1

### tracabilite-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État tracabilite-1, cadrage delivery.

Il apparaît dans le pipeline,

Prochain clic : Traçabilité d'une version · étape 2

### tracabilite-2 · Clic 2

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État tracabilite-2, cadrage delivery.

dans l'image ACR,

Prochain clic : Traçabilité d'une version · étape 3

### tracabilite-3 · Clic 3

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État tracabilite-3, cadrage delivery.

dans le manifeste Git,

Prochain clic : Traçabilité d'une version · étape 4

### tracabilite-4 · Clic 4

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État tracabilite-4, cadrage delivery.

puis dans l'image utilisée par le pod. On relie ainsi le code au service qui fonctionne, ce qui facilite le diagnostic.

Prochain clic : Supervision et validation

## 26 · ch5 — Supervision et validation

### ch5-0 · Entrée

Repère 3D (ne pas dire) : arrivée dans la zone 05 ; parler pendant le déplacement. État ch5-0, cadrage chapter05.

La version est en ligne. On passe à la supervision : suivre les services, repérer les problèmes et vérifier les résultats.

Prochain clic : Métriques, journaux et alertes

## 27 · supervision — Métriques, journaux et alertes

### supervision-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État supervision-0, cadrage monitoring.

La supervision réunit trois chaînes.

Prochain clic : Métriques, journaux et alertes · étape 1

### supervision-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État supervision-1, cadrage monitoring.

Prometheus collecte les métriques, affichées dans Grafana.

Prochain clic : Métriques, journaux et alertes · étape 2

### supervision-2 · Clic 2

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État supervision-2, cadrage monitoring.

Alloy collecte les journaux, conservés dans Loki et consultés dans Grafana.

Prochain clic : Métriques, journaux et alertes · étape 3

### supervision-3 · Clic 3

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État supervision-3, cadrage monitoring.

Prometheus évalue les règles d'alerte ; Alertmanager notifie. Ces outils aident au diagnostic, sans corriger eux-mêmes l'application.

Prochain clic : Métriques des services

## 28 · metriques — Métriques des services

### metriques-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État metriques-0, cadrage monitoring.

Les cibles backend et IA sont UP dans Prometheus : la collecte répond au moment de la capture.

Prochain clic : Métriques des services · étape 1

### metriques-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État metriques-1, cadrage monitoring.

Grafana affiche le processeur et la mémoire des pods. Cela vérifie la collecte et l'affichage, sans constituer une mesure de performance sous charge.

Prochain clic : Journaux centralisés

## 29 · journaux — Journaux centralisés

### journaux-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État journaux-0, cadrage monitoring.

Pour comprendre un événement, on consulte les journaux. Ici, une connexion refusée a produit un journal du backend. Alloy l'a collecté et Loki l'a conservé.

Prochain clic : Journaux centralisés · étape 1

### journaux-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État journaux-1, cadrage monitoring.

Dans Grafana, on retrouve l'événement, son service et son heure, sans ouvrir chaque conteneur.

Prochain clic : Résultats de validation

## 30 · validation — Résultats de validation

### validation-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État validation-0, cadrage monitoring.

On commence par les vérifications sur staging et les données.

[lire] « Parcours et droits vérifiés. »

[lire] « Restauration vérifiée. »

Prochain clic : Résultats de validation · étape 1

### validation-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État validation-1, cadrage monitoring.

On passe ensuite à la production et au mobile.

[lire] « Parcours métier et guide pour une stratégie RSE testés. »

[lire] « APK Android distribué par Azure Blob. »

Prochain clic : Bilan, perspectives et conclusion

## 31 · ch6 — Bilan, perspectives et conclusion

### ch6-0 · Entrée

Repère 3D (ne pas dire) : arrivée dans la zone 06 ; parler pendant le déplacement. État ch6-0, cadrage chapter06.

On termine avec le bilan, les perspectives et la conclusion.

Prochain clic : Bilan du mémoire

## 32 · bilan — Bilan du mémoire

### bilan-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État bilan-0, cadrage belvedere.

Ce mémoire réunit deux volets.

Prochain clic : Bilan du mémoire · étape 1

### bilan-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État bilan-1, cadrage belvedere.

La plateforme web et mobile relie l'évaluation, le marché local et le suivi RSE.

Prochain clic : Bilan du mémoire · étape 2

### bilan-2 · Clic 2

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État bilan-2, cadrage belvedere.

L'environnement DevSecOps contrôle les versions, les déploie et suit les services.

[lire] « Les essais en staging et en production montrent comment ces deux volets fonctionnent ensemble. »

Prochain clic : Perspectives

## 33 · limites — Perspectives

### limites-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État limites-0, cadrage belvedere.

Les horizons donnent des priorités, pas un calendrier promis.

Prochain clic : Perspectives · étape 1

### limites-1 · Clic 1

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État limites-1, cadrage belvedere.

À court terme : automatiser la copie externe, versionner les migrations et rendre Semgrep et Checkov bloquants après traitement des constats.

Prochain clic : Perspectives · étape 2

### limites-2 · Clic 2

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État limites-2, cadrage belvedere.

À moyen terme : HTTPS, protection des branches et analyses après déploiement avec OWASP ZAP.

Prochain clic : Perspectives · étape 3

### limites-3 · Clic 3

Repère 3D (ne pas dire) : révélation locale ; caméra stable. État limites-3, cadrage belvedere.

À plus long terme : plusieurs réplicas, des ressources adaptées à la charge, puis Falco et OPA Gatekeeper. Ce sont des perspectives, pas des réalisations annoncées.

Prochain clic : Le parcours d'une version, du code au suivi

## 34 · video — Le parcours d'une version, du code au suivi

### video-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État video-0, cadrage theater.

Le film résume le parcours d'une version dans la chaîne DevSecOps.

Prochain clic : Le parcours d'une version, du code au suivi · étape 1

### video-1 · Clic 1

Repère 3D (ne pas dire) : lecture du film et silence. État video-1, cadrage theater.

(Laisser jouer les 90 secondes sans parler. Le lecteur permet pause, reprise, volume et déplacement. À la fin, passer à la conclusion.)

Prochain clic : Conclusion

## 35 · retour — Conclusion

### retour-0 · Entrée

Repère 3D (ne pas dire) : ouverture du contenu. État retour-0, cadrage belvedere.

ZAWEDNI relie l'achat local à l'évaluation et au suivi des pratiques RSE. Le projet associe cette plateforme web et mobile à une chaîne DevSecOps.

Prochain clic : Conclusion · étape 1

### retour-1 · Clic 1

Repère 3D (ne pas dire) : retour de la caméra au monde, sans marche. État retour-1, cadrage overview.

On automatise la livraison, on intègre les contrôles de sécurité et on suit les services. Cela répond à la problématique présentée au début. Merci pour votre attention.

Prochain clic : Fin de la présentation.
