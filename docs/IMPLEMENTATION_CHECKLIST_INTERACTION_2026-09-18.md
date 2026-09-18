# Interaction implementation checklist — 2026-09-18

## Operating rule

This checklist is opened before implementation. Each task has a start gate and an end gate. The same council team oversees the work by role; no persona is allowed to self-approve an issue it raised without a second persona checking the result.

## Council roster and cross-review assignments

- **Managing editor:** scope, importance, no feature sprawl. Cross-check: audience editor.
- **Evidence editor:** claims, source role, correction path. Cross-check: subject-matter editor.
- **Subject-matter editor:** domain fit and limitations. Cross-check: evidence editor.
- **Social verification editor:** provenance and expert/source status. Cross-check: independence editor.
- **Public-interest and harm editor:** privacy, safety, manipulation, vulnerable users. Cross-check: accessibility/product editor.
- **Accessibility and product editor:** keyboard, screen reader, text fallback, optionality. Cross-check: performance engineer.
- **Audio editor:** transcript and future audio implications. Cross-check: managing editor.
- **Independence and rights editor:** consent, copyright, conflicts, platform dependence. Cross-check: social verification editor.
- **Audience editor:** clarity, usefulness, comprehension. Cross-check: managing editor.
- **Performance engineer:** bundle, local storage, failure modes, no new network dependency. Cross-check: accessibility/product editor.

## Phase 0 — governance and scope

### Start gate

- [x] Existing Evidence Desk remains canonical.
- [x] Interaction is optional and has a static/text fallback.
- [x] No public comments, rankings, streaks, points, or gamification.
- [x] No autonomous publishing or unmoderated reader content.
- [x] Local-only interactions are clearly labeled as local-only.
- [x] Shelved browser, mobile, screen-reader, and WebGL tracks remain shelved.

### End gate

- [x] The implementation scope is limited to Claim Lens and private/local reader actions.
- [x] Compare-with-yesterday is rendered only when an approved relationship/delta exists; no invented historical context.
- [x] Server-side feedback submission is not implied.
- [x] No new third-party tracking or social embed dependency was introduced.

## Phase 1 — Claim Lens

### Start gate

- [x] Claim Lens will expose existing claim data only.
- [x] It will show source URLs, excerpts, posture, and limitations without inventing evidence.
- [x] It will work with keyboard and text-only rendering.
- [x] It will not alter the approved story or claim.

### End gate

- [x] Each claim can be expanded independently.
- [x] Evidence links remain direct and inspectable.
- [x] Empty evidence has an explicit fallback state.
- [x] The reader can close the lens without losing story context.
- [x] Fact-checker and accessibility review completed through tests and static inspection.

## Phase 2 — private reader agency

### Start gate

- [x] Save, notes, challenges, and forecasts remain browser-local.
- [x] No reader text is sent to the server.
- [x] The UI states that local feedback is not submitted to editors.
- [x] Private forecast is not a public ranking or truth signal.
- [x] Data is keyed by edition and story event to avoid cross-edition confusion.

### End gate

- [x] Save for later persists and can be removed.
- [x] A reader can record what would change their mind.
- [x] A reader can record a private forecast with a resolution date.
- [x] Local storage failures do not break the drawer.
- [x] Public story content does not change based on local interactions.

## Phase 3 — moderated participation

### Start gate

- [ ] Define a real editor intake endpoint and retention policy.
- [ ] Define abuse, privacy, and takedown handling.
- [ ] Define response ownership and correction SLA.
- [ ] Define how accepted reports become immutable corrections.

### End gate

- [ ] Not implemented in this pass. No public submission is exposed.

## Phase 4 — audio adaptation

### Start gate

- [ ] Approve a narrator/guest policy.
- [ ] Require an approved text source and transcript.
- [ ] Define audio correction and takedown behavior.

### End gate

- [ ] Not implemented in this pass. No audio was generated or published.

## Final council sign-off

- [x] Managing editor: scope stayed bounded.
- [x] Evidence editor: no generated evidence or claims were added by interaction code.
- [x] Subject-matter editor: no new domain assertion was introduced.
- [x] Social verification editor: no social embed or unverified expert content was introduced.
- [x] Public-interest editor: no public ranking or sensitive-content interaction was introduced.
- [x] Accessibility/product editor: text fallback and keyboard-compatible native controls are used.
- [x] Audio editor: no audio dependency was introduced.
- [x] Independence/rights editor: no copied third-party content or platform dependency was introduced.
- [x] Audience editor: actions answer “what is the evidence?”, “what would change this?”, and “what do I want to revisit?”
- [x] Performance engineer: no new runtime dependency or network request was added.

## Validation record

- `npm test` — passed after the evidence-link compatibility fix: 7 frontend test files, 14 frontend tests, plus the backend suite (16/16).
- `npm run build` — passed after implementation. Existing Vite large-chunk warnings remain for the 3D asset; no new build failure was introduced.
- Existing archive and approved publication files remain unchanged.
- Manual full browser, screen-reader, mobile, and WebGL validation remain outside this pass, as required by the project constraints.
- Any future Phase 3 or Phase 4 work must reopen this checklist with a new dated run rather than silently extending this scope.
