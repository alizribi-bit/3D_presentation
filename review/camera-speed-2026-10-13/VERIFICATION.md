# Camera speed and chapter walking — 13 October 2026

Only two runtime source files changed: `src/nav/timeline.ts` and
`src/characters/arrival.ts`. Tests and timing documentation were updated alongside them.
The selective checkpoint is outside delivery in `.backups/camera-speed-2026-10-13`.

All normal camera movement budgets are divided by two. Approach/object: 0.325–0.50 s;
world return: 0.875 s; chapter travel: 2.25–2.60 s; previous/jump: 0.375 s.
Panel fades, content transitions, camera curves and interruption handling are unchanged.
Reduced and fast modes retain their previous timing overrides.

The chapter arrival walk still covers up to 2.6 metres. Its phase window grows from
38% to 76% (16%–92% of the flight), preserving its real duration and its speed limit
of 1.8 m/s. The guide fades out before relocation and walks at arrival before the
large panels return. Continuous walking over the entire distant world route is not
introduced. Previous/jump behavior remains a quick relocation.

Validation: 41 tests passed, including exact half-duration budgets, all 95 fixed
passages, walking throughout the expanded phase window and numerical gait speed.
Content/provenance checks, TypeScript, Vite build and `check-build.py` passed.
Build: ec8801b52385eb8a1e44cc6253514a648f6a4ff38150faa67b40da73c6fc7f00.

Live verification launched the actual `present.sh` server and used ArrowRight from
methodologie-1 to ch2-0 in the 1366×768 light mode. The observed command had 2.25 s of
camera motion, a 2.61 s total timeline, and arrived with stage and evidence visible.
The guide finished at the correct anchor; the notes followed ch2-0. SwiftShader
rendered its next frame after the whole transition (approximately 3.8 s after the
command), so no walking frame was observed. Mesa/OpenGL startup was also unavailable
in this environment. These attempts do not establish live walking visibility or
smoothness on Ali's GPU. The tests establish the intended gait and timing; actual
GPU observation remains necessary to assess the visual result.

225 of the previous 226 protected files remain byte-identical; the only authorized
change in that list is arrival.ts. Accepted content, speech, captures, models and the
classic presentation are unchanged. The previous October 12 ZIP and video remain
historical artifacts; this adjustment updates the working project and its build.
