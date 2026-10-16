# Handoff — Soutenance PFE ZAWEDNI (v2 : 36 slides + vidéo + 8 de réserve)

Last session: **2026-10-06** (v2, from `../INSTRUCTIONS_CLAUDE_PRESENTATION.md`).

**Status (v2):**
- `PLAN_PRESENTATION.md` = the plan: proofs, message per slide, CI triggers, coverage in PDF numbering, BF/BNF matrix, jury Q&A, postponed items. **Sections §1–§8 below describe v1 (48 slides, "je" rejected, no video) and are kept as history: where they disagree with this block or the plan, the v2 rules win.**
- 44 slides in `deck.html`: 36 for the talk (6 parts), 8 reserve slides (37–44). `check`: 107 rest frames, **0 errors**, 39 warnings (density on tables and reserve slides, contrast-unknown on night slides).
- Duration: the animatic gives ≈ **16:05** of pure speech up to the reserve (115 words/min). With the pauses on captures and clicks ≈ 17:00, plus the video 1:30 and ≈0:15 of handling, the plan counts ≈ **18:45** (estimate, not measured: time a rehearsal).
- Exports done: `deck.offline.html` (18 images inlined), `deck.pdf` (44 pages).

**Retouches from `../DERNIERES_RETOUCHES_PRESENTATION.md` (applied 2026-10-06):** slide 7 = two choices (GitHub Actions, AKS) instead of the 4-approach matrix; 33 = three priorities (3 clicks, 64 main clicks in total); wording on 14, 15, 17, 32, 34; alternatives on reserve 40; jury answers 24–26 in the plan. Backups: `build/before-retouches/`. **Next step for the user: a timed rehearsal with the real video (aim ≤ 19:00), not another redesign.**

**v2 workflow (single source):**
1. Speech and slide table: edit `build/script_rows.py` → `python3 build/script_rows.py` (writes SCRIPT.md, asserts `[clic]` count = steps) → `node discours.mjs`.
2. Slides: edit `build/<X>.sections.html` + `build/<X>.js` (lots A–G; G = routage, isolation, stockage; F = reserve, HTML only).
3. `python3 build/merge.py --out deck.html && python3 notes.py` (merge recomputes `data-pos` and the chapter `dip` from SCRIPT.md, and asserts SCRIPT.md rows = `notes.py` IDS).
4. `./export.sh`, then `./presenter.sh`.
- Agent brief for slide lots: `build/AGENT-BRIEF-V2.md`. Backups of v1: `build/before-v2/`.
- Proof crops: `build/crop-proofs.py` → `assets/p0610-*.jpg`, `assets/p0310-*.jpg` (originals untouched; IP in the 404 crop masked as `<adresse>.nip.io`; the IPs on reserve 37 are shown as `20.216.x.x` / `20.40.x.x`).

**Video slide (35):**
- Plays `../output/zawedni-devsecops.mp4` (not inlined: it must stay next to `soutenance/`). Source `../scene/index.html`, rebuilt with `../build.sh` after the 5 subtitle corrections (prod "prévue, non déployée", Loki absent, alerts not validated, no "sans coupure"). Poster `assets/video-poster.jpg` (frame at 88 s).
- `presenter.sh` passes `--autoplay-policy=no-user-gesture-required`. **Not yet tested on two real screens** with sound: rehearse once.

**v2 facts that override §8:** SonarCloud waits for its quality gate on PRs and `main` because of the workflow condition (`SONAR_WAIT`), not "the free plan". Version = "identifiant de la version" (commit SHA), not a cryptographic proof. A persistent disk is not a backup. Speech: "on", with "je" for the opening, the contribution and the conclusion; neutral about roles (no CTO/founder).

**Postponed (not slide work):** APK demo on a phone (after the UI/UX changes); alert firing and DNS policy tests; prod deployment; automatic backups; ZAP, Falco, OPA; branch protection; report typo fixes (§9).

To resume, tell Claude: *"Lis soutenance/HANDOFF.md et continue la présentation."*

---

## 1. What the user asked for (decisions already made — do not re-ask)

| Topic | Decision |
|---|---|
| Content | **Full PFE defense** (context → approaches → solution sprint by sprint → sprint 6 verification → conclusion and next steps), not just the technical part |
| Length | **20 minutes**. Main speech (slides 1–42) estimated at **about 17:00** at 115 words/min (user asked for 17–18 min; secondary details live in the reserve); keep it there: any new sentence needs a cut elsewhere. The reserve (43–48, about 5:50) is only shown on a question |
| Number of slides | **42 small slides + 6 reserve slides** (was 41: +1 branch path (30), +1 before/after (41), the old tools slide 12 moved to the reserve as 46), one idea each, about 27 s of speech each. The user asked for "more slides so the animation looks good, each slide focuses on small things, so the pitch is easy and short". deck-kit warns that 41 is too many (it suggests 26): **ignore that warning, it is the user's choice** |
| Speech | Written word for word, **very easy French**, short sentences, technical words explained simply |
| Person | **"on"** everywhere (conjugates like "il", the easiest). The user rejected "je" and finds "nous" too hard to conjugate. Only two fixed phrases keep "je": "Je m'appelle Ali Zribi." and "Je suis prêt pour vos questions." |
| Name | **Ali Zribi** (confirmed by the user) |
| Colours | Green leads (Zawedni brand). Extra colours are allowed only when each one has a fixed meaning (see §5) |
| Proof | **Screenshots** from the report (no live demo, no video) |
| Where it runs | **Locally, in Chrome, on two screens with `./presenter.sh`** (slides on HDMI, notes on the laptop; `--swap` to reverse). One HTML file, offline after `bundle`. PDF = static backup. **No PPTX** (dropped 2026-10-06). Not PowerPoint, not online |
| Look | User approved: dark green "night" slides for the chain map, light slides for details, the camera dive (zoom) into a zone, the commit that travels |

