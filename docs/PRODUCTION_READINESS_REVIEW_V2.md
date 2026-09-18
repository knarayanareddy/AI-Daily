# Production-readiness review v2

**Review date:** 2026-09-17  
**Scope:** re-check of the previous 12-persona review after the staging-hardening pass.  
**Review panel:** OWASP/security, threat modeling, platform architecture, SRE, backend/data contracts, AI governance, editorial trust, privacy/licensing, accessibility, frontend performance, QA/release, and operations.

## Executive result

The previous recommendations were reviewed against the current code, workflow, tests, and release scripts. The system is materially stronger and is suitable for controlled staging preparation. It is **not yet approved for public autonomous publishing** because environment-backed evidence is still missing and a few implementation-level risks remain.

**Implementation status:** approximately **94% of repository work complete**.  
**Environment-dependent release status:** approximately **45% complete**.

## Recommendation verification

| Previous recommendation | Status | Evidence |
|---|---|---|
| Remove JSON operator-state fallback | Done | Orchestrator requires `DATABASE_URL` and calls PostgreSQL migrations/state reads |
| Require positive edition identity | Done | `EDITION_NUMBER` is required by `buildEdition` and passed by workflow configuration |
| HTTPS-only evidence | Done | Candidate, review, claim, and frontend normalization checks |
| Open-redirect protection | Done | Same-origin `returnTo` allowlist and security test |
| Security headers | Implemented, deployment pending | `public/_headers`; must still be verified on the real host |
| Same-origin mutation protection | Implemented | `Origin`/`Referer` required for operator mutations |
| Rate limiting | Implemented for shared staging topology | PostgreSQL-backed `ops_rate_limits`; proxy/IP trust still needs deployment verification |
| PostgreSQL TLS verification | Implemented | Certificate verification is enabled by default |
| Publication idempotency | Implemented | Same run and edition return the existing publication |
| Publication checksum manifest | Implemented | `publication-manifest.json` and staging checksum check |
| Dependency audit/SBOM/secret scan | Implemented in CI | npm audit, CycloneDX SBOM, and repository secret-pattern scan |
| Autonomous publishing guard | Done | Workflow sets `ENABLE_AUTONOMOUS_PUBLISH=false`; orchestrator blocks otherwise |
| React Three Fiber decision | Done | Remains out of scope for first release |
| Browser E2E | Not complete | jsdom/component tests exist; browser runtime is unavailable |
| Failure-injection drills | Not complete | Guardrails exist; staging process/filesystem drills are still required |
| PostgreSQL backup/restore | Not complete | Requires a real staging database and backup target |
| Production host verification | Not complete | Hostname is not configured |
| 14-edition human canary | Not complete | Requires live runs, operators, sampling, and elapsed time |

## New findings and missed risks

### P0 — publication artifact pair is not transactionally atomic

`publishEdition` renames `news.json` and then renames the publication manifest. A process failure between those operations can leave the data and manifest temporarily inconsistent.

**Required before autonomous publishing:** publish to versioned immutable objects and update one small pointer/manifest last, or store both artifacts in a transactional/object-store publication mechanism. Add a crash-after-first-rename test.

### P1 — rate-limit identity depends on proxy configuration

The shared counter is PostgreSQL-backed, but it keys on `req.socket.remoteAddress`. Behind a reverse proxy this may be the proxy address, or the application may need a trusted forwarded-IP configuration.

**Required before deployment:** document the trusted proxy boundary, configure a sanitized client-IP source, and test that spoofed forwarding headers cannot bypass limits.

### P1 — operator JSON/API boundary needs stricter validation

The request body parser accepts JSON without requiring `Content-Type: application/json`, and the top-level error handler logs and returns `error.message` to clients.

**Required before public operator exposure:** enforce content type, cap field sizes per endpoint, use stable public error codes, and keep detailed errors server-side.

### P1 — CSP is static-host dependent

The `_headers` file is useful for compatible static hosts, but it is not automatically applied by every CDN or deployment platform. The CSP also allows inline styles and Google Fonts.

**Required before deployment:** verify actual response headers on the host, decide whether fonts should be self-hosted, and tighten `style-src` when feasible.

### P1 — audit and retention controls remain operational requirements

Audit events, sessions, review artifacts, raw feed caches, and model-provider payloads need explicit retention and deletion jobs. The repository documents the need but does not yet prove the scheduled controls.

### P2 — test coverage remains mostly unit/component-level

The current suite is healthy but does not exercise a real browser, reverse proxy, PostgreSQL, object storage, or deployed CDN. Those are release-evidence gaps rather than reasons to expand the frontend feature set.

## Current release gates

### Green locally

- Backend tests: 12/12
- Frontend tests: 11/11
- Production build
- Frontend release contract
- Reduced-motion/mobile contract
- Secret scan
- High/critical npm audit gate
- SBOM generation
- Staging release check
- Publication manifest checksum verification
- Autonomous-publication guard

### Red or unverified outside the repository

- Browser E2E against built artifact
- Real mobile/low-end device measurements
- PostgreSQL backup and restore
- Crash/failure-injection drills
- Deployed security headers and cache behavior
- Production hostname and canonical URLs
- 14-edition human-sampled canary
- Transactional publication-pointer failure test

## Final panel decision

**Frontend:** implementation-complete for controlled staging; browser, screen-reader, and real-device evidence still pending.  
**Backend:** materially hardened and fail-closed; staging-ready with environment setup, but not approved for autonomous public publication.  
**Architecture:** retain the SVG/list visualization and defer React Three Fiber.  
**Release:** proceed only to controlled staging. Keep `ENABLE_AUTONOMOUS_PUBLISH=false` until the red/unverified gates and P0 artifact-atomicity issue are closed.
