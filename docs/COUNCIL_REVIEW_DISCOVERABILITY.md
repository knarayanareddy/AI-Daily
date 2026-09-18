# Council review: discoverability and rotating additives

Date: 2026-09-18

## User-reported failure

The Tool Focus and Cool Project features were technically present but not reliably findable. A reader had to ask where they were. Signal-number references were useful provenance but poor information scent: they did not communicate that the edition contained a second, optional editorial lane.

## Research and debate

The council revisited guidance on tables of contents, in-page links, scannability, recurring newsletter features, and interactive journalism. The consistent recommendation was a visible, above-the-fold contents surface with plain labels, direct links, exact heading/anchor consistency, and restrained visual separation. Tabs and generic “More” or “Explore” labels were rejected because they hide parallel content or underspecify the destination.

Decision: add an **On this edition** guide before the modules and expose only the additive formats present in the current payload. Keep the 25 Signals list canonical, keep Evidence Desk as the provenance layer, and make the guide static, text-first, keyboard reachable, and useful with scripting disabled.

## Implemented remedy

- Added a visible `ON THIS EDITION` navigation strip.
- Added direct links to 25 Signals, Tool Focus, Cool Project, Five-Minute Experiment, and Evidence Desk.
- Added stable anchors to the briefing and all three modules.
- Kept related signal numbers as secondary context rather than the primary label.
- Added responsive wrapping/grid behavior and visible hover/focus affordances.
- Kept the existing modules optional: absent payload fields produce no empty navigation item or decorative placeholder.

## Additive rotation policy

The publication should select a small editorial set per edition rather than render every possible feature. Slot order remains predictable; treatment rotates according to the story and available evidence.

| Candidate | Use when | Required evidence / guardrail |
| --- | --- | --- |
| What changed since yesterday | A consequential update has a clear prior state | Link to both dated states; no implication of change without a source |
| One chart / one number | One measured fact clarifies scale or trend | Named source, date, unit, denominator, and uncertainty where relevant |
| Builder watch | A project has a meaningful public artifact or release | Primary project source, maintainer context, no hype-ranking or endorsement language |
| Reader field note | A reader observation adds situated context | Explicit consent, remove identifying details, editor moderation, no sensitive incident reports without a safe route |
| Decision log | Editorial policy or publication choice changed | Date, owner, rationale, and what would change the decision |
| Source trail | A claim has a useful research path | Primary sources first, preserve corrections, disclose inaccessible/paywalled links |
| Try this safely | A bounded, reversible reader test teaches something | Safety review, no personal data, no production credentials, stop condition, and plain fallback |
| Open question | Evidence is incomplete or genuinely contested | State what is known, unknown, and what evidence would resolve it; never manufacture both sides |

Every future additive must specify source ownership, moderation owner, privacy boundary, safety posture, expiry/removal rule, and a correction path before entering a publication payload. Autonomous generation may propose candidates but must not publish unreviewed candidates.

## Acceptance check

The redesign is successful only after production build, tests, checksum/staging validation, deployment, and public verification of the 25-story edition and these links. Browser/device validation remains separate and is not claimed here.
