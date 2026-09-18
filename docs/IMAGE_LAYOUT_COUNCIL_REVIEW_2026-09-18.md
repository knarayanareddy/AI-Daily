# Image and layout council review — 2026-09-18

## Question

The candidate edition has one distinct generated illustration per story. The council was asked whether the images were too small, whether their orientation matched their narrative role, and where they should sit without competing with the evidence.

## Research brought to council

The council reviewed current responsive-image guidance and editorial card guidance:

- The responsive-design guidance recommends preserving an explicit aspect ratio to prevent layout shift, using responsive sizing, and using art direction only when the crop materially changes by viewport.
- The University of Maryland design-system guidance recommends consistent card ratios, avoiding text embedded in images, and concise useful alternative text; it lists horizontal 5:4 as one card option.
- The editorial/card guidance reviewed by the council recommends larger consistent landscape media for article cards, with a 3:2 or 16:9 treatment, and warns that image use is not a substitute for a strong text hierarchy.

These sources are guidance, not a mandate. The council also inspected the generated assets: they are landscape images at approximately 1408 by 768 pixels, close to 16:9, so cropping them into a squarer 3:2 frame would remove useful narrative context.

## Council debate

### Option A — keep the current small image

**For:** preserves a text-first briefing, minimizes bandwidth, and leaves more room for the story facts.

**Against:** the 260-pixel cap made distinct illustrations feel like decoration rather than narrative orientation. It also wasted the available landscape resolution on larger screens.

**Disposition:** rejected as too timid for the requested visual treatment.

### Option B — make every image full-bleed and very large

**For:** gives each story a strong visual entry point and uses the generated work.

**Against:** makes ten stories visually heavy, delays the evidence and title, and risks turning a briefing into an image gallery. It also makes mobile scanning longer.

**Disposition:** rejected for the standard story list; retained only as a feature-story direction.

### Option C — responsive landscape hierarchy

**For:** preserves the source orientation, increases standard images to a readable 440-pixel ceiling, gives the lead story a full-width image, gives feature stories a 560-pixel ceiling, and keeps the text-first fallback intact. The fixed 16:9 box reserves space before loading and avoids layout shift.

**Against:** uses more vertical space and slightly more bandwidth.

**Disposition:** adopted.

## Adapted implementation

- Story cards now receive a `priority-*` class from the editorial display priority.
- Standard story images use a responsive 16:9 landscape frame up to 440px wide.
- The lead story uses the full available story-column width up to 720px.
- Feature stories use a middle ceiling up to 560px.
- The evidence drawer uses the same 16:9 orientation for visual continuity.
- `object-fit: cover` and centered positioning preserve a stable frame without introducing arbitrary layout variation.
- Images remain above the story kicker and title, so visual orientation precedes metadata while the evidence facts remain the main reading path.
- Mobile keeps the image full-width and stacked before text; no horizontal compression is introduced.
- Generated illustrations now have concise, story-specific alternative text rather than empty alt text. They remain decorative in relation to the article content, but the alt text identifies their editorial role for users who encounter the image independently.
- Images are still lazy-loaded, asynchronously decoded, and retain the text-first story and Evidence Desk fallback.

## Final council guidance

Use large visuals when they add orientation, not merely volume. Keep one consistent landscape system for this edition; do not mix arbitrary portrait and square crops. If a future source asset is portrait or diagrammatic, create an explicit treatment and test it separately rather than allowing it to distort the story grid.

The public edition remains gated. These changes are committed against the product shell and candidate packet only; yesterday’s approved edition and public archive remain unchanged.
