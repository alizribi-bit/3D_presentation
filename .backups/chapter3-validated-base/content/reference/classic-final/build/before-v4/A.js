{
// ── batch A: context slides are pure HTML builds; only the DevSecOps loop is drawn here.
Deck.slide('devsecops', {
  steps: 2,
  setup(el) {
    const g = el.querySelector('.art'), Y = 600, W = 230;
    const names = ['Coder', 'Construire', 'Tester', 'Livrer', 'Déployer', 'Superviser'];
    names.forEach((t, i) => {
      const x = 150 + i * 278;
      svg('rect', { x, y: Y - 40, width: W, height: 80, rx: 40, fill: '#ffffff', stroke: C.line, 'stroke-width': 3 }, g);
      svg('text', { x: x + W / 2, y: Y + 10, text: t, fill: C.ink, 'font-size': 28, 'font-weight': 600, 'text-anchor': 'middle' }, g);
      if (i < 5) svg('path', { d: `M${x + W + 8},${Y} h30 m-10,-9 l10,9 l-10,9`, stroke: C.mutedL, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      const b = svg('g', { 'data-step': 2, 'data-anim': 'pop', 'data-delay': .5 + (5 - i) * .1 }, g);
      svg('circle', { cx: x + W - 10, cy: Y - 40, r: 24, fill: C.green }, b);
      svg('path', { d: shield(x + W - 10, Y - 40, .8), fill: 'none', stroke: '#ffffff', 'stroke-width': 2.5 }, b);
    });
    svg('path', { d: `M1655,${Y + 140} V${Y + 190} H265 V${Y + 140} m-9,12 l9,-12 l9,12`, stroke: C.line, 'stroke-width': 3, fill: 'none', 'stroke-linejoin': 'round' }, g);
    svg('text', { x: 960, y: Y + 232, text: 'la boucle recommence', fill: C.mutedL, 'font-size': 24, 'text-anchor': 'middle' }, g);
    el._late = svg('g', {}, g);
    svg('circle', { cx: 1700, cy: 430, r: 40, fill: C.mutedL }, el._late);
    svg('path', { d: shield(1700, 430, 1.4), fill: 'none', stroke: '#ffffff', 'stroke-width': 3 }, el._late);
    svg('text', { x: 1635, y: 420, text: 'DevOps : la sécurité arrive à la fin', fill: C.ink, 'font-size': 28, 'font-weight': 600, 'text-anchor': 'end' }, el._late);
    svg('text', { x: 1635, y: 458, text: 'après la livraison : corriger coûte cher', fill: C.mutedL, 'font-size': 28, 'text-anchor': 'end' }, el._late);
    svg('text', { x: 150, y: 440, text: 'Dans ZAWEDNI : une vérification à chaque étape, à chaque changement', fill: C.green, 'font-size': 30, 'font-weight': 600, 'data-step': 2, 'data-anim': 'rise', 'data-delay': .9 }, g);
    // what ZAWEDNI checks at each step (step 2)
    [['secrets, code'], ['bibliothèques'], ['tests'], ['scan de l\'image'], ['GitOps, secrets', 'chiffrés'], ['métriques, journaux,', 'alertes']].forEach((ls, i) => {
      const t = svg('text', { x: 150 + i * 278 + W / 2, y: Y + 82, fill: C.green, 'font-size': 22, 'font-weight': 500, 'text-anchor': 'middle', 'data-step': 2, 'data-anim': 'fade', 'data-delay': 1 + i * .08 }, g);
      ls.forEach((l, k) => svg('tspan', { x: 150 + i * 278 + W / 2, dy: k ? 26 : 0, text: l }, t));
    });
  },
  frame(el, st) {
    const out = st.p(2, 0, .8, ease.inOutCubic);
    el._late.style.opacity = st.p(1, 0, .5) * (1 - out);
    el._late.setAttribute('transform', `translate(${-300 * out},0)`);
  },
});
}
