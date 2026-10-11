// Two quality levels with the same look: 'normal' and a lighter one for a weak defense laptop (key L).
const KEY = 'zs3d-quality';
const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
export const quality = { level: new URLSearchParams(location.search).get('q') || read() || 'normal' };

export function applyQuality(renderer, sun) {
  const light = quality.level === 'light';
  renderer.setPixelRatio(light ? 1 : Math.min(window.devicePixelRatio, 2));
  const size = light ? 2048 : 4096;
  if (sun.shadow.mapSize.x !== size) { sun.shadow.mapSize.set(size, size); sun.shadow.map?.dispose(); sun.shadow.map = null; }
}
export function toggleQuality() {
  quality.level = quality.level === 'light' ? 'normal' : 'light';
  try { localStorage.setItem(KEY, quality.level); } catch { /* private window */ }
}
