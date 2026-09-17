# Frontend implementation plan and design council consensus

## Executive decision

The frontend should evolve from the current dependency-light prototype into a **static-capable React application with a progressive-enhancement visualization layer**. The public reading experience remains the canonical product. The Signal Map is an optional, lazy-loaded interaction; it must never be required to read, navigate, or verify a story.

Recommended shape:

```text
React + TypeScript + static-capable framework
  -> semantic server-rendered/read mode
  -> shared typed edition contract
  -> accessible story drawer
  -> SVG/D3 Signal Map first
  -> lazy React Three Fiber renderer second
  -> static export to CDN
```

This preserves the current visual direction while making the frontend testable, data-driven, and ready for the approved-edition pipeline.

## Multi-persona frontend council

Eight domain experts reviewed the current static site, design research, backend contracts, and canary requirements.

### 1. Editorial product designer

The homepage must answer three questions within seconds: what changed, why does it matter, and where did it come from. Keep the four-to-eight story briefing and avoid turning the site into a dashboard.

**Decision:** Read mode is the default route and the primary completion path.

### 2. Design systems architect

Quirky visual language needs reusable primitives rather than one-off CSS. Define tokens for paper, ink, coral, acid, mono metadata, serif headlines, states, spacing, and motion.

**Decision:** Build a small tokenized system before migrating individual pages.

### 3. Accessibility specialist

Canvas and WebGL are enhancement layers. Every node, drawer action, filter, and relationship must have a semantic DOM equivalent, visible focus state, keyboard path, reduced-motion behavior, and screen-reader label.

**Decision:** The list is the source of truth; SVG and 3D mirror its state.

### 4. Data visualization engineer

A graph only earns its place if edges are defensible. Story relationships must come from shared entities, event clustering, source corroboration, or an explicit editorial link.

**Decision:** Implement a deterministic SVG/D3 map before Three.js and test relationships as data, not pixels.

### 5. React/TypeScript architect

The current inline HTML strings make complex state and safe rendering difficult. Use typed components, runtime validation at the data boundary, URL-addressable state, and a single story-selection model.

**Decision:** Migrate the interaction layer first; preserve a static shell during the transition.

### 6. Web performance engineer

A daily briefing has a strict time-to-content contract. Do not ship Three.js or a large client bundle on the initial route. Lazy-load Explore mode, pause rendering at rest, cap DPR, and use static export/CDN caching.

**Decision:** Initial JavaScript under 90 KB compressed where practical; visualization chunk loaded only on intent.

### 7. Content integrity engineer

Published claims and corrections must render from the same validated edition contract as the backend. The browser must never invent evidence or show a pending review as public.

**Decision:** Reject invalid edition data at the build/data boundary and render last-known-good data on recoverable failure.

### 8. Product analytics/privacy lead

Measure comprehension and trust, not compulsive attention. Instrument map opens, story selections, evidence opens, completion, corrections, and errors without recording reading text or cursor trails.

**Decision:** Privacy-minimal, consent-aware events with a list-only control for the 3D experiment.

## Consensus architecture

### Routes

```text
/                         current edition Read mode
/edition/[date]           immutable edition
/story/[storyId]          deep-linked story detail / share target
/explore                  Signal Map, same edition
/archive                  date-addressable archive
/method                   editorial method and source policy
/ops                      authenticated operations app, separate boundary
```

The first release can implement `/`, `/story/[storyId]`, `/method`, and `/ops`; archive and Explore can follow without changing the data contract.

### Component boundaries

```text
src/
  app/
    layout.tsx
    page.tsx
    edition/[date]/page.tsx
    story/[storyId]/page.tsx
    method/page.tsx
  components/
    layout/SiteHeader
    layout/EditionHeader
    briefing/StoryList
    briefing/StoryCard
    briefing/StoryDrawer
    briefing/ClaimEvidence
    briefing/CorrectionHistory
    briefing/TopicWeather
    explore/SignalMapSvg
    explore/SignalField3d
    explore/StoryListFallback
    archive/EditionRibbon
    ui/Button, Badge, Modal, Toast, Tabs
  lib/
    edition-contract.ts
    data-loader.ts
    relationships.ts
    analytics.ts
    motion.ts
  styles/
    tokens.css
    globals.css
```

