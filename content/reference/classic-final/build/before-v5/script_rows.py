# Source of SCRIPT.md rows (v4, 2026-10-09). Run: python3 build/script_rows.py  -> writes SCRIPT.md
# Columns: id, chapter, title, steps, visual, transition, through-line, note (speech, [clic] = →)
# A non-empty chapter cell opens a new row of the camera world (merge.py); chapter openers use 'dip'.
# Speech rule (v4): French B1, natural and complete. Short = no repetition, NOT telegraphic: each key slide says
# what the jury sees, how the parts are linked, why the choice and what the result proves. "j'ai" for Ali's
# technical work, "nous" for the shared startup idea. Never "dans le rapport" aloud.
R = [
# ── 0 · Ouverture
('couverture', '0 · Ouverture', "Conception et déploiement d'une plateforme web et mobile pour l'achat local intégrant une approche DevSecOps", 1,
 "cover: étape 0 = la formule arabe seule ; un clic lance une séquence automatique d'environ 2,8 s : logos, MEMOIRE DE FIN D'ETUDES, titre, Ali Zribi et la formation, puis le bloc « Les membres du jury » (présidente, rapporteure, encadrantes)", '-', '',
 "Bonjour à toutes et à tous. [clic] Madame la Présidente, Mesdames les membres du jury, merci pour votre présence. Je remercie aussi mes encadrantes pour leur accompagnement. Je suis Ali Zribi. Je vous présente mon mémoire de fin d'études, consacré au développement de ZAWEDNI et à la mise en place d'une chaîne DevSecOps pour livrer et superviser cette plateforme."),
('sommaire', '', "Sommaire", 1,
 "list: étape 0 = « Sommaire » seul ; un clic fait apparaître les six parties l'une après l'autre (≈ 2,5 s), numéro, titre et une ligne d'explication, lecture de gauche à droite", 'camera', '',
 "Voici le plan. [clic] Je présenterai d'abord le besoin et la startup ZAWEDNI, puis la plateforme que j'ai développée. J'expliquerai ensuite les choix d'architecture, la chaîne de livraison et les résultats de validation, avant de terminer par le bilan et les perspectives."),
# ── 1 · Contexte et objectifs
('startup', '1 · Contexte et objectifs', "La startup ZAWEDNI", 1,
 "two blocks: à gauche l'identité (startup tunisienne, plateforme B2B, pépinière de Mahdia) et l'idée portée à deux ; au clic, à droite la mission RSE et ma contribution (développement, puis infrastructure et livraison)", 'dip', '',
 "ZAWEDNI est une startup tunisienne que j'ai fondée avec Hadil Ben Masseoud, à la pépinière d'entreprises de Mahdia. [clic] Notre objectif est d'aider les entreprises à structurer leur responsabilité sociétale, ou RSE, grâce à l'achat local. Dans ce mémoire, ma contribution porte sur le développement de la plateforme et sur son exploitation technique."),
('probleme', '', "Le problème à résoudre", 1,
 "two columns: une démarche RSE difficile à suivre ; au clic, des achats encore dispersés, puis la question centrale en bandeau vert", 'camera', '',
 "Une entreprise peut mener des actions responsables, comme des dons, sans disposer d'une démarche suivie. Pour acheter local, elle doit aussi trouver des fournisseurs fiables. [clic] La recherche et les devis restent souvent dispersés. Les PME manquent aussi de repères pour améliorer leurs pratiques. Le besoin est donc de relier les achats à une évaluation et à un suivi concrets."),
('reponse', '', "La réponse de ZAWEDNI", 1,
 "path: Évaluer (grille RSE, validation par l'administrateur) → Acheter local ; au clic, Progresser (recommandations, guide RSE, rapport ESG) et la flèche de retour vers l'évaluation", 'camera', '',
 "ZAWEDNI réunit ces éléments dans une même plateforme. L'entreprise renseigne une grille RSE, puis l'administrateur l'examine. Après approbation, elle peut accéder aux fonctions du marché et rendre son profil visible. [clic] Elle peut ensuite échanger des devis et suivre ses achats locaux. Les recommandations, le guide RSE et le rapport ESG l'aident à comprendre ses résultats et à préparer ses améliorations."),
('acteurs', '', "Les acteurs et leurs responsabilités", 1,
 "three cards: acheteur et fournisseur (deux rôles d'une même entreprise, reliés) ; au clic, l'administrateur ZAWEDNI et la règle « une entreprise n'approuve pas sa propre grille, les droits sont contrôlés par l'API »", 'camera', '',
 "Les utilisateurs d'entreprise peuvent être acheteurs, fournisseurs, ou les deux. Le fournisseur présente ses produits et répond aux demandes. L'acheteur recherche un partenaire et déclare ses transactions. [clic] L'administrateur contrôle les grilles et les comptes. Cette séparation est importante : une entreprise ne peut pas approuver elle-même sa grille, ni consulter les données privées d'une autre entreprise."),
('modele', '', "Le modèle économique envisagé", 1,
 "synthesis of the BMC: clients visés et valeur proposée ; au clic, revenus prévus (abonnements, publicité, premium) et la conséquence technique, qui annonce la suite", 'camera', '',
 "Le Business Model Canvas précise comment ZAWEDNI pourrait créer de la valeur. Les premiers clients visés comprennent les hôtels, les maisons d'hôte et les fournisseurs locaux. [clic] Le modèle prévu repose sur des abonnements, de la publicité et des services premium. Ce sont des revenus envisagés. Pour soutenir ce service, il faut une application utile, mais aussi des livraisons fiables et des données protégées."),
# ── 2 · Développement de la plateforme
('ch2', '2 · Développement de la plateforme', "Développement de la plateforme", 0,
 "chapter: 02, chapitre 2 allumé dans le sommaire", 'dip', '',
 "Je vais maintenant présenter les choix de développement, la conception et les interfaces obtenues."),
('outils-dev', '', "Langages et outils de développement", 0,
 "grid: cinq rôles (web, mobile, API, service spécialisé, données) avec langage, framework et raison ; Groq à part, avec son périmètre limité au texte", 'camera', '',
 "J'ai choisi React avec JavaScript pour les deux interfaces web, et Flutter avec Dart pour le mobile. Spring Boot, en Java, porte les règles métier et les droits d'accès. Python avec FastAPI convient aux calculs et aux fonctions d'IA. PostgreSQL conserve les données liées entre elles. Ces choix séparent les responsabilités."),
('plateforme', '', "Architecture de la plateforme", 2,
 "diagram: site client, administration, mobile → API Spring Boot (REST + JWT) ; puis PostgreSQL (SQL, JPA) ; puis service d'IA FastAPI (REST interne + clé) et Groq", 'camera', '',
 "Les interfaces client, administration et mobile appellent la même API Spring Boot. Le jeton JWT permet d'identifier l'utilisateur, puis l'API vérifie ses droits. [clic] PostgreSQL conserve les données métier. [clic] FastAPI réalise les traitements spécialisés. Groq intervient seulement pour rédiger le guide RSE et la synthèse ESG. Les scores et les chiffres viennent de calculs contrôlés, sans dépendre du modèle de langage."),
('sequence', '', "Conception du parcours de validation", 1,
 "UML sequence: Fournisseur, API Spring Boot, PostgreSQL, Administrateur ; soumission puis approbation enregistrées ; au clic, un accès ultérieur au marché, GridCheckFilter interroge la base, cadre alt : approuvée → autorisé, sinon 403 GRID_REQUIRED", 'camera', '',
 "Ce diagramme montre une règle centrale de ma conception. Le fournisseur soumet la grille de son entreprise. L'API enregistre la demande, puis l'administrateur prend une décision, qui est aussi enregistrée. [clic] Ensuite, à chaque accès à une fonction du marché, le serveur vérifie que la grille est approuvée. Il autorise la requête, ou la refuse avec un code 403. Ce contrôle côté serveur reste actif même si quelqu'un contourne l'interface. Il relie donc le besoin métier à la sécurité du code."),
('parcours-app', '', "Le parcours réalisé sur le web", 3,
 "photo: rail de quatre étapes à gauche ; à droite une seule capture à la fois, celle de l'étape dite : grille RSE (fournisseur), revue (administrateur), certificat avec QR, marketplace (acheteur) ; version locale du 07/10, données de démonstration", 'camera', '',
 "Voici ce parcours dans les interfaces réalisées. Le fournisseur remplit sa grille RSE. [clic] L'administrateur consulte le dossier et le valide. [clic] L'entreprise obtient alors un certificat avec un code QR vérifiable. [clic] Elle apparaît dans la marketplace, où un acheteur peut la rechercher et demander un devis. Ce parcours relie les rôles à la validation."),
('mobile', '', "L'application mobile", 1,
 "photo: quatre écrans Flutter ; d'abord accueil et score, grille RSE ; au clic, suivi de la revue et marketplace, puis la ligne « APK distribué par Azure Blob · essais sur téléphone à compléter »", 'camera', '',
 "Sur mobile, j'ai repris les fonctions utiles aux entreprises : consulter le score et remplir la grille RSE. [clic] L'utilisateur peut aussi suivre la validation et parcourir la marketplace. Le mobile utilise la même API et les mêmes règles d'accès que le web. L'APK Android est distribué par Azure Blob. Une campagne complète de tests sur téléphone reste à mener."),
# ── 3 · Architecture et démarche DevSecOps
('ch3', '3 · Architecture et démarche DevSecOps', "Architecture et démarche DevSecOps", 0,
 "chapter: 03, chapitre 3 allumé", 'dip', '',
 "Voici maintenant les outils et l'architecture pour livrer et exploiter la plateforme."),
('outils-infra', '', "Outils d'infrastructure", 0,
 "chain: Docker (image) → ACR (registre) → AKS (exécution), avec Terraform en dessous qui décrit les ressources Azure ; une phrase de raison sous chaque outil", 'camera', '',
 "Docker prépare une image pour chaque service. Terraform décrit les ressources Azure dans des fichiers versionnés. AKS exécute les conteneurs et ACR conserve leurs images. Cette organisation permet de retrouver les versions et de reproduire l'infrastructure. Elle limite aussi les différences entre environnements."),
('outils-livraison', '', "Livraison, sécurité et supervision", 0,
 "five families: automatisation, déploiement GitOps, contrôles, secrets, supervision ; chaque famille avec ses outils et son rôle en une ligne", 'camera', '',
 "GitHub Actions exécute les tests et les analyses. ArgoCD applique au cluster la configuration enregistrée dans Git. Sealed Secrets permet de versionner les secrets sous forme chiffrée. Enfin, les outils de supervision suivent le fonctionnement des services."),
('devsecops', '', "Le cycle DevSecOps", 1,
 "infinity loop: Développement à gauche (planifier, coder, construire et tester), Exploitation à droite (livrer et déployer, exploiter, superviser), Sécurité au croisement ; un point parcourt la boucle ; au clic, le retour « observer → corriger » s'allume", 'camera', '',
 "La boucle représente un travail continu. Côté développement, on prépare le changement, on écrit le code, puis on construit et on teste. Côté exploitation, on déploie et on observe le service. [clic] Les résultats reviennent vers le développement pour préparer les corrections. La sécurité traverse cette boucle : analyses avant publication, protection des accès au déploiement, puis surveillance. Les contrôles exacts dépendent du composant concerné."),
('architecture', '', "Architecture de déploiement", 3,
 "diagram: utilisateurs → Ingress NGINX → frontend et API ; puis IA et PostgreSQL internes ; puis GitHub, ArgoCD, ACR ; puis staging et production dans le même cluster, namespaces et secrets distincts", 'camera', '',
 "Les services s'exécutent sur AKS. L'Ingress reçoit les requêtes et les dirige vers les interfaces ou l'API. [clic] L'API communique avec PostgreSQL et le service d'IA, qui restent internes. [clic] ArgoCD lit les manifestes dans Git, et le cluster récupère les images dans ACR. [clic] Staging et production partagent le cluster, avec des namespaces et des secrets distincts. La production est déployée, mais sa validation reste partielle."),
('routage', '', "Routage des requêtes", 2,
 "diagram: adresse publique → Ingress NGINX → hôtes (client, administration) → chemins (/api et /uploads → API, / → site) ; service IA interne ; petite capture admin staging (06/10)", 'camera', '',
 "Le routage permet de servir plusieurs composants derrière une adresse publique. [clic] L'Ingress reconnaît d'abord le nom d'hôte, pour distinguer le site client de l'administration. [clic] Il lit ensuite le chemin : les requêtes API vont au backend, les autres au site concerné. Le service d'IA reste accessible seulement en interne. Il est donc protégé des accès directs."),
('isolation', '', "Isolation réseau", 1,
 "diagram: flux autorisés en vert, flux refusés barrés (client → base, vers internet) ; au clic, « Calico · 10 tests sur 11 · 03/10 » et la case orange « DNS : à clarifier »", 'camera', '',
 "Séparer les namespaces ne suffit pas à bloquer les communications. J'ai donc ajouté des NetworkPolicies : elles refusent les échanges par défaut, puis autorisent les flux nécessaires. Par exemple, un frontend ne doit pas joindre directement la base. [clic] Calico applique ces règles. Dix tests sur onze étaient conformes lors de l'essai présenté ; le cas DNS reste à clarifier. Je garde donc cette limite explicite."),
('secrets', '', "Secrets et sauvegardes", 3,
 "diagram: secrets GitHub → pipeline (masqués) ; Sealed Secret chiffré dans Git → déchiffré dans le cluster → variable → capture admin connecté (06/10) ; puis bandeau données : volumes, sauvegarde quotidienne, restauration testée, copie externe manuelle", 'camera', '',
 "Il faut aussi protéger les secrets et les données. [clic] Les pipelines utilisent les secrets GitHub, qui restent masqués dans les journaux. [clic] Dans Git, Sealed Secrets conserve les valeurs chiffrées, que le contrôleur déchiffre dans le cluster. [clic] Les volumes assurent la persistance, et une sauvegarde quotidienne protège la base. Une restauration a été testée dans un environnement isolé. La copie externe a été vérifiée manuellement ; son automatisation reste à faire."),
# ── 4 · Chaîne CI/CD et déploiement
('ch4', '4 · Chaîne CI/CD et déploiement', "Chaîne CI/CD et déploiement", 0,
 "chapter: 04, chapitre 4 allumé", 'dip', '',
 "Suivons maintenant un changement de code jusqu'au cluster."),
('chaine', '', "Notre chaîne de livraison", 3,
 "diagram: le monde de la chaîne sur fond nuit ; zones poste, GitHub Actions, Azure s'allument une à une ; le point vert traverse", 'camera', '',
 "Cette vue relie les étapes de livraison. [clic] Je pousse un changement dans GitHub. [clic] GitHub Actions exécute les tests et les analyses du composant concerné. Si les conditions sont satisfaites, le pipeline construit et publie son image. [clic] Il met ensuite à jour le manifeste dans Git. ArgoCD synchronise le cluster, puis la supervision permet d'observer le résultat."),
('dix-pipelines', '', "Organisation des dix pipelines", 2,
 "diagram: zone 2 allumée ; cinq pipelines de composant (backend allumé) avec leur filtre de chemins, puis cinq contrôles transversaux", 'camera', '',
 "J'ai réparti la chaîne en dix pipelines. [clic] Cinq correspondent aux composants : backend, client web, administration, IA et mobile. Des filtres de chemins évitent de reconstruire un composant inchangé. [clic] Les cinq autres portent sur des contrôles transversaux, comme les secrets et l'infrastructure. Cette séparation facilite le diagnostic et évite des exécutions inutiles."),
('controle-publication', '', "Contrôler puis publier", 3,
 "diagram: pull request (contrôles, rien n'est publié) ; push sur staging après fusion (image ACR, manifeste) avec la capture PR #19 ; puis mobile (APK dans Azure Blob, pas de pod) et main (production déployée, validation partielle)", 'camera', '',
 "Une vérification et une publication sont deux actions différentes. [clic] Sur une pull request vers staging ou main, les contrôles concernés s'exécutent, sans publier d'image. [clic] Après la fusion, le push peut publier dans ACR et mettre à jour le manifeste. [clic] Staging et main ciblent leurs environnements respectifs. Le mobile suit un autre résultat : un APK distribué par Azure Blob, sans conteneur dans AKS."),
('tests', '', "Tests des règles métier", 1,
 "cards: API (JUnit), site client (Vitest), IA (pytest), mobile (flutter test), avec des exemples de règles testées ; au clic, « un test en échec arrête le pipeline » et la limite de l'administration", 'camera', '',
 "Les tests vérifient le comportement du code. Par exemple, l'API teste des règles de score, le client vérifie les restrictions liées à la grille, et le service Python teste le calcul carbone. [clic] Un échec de test arrête le pipeline avant la publication. Cela réduit les régressions, mais ne remplace pas les essais réels. La couverture de l'administration reste notamment à compléter."),
('analyses', '', "Les analyses de sécurité", 1,
 "table: secrets, code, bibliothèques, images, infrastructure · outil · où il tourne ; au clic, la note « chaque pipeline lance seulement les analyses de son périmètre »", 'camera', '',
 "Les analyses cherchent d'autres risques. Gitleaks détecte les secrets, Semgrep et SonarCloud examinent le code. Dependency-Check analyse les dépendances Java, Trivy les images, et Checkov l'infrastructure. [clic] Chaque outil intervient sur son périmètre. Par exemple, Dependency-Check concerne le backend Java. Il ne faut donc pas comprendre ce tableau comme six contrôles identiques dans tous les pipelines."),
('blocage', '', "Blocage et protection de la fusion", 2,
 "three columns revealed one by one: arrête le pipeline (Gitleaks, Dependency-Check CVSS ≥ 9, Trivy HIGH/CRITICAL corrigeable, SonarCloud sur PR et main) ; au clic, signale seulement (Semgrep, Checkov) ; au clic, protège la fusion (protection de branche absente, règle d'équipe)", 'camera', '',
 "Un rapport d'analyse ne bloque pas forcément une livraison. Certains contrôles arrêtent le pipeline : Gitleaks sur un secret, Dependency-Check au-dessus de son seuil, Trivy sur une faille grave corrigeable. SonarCloud bloque sur pull request et sur main. [clic] Semgrep et Checkov restent consultatifs dans cette configuration. [clic] Enfin, protéger la fusion nécessite une règle GitHub distincte. Cette protection automatique reste à mettre en place ; une consigne d'équipe ne lui est pas équivalente."),
('log4j', '', "Un contrôle bloquant mis à l'épreuve", 2,
 "diagram: étape 0 = pipeline backend normal, la dépendance log4j 2.14.1 ajoutée exprès ; au clic, Dependency-Check rouge, les étapes suivantes grisées ; au clic, dépendance retirée, tout redevient vert", 'camera', '',
 "Pour vérifier un contrôle, j'ai introduit volontairement une dépendance vulnérable : Log4j 2.14.1. [clic] Dependency-Check a identifié la vulnérabilité et arrêté le pipeline. [clic] Après le retrait de cette dépendance, l'exécution est redevenue conforme. Ce test montre que le contrôle agit réellement sur la livraison. Sa présence dans un fichier ne suffirait pas à le démontrer."),
('argocd', '', "Déploiement GitOps avec ArgoCD", 2,
 "diagram + photo: Git (état attendu) ; au clic, ArgoCD compare et applique ; au clic, la capture ArgoCD du 06/10, applications Synced et Healthy, avec la portée de ces états", 'camera', '',
 "Avec GitOps, Git décrit l'état attendu du déploiement. [clic] ArgoCD compare cet état à celui du cluster et applique les changements nécessaires. Le pipeline publie donc un manifeste, sans effectuer directement le déploiement applicatif. [clic] La capture montre des applications synchronisées et saines. Ces états confirment la synchronisation et la santé Kubernetes ; ils ne prouvent pas, à eux seuls, que tous les parcours métier fonctionnent."),
('tracabilite', '', "Traçabilité d'un changement", 4,
 "photo: quatre maillons révélés un à un, l'identifiant 62c42e1 surligné : run vert (03/10) → tag ACR (03/10) → commit du bot dans le manifeste (03/10) → pod staging (06/10)", 'camera', '',
 "Pour relier le code au service exécuté, je suis le même identifiant de version. [clic] Il apparaît dans l'exécution réussie du pipeline. [clic] On le retrouve dans le tag de l'image ACR, [clic] puis dans le manifeste enregistré dans Git. [clic] Enfin, le pod utilise cette image. Cette continuité permet de retrouver la version déployée et facilite le diagnostic d'un problème."),
# ── 5 · Supervision et validation
('ch5', '5 · Supervision et validation', "Supervision et validation", 0,
 "chapter: 05, chapitre 5 allumé", 'dip', '',
 "Après le déploiement, il faut vérifier le fonctionnement réel."),
('supervision', '', "Métriques, journaux et alertes", 3,
 "diagram: services → Prometheus → Grafana (métriques) ; puis services → Alloy → Loki → Grafana (journaux) ; puis Prometheus → Alertmanager → e-mail", 'camera', '',
 "La supervision combine plusieurs sources. [clic] Prometheus collecte les métriques et Grafana les affiche. [clic] Alloy transmet les journaux à Loki, également consultable dans Grafana. [clic] Prometheus évalue les règles d'alerte, puis Alertmanager envoie les notifications. Les métriques montrent un comportement, les journaux aident à l'expliquer, et les alertes signalent quand il faut intervenir."),
('metriques', '', "Métriques des services", 1,
 "photo: cibles Prometheus backend et IA UP (06/10) ; au clic, Grafana CPU et mémoire des pods (06/10)", 'camera', '',
 "Les cibles actives de Prometheus montrent que les métriques du backend et du service d'IA sont bien collectées. [clic] Grafana permet ensuite de suivre le processeur et la mémoire des pods. Ces vues donnent des repères pour diagnostiquer une surcharge. Elles démontrent la collecte et l'affichage, mais ne constituent pas un test de performance sous forte charge."),
('journaux', '', "Journaux centralisés", 1,
 "diagram + photo: chaîne action → backend → Alloy → Loki ; au clic, Grafana et la capture du tableau de bord « ZAWEDNI — Journaux » (07/10, adresse de test masquée), puis l'accès limité à Loki", 'camera', '',
 "J'ai suivi une connexion refusée sur staging. L'API a produit un journal, qu'Alloy a transmis à Loki. [clic] La ligne est ensuite visible dans Grafana. Je peux donc rechercher un événement sans ouvrir chaque conteneur. Un essai a aussi montré qu'un pod non autorisé ne pouvait pas accéder à Loki. La centralisation reste ainsi associée à un contrôle d'accès."),
('alerte', '', "Validation d'une alerte complète", 2,
 "timeline + photo: erreurs 500 → en attente → déclenchée ; au clic, e-mail FIRING → résolue → e-mail RESOLVED et les captures Prometheus et Gmail ; au clic, la portée de l'essai", 'camera', '',
 "J'ai déclenché un test contrôlé en provoquant des erreurs serveur, avec une requête en lecture seule. La règle a dépassé son seuil, puis l'alerte est devenue active. [clic] Un e-mail FIRING a été reçu. Après l'arrêt du test, l'alerte s'est résolue et un e-mail RESOLVED est arrivé. [clic] Ce résultat valide toute la chaîne pour cette règle. Les quatre autres règles sont chargées, mais leur déclenchement reste à tester."),
('validation', '', "Résultats et limites de validation", 1,
 "cards by scope: staging et sauvegarde (résultats, limites) ; au clic, production et mobile, avec les points encore ouverts", 'camera', '',
 "Sur staging, j'ai vérifié les parcours, les refus d'accès entre entreprises, les contrôles de livraison et la restauration d'une sauvegarde. [clic] En production, l'accès, l'isolement et le parcours principal ont aussi été vérifiés. La validation reste partielle : le guide RSE par l'API, la réception des alertes et l'installation de l'APK demandent encore des vérifications. Je distingue donc les résultats obtenus des points encore ouverts."),
# ── 6 · Bilan et perspectives
('ch6', '6 · Bilan et perspectives', "Bilan et perspectives", 0,
 "chapter: 06, chapitre 6 allumé", 'dip', '',
 "Je termine par les apports du mémoire et les améliorations prioritaires."),
('bilan', '', "Bilan du mémoire", 2,
 "two contributions: au clic, 01 développement (web client et administration, mobile, API, données et IA) ; au clic, 02 livraison et exploitation (infrastructure en code, contrôles et GitOps, supervision et sauvegardes) ; en bas, staging validé, production partiellement validée", 'camera', '',
 "Ce travail apporte deux résultats complémentaires. [clic] J'ai développé la plateforme web et mobile, avec ses règles métier et ses interfaces. [clic] J'ai ensuite construit une chaîne qui contrôle, livre et supervise ses évolutions. Les essais sur staging démontrent son fonctionnement. La production est déployée, avec une validation partielle. J'ai appris à justifier mes choix et à vérifier leur efficacité."),
('limites', '', "Perspectives", 3,
 "three horizons revealed one by one: court terme, consolider les mécanismes ; moyen terme, renforcer l'exploitation ; plus long terme, améliorer la disponibilité", 'camera', '',
 "Les perspectives prolongent les limites observées. [clic] À court terme, il faut rendre Semgrep et Checkov bloquants, automatiser la copie externe des sauvegardes et activer les migrations de base versionnées. [clic] Ensuite, les priorités sont le HTTPS, la protection des branches et des essais de sécurité après déploiement. [clic] À plus long terme, plusieurs réplicas et une adaptation automatique des ressources pourront améliorer la disponibilité. Ces évolutions demandent aussi davantage de moyens."),
('retour', '', "Conclusion", 1,
 "diagram: rappel besoin → plateforme → chaîne ; le point vert fait tout le chemin jusqu'au cluster, chaque zone s'allume ; puis « Merci pour votre attention »", 'camera', '',
 "ZAWEDNI relie un besoin d'achat local responsable à une solution web et mobile. [clic] Ma contribution couvre son développement et la chaîne qui accompagne ses évolutions, du code jusqu'à la supervision. Les limites observées définissent la suite du travail. Je vous remercie pour votre attention et je suis prêt à répondre à vos questions."),
]

