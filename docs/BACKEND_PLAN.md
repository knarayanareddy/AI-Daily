# Backend implementation plan and launch checklist

## Backend council consensus

Eight domain roles reviewed the product plan: platform architect, data engineer, RSS/retrieval engineer, ML reviewer, fact-checker, security engineer, SRE, and privacy/licensing lead. They agree the backend must be **fail-closed, evidence-first, and artifact-based**. A cron run can collect candidates without being allowed to publish. Publication is a separate transaction requiring validated reviews.

## Target architecture

```text
Scheduler
  -> run lock + run_id
  -> source fetchers (timeouts, retries, conditional requests)
  -> raw candidate artifact (immutable)
  -> normalize / canonicalize / license policy
  -> event clustering (conservative, explainable)
  -> reviewer queue (4 isolated personas)
  -> structured model responses + schema validation
  -> deterministic gate (thresholds, vetoes, evidence)
  -> human exception queue
  -> atomic last-known-good publication
  -> static frontend / health endpoint / alerts
```

The repository now contains the first safe backend skeleton in `workers/briefing/`:

- `schema.mjs` — contract validation; pending/rejected items cannot validate as public editions.
- `cluster.mjs` — conservative deterministic event clustering.
- `review.mjs` — reviewer prompt contract, high-impact triage, and fail-closed defaults.
- `gate.mjs` — 3-of-4 approval requirement with veto support.
- `publish.mjs` — validation plus atomic temporary-file replacement.
- `run.mjs` — turns candidates into an auditable review queue without publishing.

## Data contracts

### Source

`id`, `name`, `feed_url`, `tier`, `topics`, `license_policy`, `enabled`, `last_success_at`.

### Candidate

`id`, `canonical_url`, `source_id`, `title`, `published_at`, `retrieved_at`, `raw_hash`, `language`, `excerpt`, `claims[]`, `evidence[]`, `rights`, `run_id`.

### Event cluster

`id`, `canonical_title`, `candidate_ids[]`, `source_ids[]`, `entities[]`, `topic`, `first_seen_at`, `last_seen_at`, `relationship_reason`.

### Review

`reviewer_id`, `prompt_version`, `model`, `state`, `scores`, `claims_checked[]`, `evidence_urls[]`, `red_flags[]`, `rationale`, `created_at`.

### Edition

`edition_id`, `date`, `stories[]`, `generated_at`, `run_id`, `schema_version`, `correction_history`, `pipeline_metrics`.

## Component checklist

### 1. Scheduler and run control

- [ ] Use UTC and a stable daily cutoff.
- [ ] Generate a unique `run_id`.
- [ ] Acquire a lock with expiry; prevent overlapping runs.
- [ ] Support manual dry-run and replay by run ID.
- [ ] Keep GitHub Actions for canary; migrate to a managed/durable scheduler for production delivery guarantees.

### 2. Source registry and retrieval

- [x] Version a source allowlist with ID, tier, topic coverage, and license policy.
- [x] Use per-source timeout and bounded retry with exponential backoff.
- [x] Send a truthful user agent and retain source license policy metadata.
- [x] Use conditional requests with ETag/Last-Modified when supported.
- [x] Store response hash and retrieval metadata in an ignored HTTP cache.
- [x] Parse RSS/Atom with `fast-xml-parser`, enforce a 2 MB response cap, canonicalize tracking URLs, deduplicate, and atomically replace candidates.
- [x] Enforce source URL/tier/license policy before retrieval.
- [x] Fetch and cache robots.txt daily; honor matching Allow/Disallow rules, with per-source required/best-effort mode.
- [x] Produce a structured health artifact with source status, retries, policy blocks, candidate volume, and alert codes.
- [x] Persist immutable per-run health reports and a cumulative per-source health index.
- [x] Deliver critical alerts to an operator-configured generic or Slack-compatible webhook.
- [x] Deduplicate alerts with fingerprints and configurable cooldowns.
- [x] Emit recovery notifications when an active alert clears.
- [x] Detect parser drift when a feed returns entries but required fields fail at a high rate.
- [x] Add source-shaped RSS/Atom parser fixtures and malformed-feed fixtures.
- [x] Maintain a 14-run per-source candidate baseline and flag large spikes/drops.
- [x] Escalate persistent alerts after a configurable occurrence threshold.
- [ ] Add source-specific fixtures for every remaining live feed during source onboarding.

### 3. Normalization and clustering

- [ ] Parse RSS/Atom with a tested parser; avoid relying only on regex in production.
- [ ] Canonicalize tracking parameters and redirects.
- [ ] Deduplicate by canonical URL and content hash.
- [ ] Cluster events conservatively; preserve every source link.
- [ ] Never allow an LLM to silently merge or discard a source.
- [ ] Keep cluster IDs stable across reruns.

### 4. Review agents

- [ ] Run four independent roles in parallel: editor, fact-checker, ML safety, audience editor.
- [ ] Limit context to normalized, quoted evidence and metadata.
- [ ] Mark fetched text as untrusted; defend against prompt injection.
- [ ] Require strict JSON schema and reject malformed output.
- [ ] Version prompts and record model/provider/temperature.
- [ ] Use model/provider diversity where practical; shared-model votes are not independent evidence.
- [ ] Escalate legal, health, election, safety, and conflicting-primary-source topics.

### 5. Deterministic quality gate

- [ ] Require at least 3 of 4 approvals.
- [ ] Require evidence URLs and claim support.
- [ ] Apply minimum weighted score and per-dimension floors.
- [ ] Apply hard vetoes outside the model.
- [ ] Publish zero items rather than weak items when the gate fails.
- [ ] Keep rejected/escalated items for audit and missed-signal analysis.

### 6. Publication and frontend contract

