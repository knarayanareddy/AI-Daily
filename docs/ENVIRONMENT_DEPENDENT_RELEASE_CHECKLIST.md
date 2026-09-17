# Environment-dependent release checklist

**Status:** TODO before staging sign-off or public autonomous publishing  
**Owner:** deployment operator / project owner  
**Repository:** AI Daily  
**Last updated:** 2026-09-17

This checklist contains the work that cannot be honestly completed inside the repository-only sandbox. It requires a real deployment, database, browser/device environment, external services, or human editorial judgment.

> **Important:** Keep `ENABLE_AUTONOMOUS_PUBLISH=false` until every applicable blocker is closed and the 14-edition canary has passed. Do not treat local unit tests or a successful static build as production approval.

## Current repository safeguards

Already implemented and available for verification:

- `npm test`
- `npm run build`
- `npm run frontend:release-check`
- `npm run frontend:device-check`
- `npm run security:check`
- `npm run staging:check`
- `npm audit --audit-level=high`
- `npm sbom --sbom-format cyclonedx`
- Static security headers in `public/_headers`
- PostgreSQL-backed operator state and shared rate limiting
- Publication checksum manifest in `data/publication-manifest.json`
- Autonomous publication disabled by default
- HTTPS-only evidence and candidate validation
- Same-origin operator mutation protection
- OIDC return-path validation

## 1. Provision a staging environment — REQUIRED

### Required inputs

- [ ] Staging hostname, for example `staging.example.org`
- [ ] TLS certificate managed by the deployment platform
- [ ] Static frontend hosting/CDN
- [ ] Separate authenticated operations API host or protected path
- [ ] PostgreSQL staging database
- [ ] Backup destination for PostgreSQL
- [ ] Secret manager or encrypted CI secrets
- [ ] Alert webhook destination
- [ ] AI provider configuration, if live review calls are enabled

### Required environment variables

Configure these only in the deployment/secret manager, never in Git:

```text
DATABASE_URL=postgresql://...
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=true
DATABASE_SSL_CA=...                 # if the provider requires a custom CA
OPS_OIDC_ISSUER=https://...
OPS_OIDC_CLIENT_ID=...
OPS_OIDC_CLIENT_SECRET=...
OPS_OIDC_REDIRECT_URI=https://ops.staging.example.org/auth/callback
OPS_ALLOWED_EMAILS=operator@example.org
OPS_ALLOWED_DOMAIN=example.org
OPS_COOKIE_SECURE=true
PUBLIC_ORIGIN=https://staging.example.org
EDITION_NUMBER=...
ALERT_WEBHOOK_URL=...
ALERT_WEBHOOK_KIND=generic
AI_PROVIDER_MODE=remote             # never use mock mode in live canary
AI_PROVIDER_BASE_URL=https://...
AI_PROVIDER_API_KEY=...
AI_PROVIDER_MODEL=...
ENABLE_AUTONOMOUS_PUBLISH=false     # keep false until final approval
```

### Provisioning acceptance criteria

- [ ] TLS is valid and redirects HTTP to HTTPS.
- [ ] PostgreSQL requires TLS and certificate verification.
- [ ] The operations API is not publicly exposed without OIDC.
- [ ] The staging database is separate from production.
- [ ] Secrets do not appear in logs, artifacts, browser bundles, or Git.
- [ ] `ENABLE_AUTONOMOUS_PUBLISH` remains `false`.

## 2. Install a real browser environment — REQUIRED

Use Playwright/Chromium, a CI browser runner, or an approved device/browser farm.

### Browser coverage

- [ ] Chromium latest stable
- [ ] Firefox latest stable
- [ ] Safari/WebKit or a real iOS device
- [ ] Android Chrome or a real Android device
- [ ] Screen reader/browser pair: VoiceOver/Safari or NVDA/Firefox

### Browser E2E scenarios

Run against the built production artifact, not the development server:

