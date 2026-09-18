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

export type ToolFocus = { name: string; url: string; what: string; why_now: string; how_to_try: string[]; catch: string; rave: string; reality: string; evidence_posture: EvidencePosture; alternative: string; image_url?: string; related_signal_number?: number };
export type CoolProjectAlert = { name: string; repository_url: string; maintainer: string; license: string; why_cool: string; why_useful: string; try_first: string; project_health: string; caveat: string; verdict: 'worth_trying_now' | 'worth_watching' | 'narrow_audience' | 'immature'; image_url?: string; related_signal_number?: number };
export type FiveMinuteExperiment = { title: string; premise: string; steps: string[]; observe: string; safety_note: string };
export type AdditiveMeta = { format: string; why_here: string; source_urls: string[]; evidence_posture: EvidencePosture; editorial_owner: string; moderation_owner: string; safety_note: string; correction_path: string; expires_at: string };
export type ChangeLedger = { meta: AdditiveMeta; before: string; now: string; significance: string };
export type OneConsequentialNumber = { meta: AdditiveMeta; value: string; unit: string; label: string; context: string; limitation: string };
export type DeepDiveSection = { id: string; label: string; body: string; claim_ids?: string[]; confidence?: EvidencePosture };
export type DeepDiveVisual = { kind: 'stat' | 'bar' | 'timeline' | 'image'; title: string; value?: string; unit?: string; label: string; description: string; source_url: string; source_label: string; bar_value?: number; bar_max?: number; image_url?: string; alt?: string };
export type DeepDiveSnippet = { label: string; text: string; source_url: string; source_label: string; context: string };
export type DeepDiveExpert = { name: string; role: string; platform: string; profile_url: string; post_url?: string; retrieved_at: string; perspective_type: string; relevance: string; conflicts: string; verification: string; quote?: string | null; paraphrase?: string; evidence_urls: string[] };
export type DeepDiveSource = { url: string; tier: number; role: string; retrieved_at: string };
export type DeepDive = { meta: AdditiveMeta & { selection_score?: number; selection_reason?: string }; story_event_id: string; question: string; short_answer: string; sections: DeepDiveSection[]; visuals?: DeepDiveVisual[]; snippets?: DeepDiveSnippet[]; expert_perspectives: DeepDiveExpert[]; what_would_change_our_mind: string[]; source_trail: DeepDiveSource[]; audio?: { status: string; transcript_required: boolean } };
export type EditorialAdditives = { change_ledger?: ChangeLedger; one_consequential_number?: OneConsequentialNumber; deep_dive?: DeepDive };

