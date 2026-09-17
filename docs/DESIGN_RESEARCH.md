# AI Daily: design council and interaction plan

## Brief

Make a daily AI briefing feel like a **small observatory**, not another news grid. The product should reward curiosity, make relationships between stories legible, and still deliver a fast, calm reading path. Novelty must come from the editorial interaction model—not decoration layered on top of cards.

## The 12-person design council

The council was asked to propose a direction ranging from conservative to radical, then attack each other's ideas for usability, accessibility, performance, and editorial integrity.

### 1. The Swiss editor — conservative

Use a precise single-column reading spine, generous margins, and typography as the identity. Put the unusual interaction in a progressive-enhancement “signal map” rather than making the whole homepage unfamiliar.

### 2. The information architect — systems thinker

The core object should be a **story constellation**: each story has topic, source, confidence, and relationship edges. A graph is more useful than a category tab if it remains explainable and has a list fallback.

### 3. The generative artist — radical

Turn the day's changing topics into a living 3D field. Research stories orbit slowly; policy stories form heavier nodes; a cluster expands when the reader focuses it. Never use random motion: every movement must encode data.

### 4. The newspaper designer — editorial traditionalist

Lead with one “front-page” story, then a vertical sequence. A briefing should have rhythm and hierarchy, not an app dashboard. Keep source, timestamp, and why-it-matters close to every claim.

### 5. The game designer — playful

Add a five-minute **signal trail**: readers connect three stories and see the shared underlying shift. This creates exploration without points, streaks, or gamification pressure.

### 6. The accessibility specialist — hard constraint

A canvas must never be the only way to understand the briefing. Respect reduced motion, provide a keyboard-navigable list and text labels, preserve contrast, support screen readers, and avoid hover-only discovery.

### 7. The creative technologist — 3D specialist

Use Three.js only for one hero-level visualization, lazy-loaded after first paint. Use instanced meshes, a fixed camera, capped device pixel ratio, and CSS fallback. No 3D article cards, no WebGL behind readable text.

### 8. The behavioral scientist — attention skeptic

Do not turn a news product into an infinite toy. Add clear stopping points: “4 stories made the cut,” a daily completion state, and an optional deeper exploration mode. Motion should clarify uncertainty and connections, not induce scrolling.

### 9. The archivist

The archive should feel like a time machine: a horizontal “day ribbon” with topic density changing over time. Allow comparison of two dates and show corrections as visible history, never silent edits.

### 10. The audio producer

Offer a 90-second “morning transmission” with a waveform that highlights the story currently being read. Make it optional and transcript-first; never autoplay.

### 11. The skeptical product manager

Ship one distinctive moment, not eight. Test the signal map with static SVG before investing in WebGL. Define success as story comprehension, return visits, saves, and correction rate—not time-on-page.

### 12. The art director

The visual language should combine dark observatory ink, warm paper, acid chartreuse, coral warnings, mono metadata, and an editorial serif. Quirk comes from labels and transitions: “signal strength,” “orbiting this story,” “under review”—not novelty fonts everywhere.

## Round 1: ideas considered

| Direction | Delight | Risk | Decision |
|---|---:|---:|---|
| Refined editorial briefing | Medium | Low | Keep as the reading spine |
| Full 3D news galaxy | High | Very high | Reject as default; too distracting |
| Story constellation map | High | Medium | Adopt as the signature interaction |
| Daily story trail | High | Medium | Adopt as an optional guided mode |
| Timeline time machine | High | Medium | Adopt in archive phase |
| Audio transmission | Medium | Medium | Phase 2 enhancement |
| AI-generated visual art per story | Medium | High | Reject; ornamental and expensive |
| Infinite personalized feed | Medium | High | Reject; conflicts with editorial selectivity |

## Final direction: “The Daily Observatory”

The page has two modes that share the same data model:

1. **Read mode** — a calm, editorial briefing that works immediately and is fully accessible.
2. **Explore mode** — a “Signal Map” where the day's 4–8 approved stories form a small 3D constellation. Selecting a node opens the same story detail drawer as the list view.

The 3D map is not a background. It is an explorable index of editorial relationships.

### What makes it one of a kind

- **Story gravity:** related stories attract each other; unrelated stories remain visibly separate. The relationship is backed by shared entities/topics, not invented prose.
- **Confidence halo:** an outer ring communicates review confidence; a striped ring means “under review,” and it cannot appear in the public map.
- **Source orbit:** source logos/text orbit only on focus, making provenance part of the visual language.
- **The “why now?” thread:** selecting two nodes draws a line and opens the evidence-backed connection between them.
- **Signal trail:** a guided three-step route through the day's most consequential shift, with a dismissible text version.
- **Daily weather, not a score:** the header shows topic mix as a tactile barometric strip—research, product, policy, society—never a single “AI score.”
- **Archive ribbon:** past editions become a thin time ribbon; topic colors accumulate, and a date can be selected without leaving the page.

## Proposed page structure