HEAD = '''---
title: ZAWEDNI — Soutenance du mémoire
type: tech-talk
length: 20 min
rate: 115
audience: jury du mémoire (ISIMa, Master professionnel Computer Engineering : Expert Réseaux), techniques mais pas spécialistes DevOps
thesis: Ali a développé la plateforme web et mobile ZAWEDNI, puis mis en place une chaîne DevSecOps qui teste, analyse, publie, déploie et supervise ses évolutions ; staging est validé, la production est déployée avec une validation partielle.
through-line: besoin → plateforme développée → chaîne qui livre et supervise ; la conclusion reprend ces trois blocs
bookend: la question du besoin (slide 4) revient à la conclusion avec la solution et la chaîne
default-transition: camera
---

# Soutenance ZAWEDNI — script et discours (v4, 09/10/2026)

Source unique du discours : `build/script_rows.py`. La colonne Note est le discours, mot pour mot. `[clic]` = appuyer sur →.
Règle de rédaction : français B1 naturel et complet (voir HANDOFF, « Règle du discours v4 »).
Transitions : `camera` = on avance dans la même partie ; `dip` = nouveau chapitre.
Plan et preuves : `PLAN_PRESENTATION.md`. Questions probables du jury : `FICHE_PRIVEE_QUESTIONS.md` (jamais projetée).

| # | Chapter | Title (short, names the subject) | Steps | Visual | Transition | Through-line | Note |
|---|---|---|---|---|---|---|---|
'''
if __name__ == '__main__':
    import os
    os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
    out = HEAD
    for n, (sid, ch, ti, st, vi, tr, th, no) in enumerate(R, 1):
        for x in (ti, vi, no): assert '|' not in x, sid
        assert no.count('[clic]') == st, (sid, no.count('[clic]'), st)
        out += f'| {n} | {ch} | {ti} | {st} | {vi} | {tr} | {th} | {no} |\n'
    open('SCRIPT.md', 'w').write(out)
    print(len(R), 'rows ->', 'SCRIPT.md')
    print('IDS:', ' '.join(r[0] for r in R))
