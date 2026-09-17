import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TopicFilters } from './TopicFilters';

describe('TopicFilters', () => {
  it('reports topic and search changes', () => {
    const onFilter = vi.fn(); const onSearch = vi.fn();
    render(<TopicFilters active="all" query="" counts={{ all: 4, research: 1, product: 2, policy: 1 }} onFilter={onFilter} onSearch={onSearch} />);
    fireEvent.click(screen.getByRole('button', { name: /research/i }));
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'agent' } });
    expect(onFilter).toHaveBeenCalledWith('research');
    expect(onSearch).toHaveBeenCalledWith('agent');
  });
});
