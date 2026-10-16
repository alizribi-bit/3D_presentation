import { AnimationGroup } from './animation-group.ts';

const styleKeys = ['opacity', 'fill', 'stroke', 'strokeWidth'] as const;
type StyleValues = Record<typeof styleKeys[number], string>;
interface SvgPose { tag: string; styles: StyleValues; geometry: Record<string, string>; dash: string; transform: string; }
export interface SvgSnapshot { nodes: SvgPose[]; artTransform: string; padding: number; }
export const svgMotion = Object.freeze({ duration: 1000, layoutDuration: 450, easing: 'ease-in-out' });
const attributeKeys: Record<string, readonly string[]> = {
  line: ['x1', 'x2', 'y1', 'y2'], circle: ['cx', 'cy', 'r'], g: ['transform'],
};
export function parseTranslation(value: string): [number, number] | null {
  const m = /^translate\(\s*([-+\d.e]+)(?:[ ,]+([-+\d.e]+))?\s*\)$/i.exec(value);
  if (!m) return null;
  const result: [number, number] = [Number(m[1]), Number(m[2] || 0)];
  return result.every(Number.isFinite) ? result : null;
}
export function matrixValues(value: string): number[] {
  const m = /^matrix\(([^)]+)\)$/.exec(value);
  const numbers = m?.[1]?.split(',').map(Number);
  return numbers?.length === 6 && numbers.every(Number.isFinite) ? numbers : [1, 0, 0, 1, 0, 0];
}
/** Preserve both segments of the accepted M…H…V route, including reverse travel.
 * A keyframe at the bend prevents the marker from cutting diagonally across the corner. */
export function routeOffsets(from: number, to: number, corner: number): number[] {
  const bend = (corner - from) / (to - from);
  return bend > 0 && bend < 1 ? [0, bend, 1] : [0, 1];
}
export function captureSvgFrame(root: ParentNode): SvgSnapshot {
  return {
    nodes: [...root.querySelectorAll<SVGElement>('svg *')].map(node => {
      const style = getComputedStyle(node);
      return { tag: node.localName, styles: Object.fromEntries(styleKeys.map(k => [k, style[k]])) as StyleValues,
        geometry: Object.fromEntries((attributeKeys[node.localName] || []).map(k => [k, node.getAttribute(k) || ''])),
        dash: style.strokeDasharray, transform: style.transform };
    }),
    artTransform: root.querySelector('.art') ? getComputedStyle(root.querySelector('.art')!).transform : 'none',
    padding: root.querySelector('.slide') ? parseFloat(getComputedStyle(root.querySelector('.slide')!).paddingTop) : 0,
  };
}

/** Native SVG stroke/transform tweens keep running between world frames. The line,
 * badge and marker share one duration/easing. Geometry attributes are never rewritten:
 * even reverse/rapid input restores the original exported DOM when effects finish. */
export class SvgSlideMotion {
  private readonly animations = new AnimationGroup();
  private generation = 0;
  constructor(private readonly status: (running: boolean) => void) {}
  // Freeze one coherent rendered pose while styles are read for an interrupted cue.
  freeze(): void { this.animations.pause(); }
  stop(): void { this.generation++; this.animations.stop(); this.status(false); }

