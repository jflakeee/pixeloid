# Pixeloid FX lab (isolated)

Experimental visual/audio preview, **not integrated into the live Pixeloid game**.

From this directory run `npm install --no-package-lock && npm run build` then serve `build/` over HTTP. Uses the pinned PixelFX Git submodule source and PlinkFX 0.3.0 npm package. No external runtime CDN. Do not copy the built output to `dist/` or deploy without browser/mobile verification. 

The build script expects `third_party/gamedev/pixelfx` to be initialized from the repository root. Audio is user-gesture gated and muted by default only when the user presses the mute button. The canvas is an effects preview rather than a gameplay integration.

Licenses: PixelFX MIT (including Hugo Duprez adaptations as marked in upstream files); PlinkFX MIT and CC0-1.0 per upstream package metadata. Keep upstream notices when redistributing.
