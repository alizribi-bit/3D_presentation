# Fiche privée — périmètres et vérification

Les formulations publiques suivent le prompt accepté d’Ali. Ne pas élargir les
résultats aux parcours, langues ou contrôles qui ne sont pas explicitement cités.
La disponibilité est un besoin, sans revendication de haute disponibilité ou de
montée en charge automatique acquise.

Les sources locales examinées sont le ZIP classique v9, l’historique v7, la modale
d’attribution, `GridAssignmentStatus.java`, `GridAccessService.java`,
`GridCheckFilter.java` et les manifestes staging d’Ingress et NetworkPolicy.
L’attribution utilise le statut `PENDING` dans l’énumération actuelle : le statut
`ASSIGNED` introduit par un premier générateur a été retiré. Le discours public
emploie les termes métier français.

L’approbation est vérifiée par `existsByCompanyIdAndStatus(..., APPROVED)`.
`GridCheckFilter` ne concerne que certains endpoints et exempte plusieurs rôles.
Son chemin d’exception laisse passer la requête : les schémas n’affirment donc
pas une garantie globale couvrant toute erreur du serveur. L’application voisine
n’a pas été modifiée pour cette tâche.

Les policies staging sélectionnent les namespaces d’application et les pods
concernés. Les namespaces de monitoring et du contrôleur Ingress ne sont pas
couverts par le même refus par défaut. Le navigateur accède à `/api` via Ingress ;
le pod d’interface ne contacte pas directement PostgreSQL. La base reçoit aussi
le CronJob de sauvegarde autorisé, hors du flux principal simplifié du tableau.
L’absence d’exposition publique de la base n’est pas attribuée à Calico.

Ces vérifications portent sur les fichiers locaux. Aucun contrôle sur le cluster
actif, aucune nouvelle validation métier en production et aucun test physique
de projecteur ou d’écoute audio ne sont revendiqués dans cette session.

La durée est estimée à partir du discours complet et des transitions. Une répétition
parlée reste nécessaire pour fixer le rythme personnel d’Ali ; aucun texte n’a été
supprimé pour compenser la 3D.
