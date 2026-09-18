# AI Daily — Master Editorial and Build Template

**Purpose:** This is the operating template for creating the next AI Daily edition with the same editorial discipline, information architecture, evidence standards, accessibility, and product behavior as the current build.

Use this document before every daily briefing. It is both:

1. an **editorial recipe** for researching, selecting, checking, and writing the edition; and
2. a **product contract** for preserving the frontend’s structure, interaction behavior, privacy boundaries, and publication workflow.

It is a guide for a human-approved proposed edition. It is not permission for an agent to publish autonomously.

---

## 1. The product in one sentence

AI Daily is a finite, evidence-first briefing that helps a reader understand **what changed, why it matters, what remains uncertain, and what to inspect next**—without turning the news into a feed, a popularity contest, or an AI-generated debate.

## 2. Non-negotiable editorial principles

1. **Evidence before novelty.** A surprising story without inspectable support is not a publishable signal.
2. **Finite over exhaustive.** Curate a small number of consequential developments. The intended daily shape is up to 25 signals, not an unfiltered firehose.
3. **One event, one record.** Cluster duplicate coverage into one story and attach the relevant source trail.
4. **Primary sources first.** Prefer papers, official release notes, regulator documents, standards, filings, public repositories, incident notices, and accountable reporting with a correction history.
5. **Company claims remain claims.** Do not call a product safe, superior, transformative, or widely adopted unless the evidence supports that wording.
6. **Calibrate confidence.** Use `verified`, `corroborated`, `developing`, `disputed`, or `corrected` honestly. The posture must never be stronger than the evidence.
7. **Separate record from interpretation.** Make clear what the source says, what AI Daily infers, and what remains unknown.
8. **Do not force both sides.** Include a counterpoint only when there is a real evidentiary disagreement or material limitation—not as artificial balance.
9. **Safety incidents stay non-operational.** Explain consequence and accountability without providing abuse instructions, exploit steps, or sensitive operational detail.
10. **No invented material.** Never invent quotations, experts, consensus, historical context, images, source relationships, user feedback, or “what changed” claims.
11. **Every story earns its place.** A candidate must be timely, consequential, sourceable, and useful to a reader today.
12. **Human approval remains the publication gate.** Agents may scout, cluster, draft, and challenge; an approved person decides what becomes public.

---

## 3. The daily workflow

### Phase A — Open the checklist

Before researching, open:

- `docs/DAILY_EDITORIAL_RUNBOOK.md`
- `docs/EDITORIAL_SYSTEM.md`
- `docs/IMPLEMENTATION_CHECKLIST_INTERACTION_2026-09-18.md`
- the latest relevant council review in `docs/`

Create or update a dated run note containing:

- edition date and intended edition number;
- UTC cutoff and retrieval window;
- agent/reviewer names or roles;
- source set used;
- candidates considered and rejected;
- unresolved questions;
- human approver;
- validation results.

Every phase starts with a gate and ends with a review. Do not silently expand the scope of a daily run.

### Phase B — Scout

Use an allowlisted source mix. Search broadly for leads, but publish narrowly.

**Tier 1 — direct records:** official lab/company announcements, papers, datasets, release notes, regulator notices, standards bodies, court/filing records, public repositories, incident reports.

**Tier 2 — accountable reporting:** established specialist or general outlets with named reporting, links to primary records, and a correction history.

**Tier 3 — leads only:** analyst commentary, newsletters, social posts, screenshots, and unattributed claims. These may point to a story but are not sufficient as sole evidence for publication.

For each candidate capture:

```text
candidate_id
working_title
canonical_url
publisher
author if available
published_at
retrieved_at
source_tier
entities/topics
initial claim(s)
why it may matter
what is not yet known
related candidate IDs
```

Do not write the public edition while scouting. Preserve rejected candidates and the reason for rejection.

### Phase C — Cluster and select

Cluster articles that describe the same event. Select the event record, not the loudest headline.

A candidate is eligible when it has:

