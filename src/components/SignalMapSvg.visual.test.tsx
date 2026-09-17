import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SignalMapSvg } from './SignalMapSvg';

const stories = [
  { id: 'alpha', title: 'Research signal', source: 'Lab', category: 'research' as const, claims: [], corrections: [], relationships: [{ from_story_id: 'alpha', to_story_id: 'beta', reason: 'same event' }] },
  { id: 'beta', title: 'Product signal', source: 'Outlet', category: 'product' as const, claims: [], corrections: [] },
];

describe('SignalMapSvg visual contract', () => {
  it('keeps the map canvas and equivalent controls structurally stable', () => {
    const { container } = render(<SignalMapSvg stories={stories} selected={null} onSelect={vi.fn()} />);
    expect(container.querySelector('.signal-map')).toMatchSnapshot();
  });
});