```text
┌────────────────────────────────────────────────────────────┐
│ utility rail: edition · last updated · subscribe            │
├────────────────────────────────────────────────────────────┤
│ AI DAILY       Briefing   Signal Map   Archive   Method     │
├────────────────────────────────────────────────────────────┤
│ TODAY'S FIELD REPORT                         [play audio]  │
│ “The signal in AI.”   4 stories made the cut               │
│ topic weather strip · edition health · UTC timestamp       │
├────────────────────────────────────────────────────────────┤
│ [READ] [EXPLORE THE FIELD]                                  │
│                                                            │
│  FEATURE STORY                    SIGNAL MAP               │
│  why it matters                  3D constellation          │
│  source / evidence               keyboard + list fallback  │
├────────────────────────────────────────────────────────────┤
│ THE FOUR SIGNALS                                              │
│ 01 story card      02 story card      03 story card        │
│ 04 story card / “notable miss” / correction marker          │
├────────────────────────────────────────────────────────────┤
│ FOLLOW A SIGNAL TRAIL: 1 → 2 → 3                           │
├────────────────────────────────────────────────────────────┤
│ archive ribbon · editorial method · newsletter              │
└────────────────────────────────────────────────────────────┘
```

### Story detail drawer

Every node/card opens a consistent drawer, not a new visual treatment:

- one-sentence headline
- “what changed” and “why it matters”
- source, publication time, source tier
- evidence excerpts and links
- reviewer consensus and disagreement note
- related story nodes
- save/share/correction action

## Interaction specification

### Signal Map

- First paint: static SVG preview with labelled nodes; do not block reading on WebGL.
- On idle or explicit “Explore”: dynamically import Three.js.
- Nodes are instanced low-poly spheres or rings, not heavy models.
- Camera is orthographic, slowly settles once, then stops. No perpetual motion.
- Pointer hover enlarges a node by 1.08× and shows a label; click/tap opens drawer.
- Drag rotates the field; wheel/pinch zoom is capped. “Reset view” is always present.
- `Tab` moves through a hidden-but-visible-on-focus story list; Enter selects; arrow keys move between connected nodes.
- `prefers-reduced-motion: reduce` renders the same graph as SVG with no camera motion.
- Mobile defaults to a 2D radial map; 3D is opt-in after a “Try the field” tap.

### Signal trail

- One route per edition, authored from story relationships—not generated solely by a model.
- Each step states the editorial reason for the transition.
- Progress is three dots, never points or a streak.
- The full trail is rendered as normal text below the animation.

### Quirky but useful microcopy

- Empty search: “No signal here. Try another frequency.”
- Loading: “Tuning the field…”
- Correction: “We changed this signal.”
- Source provenance: “Where this came from.”
- Review state: “The panel is still arguing.” (never shown for public stories)

## Technical implementation plan

### Phase 0 — foundation

1. Keep the current HTML/CSS reading mode as the no-JS baseline.
2. Normalize the public story schema with `id`, `relationships`, `topic`, `evidence`, `review`, `published_at`, and `correction_history`.
3. Add a `viewMode` state (`read | explore`) and URL deep links such as `?story=abc&view=explore`.
4. Add Playwright or browser smoke tests for filters, keyboard navigation, reduced motion, and empty states.

### Phase 1 — signature interaction

1. Build the map using SVG first with a deterministic force layout.
2. Add accessible labels, focus rings, and a text list synchronized with map selection.
3. Add Three.js as a lazy-loaded optional renderer; keep the same node/edge data model.
4. Use `three`, `OrbitControls`, `InstancedMesh`, `Raycaster`, and `CSS2DRenderer` only where needed. Do not add a global 3D scene.
5. Instrument map open rate, story selection rate, map-to-story conversion, and errors. Respect consent and do not record reading content.

### Phase 2 — depth

1. Add evidence-aware story drawers and the authored signal trail.
2. Add archive ribbon and side-by-side edition comparison.
3. Add transcript-first audio briefing.
4. Add correction history and a public “how this changed” view.

### Performance budget

- First contentful paint target: under 1.5 seconds on mid-tier mobile.
- Initial JS budget: under 90 KB compressed before the map chunk.
- Three.js chunk: lazy, under 180 KB compressed where practical.
- Never download textures or models for the briefing.
- Cap renderer pixel ratio at 1.5 and pause rendering when the tab is hidden.
- Avoid canvas on low-memory or reduced-motion devices.

## Success criteria

- Readers understand the top story and its evidence without opening the map.
- At least 30% of engaged readers try Explore, without reducing story completion.
- Map users select a story rather than merely orbiting the visualization.
- Keyboard and screen-reader users can access every story and relationship.
- No measurable increase in bounce rate, layout shift, or mobile battery complaints.
- Corrections are discoverable and trust metrics improve over time.

## Council consensus

The council unanimously recommends the **Daily Observatory** direction: editorial reading first, one meaningful 3D constellation as an optional explorable index, and a transparent evidence/story relationship model underneath. A fully 3D homepage, generative decoration, infinite feed, or gamified streak system was rejected as distraction or a trust risk.