- a distinct event or meaningful new development;
- a canonical source URL;
- at least one defensible claim;
- a clear consequence for people, builders, institutions, policy, or the AI field;
- a reason it belongs in this edition rather than a later archive;
- wording that can be made accurate without speculation.

Escalate rather than publish when the item involves:

- safety, security, health, legal, employment, elections, or vulnerable people;
- conflicting primary sources;
- a large or irreversible consequence;
- unclear provenance or a rapidly changing claim;
- a source that cannot be inspected;
- a potentially defamatory allegation.

The intended mix should cover the day’s real signal, not a quota for its own sake. Categories may include research, product, policy, society, compute, infrastructure, safety, and open models. Do not add a category merely to make the distribution look balanced.

### Phase D — Fact-check and write the claim ledger

For each selected story, list the smallest set of public claims needed to explain it. For every claim, record:

- exact claim wording;
- evidence URL(s);
- source excerpt or location;
- source role (primary record, corroboration, analysis, limitation);
- evidence posture;
- what the source does not establish;
- what would change the assessment.

A source link is not evidence by itself. The reviewer must be able to follow the link and see why it supports the wording.

Use two independent sources for consequential claims where possible. One direct primary source can be sufficient for a narrow fact that it directly establishes. If the only source is an interested party, label it as such and avoid stronger wording.

### Phase E — Editorial council review

Run independent reviews before synthesis. The same council roles should challenge one another:

- **Managing/newsroom editor:** finite selection, hierarchy, clarity, and scope.
- **Evidence editor/fact-checker:** claim-to-source fit, excerpts, posture, and correction risk.
- **Subject-matter editor:** technical accuracy and meaningful limitations.
- **Social verification editor:** provenance of social or public commentary; no unverified expert amplification.
- **Public-interest editor:** consequence, vulnerable groups, safety, and non-operational incident treatment.
- **Accessibility/product editor:** text-first fallback, keyboard semantics, labels, focus, mobile reading order.
- **Audio editor:** transcript and correction readiness; does not force audio into the edition.
- **Independence/rights editor:** image and quotation rights, copied-content risk, platform dependency.
- **Audience editor:** whether a smart reader can understand why this matters and what to do with it.
- **Performance engineer:** payload size, static hosting, runtime cost, and no unnecessary network dependency.

Each reviewer should answer:

```text
What is the strongest supported version of this story?
What is overstated or missing?
What evidence is decisive?
What would change my mind?
Should this be published, held, or rejected?
```

Synthesize disagreements explicitly. Do not average away a red flag.

### Phase F — Human approval and publication

Before writing or replacing public files, confirm:

- all selected stories have claim-level evidence;
- every canonical URL is HTTPS and inspectable;
- every image is approved/licensed, distinct, and has a useful alt treatment;
- every story has a unique event ID;
- the edition date, run ID, and story order are immutable;
- safety and correction paths are documented;
- the approver has reviewed the complete packet, including rejected candidates and unresolved questions.

Use atomic writes and preserve the last-known-good edition. Never publish an unreviewed candidate just because the scheduled run completed.

---

## 4. The edition’s organisation

The reader experience is a calm, text-first briefing with progressive enhancement.

### 4.1 Header and identity

The page begins with:

- edition number;
- publication date in a stable UTC-derived format;
- “Free daily briefing” identity;
- site header and theme control;
- skip link for keyboard users.

The edition should feel like a publication, not a dashboard. Do not add arbitrary layout variation between days.

### 4.2 Edition header

The header states the editorial promise and the day’s framing. It may include a concise intro or method cue, but it must not become an unsupported editorial essay.

### 4.3 Topic filters and search

The accessible list is canonical. Filters and search are optional conveniences that narrow the same approved story set. They must not hide evidence or create a second version of the edition.

### 4.4 “On this edition” contents navigation

Use a clearly labelled contents navigation. It should expose only sections present in the edition:

- 25 Signals / the approved story count;
- Deep Dive, when present;
- Tool Focus, when present;
- Cool Project Alert, when present;
- Five-Minute Experiment, when present;
- Evidence Desk;
- Change Ledger and One Consequential Number, when present.

