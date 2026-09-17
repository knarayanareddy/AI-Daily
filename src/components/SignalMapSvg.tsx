import { useEffect, useMemo, useRef, useState } from 'react';
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation } from 'd3-force';
import type { Story } from '../lib/contracts';

type Props = { stories: Story[]; selected: Story | null; onSelect: (story: Story) => void };
type Point = { id: string; x: number; y: number };
const width = 680; const height = 360;
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
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !mapRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { rootMargin: '160px' });
    observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);
  const ids = useMemo(() => new Set(stories.map(idFor)), [stories]);
  const edges = useMemo(() => stories.flatMap(story => (story.relationships || []).filter(link => ids.has(link.from_story_id) && ids.has(link.to_story_id))), [stories, ids]);
  useEffect(() => {
    if (!isVisible) { setPoints([]); return; }
    const nodes = stories.map((story, index) => ({ id: idFor(story), x: width / 2 + Math.cos((index / Math.max(stories.length, 1)) * Math.PI * 2) * 100, y: height / 2 + Math.sin((index / Math.max(stories.length, 1)) * Math.PI * 2) * 80 }));
    const clamp = (node: { id: string; x: number; y: number }) => ({ id: node.id, x: Math.max(45, Math.min(width - 45, node.x)), y: Math.max(45, Math.min(height - 45, node.y)) });
    if (reducedMotion) { setPoints(nodes.map(clamp)); return undefined; }
    const simulation = forceSimulation(nodes).force('charge', forceManyBody().strength(-130)).force('center', forceCenter(width / 2, height / 2)).force('collide', forceCollide(42)).force('link', forceLink(edges.map(edge => ({ source: edge.from_story_id, target: edge.to_story_id }))).id((node: any) => node.id).distance(130).strength(.65)).stop();
    for (let i = 0; i < 120; i += 1) simulation.tick();
    setPoints(nodes.map(clamp));
    return () => { simulation.stop(); };
  }, [stories, edges, reducedMotion, isVisible]);
  const pointMap = new Map(points.map(point => [point.id, point]));
  return <section ref={mapRef} className="signal-map" aria-labelledby="signalMapTitle"><div className="signal-map-header"><div><p className="eyebrow">EXPLORE THE FIELD</p><h2 id="signalMapTitle">Today’s constellation.</h2><p>Lines show explicit editorial relationships. Select a signal to inspect its evidence.</p></div><span className="map-count">{stories.length} nodes · {edges.length} links</span></div><div className="map-canvas"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="signalMapTitle signalMapDescription"><desc id="signalMapDescription">An interactive map of today’s approved AI stories. The text list below is an equivalent accessible view.</desc>{edges.map((edge, index) => { const from=pointMap.get(edge.from_story_id); const to=pointMap.get(edge.to_story_id); return from&&to?<line key={`${edge.from_story_id}-${edge.to_story_id}-${index}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="map-edge" />:null })}{points.map(point => { const story=stories.find(item => idFor(item)===point.id); if(!story)return null; const isSelected=selected&&idFor(selected)===point.id; return <g key={point.id} className={isSelected?'map-node selected':'map-node'} tabIndex={0} role="button" aria-label={`Open story: ${story.title}`} onClick={() => onSelect(story)} onKeyDown={event => { if(event.key==='Enter'||event.key===' '){event.preventDefault();onSelect(story)} }}><circle cx={point.x} cy={point.y} r={isSelected?19:14} /><text x={point.x} y={point.y+34} textAnchor="middle">{story.title.length>25?`${story.title.slice(0,25)}…`:story.title}</text></g> })}</svg></div><div className="map-list" aria-label="Accessible story list">{stories.map(story => <button type="button" key={idFor(story)} className={selected&&idFor(selected)===idFor(story)?'map-list-item selected':'map-list-item'} aria-pressed={Boolean(selected&&idFor(selected)===idFor(story))} onClick={() => onSelect(story)}>{story.title}<span>{story.category}</span></button>)}</div></section>;
}
