import { useEffect, useMemo, useRef, useState } from 'react';
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation } from 'd3-force';
import type { RelationshipKind, Story } from '../lib/contracts';

type Props = { stories: Story[]; selected: Story | null; onSelect: (story: Story) => void };
type Point = { id: string; x: number; y: number };
type Edge = { from_story_id: string; to_story_id: string; reason: string; kind: RelationshipKind };
const width = 680; const height = 360;
const relationLabels: Record<RelationshipKind, string> = { same_event: 'Same event', corroborates: 'Corroborates', contradicts: 'Contradicts', depends_on: 'Depends on', consequence_of: 'Consequence of' };
const relationFilters: Array<RelationshipKind | 'all'> = ['all', 'corroborates', 'contradicts', 'depends_on', 'consequence_of'];
function idFor(story: Story) { return story.event_id || story.id || story.title; }
function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => { if (typeof window.matchMedia !== 'function') return; const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(media.matches); media.addEventListener?.('change', update); return () => media.removeEventListener?.('change', update); }, []);
  return reduced;
}

export function SignalMapSvg({ stories, selected, onSelect }: Props) {
  const mapRef = useRef<HTMLElement | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [isVisible, setIsVisible] = useState(() => typeof window === 'undefined' || !('IntersectionObserver' in window));
  const [relationshipFilter, setRelationshipFilter] = useState<RelationshipKind | 'all'>('all');
  const [guided, setGuided] = useState(false);
  const [guidedIndex, setGuidedIndex] = useState(0);
  const [explainedEdge, setExplainedEdge] = useState<Edge | null>(null);
  const reducedMotion = useReducedMotion();
  const ids = useMemo(() => new Set(stories.map(idFor)), [stories]);
  const edges = useMemo<Edge[]>(() => stories.flatMap(story => (story.relationships || []).filter(link => ids.has(link.from_story_id) && ids.has(link.to_story_id)).map(link => ({ ...link, kind: link.kind || 'same_event' as RelationshipKind }))), [stories, ids]);
  const visibleEdges = useMemo(() => relationshipFilter === 'all' ? edges : edges.filter(edge => edge.kind === relationshipFilter), [edges, relationshipFilter]);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !mapRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { rootMargin: '160px' });
    observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!isVisible) { setPoints([]); return; }
    const nodes = stories.map((story, index) => ({ id: idFor(story), x: width / 2 + Math.cos((index / Math.max(stories.length, 1)) * Math.PI * 2) * 100, y: height / 2 + Math.sin((index / Math.max(stories.length, 1)) * Math.PI * 2) * 80 }));
    const clamp = (node: { id: string; x: number; y: number }) => ({ id: node.id, x: Math.max(45, Math.min(width - 45, node.x)), y: Math.max(45, Math.min(height - 45, node.y)) });
    if (reducedMotion) { setPoints(nodes.map(clamp)); return undefined; }
    const simulation = forceSimulation(nodes).force('charge', forceManyBody().strength(-130)).force('center', forceCenter(width / 2, height / 2)).force('collide', forceCollide(42)).force('link', forceLink(visibleEdges.map(edge => ({ source: edge.from_story_id, target: edge.to_story_id }))).id((node: any) => node.id).distance(130).strength(.65)).stop();
    for (let i = 0; i < 120; i += 1) simulation.tick();
    setPoints(nodes.map(clamp));
    return () => { simulation.stop(); };
  }, [stories, visibleEdges, reducedMotion, isVisible]);
  const pointMap = new Map(points.map(point => [point.id, point]));
  const guidedStory = stories[guidedIndex % Math.max(stories.length, 1)];
  const selectGuided = () => { if (guidedStory) onSelect(guidedStory); };
  return <section ref={mapRef} className="signal-map" aria-labelledby="signalMapTitle">
    <div className="signal-map-header"><div><p className="eyebrow">EXPLORE THE FIELD</p><h2 id="signalMapTitle">Today’s constellation.</h2><p>Threads show approved relationships. Select a thread to see why it exists.</p></div><span className="map-count">{stories.length} nodes · {visibleEdges.length} links</span></div>
    <div className="map-controls" aria-label="Signal Field controls"><div className="relationship-filters" aria-label="Filter relationships">{relationFilters.map(filter => <button type="button" key={filter} className={relationshipFilter === filter ? 'map-control active' : 'map-control'} aria-pressed={relationshipFilter === filter} onClick={() => setRelationshipFilter(filter)}>{filter === 'all' ? 'All threads' : relationLabels[filter]}</button>)}</div><button type="button" className={guided ? 'map-control guided active' : 'map-control guided'} aria-pressed={guided} onClick={() => { setGuided(value => !value); setGuidedIndex(0); }}>Follow the disturbance ↗</button></div>
    {guided && guidedStory && <div className="guided-route" role="status"><div><span className="signal-label">FOLLOW THE DISTURBANCE · {guidedIndex + 1}/{stories.length}</span><strong>{guidedStory.title}</strong><p>{guidedStory.signal?.consequence || guidedStory.dek}</p></div><div className="guided-actions"><button type="button" onClick={selectGuided}>Inspect evidence</button><button type="button" onClick={() => setGuidedIndex(index => (index + 1) % stories.length)}>Next signal →</button></div></div>}
    <div className="map-legend" aria-label="Relationship legend"><span><i className="legend-line same_event" />Same event</span><span><i className="legend-line corroborates" />Corroborates</span><span><i className="legend-line contradicts" />Contradicts</span><span><i className="legend-line consequence_of" />Consequence</span></div>
    <div className="map-canvas"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="signalMapTitle signalMapDescription"><desc id="signalMapDescription">An interactive map of today’s approved AI stories. The text list below is an equivalent accessible view.</desc>{visibleEdges.map((edge, index) => { const from=pointMap.get(edge.from_story_id); const to=pointMap.get(edge.to_story_id); return from&&to?<line key={`${edge.from_story_id}-${edge.to_story_id}-${index}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={`map-edge ${edge.kind}`} />:null })}{points.map(point => { const story=stories.find(item => idFor(item)===point.id); if(!story)return null; const isSelected=selected&&idFor(selected)===point.id; return <g key={point.id} className={isSelected?'map-node selected':'map-node'} tabIndex={0} role="button" aria-label={`Open story: ${story.title}`} onClick={() => onSelect(story)} onKeyDown={event => { if(event.key==='Enter'||event.key===' '){event.preventDefault();onSelect(story)} }}><circle cx={point.x} cy={point.y} r={isSelected?19:14} /><text x={point.x} y={point.y+34} textAnchor="middle">{story.title.length>25?`${story.title.slice(0,25)}…`:story.title}</text></g> })}</svg></div>
    <div className="map-list" aria-label="Accessible story list">{stories.map(story => <button type="button" key={idFor(story)} className={selected&&idFor(selected)===idFor(story)?'map-list-item selected':'map-list-item'} aria-pressed={Boolean(selected&&idFor(selected)===idFor(story))} onClick={() => onSelect(story)}>{story.title}<span>{story.category}</span></button>)}</div>
    {visibleEdges.length > 0 && <div className="map-relationships" aria-label="Accessible relationship explanations"><p className="signal-label">WHY THESE SIGNALS CONNECT</p>{visibleEdges.map((edge, index) => { const from=stories.find(story => idFor(story)===edge.from_story_id); const to=stories.find(story => idFor(story)===edge.to_story_id); if (!from || !to) return null; return <button type="button" key={`${edge.from_story_id}-${edge.to_story_id}-${index}`} className="relationship-explanation" onClick={() => { setExplainedEdge(edge); onSelect(to); }}><span>{from.title} → {to.title}</span><strong>{relationLabels[edge.kind]}</strong><small>{edge.reason}</small></button>; })}</div>}
    {explainedEdge && <p className="relationship-note" role="status"><strong>{relationLabels[explainedEdge.kind]}:</strong> {explainedEdge.reason}</p>}
  </section>;
}