Recurring modules must be findable and clearly named.

### 4.5 Main signal list

The story list is the heart of the edition. Each story card contains:

- sequential number;
- distinct approved illustration or a text-safe fallback;
- treatment label;
- evidence posture;
- topic and relative/edition time label;
- title;
- three compact facts tailored to the treatment;
- optional reader question;
- Evidence Desk action;
- source and receipt count.

The card is a doorway to evidence, not a replacement for it.

### 4.6 Sidebar

The sidebar reinforces:

- **Editorial consensus / Evidence comes first:** every published story carries inspectable claims and sources;
- **Newsletter signup:** only show a real hosted subscription destination when provider, consent, unsubscribe, branding, domain, delivery, and free-tier limits are documented. Do not collect an address into a void.

### 4.7 Supporting modules

After the main list, render only approved, validated modules in the edition data:

1. Deep Dive
2. Tool Focus
3. Cool Project Alert
4. Five-Minute Experiment
5. Change Ledger
6. One Consequential Number
7. Evidence Desk / Method

The order is deliberate: the reader first receives the signal set, then optional depth, practical utility, and provenance.

### 4.8 Progressive exploration

The 2D signal map and 3D signal field are optional explorations. Read mode and the accessible list remain canonical. A reader must never need WebGL, animation, color, or spatial navigation to understand the edition.

---

## 5. How to write each story

### 5.1 Story title

Write a specific, restrained headline. It should identify the event or decision, not merely repeat a company slogan. Avoid:

- “game changer,” “revolutionary,” “proves,” “solves,” or “first” without proof;
- certainty when evidence is developing;
- clickbait or fear amplification;
- a claim broader than the cited source.

### 5.2 Dek

The dek is the reader’s orientation: one or two sentences covering the development and its significance. It should add context rather than repeat the title.

### 5.3 Three facts

Use the treatment’s labels to answer:

1. **What moved?** What actually happened?
2. **Why does it matter?** Who or what is affected?
3. **What is the tension/unknown?** What is not established yet?

For a story whose evidence is still developing, say so. If there is no meaningful tension, do not manufacture one.

### 5.4 Reader question

The optional `discussion_prompt` should invite inspection, comparison, tracing, challenge, following, saving, or forecasting. It must be specific to the evidence and must not encourage harassment, dogpiling, or unsupported speculation.

Examples of useful forms:

- “What result would make this benchmark less persuasive?”
- “Which part of the release is independently verified?”
- “What should we check when the next update lands?”

### 5.5 Story treatments

Choose a treatment because it clarifies the evidence, not because variety is decorative.

| Treatment | Use when | Writing emphasis |
|---|---|---|
| `dispatch` | A straightforward consequential development | move, consequence, unknown |
| `launch_anatomy` | A product/model release needs inspection | what shipped, capability, constraint |
| `research_note` | A paper or experiment is the signal | method, result, limitation |
| `incident_file` | A failure, breach, or safety event matters | verified record, impact, response, non-operational unknown |
| `power_map` | Institutions, incentives, or control are central | actors, leverage, affected parties |
| `tradeoff` | Benefits and costs are genuinely linked | gain, cost, who bears it |
| `field_note` | A grounded observation adds useful context | observation, context, uncertainty |
| `forecast` | A sourceable near-term implication is worth tracking | prediction, basis, resolution signal |
| `claim_counterclaim` | Evidence genuinely conflicts | claim, counterclaim, deciding evidence |
| `human_receipt` | A documented human consequence is central | person/group, record, limits, dignity |
| `before_after` | A documented change can be compared | before, now, significance |
| `source_trail` | Provenance itself is the reader value | origin, chain, confidence |

Treatment does not permit invention. A `claim_counterclaim` card does not require two equal sides, and a `human_receipt` card must not fabricate a personal story.

### 5.6 Evidence posture

Use exactly one appropriate posture:

