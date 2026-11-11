# Pixeloid Systems Index (Provisional)

> **Status**: Draft — concept/GDD not verified; not approved
> **Created**: 2026-11-11
> **Source**: main README.md, dist/core.mjs, dist/app.mjs, dist/input.mjs, dist/storage.mjs, dist/index.html, test.mjs, project.yaml, .github/workflows/pages.yml
> **Important**: Required `design/gdd/game-concept.md` was not found at the prescribed path. This is a code-derived inventory, NOT a completed official /map-systems approval.

## Overview

Pixeloid (잠든 수로) is a browser-first incremental excavation prototype targeting Android. Players dispatch three ball types to excavate a fixed 96×64 map, earn minerals, improve their fleet and restore a reflector, generator and artifact. The current code is an executable implementation; no claim of successful live browser testing is made here. P0–P2 below are **remediation priorities**, not Game Studios milestone tiers.

### Implementation evidence

- Core map, mining, ball movement, devices, economy and state: `dist/core.mjs`
- Presentation, interaction, pause, dialogs, sound: `dist/app.mjs`, `dist/index.html`
- Pointer gesture helpers: `dist/input.mjs`
- Backup, restore, reset and save: `dist/storage.mjs`
- Node assertions: `test.mjs`
- Pages workflow: `.github/workflows/pages.yml`
- Android wrapper: documented as not built in `README.md`

## Systems Enumeration

| # | System Name | Category | Priority | Status | Design Doc | Depends On |
|---|-------------|----------|----------|--------|------------|------------|
| 1 | Map and terrain generation | Core | P0 | Implemented in source; runtime unverified | — | — |
| 2 | Game state and tick simulation | Core | P0 | Implemented in source; runtime unverified | — | 1 |
| 3 | Ball motion and targeting | Gameplay | P0 | Implemented in source; runtime unverified | — | 1, 2 |
| 4 | Collision, mining and tile damage | Gameplay | P0 | Implemented in source; runtime unverified | — | 1, 2, 3 |
| 5 | Minerals and purchase economy | Economy | P1 | Implemented in source; runtime unverified | — | 2, 4 |
| 6 | Ball composition and selective redeploy | Gameplay | P1 | Implemented in source; runtime unverified | — | 2, 3, 5 |
| 7 | Speed upgrades | Progression | P1 | Implemented in source; runtime unverified | — | 2, 5 |
| 8 | Devices, restoration and artifact victory | Gameplay | P1 | Implemented in source; runtime unverified | — | 1, 2, 4 |
| 9 | State codec and migration | Persistence | P0 | Implemented in source; runtime unverified | — | 2, 5, 6, 7, 8 |
| 10 | Autosave, backup, reset and restore | Persistence | P0 | Implemented in source; runtime unverified | — | 9 |
| 11 | Pointer, pan, pinch and zoom | UI | P1 | Implemented in source; device unverified | — | 1, 3 |
| 12 | HUD, sheets, controls and onboarding | UI | P1 | Implemented in source; device unverified | — | 5, 6, 8, 10, 11 |
| 13 | Canvas rendering and visual feedback | UI | P1 | Implemented in source; device unverified | — | 1, 2, 3, 8 |
| 14 | Sound effects | Audio | P2 | Implemented in source; device unverified | — | 2, 4 |
| 15 | Node regression tests | Meta | P0 | Test code present; not executed in this review | — | 1–11 |
| 16 | GitHub Pages deployment | Meta | P1 | Workflow present; run not verified | — | 12, 13, 15 |
| 17 | Android native wrapper and lifecycle (inferred) | Meta | P2 | Not built per README | — | 9–13 |

## Dependency Map

### Foundation Layer
- Map and terrain generation; game state and tick simulation.

### Core Layer
- Ball motion/targeting → collision/mining → mineral economy.

### Feature Layer
- Composition/redeploy, upgrades, devices and victory → codec/migration → save/restore.

### Presentation Layer
- Pointer gestures, Canvas rendering, HUD and dialogs; audio.

### Polish Layer
- Regression testing, Pages release verification, Android wrapper and native lifecycle.

## Recommended Design Order

| Order | System | Priority | Layer | Agent(s) | Est. Effort |
|-------|--------|----------|-------|----------|-------------|
| 1 | State and codec compatibility | P0 | Foundation | programmer, QA | M |
| 2 | Autosave/backup/reset atomicity | P0 | Feature | programmer, QA | M |
| 3 | Mining and simulation invariants | P0 | Core | programmer, QA | M |
| 4 | Regression coverage and CI evidence | P0 | Polish | QA, programmer | M |
| 5 | Targeting and ball composition | P1 | Core | game-designer, programmer | M |
| 6 | Economy, upgrades and devices | P1 | Feature | game-designer, QA | M |
| 7 | Touch, pinch, camera and UI | P1 | Presentation | UI/UX, QA | L |
| 8 | Canvas performance and accessibility | P1 | Presentation | programmer, UI/UX | M |
| 9 | Pages deployed-version smoke test | P1 | Polish | QA | S |
| 10 | Audio refinement | P2 | Polish | audio, QA | S |
| 11 | Capacitor lifecycle/native saves | P2 | Polish | programmer, QA | L |

## Circular Dependencies

No structural dependency cycle is required by the conceptual layering. Runtime state and UI communicate bidirectionally in app code; keep state ownership in core and let UI invoke operations and render snapshots rather than adding circular module imports.

## High-Risk Systems

| System | Risk Type | Risk Description | Mitigation |
|--------|-----------|-----------------|------------|
| Persistence | Technical | Backup written before current save; a failed second write can leave mixed generations | Inject failure at each write boundary; verify restoration and unchanged valid saves |
| Input/camera | Technical | Multitouch and drag behavior differs across devices | Test mobile Chromium and Safari with zoom, rotation, cancel and interruption |
| Core balancing | Design | Synthetic completion route does not measure ordinary play | Record seeded normal-play runs and completion time |
| Design traceability | Scope | Required concept and approved system GDDs not verified | Locate source design, reconcile mechanics, request design approval |
| Android | Technical | No native wrapper or durable native saves yet | Separate wrapper spike and lifecycle tests before shipping |

## Progress Tracker

| Metric | Count |
|--------|-------|
| Total systems identified | 17 |
| Systems with implementation evidence | 16 (includes test and workflow files, not execution proof) |
| Systems documented as not built | 1 |
| Design docs reviewed | 0 |
| Design docs approved | 0 |
| Runtime/browser tests performed in this review | 0 |

## Next Steps

- [ ] Locate or author and review `design/gdd/game-concept.md` (do not invent approved design).
- [ ] Reconcile this draft against existing design documents and user intent.
- [ ] Run `bash .claude/scripts/artifact-check.sh` locally and record results.
- [ ] Run `node test.mjs` and browser/device smoke tests.
- [ ] Review P0 persistence and state-compatibility before any behavior changes.
- [ ] Do not merge to main or deploy until the draft is reviewed and tests pass.
