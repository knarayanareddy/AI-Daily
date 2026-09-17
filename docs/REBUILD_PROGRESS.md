# Wholesome rebuild progress

**Current phase:** Phase 4 — optional React Three Fiber Signal Field
**Overall rebuild:** approximately 80% complete
**Last updated:** 2026-09-17

## Phase status

- [x] Phase 1 — Add editorial signal and typed relationship contracts
- [x] Phase 2 — Redesign Read mode around signal tickets
- [x] Phase 3 — Upgrade the 2D Signal Field
- [x] Phase 4 — Implement the optional React Three Fiber Signal Field
- [ ] Phase 5 — Validate novelty, accessibility, performance, and production readiness

## Phase 4 completed

- Added optional React Three Fiber Signal Field.
- Added explicit URL-addressable `mode=signal` Explore state.
- Added lazy-loaded 3D chunk separate from Read mode and 2D mode.
- Added orthographic camera and demand rendering.
- Added deterministic depth positions based on the approved story set.
- Added typed relationship tethers between story nodes.
- Added category-aware signal nodes.
- Added selected-story synchronization with Evidence Desk.
- Added accessible story list equivalent below the canvas.
- Added reduced-motion static notice and no animation loop.
- Added Return to 2D field control.
- Added mobile sizing and a bounded canvas.
- Kept 3D opt-in rather than making it the homepage default.

## Phase 3 completed

- Added typed relationship filtering controls.
- Added relationship legend and visual grammar.
- Added accessible relationship explanation cards.
- Added relationship selection parity with story selection.
- Added contradiction, corroboration, dependency, consequence, and same-event semantics.
- Added Follow the disturbance guided route.
- Added next-signal and inspect-evidence controls.
- Preserved list-only and reduced-motion behavior.
- Added 2D Signal Field interaction and visual snapshot coverage.

## Phase 2 completed

- Redesigned story cards as signal tickets.
- Added visible evidence posture.
- Added Move and Consequence sections.
- Added optional Tension section.
- Added explicit unverified language when approved signal semantics are absent.
- Added “Evidence Desk · Pull the thread” action language.
- Added source receipt counts.
- Added signal-ticket responsive styling and posture states.
- Added signal-ticket test coverage.

## Phase 1 completed

- Added `EvidencePosture` contract.
- Added `EditorialSignal` contract.
- Added typed `RelationshipKind` values.
- Added optional relationship evidence URLs.
- Added frontend normalization for signal posture and legacy relationships.
- Added backend validation for signal fields and relationship semantics.
- Preserved backward compatibility for existing relationship records by normalizing missing kinds to `same_event` during frontend migration.
- Added contract test coverage.

## Next phase

**Phase 5 — Validate novelty, accessibility, performance, and production readiness.**

The next implementation will measure whether the new signal tickets, 2D Field, guided route, and optional 3D lens improve comprehension without harming accessibility, bundle performance, mobile behavior, or editorial trust.

## Rebuild rule

Only one phase advances at a time. After each phase, update this file with:

- completed checklist items;
- overall percentage;
- validation results;
- unresolved risks;
- the next phase and its acceptance criteria.