- `verified`: directly established by a strong source;
- `corroborated`: supported by multiple independent sources;
- `developing`: credible but incomplete or still changing;
- `disputed`: credible sources materially disagree;
- `corrected`: the record has an explicit correction.

A posture is not a score or a style label. It is an editorial warning to the reader.

---

## 6. Evidence Desk and Claim Lens

The Evidence Desk is the consistent provenance layer. Every approved story should expose:

- primary source;
- claim list;
- direct evidence URLs;
- excerpts when available;
- corrections;
- authored “What changed” context only when supplied in the approved data;
- limitations and posture.

The current Claim Lens behavior is intentionally bounded:

- each claim expands independently;
- source links remain visible before expansion;
- the expanded view shows the supplied excerpt and source-role context;
- no new evidence is generated in the drawer;
- no claim is rewritten based on reader interaction;
- empty claim evidence gets an explicit fallback warning;
- focus is moved into the drawer and Escape closes it;
- native buttons, links, labels, textarea, input, and select provide keyboard/text semantics.

`signal.why_now` may be shown as **WHAT CHANGED** only when it is already authored in the approved story data. It must never be inferred from local reader behavior or invented by the frontend.

Corrections are append-only editorial records. Do not silently mutate the original claim or erase the correction history.

---

## 7. Tool Focus

`tool_focus` is an editorially selected practical tool, not an advertisement and not a generic “AI tools” listicle.

Required fields:

```json
{
  "name": "Tool name",
  "url": "https://…",
  "what": "What it does, accurately",
  "why_now": "Why it belongs in this edition",
  "how_to_try": ["A safe first step"],
  "catch": "The most important limitation or cost",
  "rave": "The genuinely useful strength",
  "reality": "What a careful user should expect",
  "evidence_posture": "verified | corroborated | developing | disputed | corrected",
  "alternative": "A credible alternative or non-tool route",
  "related_signal_number": 0,
  "image_url": "optional approved asset"
}
```

Curation rules:

- Prefer a tool with a clear connection to a selected signal.
- Describe capabilities from inspectable documentation or hands-on testing.
- Include privacy, data retention, pricing, account, license, or lock-in caveats when relevant.
- Never imply endorsement, safety, or superiority without evidence.
- Give a safe first try that does not require sensitive data.
- Do not include a tool solely because it is trending.

The module should answer: **What is it? Why now? How can I try it safely? What is the catch? What else could I use?**

---

## 8. Cool Project Alert

`cool_project_alert` is for an open, public, or independently useful project that a reader might inspect or try. It is not a promotional slot.

Required fields:

```json
{
  "name": "Project name",
  "repository_url": "https://…",
  "maintainer": "Named maintainer or organization",
  "license": "License as shown by the project",
  "why_cool": "Distinctive quality",
  "why_useful": "Concrete reader value",
  "try_first": "A bounded first step",
  "project_health": "Recent activity, releases, tests, docs, or other evidence",
  "caveat": "Important limitation, maturity, security, or maintenance risk",
  "verdict": "worth_trying_now | worth_watching | narrow_audience | immature",
  "related_signal_number": 0,
  "image_url": "optional approved asset"
}
```

Verify repository ownership, license, recent activity, installation instructions, and security posture. Do not recommend software that requires unsafe handling of secrets or personal data without making that risk prominent. A project with no meaningful health evidence should be “worth watching” or omitted.

---

## 9. Five-Minute Experiment

This is an optional, low-risk reader activity—not gamification and not a promise that an AI system is correct.

Required fields:

```json
{
  "title": "Short experiment title",
  "premise": "What the reader is testing",
  "steps": ["Step 1", "Step 2"],
  "observe": "What to look for",
  "safety_note": "Privacy, security, or scope warning"
}
```

Rules:

- no sensitive personal, employer, client, medical, financial, or secret data;
- no harmful or illegal instructions;
- no requirement to publish results publicly;
- make the observation measurable enough to be useful;
- state that the experiment is illustrative, not a benchmark or proof;
- do not use points, leaderboards, streaks, or social pressure.

