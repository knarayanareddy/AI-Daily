# AI Daily — Wholesome product design and remediation plan

**Status:** consensus design document  
**Date:** 2026-09-17  
**Inputs:** creative product review, production-readiness review v2, frontend plan, backend plan, editorial system, canary runbook, and current implementation.

## 1. Purpose

AI Daily should become a genuinely distinctive, evidence-first way to understand an accelerating field without becoming a noisy dashboard or a decorative AI spectacle.

The current implementation already has valuable foundations:

- approved-edition contracts;
- fail-closed publication intent;
- evidence drawer and corrections;
- accessible story list;
- lazy SVG/D3 Explore mode;
- reduced-motion behavior;
- operational review concepts;
- static-capable delivery.

The drawbacks are equally clear:

- the public layout still resembles a polished newsletter;
- story cards do not expose consequence, tension, or evidence posture early enough;
- the current map is a conventional node-and-edge graph;
- the planned 3D layer is absent;
- visual novelty and editorial semantics are not yet connected;
- deployment and human-canary evidence remain incomplete.

This document turns those findings into one executable, cross-disciplinary plan.

## 2. Multi-agent council consensus

The design council consists of 14 personas:

1. Experimental interaction designer
2. Editorial product designer
3. Information-visualization designer
4. Creative technologist / WebGL specialist
5. Digital art director
6. Narrative designer
7. Newsroom editor
8. Skeptical reader
9. AI researcher
10. Accessibility specialist
11. Performance engineer
12. Trust and provenance designer
13. Mobile interaction designer
14. Product strategist

### Consensus statement

> Make AI Daily feel like an **auditable field instrument**, not another AI news feed. The product should let readers follow a disturbance from event to evidence to consequence, while remaining as easy to read as a daily briefing.

### Non-negotiable constraints

- Read mode remains the fastest and safest completion path.
- Novelty must improve comprehension or verification, not merely decoration.
- The list remains the canonical accessible representation.
- No relationship is shown as fact unless it is typed, sourced, and approved.
- No 3D is loaded on the initial route.
- No unreviewed candidate is exposed publicly.
- Reduced-motion, low-memory, mobile, and assistive-technology users receive complete functionality.
- Every public transformation must have a plain-language explanation.

## 3. Product concept

### Working name: The Signal Field

Each edition is a small field of approved signals. A signal has:

1. **Move** — what changed.
2. **Consequence** — what it may alter.
3. **Tension** — what is disputed, uncertain, or developing.
4. **Receipt** — what evidence supports the claim.
5. **Thread** — how it relates to other approved signals.

The interface uses an edition-specific instrument metaphor, but the content contract remains stable. Possible metaphors include:

- **Observatory:** signals as objects in a time horizon.
- **Forensic board:** claims, sources, and contradictions as evidence cards.
- **Weather station:** pressure, turbulence, and calm represent uncertainty and change, never truth by color alone.
- **Field notebook:** annotated entries, source receipts, and editorial marginalia.
- **Transmission console:** incoming signals, corroboration paths, and unresolved noise.

The metaphor changes atmosphere and interaction grammar, not editorial standards.

## 4. Information architecture

### Primary routes

```text
/                         Read mode, current approved edition
/edition/:date             Immutable approved edition
/story/:storyId            Deep-linked story / Evidence Desk
/explore                   2D Signal Field
/explore?mode=signal       Optional 3D Signal Field
/archive                   Approved edition archive
/method                    Editorial method, evidence, and source policy
/ops                       Authenticated operator boundary
```

### Read mode

The reader should understand the edition without opening Explore:

- What moved today?
- Why does it matter?
- How confident is the evidence?
- What should I inspect next?

### Explore mode

Explore is a second lens over the same approved data:

- 2D SVG is the default enhancement.
- 3D is an explicit opt-in mode.
- List, Field, and Signal modes share IDs and selection state.
- The Evidence Desk is the same component everywhere.

## 5. Content and data contract remediation

### 5.1 Editorial signal contract

Add backend-approved fields:

```ts
type EvidencePosture =
  | 'verified'
  | 'corroborated'
  | 'disputed'
  | 'developing'
  | 'corrected';

type EditorialSignal = {
  move: string;
  consequence: string;
  tension?: string;
  why_now?: string;
  evidence_posture: EvidencePosture;
};
```

