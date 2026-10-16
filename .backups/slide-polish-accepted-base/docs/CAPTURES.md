# Captures et preuves de la révision 44

| État | Source locale réelle |
| --- | --- |
| parcours-app-0 · Envoi de la grille | `public/assets/deck/admin-envoi-grille.png` |
| parcours-app-1 · Remplissage web | `v6-sup-piliers.jpg` |
| parcours-app-1 · Remplissage mobile | `v3-mob-evaluation.jpg` |
| parcours-app-2 · Décision administrateur | `v7-adm-revue.jpg` |
| parcours-app-3 · Résultats web | `v6-sup-revue.jpg` |
| parcours-app-3 · Résultats mobile | `v3-mob-status_approved.jpg` |
| parcours-app-4 · Marché web | `v3-buy-marketplace.jpg` |
| parcours-app-4 · Marché mobile | `v3-mob-marketplace_companies.jpg` |
| BMC et parties ciblées | `v6-bmc.png`, `v6-bmc-segments.png`, `v6-bmc-valeur.png`, `v6-bmc-revenus.png` |
| Prometheus · alerte staging FIRING | `v3-prom-firing-rule.jpg` |
| Alertmanager · notifications FIRING/RESOLVED | `v3-gmail-rows.jpg` |
| Métriques et journaux | `v7-prom-targets.jpg`, `v7-grafana-cpu.jpg`, `v7-grafana-mem.jpg`, `v3-grafana-journaux.jpg` |

La nouvelle capture a été obtenue dans l’application d’administration réelle, depuis
`ZawedniAdmin/src/components/AssignmentModal.jsx`, pour une entreprise du jeu de démonstration local. La raison sociale affichée est
« Société Tunisienne d’Emballage Durable ». La modale affiche « Envoyer le Questionnaire » et son
bouton réel « Envoyer la Grille CSR ». Aucun bouton d’envoi n’a été actionné ;
aucune réponse API n’a été simulée. Le serveur SMTP était désactivé dans cette
démonstration isolée et aucune donnée de production n’a été touchée.

L’image du panneau est une capture navigateur de la modale complète, agrandie.
La capture du contexte complet est `review/revision/admin-envoi-grille-full.png`.
La provenance, les requêtes et les empreintes sont dans `content/revision-assets.json`.
Les conteneurs de démonstration sont arrêtés après capture.

Les captures historiques et le film restent byte-identiques. Les preuves d’alerte
gardent leurs heures UTC ; Gmail présente l’heure locale UTC+1. Les tableaux de
séquence et d’isolation sont des diagrammes SVG explicatifs, clairement distincts
des captures de l’application.