---

## 2. Files

All in `~/Desktop/zawedni-video-pfe/soutenance/`:

| File | Role |
|---|---|
| `SCRIPT.md` | **The source of the story.** Rows 1–42 = talk, rows 43–48 = reserve (chapter "VI · Réserve (questions)", 0 steps). One table row per slide: chapter, title (a full-sentence claim), steps, visual, transition, counter value, and the speech (Note column, `[clic]` = press →). Checked with deck-kit's `plan.mjs` |
| `DISCOURS.md` | Speech to read and rehearse, **generated** from SCRIPT.md. Never edit by hand |
| `discours.mjs` | 11-line script: `node discours.mjs` regenerates DISCOURS.md from SCRIPT.md (the reserve rows go under their own heading) |
| `deck.html` | **The deck** (deck-kit runtime + code plugin inlined). All 48 slides, plus `<script id="deck-dual-screen">` before `</body>` |
| `deck.offline.html` | Offline bundle (fonts, scripts, images inlined, about 2.1 MB). **This is what `presenter.sh` opens.** Rebuild with `./export.sh` after every change |
| `deck.pdf` | Static backup (48 vector pages, last step of each slide) |
| `presenter.sh` | Two-screen launcher (`--swap` to reverse the screens) |
| `PRESENTER.md` | How to run `presenter.sh`, in French, for the user (keys, troubleshooting) |
| `notes.py` | Copies each SCRIPT.md title and speech into the h2 and notes of deck.html (`IDS` = slide ids in order) |
| `export.sh` | code-cache → check → bundle → inline images → PDF |
| `build/` | Slide fragments `A–F.sections.html` + `A–F.js` (the source of slides 2–12, 14–21, 23–24, 26–48), `merge.py`, `inline-assets.py`, `rest.mjs`, `WHITESPACE-BRIEF.md`, backup `before-whitespace/` |
| `assets/logo-white.png`, `assets/logo-green.png` | Zawedni knot logo (303×309), copied from `../presentation/` |
| `sheet.png` | Last contact sheet (check output) |
| `HANDOFF.md` | This file |

Elsewhere:
- Old 6-slide decks and their handoff: `../presentation/`, `../presentation-releases/`, `../presentation-sprint6/`, `../HANDOFF.md`. Their fact tables and "points to know" were reused here.
- Playbook: `../presentation/ZAWEDNI_PRESENTATION_PLAYBOOK.md`.
- Report (LaTeX): `~/Desktop/New Project/` (`main.tex`, `chapters/*.tex`, `figures/*.png`, `titlepage.tex`).
- Code: `~/Desktop/zawedniPFEproject/` (branch `staging`).

---

## 3. Tools and how they are wired

- **deck-kit** (engine): `~/.claude/skills/deck-kit/`. Read before building: `00-agent-brief.md` (mandatory rules), `01-runtime.md`, `04-slide-design.md`, `05-motion.md`, `06-transitions.md`, `08-diagrams.md`, `14-code-slides.md`, `12-export-qa.md`, `07-charts.md` (for the charts still to build), `10-stage.md` (optional background).
- ⚠️ **The skills are not visible as `/commands` in this Claude Code account.** OpenCode installed them into `~/.claude/skills/`, but this session uses `~/.claude-account2/`. That doesn't block anything: read the files and run the scripts directly with the paths below. (Optional fix: symlink them into `~/.claude-account2/skills/`.)
- `jameshemson` skills (`presentation-craft`, `slop-check`…): `~/.claude/skills/`. `slop-check` reads only a `.deck.md` or a `.pptx`, **not HTML**. Not used so far.
- The animation toolbox (GSAP, Three.js, Lottie, R3F…) is **deliberately not used**. deck-kit draws every frame from (slide, step, time). An outside timeline would break the rest frames, the PDF/PPTX exports, `check --timeline` and jumping between slides.
- Verified installed: Node 20.20.2, Google Chrome, Playwright Chromium (deck-kit `export/node_modules`), LibreOffice, ffmpeg, python-pptx, PIL.

### Commands (from `soutenance/`)