- [ ] Read mode loads with JavaScript enabled.
- [ ] Read mode shows a useful loading state during data retrieval.
- [ ] Offline/fetch failure shows the last-known-good fallback.
- [ ] Immutable `/edition/YYYY-MM-DD` pages load the correct edition.
- [ ] Missing immutable editions show an explicit error state.
- [ ] `/story/:storyId` deep links open the correct story drawer.
- [ ] Browser Back closes the drawer before leaving the edition.
- [ ] Escape closes the story drawer.
- [ ] Focus moves into the drawer and is trapped while open.
- [ ] Focus returns to the originating story control after drawer close.
- [ ] Explore mode loads the Signal Map chunk only after user intent.
- [ ] Suspense/loading state is visible and accessible.
- [ ] Map-node and accessible-list selections open the same story.
- [ ] Search and topic filters keep list and map state consistent.
- [ ] Reduced-motion mode renders the static map and usable list.
- [ ] Archive, RSS, sitemap, and edition links return correct content types.
- [ ] No console errors occur during the primary flows.

### Suggested commands

```bash
npm ci
npm run build
npm run preview -- --host 0.0.0.0
```

Then run the browser suite against the preview or staging URL. Save:

- browser/version matrix;
- screenshots or traces for failures;
- console/network error output;
- pass/fail result per scenario.

## 3. Run responsive and real-device testing — REQUIRED

The repository has automated CSS/device contracts, but physical-device evidence is still required.

### Viewports

- [ ] 320×568 — small phone
- [ ] 375×667 — iPhone-sized viewport
- [ ] 390×844 — modern phone
- [ ] 768×1024 — tablet
- [ ] 1024×768 — small laptop
- [ ] 1440×900 — desktop

### Device checks

- [ ] No horizontal scrolling in Read mode.
- [ ] No horizontal scrolling in Explore mode.
- [ ] Story cards remain readable and tappable.
- [ ] Map/list controls meet touch-target sizing.
- [ ] Drawer fits the viewport and remains dismissible.
- [ ] Keyboard focus remains visible.
- [ ] Text remains readable at 200% zoom.
- [ ] Reduced-motion mode removes decorative motion.
- [ ] Map does not cause excessive memory or battery use.
- [ ] Layout remains stable while fonts and chunks load.

### Performance measurements

Record mobile-throttled and real-device values for:

- LCP
- CLS
- INP
- initial JavaScript transfer
- Explore chunk transfer
- map interaction latency
- memory usage
- battery impact during a five-minute Explore session

Suggested targets:

- LCP under 2.5 seconds on a mid-tier mobile profile
- CLS below 0.1
- INP below 200 milliseconds for normal interactions
- no sustained animation loop for reduced-motion users
- no unbounded memory growth while opening/closing Explore

Save reports in the release artifact and record browser/device/OS versions.

## 4. Run publication failure-injection tests — REQUIRED

Run only in staging with autonomous publication disabled.

### Scenarios

- [ ] Kill the process before writing the edition.
- [ ] Kill the process after writing the temporary edition file.
- [ ] Kill the process after replacing `news.json` but before replacing the manifest.
- [ ] Fill or simulate a full publication volume.
- [ ] Make the publication directory read-only.
- [ ] Corrupt the candidate artifact.
- [ ] Corrupt the review artifact.
- [ ] Supply an invalid edition number.
- [ ] Supply a non-HTTPS evidence URL.
- [ ] Submit the same `run_id` twice.
- [ ] Submit two different runs concurrently.
- [ ] Activate the operator kill switch.
- [ ] Make PostgreSQL unavailable during the gate.
- [ ] Make the model provider unavailable.
- [ ] Make the alert webhook unavailable.

### Acceptance criteria

- [ ] Invalid or incomplete editions never replace the last-known-good edition.
- [ ] A failed publication leaves a recoverable temporary artifact or cleanly removes it.
- [ ] `news.json` and `publication-manifest.json` either both represent the same publication or the previous valid pair remains active.
- [ ] Repeating the same run is idempotent.
- [ ] Concurrent publication attempts cannot produce a mixed edition.
- [ ] Kill switch prevents publication.
- [ ] Provider failure fails closed.
- [ ] Alert delivery failure does not hide the underlying pipeline failure.
- [ ] Every failure has a run ID and an operator-visible health artifact.

Record commands, timestamps, run IDs, resulting checksums, and rollback results.

## 5. Run PostgreSQL backup and restore drills — REQUIRED

Use a staging database with representative non-production data.

### Drill

