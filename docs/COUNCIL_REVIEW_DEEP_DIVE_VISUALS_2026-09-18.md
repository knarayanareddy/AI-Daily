# Council review: making the Deep Dive visual, inspectable, and less text-heavy

**Decision:** adapt the Deep Dive into a visual evidence board, not a decorative magazine spread.

## Research basis

The council reviewed accessible data-visualization guidance and applied the repository’s existing text-first constraint:

- Charts should have a takeaway title, direct labels, sufficient contrast, concise alternative text, and a nearby text summary. The underlying values should remain available as a table or explicit text. See the accessibility guidance from the University of Alabama: https://accessibility.ua.edu/accessibilityresources/accessible-data-visualizations/
- Complex visuals should not be the only route to meaning. The A11Y Collective recommends a text summary and a structured data table for complex charts: https://www.a11y-collective.com/blog/accessible-charts/
- Storytelling with Data recommends alternative text that states the chart type, data, and takeaway; direct labels; contrast; and whitespace: https://www.storytellingwithdata.com/blog/accessible-data-viz
- Journalism visualization guidance favors choosing the chart that fits the data, keeping it uncluttered, adding context and annotations, checking the data and source, and testing with varied audiences: https://www.yellowbrick.co/blog/journalism/mastering-data-visualization-in-journalism-expert-tips-techniques

## Personas and debate

### Lina — visual journalist

**Position:** The present module asks readers to process four dense paragraphs before they can see the shape of the argument. Lead with a visual question: “What moved, by how much, and according to whom?”

**Guardrail:** Do not manufacture a trend from two points. A large number card needs its denominator, date, and limitation in the same visual block.

### Omar — data editor

**Position:** Use a small evidence board: two to four stat cards, one simple bar or timeline when the data supports comparison, and a source snippet only when exact wording matters.

**Guardrail:** Never compare incompatible units on one axis. The 26% share, approximately 30,000 agents, and 6% compute allocation should be separate cards, not one chart pretending they are commensurable.

### Priya — fact checker

**Position:** Every visual is a claim. Source, retrieval date, unit, time window, denominator, and limitation must be adjacent to the number.

**Guardrail:** A visual must not make a company-reported figure look independently verified. Use “Anthropic reports” in the label where necessary.

### Marta — accessibility editor

**Position:** Keep the article understandable with CSS disabled, without color, without hover, and through a screen reader. Use semantic `figure`, `figcaption`, headings, direct labels, and a text alternative.

**Guardrail:** The graph cannot be the only representation. Do not rely on coral versus green, animation, or interactive tooltips.

### Theo — narrative editor

**Position:** The visual should advance the story rather than repeat the prose. Arrange the sequence as: visual answer, record, pressure test, point of view, open question.

**Guardrail:** Avoid “data theatre”: no animated counters, fake dashboards, 3D charts, or decorative timelines that imply more certainty than the evidence contains.

### Safiya — expert and social-source editor

**Position:** Snippets can show the language behind a claim, while expert cards can add interpretation. Neither should be used as a visual substitute for an evidence trail.

**Guardrail:** Short excerpts must be exact, attributed, linked, and contextualized. X/Twitter posts should not be embedded by default; a static link and retrieval record are more durable and less tracking-dependent.

### Rafael — product editor

**Position:** Use progressive disclosure: summary cards first, sections second, source trail last. The reader should understand the main point in 20 seconds and be able to inspect the record in five minutes.

**Guardrail:** Keep the module optional and no more than one per edition. A visual redesign must not turn the daily briefing into a dashboard.

## Debate outcomes

### What belongs above the fold?

**Decision:** A short question, one-sentence answer, and a row of two to four evidence cards. The cards can be numbers, a simple comparison bar, or a small timeline depending on the source shape.

### Should we add graphs to every Deep Dive?

**Decision:** No. A graph is appropriate only when it reveals comparison, change over time, or distribution. Otherwise use a stat card or a source snippet. An unsupported graph is worse than text.

### Should we use screenshots or social embeds?

**Decision:** No by default. Use short source snippets in semantic blockquotes with author/source, context, and original link. Use a social embed only when the post itself is the subject and a static fallback is present. Never make the reader’s understanding depend on a platform embed.

### Should expert opinions be visualized as a “panel”?

**Decision:** No simulated panel. Use two to four labeled perspective cards, each with role, relevance, verification, conflict note, and source links. The backstage personas remain invisible reviewers.

### How much visual density is right?

**Decision:** One visual board, four items maximum; two snippet cards maximum above the detailed sections. The board should scan quickly but not flatten the evidence hierarchy.

## Adopted design

The Deep Dive now supports:

1. **Evidence cards:** prominent value, unit, label, source, and limitation.
2. **Simple bars:** only for compatible values with explicit maximum and labels.
3. **Images:** optional and only when they add place, object, or process context; no text embedded in generated art.
4. **Source snippets:** short exact excerpts with source label, context, and link.
5. **Text-first fallback:** all descriptions and values remain in semantic HTML and prose.
6. **No color-only encoding:** values have labels and text; bars are not the sole carrier of meaning.
7. **Responsive layout:** cards stack on mobile; no hover-only information.

For today’s local Edition 187 preview, the Deep Dive visual board uses Anthropic’s reported AI-led R&D data as separate cards: 26% Claude-led measured R&D, approximately 30,000 concurrent agents, 6% reported safety-compute allocation, and a simple February-to-August comparison. The source snippets are limited to two short excerpts from Anthropic’s primary measurement page.

## Authoring protocol

Before drafting prose:

1. Choose the one question and one visual takeaway.
2. Extract only values that share enough context to be compared.
3. Write the caption and limitation before styling the card.
4. Attach a primary source and retrieval timestamp to every visual.
5. Add a text alternative and source-data representation.
6. Add snippets only when exact wording changes the interpretation.
7. Have the evidence and accessibility personas review the visual separately from the prose.
8. Render the point of view after the evidence board, not before it.

The visual layer is an explanatory instrument, not a confidence amplifier.
