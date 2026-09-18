import type { EvidencePosture, Story, StoryTreatment } from '../lib/contracts';

type Props = { story: Story; index: number; onOpenEvidence: (story: Story) => void };
const postureLabels: Record<EvidencePosture, string> = { verified: 'Verified', corroborated: 'Corroborated', disputed: 'Disputed', developing: 'Developing', corrected: 'Corrected' };
const treatmentLabels: Record<StoryTreatment, string> = { dispatch: 'Dispatch', launch_anatomy: 'Launch anatomy', research_note: 'Research note', incident_file: 'Incident file', power_map: 'Power map', tradeoff: 'Trade-off', field_note: 'Field note', forecast: 'Forecast', claim_counterclaim: 'Claim / counterclaim', human_receipt: 'Human receipt', before_after: 'Before / after', source_trail: 'Source trail' };
const actionLabels: Record<string, string> = { inspect: 'Inspect the receipt', compare: 'Compare the claims', predict: 'Make a prediction', vote: 'Take a position', trace: 'Trace the thread', challenge: 'Challenge the evidence', follow: 'Follow this signal', save: 'Save this question', correct: 'Suggest a correction' };
const assetUrl = (url: string) => url.startsWith('/') ? `${import.meta.env.BASE_URL}${url.slice(1)}` : url;

function treatmentCopy(story: Story) {
  const signal = story.signal;
  const treatment = story.presentation?.treatment || 'dispatch';
  const common = { one: signal?.move || story.dek, two: signal?.consequence || 'The approved edition is still assessing the consequence.', three: signal?.tension || 'The important limit is still being assessed.' };
  const copy: Record<StoryTreatment, { labels: [string, string, string] }> = {
    dispatch: { labels: ['What landed', 'Why it matters', 'Watch next'] },
    launch_anatomy: { labels: ['What shipped', 'Who gets it', 'Adoption question'] },
    research_note: { labels: ['The test', 'The result', 'The limit'] },
    incident_file: { labels: ['What happened', 'Boundary that failed', 'What remains unknown'] },
    power_map: { labels: ['The decision', 'Who carries the cost', 'Where authority sits'] },
    tradeoff: { labels: ['The gain', 'The cost', 'The choice'] },
    field_note: { labels: ['What we noticed', 'Why it is unusual', 'What would prove it wrong'] },
    forecast: { labels: ['Current signal', 'Next milestone', 'Indicator to watch'] },
    claim_counterclaim: { labels: ['The claim', 'Strongest support', 'Strongest objection'] },
    human_receipt: { labels: ['Who experiences this', 'What changes in life', 'What needs consent'] },
    before_after: { labels: ['Before', 'The intervention', 'What moved elsewhere'] },
    source_trail: { labels: ['Primary record', 'What reporting adds', 'Editorial decision'] },
  };
  return { ...common, labels: (copy[treatment] || copy.dispatch).labels };
}

export function StoryCard({ story, index, onOpenEvidence }: Props) {
  const signal = story.signal;
  const posture = signal?.evidence_posture || story.evidence_posture || 'developing';
  const treatment = story.presentation?.treatment || 'dispatch';
  const copy = treatmentCopy(story);
  const action = story.presentation?.reader_action || 'inspect';
  return <article className={`story signal-ticket posture-${posture} treatment-${treatment} priority-${story.presentation?.display_priority || 'standard'}`} aria-labelledby={`story-${index}-title`}>
    <div className="story-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
    <div className="signal-ticket-body">{story.image_url && <img className="story-image" src={assetUrl(story.image_url)} alt={`Editorial illustration for ${story.title}`} loading="lazy" decoding="async" />}
      <div className="signal-ticket-kicker"><span className="story-treatment">{treatmentLabels[treatment]}</span><span className="signal-posture" data-posture={posture}>{postureLabels[posture]}</span><span>{story.tag || story.category}</span><span>{story.time || 'Today'}</span></div>
      <h3 id={`story-${index}-title`}>{story.title}</h3>
      <div className="signal-facts treatment-facts">
        <div><span className="signal-label">{copy.labels[0]}</span><p>{copy.one}</p></div>
        <div><span className="signal-label">{copy.labels[1]}</span><p>{copy.two}</p></div>
        <div className="signal-tension"><span className="signal-label">{copy.labels[2]}</span><p>{copy.three}</p></div>
      </div>
      {story.discussion_prompt && <div className="discussion-prompt"><span>{actionLabels[action]}</span><p>{story.discussion_prompt}</p></div>}
      <div className="story-tags"><button className="story-detail-btn" type="button" onClick={() => onOpenEvidence(story)} aria-label={`Open Evidence Desk and pull the thread for ${story.title}`}>Evidence Desk · Pull the thread ↗</button></div>
    </div>
    <div className="story-source"><strong>{story.source}</strong><span>{story.claims.length ? `${story.claims.length} receipt${story.claims.length === 1 ? '' : 's'}` : 'Source retained'}</span></div>
  </article>;
}
