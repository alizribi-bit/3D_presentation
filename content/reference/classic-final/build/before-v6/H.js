{
  // Cover: on entry only the Bismillah, large and centred. The click moves it to the top while the
  // cover builds itself from data-delay (logos → mention → title → author → jury), about 3 s, no timers.
  Deck.slide('couverture', {
    setup(el) { el._b = el.querySelector('.bw'); },
    frame(el, st) {
      const p = st.p(1, 0, .9, ease.inOutCubic);
      el._b.style.transform = `translateY(${lerp(442, 0, p)}px) scale(${lerp(1.55, 1, p)})`;
    },
  });
  // Sommaire: the title waits in the middle, then rises to its place as the six parts arrive.
  Deck.slide('sommaire', {
    setup(el) { el._h = el.querySelector('h2'); },
    frame(el, st) {
      const p = st.p(1, 0, .7, ease.inOutCubic);
      el._h.style.transform = `translateY(${lerp(330, 0, p)}px) scale(${lerp(1.35, 1, p)})`;
    },
  });
  // Chapter openers: the outline bar slides from the previous chapter to this one.
  for (const k of [2, 3, 4, 5, 6]) Deck.slide('ch' + k, {
    active: 1.4,
    setup(el) {
      const li = [...el.querySelectorAll('.toc li')];
      el._y = li.map(l => [l.offsetTop, l.offsetHeight]);
      el._bar = el.querySelector('.toc .bar');
    },
    frame(el, st) {
      const from = el._y[Math.max(0, k - 2)], to = el._y[k - 1], p = st.p(0, .45, .8, ease.inOutCubic);
      el._bar.style.top = lerp(from[0], to[0], p) + 'px';
      el._bar.style.height = lerp(from[1], to[1], p) + 'px';
    },
  });
}
