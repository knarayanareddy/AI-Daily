# Local staging integration

This stack exercises the real PostgreSQL and OIDC code paths without using production credentials.

## Prerequisites

- Docker Desktop or Docker Engine with Compose v2
- Node.js 20+

## Start dependencies

```bash
cd staging
docker compose up -d
cd ..
set -a; source staging/.env.example; set +a
npm run ops:server
```

Open `http://localhost:4174/ops.html`, choose login, and use the staging OIDC account:

```text
email: operator@example.com
password: password
```

Replace the fixture credentials before sharing the staging stack. Do not use these values outside local staging.

## Smoke checks

In a second terminal:

```bash
curl -i http://localhost:4174/api/ops/health
# Expected: 401 and a login hint

curl -i -c /tmp/ai-daily-cookies.txt -b /tmp/ai-daily-cookies.txt \
  http://localhost:4174/auth/login
```

The browser flow is the authoritative OIDC check. After login, verify:

1. `/api/ops/health` returns 200.
2. Approving a review creates a row in `ops_decisions`.
3. `ops_audit` contains the matching decision event.
4. Pausing a source survives a server restart.
5. Enabling the kill switch causes publish requests to return 409.
6. Disabling it permits a publication run to start.
7. Expired sessions are rejected.

Inspect the database:

```bash
docker compose exec postgres psql -U ai_daily -d ai_daily \
  -c 'select subject,email,expires_at from ops_sessions;' \
  -c 'select cluster_id,decision,actor_subject from ops_decisions;' \
  -c 'select event_type,actor_subject,created_at from ops_audit order by id desc limit 20;'
```

## Stop and reset

```bash
docker compose down -v
```

The `-v` flag deletes the staging database volume. Never run it against a production project.
