import { render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const fetchMock = (value: unknown, ok = true) => vi.fn().mockResolvedValue({ ok, json: async () => value });

afterEach(() => { vi.unstubAllGlobals(); window.history.replaceState({}, '', '/'); });

describe('App shell', () => {
  it('shows an explicit fallback notice when the edition cannot load', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    render(<App />);
    await waitFor(() => expect(screen.getByText(/last-known-good edition/i)).toBeInTheDocument());
    expect(screen.getByRole('heading', { name: /today’s briefing/i })).toBeInTheDocument();
  });

  it('shows an explicit error state for a missing immutable edition', async () => {
    window.history.replaceState({}, '', '/edition/2026-01-01');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) }));
    render(<App />);
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByText(/could not be verified/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('exposes keyboard navigation landmarks and crawlable footer links', async () => {
    vi.stubGlobal('fetch', fetchMock({ edition: 185, run_id: 'run', stories: [{ id: 'landmark-story', title: 'Landmark story', source: 'Source', category: 'research', dek: 'Context', url: 'https://example.com', claims: [] }] }));
    render(<App />);
    await waitFor(() => expect(screen.getByRole('main')).toBeInTheDocument());
    expect(screen.getByRole('link', { name: /skip to briefing/i })).toHaveAttribute('href', '#briefing');
    expect(screen.getByRole('navigation', { name: /on this edition/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '25 Signals' })).toHaveAttribute('href', '#briefing');
    expect(screen.getByRole('link', { name: 'Evidence Desk' })).toHaveAttribute('href', '#method');
    expect(screen.getByRole('navigation', { name: /footer navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'RSS' })).toHaveAttribute('href', '/rss.xml');
    expect(screen.getByRole('link', { name: 'Sitemap' })).toHaveAttribute('href', '/sitemap.xml');
  });

  it('opens a story from a deep link', async () => {
    window.history.replaceState({}, '', '/story/a-new-benchmark-asks-what-models-do-after-the-answer');
    vi.stubGlobal('fetch', fetchMock({ edition: 185, run_id: 'run', stories: [{ event_id: 'a-new-benchmark-asks-what-models-do-after-the-answer', title: 'Deep linked story', source: 'Source', category: 'research', dek: 'Context', url: 'https://example.com', claims: [{ claim: 'A supported claim', supported: true, evidence_urls: ['https://example.com'] }] }] }));
    render(<App />);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(within(screen.getByRole('dialog')).getByRole('heading', { name: 'Deep linked story' })).toBeInTheDocument();
  });
});
