export type Navigation = { kind: 'index'; index: number } | { kind: 'action'; action: 'next' | 'prev' | 'fullscreen' | 'quality' | 'motion' | 'notes' };
export function parseCommand(value: unknown, count: number, chapters: Readonly<Record<string, number>>): Navigation | null {
  if (typeof value !== 'string') return null;
  if (['next', 'prev', 'fullscreen', 'quality', 'motion', 'notes'].includes(value)) return { kind: 'action', action: value as Extract<Navigation, { kind: 'action' }>['action'] };
  if (value === 'home') return { kind: 'index', index: 0 };
  if (value === 'end') return { kind: 'index', index: count - 1 };
  const chapter = /^scene:([0-6A-D])$/.exec(value);
  const raw = /^go:(\d+)$/.exec(value);
  const index = chapter ? chapters[chapter[1]!] : raw ? Number(raw[1]) : undefined;
  return index !== undefined && Number.isSafeInteger(index) && index >= 0 && index < count ? { kind: 'index', index } : null;
}
export function isMessage(value: unknown): value is { t: 'hello' } | { t: 'cmd'; cmd: string } | { t: 'state'; id: string; i: number; total: number } {
  if (typeof value !== 'object' || value === null) return false;
  const m = value as Record<string, unknown>;
  return m['t'] === 'hello' || (m['t'] === 'cmd' && typeof m['cmd'] === 'string') ||
    (m['t'] === 'state' && typeof m['id'] === 'string' && Number.isSafeInteger(m['i']) && Number.isSafeInteger(m['total']));
}
