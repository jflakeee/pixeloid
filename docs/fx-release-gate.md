# FX release candidate checklist

Branch: `chore/install-gamedev-toolchain-20261120`. The public `main` and Pages deployment must remain unchanged until a release is explicitly approved.

## Build

The static game loads `dist/fx-runtime.mjs` dynamically. It is **not committed to the source branch**; the GitHub Actions workflow builds it from the pinned PixelFX source and PlinkFX npm package. A checkout of this branch without a build therefore falls back to the legacy game effect. Deploy **the CI `pixeloid-fx-release-candidate` artifact**, not a raw repository checkout.

## Automated gate

- Six pinned submodules and licenses checked.
- Existing game regressions and P0 persistence checks passed.
- PixelFX and PlinkFX bundle compiled; bundle size under 1.5 MB.
- Mobile Chromium loads the game and bundle; isolated FX lab checks both buttons.
- 345 synthetic animation frames test repeated hit/reward/win calls without JavaScript errors and with a 10-second timeout.
- `dist/` release candidate is packaged only after all checks pass.

## Before public deployment

1. Inspect mobile screenshot and interact with the candidate in a staging origin.
2. Verify actual excavation and reward transitions visually, plus audio on a user gesture.
3. Test save/reload, old v1/v2 saves, multi-tab writer protection, storage failures and pause/resume.
4. Measure FPS, memory, audio and thermal behavior on a physical low-end Android device.
5. Obtain approval to merge/deploy; retain rollback to the previous Pages build.

**Known limitations:** Synthetic Chromium animation frames do not measure actual device FPS; the browser test verifies bundle loading and direct FX calls, not a complete end-to-end mining session. CI success is not production deployment success.