---

## 10. Deep Dive and other editorial additives

Optional additions must pass a proof-of-value gate. Use them only when they answer a question that the main signals cannot answer efficiently.

### Deep Dive

A Deep Dive attaches to an existing story and must include:

- a precise question;
- a short answer clearly marked as AI Daily analysis;
- sections tied to claim IDs;
- source-backed visuals or snippets;
- expert perspectives with profile, retrieval time, perspective type, conflicts, verification, and evidence URLs;
- what would change our mind;
- a source trail with tier and retrieval time;
- editorial owner, moderation owner, safety note, correction path, and expiry;
- human approval record.

Never use a Deep Dive merely because a story is trending. Do not manufacture consensus from social posts. Social content is a lead or perspective unless provenance and context are verified.

### Change Ledger

Use when the reader benefits from a documented before/now comparison. Required fields include `before`, `now`, `significance`, and additive metadata. Do not infer the “before” state.

### One Consequential Number

Use one well-sourced number that changes understanding. Include value, unit, label, context, limitation, source metadata, and expiry. Do not use a large number as decoration.

### Future additive formats

Builder Watch, Unanswered Question, Source Trail, Decision Log, Safe Small Test, and Reader Field Note remain possible formats only when their evidence, owner, moderation, correction, and expiry requirements are defined.

---

## 11. Data contract for an edition

The frontend expects a validated edition object with this shape:

```json
{
  "edition": 185,
  "run_id": "2026-09-19-daily",
  "published_at": "2026-09-19T06:00:00Z",
  "stories": [],
  "tool_focus": null,
  "cool_project_alert": null,
  "five_minute_experiment": null,
  "editorial_additives": {}
}
```

Each story should include, at minimum:

```json
{
  "event_id": "stable-event-id",
  "title": "Accurate title",
  "dek": "Why it matters",
  "source": "PUBLISHER",
  "url": "https://canonical-source.example/story",
  "image_url": "/images/distinct-story-image.jpg",
  "category": "research",
  "published_at": "2026-09-19T04:00:00Z",
  "time": "2h ago",
  "tag": "Research",
  "claims": [
    {
      "claim": "Small, directly supportable claim",
      "supported": true,
      "evidence_urls": ["https://source.example/record"],
      "excerpt": "Exact or faithful source excerpt"
    }
  ],
  "corrections": [],
  "signal": {
    "move": "What moved",
    "consequence": "Why it matters",
    "tension": "What is uncertain",
    "why_now": "Authored edition delta, if applicable",
    "evidence_posture": "developing"
  },
  "discussion_prompt": "Specific question for inspection",
  "presentation": {
    "treatment": "research_note",
    "reader_action": "inspect",
    "section": "signals",
    "display_priority": "standard",
    "visual_mode": "documentary"
  }
}
```

Validation rules:

- evidence URLs must be HTTPS;
- every claim must have `supported: true` and at least one valid evidence URL;
- do not emit an additive unless its required fields and metadata validate;
- stable IDs must not change when an edition is rebuilt;
- do not silently coerce invalid public data into confident content;
- if the approved data is unavailable, show the last-known-good/fallback state rather than an invented edition.

The contract and normalization logic live in `src/lib/contracts.ts`. Keep new fields backward-compatible and update tests when extending the contract.

---

## 12. Images and visual treatment

Every story should have a distinct illustration or a deliberate text fallback. Do not recycle the same image across unrelated stories. The image must:

- be approved or licensed for use;
- correspond to the story without making an unsupported factual claim;
- have useful alternative text or an intentionally empty alt when decorative;
- not imply a person, event, or location that the source does not establish;
- not use a sensational visual for a safety incident.

Choose `visual_mode` to support the treatment: documentary, diagram, timeline, map, comparison, portrait, data, or collage. The mode is progressive enhancement; the written story remains sufficient without it.

---

## 13. Reader interactions and privacy contract

The current interaction set is deliberately local and optional:

