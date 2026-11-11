# Claude Code Game Studios -- Game Studio Agent Architecture

Indie game development managed through 49 coordinated Claude Code subagents.
Each agent owns a specific domain, enforcing separation of concerns and quality.

## Technology Stack

- **Engine**: Web — Canvas 2D
- **Language**: JavaScript ES modules (.mjs)
- **Version Control**: Git with trunk-based development
- **Build System**: Static dist/; no bundler
- **Asset Pipeline**: Static dist/; no bundler

> **Note**: Engine-specialist agents exist for Godot, Unity, and Unreal with
> dedicated sub-specialists. Use the set matching your engine.

## Project Structure

@.claude/docs/directory-structure.md

## Engine Version Reference

<!-- ENGINE-REFERENCE-IMPORT: the line under this comment is engine-specific,
     and there is none until an engine is set. /setup-engine, the grow's record
     step and /project-settings (engine.name) write
     @docs/engine-reference/<engine>/VERSION.md here for the chosen engine. Skills
     that need the pinned version read that file on demand either way. -->


## Technical Preferences

`project.yaml` at the repo root is the primary config store — engine, specialists,
naming, platform, performance, modes. Skills resolve it via `resolve_config`
(see `.claude/docs/config-resolution.md`).

`.claude/docs/technical-preferences.md` is the **legacy fallback**, read on demand
when a key is absent from `project.yaml`. It is not imported here: before
`/setup-engine` runs it is almost entirely `[TO BE CONFIGURED]` placeholders, and
after it runs `project.yaml` holds the real values.

## Coordination Rules

@.claude/docs/coordination-rules.md

## Collaboration Protocol

Follow the user's authorized task through implementation and verification. The user has explicitly requested a commit and deployment after every completed task; no repeated approval is needed for those actions. Report implementation, commit, deployment and actual play/visual verification separately. Ask only for missing consequential decisions or destructive actions outside the authorized scope.

## Pixeloid integration

- Preserve the existing game in `dist/` and tests in `test.mjs`; do not scaffold a replacement or migrate frameworks automatically.
- Run `node test.mjs` and the syntax checks in `project.yaml` before committing.
- The existing GitHub Actions workflow publishes only `dist/` to GitHub Pages.
- Preserve version 2 saves and version 1 migration (`pixeloid-demo-v1`).
- Android is a planned target, not an existing build. Do not report it as shipped.
- Existing-project entry: `/project-stage-detect`, then `/next-step`; `/start` should retain this code and configuration.
- Local project instructions and explicit user authorization take precedence over generic template collaboration examples.

> **First session?** Say "make me a game" (`/prototype`), or run `/start` to begin
> the guided onboarding flow.

## Coding Standards

@.claude/docs/coding-standards.md

## Context Management

@MEMORY.md

Read `.claude/docs/context-management.md` on demand — it is a reference, not
session context. Two of its conventions are load-bearing and cited by name
elsewhere in the repo, so they are restated here rather than lost:

- **`production/session-state/active.md` is the session checkpoint.** The file is
  the memory, not the conversation. Read it first after any compaction, crash, or
  `/clear`.
- **Helpers in `.claude/scripts/` emit observations, never verdicts.** A script
  that scores or judges will eventually contradict a mode or override it cannot
  see. (Cited by `artifact-check.sh` and `adr-dep-graph.sh`.)
