import { describe, expect, it } from 'vitest';
import { normalizeEdition } from './contracts';

describe('edition contract', () => {
  it('drops malformed stories and keeps supported claims only', () => {
    const edition = normalizeEdition({ edition: 1, run_id: 'run', stories: [{ title: 'Valid', source: 'Source', claims: [{ claim: 'Supported', supported: true, evidence_urls: ['https://example.com'] }, { claim: 'Unsupported', supported: false, evidence_urls: [] }] }, { source: 'Missing title' }] });
    expect(edition?.stories).toHaveLength(1);
    expect(edition?.stories[0].claims).toHaveLength(1);
  });

  it('preserves approved optional editorial modules', () => {
    const edition = normalizeEdition({ edition: 186, run_id: 'run', stories: [{ title: 'Story', source: 'Source', category: 'research', claims: [] }], tool_focus: { name: 'Tool', url: 'https://example.com/tool', what: 'What', why_now: 'Why', how_to_try: ['Try'], catch: 'Catch', rave: 'Rave', reality: 'Reality', evidence_posture: 'verified', alternative: 'Alternative' }, cool_project_alert: { name: 'Project', repository_url: 'https://github.com/example/project', maintainer: 'Maintainer', license: 'MIT', why_cool: 'Cool', why_useful: 'Useful', try_first: 'Try', project_health: 'Healthy', caveat: 'Caveat', verdict: 'worth_watching' }, five_minute_experiment: { title: 'Experiment', premise: 'Premise', steps: ['Step'], observe: 'Observe', safety_note: 'Safety' } });
    expect(edition?.tool_focus?.name).toBe('Tool');
    expect(edition?.cool_project_alert?.name).toBe('Project');
    expect(edition?.five_minute_experiment?.title).toBe('Experiment');
    expect(edition?.editorial_additives).toBeUndefined();
    const withAdditive = normalizeEdition({ edition: 186, run_id: 'run', stories: [{ title: 'Story', source: 'Source', category: 'research', claims: [] }], editorial_additives: { one_consequential_number: { meta: { format: 'one_consequential_number', why_here: 'Reason', source_urls: ['https://example.com/source'], evidence_posture: 'verified', editorial_owner: 'Editor', moderation_owner: 'Editor', safety_note: 'Safe', correction_path: 'Correct', expires_at: '2026-09-19' }, value: '1', unit: 'test', label: 'Number', context: 'Context', limitation: 'Limit' } } });
    expect(withAdditive?.editorial_additives?.one_consequential_number?.value).toBe('1');
  });

  it('normalizes editorial signal posture and legacy relationships', () => {
    const edition = normalizeEdition({ edition: 1, run_id: 'run', stories: [{ title: 'Signal story', source: 'Source', signal: { move: 'A measurable change happened', consequence: 'It changes the next decision', evidence_posture: 'corroborated' }, relationships: [{ from_story_id: 'a', to_story_id: 'b', reason: 'same verified event' }] }] });
    expect(edition?.stories[0].signal?.evidence_posture).toBe('corroborated');
    expect(edition?.stories[0].relationships?.[0].kind).toBe('same_event');
  });
});
