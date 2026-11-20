#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
git submodule sync --
git submodule update --init --recursive -- third_party/gamedev/awesome-gamedev-agent-skills third_party/gamedev/claude-code-game-studios third_party/gamedev/claude-gamedev-kit third_party/gamedev/dream-loop third_party/gamedev/plinkfx third_party/gamedev/pixelfx
echo "Pinned game-development source checkouts:"
git submodule status -- third_party/gamedev/awesome-gamedev-agent-skills third_party/gamedev/claude-code-game-studios third_party/gamedev/claude-gamedev-kit third_party/gamedev/dream-loop third_party/gamedev/plinkfx third_party/gamedev/pixelfx
echo "Activation is opt-in; consult docs/gamedev-toolchain-install.md."