- [ ] Validate the complete edition before writing.
- [ ] Write a unique temp file and atomically rename it.
- [ ] Keep `current.json`/`news.json` as last-known-good until replacement succeeds.
- [ ] Never expose pending review objects through the public endpoint.
- [ ] Sanitize all rendered text and restrict outbound URL schemes to HTTPS.
- [ ] Generate RSS, sitemap, OpenGraph metadata, and date-addressable edition pages.

### 7. Operations and security

- [ ] Least-privilege CI token; no workflow `git push` until publication is proven safe.
- [ ] Secrets only in secret storage; never in candidates or prompts.
- [ ] Structured logs with run IDs and redaction.
- [ ] Metrics: source success, candidates, cluster count, approval rate, latency, corrections, false negatives.
- [ ] Alerts for failed jobs, stale edition, empty run, sudden approval spike/drop, and schema errors.
- [ ] Kill switch and rollback to last-known-good edition.
- [ ] Retain review artifacts for a defined period; delete raw content on schedule.

## Execution order

### Milestone A — contracts and tests

Implement runtime schema validation, fixture candidates, clustering tests, gate tests, atomic publication tests, and an end-to-end dry run. No LLM or public auto-publish yet.

### Milestone B — reliable ingestion

Replace the prototype regex parser with a maintained RSS/Atom parser, add source health, conditional requests, backoff, and immutable raw/candidate artifacts.

### Milestone C — review adapter

Implement one provider adapter behind a narrow interface. Validate structured results, run prompt-injection fixtures, record provenance, and require manual approval for the first 14 editions.

### Milestone D — production gate and delivery

Connect four reviewers, deterministic gate, exception queue, atomic edition publication, RSS/sitemap generation, health checks, and alerting. Deploy with last-known-good fallback.

### Milestone E — scale and hardening

Add model/provider fallback, durable scheduler, database/object storage for artifacts, source licensing review, retention jobs, canary releases, and public correction history.

## Production observability contract

Every retrieval run writes `data/health/last-run.json` as an ignored, uploadable artifact. It contains run timestamps, health status (`healthy`, `degraded`, or `critical`), per-source status, retry counts, policy results, candidate count, and machine-readable alert codes. A critical run never replaces `candidates.json`. The GitHub workflow uploads this artifact even when the job fails, so operators can inspect source failures without SSH access.

Current alert codes include `SOURCE_FAILURE`, `SOURCE_POLICY_BLOCK`, `PARSER_DRIFT`, `CANDIDATE_SPIKE`, `CANDIDATE_DROP`, `NO_SOURCE_SUCCESS`, and `ZERO_FRESH_CANDIDATES`. Critical alerts can be delivered through `ALERT_WEBHOOK_URL`; set `ALERT_WEBHOOK_KIND=slack` for a Slack-compatible `{text}` payload, or omit it for a generic JSON payload. Alerts are fingerprinted by code and affected source IDs, suppressed for `ALERT_COOLDOWN_MS` (default six hours), and emit a recovery event when the fingerprint disappears. Persistent alerts escalate to `ESCALATED_<CODE>` after `ALERT_ESCALATE_AFTER` occurrences (default three) within `ALERT_ESCALATION_WINDOW_MS` (default 24 hours). Delivery failures are logged but do not hide the underlying retrieval failure. Parser drift fires when at least three entries are present and at least 80% fail required title/link/date fields. Candidate anomalies use the previous 14 runs per source and flag a spike above four times the recent median or a drop to zero when the median is at least two.

## Orchestrator operating contract

`npm run briefing:run` is the single entry point for scheduled execution. It acquires `data/.briefing.lock`, runs retrieval unless `--skip-fetch` is supplied, clusters candidates, writes an immutable review queue, and looks for a matching `data/reviews-{run_id}.json` artifact. Without that artifact it exits with code 2 and never touches `data/news.json`. With validated reviews it applies the deterministic gate and atomically publishes. `--dry-run` exercises the gate without replacing the public edition.

The CI workflow uploads candidates and review queues even when the orchestrator blocks, which gives operators a complete handoff artifact without granting the job permission to push content.

## Review adapter operating contract

Each cluster is sent to four independent personas in parallel. The provider receives only normalized metadata and candidate URLs, with fetched content explicitly treated as untrusted data. A response must contain an allowed state, five numeric scores from 0–5, candidate-set evidence URLs, a red-flag boolean, and a bounded rationale. Malformed, incomplete, or provider-error responses fail the entire review artifact closed; they cannot become a partial approval. The deterministic gate separately applies evidence minimums, 3-of-4 consensus, and hard escalation topics.

## Operations API status

The authenticated control-room API is implemented in `ops-server.mjs` and runs with `npm run ops:server`. It now requires PostgreSQL and OIDC Authorization Code + PKCE authentication. It exposes health, source, alert, and review queue reads plus authenticated decision, source pause, kill-switch, and publish-run mutations. `workers/ops-db.mjs` runs migrations and stores sessions, auth state, decisions, operator state, and audit events transactionally. The worker reads matching database decisions during the publication gate. There is no production JSON operator-persistence fallback.

## Definition of done

- [ ] A failed source does not fail the entire run.
- [ ] A failed reviewer cannot publish an item.
- [ ] A malformed edition cannot replace the current edition.
- [ ] A repeated run produces the same candidate and cluster IDs.
- [x] Every public claim links to supporting evidence.
- [x] Operators can create audited correction records through the operations API.
- [ ] Claim-level evidence is rendered in the operator drawer and public edition.
- [ ] An operator can replay, pause, inspect, correct, and roll back a run.
- [ ] 14 consecutive canary editions pass human sampling.
- [ ] The frontend remains usable with JavaScript, WebGL, external feeds, or an LLM provider unavailable.
