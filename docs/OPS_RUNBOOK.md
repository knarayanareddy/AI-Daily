# Operations control room

The operator interface is available at [`/ops.html`](../ops.html).

## What it does

- Review pending and escalated story clusters.
- Inspect evidence links and panel position.
- Record approve/reject/escalate decisions.
- View source health and 14-run reliability where health artifacts exist.
- View alert history.
- Export decisions as a JSON artifact.
- Toggle a local kill-switch state for operator workflow rehearsal.

## Operations API and database

The operations API now requires PostgreSQL and OIDC authentication. Create the database, set `DATABASE_URL`, and start it with:

```bash
DATABASE_URL='postgres://user:password@host:5432/ai_daily' \
OPS_OIDC_ISSUER='https://id.example.com' \
OPS_OIDC_CLIENT_ID='ai-daily-ops' \
OPS_OIDC_CLIENT_SECRET='replace-with-secret' \
OPS_OIDC_REDIRECT_URI='https://your-domain.example/auth/callback' \
OPS_ALLOWED_DOMAIN='your-company.example' \
PORT=4174 npm run ops:server
```

The server runs migrations at startup and stores sessions, decisions, state, auth flow state, and audit events in PostgreSQL. It no longer reads or writes JSON operator persistence files. The database layer uses transactions for decisions, state changes, audit events, and authorization-code state consumption.

Open `https://your-domain.example/ops.html`; operators authenticate through OIDC Authorization Code + PKCE. Sessions are opaque, hashed before database storage, HttpOnly, Secure, SameSite cookies with an eight-hour expiry.

Set `OPS_ALLOWED_EMAILS` as a comma-separated allowlist or `OPS_ALLOWED_DOMAIN` to restrict operator access. The OIDC provider must be configured with the callback URL above.

If the API is unavailable, the UI may render its static fallback for design review, but mutating controls cannot operate and no local fallback decision is production-valid.

## Production API contract to implement next

```text
GET  /ops/health
GET  /ops/sources
GET  /ops/review-queue?status=pending
GET  /ops/alerts
POST /ops/reviews/:clusterId/decision
POST /ops/sources/:sourceId/pause
POST /ops/runs/:runId/retry
POST /ops/publishing/kill-switch
GET  /ops/corrections?edition_id=...
POST /ops/corrections
GET  /ops/editions/:date
```

Every mutating endpoint must require authenticated operator identity, CSRF protection, an idempotency key, and an audit record containing actor, reason, prior state, new state, and run ID.

## Review policy

- Approve only when evidence supports the claims and no hard escalation applies.
- Reject duplicates, unsupported claims, or low-value items with a reason.
- Escalate legal, safety, health, election, privacy, and conflicting-primary-source items.
- A manual decision cannot bypass the edition schema validator or evidence requirement.
- The kill switch must preserve the current last-known-good edition and block publication, not delete data.
