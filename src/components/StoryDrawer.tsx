import { useEffect, useMemo, useRef, useState } from 'react';
import type { Story } from '../lib/contracts';

type Props = { story: Story | null; onClose: () => void };
const assetUrl = (url: string) => url.startsWith('/') ? `${import.meta.env.BASE_URL}${url.slice(1)}` : url;
const storageKey = (kind: string, story: Story) => `ai-daily:${kind}:${story.event_id || story.id || story.title}`;
function readLocal(key: string, fallback = '') { try { return window.localStorage.getItem(key) || fallback; } catch { return fallback; } }
function writeLocal(key: string, value: string) { try { window.localStorage.setItem(key, value); return true; } catch { return false; } }

export function StoryDrawer({ story, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [lens, setLens] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [changeNote, setChangeNote] = useState('');
  const [forecastDate, setForecastDate] = useState('');
  const [forecastConfidence, setForecastConfidence] = useState('');
  const [localStatus, setLocalStatus] = useState('');
  const storyId = story ? (story.event_id || story.id || story.title) : '';

  useEffect(() => {
    if (!story) return;
    closeRef.current?.focus();
    setLens(null); setSaved(readLocal(storageKey('saved', story)) === 'true');
    setChangeNote(readLocal(storageKey('change-note', story)));
    const forecast = readLocal(storageKey('forecast', story));
    if (forecast) { try { const parsed = JSON.parse(forecast) as { date?: string; confidence?: string }; setForecastDate(parsed.date || ''); setForecastConfidence(parsed.confidence || ''); } catch { /* local data is disposable */ } }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const drawer = event.currentTarget as Document;
        const focusable = Array.from(drawer.querySelectorAll<HTMLElement>('.story-drawer button, .story-drawer a, .story-drawer textarea, .story-drawer input, .story-drawer select'));
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

  const currentStory = story;
  const comparison = useMemo(() => currentStory?.signal?.why_now || '', [currentStory]);
  if (!currentStory) return null;
  const claims = currentStory.claims;
  const toggleSaved = () => { const next = !saved; setSaved(next); writeLocal(storageKey('saved', currentStory), String(next)); setLocalStatus(next ? 'Saved in this browser.' : 'Removed from this browser.'); };
  const saveChangeNote = () => { writeLocal(storageKey('change-note', currentStory), changeNote); setLocalStatus('Your note is saved only in this browser; it was not sent to AI Daily.'); };
  const saveForecast = () => { writeLocal(storageKey('forecast', currentStory), JSON.stringify({ date: forecastDate, confidence: forecastConfidence })); setLocalStatus('Private forecast saved only in this browser.'); };
  return <>
    <div className="story-drawer-backdrop" onClick={onClose} aria-hidden="true" />
    <aside className="story-drawer open" role="dialog" aria-modal="true" aria-labelledby="drawerTitle">
      <button ref={closeRef} className="drawer-close" onClick={onClose} aria-label="Close story details">×</button>
      <p className="eyebrow">EVIDENCE DESK · {currentStory.presentation?.treatment?.replaceAll('_', ' ') || 'dispatch'}</p>
      {currentStory.image_url && <img className="drawer-image" src={assetUrl(currentStory.image_url)} alt="" />}
      <h2 id="drawerTitle">{currentStory.title}</h2>
      <p className="drawer-why">{currentStory.dek}</p>
      <div className="drawer-actions"><button type="button" onClick={toggleSaved}>{saved ? '✓ Saved locally' : 'Save for later'}</button><span>Private to this browser</span></div>
      {currentStory.discussion_prompt && <div className="drawer-question"><p className="drawer-label">A QUESTION TO CARRY</p><p>{currentStory.discussion_prompt}</p></div>}
      {comparison && <div className="drawer-section drawer-compare"><p className="drawer-label">WHAT CHANGED</p><p>{comparison}</p><small>This is the edition’s authored delta; it is not inferred from your interaction.</small></div>}
      <div className="drawer-section"><p className="drawer-label">CLAIMS WE CHECKED · CLAIM LENS</p>
        {claims.length ? claims.map((claim, index) => <div className="claim" key={`${claim.claim}-${index}`}>
          <button type="button" className="claim-lens-toggle" aria-expanded={lens === index} onClick={() => setLens(lens === index ? null : index)}><span>{lens === index ? '−' : '+'}</span>{claim.claim}</button>
          <div className="claim-evidence">{claim.evidence_urls.map((url, evidenceIndex) => <a href={url} key={url} target="_blank" rel="noreferrer">Source {evidenceIndex + 1} ↗</a>)}</div>{lens === index && <div className="claim-lens" role="region" aria-label={`Evidence for claim ${index + 1}`}><span className="claim-status">Supported by the panel</span>{claim.excerpt && <p className="evidence-excerpt">“{claim.excerpt}”</p>}<p className="claim-lens-label">Source role: evidence supplied with this approved story</p></div>}
        </div>) : <p role="status" className="evidence-excerpt">Claim-level evidence is not available for this fallback story. Open the primary source and treat the summary as unverified.</p>}
      </div>
      <div className="drawer-section local-reader-lab"><p className="drawer-label">READER LAB · PRIVATE</p><label htmlFor="change-note">What would change your mind?</label><textarea id="change-note" value={changeNote} onChange={event => setChangeNote(event.target.value)} placeholder="Write the evidence you would want to see…" /><button type="button" onClick={saveChangeNote}>Save note locally</button><p className="local-disclosure">This note never leaves your browser and is not a correction submission.</p><label htmlFor="forecast-date">Private forecast resolution date</label><input id="forecast-date" type="date" value={forecastDate} onChange={event => setForecastDate(event.target.value)} /><label htmlFor="forecast-confidence">Confidence</label><select id="forecast-confidence" value={forecastConfidence} onChange={event => setForecastConfidence(event.target.value)}><option value="">Choose confidence</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select><button type="button" onClick={saveForecast} disabled={!forecastDate || !forecastConfidence}>Save private forecast</button></div>
      {localStatus && <p className="local-status" role="status">{localStatus}</p>}
      {currentStory.corrections.length > 0 && <div className="drawer-section"><p className="drawer-label">CORRECTION HISTORY</p>{currentStory.corrections.map((correction, index) => <div className="correction" key={correction.id || index}><strong>{correction.correction}</strong><div>Changed from: {correction.claim}</div><time>{correction.created_at} · {correction.reason}</time></div>)}</div>}
      <a className="drawer-source" href={currentStory.url || '#'} target="_blank" rel="noreferrer">Open primary source ↗</a>
      <span className="sr-only">Story key {storyId}</span>
    </aside>
  </>;
}
