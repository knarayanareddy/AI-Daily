# Architecture council: daily curation, archive, search, and email

Date: 2026-09-18

## Scope change accepted by the council

For the foreseeable future, daily story generation and publication will be initiated by the user or an explicitly requested agent. The deferred work remains shelved:

- complete full-payload App integration test;
- real-browser validation;
- screen-reader validation;
- keyboard/focus validation;
- mobile/device validation;
- WebGL validation.

These are release-hardening tracks, not prerequisites for building the editorial archive and subscription architecture. They must remain recorded as deferred rather than silently treated as complete.

## Team debate

### Newsroom editor
Keep every edition finite and immutable. A daily agent may draft, cluster, and fact-check, but a human must approve the publication boundary. “Generated” and “published” are different states.

### Evidence and standards editor
Store claims, source URLs, excerpts, posture, corrections, and review decisions with each story. Never overwrite an approved edition when a correction arrives; append a correction record and preserve the original snapshot.

### Archive/search architect
Use the repository as the free canonical store. Put immutable editions at `data/editions/YYYY-MM-DD.json`, publish a small archive manifest, and build a static search index at deploy time. Browser-side search keeps reader queries private and avoids a paid database or search API.

### Operations engineer
GitHub Actions is sufficient for a free draft pipeline and deployment. Scheduled Actions are not a guaranteed always-on scheduler, so daily operation needs a manual `workflow_dispatch` path and a visible last-run/last-published status. The current orchestrator already fails closed when reviews, database state, or autonomous-publish approval are absent; preserve that behavior.

### Privacy and email specialist
Do not collect email addresses in GitHub Issues, JSON files, or a public repository. GitHub Pages cannot safely process subscriptions by itself. Use a hosted newsletter provider with double opt-in, unsubscribe, suppression, and delivery handling. Keep provider integration behind an adapter and never expose its API key to browser code.

### Cost and sustainability reviewer
“Free” means free within provider and GitHub quotas, not an unlimited guarantee. Avoid a self-hosted SMTP server: deliverability, bounce handling, unsubscribe compliance, and abuse controls make it unsafe and not genuinely free to operate.

## Consensus architecture

```text
User asks for an edition
        |
        v
Agent/team drafts candidates -> source and claim checks -> review artifact
        |
        v
Human approves the edition boundary
        |
        +--> immutable data/editions/YYYY-MM-DD.json
        +--> data/publications/<edition>-<run>.json
        +--> archive manifest + static search index
        +--> GitHub Pages deployment
        +--> newsletter provider API or hosted campaign
```

### Storage contract

- `data/editions/YYYY-MM-DD.json`: immutable public edition snapshot.
- `data/publications/current.json`: atomic pointer to the approved current edition.
- `data/publications/<edition>-<run>.json`: immutable publication artifact.
- `data/archive.json`: public index of approved editions, dates, counts, genres, and keywords.
- `data/search-index.json`: only the fields needed for client-side search; no private data.
- `data/corrections.json`: published correction history, never silent mutation.
- `data/drafts/` and review artifacts: not copied to Pages and never treated as public content.

Each story should retain a stable `event_id`, title, date, genre/category, keywords, source, claims, evidence posture, and edition reference. Search results should link to a date and story route, not duplicate mutable story content.

### Daily workflow

1. `workflow_dispatch` or scheduled collection gathers candidates.
2. Agentic editorial pass clusters duplicates and drafts stories in the existing template.
3. Evidence pass requires primary sources where available, claim-level URLs, excerpts, posture, and explicit unknowns.
4. Review artifact is uploaded for human approval.
5. Only an approved artifact may update `data/publications/current.json` and the archive.
6. Archive/search generation runs from approved artifacts.
7. Pages deploys the approved public snapshot.
8. Newsletter delivery is triggered only after deployment succeeds and only for the approved artifact.

The existing `ENABLE_AUTONOMOUS_PUBLISH=false` fail-closed behavior stays in place until the user explicitly changes the operating policy.

## Email provider decision

The council recommends **Buttondown first** for the free pilot because it is newsletter-shaped, has a hosted subscription flow, supports an API, and avoids building unsafe email storage. Its free audience limit must be verified at account setup. Brevo is the fallback if the audience or automation requirements exceed Buttondown’s free plan. Current third-party comparisons describe Buttondown’s free tier as limited to the first 100 subscribers and Brevo’s as limited by daily sends; these are plan constraints, not promises of permanent pricing.

Required configuration, kept out of Git:

- provider account identity;
- provider API token in GitHub Actions secrets;
- verified sender identity if the provider requires it;
- publication cadence and timezone;
- double opt-in and unsubscribe settings;
- whether each edition is sent automatically after approval or only on manual dispatch.

Until the user supplies a provider account identity, the repository can implement the adapter and hosted-form seam but cannot truthfully complete live delivery.

## Rejected approaches

- Storing subscriber emails in the repository, GitHub Issues, or a public JSON file.
- Browser-side calls with an email API key.
- Self-hosting SMTP on GitHub Actions or an unmonitored free server.
- Auto-publishing agent drafts without a human approval artifact.
- A paid search service for a small archive.
- One mutable “news.json” with no immutable date history.
- A newsletter that sends every candidate rather than the approved edition.

## Delivery phases

### Phase A — free archive foundation

Build archive manifest generation, date-addressable edition links, client-side keyword/genre search, stable story links, and a content template validator.

### Phase B — daily editorial operation

Add a documented agent prompt/template, review packet, manual approval command, and workflow artifacts. Keep automatic collection separate from publication.

### Phase C — email adapter

Add a provider-neutral send/subscribe interface, hosted subscription form, GitHub Actions secret wiring, idempotency by edition/run ID, and a dry-run mode. Activate live sends only after the user configures Buttondown or the chosen fallback.

### Phase D — deferred validation

Do not resume the shelved browser, assistive technology, device, WebGL, or full-payload integration work unless the user reopens that track.

## Consensus

The best free architecture is a repository-backed immutable archive plus generated static search, GitHub Actions for draft/review/deploy orchestration, and a hosted newsletter provider for privacy-safe email. It avoids recurring infrastructure cost while preserving editorial control. The only unavoidable external dependency is email delivery; a free provider account and its limits must be accepted explicitly.
