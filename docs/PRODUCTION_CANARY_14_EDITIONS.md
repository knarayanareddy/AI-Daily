# IMPORTANT — required before unattended production publishing

> **MUST DO:** Do not enable unattended daily publishing until 14 consecutive production-like editions have passed this canary. This is a release gate, not an optional monitoring exercise.

## Purpose

The 14-edition canary proves that retrieval, review, authentication, operator decisions, evidence validation, corrections, alerts, rollback, and publication all work together under real conditions.

A canary edition is one completed daily run that has been fetched, reviewed, sampled by a named human operator, and recorded as passing.

## Before edition 1

- [ ] Complete the live PostgreSQL and OIDC staging integration.
- [ ] Replace all staging fixture credentials.
- [ ] Configure HTTPS and secure cookies.
- [ ] Configure `ALERT_WEBHOOK_URL` and verify a test alert is received.
- [ ] Verify the OIDC operator allowlist.
- [ ] Verify database backups and a restore in a non-production database.
- [ ] Confirm the kill switch blocks publication.
- [ ] Confirm source pause state survives a worker restart.
- [ ] Confirm the last-known-good edition can be restored.
- [ ] Confirm the operator can inspect review evidence and create a correction.
- [ ] Confirm no production secret, database URL, or OIDC client secret is in Git.
- [ ] Record the canary start date, operator, commit SHA, schema version, and deployed environment.

## Per-edition procedure

Repeat this section once per edition. Use UTC and record the edition number and run ID.

### 1. Observe retrieval

- [ ] Confirm the scheduled run started.
- [ ] Confirm all enabled sources are accounted for.
- [ ] Check `data/health/last-run.json` or the operations dashboard.
- [ ] Confirm no critical health alert exists.
- [ ] Investigate any `SOURCE_FAILURE`, `PARSER_DRIFT`, `CANDIDATE_DROP`, or `CANDIDATE_SPIKE` alert.
- [ ] Confirm the candidate count is plausible against the source baseline.
- [ ] Confirm the previous `news.json` remains intact if retrieval failed.

### 2. Review the queue

- [ ] Confirm all four reviewer personas returned valid structured results.
- [ ] Confirm reviewer disagreements are visible.
- [ ] Confirm high-impact topics are escalated.
- [ ] Confirm each published candidate has at least one claim.
- [ ] Confirm each claim has a supporting evidence URL.
- [ ] Confirm excerpts, where present, match the linked source.
- [ ] Confirm no source text appears to have injected instructions into a reviewer.

### 3. Human sample

The named operator must sample **every story** during the canary, not only escalated stories.

For each story:

- [ ] Read the headline and summary against the primary evidence.
- [ ] Check the claim wording is no stronger than the evidence.
- [ ] Check source attribution and publication time.
- [ ] Check related-source grouping is not misleading.
- [ ] Approve, reject, or escalate with a written reason.
- [ ] Record the operator identity in the audit log.

### 4. Publish and verify

- [ ] Confirm the operator publish action succeeded.
- [ ] Confirm the edition passed schema validation.
- [ ] Confirm only approved stories were published.
- [ ] Confirm the public site displays the same edition ID as the operations dashboard.
- [ ] Open the Evidence Desk for at least one story.
- [ ] Verify source links and claim evidence render correctly.
- [ ] Verify the public page remains usable if JavaScript, WebGL, or the map is unavailable.
- [ ] Verify the RSS/sitemap output after those features are enabled.

### 5. Corrections and rollback drill

During the 14-edition window, perform at least one controlled correction and one rollback drill.

- [ ] Create a correction through the authenticated operations API.
- [ ] Confirm the correction is written transactionally.
- [ ] Confirm the audit event contains actor, reason, story, claim, and edition.
- [ ] Confirm the public correction history is visible.
- [ ] Activate the kill switch in a controlled window.
- [ ] Confirm a publish request is blocked.
- [ ] Confirm the last-known-good edition remains live.
- [ ] Disable the kill switch and verify normal operation resumes.

### 6. Record the result

Run:

```bash
npm run canary:check -- --sampled-by "operator@example.com" --record
```

Record the following in the canary log:

- Edition number
- Run ID
- Commit SHA
- Deployment version
- Operator
- Source count and candidate count
- Published story count
- Reviewer consensus rate
- Corrections
- Alerts
- Retrieval latency
- Review latency
- Any manual intervention
- Pass or fail decision

## Automatic fail conditions

The canary fails immediately if any of these occur:

- A factual error reaches the public edition.
- A material claim has no supporting evidence.
- A reviewer response is malformed but the story publishes anyway.
- A kill switch is active but publication proceeds.
- An unauthenticated user can mutate operator state.
- An audit record is missing for a decision or correction.
- A correction silently changes historical text.
- The public edition differs from the approved edition.
- A failed retrieval replaces the last-known-good edition.
- Secrets are exposed in logs, artifacts, client code, or Git.
- A source is silently paused or removed without an audit record.

If a fail condition occurs, stop the 14-edition count, correct the issue, and restart from edition 1. Do not count a failed edition as a passing edition.

## Completion gate after edition 14

Do not enable unattended publishing until all of the following are true:

- [ ] 14 consecutive editions passed.
- [ ] Every edition has a named human sample record.
- [ ] No unresolved critical alert exists.
- [ ] No unresolved factual correction exists.
- [ ] Correction rate and false-negative observations were reviewed.
- [ ] Source availability and candidate baselines are stable.
- [ ] Operator authentication and audit records passed review.
- [ ] Backup/restore was verified.
- [ ] Rollback and kill-switch drills passed.
- [ ] The team explicitly approved the production go-live decision.

## Go-live decision

Only after the checklist above is complete:

1. Enable the production scheduler.
2. Keep the kill switch available to operators.
3. Retain human sampling for the first week after canary completion.
4. Review health and corrections daily.
5. Revert to manual publication if any automatic-publishing fail condition recurs.
