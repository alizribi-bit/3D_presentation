import type { Object3D } from 'three';

// Scene objects and positional anchors have different lifecycles and types.
export const sceneProps = new Map<string, Object3D>();
