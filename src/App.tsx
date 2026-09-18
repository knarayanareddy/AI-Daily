import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { EditionHeader } from './components/EditionHeader';
import { EditionError } from './components/EditionError';
import { LoadingState } from './components/LoadingState';
import { MethodSection } from './components/MethodSection';
import { NewsletterCard } from './components/NewsletterCard';
import { ToolFocus } from './components/ToolFocus';
import { CoolProjectAlert } from './components/CoolProjectAlert';
import { FiveMinuteExperiment } from './components/FiveMinuteExperiment';
import { ChangeLedger } from './components/ChangeLedger';
import { OneConsequentialNumber } from './components/OneConsequentialNumber';
import { DeepDive } from './components/DeepDive';
import { SiteHeader } from './components/SiteHeader';
const SignalMapSvg = lazy(() => import('./components/SignalMapSvg').then(module => ({ default: module.SignalMapSvg })));
const SignalField3d = lazy(() => import('./components/SignalField3d').then(module => ({ default: module.SignalField3d })));
function MapLoading() { return <section className="signal-map map-loading" role="status"><p className="eyebrow">OPENING THE FIELD</p><h2>Arranging today’s signals…</h2><p>The reading list remains available below.</p></section>; }
import { StoryDrawer } from './components/StoryDrawer';
import { StoryList } from './components/StoryList';
import { TopicFilters } from './components/TopicFilters';
import { fallbackStories, normalizeEdition, type Edition, type Story } from './lib/contracts';
import './app.css';

