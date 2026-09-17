# Production canary runbook

> **IMPORTANT / MUST DO:** Use the full [14-edition production release gate](./PRODUCTION_CANARY_14_EDITIONS.md) before enabling unattended publishing.

The public edition now renders claim-level evidence and correction history. A canary edition must pass the checks below before unattended publishing.

## Automated check

After an approved edition and health artifact exist:

```bash
npm run canary:check -- --sampled-by "operator@example.com" --record
```

The check fails closed when:

- `news.json` contains pending/rejected stories
- A published story has no claims
- A claim lacks evidence
- Retrieval health is critical
- The health artifact is older than 36 hours
- No human sampler is named

The last 14 records are kept locally in `data/canary-runs.json` during the canary. In production, move this record to the operations database.

## Fourteen-edition gate

For each edition:

- [ ] Retrieval completed with no critical health alert.
- [ ] At least one operator sampled every published story.
- [ ] Every public claim has an evidence URL and excerpt where available.
- [ ] No unsupported claim reached `news.json`.
- [ ] Reviewer disagreements were resolved or escalated.
- [ ] Corrections were recorded, not silently edited.
- [ ] Last-known-good rollback was tested at least once.
- [ ] Source outage and kill-switch behavior were observed.
- [ ] Story/source click-through and completion metrics were recorded.

Stop the canary if there is a material factual error, missing evidence, authentication/audit failure, silent correction, or a publication during kill-switch state.

After 14 consecutive passing editions, review source mix, correction rate, false negatives, alert volume, and operator time before enabling unattended publication.
