# AI Daily production-readiness review

**Review date:** 2026-09-17  
**Scope:** public React frontend, static delivery, briefing pipeline, review adapter, publication gate, operations API, CI, data/rights handling, accessibility, reliability, and editorial trust.  
**Disposition:** strong prototype / controlled canary candidate; **not yet public-production ready**.

This review uses OWASP ASVS 5.0.0 as the application-security baseline and OWASP Top 10:2025 as the risk vocabulary. ASVS is a verification standard, not a claim that passing a checklist makes a system safe. The review also treats this product as an editorial system: provenance, reversibility, human accountability, and correction integrity are first-class controls.

## Executive consensus

The panel agrees that the implementation has a good fail-closed direction, a useful public/read separation, and unusually strong evidence and review concepts for a prototype. The frontend is close to a controlled release. The backend still has several production blockers around deployment configuration, authentication boundaries, publication integrity, and operational durability.

**Release recommendation:**

- **Now:** continue local/staging verification and prepare a limited, non-public canary.
- **Before any public autonomous publication:** close all P0 items and the P1 security/operations items below.
- **Do not:** present the current repository as a secure public operations service merely because tests and a static build pass.

## Panel composition and findings

### 1. OWASP application-security reviewer

**Assessment:** high-value controls exist, but the ASVS boundary is not complete.