export type Edition = {
  edition: number;
  run_id: string;
  published_at?: string;
  stories: Story[];
  tool_focus?: ToolFocus;
  cool_project_alert?: CoolProjectAlert;
  five_minute_experiment?: FiveMinuteExperiment;
  editorial_additives?: EditorialAdditives;
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
function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value && typeof value === 'object' && !Array.isArray(value)); }
function strings(value: unknown, count: number) { return Array.isArray(value) && value.length >= count && value.every(item => typeof item === 'string' && item.trim().length > 0); }
function normalizeToolFocus(value: unknown): ToolFocus | undefined { if (!isRecord(value) || !isSafeHttpsUrl(value.url) || !strings(value.how_to_try, 1) || !['name','what','why_now','catch','rave','reality','alternative'].every(key => typeof value[key] === 'string' && String(value[key]).trim())) return undefined; if (!evidencePostures.has(value.evidence_posture as EvidencePosture)) return undefined; return value as unknown as ToolFocus; }
function normalizeProject(value: unknown): CoolProjectAlert | undefined { if (!isRecord(value) || !isSafeHttpsUrl(value.repository_url) || !['name','maintainer','license','why_cool','why_useful','try_first','project_health','caveat'].every(key => typeof value[key] === 'string' && String(value[key]).trim()) || !['worth_trying_now','worth_watching','narrow_audience','immature'].includes(String(value.verdict))) return undefined; return value as unknown as CoolProjectAlert; }
function normalizeExperiment(value: unknown): FiveMinuteExperiment | undefined { if (!isRecord(value) || !['title','premise','observe','safety_note'].every(key => typeof value[key] === 'string' && String(value[key]).trim()) || !strings(value.steps, 1)) return undefined; return value as unknown as FiveMinuteExperiment; }
function normalizeAdditiveMeta(value: unknown): AdditiveMeta | undefined { if (!isRecord(value) || !strings(value.source_urls, 1) || !(value.source_urls as unknown[]).every(isSafeHttpsUrl) || !evidencePostures.has(value.evidence_posture as EvidencePosture) || !/^\d{4}-\d{2}-\d{2}$/.test(String(value.expires_at)) || !['format','why_here','editorial_owner','moderation_owner','safety_note','correction_path'].every(key => typeof value[key] === 'string' && String(value[key]).trim())) return undefined; return value as unknown as AdditiveMeta; }
function normalizeDeepDive(value: unknown): DeepDive | undefined {
  if (!isRecord(value) || typeof value.story_event_id !== 'string' || typeof value.question !== 'string' || typeof value.short_answer !== 'string' || !isRecord(value.meta)) return undefined;
  const meta = normalizeAdditiveMeta(value.meta);
  const sections = Array.isArray(value.sections) ? value.sections.filter(item => isRecord(item) && typeof item.id === 'string' && typeof item.label === 'string' && typeof item.body === 'string').map(item => ({ id: String(item.id), label: String(item.label), body: String(item.body), claim_ids: Array.isArray(item.claim_ids) ? item.claim_ids.filter((id: unknown) => typeof id === 'string') : [], confidence: evidencePostures.has(item.confidence as EvidencePosture) ? item.confidence as EvidencePosture : undefined })) : [];
  const visuals = Array.isArray(value.visuals) ? value.visuals.filter(item => isRecord(item) && ['stat','bar','timeline','image'].includes(String(item.kind)) && typeof item.title === 'string' && typeof item.label === 'string' && typeof item.description === 'string' && isSafeHttpsUrl(item.source_url) && typeof item.source_label === 'string').map(item => item as unknown as DeepDiveVisual) : [];
  const snippets = Array.isArray(value.snippets) ? value.snippets.filter(item => isRecord(item) && typeof item.label === 'string' && typeof item.text === 'string' && item.text.length <= 500 && isSafeHttpsUrl(item.source_url) && typeof item.source_label === 'string' && typeof item.context === 'string').map(item => item as unknown as DeepDiveSnippet) : [];
  const experts = Array.isArray(value.expert_perspectives) ? value.expert_perspectives.filter(item => isRecord(item) && typeof item.name === 'string' && typeof item.role === 'string' && typeof item.platform === 'string' && isSafeHttpsUrl(item.profile_url) && typeof item.retrieved_at === 'string' && typeof item.perspective_type === 'string' && typeof item.relevance === 'string' && typeof item.conflicts === 'string' && typeof item.verification === 'string' && Array.isArray(item.evidence_urls) && item.evidence_urls.every(isSafeHttpsUrl)).map(item => item as unknown as DeepDiveExpert) : [];
  const sources = Array.isArray(value.source_trail) ? value.source_trail.filter(item => isRecord(item) && isSafeHttpsUrl(item.url) && Number.isInteger(item.tier) && typeof item.role === 'string' && typeof item.retrieved_at === 'string').map(item => item as unknown as DeepDiveSource) : [];
  const changed = Array.isArray(value.what_would_change_our_mind) ? value.what_would_change_our_mind.filter(item => typeof item === 'string' && item.trim()) : [];
  if (!meta || sections.length < 3 || experts.length > 4 || sources.length < 1 || changed.length < 1) return undefined;
  return { ...(value as unknown as DeepDive), meta: meta as DeepDive['meta'], sections, visuals, snippets, expert_perspectives: experts, source_trail: sources, what_would_change_our_mind: changed };
}
function normalizeAdditives(value: unknown): EditorialAdditives | undefined {
  if (!isRecord(value)) return undefined;
  const result: EditorialAdditives = {};
  const deepDive = normalizeDeepDive(value.deep_dive);
  const ledgerInput = isRecord(value.change_ledger) ? value.change_ledger : undefined;
  const numberInput = isRecord(value.one_consequential_number) ? value.one_consequential_number : undefined;
  const ledger = ledgerInput && normalizeAdditiveMeta(ledgerInput.meta) && ['before', 'now', 'significance'].every(key => typeof ledgerInput[key] === 'string' && String(ledgerInput[key]).trim()) ? ledgerInput as unknown as ChangeLedger : undefined;
  const number = numberInput && normalizeAdditiveMeta(numberInput.meta) && ['value', 'unit', 'label', 'context', 'limitation'].every(key => typeof numberInput[key] === 'string' && String(numberInput[key]).trim()) ? numberInput as unknown as OneConsequentialNumber : undefined;
  if (ledger && new Date(`${ledger.meta.expires_at}T23:59:59Z`).getTime() >= Date.now()) result.change_ledger = ledger;
  if (number && new Date(`${number.meta.expires_at}T23:59:59Z`).getTime() >= Date.now()) result.one_consequential_number = number;
  if (deepDive && new Date(`${deepDive.meta.expires_at}T23:59:59Z`).getTime() >= Date.now()) result.deep_dive = deepDive;
  return result.change_ledger || result.one_consequential_number || result.deep_dive ? result : undefined;
}

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
  const tool_focus = normalizeToolFocus(input.tool_focus);
  const cool_project_alert = normalizeProject(input.cool_project_alert);
  const five_minute_experiment = normalizeExperiment(input.five_minute_experiment);
  const editorial_additives = normalizeAdditives(input.editorial_additives);
  return { edition: Number(input.edition || 0), run_id: String(input.run_id || 'fallback'), published_at: input.published_at, stories, ...(tool_focus ? { tool_focus } : {}), ...(cool_project_alert ? { cool_project_alert } : {}), ...(five_minute_experiment ? { five_minute_experiment } : {}), ...(editorial_additives ? { editorial_additives } : {}) };
}
