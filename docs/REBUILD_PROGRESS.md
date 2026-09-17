# Wholesome rebuild progress

**Current phase:** Phase 2 — signal-ticket Read mode  
**Overall rebuild:** approximately 40% complete  
**Last updated:** 2026-09-17

## Phase status

- [x] Phase 1 — Add editorial signal and typed relationship contracts
- [x] Phase 2 — Redesign Read mode around signal tickets
- [ ] Phase 3 — Upgrade the 2D Signal Field
- [ ] Phase 4 — Implement the optional React Three Fiber Signal Field
- [ ] Phase 5 — Validate novelty, accessibility, performance, and production readiness

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

**Phase 3 — Upgrade the 2D Signal Field.**

The next implementation will add typed relationship rendering, a legend, relationship explanations, tension/corroboration controls, and the optional Follow the disturbance route. Read mode remains the canonical, fast, accessible path.

## Rebuild rule

Only one phase advances at a time. After each phase, update this file with:

- completed checklist items;
- overall percentage;
- validation results;
- unresolved risks;
- the next phase and its acceptance criteria.