Checklist:

- [ ] Add the fields to the backend schema.
- [ ] Require `move` to describe an observable change.
- [ ] Require `consequence` to distinguish fact from editorial implication.
- [ ] Require `tension` for disputed or developing stories.
- [ ] Require `evidence_posture` to be selected by the review gate.
- [ ] Reject missing or invented frontend fields.
- [ ] Add fixture editions for every evidence posture.
- [ ] Render posture as text plus icon/shape, never color alone.
- [ ] Expose posture in RSS/archive metadata where appropriate.

### 5.2 Relationship contract

Replace the free-form relationship reason with typed semantics:

```ts
type RelationshipKind =
  | 'same_event'
  | 'corroborates'
  | 'contradicts'
  | 'depends_on'
  | 'consequence_of';

type Relationship = {
  from_story_id: string;
  to_story_id: string;
  kind: RelationshipKind;
  reason: string;
  evidence_urls: string[];
};
```

Checklist:

- [ ] Require a valid relationship kind.
- [ ] Require at least one supporting evidence URL for non-trivial relationships.
- [ ] Validate both story IDs exist in the edition.
- [ ] Reject self-links unless explicitly allowed for a documented reason.
- [ ] Detect duplicate and contradictory relationship records.
- [ ] Preserve relationship provenance in the review artifact.
- [ ] Show a plain-language “Why is this connected?” explanation.
- [ ] Add relationship-specific fixtures and gate tests.

### 5.3 Editorial signal ticket

Replace generic cards with a signal ticket containing:

- signal number;
- move statement;
- consequence strip;
- evidence posture;
- source receipt count;
- pull-the-thread action;
- correction indicator;
- optional tension statement.

Checklist:

- [ ] Design the ticket in Read mode.
- [ ] Design a no-JavaScript/static equivalent.
- [ ] Verify the ticket at 320px width.
- [ ] Ensure the title remains a useful share target.
- [ ] Keep source/time/category visible without hover.
- [ ] Keep evidence posture visible before drawer open.
- [ ] Avoid ranking signals solely by model confidence or engagement.

## 6. Visual design system

### Stable tokens

Keep the current paper/ink/coral/acid/mono/serif foundation, but formalize:

- `--signal-verified`
- `--signal-corroborated`
- `--signal-disputed`
- `--signal-developing`
- `--signal-corrected`
- `--relationship-same-event`
- `--relationship-corroborates`
- `--relationship-contradicts`
- `--relationship-depends`
- `--relationship-consequence`

Checklist:

- [ ] Define tokens centrally.
- [ ] Verify contrast in light and dark themes.
- [ ] Add non-color indicators.
- [ ] Define focus, hover, selected, disabled, loading, stale, fallback, and error states.
- [ ] Define reduced-motion variants for every animated component.
- [ ] Define mobile spacing and hit-area tokens.
- [ ] Define typography fallback behavior and layout reservations.

### Edition atmosphere

Checklist:

- [ ] Choose one metaphor for the first redesigned edition.
- [ ] Keep the metaphor subordinate to the editorial content.
- [ ] Document what each visual symbol means.
- [ ] Provide a visible legend.
- [ ] Provide a “Why this visual?” explanation.
- [ ] Test whether a first-time reader understands it without coaching.
- [ ] Do not use atmosphere to imply certainty or importance.

## 7. 2D Signal Field redesign

The current SVG/D3 map is the correct technical foundation. It needs a stronger visual grammar.

### Relationship visual grammar

- solid thread: same event;
- braided thread: independent corroboration;
- broken thread: unresolved contradiction;
- directional arrow: dependency or consequence;
- halo: uncertainty or developing evidence;
- receipt mark: source-backed relationship.

Checklist:

- [ ] Add a legend.
- [ ] Add typed relationship rendering.
- [ ] Add keyboard-accessible relationship explanations.
- [ ] Add “show only corroboration” and “show tensions” controls.
- [ ] Add a guided **Follow the disturbance** route.
- [ ] Keep the accessible list synchronized.
- [ ] Keep URL state synchronized.
- [ ] Add relationship selection parity tests.
- [ ] Add large-graph degradation behavior.
- [ ] Add a list-only mode that completely hides the visual canvas.

### Follow the disturbance

