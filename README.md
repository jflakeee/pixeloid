# Pixeloid · 잠든 수로

Standalone browser prototype for an Android-bound mining game. All runtime assets are in dist; no runtime packages or build step are required.

## Run
Serve `dist/` with a local static server. ES modules require HTTP, not file://.

## Check
`node test.mjs`

The check covers single-award destruction, purchases, simulation, save decoding, device states and a synthetic full objective route. It is not a performance benchmark or normal-play completion-time measurement.

## Sample scope
96×64 fixed map, 3 immediately available ball types, 3–12 balls, per-type target guidance and selective group relocation, upgrades, reflector, generator, artifact completion, browser-local saves, pause/resume, pointer pan/pinch/zoom. Target assistance, generator range effects, initial unlocks and speed are intentionally simplified versus the design document.

## Version 0.2
Mobile single-screen controls, growth/device sheets that pause play, mixed ball composition, v1 save migration and backup protection.

## GitHub Pages
The deployment workflow tests the game and publishes `dist/`. In repository Settings → Pages, select GitHub Actions as the source.

## Android plan
Reuse bundled dist assets with Capacitor; add native app lifecycle/back handling and native durable saves. No Android binary or native wrapper has been built. Verify target SDK and Play requirements at submission. No analytics, ads, external fonts, third-party runtime media or account system are included.
