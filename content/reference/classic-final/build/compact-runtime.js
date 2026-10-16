// @ts-check
/** Preserve the original build hooks. Only merge redundant states and shorten
 * entrance delays. The same mapping drives markup and generated SVG frames.
 * Identity mappings pass the original state through (including video playback).
 * There are no frozen slides and no runtime modification.
 */
{
  /** @type {Record<string, {map:number[],preserve?:boolean}>} */
  const configs = COMPACT_CONFIG;
  const register = Deck.slide;
  /** Keep future steps future (e.g. the last traceability pill's dim state).
   * @param {number[]} mapping @param {number} step */
  const mapped = (mapping, step) => mapping[step] ?? Math.max(...mapping) + step - mapping.length + 1;
  /** @param {HTMLElement} element @param {number[]} mapping */
  function compact(element, mapping) {
    if (configs[element.id]?.preserve) return; // Keep all original timing, especially Perspectives.
    for (const node of element.querySelectorAll('[data-step],[data-out],[data-dim],[data-anim],[data-delay],[data-stagger]')) {
      if (node.closest('aside')) continue;
      for (const attr of ['data-step','data-out','data-dim']) if (node.hasAttribute(attr)) {
        node.setAttribute(attr,String(mapped(mapping,Number(node.getAttribute(attr)))));
      }
      // Retain order, easing and motion grammar; remove long waits and stagger.
      if (node.hasAttribute('data-delay')) node.setAttribute('data-delay',String(Math.min(1.2,Number(node.getAttribute('data-delay'))*.7)));
      if (node.hasAttribute('data-stagger')) node.setAttribute('data-stagger',String(Math.min(.1,Number(node.getAttribute('data-stagger')))));
      if (node.hasAttribute('data-dur')) node.setAttribute('data-dur',String(Math.min(1.6,Number(node.getAttribute('data-dur')))));
    }
  }
  Deck.slide = (id, spec) => {
    const config = configs[id];
    if (!config) return Deck; // No setup of removed slides or absent SVG nodes.
    const identity = config.map.every((step,index)=>step===index);
    const next = {...spec,steps:Math.max(...config.map),
      setup(el, api) { spec.setup?.(el,api); compact(el,config.map); },
      frame(el, st) {
        if (!spec.frame) return;
        if (identity) {spec.frame(el,st);return;}
        // Do not spread st: reading its T getter would create ambient redraws.
        const translated={step:st.step,last:st.last,t:st.t,rest:st.rest,
          p:(n,delay,dur,curve)=>st.p(mapped(config.map,n),delay,dur,curve),
          at:n=>st.at(mapped(config.map,n)),since:n=>st.since(mapped(config.map,n)),
          life:(...args)=>st.life(...args),
        };
        Object.defineProperty(translated,'T',{get:()=>st.T});
        spec.frame(el,translated);
      }
    };
    return register.call(Deck,id,next);
  };
  for (const id of Object.keys(configs)) Deck.slide(id,{});
}