  play(before: SvgSnapshot, root: ParentNode): void {
    this.stop(); const generation = this.generation;
    const active: Animation[] = [];
    const animate = (node: Element, frames: Keyframe[], duration: number = svgMotion.duration) => {
      const animation = node.animate(frames, { duration, easing: svgMotion.easing });
      active.push(animation); this.animations.add(animation);
    };
    const nodes = [...root.querySelectorAll<SVGElement>('svg *')];
    // Read all resting styles before starting effects; avoid interleaving style reads/writes.
    const resting = nodes.map(node => {
      const style = getComputedStyle(node);
      return { styles: Object.fromEntries(styleKeys.map(k => [k, style[k]])) as StyleValues,
        transform: style.transform, dash: style.strokeDasharray };
    });
    const routeIndex = nodes.findIndex(node => node.localName === 'path' && node.getAttribute('pathLength') === '1');
    const route = routeIndex >= 0 ? nodes[routeIndex] as SVGPathElement : null;
    const routeStart = parseFloat(before.nodes[routeIndex]?.dash || '0'), routeEnd = parseFloat(resting[routeIndex]?.dash || '0');
    for (const [i, node] of nodes.entries()) {
      const old = before.nodes[i], target = resting[i]; if (!old || !target || old.tag !== node.localName) continue;
      const from: Keyframe = {}, to: Keyframe = {};
      for (const key of styleKeys) if (target.styles[key] !== old.styles[key]) { from[key] = old.styles[key]; to[key] = target.styles[key]; }
      if (Object.keys(to).length) animate(node, [from, to]);
      if (node === route && routeStart !== routeEnd) animate(node, [{ strokeDasharray: old.dash }, { strokeDasharray: target.dash }]);
      if (node.localName === 'line' && old.geometry['x2']) {
        const x1 = Number(node.getAttribute('x1')), x2 = Number(node.getAttribute('x2'));
        const matrix = matrixValues(old.transform), visibleEnd = matrix[0]! * Number(old.geometry['x2']) + matrix[4]!;
        if (x2 !== x1 && visibleEnd !== x2) {
          const scale = (visibleEnd - x1) / (x2 - x1);
          // Matching transform functions interpolate even from zero length; a singular
          // scale-zero matrix would otherwise make the browser switch discretely.
          animate(node, [{ transform: `translate(${x1}px,0px) scaleX(${scale}) translate(${-x1}px,0px)` },
            { transform: `translate(${x1}px,0px) scaleX(1) translate(${-x1}px,0px)` }]);
        }
      }
      if (node.localName === 'g' && parseTranslation(node.getAttribute('transform') || '') && old.transform !== target.transform)
        animate(node, [{ transform: old.transform }, { transform: target.transform }]);
      if (node.localName === 'circle' && old.geometry['cx']) {
        const cx = Number(node.getAttribute('cx')), cy = Number(node.getAttribute('cy'));
        const matrix = matrixValues(old.transform), x = Number(old.geometry['cx']) + matrix[4]!, y = Number(old.geometry['cy']) + matrix[5]!;
        if (route && routeStart !== routeEnd && ['30', '14'].includes(node.getAttribute('r') || '')) {
          const length = route.getTotalLength();
          const d = /^M([\d.]+),([\d.]+)\s+H([\d.]+)\s+V([\d.]+)$/.exec(route.getAttribute('d') || '');
          const corner = d ? Math.abs(Number(d[3]) - Number(d[1])) / length : -1;
          animate(node, routeOffsets(routeStart, routeEnd, corner).map(offset => {
            const point = route.getPointAtLength((routeStart + (routeEnd - routeStart) * offset) * length);
            return { offset, transform: `translate(${point.x - cx}px, ${point.y - cy}px)` };
          }));
        } else if (x !== cx || y !== cy) animate(node, [{ transform: `translate(${x - cx}px, ${y - cy}px)` }, { transform: 'none' }]);
        // The corrected Log4j dot is hidden at rest; show it only during the delivery.
        if (node.getAttribute('r') === '15' && target.styles.opacity === '0' && old.styles.opacity === '0' && x !== cx)
          animate(node, [{ opacity: 0, offset: 0 }, { opacity: 1, offset: .08 }, { opacity: 1, offset: .9 }, { opacity: 0, offset: 1 }]);
      }
    }
    const art = root.querySelector('.art');
    if (art) {
      const target = getComputedStyle(art).transform;
      if (target !== before.artTransform) animate(art, [{ transform: before.artTransform }, { transform: target }], svgMotion.layoutDuration);
    }
    const slide = root.querySelector('.slide');
    if (slide) {
      const delta = before.padding - parseFloat(getComputedStyle(slide).paddingTop);
      if (delta) for (const heading of slide.querySelectorAll(':scope > .kick, :scope > h1, :scope > h2'))
        animate(heading, [{ translate: `0 ${delta}px` }, { translate: '0 0' }], svgMotion.layoutDuration);
    }
    this.status(active.length > 0);
    void Promise.allSettled(active.map(animation => animation.finished)).then(() => {
      if (generation === this.generation) this.status(false);
    });
  }
}
