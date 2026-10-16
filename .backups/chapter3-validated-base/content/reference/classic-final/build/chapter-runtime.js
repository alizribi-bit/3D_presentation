// @ts-check
// Cover and outline motion retained; chapter positions follow the revised TOC.
{
  Deck.slide('couverture', {
    setup(el) { el._b = el.querySelector('.bw'); },
    frame(el, st) { const p=st.p(1,0,.9,ease.inOutCubic); el._b.style.transform=`translateY(${lerp(442,0,p)}px) scale(${lerp(1.55,1,p)})`; }
  });
  Deck.slide('sommaire', {
    setup(el) { el._h=el.querySelector('h2'); },
    frame(el,st) { const p=st.p(1,0,.7,ease.inOutCubic);el._h.style.transform=`translateY(${lerp(330,0,p)}px) scale(${lerp(1.35,1,p)})`; }
  });
  ['ch1','ch3','ch4','ch5','ch6'].forEach((id,rank)=>Deck.slide(id, {
    active:1.4,
    setup(el) { el._y=[...el.querySelectorAll('.toc li')].map(li=>[li.offsetTop,li.offsetHeight]);el._bar=el.querySelector('.toc .bar'); },
    frame(el,st) { const from=el._y[Math.max(0,rank-1)],to=el._y[rank],p=st.p(0,.45,.8,ease.inOutCubic);el._bar.style.top=lerp(from[0],to[0],p)+'px';el._bar.style.height=lerp(from[1],to[1],p)+'px'; }
  }));
}