```bash
K=~/.claude/skills/deck-kit
node $K/scripts/plan.mjs SCRIPT.md --check       # title test + story lint
node $K/scripts/plan.mjs SCRIPT.md --animatic    # timing per slide: talk = start of 42 + its length (about 17:00); the total also counts the reserve
node discours.mjs                                # SCRIPT.md -> DISCOURS.md
python3 notes.py                                 # SCRIPT.md -> deck.html: h2 titles + notes of every built slide (id table inside)
python3 build/merge.py --out deck.html           # merge the slide fragments build/<X>.sections.html + build/<X>.js into the deck
./export.sh                                      # code-cache -> check -> bundle + inline assets/ (build/inline-assets.py) -> pdf (no pptx any more)
./presenter.sh [--swap]                          # the defence: slides on HDMI, notes on the laptop
node $K/scripts/sync-runtime.mjs deck.html       # (re)inline the runtime + code plugin into the slots
node $K/export/deck.mjs check deck.html          # lint every rest frame (must be 0 errors)
node $K/export/deck.mjs check deck.html --timeline
node $K/export/deck.mjs check deck.html --no-webfonts
node $K/export/deck.mjs sheet deck.html sheet.png   # contact sheet: LOOK at it
node $K/export/deck.mjs still deck.html 2.3 4.1 --out <dir>   # full-size frames
node $K/export/deck.mjs strip deck.html strip.png --slide 3 --frames 6   # one transition
node $K/export/deck.mjs perf deck.html           # budget 8 ms/frame
# final exports (not done yet):
node $K/scripts/sync-runtime.mjs --code-cache deck.html   # store the code highlighting (needs network once)
node $K/export/deck.mjs bundle deck.html deck.offline.html  # fully offline (fonts, scripts, images inlined)
node $K/export/deck.mjs pdf deck.html            # static PDF
node $K/export/deck.mjs pptx deck.html           # static PPTX (images + speaker notes)
```

