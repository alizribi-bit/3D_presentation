import { PROTOTYPE } from './mode.js';
// Keyboard (and presentation clicker) only. Wheel, scroll and touch moves do nothing.
// The same map serves both windows: in the presenter window the commands are sent to the jury window.
export const NAV = {
  ArrowRight: 'next', ' ': 'next', PageDown: 'next',
  ArrowLeft: 'prev', PageUp: 'prev',
  Home: 'home', End: 'end',
  ...(PROTOTYPE ? {1:'scene:A',2:'scene:B',3:'scene:C',4:'scene:D'} : {0:'home',1:'scene:1',2:'scene:2',3:'scene:3',4:'scene:4',5:'scene:5'}),
};
export const LOCAL = { f: 'fullscreen', F: 'fullscreen', l: 'quality', L: 'quality', m: 'motion', M: 'motion', n: 'notes', N: 'notes' };

export function bindKeys(handler) {
  let playerPointerFocus = false;
  addEventListener('keydown', e => {
    if (e.key === 'Tab') playerPointerFocus = false;
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target instanceof HTMLElement && e.target.closest('video,button,input,select,textarea') && !playerPointerFocus) return;
    const cmd = NAV[e.key] || LOCAL[e.key];
    if (!cmd) return;
    e.preventDefault();
    if (playerPointerFocus && document.activeElement instanceof HTMLElement) document.activeElement.blur();
    handler(cmd);
  });
  for (const ev of ['wheel', 'touchmove']) addEventListener(ev, e => e.preventDefault(), { passive: false });
  // a mouse click never keeps the focus anywhere: the keys keep working
  addEventListener('mousedown', e => { if (e.target instanceof HTMLElement && e.target.closest('#film')) { playerPointerFocus = true; return; } playerPointerFocus = false; e.preventDefault(); window.focus(); });
}
