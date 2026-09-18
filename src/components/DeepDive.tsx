import type { DeepDive as DeepDiveData } from '../lib/contracts';

type Props = { item: DeepDiveData };

export function DeepDive({ item }: Props) {
  const visuals = item.visuals || [];
  const snippets = item.snippets || [];
  return <section className="deep-dive-module" id="deep-dive" aria-labelledby="deepDiveTitle">
    <div className="deep-dive-header"><p className="additive-kicker">DEEP DIVE · ONE QUESTION, FULL RECORD</p><p className="additive-posture">{item.meta.evidence_posture}</p></div>
    <p className="deep-dive-question">{item.question}</p>
    <h2 id="deepDiveTitle">{item.short_answer}</h2>

    {visuals.length > 0 && <section className="deep-dive-visual-board" aria-labelledby="deepDiveVisualsTitle">
      <div className="deep-dive-visual-heading"><h3 id="deepDiveVisualsTitle">The numbers at a glance</h3><p>Read the labels and source notes; the visual is a summary, not a stronger claim than the record.</p></div>
      <div className="deep-dive-visual-grid">{visuals.map((visual, index) => {
        const width = visual.kind === 'bar' && visual.bar_value !== undefined && visual.bar_max ? Math.min(100, Math.max(0, visual.bar_value / visual.bar_max * 100)) : 0;
        return <figure className={`deep-dive-visual visual-${visual.kind}`} key={`${visual.title}-${index}`}>
          {visual.kind === 'image' && visual.image_url && <img src={visual.image_url} alt={visual.alt || visual.description} loading="lazy" decoding="async" />}
          {visual.kind === 'bar' && <div className="deep-dive-bar" aria-hidden="true"><span style={{ width: `${width}%` }} /></div>}
          <div className="deep-dive-visual-copy">{visual.value && <strong>{visual.value}<small>{visual.unit}</small></strong>}<h4>{visual.title}</h4><p>{visual.label}</p><figcaption>{visual.description} <a href={visual.source_url} target="_blank" rel="noreferrer">{visual.source_label} ↗</a></figcaption></div>
        </figure>;
      })}</div>
      <p className="deep-dive-visual-table-note">Text alternative: every value, label, limitation, and source is written in the cards above and remains available without color, hover, or interaction.</p>
    </section>}

    {snippets.length > 0 && <section className="deep-dive-snippets" aria-labelledby="deepDiveSnippetsTitle"><h3 id="deepDiveSnippetsTitle">Source snippets</h3><p className="deep-dive-snippets-intro">Short excerpts are included to show the language behind the interpretation. They are not presented as independent proof.</p><div className="deep-dive-snippet-grid">{snippets.map(snippet => <figure className="deep-dive-snippet" key={`${snippet.source_url}-${snippet.label}`}><blockquote>“{snippet.text}”</blockquote><figcaption><strong>{snippet.label}</strong> · {snippet.context} · <a href={snippet.source_url} target="_blank" rel="noreferrer">{snippet.source_label} ↗</a></figcaption></figure>)}</div></section>}

    <div className="deep-dive-sections">{item.sections.map(section => <section key={section.id} className="deep-dive-section" aria-labelledby={`deep-dive-${section.id}`}><h3 id={`deep-dive-${section.id}`}>{section.label}{section.confidence && <span>{section.confidence}</span>}</h3><p>{section.body}</p></section>)}</div>
    {item.expert_perspectives.length > 0 && <div className="deep-dive-experts"><h3>Expert perspectives</h3><div className="deep-dive-expert-grid">{item.expert_perspectives.map(expert => <article key={`${expert.name}-${expert.platform}`} className="deep-dive-expert"><p className="deep-dive-expert-kicker">{expert.perspective_type} · {expert.platform}</p><h4>{expert.name}</h4><p><strong>{expert.role}</strong> · {expert.relevance}</p>{expert.paraphrase && <p>{expert.paraphrase}</p>}<p className="deep-dive-expert-note"><strong>Verification:</strong> {expert.verification}<br /><strong>Conflict note:</strong> {expert.conflicts}</p><p className="deep-dive-links"><a href={expert.profile_url} target="_blank" rel="noreferrer">Profile ↗</a>{expert.post_url && <a href={expert.post_url} target="_blank" rel="noreferrer">Original post ↗</a>}</p></article>)}</div></div>}
    <div className="deep-dive-change"><h3>What would change our mind?</h3><ul>{item.what_would_change_our_mind.map(change => <li key={change}>{change}</li>)}</ul></div>
    <div className="deep-dive-sources"><h3>Evidence Desk · source trail</h3><p>{item.source_trail.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.role} · tier {source.tier} ↗</a>)}</p><p className="additive-source">Social perspectives are labeled as analysis, not used as standalone proof of consequential facts. Retrieved timestamps are retained in the approved data artifact.</p></div>
  </section>;
}
