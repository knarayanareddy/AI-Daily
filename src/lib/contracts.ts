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

export type Relationship = { from_story_id: string; to_story_id: string; reason: string };

export type Story = {
  id?: string;
  event_id?: string;
  title: string;
  dek?: string;
  source: string;
  url?: string;
  category: Category;
  published_at?: string;
  time?: string;
  tag?: string;
  claims: Claim[];
  corrections: Correction[];
  related_sources?: string[];
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

export function isClaim(value: unknown): value is Claim {
  if (!value || typeof value !== 'object') return false;
  const claim = value as Partial<Claim>;
  return typeof claim.claim === 'string' && claim.supported === true && Array.isArray(claim.evidence_urls) && claim.evidence_urls.length > 0;
}

export function normalizeStory(value: unknown): Story | null {
  if (!value || typeof value !== 'object') return null;
  const input = value as Partial<Story>;
  if (typeof input.title !== 'string' || typeof input.source !== 'string') return null;
  return {
    ...input,
    category: input.category || 'research',
    title: input.title,
    source: input.source,
    dek: input.dek || 'A new development worth understanding in the fast-moving AI landscape.',
    claims: Array.isArray(input.claims) ? input.claims.filter(isClaim) : [],
    corrections: Array.isArray(input.corrections) ? input.corrections as Correction[] : [],
  } as Story;
}

export function normalizeEdition(value: unknown): Edition | null {
  if (!value || typeof value !== 'object') return null;
  const input = value as Partial<Edition>;
  if (!Array.isArray(input.stories)) return null;
  const stories = input.stories.map(normalizeStory).filter((story): story is Story => Boolean(story));
  return { edition: Number(input.edition || 0), run_id: String(input.run_id || 'fallback'), published_at: input.published_at, stories };
}
