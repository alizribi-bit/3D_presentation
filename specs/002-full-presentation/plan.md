# Implementation plan

Reuse the working Three.js renderer and character rig. Isolate source import, typed state model,
route interpolation, world storytelling, evidence panels and video lifecycle in separate modules.
Generate canonical DOM evidence from the immutable deck rest-frame API, without shipping its
runtime scripts or navigation. Panels remain vector/text/image DOM, not screenshots of slides.
Use shadow DOM to isolate the accepted evidence styles from world labels. Source frames are
build inputs; no source-project runtime dependency. Notes derive from the exact [clic]/[lire] script.
The camera and 3D props remain pure functions of state/progress. Cache route lengths at transition
creation, reuse geometries, bake static scenery; keep only animated props out of the bake.

Constitution I–VI retained. VII review gate satisfied by Ali's 2026-10-11 authorization.
Validation: source checks, state/speech completeness, route/command/video unit tests, strict typing,
build, all-state browser traversal, reload/back determinism, dual-window sync, video and offline tests.
