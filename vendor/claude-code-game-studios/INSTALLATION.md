# Pixeloid installation

Installed 2026-11-11 from https://github.com/Donchitos/Claude-Code-Game-Studios
Pinned commit: `abc0de79d6ceb0b5d7aa693945849b3937afbe6a` (framework 1.3.0). MIT license: LICENSE in this folder.

Imported .claude, studio-tests, design, docs, production and root framework configuration. Upstream .github and src were deliberately excluded to preserve Pixeloid CI and game layout. Original upstream documentation is retained here.

Adaptations: Web code root dist, test root repository root, native Node test/syntax commands, standard rigor, autonomous mode, user-authorized commit/deployment policy, dist removed from ignore patterns. No game files changed.

Use Claude Code from the repository root and run /project-stage-detect followed by /next-step. Claude Code itself must already be installed and authenticated on that computer. This environment has no claude executable, so interactive slash commands and live Claude hook execution are not verified.

For upgrades, compare against the pinned source, retain project.yaml and Pixeloid CLAUDE.md adaptations, and merge settings rather than overwriting. Never copy upstream src or .github over the game.

Validation: existing game tests passed; four game modules passed Node syntax checks; settings JSON parsed; 68 shell scripts passed bash -n; config resolver reports standard/autonomous/Web. Installed 78 skill directories and 49 agents. Game files and Pages workflow match the pre-install commit byte-for-byte.
