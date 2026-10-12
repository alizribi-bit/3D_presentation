const phrases = [
  ["FIRING : l'alerte est active."],
  ['Arrêt des erreurs de test.', "La condition d'alerte disparaît.", "RESOLVED : l'alerte n'est plus active."],
  ["Prometheus détecte. Alertmanager notifie. Ils ne corrigent pas l'application."],
];
const proof = (src, alt, title) => `<figure><figcaption>${title}</figcaption><img src="assets/deck/${src}" alt="${alt}"></figure>`;
export function alertFrames() {
  const steps = [
    [['Erreurs de test', '12:29 UTC'], ['Prometheus · FIRING', '12:33 UTC'], ['Alertmanager · notification', '12:33 UTC']],
    [['Arrêt des erreurs', '12:34 UTC'], ['Prometheus · condition disparue', '≈ 12:38 UTC'], ['Alertmanager · RESOLVED', '12:38 UTC']],
  ];
  return [0, 1, 2].map(step => `<section class="slide revision-alert" id="alerte">
    <p class="kicker">Supervision et validation · S5 · Test staging</p><h2>De l'erreur à la notification</h2>
    <div class="alert-reading" data-focus>${phrases[step].map(phrase => `<p>${phrase}</p>`).join('')}</div>
    <div class="alert-phase"><h3>${step === 0 ? 'Déclenchement' : 'Fin de l’alerte'}</h3><ol>${steps[step === 0 ? 0 : 1].map(([label, time]) => `<li><b>${label}</b><span>${time}</span></li>`).join('')}</ol></div>
    <div class="alert-evidence">${step === 0 ? proof('v3-prom-firing-rule.jpg', 'Règle staging ZawedniHighErrorRate active dans Prometheus', 'Détection Prometheus · heure UTC') : ''}${proof('v3-gmail-rows.jpg', 'Notifications staging FIRING et RESOLVED réellement reçues', 'Notifications Alertmanager · Gmail, heure locale UTC+1')}</div>
    <p class="alert-source">Staging · test du 07/10 · heures conservées des preuves originales</p>
  </section>`);
}