- [ ] Add production security headers: CSP, HSTS, `frame-ancestors`/`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and content-type protection.
- [ ] Validate every public and operator URL as `https:` (or an explicitly allowlisted local-development exception) before rendering or redirecting.
- [ ] Add CSRF protection or a strict origin/token policy for every state-changing operator request.
- [ ] Add rate limits and abuse controls to OIDC login, callback, JSON bodies, and operator mutations.
- [ ] Replace `DATABASE_SSL` with certificate verification; `rejectUnauthorized: false` is not a production trust configuration.
- [ ] Add dependency scanning, lockfile review, SBOM generation, and secret scanning to CI.

**Priority:** P0 for headers/URL policy/operator boundaries; P1 for supply-chain automation.

### 2. Threat model / red-team reviewer

**Assessment:** the highest-risk attack surface is the authenticated operations boundary and the model/provider boundary, not the public SVG map.

- [ ] Prevent open redirects through `returnTo` in OIDC login; only allow same-origin relative paths in a small allowlist.
- [ ] Define provider egress allowlists and reject unexpected model response fields/content sizes.
- [ ] Treat all fetched source text and model output as hostile; retain the current prompt-injection language but add adversarial fixtures that attempt tool calls, policy overrides, and evidence substitution.
- [ ] Add replay protection and idempotency to publish requests and operator decisions.
- [ ] Add a threat-model document covering assets, trust boundaries, abuse cases, and residual risk.

**Priority:** P0 open-redirect and publish idempotency; P1 provider abuse controls.

### 3. Platform architect

**Assessment:** the artifact-based architecture is sound, but the repository currently mixes prototype fallbacks with the stated production contract.

- [ ] Choose one production persistence mode. `orchestrator.mjs` still falls back to `data/operator-state.json` when `DATABASE_URL` is absent, while the operations plan says JSON persistence has been removed.
- [ ] Make publication a durable transaction with a publication manifest, checksum, version, and immutable object; do not rely on a local filesystem rename as the only recovery mechanism.
- [ ] Define a deployment topology: static CDN, durable scheduler, object storage, PostgreSQL, secret manager, alert sink, and operator API boundary.
- [ ] Separate public static hosting from the operator API at the network and deployment level.

**Priority:** P0 persistence-mode contradiction and production topology.

### 4. SRE / reliability engineer

**Assessment:** observability is ahead of most prototypes; durability and recovery evidence are not yet sufficient.

- [ ] Test lock expiry, process termination during publication, disk-full behavior, partial upload, database outage, provider outage, and stale health artifacts.
- [ ] Add explicit SLOs: edition freshness, successful retrieval ratio, publication latency, operator API availability, and rollback time.
- [ ] Add backup/restore drills for PostgreSQL and published editions.
- [ ] Add a durable scheduler with retry policy and a dead-letter/manual replay path; retain GitHub Actions as canary infrastructure only.
- [ ] Prove alert delivery and recovery behavior with a staging webhook.

**Priority:** P0 for publication recovery and scheduler; P1 for formal SLOs and restore drills.

### 5. Data-contract and backend reviewer

**Assessment:** the backend gate is directionally correct, but contract enforcement is inconsistent across layers.

- [ ] Reject invalid stories at the frontend boundary rather than silently filtering malformed claims and rendering a fallback claim.
- [ ] Enforce HTTPS evidence URLs in `validateCandidate`, `validateReview`, edition schema, and frontend normalization.
- [ ] Give editions a real immutable edition identifier/date; `buildEdition` currently emits `edition: 0`.
- [ ] Version the public contract and validate relationships, correction IDs, timestamps, categories, and source provenance at runtime.
- [ ] Add property-based/fuzz tests for malformed JSON, oversized strings, duplicate IDs, invalid dates, cyclic relationships, and hostile URLs.

**Priority:** P0 for publication identity and URL/claim contract; P1 for fuzz coverage.

### 6. AI safety / model governance reviewer

**Assessment:** the four-persona design and fail-closed review adapter are good foundations, but “four votes” must not be confused with independent truth.

- [ ] Record provider, model, prompt version, temperature, input hash, output hash, and validation result for every review.
- [ ] Detect correlated reviewers and avoid counting four calls to the same model/provider as independent evidence.
- [ ] Require primary-source evidence for high-impact claims and mandatory human escalation for legal, health, safety, elections, and security incidents.
- [ ] Add benchmark sets for false approval, false rejection, sensationalism, source mismatch, and prompt injection.
- [ ] Define model-retention and provider-data-use policy before sending source-derived content externally.

**Priority:** P0 for provenance and high-impact escalation; P1 for evaluation and provider diversity.

### 7. Editorial trust / fact-checking reviewer

**Assessment:** the public story drawer communicates evidence well, but fallback behavior can overstate verification.

- [ ] Never label an unverified fallback story as “Supported by the panel.”
- [ ] Do not synthesize a claim from a title when the approved claim set is absent.
- [ ] Display publication status, review timestamp, source timestamp, and correction status distinctly.
- [ ] Add an explicit “report a correction” path with a durable intake and triage owner.
- [ ] Define a correction SLA and a public correction event model.

**Priority:** P0 for fallback/evidence language; P1 for correction operations.

### 8. Privacy and licensing reviewer

**Assessment:** the public frontend is privacy-light, but source retention and provider transfer policies remain underspecified.

- [ ] Define retention periods for raw feeds, excerpts, review prompts, model outputs, health artifacts, sessions, and audit records.
- [ ] Record source license and robots decisions with each candidate and enforce a deletion policy.
- [ ] Document whether source excerpts are sent to external model providers and under what contractual controls.
- [ ] Avoid adding analytics until consent, minimization, retention, and opt-out behavior are specified.
- [ ] Add a privacy notice and operator data-processing record before public launch.

**Priority:** P1; P0 if private or licensed source content is processed by a third-party provider without authorization.

### 9. Accessibility specialist

**Assessment:** the semantic list, skip link, keyboard map controls, drawer focus trap, and reduced-motion path are strong. The audit still needs browser assistive-technology verification.

- [ ] Verify with NVDA/VoiceOver/TalkBack on the deployed build.
- [ ] Verify focus restoration to the originating story control after drawer close.
- [ ] Verify focus-visible contrast, target size, heading order, live-region announcements, and error-state announcements.
- [ ] Verify the SVG interactive groups are announced consistently across browsers; preserve the list as the canonical fallback.
- [ ] Add automated axe-core checks when the browser test harness is introduced.

**Priority:** P1, with focus restoration promoted to P0 if the drawer is a primary reading path.

### 10. Frontend performance / browser reviewer

**Assessment:** initial bundle splitting, deterministic reduced-motion layout, visibility avoidance, responsive CSS, and visual snapshot coverage are good.

- [ ] Run browser measurements for LCP, CLS, INP, memory, and Explore chunk latency at mobile throttling profiles.
- [ ] Test long editions and relationship-heavy graphs; cap node count or degrade gracefully.
- [ ] Add cache headers and immutable hashed-asset policy at the CDN.
- [ ] Remove or self-host third-party font dependency if privacy, reliability, or layout stability requires it.
- [ ] Keep source maps private or ensure they do not expose sensitive operator code.

**Priority:** P1; physical-device battery testing remains environment-dependent.

### 11. QA / release engineer

**Assessment:** unit and contract coverage is credible, but end-to-end release evidence is incomplete.

- [ ] Add browser E2E tests for Read mode, deep links, stale/fallback/error states, Explore loading, reduced motion, drawer focus, and immutable editions.
- [ ] Add a release smoke test against the built static output, including MIME types for RSS and sitemap.
- [ ] Add dependency audit and license checks to CI with an explicit vulnerability exception process.
- [ ] Add rollback verification to the release pipeline.
- [ ] Make the 14-edition canary a tracked artifact with operator identity, sampled stories, edition checksum, and pass/fail reason.

**Priority:** P0 for E2E publication/read-path smoke tests; P1 for broader quality automation.

### 12. Operations / incident-response reviewer

**Assessment:** kill switch, audit events, operator decisions, corrections, and alerting are valuable. The operational runbook needs tested procedures.

- [ ] Define on-call ownership, severity levels, contact paths, and incident commander role.
- [ ] Document and rehearse kill switch, rollback, source pause, provider disablement, credential rotation, and correction publication.
- [ ] Ensure operator API health does not expose detailed exception text to clients.
- [ ] Add audit-log export/retention and tamper-evidence expectations.
- [ ] Define break-glass access with time limit and mandatory post-incident review.

**Priority:** P0 for rollback/kill-switch rehearsal; P1 for governance.

## Cross-panel risk register

| ID | Risk | Severity | Release gate | Owner |
|---|---|---:|---|---|
| R-01 | Operator `returnTo` may permit an open redirect | High | Blocker | Backend/security |
| R-02 | Production security headers are not defined in the app/deployment contract | High | Blocker | Platform |
| R-03 | HTTP URLs are accepted by backend/frontend contracts | High | Blocker | Data/backend |
| R-04 | Frontend silently turns missing claims into a panel-supported fallback claim | High | Blocker | Editorial/frontend |
| R-05 | Publication uses local filesystem and ambiguous persistence fallback | High | Blocker | Platform/SRE |
| R-06 | Edition publication emits `edition: 0` | High | Blocker | Backend |
| R-07 | No durable scheduler/replay/restore drill | High | Blocker for autonomous publishing | SRE |
| R-08 | No browser E2E or deployed assistive-technology evidence | Medium | Required before public launch | QA/accessibility |
| R-09 | Placeholder canonical/RSS/sitemap host remains | Medium | Required before deployment | Release |
| R-10 | Provider/model provenance and data-retention policy incomplete | High | Blocker for external provider use | AI governance/privacy |
| R-11 | No formal dependency/SBOM/secret scanning gate | Medium | Required before public launch | Supply chain |
| R-12 | Real-device and 14-edition canary evidence unavailable | Medium/High | Required before broad launch | Release/operator |

## Recommended release gates

### Gate 0 — security and trust blockers

Must be green before any external user can rely on the service:

- Same-origin redirect allowlist.
- HTTPS-only public URLs and evidence.
- Security headers at the deployed edge.
- No unverifiable fallback claim language.
- Real immutable edition identity.
- One explicit production persistence mode.
- Provider provenance and data-use decision.

### Gate 1 — controlled staging

- Browser E2E suite passes against the built artifact.
- Static MIME and cache behavior verified.
- Database outage, provider outage, source outage, and rollback drills pass.
- Operator authentication, authorization, CSRF/origin policy, and audit logs reviewed.
- Accessibility smoke test passes on at least one screen reader/browser pair.

### Gate 2 — 14-edition canary

For each edition retain:

- edition date/ID and publication checksum;
- run ID and source-health artifact;
- reviewer/provider/prompt provenance;
- human sampler identity and sampled story IDs;
- corrections and incidents;
- rollback decision, if any.

No autonomous public publishing should be enabled until all 14 editions pass without an unresolved P0 and with documented human sampling.

## Ordered execution plan

1. Close R-01 through R-06 with tests.
2. Add security headers, HTTPS URL policy, CSRF/origin controls, and deployment configuration.
3. Choose and document the durable production topology; remove contradictory persistence fallbacks.
4. Add browser E2E, dependency/SBOM/secret scanning, and built-output smoke tests.
5. Run staging failure/rollback/accessibility drills.
6. Replace placeholder hostnames and verify deployed RSS/sitemap MIME and content.
7. Run the 14-edition canary with human sampling.
8. Re-review the risk register and make the final release decision.

## Follow-up status after blocker pass

Closed or materially reduced in the implementation pass:

- R-01: OIDC `returnTo` is now restricted to same-origin relative paths, with regression coverage.
- R-03: backend candidate/review/claim evidence URLs now require HTTPS; frontend normalization rejects unsafe URLs.
- R-04: fallback stories no longer claim panel support when claim-level evidence is absent.
- R-06: edition publication now requires a positive configured `EDITION_NUMBER`; the workflow passes it from repository configuration.
- R-02: a deployable `_headers` policy now provides CSP, HSTS, frame protection, referrer policy, and permissions policy for compatible static hosts.
- Operator mutations reject cross-origin requests when an `Origin` header is present.

Still open and intentionally not hidden:

- Durable persistence/topology and removal of the orchestrator's JSON fallback.
- Full CSRF token policy, rate limiting, dependency/SBOM/secret scanning, and database certificate verification.
- Browser E2E, production-host verification, failure-injection drills, and 14-edition human canary.

## Final panel decision

**Near production-ready frontend:** yes, pending deployed browser/accessibility and real-device evidence.  
**Near production-ready backend:** improved, but not yet ready for autonomous public publishing until the remaining operational and security items above are closed.  
**React Three Fiber:** remain out of scope for the first production release. The current SVG/list implementation satisfies the product goal with less runtime, accessibility, and operational risk.
