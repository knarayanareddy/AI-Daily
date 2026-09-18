# Critical review council: current implementation

Date: 2026-09-18

## Review team

- **Editorial systems editor:** whether additions earn their place and preserve the 25 Signals as the canonical briefing.
- **Accessibility and interaction reviewer:** landmarks, anchors, keyboard paths, responsive behavior, and text-first fallback.
- **Trust and evidence editor:** provenance, evidence posture, correction, expiry, and claims integrity.
- **Frontend/platform reviewer:** routing, deployment base paths, runtime failures, payload validation, and test gaps.
- **Performance and safety reviewer:** progressive enhancement, bundle boundaries, external links, and operational risk.

This is a repository and public-edition review, not a substitute for the still-shelved browser, screen-reader, and real-device sessions.

## What is working well

1. **The publication has a coherent editorial arc.** The 25 Signals remain a finite, inspectable briefing, with Evidence Desk as the consistent provenance layer.
2. **The additive lane is genuinely dynamic at the payload level.** Tool Focus, Cool Project, Five-Minute Experiment, Change Ledger, and One Consequential Number are optional fields rather than empty placeholders.
3. **The latest additions have a reason to exist.** The Change Ledger reports a real delta and the number card supplies a consequential denominator rather than trivia or a dashboard.
4. **Trust language is unusually explicit.** Caveats, alternatives, limitations, source trails, expiry dates, and safety wording are present in the public cards.
5. **Progressive enhancement is respected.** The list remains the primary reading path; the signal map and 3D field are opt-in and code-split.
6. **The earlier module-discovery failure was correctly diagnosed and fixed.** Edition normalization now preserves the optional editorial fields, with a regression test.
7. **Release hygiene is strong for the repository layer.** Build, frontend tests, staging checksum validation, security scan, and Phase 5 checks all pass.

## Findings by severity

### Critical — canonical hierarchy is currently inverted

`src/App.tsx` renders all optional modules before `<section id="briefing">`, so readers encounter the additive lane before the 25 Signals. This conflicts with the stated hierarchy that the briefing is canonical and the additions are optional context. It also makes the page feel like a feature showcase rather than a daily briefing.

**Recommendation:** render the 25 Signals immediately after the Edition Guide, then render optional additions in a clearly labeled secondary lane. Keep direct links, but do not make optional cards the first body content.

### Critical — duplicate `id="briefing"`

`EditionHeader.tsx` and the story list section in `App.tsx` both use `id="briefing"`. Skip links and Edition Guide links resolve to the first matching element, which is the hero rather than the story list. This undermines the accessibility contract and makes “25 Signals” an imprecise destination.

**Recommendation:** reserve `id="briefing"` for the story list; give the hero an identity such as `edition-intro`.

### High — GitHub Pages deep links are not base-path safe

`storyFromLocation()` only matches paths beginning with `/story/`; `openStory()` pushes `/story/...`; `goCurrent()` pushes `/`. On the deployed project site, the base path is `/AI-Daily/`. A story opened from the public site can therefore lose the project prefix, and a refreshed story deep link may not resolve correctly.

**Recommendation:** centralize route construction/parsing around `import.meta.env.BASE_URL` and test `/AI-Daily/story/...`, `/AI-Daily/edition/...`, and browser back/forward behavior.

### High — payload normalization trusts additive objects

`normalizeEdition()` preserves `tool_focus`, `cool_project_alert`, `five_minute_experiment`, and `editorial_additives` by type assertion without runtime validation. A malformed or partially reviewed public payload can crash rendering at calls such as `tool.evidence_posture.replace(...)`, `item.meta.source_urls.map(...)`, or `item.how_to_try.map(...)`.

The same weakness exists for corrections, which are cast directly to `Correction[]`.

**Recommendation:** add module-specific runtime validators. Invalid optional modules should be omitted with a visible publication warning, not crash or partially publish.

### High — additive expiry is descriptive, not enforced

`expires_at` is displayed but does not suppress expired cards. The rotation policy says additions should expire, but the runtime will continue showing an expired addition indefinitely if the payload remains current.

**Recommendation:** normalize dates, omit expired additives by default, and expose an editorial validation error when an expired item is present in a publication artifact.

### High — source URL and metadata validation is incomplete

Story URLs are checked for HTTPS, but module URLs and additive `source_urls` are not validated. The typed contract is not a runtime safety boundary. Ownership, moderation, safety, correction, and expiry fields can also be empty strings.

**Recommendation:** reuse `isSafeHttpsUrl()` for every external module URL and require nonempty governance fields before publication.

### Medium — current edition identity is hardcoded

`App.tsx` contains `Thursday, September 17, 2026` and `EditionHeader.tsx` contains `Updated 06:42 UTC`. A future edition can display the wrong date and update time even when the payload changes.

**Recommendation:** derive date and published time from `published_at`, using an explicit timezone and locale formatter.

### Medium — test coverage does not exercise the new public composition

The test suite covers normalization and general shell behavior, but no App test renders an edition with all five optional modules and asserts their anchors, visible labels, source links, expiry behavior, and ordering relative to the briefing.

**Recommendation:** add a fixture-based integration test for the full Edition 186 payload shape, plus a base-path routing test.

### Medium — browser and assistive-technology evidence is still absent

Repository checks pass, but the existing validation notes still defer browser, screen-reader, focus-order, mobile, low-memory, and WebGL context-loss checks. The duplicate briefing ID and base-path route issue are exactly the kind of defects automated jsdom tests can miss.

**Recommendation:** perform the deferred browser/device matrix before describing the surface as accessibility-complete.

### Low — newsletter action is a placeholder

The subscribe button invokes `window.alert('Newsletter signup will connect to the operator API next.')`. This is honest and not a trust violation, but it is a visible unfinished interaction and not a graceful production experience.

**Recommendation:** either hide the CTA until an actual endpoint exists or replace the alert with a static explanation and a non-blocking contact path.

### Low — source labels are slightly too generic

The additive cards label every first link “primary record,” even when the URL is a company report and the second link is a system card. This is understandable but less precise than the Evidence Desk conventions.

**Recommendation:** allow source roles such as `primary_record`, `company_report`, `system_card`, `corroboration`, and `methodology` in the manifest.

## Editorial judgment

The direction is strong and the latest additions are materially better than generic “more content” blocks. The largest problem is not the quality of the additions; it is their placement and runtime governance. Today the page still presents the optional lane as the main event, while expiry and payload validation are advisory rather than enforced.

## Priority order

1. Fix duplicate briefing anchor and restore 25 Signals before additives.
2. Make all routes base-path safe on GitHub Pages.
3. Add runtime validators and expiry enforcement for the additive manifest.
4. Add full-payload integration tests.
5. Run the deferred browser, keyboard, screen-reader, and mobile checks.
6. Polish newsletter and source-role presentation.

## Review conclusion

**Editorial quality:** strong and distinctive.

**Trust model:** promising, but additive governance needs runtime enforcement.

**Accessibility:** good intended structure; not yet validated and currently weakened by duplicate briefing IDs.

**Production readiness:** repository-level checks pass; the surface should not be called fully production-ready until the four High/Critical findings are addressed and deployed verification is repeated.
