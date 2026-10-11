# Session handoff — 2026-10-11

## Current status

The four-scene prototype has been extended into the full presentation: all 41 accepted
source sequences, 106 explicit states, 105 next presses, six chapter locations and complete
synchronized presenter notes. The 65 source clicks count internal reveals; sequence entries
account for the rest. The original 11-state prototype remains accessible with `?prototype`.

Ali authorizes all ordinary project work without repeated confirmation (AGENTS.md).
Project `.codex/config.toml` sets `approval_policy = "never"` and workspace-write access to
this project. The global Codex configuration marks this project trusted; its previous version
is backed up at `/home/ali/.codex/config.toml.before-story-3d-20261011`.
Start the next session in `/home/ali/Desktop/zawedni-story-3d` to load project settings.
Active/managed session policies can override these settings; do not bypass them.

## Implemented

- Exact speech imported from the accepted script; 106 canonical local DOM/SVG evidence
  frames and 29 original assets, including the corrected 90-second film.
- Typed domain, navigation validation, cached continuous guide routes and delivery logic.
- Detailed workshop with real interface screenshots; 3D architecture; delivery parcel and
  gates that block a failed version; monitoring room with real screenshots and alert route;
  belvedere and native video player; final overview.
- Full chapter shortcuts 1–6, Home/End, reduced motion and quality toggle, synchronized notes,
  late-presenter recovery, prototype compatibility and accessible presenter map entries.
- Fixed native-player focus stealing clicker keys, audio continuing after leaving the film,
  late-playback races, conclusion contrast and overlapping 3D architecture labels.
- Last small changes: presenter shortcut help now says 1–6; new regression assertion for it;
  removed unused architecture-node bookkeeping. Production build was regenerated afterward.

The accepted source in `/home/ali/Desktop/zawedni-video-pfe` is read-only. Source fingerprints,
film and archive checks passed. Runtime assets are self-contained in this project.

## Verified results and exact stopping point

- 10/10 unit tests passed, including source coverage, unsafe navigation, route sampling,
  blocked/resumed delivery, automatic and manual late video playback.
- Strict TypeScript check passed for new TypeScript modules. Legacy JavaScript is not covered
  by `checkJs`; do not claim the entire old codebase was converted to strict TypeScript.
- Content/source checks passed: 41 sequences, 106 frames, 106 speech states, 29 unchanged assets.
- Production build and shell syntax checks passed. `npm audit`: zero reported vulnerabilities.
- Latest completed full browser run: **34/34 passed**; all 106 states traversed forward/back,
  canonical evidence matched, 16 representative images matched after forward/back/reload,
  real walking/interruption and native video checks passed, no external/missing requests or
  JavaScript errors. Presenter worst observed synchronization was 13 ms, late opening 214 ms.
  Report: `review/full/verify/report.json` (ignored QA output).
- That completed run preceded the last presenter-help correction. The suite now has **35**
  checks. Rerun it against the latest build before declaring final validation complete.
- `npm run verify:prototype` was still running when Ali requested this handoff. Its first 17
  checks passed; final image comparisons and overall result were not yet collected. Rerun
  if that background session cannot be recovered. Do not claim a completed 21/21 result.
- `scripts/measure-full.mjs` is ready but has **not been run**. No full-version FPS results yet.
- Connected screens were detected: HDMI 1366×768 and laptop 1920×1080. The new full version
  has not yet been relaunched and checked physically on both screens. Old prototype launcher
  results belong only to `HANDOFF-PROTOTYPE.md`.

Ali requested a session switch at this point. Do not rebuild the whole project from scratch.

## Resume here

1. Read `AGENTS.md`, this handoff, `README.md`, `PLAN-41.md` and
   `specs/002-full-presentation/`. Load relevant skills before further coding.
2. Confirm the local build server at `http://127.0.0.1:4317`; it currently serves `dist/`.
   If absent: `python3 -m http.server 4317 --bind 127.0.0.1 --directory dist`.
3. Run `npm test`, `npm run typecheck`, `npm run check`, `npm run build`, then
   `npm run verify` and `npm run verify:prototype`. Run GPU-heavy browser suites sequentially.
4. Run `node scripts/measure-full.mjs` without other QA browsers competing for the GPU.
   It measures six chapter arrivals at normal/light quality and writes
   `review/full/performance.json`. Report actual numbers and headless limitations.
5. Relaunch `./present.sh` and review projector/notes placement, real sound, readability and
   clicker behavior. Complete a timed spoken rehearsal (reference approximately 20 minutes
   including the film) and a manual disconnected-network check. Do not shorten accepted speech.
6. Update results here, finish the remaining task boxes and make a selective local checkpoint.

## Files and review artifacts

`src/story/itinerary.ts` owns source-to-state mapping; `src/story/delivery.ts` owns delivery
positions; `src/characters/path.ts` owns cached route samples; `src/nav/director.js` owns state
transitions; `src/world/story.ts` owns story props; `src/story/evidence.ts` renders local
canonical frames; `src/media/` owns the native player and playback lifecycle.

Review gallery: `review/full/index.html`; contact sheet: `review/full/contact-sheet.png`;
41 sequence-end screenshots: `review/full/states/`; browser captures: `review/full/verify/`.
The existing prototype recording and its assets remain available. No new full-run recording yet.

## Git state and preservation

Prototype checkpoint: `9729dbb` (`chore: checkpoint completed four-scene presentation prototype`).
The full extension, config, new tests and this handoff are currently **uncommitted** on disk.
Do not discard them. There are unrelated pre-existing Spec Kit changes in
`.specify/scripts/bash/`, extension/workflow metadata and `.claude/skills/speckit-git-*`.
Preserve those; do not stage the entire directory blindly. The old prototype handoff is saved
as `HANDOFF-PROTOTYPE.md` for historical verification and license details.
