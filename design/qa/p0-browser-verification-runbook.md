# Pixeloid P0 Browser Verification Runbook

> Status: **Not executed**. Branch `docs/map-systems-20261111`; do not use production Pages to validate unpublished code.
> Browser preview must serve the checked-out branch's `dist/` over HTTP.

## Setup

1. Check out `docs/map-systems-20261111` in a local clone or disposable test environment.
2. Run `node test.mjs` and `node tests/p0-persistence.mjs`; record Node version, commit SHA, exit codes and logs.
3. Run `python3 -m http.server 8000 --directory dist`, open `http://localhost:8000` in two tabs of the **same browser profile and origin**.
4. Use disposable test saves; export/copy any valuable existing localStorage data before running destructive reset cases.

## Two-tab verification (P0-16, P0-19)

1. Start with a clean test origin. Open tab A, begin mining, wait for save.
2. Open tab B **before** making further changes in A, so B holds an older snapshot.
3. In A, change a target or buy a ball, causing a save.
4. In B, confirm that the storage-change warning appears, play pauses, and no pagehide/autosave overwrites A's newer state.
5. Reload B and confirm it reads A's latest valid save.
6. Repeat with B backgrounded, then foregrounded. Check that a delayed event cannot bypass the pre-save snapshot comparison.
7. Repeat with A and B triggering saves near-simultaneously. **Record any lost update; no atomicity guarantee exists yet.**

## Recovery checks (P0-09 through P0-15)

- Restore from valid automatic backup; ensure restored state persists after reload.
- Try restore with missing and corrupt backups; primary save must remain intact.
- Start new expedition; restore `before-reset` after one or more automatic saves.
- Simulate denied storage via browser settings/devtools, if supported; verify visible error and unchanged persisted data.
- Background/foreground, refresh, pause/resume and dialog open/close. Compare progress and browser console output.

## Evidence template

| Field | Value |
|---|---|
| Tested SHA | pending |
| Browser/version/OS | pending |
| Node test result | pending |
| Two-tab warning | pending |
| Delayed-event check | pending |
| Simultaneous-write result | pending |
| Backup and reset result | pending |
| Screenshots/console log links | pending |
| Reviewer decision | pending |

## Release gates

Do not merge to `main` or deploy until automated tests and browser checks pass, and unresolved simultaneous-write behavior is explicitly accepted or fixed. A `storage` event plus optimistic comparison is **best-effort**, not a cross-tab atomic transaction.
