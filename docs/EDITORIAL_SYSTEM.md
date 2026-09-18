# AI Daily: expert review and operating plan

## Feasibility

Yes. A daily AI briefing is technically straightforward; the hard part is maintaining trust. The recommended system separates **retrieval**, **judgment**, and **publishing**. Automated agents can scan and compress a large information space, but publication requires evidence, source quality, and a consensus gate.

## The panel discussion

### Round 1 — four independent personas

**Mara, newsroom editor:** “Start with a finite allowlist. Primary research, official release notes, regulators, and a small number of outlets with a correction history. A large scrape is not a quality strategy.”

**Ishan, ML systems engineer:** “Make every item a structured record: canonical URL, publisher, timestamp, claims, entities, embedding cluster, and confidence. Jobs must be idempotent so a retry cannot duplicate a story.”

**Priya, fact-checker:** “Require two independent sources for consequential claims, or one primary source that directly supports them. Keep the original wording and an evidence trail; summaries are not evidence.”

**Jon, audience editor:** “Optimize for reader value, not volume. Every published item should answer: what changed, why does it matter, and what should a smart reader watch next?”

**Round 1 result:** strong foundation, but not yet unanimous. Mara and Priya require an explicit human escalation path for uncertain or high-impact stories.

### Round 2 — challenge and revision

The panel tested three options:

1. **Fully autonomous publishing:** rejected. Fast, but too vulnerable to hallucinated summaries, source drift, and reputational damage.
2. **Human-only curation:** rejected. High quality, but does not meet the daily, low-intervention requirement reliably.
3. **Automated scout + multi-agent review + exception-based human approval:** accepted. It preserves speed while making uncertainty visible and giving humans a small, focused queue.

### Final consensus

All four agree the best solution is a **selective, evidence-first, consensus-gated pipeline**:

> Allowlisted feeds are fetched daily. A normalizer removes duplicates and extracts claims. Four independent reviewer personas score novelty, significance, evidence quality, and reader usefulness. Stories publish only when the confidence threshold is met and no reviewer raises a red flag. Ambiguous, consequential, or conflicting stories go to a human review queue. Every output retains provenance.

This is the best fit for “latest and greatest” without sacrificing trust. The panel would revisit the decision if error rates, source mix, or coverage gaps changed materially.

## Production architecture

```text
GitHub Actions / managed cron (06:00 UTC)
  -> fetch allowlisted RSS + APIs (timeouts, retries, rate limits)
  -> normalize + canonicalize URLs
  -> deduplicate / cluster related items
  -> extract claims + evidence links
  -> reviewer agents (parallel, independent prompts)
  -> consensus gate + human exception queue
  -> write versioned data/news.json
  -> deploy static frontend + notify on failures
```

### Recommended source policy

Maintain a version-controlled allowlist with tiers:

- **Tier 1:** official lab blogs, papers, changelogs, regulators, standards bodies.
- **Tier 2:** established specialist publications with transparent corrections.
- **Tier 3:** analyst commentary and social posts, used only as leads and never as sole evidence.

Store `publisher`, `source_tier`, `published_at`, `retrieved_at`, `canonical_url`, and `evidence_urls` for every item. Never silently replace an original story; append corrections.

### Quality gate

Score each candidate from 0–5 on novelty, impact, evidence, clarity, and reader value. Publish when the weighted score is at least 3.8, evidence is present, and at least 3 of 4 personas agree. Always escalate safety incidents, legal claims, health claims, and conflicting primary sources. Log each agent's rationale and prompt version.

### Reliability and safety best practices

- Use UTC, a fixed daily cutoff, and a unique run ID.
- Make fetch, scoring, and publish steps retryable and idempotent.
- Cap article length and sanitize HTML before rendering.
- Never send secrets to prompts; keep API keys in repository secrets.
- Add a kill switch and a last-known-good deploy.
- Track fetch success, source freshness, consensus rate, corrections, and time-to-publish.
- Start with a small allowlist and manually review the first 2–4 weeks.

## Cron implementation checklist

1. Create `data/sources.yml` as the allowlist and `data/news.json` as the published contract.
2. Implement the fetcher with conditional requests, backoff, and a 15-minute timeout.
3. Add schema validation before any write.
4. Run reviewer personas in parallel, then apply the deterministic consensus gate.
5. Write to a temporary file, validate, atomically replace `news.json`, and deploy.
6. Alert on a failed run, zero fresh sources, or an unusual drop in consensus.
7. Review weekly: remove weak sources, add gaps, and sample published summaries against primary evidence.

The frontend in this repository is intentionally static and deployable to any CDN. The data contract above lets a scheduled worker populate it without coupling the presentation layer to an LLM provider.