Present: `google-chrome deck.html` (or `deck.offline.html`). Keys: → next, ← back, **F** full screen, **P** presenter view (notes + timer, the current click's passage highlighted), **O** overview, **B** black screen, **D/H/L** pen / highlighter / laser.

Known `plan.mjs` warnings to ignore: "no verb-ish word" and the missing spine chapters "failed attempts / proof" (its keywords are in English, the titles are in French), "41 slides … cut to about 26" (user's choice), "last slide does not read as a closing ask" (English heuristic).

---

## 4. Story (summary of SCRIPT.md)

- **Thesis:** a DevSecOps chain built in six sprints takes every ZAWEDNI commit to the AKS **staging** environment with no manual deployment, checked and monitored (production uses the same mechanism, planned but **not demonstrated**), and sprint 6 measured honestly what really blocks.
- **Counter (through-line):** "contrôles de sécurité sur le chemin du commit": **0** (slide 6) → **6** installed (slide 22) → **only 3 block on the `staging` path** (slide 38) → **4 on pull requests and on `main`**, where the SonarCloud quality gate also fails the job (shown as "3 · 4" on slides 38–42). This was **already true at `699b99f`**: never say "SonarCloud a été corrigé depuis". The drop from 6 to 3 is the twist. A red job still does not forbid the merge (slide 26).
- **Bookend:** the green commit dot. On slide 1 it waits on the laptop; on slide 40 the same image shows it travelling the whole way.
- **Transitions:** 3 types only, each with one meaning. `camera` = continue in the same world (default). `zoom` = dive into a zone of the chain. `dip` = new chapter.

| Chapter | Slides |
|---|---|
| I · Contexte | 1 cover · 2 ZAWEDNI startup: SARL in Mahdia, Ali = founder and CTO, buyers (hotels, guest houses) and suppliers (organic, agri-food, artisans), value, planned model = SaaS subscription with a free tier, no prices fixed (BMC summed up in 3 cards, never the 9 blocks) · 3 RSE grid rule · 4 five components · 5 before the PFE = the app / during the PFE = the chain · 6 code only on one computer (counter 0) · 7 four gaps · 8 the problem statement |
| II · Approches écartées | 9 manual + Jenkins rejected · 10 GitHub Actions + AKS, paid by the $100 Azure for Students credit (cost **estimated** at $35–40/month; no real consumption measured) · 11 DevSecOps · 12 requirements 15 + 7 |
| III · Solution | 13 the 3-zone map · 14 Scrum + Gantt · 15 Docker · 16 AI image 4 GB → 928 MB · 17 Terraform · 18 staging/prod · 19 IP outage · 20 online in staging and prod at the same time, but manual updates · 21 ten pipelines: 5 per component (path filters; mobile = APK, not an image) + 5 cross-cutting · 22 eight steps = **summary view** (counter 6), tests named · 23 Gitleaks · 24 Dependency-Check CVSS 9 · 25 Trivy (ignore-unfixed + 2 exceptions, no "zero flaw" promise) · 26 red pipeline ≠ forbidden merge, team rule · 27 secrets · 28 the pipeline changes one line in Git: **verified on staging**; production = same mechanism planned, not demonstrated (manifest still `:latest`) · 29 ArgoCD (no "sans coupure") · **30 NEW: the path feature → develop → staging → PR to main**: PR→develop runs Semgrep, plus ci-mobile and ci-workflow-guards only if their files change, no image; manual check in staging, fix scenario; prod drawn dotted (planned) · 31 Prometheus 13 targets · 32 Grafana/Loki; Alertmanager email planned, not verified end to end · 33 two monitoring limits |
| IV · Preuve | 34 the sprint 6 question · 35 method · 36 log4j 2.14.1 stopped · 37 results grid (at the report's commit) · 38 counter 6 → 3 (staging) · 4 (PR and main) · 39 four open requirements + limits |
| V · Suite | 40 bookend: the whole trip, "vérifié jusqu'à staging" · **41 NEW: before/after table** (deployment "vérifié en staging, prévu en production", infrastructure, automation, security, monitoring; status: done with proof / configured not tested / still to do) · 42 next steps (+ database backups) + "Merci… Je suis prêt pour vos questions." |
| VI · Réserve | 43 Ingress → Services → Pods, namespaces · 44 PostgreSQL, PVC, **no backup** · 45 GitOps rollback (theory, not tested) · 46 tool choices + budget (old slide 12) · 47 controls matrix per workflow + the 3 real tests · 48 three columns: report state / already in the code at `699b99f` but not described (SonarCloud on PR+main, Sealed Secrets) / after the report; what is still open (incl. prod GitOps not demonstrated) |

Old → new numbers: 1–11 unchanged; old 12 → 46; old 13–30 → 12–29; old 31–40 unchanged; old 41 → 42.

The full speech, the visual and the steps for every slide are in `SCRIPT.md` / `DISCOURS.md`.

---

## 5. Design system (as implemented in `deck.html`)

**Canvas** 1920×1080. Padding 110 px top, 150 px left/right, 90 px bottom. On every slide: kicker at the top-left (24 px, 600, green; mint on night slides), then the title h2 (62 px, 600, `data-fit="2"`). The cover uses h1 at 76 px, 700. Never all-caps.

**Fonts:** Poppins (400/500/600/700) + JetBrains Mono (400/600) from Google Fonts with `display=block`; `bundle` inlines them for offline use.

**Colours** (CSS variables on `:root`). Each colour has one meaning:

| Variable | Hex | Meaning |
|---|---|---|
| `--bg` | #f4f7f2 | light slide background |
| `--ink` / `--muted` / `--line` | #10261a / #536459 / #d3ddd5 | text / secondary text / rules |
| `--green` | #0d7b3c | Zawedni brand; "passes / security check / blocking and tested" |
| `--green-l` | #cfe8d7 | light green; planned use: "blocking but not tested" / "configured, not tested" (slides 37, 41) |
| `--mint` | #5be38f | the commit and lit path on dark slides |
| `--night` / `--night-2` | #06251a / #0c3726 | dark "map" slides (`.slide.night`, radial glow at the top-right) |
| `--on-night` / `--on-night-muted` | #e8f3ec / #a3bdad | text on night slides |
| `--azure` / `--azure-l` | #2f6fde / #8db4ff | **Azure zone only** |
| `--amber` / `--amber-text` | #e39a0b / #8f5a00 | **"reports only / still to do"** (slides 33, 37, 39, 41, reserve) |
| `--red` / `--red-text` | #d93f3f / #b42020 | **"blocked / danger"**. The badge fill uses #c22d2d for white-text contrast |

**Night vs light:** map slides (1, 13, 21, 39, 40, and probably the release openers, see §7) are dark; every detail slide is light.

**World map** (JS `buildWorld(svg)` + `paintWorld(W, st, z[3], t, seen)` in `deck.html`). Same geometry on every slide that shows it:
- Zone boxes at y 430–900:
  - zone 1 "Poste du développeur": x 150, width 350 (laptop centred at x 315);
  - zone 2 "GitHub Actions": x 545, width 625; 8 gates at x 590…1115 step 75, y 665; gates 6 (Docker build) and 8 (ACR push) are build steps (square icon), the other 6 are security checks (shield icon);
  - zone 3 "Azure": x 1220, width 550; ACR (1300,665) r44 · Argo (1440,665) r44 · AKS hexagon (1640,665) r62, label "Cluster" above it · Supervision (1640,845) r38, label on its left.
- Commit path: `M315,665 H1640 V845`. `AT_RAIL_END` = the fraction where zone 2 ends. The path is drawn **before** the zones so it passes under the nodes.
- `paintWorld` lights each zone by `z[k]`, draws the lit path up to `t`, moves the commit dot (with a pulsing halo, `st.life`, so the slide declares `ambient: 24`), lights each gate when the commit passes, and pulses each node when the commit reaches it.
- Zoom target for zone 2 = canvas point **(850, 665)**; zone 1 ≈ (315, 665); zone 3 ≈ (1500, 665).

**Camera world positions (`data-pos`):** one row per chapter, 1.1 slide-widths apart:
- Chapter I (slides 1–8): y 0, x = (n−1)×1.1
- Chapter II (9–12): y 1.2, x = (n−9)×1.1
- Chapter III (13–33): y 2.4, x = (n−13)×1.1 (so 22 → 9.9 and 25 → 13.2, as already set)
- Chapter IV (34–39): y 3.6, x = (n−34)×1.1
- Chapter V (40–42): y 4.8, x = (n−40)×1.1
- Reserve (43–48): y 6.0, x = (n−43)×1.1

**Code slides:** deck-kit code plugin (`data-layout="code-side"`, `data-code="yaml"`, `data-lines="*|5,7"` for line focus), with a `.dk-companion` SVG (520×560) on the right, driven from `frame`. Under each code slide, a `.src` line names the file. Shorten only by dropping lines or the action's SHA; never invent config.

**Rules kept from deck-kit:**
- Everything is computed from `st` in `frame` (no CSS transitions or keyframes, no `setTimeout`).
- Every step's rest frame carries the message.
- Text ≥ 20 px (labels) and ≥ 24 px (body).
- Under 40 words on screen per step; the speech goes into `<aside class="notes">` with `<p data-step="n">` per click.

---

## 6. What is built

All 48 slides are in `deck.html` (ids in `notes.py`). The 4 approved samples (`couverture`, `chaine`, `huit-etapes`, `trivy`) are unchanged except titles/notes; the other 44 were built in 6 batches whose source fragments stay in `build/` (`A` 2–12, `B` 14–21, `C` 23–24 + 26–30, `D` 31–37, `E` 38–42, `F` reserve 43–48: `<X>.sections.html` + `<X>.js`, each JS in one `{ }` block, CSS scoped by slide id). **Edit a slide in its fragment, then `python3 build/merge.py --out deck.html && python3 notes.py`** (merge replaces the batch's sections and script, so it is safe to re-run). `build/deck.before-merge.html` = the 4-slide deck before the merge; `build/sheet-<X>.png` = per-batch sheets.

Last QA (2026-10-05): `check` 118 rest frames, **0 errors**, 40 warnings (26 density: dense tables, rails, reserve slides; 14 contrast-unknown on night gradients). `perf`: means 0.4–6 ms, but single-frame spikes of 13–20 ms during some camera moves (→5, →17, →25, →14; the slide flagged changes between runs, so probably headless noise) — re-run `perf` and watch a live run in Chrome before the defense.

Choices the batches made that the user should glance at:
- 9/10 matrix: 5 criteria from the report's table (`Cloud-native` dropped); GitHub Actions + AKS cells say "Crédit étudiant" (cost) and "Dans le pipeline" (security; softened from the report's "Complète").
- 14 Gantt: sprint weeks from the report's Gantt v4 (1–2, 3–4, 5–7, 8–9, 10–11; sprint 6 weeks 5–11).
- 17 Terraform: report-era block (2 × Standard_B2s), `location` line dropped (noted in `.src`).
- 23 Gitleaks, 24 pom.xml, 28 GitOps: real lines, shortened by dropping lines only; the GitOps companion shows the real staging tags `ba2b5ef…` → `1e6a01e…`.
- 31/32 screenshots cropped in CSS (personal browser bars hidden).
- 36 log4j rail = the 7 real `ci-backend` steps (not the 8-step summary).
- 41 bilan statuses: Trivy and SonarCloud "configuré, pas testé"; supervision "en place" + amber "métriques appli et alertes à finir".
- 46 r-choix: Trivy's criterion "scan de l'image dans le pipeline" is its role, not a criterion from the report.

---

## 7. Next steps (in order)

**From 2026-10-06 (do these first):**
1. **Apply the user's list of speech and slide changes** (the user will paste it). Speech: edit SCRIPT.md, then `node discours.mjs` and `python3 notes.py`. Slides: edit `build/<X>.*`, then `python3 build/merge.py --out deck.html` and `python3 notes.py`.
2. **Whitespace pass** (see the status block at the top), after the list, so the work is done once.
3. Run `./export.sh`, then test `./presenter.sh` once (both directions if useful).
4. The user rehearses with `./presenter.sh` and the timer, and checks the projector on the defence day.

**Older steps (kept for history):**

1. **DONE: all slides built.** Next: the user reviews them in Chrome (`google-chrome deck.html`, P = presenter view); fix in `build/<X>.*`, then merge + notes. (Old note:) Build the slides, in script order, between the existing ones (keep the ids readable: `zawedni`, `grille-rse`, `composants`…). After each batch of about 6 slides: `check` + `sheet` + look at it.
2. **DONE (decided 2026-10-05): 15 = `dip`, 21 = `dip` + night map (zone 2 lit, the ten pipelines inside), 22 = `zoom` from it, 29 = `camera`.** History: zoom transitions need a map before them. The script gives `zoom` to slides 15 (Docker), 21 (ten pipelines) and 29 (ArgoCD), but the slide before each is not the map. **Recommended fix:** make the release openers dark map slides with the release's zone lit, so the next slide dives into it.
   - Option A: slide 15 starts as the world with zone 1 lit.
   - Option B: switch 15, 21 and 31 to `dip`, and keep `zoom` only where a map slide comes first (13 → 14 works if 14 stays `camera`; the 13 → 22 zoom already works in the sample only because they are adjacent there).
   - In the full order, 21 follows 20, so either 21 becomes a dark map slide (zone 2 lit, with the 10 pipelines shown inside zone 2) and 22 zooms from it, or 22 gets `camera`. Decide and keep it consistent.
3. **Screenshots:** 12 are converted to JPEG (≤1600 px wide, 40–170 KB) in `soutenance/assets/ch…_….jpg`, shown in a browser-style frame. **`bundle` only inlines http(s) images, not local `assets/…`**: before the final export, inline them (data URIs) or ship `assets/` next to `deck.offline.html`. Mapping:

   | Slide | Screenshots |
   |---|---|
   | 2 | `ch5_sec4_interface-client.png` |
   | 20 | `ch5_sec4_interface-client.png`, `ch5_sec4_interface-admin.png`, `ch5_sec4_pods-running.png` |
   | 29 | `ch7_sec1_argocd-2-apps-synced.png` (also `ch7_sec5_argocd-vue-arbre.png`) |
   | 31 | `ch7_sec6_prometheus-13-targets.png` |
   | 32 | `ch7_sec6_grafana-dashboard-cluster.png` |
   | optional | `ch6_sec3_liste-10-pipelines.png` (21), `ch6_sec4_pipeline-backend-reussi.png`, `ch6_sec4_tags-sha-acr.png` (28), `ch5_sec1_portail-azure-ressources.png` (17, 41), `ch4_sec4_compose-up.png` (15), `ch8_sec2_sonarcloud-dashboard.png` (38), `ch1_sec8_gantt-sprints-v4.png` (reference for 14), `annexeB_business-model-canvas.png` (reference only for 2: do not show the 9 blocks), `ch6_sec6_apk-github-artifacts.png` (21) |

4. **Code slides still to build:**
   - 23 Gitleaks: the real step is in `ci-backend.yaml` around lines 170–210 (`./gitleaks dir . --config .gitleaks.toml … --report-path gitleaks-report.json` and `./gitleaks git . …`). **Read the exact lines first.** `.gitleaks.toml` has several narrow allowlists (SealedSecret ciphertext ×2, a Prometheus checksum…), so never say "une seule exception".
   - 24 `ZawedniServer/pom.xml` line 315: `<failBuildOnCVSS>9</failBuildOnCVSS>`.
   - 17 Terraform AKS block (report state; today's `variables.tf` says node_count 1, `Standard_B2as_v2`, since 2026-10-03): in report ch5 (`node_count = 2`, `vm_size = "Standard_B2s"`, `identity { type = "SystemAssigned" }`).
   - 28 the k8s manifest image line + the "Update K8s manifest" step (sed + ZAWEDNI CI Bot commit) in `ci-backend.yaml`.
5. **Notes:** automatic. Change SCRIPT.md first, then `node discours.mjs` and `python3 notes.py` (it rewrites every built slide's h2 and notes, one `<p data-step>` per `[clic]`).
6. **Final QA:** `check`, `check --timeline`, `check --no-webfonts`, `perf`, `sheet`, one `strip` per transition type, and a live run-through in Chrome with presenter view (P) and a timer.
7. **DONE: exports** with `./export.sh` (offline test passed). Gotcha fixed in `build/merge.py`: slide CSS is moved out of the sections into `<style id="deck-slides-css">` in `<head>`, and every `#id` selector becomes `:is(#id,[id^="id__p"])`, because the vector PDF clones each slide and renames its ids to `<id>__pN` (without this, the batch-styled slides printed unstyled). Never write `#id` CSS directly in deck.html; put it in the fragments and merge.
8. Optional: a short `README.md` in `soutenance/` with the run commands. The Q&A prep is now the reserve (43–48) in SCRIPT.md / DISCOURS.md.

---

## 8. Facts to keep exact (re-checked 2026-10-05 against the report, the workflows on `staging` and the k8s manifests)

**Report = state at commit `699b99f` (2026-09-07, on `staging`, not on `main`). Later code changes are said as "aujourd'hui / dans le code actuel", never as report facts.**

- Startup: ZAWEDNI, SARL, 3 people, **"pépinière d'entreprises de Mahdia"** (the report never says "incubateur"). Founders (report ch1:59): Ali Zribi (CTO) and Hadil Ben Masseoud. BMC (annexe B): buyers = hotels and guest houses; sellers = organic producers, agri-food producers/suppliers, local artisans (the cahier des charges says "PME, artisans, grandes entreprises", the report admits the gap). Model: SaaS B2B subscription with a free entry tier + advertising + premium services; **no prices** ("aucun montant", ch1:145). Partners in the BMC are not confirmed.
- Before vs during the PFE (ch1:194): the app was built by Ali **before** the PFE and is not part of it; the PFE = containers, cloud, secured CI/CD, and checking that chain.
- Supervisors (title-page spelling): **Mme Amel Zidi**, **Mme Sana Ghannay**, **Mme Hadil Ben Masseoud**. ISIMa, Université de Monastir, Mastère professionnel en informatique, 2025–2026.
- Scrum: Product Owner = Mme Ben Masseoud; Scrum Master = the academic supervisors; development team = Ali Zribi.
- Platform: Spring Boot 3.2 / Java 17 API, 2 React 18 web apps, FastAPI AI service, Flutter app, PostgreSQL 16 + pgvector.
- Image sizes: backend 138 MB, client 30 MB, admin 26 MB, AI 928 MB (over 4 GB before `torch==2.4.1+cpu`).
- Budget: Azure for Students **$100** credit; cluster **estimated** $35–40/month for 2 × B2s, ACR Basic ~$5/month (ch3:353, ch2:886). **No measured consumption, no budget alert in Terraform.** GitHub Actions free ("2 000 minutes par mois", ch2 footnote). Never say "sans coût": say "payé par le crédit étudiant".
- Azure (report): francecentral; AKS 2 × Standard_B2s; ACR `zawedniacr.azurecr.io` Basic; Blob storage (APKs).
- IP outage: 20.216.206.15 → 20.40.132.70. Today `k8s/PUBLIC_HOST` = `20.19.44.34.nip.io` (October rebuild).
- **Branches and triggers (workflows on `staging`):**
  - every job runs only on `pull_request` or on a push to `staging` / `main`. **A push to `develop` (or a feature branch) runs no pipeline at all** (except `ci-workflow-guards`, which has no branch filter, when workflows or `k8s/` change).
  - PR → `develop`: only `ci-semgrep` (+ `ci-mobile` if `zawedni/**` changes, + guards). PR → `staging`/`main`: the full component pipelines + secrets + semgrep + public-host, **without** ACR push or manifest update (`if: github.event_name != 'pull_request'`).
  - Push to `staging`: build + push `:staging` and `:<sha>-staging`, bot commit to `k8s/staging/...`. Push to `main`: `:latest` and **`:<sha>-latest`** (never plain `:<sha>`), bot commit to `k8s/prod/...`.
  - Component pipelines (backend, client, admin, ai, mobile) use path filters; cross-cutting: `ci-secrets`, `ci-semgrep`, `ci-public-host` (no path filter), `ci-infra` (infrastructure/, k8s/), `ci-workflow-guards` (workflows, k8s/).
  - Report GitFlow table: develop "PR obligatoire", staging and main "PR (convention)". In the history, main received PRs #10–#14 (2026-09-02/03); many commits went straight to `staging` (solo developer). Nothing merged to `main` since **2026-09-03**.
- **What each workflow really runs:** backend = Gitleaks → `mvn clean verify` (JUnit) → Dependency-Check → SonarCloud → Docker build → Trivy → ACR push → manifest bump. client/admin = Gitleaks → `npm ci` → Vitest → `npm run build` → Docker → Trivy → push → bump. ai = Gitleaks → pytest → Docker → Trivy → push → bump. mobile = Gitleaks → `flutter test` → `flutter build apk` → GitHub artifact; on push also **Azure Blob container `apk-releases`** + Google Drive (`continue-on-error: true`) + email. infra = Gitleaks + Checkov (advisory). **Semgrep and Checkov are not in the component pipelines**: the "8 steps" are a summary view. Reports kept as GitHub artifacts: Gitleaks, OWASP, Checkov, Semgrep; SonarCloud on its dashboard.
- Gates:
  - Gitleaks blocks (several narrow allowlists in `.gitleaks.toml`).
  - Dependency-Check: `failBuildOnCVSS` 9.
  - Trivy: `severity: HIGH,CRITICAL`, **`ignore-unfixed: true`** (a flaw with no fix does not block), `exit-code: '1'`, `.trivyignore.yaml` with **2** waivers (each with a reason and `expired_at` 2027-02-24). Never say "aucune faille grave ne peut passer".
  - Checkov: `continue-on-error: true` (advisory). Semgrep: no `--error` (a finding does not fail; a crash does).
- **SonarCloud — report vs code:** the report says "quality gate en cours de configuration" / "non bloquant". The code has `SONAR_WAIT` true on `main` and on PRs **since 2026-09-02** (already present at `699b99f`), no `continue-on-error`: the gate **fails the job on PRs and on `main`, never on `staging`** (free plan does not keep the short-branch analysis). A failed job ≠ a forbidden merge. **Deck wording:** "sur le chemin de staging, trois contrôles bloquent ; sur les pull requests et sur main, SonarCloud s'ajoute : quatre". Never "corrigé depuis".
- No branch protection (GitHub free plan, private repo) → team rule "on ne fusionne pas tant que c'est rouge". Never say "GitHub bloque".
- Secrets: GitHub Secrets for CI. App secrets: **SealedSecret files since 2026-08-26** (controller since 2026-08-23, installed by the ArgoCD app `zawedni-platform`), 3 per env (backend, ai, postgres). **This is before `699b99f`: the report simply does not describe it** (it says "Kubernetes Secrets").
- **GitOps write-back:** the bot's `git push` was refused (read-only token) and hidden by `|| true` until the fix **45bd5c3 (2026-09-06)**. Until then deployment worked through the floating `:staging` tag. First bot commits on `staging`: **2026-10-03**. **Prod manifests on `main` still use `:latest`**: `main`'s workflows date from the last merge (2026-09-03), before the fix, so the prod bump cannot work until `staging` is merged into `main` again. So "on sait quelle version tourne" and `git revert` only hold for staging.
- ArgoCD: apps staging → `k8s/staging` (targetRevision `staging`) and prod → `k8s/prod` (`main`), automated, prune + selfHeal; platform and monitoring apps too. Lesson: `kubectl rollout undo` + selfHeal = pods created and destroyed in a loop (report ch7). Rollback by `git revert` = theory, **never tested**.
- **Deployments:** `replicas: 1` everywhere, no `strategy` (default RollingUpdate), probes only on backend and ai, no PDB, no HPA. The report claims rolling updates "sans interruption" (ch3:707) but ch5 scales the backend to 0 then 1 (RWO volume). **No zero-downtime test → never say "sans coupure".**
- **PostgreSQL:** `kind: Deployment` (the report says StatefulSet: report error), `postgres:16-alpine`, PVC 5 Gi ReadWriteOnce (default storage class), no probes. **No backup at all** (no pg_dump, CronJob, Velero). Flyway disabled, `ddl-auto=update`.
- Ingress NGINX, Services ClusterIP. Namespaces `zawedni-{frontend,backend,data}` (staging) and `zawedni-prod-{…}` (prod), `zawedni-monitoring`, `argocd`. Hosts: `<ip>.nip.io`, `admin.`, `stage.`, `stage.admin.`.
- Staging and prod at the same time: the report shows both answering at the end of sprint 2 (ch5:325-340) and both ArgoCD apps Synced/Healthy (ch7). **Nothing in the report or repo measures the 2-node capacity**: the old claim "the 2-node cluster could not run staging, prod and monitoring together" has **no source**; it is no longer in the speech.
- Monitoring (report): kube-prometheus-stack (13 targets Up, no ZAWEDNI target), loki-stack + Promtail, Alertmanager by email per the report, **but no receiver config in Git and alerts never verified end to end** (ch8:95-97). The speech says "prévu pour envoyer un email".
- NetworkPolicies: in the repo 12 per env (since 2026-08-24); not enforced in the report's cluster (no Calico). Calico is in Terraform since 2026-08-24.
- **After the report (code and `evidence/`, not in the report):** cluster destroyed 2026-09-06 after the D5 run; **rebuilt 2026-10-03** for the defense (1 node `Standard_B2as_v2`, staging + monitoring only, **no prod app**). Capture `evidence/20261003-run-1349`: ArgoCD apps Synced/Healthy, `/api` 200, ZAWEDNI targets `up` in Prometheus (backend `/actuator/prometheus`, ai `/metrics`), NetworkPolicy test 10 passed / 1 failed (DNS), Loki **not** reinstalled. Whether the cluster is still up today is unknown.
- Sprint 6 (report ch9): tested and blocking = Gitleaks, Dependency-Check (+ ci-public-host, ci-secrets as cross-cutting); configured to block but not tested = Docker build, Trivy, ACR push; reports only = SonarCloud, Semgrep, Checkov. Tests: log4j-core 2.14.1, fake JWT secret, old IP. Not done: OWASP ZAP (BF08), branch protection (T25), Falco + OPA Gatekeeper (BF12), app metrics. Limits: internal check, not an audit. No test-coverage figure in the report.
- "8 étapes" vs "6 contrôles": Docker build and ACR push are build/publish steps, not security checks.

---

## 9. Report problems the user should fix before the defense

1. **Author name:** `titlepage.tex` says **"Elyes Zribi"**, but the user is **Ali Zribi** (also in chapter 1). Fix the title page.
2. **Professional supervisor's name** is spelled 3 ways: "Massaouade" (ch1 §2), "Massaoude" (ch1 table), "Masseoud" (title page, Scrum table). The deck uses **Masseoud**; make the report consistent.
3. The conclusion still says 3 checks don't block (SonarCloud, Semgrep, Checkov). The code at `699b99f` already made the SonarCloud gate fail the job on PRs and `main` (since 2026-09-02). The deck now says "3 on the staging path, 4 on PRs and main" and reserve 48 lists it as "already in the code at that commit, not described". Expect a jury question; the answer is in §8 and reserve slide 48.
4. Other report inconsistencies a jury could raise: "sans interruption" (ch3) vs scale 0 → 1 (ch5); PostgreSQL "StatefulSet" vs a Deployment; 4 namespaces + old IP (ch3) vs 8 namespaces (ch5); develop "PR obligatoire" vs no branch protection; APK to Blob only (BF14) vs three destinations (ch6); Sealed Secrets used but not described.

---

## 10. Facts still to confirm with the user (before the defense)

1. **Cluster on defense day:** is the 2026-10-03 cluster (1 node, staging + monitoring) still up? If not, slide 39 ("le cluster a été arrêté") stays true; if yes, decide whether to mention it.
2. **Alertmanager email:** where was the receiver configured during sprint 5 (Helm values outside Git?). The speech only says "prévu".
3. **Branch practice:** confirm that "feature → develop → staging → main" (slide 30) is how the work was really meant to be shown, given that many commits went straight to `staging`.
4. **BMC wording:** OK to name the targeted buyers as "hôtels et maisons d'hôtes" (BMC) rather than "PME" (cahier des charges)? And "On l'a fondée avec Madame Hadil Ben Masseoud. Mon rôle : fondateur et CTO." (slide 2)?
5. **Budget:** any real Azure consumption figure to replace "estimation 35–40 $/mois"?
6. **Report fixes** (§9): title-page name, supervisor spelling, SonarCloud classification.
7. **Two-node limit:** the brief says the 2 nodes could not run staging + prod + monitoring together. Neither the report nor the repo records this (no Pending pods, no capacity note), so it was removed from the speech. If it happened, note what was seen and put one sentence back on slide 20 or 43.