### Public data contract

The frontend accepts only a validated approved edition:

```ts
export type Claim = {
  claim: string
  supported: true
  evidence_urls: string[]
  excerpt?: string
}

export type Correction = {
  id: string
  edition_id: string
  story_id: string
  claim: string
  correction: string
  reason: string
  created_at: string
}

export type Story = {
  id: string
  event_id: string
  title: string
  dek: string
  source: string
  url: string
  category: 'research' | 'product' | 'policy' | 'society' | 'compute'
  published_at: string
  claims: Claim[]
  corrections: Correction[]
  related_sources: string[]
  relationships: Relationship[]
}
```

Runtime validation must happen before rendering. Invalid public data shows a calm last-known-good/error state and never renders arbitrary HTML.

## Layout plan

### Read mode

1. Utility rail: edition date, health, last updated, subscribe.
2. Masthead: AI Daily identity and navigation.
3. Field report: title, topic weather, edition count, update time.
4. Feature story: one high-value lead with why-now context.
5. Four-signal list: scannable cards with source, time, category, and Evidence Desk action.
6. Signal trail invitation: optional three-story guided route.
7. Method/provenance section: how sources and reviewers work.
8. Footer: archive, RSS, method, corrections contact.

### Story detail

A story detail route and drawer share the same component and state. It contains:

- What changed
- Why it matters
- Source and timestamp
- Claims checked
- Evidence excerpts and outbound links
- Reviewer consensus summary
- Related event cluster
- Correction history
- Report-correction action

### Explore mode

- Default 2D SVG map with labels and text list fallback.
- One node per approved event cluster.
- Edges only for explainable relationships.
- Focus opens the same StoryDrawer.
- URL state supports `?story=...&view=explore`.
- WebGL is opt-in and lazy-loaded after user intent.

## State and interaction rules

Use one shared state model:

```text
edition
selectedStoryId
viewMode: read | explore
activeTopic
searchQuery
drawerOpen
reducedMotion
mapFocus
```

Rules:

- Browser Back closes a drawer before leaving the edition.
- A story selection is deep-linkable and shareable.
- Refresh preserves the selected story and view mode from the URL.
- Search and filters update both list and map.
- A map focus always has a list equivalent.
- No important action depends on hover.
- `Escape` closes drawers and menus.
- `Tab` reaches every story, evidence link, correction, and map control.

## Signal Map implementation

### Phase 1: SVG/D3

- Derive graph from approved `relationships[]`.
- Use deterministic radial/force layout seeded by `event_id`.
- Render semantic SVG labels and buttons.
- Keep a synchronized story list.
- Add relationship explanation on focus.
- Test graph data and keyboard behavior independently from layout.

### Phase 2: React Three Fiber

- [x] Lazy import only after Explore intent.
- Reuse the same graph coordinates and semantic IDs.
- Orthographic camera, no textures, capped DPR 1.5.
- Instanced low-poly nodes and shared materials.
- Demand rendering; pause hidden or reduced-motion scenes.
- Render labels in DOM/CSS, not only in WebGL.
- Provide Reset view, Return to list, and reduced-motion controls.
- Fall back to SVG on WebGL failure, low-memory devices, and mobile by default.

## Accessibility checklist

- [ ] WCAG 2.2 AA color and focus contrast.
- [ ] Semantic headings with one page-level `h1`.
- [ ] Story cards are keyboard-accessible links/buttons.
- [ ] Evidence links identify their destination/source.
- [ ] Claims use readable text, not color alone.
- [ ] Corrections use a visible label and history text.
- [ ] Drawer traps focus and returns focus to its trigger.
- [ ] SVG nodes expose names, roles, and relationships.
- [ ] WebGL has a complete DOM list alternative.
- [x] `prefers-reduced-motion` removes camera and decorative motion for the SVG map.
- [ ] Screen-reader announcement for filter and route changes.
- [ ] Touch targets meet minimum size.
- [ ] No autoplay audio or hover-only information.

