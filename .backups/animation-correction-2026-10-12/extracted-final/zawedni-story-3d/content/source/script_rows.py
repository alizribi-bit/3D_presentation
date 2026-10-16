# Source of SCRIPT.md rows (v9, 2026-10-11). Run: python3 build/script_rows.py  -> writes SCRIPT.md
# Columns: id, chapter, title, steps, visual, transition, through-line, note (speech, [clic] = →)
# A non-empty chapter cell opens a new row of the camera world (merge.py); chapter openers use 'dip'.
# Speech rule (v6, replaces v4): French B1, mostly "on" and the present tense ("on a testé" for past trials);
# one idea per sentence, each explanation gives the jury a concrete point; transitions link two ideas.
# [lire] « … » = a sentence projected on the slide that Ali reads as it is (it must match the slide word for word).
# Everything else in the note is said. Reserves go to Perspectives and FICHE_PRIVEE_QUESTIONS.md.
SlideRow = tuple[str, str, str, int, str, str, str, str]
R: list[SlideRow] = [
# ── 0 · Ouverture
('couverture', '0 · Ouverture', "Conception et déploiement d'une plateforme web et mobile pour l'achat local intégrant une approche DevSecOps", 1,
 "cover: étape 0 = la formule arabe seule ; un clic lance une séquence automatique d'environ 2,8 s : logos, MEMOIRE DE FIN D'ETUDES, titre, Ali Zribi et la formation, puis le bloc « Les membres du jury » (présidente, rapporteure, encadrantes)", '-', '',
 "Bonjour à toutes et à tous. [clic] Madame la Présidente, Mesdames les membres du jury, merci pour votre présence. Merci également à mes encadrantes pour leur accompagnement. Ce mémoire porte sur le développement de la plateforme ZAWEDNI et son déploiement avec une approche DevSecOps."),
('sommaire', '', "Sommaire", 1,
 "list: étape 0 = « Sommaire » seul ; un clic fait apparaître les six parties l'une après l'autre (≈ 2,5 s), numéro, titre et une ligne d'explication", 'camera', '',
  "Voici le plan. [clic] On commence par ZAWEDNI, le problème, les besoins et l'organisation du travail. On passe ensuite au développement de la plateforme. Puis, on explique l'architecture DevSecOps, la chaîne de livraison et la supervision. On termine par le bilan, les perspectives et la conclusion."),
# ── 1 · Contexte et objectifs
('startup', '1 · Contexte et objectifs', "La startup ZAWEDNI", 1,
  "two blocks: à gauche l'identité (startup tunisienne, forme juridique SARL, création décembre 2025, fondateurs, lieu « Pépinière d'entreprises de Mahdia, Tunisie ») ; au clic, à droite le service (achat local et RSE : évaluation, achat local, guide, suivi) et le bloc « Le projet ZAWEDNI » (plateforme web et mobile, infrastructure de déploiement, contrôles de sécurité et supervision)", 'dip', '',
  "ZAWEDNI est une startup tunisienne créée en décembre 2025 par Ali Zribi et Hadil Ben Masseoud. Elle a la forme juridique d'une SARL et elle est installée à la pépinière d'entreprises de Mahdia. [clic] Elle propose un service qui relie l'achat local à une démarche de responsabilité sociétale des entreprises, ou RSE. Le projet comprend la plateforme web et mobile, puis les moyens de la déployer, de protéger ses données et de suivre son fonctionnement."),
('probleme', '', "Le problème à résoudre", 1,
 "read: étape 0 = trois numéros 01 02 03 ; au clic, les trois constats apparaissent en grand, l'un après l'autre : Ali les lit", 'camera', '',
 "Pour comprendre l'idée de ZAWEDNI, on part de trois constats. [clic] [lire] « Les actions RSE restent parfois ponctuelles, comme des dons. » [lire] « Il manque une stratégie claire pour agir et suivre les résultats. » [lire] « Il est difficile de comparer les fournisseurs locaux sur leurs pratiques responsables. »"),
('reponse', '', "La réponse de ZAWEDNI", 1,
 "read: quatre cartes reliées, la grille d'évaluation en tête et mise en valeur (valeur ajoutée), puis validation, marché local, suivi, avec une flèche de retour vers la grille ; étape 0 = les titres seuls ; au clic, les quatre phrases : Ali les lit", 'camera', '',
 "ZAWEDNI propose une réponse à ces trois points. [clic] [lire] « Une grille d'évaluation pour mesurer les pratiques de l'entreprise. » [lire] « Une validation pour rendre les fournisseurs évalués visibles sur le marché. » [lire] « Un marché local pour trouver des partenaires et suivre les achats. » [lire] « Des recommandations, un guide pour une stratégie RSE et un rapport ESG pour suivre les résultats. »"),
('acteurs', '', "Les acteurs de la plateforme", 1,
 "read: bloc Entreprises (repère acheteur · fournisseur, fonctions communes) ; au clic, bloc Administrateur : Ali lit les deux listes", 'camera', '',
 "Ces services sont accessibles à deux catégories d'utilisateurs. [lire] « Les entreprises : évaluation, consultation des résultats, marché local, recommandations et rapports. » Acheteur et fournisseur sont regroupés ici, car les fonctions présentées sont communes. [clic] [lire] « L'administrateur : gestion des comptes, examen des grilles d'évaluation et validation des dossiers. »"),
('modele', '', "Business Model Canvas", 3,
 "image: le BMC réel de l'annexe B en entier à gauche ; à droite, les trois parties choisies ; chaque clic entoure une partie (impulsion discrète puis contour fixe), atténue les autres et l'agrandit à droite : segments de clientèle, propositions de valeur (avec, à côté, une carte « Complément » sur la grille d'évaluation, absente de l'annexe), sources de revenus", 'camera', '',
 "Le Business Model Canvas résume le modèle économique de ZAWEDNI. On se concentre sur trois parties. [clic] Les clients visés. [lire] « Acheteurs : les hôtels, les maisons d'hôte. » [lire] « Vendeurs : producteurs bio, producteurs agroalimentaires, artisans du terroir, fournisseurs agroalimentaires. » [clic] La valeur proposée. [lire] « Marketplace B2B pour l'achat et l'approvisionnement des produits agroalimentaires et terroirs, bio et locaux. » [lire] « Calcul de l'empreinte carbone. » [lire] « Reporting ESG. » [lire] « Sécurité et protection des données. » On y ajoute la grille d'évaluation, au cœur de la plateforme : [lire] « Une grille d'évaluation pour mesurer les pratiques responsables de l'entreprise, avant la validation de son dossier. » [clic] Les sources de revenus prévues. [lire] « Abonnements des clients, avec une offre de base gratuite. » [lire] « Publicités. » [lire] « Services premium. »"),
('problematique', '', 'Les enjeux du projet', 1, 'quatre enjeux à l’entrée ; au clic, question générale sur le développement et l’exploitation', 'camera', '', 'Le projet doit proposer une application simple à utiliser et une plateforme fiable au quotidien. On retrouve ces enjeux dans le développement, la livraison, la sécurité et la supervision. [clic] [lire] « Comment concevoir une plateforme web et mobile fluide et fiable, de son développement à son exploitation ? »'),
('besoins', '', "Besoins du projet", 1,
 "two families: besoins fonctionnels à l'entrée (plateforme et chaîne DevSecOps) ; au clic, confidentialité, disponibilité, maintenabilité et traçabilité, portabilité et coût", 'camera', '',
 "On précise ensuite ce que la solution doit faire. La plateforme couvre l'évaluation et les échanges entre entreprises. La chaîne DevSecOps doit construire les versions, les contrôler, les déployer et suivre les services. [clic] On précise aussi les qualités attendues : protéger les données, faciliter la maintenance, retrouver l'origine des versions et maîtriser le coût. Ces besoins servent de repères pour les choix techniques et leur validation."),
('methodologie', '', 'Organisation du travail', 1, 'cycle Scrum en quatre étapes ; au clic, trois releases et cinq sprints DevSecOps, vérification transversale', 'camera', '', "On organise le travail en sprints, à partir d'un backlog de tâches. Chaque sprint a un objectif. On réalise, on teste, puis on présente le résultat. Les retours permettent de préparer la suite. [clic] La chaîne DevSecOps se construit en trois releases et cinq sprints. [lire] « Release 1 : préparer l'environnement. » [lire] « Release 2 : automatiser la livraison. » [lire] « Release 3 : suivre et protéger les services. »"),
# ── 2 · Développement de la plateforme
('ch2', '2 · Développement de la plateforme', "Développement de la plateforme", 0,
 "chapter: 02, chapitre 2 allumé dans le sommaire", 'dip', '',
 "La solution est définie. On passe à sa réalisation : les outils, l'architecture de l'application et les interfaces."),
('outils-dev', '', "Langages et outils de développement", 0,
 "grid: cinq rôles (web, mobile, API, service spécialisé, données) avec langage, framework et raison ; Groq à part, avec son périmètre limité au texte", 'camera', '',
 "Pour réaliser cette plateforme, chaque technologie a un rôle. React sert au web et Flutter au mobile. Spring Boot porte les règles métier et les droits d'accès. FastAPI réalise les calculs spécialisés. PostgreSQL conserve les données. Cette répartition sépare les responsabilités et garde une logique commune pour le web et le mobile."),
('plateforme', '', "Architecture de la plateforme", 2,
 "diagram: site client, administration, mobile → API Spring Boot (REST + JWT) ; puis PostgreSQL (SQL, JPA) ; puis service d'IA FastAPI (REST interne + clé) et Groq", 'camera', '',
 "Le web et le mobile envoient leurs demandes à la même API Spring Boot : le serveur qui applique les règles. L'API identifie l'utilisateur avec son jeton JWT et vérifie ses droits. [clic] Elle lit et enregistre les données dans PostgreSQL. [clic] Pour les traitements spécialisés, elle appelle FastAPI. Groq intervient pour rédiger le guide pour une stratégie RSE et la synthèse ESG. Les scores et les chiffres sont calculés par l'application."),
('sequence', '', "De l'inscription à l'accès au marché", 2, 'diagramme de séquence : Entreprise, API Spring Boot, PostgreSQL, Administrateur ; compte et attribution → réponses et décision → contrôle API avec bloc alternatif accès autorisé/refusé', 'camera', '', "Pour utiliser ZAWEDNI, l'entreprise commence par créer son compte. L'administrateur lui envoie ensuite la grille d'évaluation. Les fonctions métier restent verrouillées jusqu'à l'approbation. [clic] L'entreprise remplit la grille et la soumet. L'administrateur examine les réponses, puis approuve ou rejette la grille. [clic] Si la grille est approuvée, l'accès est autorisé. Sinon, il reste bloqué. L'API vérifie cette décision avant d'autoriser les fonctions concernées."),
('parcours-app', '', 'Un même parcours sur le web et le mobile', 4, 'cinq états : envoi (capture réelle agrandie et centrée de la modale d’attribution, administration seule) → remplissage web/mobile → décision administration web seule agrandie → résultats web/mobile → marché web/mobile ; repère actif par état', 'camera', '', "Après la création du compte, l'administrateur envoie la grille à l'entreprise. [clic] L'entreprise remplit la grille sur le web ou le mobile, puis la soumet. [clic] L'administrateur examine les réponses et approuve ou rejette la grille. [clic] Après approbation, l'entreprise consulte ses résultats. [clic] Elle peut ensuite accéder au marché local."),
# ── 3 · Architecture et démarche DevSecOps
('ch3', '3 · Architecture et démarche DevSecOps', "Architecture et démarche DevSecOps", 0,
 "chapter: 03, chapitre 3 allumé", 'dip', '',
 "Une question se pose maintenant : comment mettre une nouvelle version en ligne, réduire les erreurs et protéger les données ? C'est le rôle de l'approche DevSecOps. On commence par l'environnement qui accueille l'application."),
('outils-infra', '', "Outils d'infrastructure", 0,
 "chain: Docker (image) → ACR (registre) → AKS (exécution), avec Terraform en dessous qui décrit les ressources Azure ; une phrase de raison sous chaque outil", 'camera', '',
 "Pour cet environnement, on utilise quatre outils complémentaires. Docker prépare une image qui contient le service et ce qu'il faut pour l'exécuter. ACR, le registre, conserve ces images. AKS les utilise pour faire tourner les services dans un cluster, c'est-à-dire un groupe de machines. Terraform décrit les ressources Azure dans des fichiers. On peut ainsi retrouver la configuration et reproduire l'environnement sans tout régler à la main."),
('outils-livraison', '', "Les outils de la chaîne DevSecOps", 0,
 "five families: automatisation, déploiement GitOps, contrôles (« Analyses de sécurité », détaillées outil par outil en slide 29), secrets, supervision ; chaque famille avec ses outils et son rôle en une ligne", 'camera', '',
 "Cet environnement accueille l'application. Pour livrer ses nouvelles versions, on organise les outils en cinq familles. GitHub Actions automatise les étapes. ArgoCD déploie la configuration enregistrée dans Git. Les analyses de sécurité contrôlent chaque composant ; on les détaille plus loin. Sealed Secrets protège les secrets, et la supervision suit les services."),
('devsecops', '', "Le cycle DevSecOps", 1,
 "infinity loop: Développement à gauche (planifier, coder, construire et tester), Exploitation à droite (livrer et déployer, exploiter, superviser), Sécurité au croisement ; un point parcourt la boucle ; au clic, le retour « observer → corriger » s'allume", 'camera', '',
 "Ces outils forment un cycle continu. À gauche, on prépare une modification, on écrit le code et on le teste. À droite, on déploie et on observe le service. [clic] Un problème détecté conduit à une correction du code. La sécurité accompagne le cycle : contrôle du code, protection des accès et surveillance. Ce lien entre développement, sécurité et exploitation forme l'approche DevSecOps."),
('architecture', '', "Architecture de déploiement", 3,
 "diagram: utilisateurs → Ingress NGINX → frontend et API (trafic utilisateur en vert) ; puis IA et PostgreSQL internes ; puis GitHub, ArgoCD, ACR (déploiement en orange) ; au dernier clic, l'encadré lu à l'écran : staging et production dans un même cluster à deux nœuds", 'camera', '',
 "Voici l'architecture déployée sur Azure. L'Ingress, la porte d'entrée du cluster, reçoit les demandes des utilisateurs et les dirige vers les sites ou l'API. [clic] PostgreSQL et le service d'IA sont accessibles par l'API, à l'intérieur du cluster. [clic] ArgoCD lit la configuration dans Git ; AKS récupère les images dans ACR. [clic] [lire] « Staging et production : un même cluster à deux nœuds, avec des namespaces, des secrets et des données distincts. » [lire] « Parcours principaux vérifiés en production. »"),
('routage', '', "Le chemin d'une requête", 2,
 "diagram: une adresse d'exemple en haut (nom du site, puis chemin) ; étape 0 = adresse publique → Ingress NGINX ; au clic 1, le nom du site est souligné et les deux hôtes apparaissent ; au clic 2, le chemin est souligné et les flèches / → site, /api et /uploads → backend apparaissent ; service IA interne", 'camera', '',
 "Plusieurs sites utilisent la même adresse IP publique. L'Ingress reçoit la demande et choisit le bon service. [clic] Il regarde d'abord le nom du site : le nom client mène au site client, et le nom admin au site d'administration. [clic] Il regarde ensuite le chemin. Une page du site va vers l'interface ; une demande qui commence par /api va vers le backend. Le service d'IA est appelé par l'API et reste interne."),
('isolation', '', 'Isolation réseau', 1, 'colonnes accès public, point d’entrée, application, services internes ; flux applicatifs autorisés ; au clic, interface pod → PostgreSQL refusé et rôle des NetworkPolicies et de Calico', 'camera', '', "Le routage dirige une demande vers le bon service. L'isolation réseau limite ensuite les échanges. Le backend peut joindre la base, mais une interface ne peut pas y accéder directement. [clic] [lire] « NetworkPolicies : elles définissent les échanges autorisés entre les services concernés. » [lire] « Calico : il applique ces règles et bloque les échanges non autorisés. »"),
('secrets', '', "Secrets et sauvegardes", 3,
 "diagram: secrets GitHub → pipeline (masqués) ; Sealed Secret chiffré dans Git → déchiffré dans le cluster → variable → capture admin connecté ; puis bandeau données : volumes, sauvegarde quotidienne, restauration isolée, copie externe dans Azure Blob", 'camera', '',
 "On protège aussi les identifiants et les données. [clic] Les secrets GitHub fournissent les identifiants aux pipelines, sans les écrire dans le code. [clic] Sealed Secrets conserve les secrets applicatifs chiffrés dans Git. Le contrôleur les déchiffre dans le cluster. [clic] Les volumes conservent les données ; les sauvegardes permettent de les récupérer. Une restauration isolée et une copie externe dans Azure Blob ont été vérifiées."),
# ── 4 · Chaîne CI/CD et déploiement
('ch4', '4 · Chaîne CI/CD et déploiement', "Chaîne CI/CD et déploiement", 0,
 "chapter: 04, chapitre 4 allumé", 'dip', '',
 "On suit maintenant une modification du code, depuis GitHub jusqu'à la version déployée dans le cluster."),
('chaine', '', "Notre chaîne de livraison", 3,
 "diagram: le monde de la chaîne sur fond nuit ; zones poste, GitHub Actions, Azure s'allument une à une ; le point vert traverse", 'camera', '',
 "Cette chaîne organise une nouvelle version. [clic] On enregistre la modification dans GitHub. [clic] GitHub Actions lance les tests et les analyses. Si la publication est autorisée et les contrôles passent, l'image est envoyée dans ACR. [clic] Le pipeline change le manifeste : le fichier qui indique quelle image utiliser. ArgoCD applique cette version dans le cluster."),
('dix-pipelines', '', "Organisation des dix pipelines", 2,
 "diagram: zone 2 allumée ; cinq pipelines de composant (backend allumé) avec leur filtre de chemins, puis cinq contrôles transversaux", 'camera', '',
 "La chaîne comporte dix pipelines. [clic] Cinq suivent les composants : backend, client web, administration, IA et mobile. Les chemins modifiés indiquent quel composant reconstruire. [clic] Les autres portent sur des contrôles communs, comme les secrets ou l'infrastructure. Cela évite les reconstructions inutiles et facilite la recherche d'une étape en échec."),
('controle-publication', '', "Vérifier avant de publier", 3,
 "diagram: pull request (contrôles, rien n'est publié) ; push sur staging après fusion (image ACR, manifeste) avec la capture PR #19 ; puis mobile (APK dans Azure Blob, pas de pod) et main (production)", 'camera', '',
 "Il y a deux moments à distinguer. [clic] Avant la fusion, on ouvre une pull request : une demande pour intégrer le changement. Les contrôles s'exécutent, mais aucune image n'est publiée. [clic] Après la fusion, le push déclenche les étapes de livraison prévues. Si les contrôles passent, l'image est publiée et le manifeste est mis à jour. [clic] Staging reçoit la version de test ; main sert à la production. Pour le mobile, le résultat est un APK distribué par Azure Blob."),
('tests', '', "Que vérifient les tests ?", 1,
 "three boxes: comportement attendu (l'entreprise A tente de modifier un employé de B → refus, données inchangées) → résultat du test (comparaison) → effet sur la livraison ; au clic : « Résultat conforme : le pipeline continue » / « Test en échec : la publication s'arrête » ; en petit : EmployeeServiceOwnershipTest et les frameworks par composant", 'camera', '',
 "Avant de publier, on vérifie le comportement du code avec des tests automatiques. Par exemple, une entreprise ne doit pas modifier un employé d'une autre entreprise. Le test prépare ce cas et vérifie que la modification est refusée. [clic] Si le résultat correspond à la règle, le test passe. Sinon, il échoue et la publication s'arrête."),
('analyses', '', "Que recherchent les analyses de sécurité ?", 6,
 "table + card: six outils dans un tableau ; chaque clic entoure une ligne et affiche à droite une seule carte lisible avec son rôle : Gitleaks, Semgrep, SonarCloud, Dependency-Check, Trivy, Checkov ; au dernier clic, le bandeau sur les périmètres", 'camera', '',
 "Les tests vérifient le fonctionnement. Les analyses recherchent des risques. [clic] Gitleaks : [lire] « Repère les mots de passe, clés et jetons présents dans le code. » [clic] Semgrep : [lire] « Analyse le code pour repérer des pratiques à risque. » [clic] SonarCloud : [lire] « Vérifie la qualité du code, la couverture des tests et les critères de sécurité configurés. » [clic] Dependency-Check : [lire] « Recherche les vulnérabilités connues dans les bibliothèques Java du backend. » [clic] Trivy : [lire] « Recherche les vulnérabilités connues dans les images des services. » [clic] Checkov : [lire] « Analyse les fichiers d'infrastructure pour repérer des configurations à risque. » [lire] « Les analyses sont choisies selon le composant : dépendances Java pour le backend, images pour les services conteneurisés, configuration pour l'infrastructure. »"),
('blocage', '', "Quels contrôles arrêtent la livraison ?", 2,
 "three columns revealed one by one: arrête le pipeline (Gitleaks, Dependency-Check CVSS ≥ 9, Trivy HIGH/CRITICAL corrigeable, SonarCloud sur PR et main) ; au clic, signale seulement (Semgrep, Checkov) ; au clic, protège la fusion (protection de branche : règle GitHub distincte, prévue dans les perspectives)", 'camera', '',
 "Ces outils ne produisent pas tous le même effet. Gitleaks, Dependency-Check, Trivy et SonarCloud peuvent arrêter le pipeline selon les critères configurés. [clic] Dans cette configuration, Semgrep et Checkov signalent les problèmes sans arrêter la livraison. [clic] La fusion dans GitHub dépend d'une autre règle : la protection des branches."),
('log4j', '', "Un blocage vérifié en pratique", 2,
 "diagram: étape 0 = pipeline backend normal, la dépendance log4j 2.14.1 ajoutée exprès ; au clic, Dependency-Check rouge, les étapes suivantes grisées ; au clic, dépendance retirée, tout redevient vert", 'camera', '',
 "Voici un essai volontaire : une version vulnérable de Log4j a été ajoutée au backend. [clic] Dependency-Check a détecté la vulnérabilité et arrêté le pipeline. [clic] Après le retrait de cette dépendance, le pipeline est revenu au vert. Le contrôle bloque donc réellement la livraison pour ce risque."),
('argocd', '', "Déploiement GitOps avec ArgoCD", 2,
 "diagram + photo: Git (état attendu) ; au clic, ArgoCD compare et applique ; au clic, les applications ArgoCD Synced et Healthy", 'camera', '',
 "Après la publication, il reste à déployer la version. Avec GitOps, la configuration est enregistrée dans Git. [clic] ArgoCD la compare avec le cluster et applique les changements. [clic] Synced indique que la configuration est synchronisée. Healthy indique que les ressources sont dans l'état de santé attendu."),
('tracabilite', '', "Traçabilité d'une version", 4,
 "photo: quatre maillons révélés un à un, l'identifiant 62c42e1 surligné : run vert → tag ACR → commit du bot dans le manifeste → pod staging", 'camera', '',
 "Pour retrouver la version déployée, on suit le même identifiant. [clic] Il apparaît dans le pipeline, [clic] dans l'image ACR, [clic] dans le manifeste Git, [clic] puis dans l'image utilisée par le pod. On relie ainsi le code au service qui fonctionne, ce qui facilite le diagnostic."),
# ── 5 · Supervision et validation
('ch5', '5 · Supervision et validation', "Supervision et validation", 0,
 "chapter: 05, chapitre 5 allumé", 'dip', '',
 "La version est en ligne. On passe à la supervision : suivre les services, repérer les problèmes et vérifier les résultats."),
('supervision', '', "Métriques, journaux et alertes", 3,
 "diagram: services → Prometheus → Grafana (métriques) ; puis services → Alloy → Loki → Grafana (journaux) ; puis Prometheus → Alertmanager → e-mail", 'camera', '',
 "La supervision utilise trois types d'informations. [clic] Les métriques donnent des mesures, comme la mémoire ou le nombre d'erreurs. Prometheus les collecte et Grafana les affiche. [clic] Les journaux décrivent les événements de l'application. Alloy les collecte, Loki les conserve et Grafana permet de les consulter. [clic] Si une mesure dépasse un seuil configuré, Prometheus déclenche une alerte et Alertmanager envoie la notification."),
('metriques', '', "Métriques des services", 1,
 "photo: étape 0, les deux cibles Prometheus en pleine largeur, noms et états UP repérés ; au clic, Grafana prend toute la slide : panneau CPU et panneau mémoire avec leurs légendes (bas du panneau mémoire absent de la capture d'origine)", 'camera', '',
 "Dans Prometheus, les deux cibles, l'IA et le backend, sont UP : leurs métriques sont accessibles. [clic] Dans Grafana, on suit le processeur et la mémoire utilisés par les pods. Ces graphiques permettent de repérer une hausse de charge et de comprendre le comportement des services."),
('journaux', '', "Journaux centralisés", 1,
 "diagram + photo: chaîne action → backend → Alloy → Loki → Grafana ; au clic, le tableau de bord « ZAWEDNI — Journaux » (adresse de test masquée) et l'intérêt pour le diagnostic", 'camera', '',
 "Pour comprendre un événement, on consulte les journaux. Ici, une connexion refusée a produit un journal du backend. Alloy l'a collecté et Loki l'a conservé. [clic] Dans Grafana, on retrouve l'événement, son service et son heure, sans ouvrir chaque conteneur."),
('alerte', '', "De l'erreur à la notification", 2, 'frise UTC en deux groupes Déclenchement / Fin de l’alerte ; captures staging Prometheus et Gmail (heure locale) conservées ; FIRING → arrêt du test, condition disparue, RESOLVED → rôle des outils', 'camera', '', "On provoque des erreurs pendant un test sur staging. Cela déclenche une alerte. [lire] « FIRING : l'alerte est active. » [clic] On arrête ensuite les erreurs du test. [lire] « Arrêt des erreurs de test. » [lire] « La condition d'alerte disparaît. » [lire] « RESOLVED : l'alerte n'est plus active. » [clic] [lire] « Prometheus détecte. Alertmanager notifie. Ils ne corrigent pas l'application. »"),
('validation', '', 'Résultats de validation', 1, 'quatre rubriques en listes courtes : staging et données ; au clic production, sauvegarde de production et mobile', 'camera', '', 'On commence par les vérifications sur staging et les données. [lire] « Parcours et droits vérifiés. » [lire] « Restauration vérifiée. » [clic] On passe ensuite à la production et au mobile. [lire] « Parcours métier et guide pour une stratégie RSE testés. » [lire] « APK Android distribué par Azure Blob. »'),
# ── 6 · Bilan, perspectives et conclusion
('ch6', '6 · Bilan, perspectives et conclusion', "Bilan, perspectives et conclusion", 0,
  "chapter: 06, chapitre 6 allumé", 'dip', '',
  "On termine avec le bilan, les perspectives et la conclusion."),
('bilan', '', "Bilan du mémoire", 2,
 "two blocks: au clic, Plateforme réalisée (web client et administration, mobile, API, données et IA) ; au clic, Déploiement et exploitation (infrastructure en code, contrôles et GitOps, supervision et sauvegardes) ; au dernier clic, phrase de synthèse affichée", 'camera', '',
 "Ce mémoire réunit deux volets. [clic] La plateforme web et mobile relie l'évaluation, le marché local et le suivi RSE. [clic] L'environnement DevSecOps contrôle les versions, les déploie et suit les services. [lire] « Les essais en staging et en production montrent comment ces deux volets fonctionnent ensemble. »"),
('limites', '', "Perspectives", 3,
 "three horizons revealed one by one: court terme, consolider les mécanismes ; moyen terme, renforcer l'exploitation ; plus long terme, améliorer la disponibilité", 'camera', '',
 "Les prochaines étapes prolongent le projet. [clic] On prévoit d'automatiser la copie externe des sauvegardes, de versionner les migrations et de renforcer les contrôles. [clic] On prévoit aussi le HTTPS, la protection des branches et des analyses après déploiement. [clic] Plusieurs réplicas et une adaptation des ressources à la charge peuvent ensuite améliorer la disponibilité."),
('video', '', "Le parcours d'une version, du code au suivi", 1,
 "video: le film de 90 s (media/zawedni-devsecops.mp4, corrigé le 10/10 : production déployée par GitOps) ; étape 0 = affiche et bouton « Lire la vidéo » ; au clic, lecture avec le son dans la fenêtre projetée seulement ; pause, volume et reprise par les contrôles du lecteur ; quitter la slide arrête et rembobine", 'camera', '',
 "Pour terminer, cette vidéo résume le parcours d'une version, du code au suivi de la plateforme. [clic] (Laisser jouer le film, une minute trente, sans parler. À la fin, passer à la conclusion.)"),
('retour', '', "Conclusion", 1,
 "diagram: le besoin → la plateforme ZAWEDNI → la démarche DevSecOps ; puis « Merci pour votre attention »", 'camera', '',
 "ZAWEDNI relie l'achat local à l'évaluation et au suivi des pratiques RSE. Le projet associe cette plateforme web et mobile à une chaîne DevSecOps. [clic] On automatise la livraison, on intègre les contrôles de sécurité et on suit les services. Cela répond à la problématique présentée au début. Merci pour votre attention."),
]