The optional guided route should reveal:

1. the initial signal;
2. source corroboration;
3. disagreement or uncertainty;
4. consequence or dependency;
5. the unresolved question.

Checklist:

- [ ] Make the route optional and skippable.
- [ ] Add step count and progress text.
- [ ] Allow keyboard and swipe navigation.
- [ ] Make each step deep-linkable.
- [ ] Allow the reader to jump directly to the Evidence Desk.
- [ ] Never hide the complete story list behind the route.

## 8. Optional 3D Signal Field

### Product role

3D is not a homepage replacement. It is a deeper exploration mode for readers who want to inspect relationships and consequence horizons.

### Interaction model

- depth: consequence/time horizon, explicitly labeled;
- orbit: approved event cluster;
- tether: typed relationship;
- light/halo: evidence posture, never importance alone;
- focus: opens the same Evidence Desk;
- hover-only information: prohibited;
- camera movement: optional and disabled for reduced motion.

### Technical checklist

- [ ] Add React Three Fiber only to the Explore/Signal chunk.
- [ ] Use an orthographic camera.
- [ ] Use demand rendering.
- [ ] Cap device pixel ratio.
- [ ] Cap node, edge, label, and geometry counts.
- [ ] Avoid per-frame React state updates.
- [ ] Reuse geometry and materials.
- [ ] Pause when hidden with `IntersectionObserver`.
- [ ] Pause when the document is hidden.
- [ ] Respect `prefers-reduced-motion`.
- [ ] Provide WebGL failure fallback.
- [ ] Provide low-memory/mobile fallback to 2D.
- [ ] Provide complete DOM/list equivalent.
- [ ] Keep story IDs and selection state synchronized with SVG.
- [ ] Add bundle-size and chunk-latency budgets.
- [ ] Add a WebGL context-loss recovery path.
- [ ] Test keyboard focus and screen-reader announcements.

### 3D launch gate

Do not ship 3D unless user testing demonstrates that it helps readers answer at least one of these better than 2D:

- Why are these events related?
- Which evidence corroborates this signal?
- What consequence does this development connect to?
- Where is the uncertainty or disagreement?

## 9. Evidence Desk remediation

Checklist:

- [ ] Show Move, Consequence, Tension, and Receipt sections.
- [ ] Show evidence posture in the drawer heading.
- [ ] Never synthesize a supported claim when claims are absent.
- [ ] Label fallback/unverified content explicitly.
- [ ] Show source timestamps and review timestamps.
- [ ] Show relationship explanation and evidence.
- [ ] Show correction history prominently.
- [ ] Add report-correction action.
- [ ] Restore focus to the originating control on close.
- [ ] Announce drawer open/close and selection changes.
- [ ] Verify outbound URL schemes are HTTPS.

## 10. Accessibility checklist

- [ ] Read mode works without Explore.
- [ ] Full story list is available without SVG or WebGL.
- [ ] All controls have accessible names.
- [ ] All states are conveyed without color alone.
- [ ] Focus order follows editorial reading order.
- [ ] Focus-visible styles pass contrast checks.
- [ ] Drawer traps focus and restores focus.
- [ ] SVG nodes expose names, roles, and selection state.
- [ ] Relationship explanations are available in text.
- [ ] Live regions announce filter, route, and selection changes.
- [ ] Touch targets meet the project minimum.
- [ ] 200% zoom remains usable.
- [ ] Reduced motion removes camera and decorative movement.
- [ ] Screen-reader testing passes on NVDA/Firefox or VoiceOver/Safari.
- [ ] Automated axe checks run against a browser build.

## 11. Performance and resilience checklist

- [ ] Initial Read bundle remains within budget.
- [ ] SVG/3D chunks load only after intent.
- [ ] Fonts do not cause layout shift.
- [ ] Map rendering pauses when hidden.
- [ ] Document-hidden state pauses visual work.
- [ ] Large graph gracefully switches to list mode.
- [ ] Publication pointer is the atomic read boundary.
- [ ] Versioned artifacts are immutable.
- [ ] Publication checksums are verified.
- [ ] Crash-after-pointer tests pass.
- [ ] Backup and restore drills pass.
- [ ] CDN cache behavior is documented.
- [ ] Stale/fallback/error states are observable.
- [ ] Browser console is clean in primary flows.
- [ ] LCP, CLS, INP, memory, and chunk latency are recorded.