## Performance and reliability budget

- First contentful paint under 1.5 seconds on a mid-tier mobile device.
- Initial client JavaScript under 90 KB compressed where practical.
- Visualization chunk loaded only on Explore intent (current implementation uses D3/SVG).
- No layout shift from fonts, drawers, or map initialization.
- Static pages served with immutable hashed assets.
- Approved edition JSON cached with a last-known-good fallback.
- WebGL pixel ratio capped at 1.5.
- Render loop paused when hidden or at rest.
- Image assets avoided unless evidence/editorial value justifies them.

## Analytics and privacy

Event names:

```text
edition_view
story_open
claim_evidence_open
correction_open
explore_open
map_story_select
signal_trail_step
edition_complete
frontend_error
webgl_fallback
```

Do not collect article text, cursor paths, keystrokes, or raw search queries. Respect consent, provide an opt-out, and aggregate by edition/date where possible.

## Implementation milestones

### Frontend 0 — contract and shell

- [x] Add TypeScript and a static-capable React build.
- [x] Add runtime edition validation.
- [x] Port tokens and visual primitives from current CSS.
- [x] Render current edition server/static-first.
- [x] Keep the existing HTML fallback until parity is verified.

### Frontend 1 — story trust layer

- [x] Implement StoryCard and StoryDrawer.
- [x] Render claims, excerpts, sources, and corrections.
- [x] Add story deep links and browser history behavior.
- [x] Add loading, empty, stale, and invalid-data states.
- [x] Add unit and accessibility-oriented component tests.

### Frontend 2 — SVG exploration

- [x] Add relationships to the edition contract.
- [x] Implement deterministic SVG SignalMap.
- [x] Synchronize map, list, search, filters, and drawer.
- [x] Test keyboard behavior and accessible list fallback.
- [ ] Run a list-only control comparison.

### Frontend 3 — 3D enhancement

- [ ] Lazy-load React Three Fiber.
- [ ] Add WebGL capability and performance checks.
- [ ] Match SVG semantic selection state.
- [ ] Add demand rendering and fallback behavior.
- [ ] Verify mobile battery and low-end performance.

### Frontend 4 — production polish

- [x] Add immutable edition routes.
- [ ] Add archive and RSS/sitemap views.
- [ ] Add privacy-minimal analytics.
- [ ] Add visual regression and end-to-end tests.
- [ ] Run Lighthouse and accessibility audits.
- [ ] Include frontend checks in the 14-edition canary.

## Test plan

- Unit: contract validation, relationships, filters, date formatting, corrections.
- Component: StoryCard, Drawer focus management, evidence links, error states.
- Integration: edition load, story deep link, operator-approved corrections.
- Browser: keyboard-only flow, mobile layout, reduced motion, WebGL fallback.
- Visual: tokens, typography, drawer, map/list parity.
- Performance: initial bundle, map chunk, frame rate, hidden-tab pause.
- Security: URL scheme sanitization, safe text rendering, CSP, no secret exposure.

## Definition of done

- [ ] Reader can complete the edition without JavaScript, WebGL, or Explore mode.
- [ ] Every public claim exposes evidence or is blocked before rendering.
- [ ] Corrections are visible and historically preserved.
- [ ] All routes have loading, empty, stale, error, and last-known-good states.
- [ ] Map and list have identical story selection behavior.
- [ ] Keyboard and screen-reader flows pass.
- [ ] Frontend error rate and performance budgets pass in staging.
- [ ] Frontend canary checks run for all 14 production canary editions.

## Council consensus

The council recommends shipping the trust layer before the spectacle: migrate the reading experience and evidence drawer first, prove the static/SVG experience, then add 3D as an intentional optional lens. This is the best balance of distinctiveness, accessibility, performance, and editorial credibility.
