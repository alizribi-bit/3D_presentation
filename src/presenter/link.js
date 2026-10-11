// The two windows talk over one BroadcastChannel (same origin). The jury window is the only authority:
// the presenter window sends commands and shows whatever state the jury window announces.
export const CHANNEL = 'zawedni-story-3d';
export function link(onMessage) {
  const ch = new BroadcastChannel(CHANNEL);
  ch.onmessage = e => onMessage(e.data);
  return { send: m => ch.postMessage(m), close: () => ch.close() };
}
