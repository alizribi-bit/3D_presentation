#!/usr/bin/env node
import { writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { finalizeRevision } from './revision/finalize.mjs';

const root = resolve(import.meta.dirname, '..');

// 1. Load base sequences
const sequences = JSON.parse(readFileSync(resolve(root, 'content/source/sequences.json'), 'utf8'));

// 2. Adjust startup
const startup = sequences.find(s => s.id === 'startup');
if (startup) {
  startup.speech = [
    "ZAWEDNI est une startup tunisienne créée en décembre 2025 par Ali Zribi et Hadil Ben Masseoud. Elle a la forme juridique d'une SARL et elle est installée à la pépinière d'entreprises de Mahdia. ",
    "Elle propose un service qui relie l'achat local à une démarche de responsabilité sociétale des entreprises, ou RSE. Le projet comprend la plateforme web et mobile, puis les moyens de la déployer, de protéger ses données et de suivre son fonctionnement."
  ];
}

// 3. Adjust sommaire
const sommaire = sequences.find(s => s.id === 'sommaire');
if (sommaire) {
  sommaire.speech = [
    "Voici le plan. ",
    "On commence par ZAWEDNI, le problème, les besoins et l'organisation du travail. On passe ensuite au développement de la plateforme. Puis, on explique l'architecture DevSecOps, la chaîne de livraison et la supervision. On termine par le bilan, les perspectives et la conclusion."
  ];
}

// 4. Adjust conclusion (retour)
const retour = sequences.find(s => s.id === 'retour');
if (retour) {
  retour.speech = [
    "ZAWEDNI relie l'achat local à l'évaluation et au suivi des pratiques RSE. Le projet associe cette plateforme web et mobile à une chaîne DevSecOps. ",
    "On automatise la livraison, on intègre les contrôles de sécurité et on suit les services. Cela répond à la problématique présentée au début. Merci pour votre attention."
  ];
}

// 5. Adjust sequence (3 states)
const seqItem = sequences.find(s => s.id === 'sequence');
if (seqItem) {
  seqItem.title = "De l'inscription à l'accès au marché";
  seqItem.steps = 2;
  seqItem.speech = [
    "Pour utiliser ZAWEDNI, l'entreprise commence par créer son compte. L'administrateur lui envoie ensuite la grille d'évaluation. Les fonctions métier restent verrouillées jusqu'à l'approbation.",
    "L'entreprise remplit la grille et la soumet. L'administrateur examine les réponses, puis approuve ou rejette la grille.",
    "Si la grille est approuvée, l'accès est autorisé. Sinon, il reste bloqué. L'API vérifie cette décision avant d'autoriser les fonctions concernées."
  ];
}

// 6. Adjust parcours-app (5 states)
const parcoursApp = sequences.find(s => s.id === 'parcours-app');
if (parcoursApp) {
  parcoursApp.title = "Un même parcours sur le web et le mobile";
  parcoursApp.steps = 4;
  parcoursApp.speech = [
    "Après la création du compte, l'administrateur envoie la grille à l'entreprise.",
    "L'entreprise remplit la grille sur le web ou le mobile, puis la soumet.",
    "L'administrateur examine les réponses et approuve ou rejette la grille.",
    "Après approbation, l'entreprise consulte ses résultats.",
    "Elle peut ensuite accéder au marché local."
  ];
}

// 7. Adjust isolation (2 states)
const isolation = sequences.find(s => s.id === 'isolation');
if (isolation) {
  isolation.speech = [
    "Le routage dirige une demande vers le bon service. L'isolation réseau limite ensuite les échanges. Le backend peut joindre la base, mais une interface ne peut pas y accéder directement. ",
    "[lire] « NetworkPolicies : elles définissent les échanges autorisés entre les services concernés. » [lire] « Calico : il applique ces règles et bloque les échanges non autorisés. »"
  ];
}

// 8. Adjust alerte (3 states)
const alerte = sequences.find(s => s.id === 'alerte');
if (alerte) {
  alerte.speech = [
    "On provoque des erreurs pendant un test sur staging. Cela déclenche une alerte. [lire] « FIRING : l'alerte est active. »",
    "On arrête ensuite les erreurs du test. [lire] « Arrêt des erreurs de test. » [lire] « La condition d'alerte disparaît. » [lire] « RESOLVED : l'alerte n'est plus active. »",
    "[lire] « Prometheus détecte. Alertmanager notifie. Ils ne corrigent pas l'application. »"
  ];
}

// 9. Adjust validation (2 states)
const validation = sequences.find(s => s.id === 'validation');
if (validation) {
  validation.speech = [
    "On commence par les vérifications sur staging et les données. [lire] « Parcours et droits vérifiés. » [lire] « Restauration vérifiée. »",
    "On passe ensuite à la production et au mobile. [lire] « Parcours métier et guide pour une stratégie RSE testés. » [lire] « APK Android distribué par Azure Blob. »"
  ];
}

// 10. Define the three new sequences
const problematique = {
  id: "problematique",
  seq: 8,
  chapter: 1,
  title: "Les enjeux du projet",
  steps: 1,
  speech: [
    "Le projet doit proposer une application simple à utiliser et une plateforme fiable au quotidien. On retrouve ces enjeux dans le développement, la livraison, la sécurité et la supervision. ",
    "[lire] « Comment concevoir une plateforme web et mobile fluide et fiable, de son développement à son exploitation ? »"
  ],
  visual: "grid: 4 enjeux au centre ; au clic, la question centrale formulée et lue"
};

const besoins = {
  id: "besoins",
  seq: 9,
  chapter: 1,
  title: "Besoins du projet",
  steps: 1,
  speech: [
    "On précise ensuite ce que la solution doit faire. La plateforme couvre l'évaluation et les échanges entre entreprises. La chaîne DevSecOps doit construire les versions, les contrôler, les déployer et suivre les services. ",
    "On précise aussi les qualités attendues : protéger les données, faciliter la maintenance, retrouver l'origine des versions et maîtriser le coût. Ces besoins servent de repères pour les choix techniques et leur validation."
  ],
  visual: "columns: besoins Plateforme et Chaîne DevSecOps ; au clic, les besoins non fonctionnels"
};

const methodologie = {
  id: "methodologie",
  seq: 10,
  chapter: 1,
  title: "Organisation du travail",
  steps: 1,
  speech: [
    "On organise le travail en sprints, à partir d'un backlog de tâches. Chaque sprint a un objectif. On réalise, on teste, puis on présente le résultat. Les retours permettent de préparer la suite. ",
    "La chaîne DevSecOps se construit en trois releases et cinq sprints. [lire] « Release 1 : préparer l'environnement. » [lire] « Release 2 : automatiser la livraison. » [lire] « Release 3 : suivre et protéger les services. »"
  ],
  visual: "scrum + releases: 4 étapes Scrum ; au clic, les 3 releases et 5 sprints correspondants"
};

// Insert new sequences after modele and before ch2
const modeleIdx = sequences.findIndex(s => s.id === 'modele');
if (modeleIdx !== -1 && !sequences.some(s => s.id === 'problematique')) {
  sequences.splice(modeleIdx + 1, 0, problematique, besoins, methodologie);
}

// Re-index seq numbers 1..44
sequences.forEach((s, i) => { s.seq = i + 1; });

writeFileSync(resolve(root, 'content/source/sequences.json'), JSON.stringify(sequences, null, 2) + '\n');
console.log(`Updated sequences.json: ${sequences.length} sequences`);

// 11. Write public/content JSON files
// startup.json
const startupJson = {
  id: "startup",
  frames: [
    `<section class="slide" id="startup" data-pos="0 1.2" data-transition="dip" data-color="#03140d">
    <p class="kicker">01 · Contexte et objectifs</p>
    <h2 data-fit="2">La startup ZAWEDNI</h2>
    <div class="cd id" data-anim="rise">
      <div class="brand"><img src="assets/deck/logo-green.png" alt="Logo ZAWEDNI"><b>ZAWEDNI</b></div>
      <ul class="pt">
        <li>Forme juridique : SARL</li>
        <li>Création : décembre 2025</li>
        <li>Fondée par Ali Zribi et Hadil Ben Masseoud</li>
      </ul>
      <div class="loc" data-anim="fade" data-delay=".35">
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#083f1f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"></path><circle cx="12" cy="9.5" r="2.5"></circle></svg>
        <span><small>INSTALLÉE À LA</small><b>Pépinière d’entreprises de Mahdia, Tunisie</b></span>
      </div>
    </div>
    <div class="cd mis" data-step="1" data-anim="rise" style="opacity: 0; visibility: hidden; transform: translate(0px, 44px);">
      <p class="tag">LE SERVICE</p>
      <p>Relier l’achat local à une démarche RSE.</p>
      <small>Évaluation, achat local, guide pour une stratégie RSE et suivi des résultats. RSE : responsabilité sociétale des entreprises.</small>
    </div>
    <div class="cd me" data-step="1" data-anim="rise" data-delay=".35" style="opacity: 0; visibility: hidden; transform: translate(0px, 44px);">
      <h3>Le projet ZAWEDNI</h3>
      <div class="row"><i>1</i><span>Une plateforme web et mobile</span></div>
      <div class="row"><i>2</i><span>Une infrastructure pour son déploiement</span></div>
      <div class="row"><i>3</i><span>Des contrôles de sécurité et une supervision</span></div>
    </div>
  </section>`,
    `<section class="slide" id="startup" data-pos="0 1.2" data-transition="dip" data-color="#03140d">
    <p class="kicker">01 · Contexte et objectifs</p>
    <h2 data-fit="2">La startup ZAWEDNI</h2>
    <div class="cd id" data-anim="rise">
      <div class="brand"><img src="assets/deck/logo-green.png" alt="Logo ZAWEDNI"><b>ZAWEDNI</b></div>
      <ul class="pt">
        <li>Forme juridique : SARL</li>
        <li>Création : décembre 2025</li>
        <li>Fondée par Ali Zribi et Hadil Ben Masseoud</li>
      </ul>
      <div class="loc" data-anim="fade" data-delay=".35">
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#083f1f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"></path><circle cx="12" cy="9.5" r="2.5"></circle></svg>
        <span><small>INSTALLÉE À LA</small><b>Pépinière d’entreprises de Mahdia, Tunisie</b></span>
      </div>
    </div>
    <div class="cd mis" data-step="1" data-anim="rise" style="">
      <p class="tag">LE SERVICE</p>
      <p>Relier l’achat local à une démarche RSE.</p>
      <small>Évaluation, achat local, guide pour une stratégie RSE et suivi des résultats. RSE : responsabilité sociétale des entreprises.</small>
    </div>
    <div class="cd me" data-step="1" data-anim="rise" data-delay=".35" style="">
      <h3>Le projet ZAWEDNI</h3>
      <div class="row"><i>1</i><span>Une plateforme web et mobile</span></div>
      <div class="row"><i>2</i><span>Une infrastructure pour son déploiement</span></div>
      <div class="row"><i>3</i><span>Des contrôles de sécurité et une supervision</span></div>
    </div>
  </section>`
  ]
};
writeFileSync(resolve(root, 'public/content/startup.json'), JSON.stringify(startupJson) + '\n');

// sommaire.json
const sommaireJson = {
  id: "sommaire",
  frames: [
    `<section class="slide" id="sommaire" data-pos="1.1 0">
    <p class="kicker" data-step="1" data-anim="fade" style="opacity: 0; visibility: hidden;">Plan de la présentation</p>
    <h2 data-fit="2" style="transform: translateY(330px) scale(1.35);">Sommaire</h2>
    <ol class="list" data-step="1" data-anim="left" data-delay=".15" data-stagger=".36" data-dur=".7">
      <li style="opacity: 0; visibility: hidden; transform: translate(-64px, 0px);"><i>01</i><b>Contexte et objectifs</b><span>ZAWEDNI, les objectifs et l'organisation du projet</span></li>
      <li style="opacity: 0; visibility: hidden; transform: translate(-64px, 0px);"><i>02</i><b>Développement de la plateforme</b><span>Les choix techniques, la conception et les interfaces</span></li>
      <li style="opacity: 0; visibility: hidden; transform: translate(-64px, 0px);"><i>03</i><b>Architecture et démarche DevSecOps</b><span>Les outils, le cluster, le réseau et les secrets</span></li>
      <li style="opacity: 0; visibility: hidden; transform: translate(-64px, 0px);"><i>04</i><b>Chaîne CI/CD et déploiement</b><span>Le trajet d’un changement jusqu’au déploiement</span></li>
      <li style="opacity: 0; visibility: hidden; transform: translate(-64px, 0px);"><i>05</i><b>Supervision et validation</b><span>Le suivi des services et les résultats des essais</span></li>
      <li style="opacity: 0; visibility: hidden; transform: translate(-64px, 0px);"><i>06</i><b>Bilan, perspectives et conclusion</b><span>Les apports du mémoire et les prochaines étapes</span></li>
    </ol>
  </section>`,
    `<section class="slide" id="sommaire" data-pos="1.1 0">
    <p class="kicker" data-step="1" data-anim="fade" style="">Plan de la présentation</p>
    <h2 data-fit="2" style="transform: translateY(0px) scale(1);">Sommaire</h2>
    <ol class="list" data-step="1" data-anim="left" data-delay=".15" data-stagger=".36" data-dur=".7">
      <li style=""><i>01</i><b>Contexte et objectifs</b><span>ZAWEDNI, les objectifs et l'organisation du projet</span></li>
      <li style=""><i>02</i><b>Développement de la plateforme</b><span>Les choix techniques, la conception et les interfaces</span></li>
      <li style=""><i>03</i><b>Architecture et démarche DevSecOps</b><span>Les outils, le cluster, le réseau et les secrets</span></li>
      <li style=""><i>04</i><b>Chaîne CI/CD et déploiement</b><span>Le trajet d’un changement jusqu’au déploiement</span></li>
      <li style=""><i>05</i><b>Supervision et validation</b><span>Le suivi des services et les résultats des essais</span></li>
      <li style=""><i>06</i><b>Bilan, perspectives et conclusion</b><span>Les apports du mémoire et les prochaines étapes</span></li>
    </ol>
  </section>`
  ]
};
writeFileSync(resolve(root, 'public/content/sommaire.json'), JSON.stringify(sommaireJson) + '\n');

// retour.json
const retourJson = {
  id: "retour",
  frames: [
    `<section class="slide night" id="retour" data-pos="4.4 7.2">
    <img class="logo" src="assets/deck/logo-white.png" alt="ZAWEDNI">
    <p class="kicker">Bilan et perspectives · Conclusion</p>
    <h2 data-fit="2">Conclusion</h2>
    <div class="blk" style="left:150px" data-anim="rise"><p class="n">LE BESOIN</p><h3>Une stratégie RSE suivie</h3><p class="v">Lien achat local, grille d'évaluation et suivi RSE</p></div>
    <div class="blk" style="left:725px" data-anim="rise" data-delay=".35"><p class="n">LA PLATEFORME</p><h3>ZAWEDNI, web et mobile</h3><p class="v">Grille d’évaluation, marché local, suivi RSE</p></div>
    <div class="blk me" style="left: 1300px; opacity: 0; visibility: hidden; transform: translate(0px, 44px);" data-step="1" data-anim="rise"><p class="n">LA DÉMARCHE DEVSECOPS</p><h3>Du code à l’exploitation</h3><p class="v">Livraison automatisée, contrôles de sécurité et supervision des services</p></div>
    <svg class="art" viewBox="0 0 1920 1080">
      <defs><marker id="rt-a" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#5be38f"></path></marker></defs>
      <path d="M624,495 H717" fill="none" stroke="#5be38f" stroke-width="4" marker-end="url(#rt-a)" data-anim="draw" data-delay=".25" data-dur=".4" pathLength="1" style=""></path>
      <path d="M1199,495 H1292" fill="none" stroke="#5be38f" stroke-width="4" marker-end="url(#rt-a)" data-step="1" data-anim="draw" data-dur=".4" pathLength="1" style="stroke-dasharray: 1, 1; stroke-dashoffset: 1; opacity: 0; visibility: hidden;"></path>
    </svg>
    <p class="merci" data-step="1" data-anim="rise" data-delay="1.1" style="opacity: 0; visibility: hidden; transform: translate(0px, 44px);">Merci pour votre attention</p>
  </section>`,
    `<section class="slide night" id="retour" data-pos="4.4 7.2">
    <img class="logo" src="assets/deck/logo-white.png" alt="ZAWEDNI">
    <p class="kicker">Bilan et perspectives · Conclusion</p>
    <h2 data-fit="2">Conclusion</h2>
    <div class="blk" style="left:150px" data-anim="rise"><p class="n">LE BESOIN</p><h3>Une stratégie RSE suivie</h3><p class="v">Lien achat local, grille d'évaluation et suivi RSE</p></div>
    <div class="blk" style="left:725px" data-anim="rise" data-delay=".35"><p class="n">LA PLATEFORME</p><h3>ZAWEDNI, web et mobile</h3><p class="v">Grille d’évaluation, marché local, suivi RSE</p></div>
    <div class="blk me" style="left: 1300px;" data-step="1" data-anim="rise"><p class="n">LA DÉMARCHE DEVSECOPS</p><h3>Du code à l’exploitation</h3><p class="v">Livraison automatisée, contrôles de sécurité et supervision des services</p></div>
    <svg class="art" viewBox="0 0 1920 1080">
      <defs><marker id="rt-a" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#5be38f"></path></marker></defs>
      <path d="M624,495 H717" fill="none" stroke="#5be38f" stroke-width="4" marker-end="url(#rt-a)" data-anim="draw" data-delay=".25" data-dur=".4" pathLength="1" style=""></path>
      <path d="M1199,495 H1292" fill="none" stroke="#5be38f" stroke-width="4" marker-end="url(#rt-a)" data-step="1" data-anim="draw" data-dur=".4" pathLength="1" style=""></path>
    </svg>
    <p class="merci" data-step="1" data-anim="rise" data-delay="1.1" style="">Merci pour votre attention</p>
  </section>`
  ]
};
writeFileSync(resolve(root, 'public/content/retour.json'), JSON.stringify(retourJson) + '\n');

// parcours-app.json (5 states)
const parcoursFrames = [
  // 0: Envoi de la grille: admin seule centrée agrandie
  `<section class="slide" id="parcours-app" data-pos="4.4 2.4">
    <p class="kicker">Développement de la plateforme · Interfaces</p>
    <h2 data-fit="2">Un même parcours sur le web et le mobile</h2>
    <p class="lab" style="left: 380px; letter-spacing: 0.02em;" data-anim="fade">Envoi de la grille par l’administrateur</p>
    <div class="shot adm" data-anim="rise" data-lint-skip="" style="left: 380px; width: 1160px;"><div class="bar"><i></i><i></i><i></i><span>Administration (web) · attribution et envoi de la grille</span></div><div class="im"><img src="assets/deck/admin-envoi-grille.png" alt="Administration : envoi de la grille d'évaluation à l'entreprise"></div></div>
    <ol class="rail">
      <li><span class="on" data-anim="fade"></span><i>1</i><b>Envoi de la grille</b></li>
      <li><i>2</i><b>Remplissage</b></li>
      <li><i>3</i><b>Décision admin</b></li>
      <li><i>4</i><b>Résultats</b></li>
      <li><i>5</i><b>Marché local</b></li>
    </ol>
    <p class="src" data-anim="fade">Version locale du site d’administration, données réelles</p>
  </section>`,
  // 1: Remplissage web entreprise + mobile
  `<section class="slide" id="parcours-app" data-pos="4.4 2.4">
    <p class="kicker">Développement de la plateforme · Interfaces</p>
    <h2 data-fit="2">Un même parcours sur le web et le mobile</h2>
    <p class="lab" style="left: 150px;" data-anim="fade">WEB</p>
    <div class="shot" data-anim="rise" data-lint-skip=""><div class="bar"><i></i><i></i><i></i><span>Site client · Évaluation RSE : piliers de la grille</span></div><div class="im"><img src="assets/deck/v6-sup-piliers.jpg" alt="Web : les piliers de la grille d'évaluation"></div></div>
    <div class="mob" data-anim="fade" data-delay=".1">
      <p class="lab" style="left:1200px">MOBILE</p>
      <div class="ph" data-lint-skip=""><img src="assets/deck/v3-mob-evaluation.jpg" alt="Mobile : une question de la grille d'évaluation"></div>
      <p class="apk">APK Android · Azure Blob</p>
    </div>
    <ol class="rail">
      <li><i>1</i><b>Envoi de la grille</b></li>
      <li><span class="on" data-anim="fade"></span><i>2</i><b>Remplissage</b></li>
      <li><i>3</i><b>Décision admin</b></li>
      <li><i>4</i><b>Résultats</b></li>
      <li><i>5</i><b>Marché local</b></li>
    </ol>
    <p class="src" data-anim="fade">Version locale et écrans Flutter, données de démonstration</p>
  </section>`,
  // 2: Décision admin web seule agrandie
  `<section class="slide" id="parcours-app" data-pos="4.4 2.4">
    <p class="kicker">Développement de la plateforme · Interfaces</p>
    <h2 data-fit="2">Un même parcours sur le web et le mobile</h2>
    <p class="lab" style="left: 380px; letter-spacing: 0.02em;" data-anim="fade">Examen de la grille par l’administrateur</p>
    <div class="shot adm" data-anim="rise" data-lint-skip="" style="left: 380px; width: 1160px;"><div class="bar"><i></i><i></i><i></i><span>Administration (web) · suivi des évaluations et décision</span></div><div class="im"><img src="assets/deck/v7-adm-revue.jpg" alt="Administration : suivi des évaluations RSE des entreprises, statuts, scores et dates"></div></div>
    <ol class="rail">
      <li><i>1</i><b>Envoi de la grille</b></li>
      <li><i>2</i><b>Remplissage</b></li>
      <li><span class="on" data-anim="fade"></span><i>3</i><b>Décision admin</b></li>
      <li><i>4</i><b>Résultats</b></li>
      <li><i>5</i><b>Marché local</b></li>
    </ol>
    <p class="src" data-anim="fade">Version locale du site d’administration, données de démonstration</p>
  </section>`,
  // 3: Résultats web + mobile
  `<section class="slide" id="parcours-app" data-pos="4.4 2.4">
    <p class="kicker">Développement de la plateforme · Interfaces</p>
    <h2 data-fit="2">Un même parcours sur le web et le mobile</h2>
    <p class="lab" style="left: 150px;" data-anim="fade">WEB</p>
    <div class="shot" data-anim="rise" data-lint-skip=""><div class="bar"><i></i><i></i><i></i><span>Site client · Suivi de la revue</span></div><div class="im"><img src="assets/deck/v6-sup-revue.jpg" alt="Web : suivi de la revue, certification accordée, score par pilier"></div></div>
    <div class="mob" data-anim="fade" data-delay=".1">
      <p class="lab" style="left:1200px">MOBILE</p>
      <div class="ph" data-lint-skip=""><img src="assets/deck/v3-mob-status_approved.jpg" alt="Mobile : suivi de la revue, certification accordée"></div>
      <p class="apk">APK Android · Azure Blob</p>
    </div>
    <ol class="rail">
      <li><i>1</i><b>Envoi de la grille</b></li>
      <li><i>2</i><b>Remplissage</b></li>
      <li><i>3</i><b>Décision admin</b></li>
      <li><span class="on" data-anim="fade"></span><i>4</i><b>Résultats</b></li>
      <li><i>5</i><b>Marché local</b></li>
    </ol>
    <p class="src" data-anim="fade">Version locale et écrans Flutter, données de démonstration</p>
  </section>`,
  // 4: Marché local web + mobile
  `<section class="slide" id="parcours-app" data-pos="4.4 2.4">
    <p class="kicker">Développement de la plateforme · Interfaces</p>
    <h2 data-fit="2">Un même parcours sur le web et le mobile</h2>
    <p class="lab" style="left: 150px;" data-anim="fade">WEB</p>
    <div class="shot" data-anim="rise" data-lint-skip=""><div class="bar"><i></i><i></i><i></i><span>Site client · Marketplace</span></div><div class="im"><img src="assets/deck/v3-buy-marketplace.jpg" alt="Web : marketplace, fournisseurs filtrés par secteur, région, certification et distance"></div></div>
    <div class="mob" data-anim="fade" data-delay=".1">
      <p class="lab" style="left:1200px">MOBILE</p>
      <div class="ph" data-lint-skip=""><img src="assets/deck/v3-mob-marketplace_companies.jpg" alt="Mobile : marketplace des fournisseurs"></div>
      <p class="apk">APK Android · Azure Blob</p>
    </div>
    <ol class="rail">
      <li><i>1</i><b>Envoi de la grille</b></li>
      <li><i>2</i><b>Remplissage</b></li>
      <li><i>3</i><b>Décision admin</b></li>
      <li><i>4</i><b>Résultats</b></li>
      <li><span class="on" data-anim="fade"></span><i>5</i><b>Marché local</b></li>
    </ol>
    <p class="src" data-anim="fade">Version locale et écrans Flutter, données de démonstration</p>
  </section>`
];
writeFileSync(resolve(root, 'public/content/parcours-app.json'), JSON.stringify({ id: "parcours-app", frames: parcoursFrames }) + '\n');

// validation.json (2 states)
const validationFrames = [
  // 0: Staging + Données
  `<section class="slide" id="validation" data-pos="5.5 6">
    <p class="kicker">Supervision et validation · Résultats</p>
    <h2 data-fit="2">Résultats de validation</h2>
    <div class="pm" style="left:150px; top:300px" data-anim="rise"><h3>Staging <span class="tag">périmètre validé</span></h3><ul><li>Parcours et droits vérifiés.</li><li>Contrôles bloquants et alerte testés.</li></ul></div>
    <div class="pm" style="left:980px; top:300px" data-anim="rise" data-delay=".15"><h3>Données</h3><ul><li>Sauvegarde quotidienne en staging.</li><li>Restauration vérifiée.</li><li data-step="1" data-anim="fade" data-delay=".3" style="opacity: 0; visibility: hidden;">Sauvegarde de production exécutée.</li></ul></div>
    <div class="pm" style="left: 150px; top: 600px; opacity: 0; visibility: hidden; transform: translate(0px, 44px);" data-step="1" data-anim="rise"><h3>Production <span class="tag">déployée par GitOps</span></h3><ul><li>Parcours métier et guide pour une stratégie RSE testés.</li><li>Métriques et journaux disponibles.</li><li>Notifications reçues en anglais.</li></ul></div>
    <div class="pm" style="left: 980px; top: 600px; opacity: 0; visibility: hidden; transform: translate(0px, 44px);" data-step="1" data-anim="rise" data-delay=".15"><h3>Mobile</h3><ul><li>Même API que le web.</li><li>APK Android distribué par Azure Blob.</li></ul></div>
  </section>`,
  // 1: Production + Mobile
  `<section class="slide" id="validation" data-pos="5.5 6">
    <p class="kicker">Supervision et validation · Résultats</p>
    <h2 data-fit="2">Résultats de validation</h2>
    <div class="pm" style="left:150px; top:300px" data-anim="rise"><h3>Staging <span class="tag">périmètre validé</span></h3><ul><li>Parcours et droits vérifiés.</li><li>Contrôles bloquants et alerte testés.</li></ul></div>
    <div class="pm" style="left:980px; top:300px" data-anim="rise" data-delay=".15"><h3>Données</h3><ul><li>Sauvegarde quotidienne en staging.</li><li>Restauration vérifiée.</li><li data-step="1" data-anim="fade" data-delay=".3" style="">Sauvegarde de production exécutée.</li></ul></div>
    <div class="pm" style="left: 150px; top: 600px;" data-step="1" data-anim="rise"><h3>Production <span class="tag">déployée par GitOps</span></h3><ul><li>Parcours métier et guide pour une stratégie RSE testés.</li><li>Métriques et journaux disponibles.</li><li>Notifications reçues en anglais.</li></ul></div>
    <div class="pm" style="left: 980px; top: 600px;" data-step="1" data-anim="rise" data-delay=".15"><h3>Mobile</h3><ul><li>Même API que le web.</li><li>APK Android distribué par Azure Blob.</li></ul></div>
  </section>`
];
writeFileSync(resolve(root, 'public/content/validation.json'), JSON.stringify({ id: "validation", frames: validationFrames }) + '\n');

// problematique.json (2 states)
const problematiqueFrames = [
  // 0: Entrée 4 enjeux
  `<section class="slide" id="problematique" data-pos="5.5 1.2">
    <p class="kicker">Contexte et objectifs</p>
    <h2 data-fit="2">Les enjeux du projet</h2>
    <div class="enjeux-grid" data-anim="rise">
      <div class="enjeu-card"><b>Développement</b><span>Proposer une plateforme web et mobile claire et fluide.</span></div>
      <div class="enjeu-card"><b>Livraison</b><span>Automatiser des mises en ligne fiables.</span></div>
      <div class="enjeu-card"><b>Sécurité</b><span>Protéger les accès, les données et les versions.</span></div>
      <div class="enjeu-card"><b>Supervision</b><span>Suivre les services et repérer les incidents.</span></div>
    </div>
    <div class="question-box" data-step="1" data-anim="rise" style="opacity: 0; visibility: hidden; transform: translate(0px, 44px);">
      <p>Comment concevoir une plateforme web et mobile fluide et fiable, de son développement à son exploitation ?</p>
    </div>
  </section>`,
  // 1: Clic question
  `<section class="slide" id="problematique" data-pos="5.5 1.2">
    <p class="kicker">Contexte et objectifs</p>
    <h2 data-fit="2">Les enjeux du projet</h2>
    <div class="enjeux-grid" data-anim="rise">
      <div class="enjeu-card"><b>Développement</b><span>Proposer une plateforme web et mobile claire et fluide.</span></div>
      <div class="enjeu-card"><b>Livraison</b><span>Automatiser des mises en ligne fiables.</span></div>
      <div class="enjeu-card"><b>Sécurité</b><span>Protéger les accès, les données et les versions.</span></div>
      <div class="enjeu-card"><b>Supervision</b><span>Suivre les services et repérer les incidents.</span></div>
    </div>
    <div class="question-box" data-step="1" data-anim="rise" style="">
      <p>Comment concevoir une plateforme web et mobile fluide et fiable, de son développement à son exploitation ?</p>
    </div>
  </section>`
];
writeFileSync(resolve(root, 'public/content/problematique.json'), JSON.stringify({ id: "problematique", frames: problematiqueFrames }) + '\n');

// besoins.json (2 states)
const besoinsFrames = [
  // 0: Groupes Plateforme et Chaîne DevSecOps
  `<section class="slide" id="besoins" data-pos="6.6 1.2">
    <p class="kicker">Contexte et objectifs</p>
    <h2 data-fit="2">Besoins du projet</h2>
    <div class="besoins-cols" data-anim="rise">
      <div class="besoin-col">
        <h3>Plateforme</h3>
        <ul>
          <li>Gérer les comptes, les rôles et les dossiers.</li>
          <li>Évaluer les entreprises et permettre les échanges sur le marché local.</li>
          <li>Produire les résultats, recommandations et rapports.</li>
        </ul>
      </div>
      <div class="besoin-col">
        <h3>Chaîne DevSecOps</h3>
        <ul>
          <li>Construire, contrôler et déployer les versions.</li>
          <li>Protéger les secrets et limiter les communications.</li>
          <li>Collecter les métriques et journaux, envoyer les alertes et sauvegarder les données.</li>
        </ul>
      </div>
    </div>
    <div class="non-fonc" data-step="1" data-anim="rise" style="opacity: 0; visibility: hidden; transform: translate(0px, 44px);">
      <h4>QUALITÉS ATTENDUES (NON FONCTIONNELS)</h4>
      <ul>
        <li><b>Confidentialité :</b> chaque entreprise accède aux données autorisées.</li>
        <li><b>Disponibilité :</b> redémarrer les services défaillants et servir les instances prêtes.</li>
        <li><b>Maintenabilité et traçabilité :</b> retrouver les configurations et l'origine des versions.</li>
        <li><b>Portabilité et maîtrise :</b> portabilité des images et maîtrise du coût cloud.</li>
      </ul>
    </div>
  </section>`,
  // 1: Clic non fonctionnels
  `<section class="slide" id="besoins" data-pos="6.6 1.2">
    <p class="kicker">Contexte et objectifs</p>
    <h2 data-fit="2">Besoins du projet</h2>
    <div class="besoins-cols" data-anim="rise">
      <div class="besoin-col">
        <h3>Plateforme</h3>
        <ul>
          <li>Gérer les comptes, les rôles et les dossiers.</li>
          <li>Évaluer les entreprises et permettre les échanges sur le marché local.</li>
          <li>Produire les résultats, recommandations et rapports.</li>
        </ul>
      </div>
      <div class="besoin-col">
        <h3>Chaîne DevSecOps</h3>
        <ul>
          <li>Construire, contrôler et déployer les versions.</li>
          <li>Protéger les secrets et limiter les communications.</li>
          <li>Collecter les métriques et journaux, envoyer les alertes et sauvegarder les données.</li>
        </ul>
      </div>
    </div>
    <div class="non-fonc" data-step="1" data-anim="rise" style="">
      <h4>QUALITÉS ATTENDUES (NON FONCTIONNELS)</h4>
      <ul>
        <li><b>Confidentialité :</b> chaque entreprise accède aux données autorisées.</li>
        <li><b>Disponibilité :</b> redémarrer les services défaillants et servir les instances prêtes.</li>
        <li><b>Maintenabilité et traçabilité :</b> retrouver les configurations et l'origine des versions.</li>
        <li><b>Portabilité et maîtrise :</b> portabilité des images et maîtrise du coût cloud.</li>
      </ul>
    </div>
  </section>`
];
writeFileSync(resolve(root, 'public/content/besoins.json'), JSON.stringify({ id: "besoins", frames: besoinsFrames }) + '\n');

// methodologie.json (2 states)
const methodologieFrames = [
  // 0: Scrum 4 étapes
  `<section class="slide" id="methodologie" data-pos="7.7 1.2">
    <p class="kicker">Contexte et objectifs</p>
    <h2 data-fit="2">Organisation du travail</h2>
    <p class="sub">Scrum : un backlog et des sprints</p>
    <div class="scrum-steps" data-anim="rise">
      <div class="step-c"><i>1</i><p>Prioriser les tâches</p></div>
      <div class="step-c"><i>2</i><p>Fixer l'objectif du sprint</p></div>
      <div class="step-c"><i>3</i><p>Réaliser et tester</p></div>
      <div class="step-c"><i>4</i><p>Présenter le résultat et préparer la suite</p></div>
    </div>
    <div class="releases" data-step="1" data-anim="rise" style="opacity: 0; visibility: hidden; transform: translate(0px, 44px);">
      <div class="rel-box">
        <h3>Release 1</h3>
        <p class="read-p">Release 1 : préparer l'environnement.</p>
        <ul>
          <li><b>S1</b> Conteneurisation</li>
          <li><b>S2</b> Infrastructure Azure</li>
        </ul>
      </div>
      <div class="rel-box">
        <h3>Release 2</h3>
        <p class="read-p">Release 2 : automatiser la livraison.</p>
        <ul>
          <li><b>S3</b> Pipelines CI sécurisés</li>
          <li><b>S4</b> Déploiement GitOps</li>
        </ul>
      </div>
      <div class="rel-box">
        <h3>Release 3</h3>
        <p class="read-p">Release 3 : suivre et protéger les services.</p>
        <ul>
          <li><b>S5</b> Observabilité, cloisonnement et sauvegarde</li>
        </ul>
      </div>
    </div>
  </section>`,
  // 1: Clic 3 releases / 5 sprints
  `<section class="slide" id="methodologie" data-pos="7.7 1.2">
    <p class="kicker">Contexte et objectifs</p>
    <h2 data-fit="2">Organisation du travail</h2>
    <p class="sub">Scrum : un backlog et des sprints</p>
    <div class="scrum-steps" data-anim="rise">
      <div class="step-c"><i>1</i><p>Prioriser les tâches</p></div>
      <div class="step-c"><i>2</i><p>Fixer l'objectif du sprint</p></div>
      <div class="step-c"><i>3</i><p>Réaliser et tester</p></div>
      <div class="step-c"><i>4</i><p>Présenter le résultat et préparer la suite</p></div>
    </div>
    <div class="releases" data-step="1" data-anim="rise" style="">
      <div class="rel-box">
        <h3>Release 1</h3>
        <p class="read-p">Release 1 : préparer l'environnement.</p>
        <ul>
          <li><b>S1</b> Conteneurisation</li>
          <li><b>S2</b> Infrastructure Azure</li>
        </ul>
      </div>
      <div class="rel-box">
        <h3>Release 2</h3>
        <p class="read-p">Release 2 : automatiser la livraison.</p>
        <ul>
          <li><b>S3</b> Pipelines CI sécurisés</li>
          <li><b>S4</b> Déploiement GitOps</li>
        </ul>
      </div>
      <div class="rel-box">
        <h3>Release 3</h3>
        <p class="read-p">Release 3 : suivre et protéger les services.</p>
        <ul>
          <li><b>S5</b> Observabilité, cloisonnement et sauvegarde</li>
        </ul>
      </div>
    </div>
  </section>`
];
writeFileSync(resolve(root, 'public/content/methodologie.json'), JSON.stringify({ id: "methodologie", frames: methodologieFrames }) + '\n');

finalizeRevision(root);
console.log("All revised content frames generated successfully.");
