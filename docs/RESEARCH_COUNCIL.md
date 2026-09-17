# Research council: established patterns and the revised execution plan

Date researched: 2026-09-17. This is a product and technology scan, not a claim that any competitor's internal process is fully public.

## What was studied

The council examined established AI/news products and relevant implementation frameworks:

- **Techmeme:** a shared, editor-assisted front page. The distinctive pattern is not merely aggregation; it is clustering related coverage into one story conversation, with importance ranking and a chronological stream. See [Techmeme's model described by ZDNET](https://www.zdnet.com/article/why-techmeme-is-still-every-tech-pros-go-to-news-source-after-20-years/) and the [Techmeme scraper's structured description](https://apify.com/parseforge/techmeme-scraper).
- **TLDR AI:** tight, repeatable bullet summaries organized into stable sections, useful as a benchmark for scanability. A recent comparison describes a headline, short summary, and direct link format. See [Dupple's comparison](https://dupple.com/learn/best-ai-news-sources).
- **The Batch:** a small number of curated stories, concise context, plain language, and practical implications. Its official description emphasizes curation, brevity, clarity, practical value, and expert perspective. See [The Batch](https://www.deeplearning.ai/the-batch/about).
- **Import AI / Latent Space / Ben's Bites:** differentiated lenses rather than generic “all AI” coverage: policy/research, builder/engineering, and founder/product. A product should make its lens explicit rather than pretending to be neutral by default. See [Daily.dev's source comparison](https://daily.dev/blog/best-ai-news-sources/).
- **D3:** a low-level, web-native toolkit that works with SVG and Canvas and provides control over data joins and dynamic transitions. It is a better first proof for this product's story graph than WebGL. See [D3's official overview](https://d3js.org/what-is-d3).
- **React Three Fiber:** useful when 3D is genuinely part of a React UI, but its guidance stresses avoiding object recreation, using demand rendering, and instancing. See the [official performance guidance](https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance) and [pitfalls guide](https://docs.pmnd.rs/react-three-fiber/advanced/pitfalls).
- **Next.js static export:** allows a static-first site that can later be upgraded to server features, while the output remains hostable on a CDN. See [Next.js static exports](https://nextjs.org/docs/13/app/building-your-application/deploying/static-exports).
- **GitHub Actions schedule:** suitable for a lightweight prototype, but scheduled runs use UTC, can be delayed during high load, and run from the default branch. See [GitHub's schedule documentation](https://docs.github.com/en/enterprise-cloud@latest/actions/reference/workflows-and-actions/events-that-trigger-workflows).

## Twelve research agents and findings

### 1. Competitive editor

**Finding:** established winners have a narrow editorial contract: speed and bullets (TLDR), practical application (The Rundown), engineering depth (Latent Space), policy/research context (Import AI), or a shared front page (Techmeme).

**Recommendation:** AI Daily should own the “evidence-linked daily field report” position: four to eight consequential signals, each with an explicit why-now and provenance trail.

### 2. News clustering specialist

**Finding:** one event covered by six outlets should be one story with six perspectives, not six cards. Clustering is both a quality feature and a bandwidth feature.

**Recommendation:** make an `event_cluster` first-class in the data model. Preserve each source article beneath it and rank the primary evidence separately from commentary.

### 3. Newsletter editor

**Finding:** repeatable sections reduce cognitive load. Novelty should live in the interaction and editorial voice, not in an unpredictable information architecture.

**Recommendation:** keep the four-signal daily structure; use “Field report,” “Why now,” and “What to watch” as durable labels.

### 4. Source licensing researcher

**Finding:** headlines and summaries from external publishers create attribution, robots, terms-of-service, and takedown concerns. RSS availability is not blanket republication permission.

**Recommendation:** store short factual summaries and links, not scraped full text; maintain source-specific retention and attribution rules; provide correction and removal contact.

### 5. Data visualization researcher

**Finding:** D3 provides the right semantic layer for relationships, labels, SVG fallback, and testability. WebGL is a rendering option, not the information architecture.

**Recommendation:** implement the constellation as a deterministic 2D SVG graph first. Only add a 3D renderer after selection, labels, keyboard traversal, and mobile fallback work.

### 6. WebGL performance engineer

**Finding:** continuous render loops waste battery when the field is at rest. Three.js/R3F guidance favors on-demand rendering, reuse, and instancing.

**Recommendation:** cap device pixel ratio, pause hidden tabs, render on interaction, use instanced geometry, and keep the scene to a few dozen nodes.

### 7. Accessibility auditor

**Finding:** a canvas visualization can be a delightful secondary view but cannot be the source of meaning. A DOM list must be the canonical interaction model.

**Recommendation:** map and list share selection state; every node has a labelled button equivalent; reduced motion removes camera movement and transitions.

### 8. Mobile product designer

**Finding:** small screens punish side-by-side dashboards and hover interactions.

**Recommendation:** mobile opens in Read mode, uses a horizontally scrollable topic ribbon, and offers a 2D map sheet only after an explicit Explore action.

### 9. Archive product researcher

**Finding:** established players gain trust from continuity: predictable cadence, accessible past editions, and visible correction history.

**Recommendation:** make every edition immutable and addressable by date; corrections append a history entry; add a later archive ribbon rather than shipping it in v1.

### 10. Audio/content strategist

**Finding:** audio can extend a briefing, but autoplay and audio-only comprehension are hostile to accessibility and quick scanning.

**Recommendation:** defer audio to phase 3, make it transcript-first, and author a 90-second script from published stories rather than synthesize arbitrary article text.

### 11. Platform architect

**Finding:** static output is a strong fit for a daily immutable edition. A repo-based cron is convenient but not a durable production scheduler: scheduled workflows may be delayed, disabled for inactive public repositories, and run only from the default branch.

**Recommendation:** prototype with Actions; graduate collection/review to a managed scheduler or durable workflow service once freshness and alerting matter. Keep the frontend deployable as static assets.

### 12. Measurement and growth researcher

**Finding:** time-on-page rewards the wrong behavior for a briefing. The meaningful metrics are completion, saves, source clicks, correction rate, false negatives, and map-to-story selection.

**Recommendation:** instrument explicit, privacy-minimal events; do not record article text or cursor trails. A/B test map presence against a list-only control.

## Debate: should the original design council integrate these findings?

### Objections

- **Art director:** clustering and evidence metadata could make the experience feel like a compliance dashboard.
- **Generative artist:** a 2D-first approach may undercut the one-of-a-kind ambition.
- **Behavioral scientist:** a visible map may increase exploration but also distract from the daily stop point.
- **Systems designer:** adding clusters, archives, audio, and 3D at once is scope creep.

### Replies

- **Newsroom editor:** the evidence trail belongs in the drawer, not the headline surface. Trust can be quiet and still be available.
- **Accessibility specialist:** 2D-first does not make the experience less novel; it ensures the novel layer is usable by everyone.
- **Creative technologist:** 3D becomes more special when it is an intentional Explore mode rather than wallpaper.
- **Product manager:** clustering is not scope creep; it is the quality primitive that makes the constellation truthful. Archive and audio can wait.

### New consensus

All previous design agents agree to revise the plan:

1. **Retain:** Daily Observatory, editorial-first hierarchy, optional Signal Map, Signal Trail, observability, reduced-motion fallback.
2. **Promote to core:** event clustering, multi-source coverage view, why-now explanations, immutable editions, correction history, explicit lens/source provenance.
3. **Defer:** audio, archive ribbon, personalized feeds, WebXR, generative per-story artwork.
4. **Change the stack:** use a framework with a typed data model and testable components for the interaction layer; keep the output statically deployable. Use D3/SVG for the first map and add React Three Fiber only as a lazy renderer when the 2D interaction passes.
5. **Change the cron posture:** GitHub Actions is a canary collector, not the long-term guarantee. Add failure alerts and a last-known-good edition now; migrate the scheduler later if the audience depends on exact delivery.

## Revised, executable product plan

### Release 0 — safe editorial prototype

**Goal:** prove that people understand the four-signal brief.

- Keep the current static reading shell.
- Add typed schemas for `Edition`, `EventCluster`, `Source`, `Claim`, `Evidence`, `Review`, and `Correction`.
- Change the worker flow to `raw candidates → clusters → review queue → approved edition`.
- Add schema validation, idempotency keys, source attribution, and a no-publish-on-error rule.
- Keep the existing UI fallback stories until reviewed data is available.

### Release 1 — signature 2D Signal Map

**Goal:** make relationships useful before making them 3D.

- Build `SignalMap` with SVG and D3 force or deterministic radial layout.
- Add a list/map toggle and a story drawer.
- Encode only defensible relationships: shared entity, same event, source corroboration, or explicit editorial link.
- Add keyboard navigation, focus management, text alternative, reduced motion, and mobile sheet.
- Run a list-only control test.

### Release 2 — tasteful 3D enhancement

**Goal:** add depth without making WebGL a requirement.

- Lazy-load React Three Fiber only after Explore is selected and WebGL is available.
- Reuse the same graph coordinates and semantic labels from SVG.
- Use an orthographic camera, instanced nodes, demand rendering, capped DPR, and no textures.
- Stop rendering at rest, on hidden tabs, and in reduced-motion mode.
- Provide “Return to list” and “Reset field” controls in the scene.

### Release 3 — trusted depth

**Goal:** make the product defensible and habit-forming.

- Add source comparison inside the drawer.
- Add claim-level evidence excerpts.
- Add correction history and date-addressable editions.
- Add a manually authored three-step Signal Trail.
- Add archive ribbon only after the daily brief is stable.
- Add transcript-first audio last.

## Recommended technical shape

```text
apps/web (static-capable React framework)
  app/edition/[date]        immutable edition route
  components/ReadBrief      canonical accessible view
  components/SignalMap      SVG/D3 renderer + list fallback
  components/SignalField3D  lazy R3F renderer
  components/StoryDrawer    evidence + relationships
  lib/schema                runtime validation + typed contracts

workers/briefing
  fetch -> normalize -> cluster -> review -> gate -> publish

data/
  sources.json
  candidates/{run-id}.json  immutable intermediate
  editions/{date}.json      immutable approved output
  current.json              pointer to last-known-good edition
```

### Decision

The best integrated plan is not “a news site with a 3D hero.” It is an evidence-first event-clustering product with a calm reading mode and an optional 3D lens. This is more novel than a card grid, more useful than decorative WebGL, and safer to ship incrementally.
