// One shared source of state for the jury and presenter. Prototype remains available for comparison.
import { FULL_STATES, CHAPTERS } from '../story/itinerary.ts';
import { STATES as PROTOTYPE_STATES, SCENES as PROTOTYPE_SCENES } from './prototype-states.js';
import { PROTOTYPE } from '../nav/mode.js';
export const STATES = PROTOTYPE ? PROTOTYPE_STATES : FULL_STATES;
export const SCENES = PROTOTYPE ? PROTOTYPE_SCENES : CHAPTERS;
const legacy = { A0: 'couverture-0', A1: 'couverture-1', A2: 'sommaire-1', B1: 'probleme-1', B2: 'reponse-1', C1: 'modele-2', C2: 'reponse-1', C3: 'ch3-0', D1: 'devsecops-0', D2: 'devsecops-1', D3: 'retour-1' };
export const indexOf = id => STATES.findIndex(s => s.id === (PROTOTYPE ? id : legacy[id] || id));
