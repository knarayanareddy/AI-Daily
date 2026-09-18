export type Category = 'research' | 'product' | 'policy' | 'society' | 'compute' | string;

export type Claim = {
  claim: string;
  supported: true;
  evidence_urls: string[];
  excerpt?: string;
};

export type Correction = {
  id?: string;
  edition_id?: string;
  story_id?: string;
  claim: string;
  correction: string;
  reason: string;
  created_at: string;
};

export type EvidencePosture = 'verified' | 'corroborated' | 'disputed' | 'developing' | 'corrected';
export type RelationshipKind = 'same_event' | 'corroborates' | 'contradicts' | 'depends_on' | 'consequence_of';
export type EditorialSignal = { move: string; consequence: string; tension?: string; why_now?: string; evidence_posture: EvidencePosture };
export type Relationship = { from_story_id: string; to_story_id: string; reason: string; kind?: RelationshipKind; evidence_urls?: string[] };

export type StoryTreatment = 'dispatch' | 'launch_anatomy' | 'research_note' | 'incident_file' | 'power_map' | 'tradeoff' | 'field_note' | 'forecast' | 'claim_counterclaim' | 'human_receipt' | 'before_after' | 'source_trail';
export type ReaderAction = 'inspect' | 'compare' | 'predict' | 'vote' | 'trace' | 'challenge' | 'follow' | 'save' | 'correct';
export type StoryPresentation = { treatment: StoryTreatment; reader_action: ReaderAction; section: string; display_priority: 'lead' | 'feature' | 'standard' | 'quick'; visual_mode: 'documentary' | 'diagram' | 'timeline' | 'map' | 'comparison' | 'portrait' | 'data' | 'collage' };

export type Story = {
  id?: string;
  event_id?: string;
  title: string;
  dek?: string;
  source: string;
  url?: string;
  image_url?: string;
  discussion_prompt?: string;
  presentation?: StoryPresentation;
  category: Category;
  published_at?: string;
  time?: string;
  tag?: string;
  claims: Claim[];
  corrections: Correction[];
  related_sources?: string[];
  signal?: EditorialSignal;
  evidence_posture?: EvidencePosture;
  relationships?: Relationship[];
};

export type Edition = {
  edition: number;
  run_id: string;
  published_at?: string;
  stories: Story[];
};

export const fallbackStories: Story[] = [
  { category: 'research', title: 'A new benchmark asks what models do after the answer', dek: 'Researchers introduce a test for long-horizon reliability — and find that confident models still lose the plot when tools enter the loop.', source: 'NATURE AI', time: '2h ago', tag: 'Research', url: 'https://www.nature.com/', claims: [], corrections: [] },
  { category: 'product', title: 'The agent era gets its first real productivity suite', dek: 'A familiar set of tools, now designed around delegation rather than prompting. The result is less magical than useful — which may be the point.', source: 'THE VERGE', time: '4h ago', tag: 'Product', url: 'https://www.theverge.com/', claims: [], corrections: [] },
  { category: 'policy', title: 'The world’s first frontier model audit rules take shape', dek: 'A cross-border working group publishes a practical framework for evaluating systems that are too powerful to assess with vibes alone.', source: 'MIT TECH REVIEW', time: '6h ago', tag: 'Policy', url: 'https://www.technologyreview.com/', claims: [], corrections: [] },
  { category: 'product', title: 'Open weights, smaller footprint: the model to watch', dek: 'A compact release matches yesterday’s flagship on the tasks people actually use, while fitting on hardware that does not need a data center.', source: 'HUGGING FACE', time: '8h ago', tag: 'Open models', url: 'https://huggingface.co/blog', claims: [], corrections: [] },
];

export function isSafeHttpsUrl(value: unknown): value is string { return typeof value === 'string' && /^https:\/\/[^\s]+$/i.test(value); }

export function isClaim(value: unknown): value is Claim {
  if (!value || typeof value !== 'object') return false;
  const claim = value as Partial<Claim>;
  return typeof claim.claim === 'string' && claim.supported === true && Array.isArray(claim.evidence_urls) && claim.evidence_urls.length > 0 && claim.evidence_urls.every(isSafeHttpsUrl);
}

const evidencePostures = new Set<EvidencePosture>(['verified', 'corroborated', 'disputed', 'developing', 'corrected']);
const relationshipKinds = new Set<RelationshipKind>(['same_event', 'corroborates', 'contradicts', 'depends_on', 'consequence_of']);
function normalizeSignal(value: unknown): EditorialSignal | undefined { if (!value || typeof value !== 'object') return undefined; const input = value as Partial<EditorialSignal>; if (typeof input.move !== 'string' || typeof input.consequence !== 'string' || !evidencePostures.has(input.evidence_posture as EvidencePosture)) return undefined; return { move: input.move, consequence: input.consequence, tension: input.tension, why_now: input.why_now, evidence_posture: input.evidence_posture as EvidencePosture }; }
function normalizeRelationships(value: unknown): Relationship[] { if (!Array.isArray(value)) return []; return value.filter(item => item && typeof item === 'object' && typeof (item as Relationship).from_story_id === 'string' && typeof (item as Relationship).to_story_id === 'string' && typeof (item as Relationship).reason === 'string').map(item => ({ ...(item as Relationship), kind: relationshipKinds.has((item as Relationship).kind as RelationshipKind) ? (item as Relationship).kind : 'same_event' })); }

export function normalizeStory(value: unknown): Story | null {
  if (!value || typeof value !== 'object') return null;
  const input = value as Partial<Story>;
  if (typeof input.title !== 'string' || typeof input.source !== 'string') return null;
  return {
    ...input,
    url: isSafeHttpsUrl(input.url) ? input.url : undefined,
    category: input.category || 'research',
    title: input.title,
    source: input.source,
    dek: input.dek || 'A new development worth understanding in the fast-moving AI landscape.',
    claims: Array.isArray(input.claims) ? input.claims.filter(isClaim) : [],
    corrections: Array.isArray(input.corrections) ? input.corrections as Correction[] : [],
    signal: normalizeSignal(input.signal),
    evidence_posture: evidencePostures.has(input.evidence_posture as EvidencePosture) ? input.evidence_posture as EvidencePosture : undefined,
    relationships: normalizeRelationships(input.relationships),
  } as Story;
}

export function normalizeEdition(value: unknown): Edition | null {
  if (!value || typeof value !== 'object') return null;
  const input = value as Partial<Edition>;
  if (!Array.isArray(input.stories)) return null;
  const stories = input.stories.map(normalizeStory).filter((story): story is Story => Boolean(story));
  return { edition: Number(input.edition || 0), run_id: String(input.run_id || 'fallback'), published_at: input.published_at, stories };
}
