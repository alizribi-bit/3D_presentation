{
// ── batch E: bilan, perspectives and conclusion are pure HTML/SVG builds.
// ── 40 · The film. Step 0: poster and play button; step 1 (the click): it plays with sound, in the audience window only.
//    Exception assumed to the deck-kit rules: a <video> keeps its own clock and cannot be a pure function of st.
//    frame() only starts or pauses it; leaving the slide (any navigation: keys, clicker, presenter, hash) stops and rewinds it.
Deck.slide('video', {
  steps: 1, ambient: 5,
  setup(el) {
    const q = new URLSearchParams(location.search);
    const live = el._live = !q.has('presenter') && !q.has('embed') && !q.has('render');   // presenter.sh adds ?pv=…: still live
    const v = el._v = el.querySelector('video'), box = el.querySelector('.vid');
    if (!live) { v.muted = true; v.removeAttribute('controls'); return; }   // presenter view, previews, exports: poster only, never play()
    const sync = () => box.classList.toggle('on', !v.paused && !v.ended);
    v.addEventListener('play', sync); v.addEventListener('pause', sync); v.addEventListener('ended', sync);
    // manual start: works at step 0 or 1, and whenever the browser refused the automatic start
    el.querySelector('.play').addEventListener('click', () => { v.muted = false; v.play().catch(() => {}); });
    // after a mouse click on the button or the player controls, give the focus back to the page: the clicker's → and Space
    // then reach the deck only (no native seek or play toggle on a focused <video> or <button>)
    box.addEventListener('pointerup', () => setTimeout(() => { const f = document.activeElement; if (f && box.contains(f)) f.blur(); }, 0));
    // pause() + load(): back to 0 and the poster shows again (if the file cannot load, the poster simply stays)
    el._reset = () => { if (!v.paused || v.currentTime > 0) { v.pause(); v.currentTime = 0; v.load(); } el._tried = false; sync(); };
    const me = el._index = [...document.querySelectorAll('section.slide')].indexOf(el);
    Deck.on(e => { if (e.i !== me) el._reset(); });
  },
  frame(el, st) {
    if (!el._live || st.rest || Deck.state.i !== el._index) return;      // st.rest: the overview draws every slide at its last step
    // Outgoing slides are drawn during the transition too. Do not restart the
    // film after the departure listener reset it on a fast next-slide press.
    void st.T;                             // reading the clock keeps frame() running (5 times a second) while the slide is on screen
    const v = el._v, s1 = st.at(1);
    if (el._s1 && !s1) { v.pause(); el._tried = false; }   // ← back to step 0: pause, keep the position
    el._s1 = s1;
    // one automatic start per arrival on step 1, right after the click; if refused, the play button stays
    if (s1 && !el._tried && st.t < 1.5) { el._tried = true; if (v.paused && !v.ended) v.play().catch(() => {}); }
  },
});
}
