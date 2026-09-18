import test from 'node:test';
import assert from 'node:assert/strict';
import { DEEP_DIVE_PERSONAS, deepDiveConsensus, validateDeepDiveReview } from '../workers/briefing/deep-dive-review.mjs';

test('deep-dive council has independent expert personas', () => {
  assert.equal(DEEP_DIVE_PERSONAS.length, 9);
  assert.equal(new Set(DEEP_DIVE_PERSONAS.map(persona => persona.id)).size, 9);
  assert.ok(DEEP_DIVE_PERSONAS.some(persona => persona.id === 'social_verification_editor'));
  assert.ok(DEEP_DIVE_PERSONAS.some(persona => persona.id === 'independence_editor'));
});

test('deep-dive consensus escalates red flags instead of publishing', () => {
  const reviews = DEEP_DIVE_PERSONAS.map(persona => ({
    persona: persona.id,
    state: persona.id === 'public_interest_editor' ? 'escalated' : 'approved',
    scores: { consequence: 5, evidence: 5, expertise_fit: 5, independence: 5, harm: 5, reader_value: 5 },
    red_flags: persona.id === 'public_interest_editor' ? ['needs harm review'] : [],
    required_changes: [],
    verified_expert_names: [],
    rationale: 'This review checked the supplied record and found a clear editorial disposition.'
  }));
  assert.equal(deepDiveConsensus(reviews).state, 'escalated');
});

test('deep-dive review validation rejects incomplete scores', () => {
  assert.throws(() => validateDeepDiveReview({ state: 'approved', scores: {}, red_flags: [], required_changes: [], verified_expert_names: [], rationale: 'too short' }));
});

test('deep-dive consensus requires strong evidence and independence', () => {
  const reviews = DEEP_DIVE_PERSONAS.map(persona => ({
    persona: persona.id,
    state: 'approved',
    scores: { consequence: 5, evidence: 3, expertise_fit: 5, independence: 3, harm: 5, reader_value: 5 },
    red_flags: [], required_changes: [], verified_expert_names: [], rationale: 'The material is interesting but the evidence and source independence remain incomplete.'
  }));
  assert.equal(deepDiveConsensus(reviews).state, 'escalated');
});
