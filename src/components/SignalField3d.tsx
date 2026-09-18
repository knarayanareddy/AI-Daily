import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffect, useMemo, useState } from 'react';
import type { Story } from '../lib/contracts';

type Props = { stories: Story[]; selected: Story | null; onSelect: (story: Story) => void; onBack: () => void };
const colors: Record<string, string> = { research: '#91ad75', product: '#ff765e', policy: '#d2a154', society: '#8d78a8', compute: '#6f9fb1' };
function idFor(story: Story) { return story.event_id || story.id || story.title; }
function useReducedMotion() { const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches); useEffect(() => { if (typeof window.matchMedia !== 'function') return; const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(media.matches); media.addEventListener?.('change', update); return () => media.removeEventListener?.('change', update); }, []); return reduced; }

function SignalNode({ story, position, selected, onSelect }: { story: Story; position: [number, number, number]; selected: boolean; onSelect: (story: Story) => void }) {
  return <mesh position={position} onClick={event => { event.stopPropagation(); onSelect(story); }} onPointerDown={event => event.stopPropagation()}><sphereGeometry args={[selected ? .34 : .25, 16, 16]} /><meshStandardMaterial color={selected ? '#d9f36b' : colors[story.category] || '#ff765e'} emissive={selected ? '#536d65' : '#000000'} emissiveIntensity={selected ? .7 : 0} /></mesh>;
}
function SignalEdge({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const line = useMemo(() => { const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...from), new THREE.Vector3(...to)]); return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#a4bbaa', transparent: true, opacity: .8 })); }, [from, to]);
  return <primitive object={line} dispose={null} />;
}

export function SignalField3d({ stories, selected, onSelect, onBack }: Props) {
  const reducedMotion = useReducedMotion();
  const positions = useMemo(() => stories.map((story, index) => { const angle = (index / Math.max(stories.length, 1)) * Math.PI * 2; return [Math.cos(angle) * 2.1, Math.sin(angle) * 1.25, (index % 3 - 1) * .55] as [number, number, number]; }), [stories]);
  const points = useMemo(() => new Map(stories.map((story, index) => [idFor(story), positions[index]])), [stories, positions]);
  const edges = useMemo(() => stories.flatMap(story => (story.relationships || []).filter(link => points.has(link.from_story_id) && points.has(link.to_story_id)).map(link => ({ from: points.get(link.from_story_id)!, to: points.get(link.to_story_id)! }))), [stories, points]);
  return <section className="signal-field-3d" aria-labelledby="signalFieldTitle"><div className="signal-field-header"><div><p className="eyebrow">SIGNAL FIELD · OPTIONAL 3D LENS</p><h2 id="signalFieldTitle">The field, in depth.</h2><p>Depth shows a consequence horizon. Tethers are approved relationships, not inferred similarity.</p></div><button type="button" className="map-control" onClick={onBack}>← Return to 2D field</button></div><div className="signal-field-canvas" aria-label="Interactive 3D Signal Field"><Canvas frameloop="demand" dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: 'low-power' }} camera={{ position: [0, 0, 7], fov: 42 }} fallback={<p className="signal-field-notice" role="status">3D is unavailable here. The accessible 2D field and story list remain available.</p>}><color attach="background" args={['#e4ede1']} /><ambientLight intensity={1.8} /><directionalLight position={[3, 4, 5]} intensity={2} />{edges.map((edge, index) => <SignalEdge key={index} from={edge.from} to={edge.to} />)}{stories.map((story, index) => <SignalNode key={idFor(story)} story={story} position={positions[index]} selected={Boolean(selected && idFor(selected) === idFor(story))} onSelect={onSelect} />)}</Canvas>{reducedMotion && <p className="signal-field-notice" role="status">Reduced motion is on. The field is static; the story list remains the complete accessible view.</p>}</div><div className="signal-field-list" aria-label="Accessible Signal Field story list">{stories.map(story => <button type="button" key={idFor(story)} aria-pressed={Boolean(selected && idFor(selected) === idFor(story))} onClick={() => onSelect(story)}>{story.title}<span>{story.category} · {story.signal?.evidence_posture || story.evidence_posture || 'developing'}</span></button>)}</div></section>;
}
