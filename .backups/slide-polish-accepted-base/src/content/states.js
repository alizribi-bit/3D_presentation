// One authoritative itinerary is shared by jury and presenter in this edition.
import { FULL_STATES, CHAPTERS } from '../story/itinerary.ts';
export const STATES = FULL_STATES;
export const SCENES = CHAPTERS;
export const indexOf = id => STATES.findIndex(s => s.id === id);
