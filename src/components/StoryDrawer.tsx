import { useEffect, useRef } from 'react';
import type { Story } from '../lib/contracts';

type Props = { story: Story | null; onClose: () => void };

export function StoryDrawer({ story, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!story) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const drawer = event.currentTarget as Document;
        const focusable = Array.from(drawer.querySelectorAll<HTMLElement>('.story-drawer button, .story-drawer a'));
        if (!focusable.length) return;
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = ''; };
  }, [story, onClose]);

  if (!story) return null;
  const claims = story.claims;
  return <>
    <div className="story-drawer-backdrop" onClick={onClose} aria-hidden="true" />
    <aside className="story-drawer open" role="dialog" aria-modal="true" aria-labelledby="drawerTitle">
      <button ref={closeRef} className="drawer-close" onClick={onClose} aria-label="Close story details">×</button>
      <p className="eyebrow">EVIDENCE DESK</p>
      <h2 id="drawerTitle">{story.title}</h2>
      <p className="drawer-why">{story.dek}</p>
      <div className="drawer-section"><p className="drawer-label">CLAIMS WE CHECKED</p>
        {claims.length ? claims.map((claim, index) => <div className="claim" key={`${claim.claim}-${index}`}>
          <p>{claim.claim}</p><span className="claim-status">Supported by the panel</span>
          <div className="claim-evidence">{claim.evidence_urls.map((url, evidenceIndex) => <a href={url} key={url} target="_blank" rel="noreferrer">Source {evidenceIndex + 1} ↗</a>)}</div>
          {claim.excerpt && <p className="evidence-excerpt">“{claim.excerpt}”</p>}
        </div>) : <p role="status" className="evidence-excerpt">Claim-level evidence is not available for this fallback story. Open the primary source and treat the summary as unverified.</p>}
      </div>
      {story.corrections.length > 0 && <div className="drawer-section"><p className="drawer-label">CORRECTION HISTORY</p>{story.corrections.map((correction, index) => <div className="correction" key={correction.id || index}><strong>{correction.correction}</strong><div>Changed from: {correction.claim}</div><time>{correction.created_at} · {correction.reason}</time></div>)}</div>}
      <a className="drawer-source" href={story.url || '#'} target="_blank" rel="noreferrer">Open primary source ↗</a>
    </aside>
  </>;
}