HEAD = '''---
title: ZAWEDNI — Soutenance du mémoire
type: tech-talk
length: 24 min (estimation ; non répétée)
rate: 115
audience: jury du mémoire (ISIMa, Master professionnel Computer Engineering : Expert Réseaux), techniques mais pas spécialistes DevOps
thesis: la plateforme ZAWEDNI relie l'achat local à une grille d'évaluation et au suivi RSE ; une démarche DevSecOps contrôle, déploie et supervise ses versions, en staging comme en production.
through-line: besoin → plateforme développée → chaîne qui livre et supervise ; la conclusion reprend ces trois blocs
bookend: la question générale (slide 8) revient à la conclusion avec la plateforme et la chaîne
default-transition: camera
---

# Soutenance ZAWEDNI — script et discours (v9, 11/10/2026)

Source unique du discours : `build/script_rows.py`. La colonne Note est le discours, mot pour mot. `[clic]` = une pression sur →. `[lire] « … »` = phrase affichée, lue telle quelle.
Règle de rédaction : français B1, « on » et le présent (voir HANDOFF, « Règle du discours v6 »).
Transitions : `camera` = on avance dans la même partie ; `dip` = nouveau chapitre.
Plan et preuves : `PLAN_PRESENTATION.md`. Questions probables du jury : `FICHE_PRIVEE_QUESTIONS.md` (jamais projetée).

| # | Chapter | Title (short, names the subject) | Steps | Visual | Transition | Through-line | Note |
|---|---|---|---|---|---|---|---|
'''
if __name__ == '__main__':
    import os
    os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
    from estimate import estimate, mmss
    out = HEAD.replace('length: 24 min (estimation ; non répétée)',
                       f'length: {mmss(estimate(R).total_seconds)} (estimation ; non répétée)')
    for n, (sid, ch, ti, st, vi, tr, th, no) in enumerate(R, 1):
        for x in (ti, vi, no): assert '|' not in x, sid
        assert no.count('[clic]') == st, (sid, no.count('[clic]'), st)
        out += f'| {n} | {ch} | {ti} | {st} | {vi} | {tr} | {th} | {no} |\n'
    open('SCRIPT.md', 'w').write(out)
    print(len(R), 'rows ->', 'SCRIPT.md')
    print('IDS:', ' '.join(r[0] for r in R))
