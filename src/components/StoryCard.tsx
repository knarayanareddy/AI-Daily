import type { EvidencePosture, Story } from '../lib/contracts';

type Props = { story: Story; index: number; onOpenEvidence: (story: Story) => void };
const postureLabels: Record<EvidencePosture, string> = { verified: 'Verified', corroborated: 'Corroborated', disputed: 'Disputed', developing: 'Developing', corrected: 'Corrected' };
const assetUrl = (url: string) => url.startsWith('/') ? `${import.meta.env.BASE_URL}${url.slice(1)}` : url;

export function StoryCard({ story, index, onOpenEvidence }: Props) {
  const signal = story.signal;
  const posture = signal?.evidence_posture || story.evidence_posture || 'developing';
  return <article className={`story signal-ticket posture-${posture}`} aria-labelledby={`story-${index}-title`}>
    <div className="story-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
    <div className="signal-ticket-body">{story.image_url && <img className="story-image" src={assetUrl(story.image_url)} alt="" loading="lazy" />}
      <div className="signal-ticket-kicker"><span className="signal-posture" data-posture={posture}>{postureLabels[posture]}</span><span>{story.tag || story.category}</span><span>{story.time || 'Today'}</span></div>
      <h3 id={`story-${index}-title`}>{story.title}</h3>
      <div className="signal-facts">
        <div><span className="signal-label">THE MOVE</span><p>{signal?.move || story.dek}</p></div>
        <div className={signal?.consequence ? '' : 'signal-unverified'}><span className="signal-label">THE CONSEQUENCE</span><p>{signal?.consequence || 'Consequence is still being assessed in the approved edition.'}</p></div>
        {signal?.tension && <div className="signal-tension"><span className="signal-label">THE TENSION</span><p>{signal.tension}</p></div>}
      </div>
      {story.discussion_prompt && <div className="discussion-prompt"><span>THE QUESTION</span><p>{story.discussion_prompt}</p></div>}
      <div className="story-tags"><button className="story-detail-btn" type="button" onClick={() => onOpenEvidence(story)} aria-label={`Open Evidence Desk and pull the thread for ${story.title}`}>Evidence Desk · Pull the thread ↗</button></div>
    </div>
    <div className="story-source"><strong>{story.source}</strong><span>{story.claims.length ? `${story.claims.length} receipt${story.claims.length === 1 ? '' : 's'}` : 'Source retained'}</span></div>
  </article>;
}
