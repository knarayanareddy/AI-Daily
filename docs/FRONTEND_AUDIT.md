# Frontend reliability and accessibility audit

## Completed in this pass

- Skip link targets the briefing content.
- Theme and map controls use explicit button types and accessible names.
- The SVG map retains an equivalent keyboard-accessible story list.
- Story-list selection exposes `aria-pressed` state.
- Explore layout is responsive at the 800px mobile breakpoint.
- Archive, RSS, and sitemap presentation are available as static, crawlable documents.
- The production bundle keeps the visualization in a separate Explore chunk.

## Verification checklist

- [x] Keyboard navigation reaches primary navigation, filters, stories, map controls, drawer controls, and footer links.
- [x] Reduced-motion users receive a deterministic static map and the full story list.
- [x] Map selection and list selection invoke the same story action.
- [x] Loading, stale, fallback, and immutable-edition error states remain explicit.
- [x] Mobile map uses a fluid SVG and single-column story controls.
- [x] Automated visual regression baseline for the Signal Map structure.
- [ ] Real-device battery and low-end mobile measurements.
- [ ] Production host verification for RSS and sitemap absolute URLs.
