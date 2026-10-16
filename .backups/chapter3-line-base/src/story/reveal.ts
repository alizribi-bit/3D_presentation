/** Compare resting DOM snapshots before replacement. SVG groups, text, proof images and
 * declarative builds share one reveal rule; unchanged ancestors stay visible. No bitmap
 * conversion or whole-board animation is needed for progressive diagrams. */
function hiddenInSnapshot(node: Element, boundary: ParentNode): boolean {
  for (let current: Element | null = node; current && current !== boundary; current = current.parentElement) {
    const style = (current as HTMLElement | SVGElement).style;
    if (current.hasAttribute('hidden') || current.classList.contains('off') ||
      style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0' ||
      current.getAttribute('opacity') === '0') return true;
  }
  return false;
}
export function localReveals(previous: ParentNode, next: ParentNode): Element[] {
  const before = [...previous.querySelectorAll('*')];
  const after = [...next.querySelectorAll('*')];
  const identified = new Map(before.filter(node => node.id).map(node => [node.id, node]));
  const fresh = new Set<Element>();
  for (const [index, node] of after.entries()) {
    const old = node.id ? identified.get(node.id) : before[index];
    if (!old || old.tagName !== node.tagName || hiddenInSnapshot(node, next)) continue;
    const revealed = hiddenInSnapshot(old, previous);
    const changedImage = node.tagName === 'IMG' && old.getAttribute('src') !== node.getAttribute('src');
    if (revealed || changedImage) fresh.add(node);
  }
  return [...fresh].filter(node => {
    for (let parent = node.parentElement; parent; parent = parent.parentElement) if (fresh.has(parent)) return false;
    return true;
  });
}
