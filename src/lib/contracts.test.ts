import { describe, expect, it } from 'vitest';
import { normalizeEdition } from './contracts';

describe('edition contract', () => {
  it('drops malformed stories and keeps supported claims only', () => {
    const edition = normalizeEdition({ edition: 1, run_id: 'run', stories: [{ title: 'Valid', source: 'Source', claims: [{ claim: 'Supported', supported: true, evidence_urls: ['https://example.com'] }, { claim: 'Unsupported', supported: false, evidence_urls: [] }] }, { source: 'Missing title' }] });
    expect(edition?.stories).toHaveLength(1);
    expect(edition?.stories[0].claims).toHaveLength(1);
  });

  it('normalizes editorial signal posture and legacy relationships', () => {
    const edition = normalizeEdition({ edition: 1, run_id: 'run', stories: [{ title: 'Signal story', source: 'Source', signal: { move: 'A measurable change happened', consequence: 'It changes the next decision', evidence_posture: 'corroborated' }, relationships: [{ from_story_id: 'a', to_story_id: 'b', reason: 'same verified event' }] }] });
    expect(edition?.stories[0].signal?.evidence_posture).toBe('corroborated');
    expect(edition?.stories[0].relationships?.[0].kind).toBe('same_event');
  });
});
