# Pixeloid — Game Concept (Draft)

> Status: **Draft / not approved** · 2026-11-11
> Source of truth for observed behavior: `README.md`, `dist/core.mjs`, `dist/app.mjs`, `dist/index.html`, `test.mjs` at `docs/map-systems-20261111`.
> This is a reconstruction from the playable prototype, **not** a recovered or approved original GDD. README mentions a separate design document, but its location/content has not been established.

## High Concept

**Pixeloid: 잠든 수로** is a mobile-oriented, browser-first incremental excavation game. Players dispatch small automated balls into a pixel-tile map, earn minerals from removed terrain, improve and redistribute their balls, and uncover three buried structures to finish the expedition.

## Player Fantasy and Pillars (Proposed, unapproved)

1. **Visible excavation progress** — each destroyed cell changes the map and progress display.
2. **Meaningful small choices** — choose ball types, destinations, and purchases without micromanaging each collision.
3. **Recover the sleeping waterway** — uncover and restore a reflector, generator, and core artifact.
4. **Mobile-first continuity** — play in short sessions with pause, save, backup and restoration.

These pillars are inferred from current implementation, not confirmed design intent.

## Core Loop

1. Tap a map target and dispatch a selected ball group.
2. Balls travel, strike tiles and mine resources automatically.
3. Spend minerals on more balls (3–12 total) or speed upgrades; reassign composition and targets.
4. Clear at least 80% of the surrounding ring to activate a buried device.
5. Recover the core artifact, optionally continue mining; resume across browser sessions.

## Current Prototype Rules (observed)

- Fixed 96×64 map, terrain types with differing durability and mineral yields.
- Three ball types: basic, piercing, electric; groups can be selectively redeployed.
- Three devices: reflector, generator, core artifact; 80% surrounding-ring restoration threshold.
- Browser Canvas 2D with touch/pointer gestures, pinch zoom, modal sheets, optional SFX.
- State codec currently uses version **2**, with version **1** migration; localStorage key remains `pixeloid-demo-v1`.
- Backup, before-reset snapshot and restore are supported by code.
- Static `dist/` deployable via GitHub Pages; Android native wrapper not built.

## Target Platform and MVP

- Current playable target: browser (mobile touch and desktop pointer).
- Future target: Android via a wrapper (README suggests Capacitor).
- MVP definition (proposed): complete excavation → economy → device restoration → artifact goal, with usable mobile input and safe persistence.

## Explicit Exclusions / Unverified Scope

- No account system, multiplayer, ads, analytics or third-party runtime assets in current sample.
- No claim of production-ready native saves, Android binaries, normal-play balancing or mobile-device verification.
- The original concept, detailed balance targets, unlock schedule, level variety, story and long-term retention loop remain **unconfirmed**.
- Do not replace current simplified mechanics based on assumptions about the original GDD.

## Systems Crosswalk

| Concept responsibility | Systems-index IDs | Evidence |
|---|---|---|
| Map and excavation | 1–4 | `dist/core.mjs` |
| Economy and composition | 5–7 | `dist/core.mjs`, `dist/app.mjs` |
| Device objectives | 8 | `dist/core.mjs` |
| Save and recovery | 9–10 | `dist/core.mjs`, `dist/storage.mjs` |
| Mobile interaction and presentation | 11–14 | `dist/input.mjs`, `dist/app.mjs`, `dist/index.html` |
| Testing and distribution | 15–17 | `test.mjs`, `.github/workflows/pages.yml`, `README.md` |

## Open Design Decisions

1. Confirm whether this prototype's game fantasy and core loop match the original design.
2. Locate original GDD and reconcile simplified speed, unlocks, targeting and generator effects explicitly mentioned in README.
3. Agree on normal-play completion time, balancing, progression pacing and intended replayability.
4. Decide Android save durability and migration requirements before native release.
5. Approve this concept and system inventory before treating them as Game Studios production specifications.
