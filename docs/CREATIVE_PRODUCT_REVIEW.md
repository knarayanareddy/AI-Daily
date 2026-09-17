# Creative product review: novelty, interaction, and the missing 3D layer

**Review date:** 2026-09-17  
**Scope:** current frontend, visual language, editorial format, interaction model, and the planned-but-not-built 3D layer.

## Executive verdict

The criticism is valid. AI Daily is coherent, calm, accessible, and editorially credible, but it is not yet sufficiently quirky, out-of-the-box, or unlike existing AI news products.

The current experience is a polished editorial newsletter interface with a modest graph view: masthead, hero, filters, ranked story list, sidebar card, newsletter CTA, optional map, and evidence drawer. The visual palette has personality, but the product behavior remains familiar.

**The 3D layer is not implemented.** The repository currently contains an SVG/D3 Signal Map only. React Three Fiber was discussed in the plan and deliberately deferred during performance and reliability hardening. That was a reasonable safety decision, but it means the experimental layer is absent rather than progressively enhanced.

## Panel ratings

Fourteen personas reviewed the product: experimental interaction designer, editorial designer, information-visualization designer, WebGL specialist, art director, narrative designer, newsroom editor, skeptical reader, AI researcher, accessibility specialist, performance engineer, trust designer, mobile designer, and product strategist.

| Dimension | Rating | Finding |
|---|---:|---|
| Editorial trust | 8/10 | Evidence Desk, corrections, and fail-closed framing are strong |
| Readability | 8/10 | Clear hierarchy and scanning path |
| Accessibility foundation | 7/10 | Semantic list and keyboard map are good foundations |
| Visual craft | 6/10 | Cohesive, but recognizable editorial-tech styling |
| Distinctiveness | 4/10 | Personality is mostly surface-level |
| Interaction novelty | 3/10 | Filters, drawers, deep links, and graph selection are familiar |
| Content-format novelty | 4/10 | Still mainly headline/dek/source cards |
| Meaningful visualization | 5/10 | Explainable SVG edges, but conventional graph behavior |
| 3D implementation | 0/10 | No React Three Fiber/WebGL layer exists |
| Overall product novelty | 4/10 | Trustworthy prototype, not yet category-defining |

## Debate consensus

### What should change

- Stories should become **auditable signals**, not generic cards.
- Separate **what changed**, **what it affects**, **what is disputed**, and **what proves it**.
- Give relationships typed semantics: same event, corroborates, contradicts, depends on, consequence of.
- Introduce an edition metaphor that changes by day: field notebook, observatory, forensic board, weather map, or transmission console.
- Add an optional guided route called **Follow the disturbance**.
- Make uncertainty and evidence posture visible: verified, corroborated, disputed, developing, corrected.
- Preserve the list as canonical and make visual modes progressive enhancements.

### What should not change

- Do not replace Read mode with a spectacle.
- Do not add a decorative 3D globe or galaxy.
- Do not use particles or an AI avatar as novelty.
- Do not infer editorial relationships silently.
- Do not make 3D the homepage default.
- Do not hide evidence behind an interaction puzzle.

## Consensus execution plan

### Phase 1 — change the content grammar

Add approved, backend-owned fields such as:

```ts
type EditorialSignal = {
  move: string;
  consequence: string;
  tension?: string;
  evidence_posture: 'verified' | 'corroborated' | 'disputed' | 'developing' | 'corrected';
  why_now?: string;
};

type RelationshipKind =
  | 'same_event'
  | 'corroborates'
  | 'contradicts'
  | 'depends_on'
  | 'consequence_of';
```

These must be approved by the backend gate; the frontend must not invent them.

### Phase 2 — redesign Read mode

Keep the current trust hierarchy, but replace generic cards with signal tickets containing:

- a short Move statement;
- a consequence strip;
- visible evidence posture;
- a “pull the thread” action;
- compact source receipts.

### Phase 3 — upgrade 2D Field mode

Use the existing SVG foundation to show relationship semantics, a legend, uncertainty, claim/evidence/consequence filters, and a guided route. Preserve keyboard and list parity.

### Phase 4 — implement optional 3D Signal Field

Use React Three Fiber only after explicit user intent:

- orthographic camera;
- demand rendering;
- capped device pixel ratio;
- no textures or autoplay effects;
- shared graph IDs with SVG/list;
- DOM labels and semantic list fallback;
- reduced-motion and WebGL fallback;
- Evidence Desk selection parity.

Suggested route:

```text
Explore → Field mode → Signal Field
```

3D should explain provenance or consequence. If it only decorates the feed, do not ship it.

### Phase 5 — reader validation

Test five readers and ask:

1. What do the relationships mean?
2. Can you explain why two stories are connected?
3. Can you find supporting evidence without instruction?
4. Does this feel like a new way to inspect news or a decorated feed?
5. Would you use Field mode tomorrow?

## Final decision

Keep the current trust, accessibility, and contract foundation. Add novelty through editorial semantics and tactile provenance, not decorative spectacle. Build a genuinely interactive 2D Field mode first, then an optional 3D Signal Field if it communicates something 2D cannot communicate as clearly.
