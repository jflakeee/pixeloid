# External game-development tools (isolated)

Registered as **Git submodules**, each locked to an inspected upstream main commit on 2026-11-20. Project gameplay, existing Claude Game Studios files, `main`, and public build remain unchanged. Submodules are references until fetched by a checkout (not vendored or auto-executed).

## Local installation

```bash
git switch chore/install-gamedev-toolchain-20261120
bash scripts/setup-gamedev-toolchain.sh
```

This fetches the six pinned sources without automatically executing third-party commands, modifying the existing `.claude` settings, or installing npm packages.

| Repository | Git SHA | Role | License |
|---|---|---|---|
| [gamedev-skills/awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills) | `c6ca6c41c839b68319ffc08430b99ab768debc32` | AI game-dev skill library | Apache-2.0 |
| [Donchitos/Claude-Code-Game-Studios](https://github.com/Donchitos/Claude-Code-Game-Studios) | `abc0de79d6ceb0b5d7aa693945849b3937afbe6a` | Claude Code game development framework | MIT |
| [dudwns0921/claude-gamedev-kit](https://github.com/dudwns0921/claude-gamedev-kit) | `86b5b6ddd33a542ef4ca1cc2de067feb82763cc2` | separate Claude Code orchestration plugin | MIT |
| [achimala/dream-loop](https://github.com/achimala/dream-loop) | `9bddb901f7d071cfefdd21e264267c757177a9df` | visual feedback agent skill | MIT |
| [maximilianfeix/plinkfx](https://github.com/maximilianfeix/plinkfx) | `7e5f6a477037679a29df9c5141e9853b1267e7d8` | code-based sound effects | MIT (SFX CC0 claimed upstream) |
| [patch-gg/pixelfx](https://github.com/patch-gg/pixelfx) | `5294518ce7c72e48b6100a744596e0acf57f2826` | code-based pixel VFX | MIT (some gallery assets excluded) |


## Activation (opt-in, in a compatible local agent)

- Existing Pixeloid already contains `.claude/` and `vendor/claude-code-game-studios/`. Do not overwrite those without a diff/upgrade review. The new upstream checkout is only for reference or a staged upgrade.
- Awesome skills: `npx skills add gamedev-skills/awesome-gamedev-agent-skills`. This may modify the agent-specific skills directory; select relevant web-game skills instead of enabling every engine.
- Claude gamedev kit: `claude plugin marketplace add dudwns0921/claude-gamedev-kit` then `claude plugin install gamedev-kit@claude-gamedev-kit --scope project`. It may conflict in workflow ownership with the existing Game Studios, so activate only one coordinator after review.
- Dream loop: `npx skills add achimala/dream-loop`. Needs vision/image generation; Blender optional for 3D.
- PlinkFX: `npm i plinkfx` in a standalone build workspace with npm, not in the current static `dist` runtime until integration design is reviewed.
- PixelFX: use its `skills/pixelfx/SKILL.md` and `tools/render.mjs` in an isolated workspace. Follow upstream instructions if opting in to Patch CLI (not installed by this change).

## Safety and verification

- No network or scripts execute automatically on game launch.
- Keep original license files inside each checkout. Audit external scripts before running them.
- `git submodule status` verifies pinned commits. `git -C third_party/gamedev/<name> rev-parse HEAD` confirms each installed source.
- GitHub Actions and browser tests are separate from installation status. No claim of deployment, game integration, or actual sound/VFX support until verified.
