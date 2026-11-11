# Pixeloid P0 Persistence, Recovery and Compatibility Validation Plan

> Status: Draft / execution pending · 2026-11-11
> Branch: `docs/map-systems-20261111` · No runtime changes authorized by this document.
> Related: `design/gdd/game-concept.md`, `design/gdd/systems-index.md`
> Baseline: `dist/core.mjs` state version 2; key `pixeloid-demo-v1`; v1→v2 migration.

## Goals and invariants

1. A failed save/restore/reset never silently destroys the last valid recoverable snapshot.
2. Corrupt, missing or unsupported payloads must not be accepted as valid progression.
3. v1 saves migrate deterministically to v2; v2 roundtrip preserves progression, devices, ball composition and targets.
4. Save failures must not mutate the in-memory live state or mark a write successful.
5. Changes must preserve current gameplay, storage key, backup names and the main branch until verified.

## Source findings and risk

- `saveProgress` validates the new and previous snapshots, writes `KEY+'-backup'` then writes `KEY`. If the second write fails, the previous primary remains but the backup generation changes. This is **not a multi-key atomic transaction**.
- `resetSave` writes `KEY+'-before-reset'` before writing the new primary. If the second write fails, the primary survives but the pre-reset snapshot may be replaced. Test this deliberately.
- `restoreBackup` decodes the candidate before replacing the primary; verify errors during the primary write and confirm source backup remains intact.
- `decode` validates many invariants and v1 migration; it also normalizes `hp` for indestructible tiles and clears `events`. Do not require byte-identical roundtrip for transient fields.
- The browser UI sets `storageBlocked` after initial load failure; verify recovery UX separately.
- `localStorage` has no atomic multi-key commit and no cross-tab coordination. Design mitigations must be evaluated before implementation.

## Test matrix

| ID | Scenario | Expected invariant | Test layer |
|---|---|---|---|
| P0-01 | Fresh v2 save/load | Progress preserved | Node |
| P0-02 | v1 save migration | Counts/targets reconstructed, version 2 | Node |
| P0-03 | Corrupt JSON and invalid shape | Decode rejects, current valid save untouched | Node |
| P0-04 | Negative/NaN/out-of-map progression | Decode rejects | Node |
| P0-05 | Invalid device positions/charge and ball counts | Decode rejects | Node |
| P0-06 | Save same state repeatedly | No extra write or backup rotation | Node |
| P0-07 | Fail backup write | Primary unchanged; previous backup recoverable | Node |
| P0-08 | Fail primary write after backup succeeds | Primary unchanged; backup behavior documented | Node |
| P0-09 | Restore missing/corrupt backup | Primary unchanged | Node |
| P0-10 | Fail primary write during restore | Primary unchanged; backup retained | Node |
| P0-11 | Fail before-reset snapshot write | Reset canceled; primary and live state unchanged | Node |
| P0-12 | Fail primary write during reset | Reset canceled; previous primary valid; snapshot semantics documented | Node |
| P0-13 | Reset followed by autosave and before-reset restore | Original expedition recoverable | Node + browser |
| P0-14 | Browser reload and background/pagehide | Last valid save can be resumed | Chromium/Safari |
| P0-15 | Storage quota/security denial | Clear error, no false success, no destructive reset | Browser |
| P0-16 | Two tabs writing same key | Repro lost-update risk; define single-writer policy before fix | Browser |
| P0-17 | Pause/resume and dialog transitions | No unexpected save overwrite | Browser |
| P0-18 | Main vs candidate compatibility | Existing v1/v2 fixtures load; no gameplay regression | Node + browser |

## Execution sequence

1. Capture immutable baseline SHA and list all existing design artifacts; run `bash .claude/scripts/artifact-check.sh` from repository root.
2. Run baseline `node test.mjs` and the four `node --check` commands from `project.yaml`; record logs, environment and SHA.
3. Add failure-injection tests with an in-memory storage stub that fails on selected `setItem` calls. Cover both first and second writes for save and reset.
4. Add fixtures for valid v1/v2, malformed state, device positions and partial/corrupt writes. Keep the storage key unchanged.
5. Run browser checks: fresh play, reload, restore, reset, tab collision, storage denied, pagehide; collect screenshots and console errors.
6. Only if tests reveal a defect, propose the smallest compatible patch on the working branch; rerun all tests and compare persisted state.
7. Request review before merge/deploy. Verify GitHub Actions result and actual Pages content separately.

## Acceptance gates

- All Node tests pass on the exact commit SHA.
- Browser persistence and restore scenarios pass on target browsers; any untested device is explicitly listed.
- No loss of a previously valid primary or documented recovery snapshot under injected failures.
- v1 migration and v2 saves remain readable; no forced wipe or silent format change.
- Main branch unchanged until approval; Pages deployment only after merge and independent live verification.

## Current evidence (do not overclaim)

- Source and existing assertions reviewed: yes.
- New tests executed: **no**.
- Baseline Node tests executed: **no**.
- Browser/device tests executed: **no**.
- P0 code fix implemented: **no**.
- Production deployment performed: **no**.