function storyKey(story: Story) { return story.event_id || story.id || story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function basePath() { const base = import.meta.env.BASE_URL || '/'; return base === '/' ? '' : base.replace(/\/$/, ''); }
function routePath() { const base = basePath(); const path = window.location.pathname; return base && path.startsWith(base) ? path.slice(base.length) || '/' : path; }
function storyFromLocation(stories: Story[]) { const match = routePath().match(/^\/story\/([^/]+)/); const key = match ? decodeURIComponent(match[1]) : new URLSearchParams(window.location.search).get('story'); return key ? stories.find(story => storyKey(story) === key) || null : null; }
function editionDateFromLocation() { return routePath().match(/^\/edition\/(\d{4}-\d{2}-\d{2})\/?$/)?.[1] || null; }

export default function App() {
  const [edition, setEdition] = useState<Edition>({ edition: 184, run_id: 'fallback', stories: fallbackStories });
  const [active, setActive] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Story | null>(null);
  const [dark, setDark] = useState(false);
  const [loadState, setLoadState] = useState<'loading' | 'live' | 'stale' | 'fallback' | 'error'>('loading');
  const [routeDate, setRouteDate] = useState<string | null>(editionDateFromLocation());
  const [explore, setExplore] = useState(new URLSearchParams(window.location.search).get('view') === 'explore');
  const [field3d, setField3d] = useState(new URLSearchParams(window.location.search).get('mode') === 'signal');
  const [errorMessage, setErrorMessage] = useState('The approved edition is unavailable right now.');
  const stories = useMemo(() => edition.stories.filter(story => (active === 'all' || story.category === active) && `${story.title} ${story.dek} ${story.source}`.toLowerCase().includes(query.toLowerCase())), [edition.stories, active, query]);
  const counts = useMemo(() => edition.stories.reduce<Record<string, number>>((result, story) => { result.all = (result.all || 0) + 1; result[story.category] = (result[story.category] || 0) + 1; return result; }, {}), [edition.stories]);

  useEffect(() => {
    const onPopState = () => { setRouteDate(editionDateFromLocation()); setSelected(null); };
    window.addEventListener('popstate', onPopState);
    setLoadState('loading');
    const assetBase = import.meta.env.BASE_URL || '/';
    const editionPath = routeDate ? `${assetBase}data/editions/${routeDate}.json` : `${assetBase}data/publications/current.json`;
    Promise.all([fetch(editionPath).then(response => { if (!response.ok) throw Error(`Edition ${routeDate || 'current'} is unavailable (${response.status})`); return response.json(); }), fetch(`${assetBase}data/corrections.json`).then(response => response.json()).catch(() => ({}))]).then(([rawEdition, corrections]) => {
      const parsed = normalizeEdition(rawEdition);
      if (!parsed?.stories.length) throw Error('The edition failed its public data contract.');
      const rows = corrections.corrections || [];
      const next = { ...parsed, stories: parsed.stories.map(story => ({ ...story, corrections: story.corrections.length ? story.corrections : rows.filter((row: { story_id?: string }) => row.story_id === story.event_id || row.story_id === story.id) })) };
      setEdition(next);
      setLoadState(next.published_at && Date.now() - Date.parse(next.published_at) > 36 * 60 * 60 * 1000 ? 'stale' : 'live');
      setSelected(storyFromLocation(next.stories));
    }).catch(error => { setErrorMessage(error instanceof Error ? error.message : 'The approved edition is unavailable right now.'); setLoadState(routeDate ? 'error' : 'fallback'); });
    return () => window.removeEventListener('popstate', onPopState);
  }, [routeDate]);
  const openStory = useCallback((story: Story) => { setSelected(story); window.history.pushState({ story: storyKey(story) }, '', `${import.meta.env.BASE_URL || '/'}story/${encodeURIComponent(storyKey(story))}`); }, []);
  const closeStory = useCallback(() => { if (routePath().startsWith('/story/')) window.history.back(); else setSelected(null); }, []);
  const notice = loadState === 'stale' ? 'This edition is older than 36 hours. We are keeping the last-known-good signal visible.' : loadState === 'fallback' ? 'Live data is unavailable. Showing the last-known-good edition.' : null;
  const retry = () => setRouteDate(editionDateFromLocation());
  const goCurrent = () => { window.history.pushState({}, '', import.meta.env.BASE_URL || '/'); setRouteDate(null); };
  const toggleExplore = () => { const next = !explore; const url = new URL(window.location.href); if(next) url.searchParams.set('view','explore'); else { url.searchParams.delete('view'); url.searchParams.delete('mode'); } window.history.pushState({ view: next ? 'explore' : 'read' }, '', `${url.pathname}${url.search}`); setExplore(next); if (!next) setField3d(false); };
  const toggle3d = () => { const next = !field3d; const url = new URL(window.location.href); url.searchParams.set('view', 'explore'); if(next) url.searchParams.set('mode', 'signal'); else url.searchParams.delete('mode'); window.history.pushState({ view: 'explore', mode: next ? 'signal' : '2d' }, '', `${url.pathname}${url.search}`); setExplore(true); setField3d(next); };

  return <div className={dark ? 'react-shell dark' : 'react-shell'}>
    <a className="skip-link" href="#briefing">Skip to briefing</a>
    <div className="topline"><span className="live-dot" /> Edition {edition.edition || '—'} · {edition.published_at ? new Date(edition.published_at).toLocaleDateString('en-GB', { dateStyle: 'full', timeZone: 'UTC' }) : 'Date unavailable'} <span className="topline-right">Free daily briefing <span className="arrow">↗</span></span></div>
    <SiteHeader dark={dark} onToggleTheme={() => setDark(value => !value)} />
    {notice && <div className={`edition-notice ${loadState}`} role="status"><span>●</span>{notice}</div>}
    {loadState === 'loading' && <LoadingState />}
    {loadState === 'error' && <EditionError message={errorMessage} onRetry={retry} onBack={goCurrent} />}
    {loadState !== 'loading' && loadState !== 'error' && <main id="top"><EditionHeader edition={edition} visibleStories={stories.length} /><TopicFilters active={active} query={query} counts={counts} onFilter={setActive} onSearch={setQuery} /><nav className="edition-contents" aria-label="On this edition"><strong>ON THIS EDITION</strong><a href="#briefing">25 Signals</a>{edition.editorial_additives?.deep_dive && <a href="#deep-dive">Deep Dive</a>}{edition.tool_focus && <a href="#tool-focus">Tool Focus <span>Signal {String(edition.tool_focus.related_signal_number || '').padStart(2, '0')}</span></a>}{edition.cool_project_alert && <a href="#cool-project">Cool Project <span>Signal {String(edition.cool_project_alert.related_signal_number || '').padStart(2, '0')}</span></a>}{edition.five_minute_experiment && <a href="#five-minute-experiment">Five-Minute Experiment <span>5 min</span></a>}<a href="#method">Evidence Desk</a>{edition.editorial_additives?.change_ledger && <a href="#change-ledger">Change Ledger</a>}{edition.editorial_additives?.one_consequential_number && <a href="#one-number">One Number</a>}</nav><section className="content-grid" id="briefing"><StoryList stories={stories} total={stories.length} onOpenEvidence={openStory} /><aside className="aside-column"><div className="aside-card consensus-card"><div className="card-kicker"><span className="spark">✦</span> EDITORIAL CONSENSUS</div><h3>Evidence comes first.</h3><p>Every published story carries its claims and the sources used to check them. Open Evidence Desk on any story to inspect the reasoning.</p><a href="#method" className="text-link">See the method <span>↗</span></a></div><NewsletterCard /></aside></section>{edition.editorial_additives?.deep_dive && <DeepDive item={edition.editorial_additives.deep_dive} />}{edition.tool_focus && <ToolFocus tool={edition.tool_focus} />}{edition.cool_project_alert && <CoolProjectAlert project={edition.cool_project_alert} />}{edition.five_minute_experiment && <FiveMinuteExperiment experiment={edition.five_minute_experiment} />}{edition.editorial_additives?.change_ledger && <ChangeLedger item={edition.editorial_additives.change_ledger} />}{edition.editorial_additives?.one_consequential_number && <OneConsequentialNumber item={edition.editorial_additives.one_consequential_number} />}<div className="explore-bar"><button type="button" className={explore ? 'explore-toggle active' : 'explore-toggle'} onClick={toggleExplore}>{explore ? '← Return to reading' : 'Explore the field ↗'}</button></div>{explore && <Suspense fallback={<MapLoading />}>{field3d ? <SignalField3d stories={stories} selected={selected} onSelect={openStory} onBack={toggle3d} /> : <SignalMapSvg stories={stories} selected={selected} onSelect={openStory} onOpen3d={toggle3d} />}</Suspense>}
      <MethodSection />
    </main>}
    <footer><a className="wordmark" href="#top"><span>AI</span> DAILY<span className="mark">.</span></a><p>Thoughtful coverage for an accelerating field.</p><nav className="footer-links" aria-label="Footer navigation"><a href={`${import.meta.env.BASE_URL}archive.html`}>Archive</a><a href={`${import.meta.env.BASE_URL}rss.xml`}>RSS</a><a href={`${import.meta.env.BASE_URL}sitemap.xml`}>Sitemap</a></nav></footer><StoryDrawer story={selected} onClose={closeStory} />
  </div>;
}
