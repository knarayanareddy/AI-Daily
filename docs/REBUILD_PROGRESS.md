# Wholesome rebuild progress

**Current phase:** Phase 1 — semantic foundation  
**Overall rebuild:** approximately 20% complete  
**Last updated:** 2026-09-17

## Phase status

- [x] Phase 1 — Add editorial signal and typed relationship contracts
- [ ] Phase 2 — Redesign Read mode around signal tickets
- [ ] Phase 3 — Upgrade the 2D Signal Field
- [ ] Phase 4 — Implement the optional React Three Fiber Signal Field
- [ ] Phase 5 — Validate novelty, accessibility, performance, and production readiness

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

**Phase 2 — Redesign Read mode around signal tickets.**

The next implementation will introduce the Move, Consequence, Tension, Receipt, and evidence-posture presentation without adding 3D yet. Read mode remains the canonical, fast, accessible path.

## Rebuild rule

Only one phase advances at a time. After each phase, update this file with:

- completed checklist items;
- overall percentage;
- validation results;
- unresolved risks;
- the next phase and its acceptance criteria.
