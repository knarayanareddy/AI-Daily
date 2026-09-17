# Adversarial review of the AI Daily plan

The original proposal was deliberately stress-tested by six independent personas. They were asked to assume that the briefing has a reputation to lose, that the cron job will fail occasionally, and that LLM output can be confidently wrong.

## Panel findings

### 1. Newsroom editor — **high risk: quality drift**

The source allowlist is a good start, but source tier is not the same as story quality. Official blogs can be marketing, and reputable outlets can repeat an error. Add per-source correction history, topical coverage targets, and a weekly sample audit. Do not let the “latest” constraint force a weak item into the edition.

### 2. Distributed-systems engineer — **high risk: publishing atomicity**

A scheduled job that writes directly to the public JSON can publish half-finished or unreviewed data. Fetching, reviewing, and publishing must be separate artifacts. Use `candidates.json` for the fetch stage, then atomically replace `news.json` only after schema validation and the consensus gate. Add a lock/run ID so overlapping cron runs cannot race.

### 3. Fact-checker — **critical: evidence is not verification**

A URL proves that a page exists, not that a summary is accurate. Store claim-level evidence and the exact excerpt used. Require a primary source for product/research claims and two independent sources for consequential claims. If the page is unavailable or changed, quarantine the item rather than publishing it.

### 4. ML safety reviewer — **critical: prompt and model failure modes**

Four agents are not independent if they share the same model, prompt, context, or retrieval mistake. Independence needs different instructions, limited shared context, structured JSON output, and ideally model/provider diversity. Test prompt injection in article text; treat fetched content as hostile data, never as instructions.

### 5. Privacy and security engineer — **high risk: unnecessary attack surface**

Do not send full article bodies or secrets to an LLM provider. Minimize retained content, redact emails and personal data, sanitize every rendered field, pin dependencies, and use least-privilege GitHub tokens. A public Git commit containing generated article text may create licensing or takedown problems.

### 6. Audience editor — **medium risk: “consensus” can become blandness**

A unanimous panel can systematically reject surprising but important stories. Track false negatives and “notable misses,” reserve a clearly labeled outlier slot, and measure reader saves/clicks/corrections—not only agreement rate. The audience needs context, not just a ranked list of headlines.

## Round-two rebuttal and resolution

The panel initially disagreed about whether human review violated the “without intervention” requirement. They resolved it by distinguishing **routine publication** from **exception handling**: routine, low-risk stories may ship automatically; high-impact, low-confidence, conflicting, or legally sensitive stories must wait in a review queue. A kill switch and last-known-good edition are mandatory.

All six agreed on the following revised design:

1. Fetch into an immutable, evidence-linked candidate artifact.
2. Cluster and deduplicate before any LLM sees the material.
3. Run independent, structured reviewers with prompt-injection defenses.
4. Apply deterministic thresholds and hard vetoes outside the model.
5. Publish only a validated, signed/versioned artifact, atomically.
6. Keep human review for exceptions and measure errors and misses.

## Is the current implementation the best one?

**No—not yet.** It is a strong prototype and a good product direction, but it is not production-ready because the current worker fetches candidates and writes them directly into `data/news.json` with `consensus: "pending"`. The frontend can therefore display unreviewed material. The worker also does not yet run reviewer agents, store claim-level evidence, lock overlapping runs, or send failure alerts.

This repository now treats `news.json` as the reviewed/public contract and `candidates.json` as the private intermediate artifact. The next production increment should implement the reviewer adapter and deterministic publication gate before enabling autonomous daily deploys.

## Go/no-go gate before public launch

- [ ] No candidate with `review.consensus = pending` can reach the frontend.
- [ ] Schema validation and atomic writes are covered by tests.
- [ ] At least 14 days of canary runs with a human sampling every edition.
- [ ] Alerts exist for source outages, empty runs, duplicate spikes, and corrections.
- [ ] Takedown/correction process and source licensing policy are documented.
- [ ] A reviewer failure fails closed and preserves the last-known-good edition.
