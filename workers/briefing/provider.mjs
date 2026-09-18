const DEFAULT_TIMEOUT = 30000;

export class ProviderConfigurationError extends Error {}
export class ProviderResponseError extends Error {}

function parseJson(text) {
  const clean = String(text).trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try { return JSON.parse(clean); } catch { throw new ProviderResponseError('Provider returned non-JSON content'); }
}

export async function completeJson({ messages, schemaName = 'review' }) {
  const mode = process.env.AI_PROVIDER_MODE || 'remote';
  if (mode === 'mock') {
    if (process.env.ALLOW_MOCK_REVIEW !== 'true') throw new ProviderConfigurationError('Mock review requires ALLOW_MOCK_REVIEW=true');
    const payload = JSON.parse(messages.find(message => message.role === 'user')?.content || '{}');
    const evidenceUrl = payload.candidate?.items?.[0]?.url;
    return { state: 'approved', scores: { novelty: 4, impact: 4, evidence: 4, clarity: 4, usefulness: 4 }, evidence_urls: evidenceUrl ? [evidenceUrl] : [], red_flag: false, rationale: 'Mock response for tests only.', claim_checks: evidenceUrl ? [{ claim: payload.candidate.title, supported: true, evidence_urls: [evidenceUrl], excerpt: 'Fixture evidence.' }] : [] };
  }
  const base = process.env.AI_PROVIDER_BASE_URL;
  const key = process.env.AI_PROVIDER_API_KEY;
  const model = process.env.AI_PROVIDER_MODEL;
  if (!base || !key || !model) throw new ProviderConfigurationError('AI_PROVIDER_BASE_URL, AI_PROVIDER_API_KEY, and AI_PROVIDER_MODEL are required');
  const endpoint = `${base.replace(/\/$/, '')}/chat/completions`;
  const response = await fetch(endpoint, {
    method: 'POST',
    signal: AbortSignal.timeout(Number(process.env.AI_PROVIDER_TIMEOUT_MS || DEFAULT_TIMEOUT)),
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model, temperature: 0, messages, response_format: { type: 'json_object' }, metadata: { schema: schemaName } }),
  });
  if (!response.ok) throw new ProviderResponseError(`Provider HTTP ${response.status}`);
  const body = await response.json();
  const text = body.choices?.[0]?.message?.content;
  if (!text) throw new ProviderResponseError('Provider response had no message content');
  return parseJson(text);
}
