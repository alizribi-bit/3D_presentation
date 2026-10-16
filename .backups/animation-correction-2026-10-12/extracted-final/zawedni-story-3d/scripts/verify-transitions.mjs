// Compatibility entry: current staging checks live in one behavioral verifier.
import { register } from 'tsx/esm/api';
register();
await import('./verify-animation-correction.mjs');