1. Record the current migration version and row counts.
2. Create an encrypted backup.
3. Verify the backup checksum and storage location.
4. Destroy or create a separate empty restore database.
5. Restore the backup into the restore database.
6. Run migrations against the restored database.
7. Verify sessions, decisions, state, corrections, audit rows, and rate-limit rows.
8. Start the operations API against the restored database.
9. Verify OIDC login, operator reads, mutations, audit records, and logout.
10. Record restore duration and recovery point.

### Acceptance criteria

- [ ] Backup is encrypted and access-controlled.
- [ ] Restore completes without manual row edits.
- [ ] Restored schema passes migrations.
- [ ] Audit records remain attributable.
- [ ] No secrets are present in the backup artifact.
- [ ] Recovery time objective is documented.
- [ ] Recovery point objective is documented.
- [ ] Backup retention and deletion are documented.

## 6. Verify deployed security, feed, and cache behavior — REQUIRED

Run after deployment at the real staging hostname.

```bash
export STAGING_ORIGIN="https://staging.example.org"
curl -sSIL "$STAGING_ORIGIN/"
curl -sSIL "$STAGING_ORIGIN/rss.xml"
curl -sSIL "$STAGING_ORIGIN/sitemap.xml"
curl -sSIL "$STAGING_ORIGIN/archive.html"
```

### Security headers

Verify the responses contain:

- [ ] `Content-Security-Policy`
- [ ] `Strict-Transport-Security`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: DENY` or equivalent CSP `frame-ancestors`
- [ ] `Referrer-Policy`
- [ ] `Permissions-Policy`

### Content and cache

- [ ] `/rss.xml` returns `200` and `Content-Type: text/xml` or equivalent.
- [ ] `/sitemap.xml` returns `200` and valid XML.
- [ ] `/archive.html` returns `200` and HTML.
- [ ] Edition JSON returns `200` and JSON.
- [ ] Hashed assets have immutable cache headers.
- [ ] `news.json` has an intentional short cache policy or revalidation policy.
- [ ] Old hashed assets remain available after a deployment.
- [ ] Error responses do not expose stack traces or secrets.
- [ ] Canonical URLs use the real production hostname.
- [ ] RSS and sitemap URLs use the real production hostname.

## 7. Run the 14-edition human-sampled canary — REQUIRED

Keep autonomous publication disabled until the canary starts. Each edition must have a human sampler.

### Per-edition record

For editions 1 through 14 record:

- [ ] edition number and date
- [ ] run ID
- [ ] publication checksum
- [ ] source-health artifact
- [ ] candidate count and approved count
- [ ] reviewer/provider/model provenance
- [ ] human sampler identity
- [ ] sampled story IDs
- [ ] evidence links checked
- [ ] corrections or incidents
- [ ] rollback decision, if any
- [ ] final pass/fail decision

### Canary acceptance criteria

- [ ] 14 consecutive editions complete.
- [ ] Every edition has human sampling.
- [ ] No unresolved P0 security or integrity incident.
- [ ] No unreviewed story is public.
- [ ] Every published claim has evidence.
- [ ] Corrections remain visible and attributable.
- [ ] Source-health and alert artifacts are available.
- [ ] Rollback is demonstrated at least once in staging.
- [ ] Operator audit records are complete.
- [ ] The final canary report is approved by the release owner.

## 8. Final autonomous-publication decision — REQUIRED

Only after the preceding sections are complete:

- [ ] Replace `PUBLIC_ORIGIN` and placeholder hostnames with the real host.
- [ ] Verify DNS and TLS.
- [ ] Verify OIDC redirect URI exactly matches the deployed host.
- [ ] Verify secrets and database credentials are production-scoped.
- [ ] Review the security exception register.
- [ ] Confirm the kill switch works.
- [ ] Confirm rollback owner and incident contact.
- [ ] Obtain written release approval.
- [ ] Change `ENABLE_AUTONOMOUS_PUBLISH` from `false` only through reviewed deployment configuration.
- [ ] Monitor the first autonomous run manually.

## Sign-off record

```text
Staging hostname:
Deployment platform:
Database environment:
Browser/device test date:
Backup/restore drill date:
Failure-injection drill date:
Canary start date:
Canary completion date:
Human sampler:
Release owner:
Open risks:
Final decision: NOT APPROVED / STAGING APPROVED / AUTONOMOUS PUBLISHING APPROVED
```