- **Save for later:** browser-local toggle keyed by story/event.
- **What would change your mind?:** browser-local text note.
- **Private forecast:** browser-local date and confidence.
- **Claim Lens:** approved claims and evidence only.
- **What changed:** authored `why_now` only.

No reader text, forecast, or save is sent to the server. Local notes are not correction submissions. The interface must say this plainly.

Do not add public submissions, comments, rankings, social debate, points, or leaderboards without reopening the governance checklist and defining moderation, retention, privacy, takedown, ownership, and correction policy.

Interaction requirements:

- text-first/static fallback;
- native keyboard controls;
- visible labels and status messages;
- no color-only meaning;
- optional, never required to read the edition;
- no mutation of immutable editorial content;
- local-storage failure must not break story reading;
- preserve focus and provide Escape/close behavior for dialogs.

---

## 14. Accessibility and performance contract

Before approval, check:

- skip link reaches the briefing;
- headings form a logical outline;
- every interactive control has an accessible name;
- story images have appropriate alt text;
- evidence links are directly discoverable;
- dialog focus is managed and Escape closes it;
- keyboard users can reach all content without a map or 3D view;
- status messages use text and are not color-only;
- the list remains readable on narrow screens;
- the static fallback works when JavaScript, WebGL, or live data is unavailable.

Keep the app static-hosting friendly. Do not add a network request when local data or an existing contract is sufficient. The 3D signal field is already split as a progressive enhancement; preserve that boundary.

The project currently defers full browser, screen-reader, mobile/device, and WebGL validation. This is a known limitation, not a reason to claim those validations passed.

---

## 15. Free publication and email boundaries

The intended publication architecture is:

```text
approved edition JSON
  -> data/editions/YYYY-MM-DD.json
  -> archive/search generation
  -> Vite build
  -> GitHub Pages
```

Relevant commands include:

```bash
npm test
npm run build
npm run archive:build
```

GitHub Pages is configured to publish from `main`. A branch preview is not the public site. Before claiming deployment:

1. merge the approved change to the configured publication branch;
2. wait for the deployment to finish;
3. open the public URL;
4. verify edition number, date, story count, latest story content, and interaction behavior;
5. record the public URL and verification timestamp.

Email is not automatically or permanently free. Before activating it, document provider caps, branding, domain verification, sender reputation, double opt-in, unsubscribe handling, deliverability, privacy, and migration options. Keep provider secrets out of frontend code and use idempotency keyed by edition and run ID.

---

## 16. Corrections, archive, and immutable publication

A published edition is an immutable editorial record. If a story needs correction:

- append a correction record;
- identify the original claim;
- state the corrected wording;
- give the reason and timestamp;
- preserve the source trail;
- do not silently rewrite history;
- ensure the frontend displays correction history where available.

Keep edition files, archive indexes, RSS, sitemap, and search indexes consistent. Never let a failed new run overwrite the last-known-good public edition.

---

## 17. Things intentionally shelved for now

These items were discussed during the build but must not be smuggled into a daily run without a new decision and checklist.

### Public moderated participation

Not exposed yet. Before enabling, define:

- editor intake endpoint;
- authentication or abuse controls;
- privacy and retention period;
- moderation and takedown workflow;
- response ownership and correction SLA;
- distinction between a reader question, a correction report, and a public comment;
- immutable process for accepted corrections;
- deletion/export behavior and incident response.

### Audio

Not generated or published yet. Before enabling, define:

- narrator/guest policy and rights;
- approved text source;
- transcript and speaker-label requirements;
- timestamps and accessible HTML transcript;
- audio correction/takedown behavior;
- hosting and retention;
- whether audio is editorially additive rather than a second, drifting version of the story.

### Full integration validation

Full browser, screen-reader, keyboard, mobile/device, and WebGL validation is explicitly deferred. Do not report it as completed. Reopen a dated validation phase when this becomes resourced.

### Autonomous publishing

Rejected as a default. Automated scouting and review may continue, but candidates must not become public without the human approval gate.

### Public ranking and gamification

