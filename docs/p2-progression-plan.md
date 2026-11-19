# P2 — progression and exploration proposal

Status: proposed, not implemented. Release remains blocked on native CI and browser validation.

Baseline: 96×64 grid; 3–12 orbs; 3 types; speed 0–3; reflector, generator, artifact; v1/v2 saves.

## Principles
Preserve current economy and saves. No new currency or random cash purchases. Avoid allocating ten million cells in the current JSON save. Keep the existing map as the first region.

## Stages
- P2-A: show existing excavation progress and next attainable milestone, without changing rewards or save schema.
- P2-B: deterministic region prototypes, distinct material patterns and discoveries. No save migration until compatibility fixtures pass.
- P2-C: evaluate chunked world representation and migration in isolation; measure memory, frame time and save size on mobile. Target ten million logical pixels, not simultaneously rendered cells.
- P2-D: optional region unlocks, permanent progression and non-monetized discovery variation, subject to economy simulation.

## Gates
Existing regression suites must pass; add boundary and reload checks for milestones. No reward mutations in UI rendering. No main merge or public deployment without native CI and real browser verification. Proposed mobile performance goal: stable 30 FPS on a representative low-end device, measured rather than assumed.
