import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SignalMapSvg } from './SignalMapSvg';
import type { Story } from '../lib/contracts';

const stories: Story[] = [
  { id: 'one', title: 'Research signal', source: 'Lab', category: 'research', claims: [], corrections: [], relationships: [{ from_story_id: 'one', to_story_id: 'two', reason: 'same event' }] },
  { id: 'two', title: 'Product signal', source: 'Outlet', category: 'product', claims: [], corrections: [] },
];

afterEach(() => vi.unstubAllGlobals());

describe('SignalMapSvg', () => {
  it('provides an equivalent accessible story list and selection action', () => {
    const onSelect = vi.fn();
    render(<SignalMapSvg stories={stories} selected={null} onSelect={onSelect} />);
    expect(screen.getByRole('img', { name: /today’s constellation/i })).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole('region', { name: /today’s constellation/i })).getByRole('button', { name: /product signal$/i }));
    expect(onSelect).toHaveBeenCalledWith(stories[1]);
  });

  it('keeps a deterministic static map and usable list for reduced-motion users', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    render(<SignalMapSvg stories={stories} selected={null} onSelect={vi.fn()} />);
    expect(within(screen.getByLabelText('Accessible story list')).getAllByRole('button')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /all threads/i })).toHaveAttribute('aria-pressed', 'true');
    expect(within(screen.getByLabelText('Accessible story list')).getByRole('button', { name: /product signal product/i })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: /open story: product signal/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /research signal.*product signal/i })).toBeInTheDocument();
  });

  it('explains relationship semantics and provides a guided route', () => {
    render(<SignalMapSvg stories={stories} selected={null} onSelect={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /follow the disturbance/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/follow the disturbance/i);
    expect(screen.getByRole('button', { name: /inspect evidence/i })).toBeInTheDocument();
    expect(screen.getAllByText(/same event/i).length).toBeGreaterThan(0);
  });
});
