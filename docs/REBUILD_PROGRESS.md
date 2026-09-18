# Wholesome rebuild progress

**Current phase:** Phase 5 — validation and production readiness
**Overall rebuild:** approximately 90% complete
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

## Phase 5 validation in progress

### Implementation progress

Approximately 90% complete. Repository-level production checks pass; browser, assistive-technology, and real-device checks remain environment-dependent.

### Completed

- Added `npm run phase5:check` for demand rendering, low-power WebGL, fallback content, reduced motion, accessible story-list parity, Evidence Desk selection, lazy chunking, and initial-bundle isolation.
- Added the Phase 5 check to the daily briefing CI workflow.
- Confirmed the initial bundle is 3D-runtime-free and the 3D chunk is 245.12 KB gzip.
- Confirmed backend tests (12), frontend tests (13), production build, staging release check, and `npm audit --audit-level=high` (zero vulnerabilities).
- Recorded the full validation matrix in `docs/PHASE5_VALIDATION.md`.

### Next step

Run the pending browser/device and staging-canary validation, then decide whether the 3D chunk needs further reduction before release.

### Remaining frontend work

- Browser E2E across Chromium, Firefox/WebKit, including keyboard and focus order.
- NVDA/VoiceOver verification of the canonical Read mode and accessible story list.
- WebGL context-loss, low-memory, mobile battery, and reduced-motion verification on representative devices.
- Human comprehension/novelty review and a 14-edition sampled canary.
- Production-host verification for security headers, caching, RSS, and sitemap behavior.

## Phase 6 — variable editorial treatments

### Implementation progress

Phase 6 is implemented for the 25-story showcase. The public cards no longer force every story through the same Move / Consequence / Tension / Question pattern.

### Completed

- Added typed story treatments, reader actions, sections, priority, and visual modes.
- Assigned all 25 stories across ten treatments: Incident File, Launch Anatomy, Research Note, Power Map, Trade-off, Claim / Counterclaim, Human Receipt, Source Trail, Before / After, and Field Note.
- Added variable card anatomy and treatment labels.
- Added treatment-aware reader actions such as Inspect, Compare, Predict, Trace, Challenge, and Take a Position.
- Preserved the consistent Evidence Desk as the provenance and correction layer.
- Kept the canonical Read list and accessible text path intact.
- Added treatment context to the Evidence Desk.

### Next step

Deploy the Phase 6 showcase artifact and review the rhythm of the 25-story issue as a complete editorial publication.

### Remaining frontend work

- Add section-level navigation and an explicit lead/feature/quick hierarchy.
- Add a text-first Source Trail interaction and one restrained prediction/compare interaction.
- Test whether treatment variation improves comprehension without increasing cognitive load.

## Phase 6 follow-up — additive discoverability and rotation

### Completed

- Recorded the second council review and research-backed failure analysis in `docs/COUNCIL_REVIEW_DISCOVERABILITY.md`.
- Added a visible, plain-language `ON THIS EDITION` guide above the optional modules.
- Added direct links for 25 Signals, Tool Focus, Cool Project, Five-Minute Experiment, and Evidence Desk.
- Added stable section anchors and responsive visible link affordances.
- Recorded a rotation policy and source, moderation, privacy, safety, expiry, and correction requirements for future additives.

### Validation status

Build and automated tests are pending for this follow-up. Public deployment verification is intentionally not claimed until those checks pass.

## Rebuild rule

Only one phase advances at a time. After each phase, update this file with:

- completed checklist items;
- overall percentage;
- validation results;
- unresolved risks;
- the next phase and its acceptance criteria.
