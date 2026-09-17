import { render, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SignalMapSvg } from './SignalMapSvg';

const stories = [
  { id: 'alpha', title: 'Research signal', source: 'Lab', category: 'research' as const, claims: [], corrections: [], relationships: [{ from_story_id: 'alpha', to_story_id: 'beta', reason: 'same event' }] },
  { id: 'beta', title: 'Product signal', source: 'Outlet', category: 'product' as const, claims: [], corrections: [] },
];

describe('SignalMapSvg visual contract', () => {
  it('keeps the field canvas, legend, controls, and accessible parity structurally stable', () => {
    const { container } = render(<SignalMapSvg stories={stories} selected={null} onSelect={vi.fn()} />);
    const field = container.querySelector('.signal-map');
    expect(field?.querySelector('svg')).toBeInTheDocument();
    expect(field?.querySelectorAll('.map-edge')).toHaveLength(1);
    expect(within(field as HTMLElement).getByRole('group', { name: /relationship legend/i })).toBeInTheDocument();
    expect(within(field as HTMLElement).getByRole('button', { name: /follow the disturbance/i })).toBeInTheDocument();
    expect(within(field as HTMLElement).getByLabelText('Accessible story list').querySelectorAll('button')).toHaveLength(2);
    expect(within(field as HTMLElement).getByRole('group', { name: /accessible relationship explanations/i })).toBeInTheDocument();
  });
});
