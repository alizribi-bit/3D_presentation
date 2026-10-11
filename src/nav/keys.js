// Keyboard (and presentation clicker) only. Wheel, scroll and touch moves do nothing.
// The same map serves both windows: in the presenter window the commands are sent to the jury window.
export const NAV = {
  ArrowRight: 'next', ' ': 'next', PageDown: 'next',
  ArrowLeft: 'prev', PageUp: 'prev',
  Home: 'home', 1: 'scene:A', 2: 'scene:B', 3: 'scene:C', 4: 'scene:D',
};
export const LOCAL = { f: 'fullscreen', F: 'fullscreen', l: 'quality', L: 'quality', m: 'motion', M: 'motion', n: 'notes', N: 'notes' };

export function bindKeys(handler) {
  addEventListener('keydown', e => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    const cmd = NAV[e.key] || LOCAL[e.key];
    if (!cmd) return;
    e.preventDefault();
    handler(cmd);
  });
  for (const ev of ['wheel', 'touchmove']) addEventListener(ev, e => e.preventDefault(), { passive: false });
  // a mouse click never keeps the focus anywhere: the keys keep working
  addEventListener('mousedown', e => { e.preventDefault(); window.focus(); });
}
