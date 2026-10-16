// Reduced motion: system preference, or key M (kept for this browser).
const KEY = 'zs3d-motion';
const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
export const motion = { reduced: read() ? read() === 'reduced' : matchMedia('(prefers-reduced-motion: reduce)').matches };
export function toggleMotion() {
  motion.reduced = !motion.reduced;
  try { localStorage.setItem(KEY, motion.reduced ? 'reduced' : 'full'); } catch { /* private window */ }
}
