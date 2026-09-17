import { describe, expect, it } from 'vitest';
import { normalizeEdition } from './contracts';

describe('edition contract', () => {
  it('drops malformed stories and keeps supported claims only', () => {
    const edition = normalizeEdition({ edition: 1, run_id: 'run', stories: [{ title: 'Valid', source: 'Source', claims: [{ claim: 'Supported', supported: true, evidence_urls: ['https://example.com'] }, { claim: 'Unsupported', supported: false, evidence_urls: [] }] }, { source: 'Missing title' }] });
    expect(edition?.stories).toHaveLength(1);
    expect(edition?.stories[0].claims).toHaveLength(1);
  });
});
