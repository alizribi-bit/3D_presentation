type FilmState = { step: 0 | 1 } | null;
/** Auto-start belongs to the forward reveal, never to a return, reload or presenter synchronization. */
export function shouldAutoplayFilm(previous: FilmState, current: FilmState, forward: boolean): boolean {
  return forward && previous?.step === 0 && current?.step === 1;
}
