# Daily AI Daily runbook

## Operating mode

For now, a person explicitly starts each run by asking an agent to prepare the edition. The agent may collect, cluster, draft, and fact-check, but it must not publish without a human approval decision.

The deferred validation tracks are intentionally shelved: full-payload App integration, browser, screen-reader, keyboard, mobile/device, and WebGL validation.

## Agent brief

Use this brief for each daily run:

> Prepare one proposed AI Daily edition from current, sourceable developments. Keep the approved finite briefing template: 25 signals maximum, each with title, dek, source, canonical URL, category, date, claim-level evidence URLs and excerpts, evidence posture, what changed, consequence, tension or unknown, and a reader question. Cluster duplicate reports into one event. Prefer primary records, official release notes, research papers, regulators, filings, and accountable reporting. Do not invent facts, quotes, consensus, counterclaims, images, or debate. Mark uncertainty explicitly. Keep incidents and safety stories non-operational. Treat company claims as claims unless independently corroborated. Produce optional additions only when they pass the proof-of-value gate: at most two of Change Ledger, One Consequential Number, Builder Watch, Unanswered Question, Source Trail, Decision Log, Safe Small Test, or Reader Field Note. Return a review packet with every source, rejected candidate, unresolved question, and proposed edition date. Do not write public files until a human approves the packet.

## Approval checklist

- [ ] Every story is a distinct event, not duplicated coverage.
- [ ] Every public claim has claim-level evidence.
- [ ] Primary sources are used where available.
- [ ] Evidence posture is not stronger than the source supports.
- [ ] Titles do not overstate what the source says.
- [ ] Safety incidents contain no actionable abuse instructions.
- [ ] Optional additives have a reason to be in this edition, owner, moderation posture, correction path, and expiry.
- [ ] Images are licensed/approved and distinct, or the story uses the text fallback.
- [ ] The edition has exactly one immutable date and run ID.
- [ ] Human reviewer signs off before publication.

## Free publication architecture

- Approved edition JSON is stored by date under `data/editions/`.
- `npm run archive:build` generates `data/archive.json` and `data/search-index.json`.
- Archive search runs locally in the reader’s browser; no search provider or database is required.
- GitHub Pages hosts the static edition, archive, RSS, sitemap, and generated data.
- GitHub Actions runs the build and deployment for free within GitHub’s quotas.
- Email is deliberately provider-backed rather than repository-backed. Configure `VITE_NEWSLETTER_URL` to a hosted double-opt-in subscription page after selecting a provider.

## Email activation gate

Before enabling email delivery, configure:

1. A Buttondown account for the initial free pilot, or another provider with a documented free tier.
2. A hosted subscription URL in the repository’s Actions/build environment as `VITE_NEWSLETTER_URL`.
3. Provider-side double opt-in, unsubscribe, sender identity, and privacy policy.
4. An API token only as a GitHub Actions secret if automated campaign delivery is later enabled; never place it in frontend code.
5. An idempotency rule keyed by `edition` and `run_id`, so a retried workflow cannot send the same edition twice.

The site intentionally displays a non-interactive configuration message until `VITE_NEWSLETTER_URL` exists. This is safer than collecting addresses without delivery, consent, unsubscribe, or suppression handling.