## 12. Backend and editorial gate checklist

- [ ] Every new editorial signal field is schema-validated.
- [ ] Relationship semantics are reviewable and provenance-backed.
- [ ] High-impact topics always escalate to humans.
- [ ] Reviewer/provider/model/prompt provenance is retained.
- [ ] Correlated model votes are not treated as independent evidence.
- [ ] External provider data-use policy is documented.
- [ ] Source license and robots decisions persist with candidates.
- [ ] Corrections are durable, attributable, and visible.
- [ ] Retention and deletion jobs are scheduled.
- [ ] Kill switch and rollback are rehearsed.
- [ ] Operator actions are rate-limited, same-origin, authenticated, and audited.
- [ ] Production host and canonical URLs are configured.
- [ ] 14-edition canary is complete before autonomous publishing.

## 13. Testing and research plan

### Automated

- [ ] Contract tests for new signal fields.
- [ ] Relationship graph property tests.
- [ ] Security URL and scheme tests.
- [ ] Publication atomicity and idempotency tests.
- [ ] Visual snapshot tests for signal tickets and 2D Field mode.
- [ ] Browser E2E for Read, Explore, drawer, deep links, errors, and reduced motion.
- [ ] Accessibility axe checks.
- [ ] Performance budget checks.
- [ ] Dependency, SBOM, and secret checks.

### Human research

- [ ] Five-reader comprehension test.
- [ ] Five-reader novelty test.
- [ ] Accessibility review with assistive technology.
- [ ] Mobile task completion test.
- [ ] Editorial trust test: can users distinguish verified, disputed, and developing?
- [ ] 3D usefulness test before implementation is considered successful.

### Research questions

- [ ] Do readers understand typed relationship lines?
- [ ] Does the metaphor help or distract?
- [ ] Does “Follow the disturbance” improve comprehension?
- [ ] Does 3D reveal something 2D does not?
- [ ] Do readers trust evidence more when receipts are visible earlier?
- [ ] Can a reader complete the briefing without Explore?

## 14. Rollout sequence

### Release A — semantic foundation

- [ ] Add signal and relationship contracts.
- [ ] Update backend review/gate artifacts.
- [ ] Add fixtures and tests.
- [ ] Keep current UI as fallback.

### Release B — signal-ticket Read mode

- [ ] Ship Move/Consequence/Tension/Receipt cards.
- [ ] Add evidence posture.
- [ ] Add correction and provenance affordances.
- [ ] Run comprehension and trust tests.

### Release C — 2D Field mode

- [ ] Add typed relationship grammar.
- [ ] Add Follow the disturbance.
- [ ] Add list-only controls.
- [ ] Run accessibility and mobile validation.

### Release D — optional 3D experiment

- [ ] Implement Signal Field behind an explicit opt-in.
- [ ] Validate chunk and frame budgets.
- [ ] Validate WebGL fallback and reduced motion.
- [ ] Run novelty and usefulness research.
- [ ] Keep 3D disabled if it does not improve understanding.

### Release E — production canary

- [ ] Complete deployment verification.
- [ ] Complete failure and restore drills.
- [ ] Run 14 human-sampled editions.
- [ ] Review incidents and corrections.
- [ ] Make a written autonomous-publishing decision.

## 15. Definition of done

The product is considered wholesome and release-ready only when:

- [ ] A first-time reader can understand the edition without instruction.
- [ ] The interface feels distinctive because of its behavior and editorial grammar, not only its colors.
- [ ] Every visual relationship has an explanation and provenance.
- [ ] The 2D/list experience is complete without WebGL.
- [ ] 3D, if shipped, creates measurable understanding rather than decoration.
- [ ] Evidence posture and uncertainty are visible early.
- [ ] Claims, relationships, corrections, and source provenance pass backend validation.
- [ ] Keyboard, screen-reader, reduced-motion, mobile, and low-memory paths are complete.
- [ ] Initial Read mode remains fast and stable.
- [ ] Publication is atomic, idempotent, recoverable, and auditable.
- [ ] Security headers and deployment policies are verified on the real host.
- [ ] The 14-edition canary passes with human sampling.
- [ ] The release owner signs off on unresolved residual risk.