No reader score, leaderboard, streak, points, popularity ranking, or “truth vote” should be added. A private forecast is not a public truth signal.

### Chat and unmoderated debate

Do not replace articles with chat or add simulated expert debates. A reader question is not permission to generate unsupported dialogue.

### More dynamic editorial formats

Additional recurring formats remain gated by proof of value, evidence, moderation ownership, correction path, expiry, and accessibility. Do not add arbitrary modules to make the page feel busier.

### Permanent free email

Do not promise permanently free email delivery. Provider limits, branding, domain requirements, deliverability, and migration must be documented first.

### Public deployment claims

Do not say that GitHub Pages is updated until the public URL has been opened and the current edition and latest changes have been verified.

---

## 18. Daily run output packet

Before asking for approval, produce this internal packet:

```text
Edition:
Run ID:
Proposed publication time UTC:
Reviewer cutoff:

Selected stories:
1. event_id — title — posture — primary source — reason included
...

Optional modules:
- Tool Focus: yes/no — proof-of-value reason
- Cool Project Alert: yes/no — health/licence check
- Five-Minute Experiment: yes/no — safety check
- Deep Dive/additives: yes/no — evidence and owner check

Rejected candidates:
- candidate — reason rejected/held

Open questions:
- question — owner — resolution needed before publication?

Corrections or updates to prior editions:
- story/event — change — source — approval

Image/rights review:
- distinct assets confirmed / fallback used

Council outcome:
- concerns raised:
- resolved:
- unresolved and escalated:

Human approval:
- name/role:
- decision:
- timestamp:
```

No public write should happen until this packet is approved.

---

## 19. End-of-task review

After creating or updating an edition, inspect the result against the intended design:

- Did every selected item earn its place?
- Is every public statement supported at claim level?
- Are source links visible and inspectable?
- Did any title overstate the evidence?
- Are uncertainty, limitations, and conflicts visible?
- Are recurring modules clearly labelled and useful?
- Are images distinct and appropriate?
- Does the text-only reading path make sense?
- Are local interactions still private and optional?
- Did any new network, dependency, or public submission route appear unexpectedly?
- Were shelved features kept shelved?
- Did tests and build pass?
- If deployed, was the public URL actually verified?

Record the answers in the dated checklist. Quality is complete only when the editorial, product, accessibility, privacy, and deployment gates all agree.

---

## 20. Canonical files to consult

- `src/App.tsx` — page composition, data loading, routing, read/explore modes.
- `src/lib/contracts.ts` — edition/story/additive contracts and normalization.
- `src/components/StoryCard.tsx` — canonical signal card and treatment labels.
- `src/components/StoryDrawer.tsx` — Evidence Desk, Claim Lens, local reader agency, privacy disclosure.
- `src/components/ToolFocus.tsx` — Tool Focus presentation.
- `src/components/CoolProjectAlert.tsx` — Cool Project presentation.
- `src/components/FiveMinuteExperiment.tsx` — bounded reader experiment.
- `src/components/ChangeLedger.tsx` — authored change comparison.
- `src/components/OneConsequentialNumber.tsx` — consequential number module.
- `src/components/MethodSection.tsx` — Evidence Desk/method presentation.
- `src/app.css` — responsive, accessible, and interaction styling.
- `docs/DAILY_EDITORIAL_RUNBOOK.md` — daily operating brief.
- `docs/EDITORIAL_SYSTEM.md` — evidence-first system and publication architecture.
- `docs/IMPLEMENTATION_CHECKLIST_INTERACTION_2026-09-18.md` — interaction governance and deferred phases.
- `docs/CANARY_RUNBOOK.md` and `docs/ENVIRONMENT_DEPENDENT_RELEASE_CHECKLIST.md` — release checks.
- `data/editions/` — approved dated edition records.
- `data/publications/current.json` — current publication payload.
- `data/archive.json` and `data/search-index.json` — generated archive/search artifacts.

When in doubt, preserve evidence integrity, accessibility, optionality, privacy, and immutable editorial content over novelty or speed.
