{
  // Cover: the commit waits at the start of a faint track (it travels the whole chain on the last slide).
  Deck.slide('couverture', {
    ambient: 24,
    setup(el) {
      const a = el.querySelector('.art');
      el._t = svg('path', { d: 'M150,1000 H1240', fill: 'none', stroke: 'rgba(232,243,236,.22)', 'stroke-width': 3, 'stroke-dasharray': '8 10' }, a);
      el._h = svg('circle', { cx: 150, cy: 1000, r: 22, fill: '#5be38f', 'fill-opacity': .18 }, a);
      el._d = svg('circle', { cx: 150, cy: 1000, r: 10, fill: '#5be38f', stroke: '#eafff1', 'stroke-width': 3 }, a);
    },
    frame(el, st) {
      const on = st.p(0, 1.2, .6, ease.outCubic);
      el._t.style.opacity = on; el._d.style.opacity = el._h.style.opacity = on;
      el._h.setAttribute('r', 22 + 8 * st.life(1.8, 1));
    },
  });
  // Chapter openers: the outline bar slides from the previous chapter to this one.
  for (const k of [1, 2, 3, 4, 5, 6]) Deck.slide('ch' + k, {
    active: 1.4,
    setup(el) {
      const li = [...el.querySelectorAll('.toc li')];
      el._y = li.map(l => [l.offsetTop, l.offsetHeight]);
      el._bar = el.querySelector('.toc .bar');
    },
    frame(el, st) {
      const from = el._y[Math.max(0, k - 2)], to = el._y[k - 1], p = k === 1 ? 1 : st.p(0, .45, .8, ease.inOutCubic);
      el._bar.style.top = lerp(from[0], to[0], p) + 'px';
      el._bar.style.height = lerp(from[1], to[1], p) + 'px';
    },
  });
}
