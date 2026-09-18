Fixtures are intentionally small, source-shaped RSS/Atom contracts used to detect parser drift before a live feed changes the daily run. Each live source should eventually have a fixture sampled from a known-good response and refreshed during source maintenance.

Current contracts:

- `openai-news.rss.xml` — RSS 2.0, text link, pubDate
- `deepmind-blog.atom.xml` — Atom, alternate href link, updated date
