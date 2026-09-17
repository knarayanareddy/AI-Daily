import type { Story } from '../lib/contracts';
import { StoryCard } from './StoryCard';

type Props = { stories: Story[]; total: number; onOpenEvidence: (story: Story) => void };
export function StoryList({ stories, total, onOpenEvidence }: Props) {
  return <div className="stories-column"><div className="section-heading"><h2>Today’s briefing</h2><span>{String(total).padStart(2, '0')} signals</span></div><div className="story-list">{stories.map((story, index) => <StoryCard key={story.event_id || story.id || story.title} story={story} index={index} onOpenEvidence={onOpenEvidence} />)}</div>{!stories.length && <p className="empty-state">No signal here. Try another frequency.</p>}</div>;
}
