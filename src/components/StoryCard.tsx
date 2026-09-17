import type { Story } from '../lib/contracts';

type Props = { story: Story; index: number; onOpenEvidence: (story: Story) => void };

export function StoryCard({ story, index, onOpenEvidence }: Props) {
  return <article className="story">
    <div className="story-number">{String(index + 1).padStart(2, '0')}</div>
    <div>
      <h3>{story.title}</h3>
      <p>{story.dek}</p>
      <div className="story-tags">
        <span className="tag">{story.tag || story.category}</span>
        <span>{story.time || 'Today'}</span>
        <button className="story-detail-btn" type="button" onClick={() => onOpenEvidence(story)}>Evidence desk ↗</button>
      </div>
    </div>
    <div className="story-source"><strong>{story.source}</strong>Evidence linked</div>
  </article>;
}
