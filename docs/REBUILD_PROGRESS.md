# Wholesome rebuild progress

**Current phase:** Phase 3 — 2D Signal Field  
**Overall rebuild:** approximately 60% complete  
**Last updated:** 2026-09-17

## Phase status

- [x] Phase 1 — Add editorial signal and typed relationship contracts
- [x] Phase 2 — Redesign Read mode around signal tickets
- [x] Phase 3 — Upgrade the 2D Signal Field
- [ ] Phase 4 — Implement the optional React Three Fiber Signal Field
- [ ] Phase 5 — Validate novelty, accessibility, performance, and production readiness

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

**Phase 4 — Implement the optional React Three Fiber Signal Field.**

The next implementation will add an explicit opt-in 3D lens over the approved graph. It must remain lazy-loaded, demand-rendered, reduced-motion safe, accessible through the canonical list, and useful for provenance or consequence rather than decoration.

## Rebuild rule

Only one phase advances at a time. After each phase, update this file with:

- completed checklist items;
- overall percentage;
- validation results;
- unresolved risks;
- the next phase and its acceptance criteria.
