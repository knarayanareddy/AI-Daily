import type { Edition } from '../lib/contracts';

type Props = { edition: Edition; visibleStories: number };
export function EditionHeader({ edition, visibleStories }: Props) {
  const published = edition.published_at ? new Date(edition.published_at) : null;
  const updated = published && !Number.isNaN(published.getTime()) ? published.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC' : 'Update time unavailable';
  return <section className="hero" id="edition-intro"><div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line" /> THE DAILY SIGNAL</p><h1>The signal<br /><em>in AI.</em></h1><p className="hero-deck">The few developments worth your attention, distilled by humans and machines. No hype. No filler. Just what moved the field forward.</p><div className="hero-meta"><span className="status-pip" /> Updated {updated} <span className="meta-divider">·</span> Edition {edition.edition} <span className="meta-divider">·</span> {visibleStories} stories in view <span className="meta-divider">·</span> Evidence linked</div></div><div className="hero-orbit" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><div className="orbit-core">✦</div></div></section>;
}
