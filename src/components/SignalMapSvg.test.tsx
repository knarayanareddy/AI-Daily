import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SignalMapSvg } from './SignalMapSvg';
import type { Story } from '../lib/contracts';

const stories: Story[] = [
  { id: 'one', title: 'Research signal', source: 'Lab', category: 'research', claims: [], corrections: [], relationships: [{ from_story_id: 'one', to_story_id: 'two', reason: 'same event' }] },
  { id: 'two', title: 'Product signal', source: 'Outlet', category: 'product', claims: [], corrections: [] },
];

describe('SignalMapSvg', () => {
  it('provides an equivalent accessible story list and selection action', () => {
    const onSelect = vi.fn();
    render(<SignalMapSvg stories={stories} selected={null} onSelect={onSelect} />);
    expect(screen.getByRole('img', { name: /today’s constellation/i })).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole('region', { name: /today’s constellation/i })).getByRole('button', { name: /product signal$/i }));
    expect(onSelect).toHaveBeenCalledWith(stories[1]);
  });
});
