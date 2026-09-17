# AI Daily

A calm, curated daily briefing for the AI ecosystem. The frontend is a dependency-free static site; the editorial automation blueprint is in [`docs/EDITORIAL_SYSTEM.md`](docs/EDITORIAL_SYSTEM.md). The adversarial review in [`docs/CRITIQUE.md`](docs/CRITIQUE.md) records the remaining production risks: this repository is a prototype and the cron currently collects candidates but deliberately does not publish unreviewed stories. The design council’s novel layout and interaction plan is in [`docs/DESIGN_RESEARCH.md`](docs/DESIGN_RESEARCH.md). The research council’s competitor/framework scan and revised execution plan is in [`docs/RESEARCH_COUNCIL.md`](docs/RESEARCH_COUNCIL.md). The backend architecture, domain-expert review, data contracts, implementation milestones, and launch checklist are in [`docs/BACKEND_PLAN.md`](docs/BACKEND_PLAN.md). The human review and operations control room is available at [`ops.html`](ops.html), with the runbook in [`docs/OPS_RUNBOOK.md`](docs/OPS_RUNBOOK.md). Claim-level evidence, corrections, and the production canary checklist are documented in [`docs/CANARY_RUNBOOK.md`](docs/CANARY_RUNBOOK.md). **Before unattended publishing, you must complete the 14-edition release gate in [`docs/PRODUCTION_CANARY_14_EDITIONS.md`](docs/PRODUCTION_CANARY_14_EDITIONS.md).** The multi-persona frontend architecture, component plan, accessibility, performance, 3D, and testing checklist is in [`docs/FRONTEND_PLAN.md`](docs/FRONTEND_PLAN.md).

## Run locally

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

## What is included

- Responsive editorial frontend with topic filters, search, dark mode, and newsletter CTAs.
- A consensus-first editorial operating model: Scout → Challenge → Agree.
- Source allowlisting, deduplication, evidence checks, quality scoring, and a human override path.
- A production-minded daily cron blueprint with idempotency, observability, and rollback guidance.
