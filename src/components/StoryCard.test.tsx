import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StoryCard } from './StoryCard';
import type { Story } from '../lib/contracts';

const story: Story = { title: 'A checked story', source: 'TEST SOURCE', category: 'research', dek: 'Why it matters.', signal: { move: 'A measurable change happened', consequence: 'A new decision is now possible', tension: 'The scale remains disputed', evidence_posture: 'corroborated' }, claims: [], corrections: [], url: 'https://example.com' };

describe('StoryCard', () => {
  it('renders story metadata and exposes the evidence action', () => {
    render(<StoryCard story={story} index={0} onOpenEvidence={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'A checked story' })).toBeInTheDocument();
    expect(screen.getByText('TEST SOURCE')).toBeInTheDocument();
    expect(screen.getByText('A measurable change happened')).toBeInTheDocument();
    expect(screen.getByText('A new decision is now possible')).toBeInTheDocument();
    expect(screen.getByText('Corroborated')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /evidence desk.*pull the thread/i })).toBeInTheDocument();
  });
});
