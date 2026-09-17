import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StoryDrawer } from './StoryDrawer';
import type { Story } from '../lib/contracts';

const story: Story = { title: 'Evidence story', source: 'Lab', category: 'research', dek: 'Context', url: 'https://example.com', claims: [{ claim: 'A supported claim', supported: true, evidence_urls: ['https://example.com/evidence'], excerpt: 'The supporting line.' }], corrections: [{ claim: 'Old wording', correction: 'Correct wording', reason: 'Clarified by source', created_at: '2026-09-17T08:00:00Z' }] };

describe('StoryDrawer', () => {
  it('renders claims, evidence, and correction history', () => {
    render(<StoryDrawer story={story} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('A supported claim')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /source 1/i })).toHaveAttribute('href', 'https://example.com/evidence');
    expect(screen.getByText('Correct wording')).toBeInTheDocument();
  });
});
