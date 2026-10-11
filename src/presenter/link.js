import { isMessage } from '../nav/commands.ts';
import { PROTOTYPE } from '../nav/mode.js';
// The two windows talk over one BroadcastChannel (same origin). The jury window is the only authority:
// the presenter window sends commands and shows whatever state the jury window announces.
export const CHANNEL = `zawedni-story-3d${PROTOTYPE ? '-prototype' : ''}`;
export function link(onMessage) {
  const ch = new BroadcastChannel(CHANNEL);
  ch.onmessage = e => { if (isMessage(e.data)) onMessage(e.data); };
  return { send: m => ch.postMessage(m), close: () => ch.close() };
}
