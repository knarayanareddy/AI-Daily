import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const publicationDir = join(root, 'data', 'publications');
const files = (await readdir(publicationDir)).filter(file => file.endsWith('.json') && file !== 'current.json').sort();
const editions = [];
for (const file of files) {
  const payload = JSON.parse(await readFile(join(publicationDir, file), 'utf8'));
  if (!Array.isArray(payload.stories) || !payload.published_at) continue;
  const date = payload.published_at.slice(0, 10);
  editions.push({
    date,
    edition: payload.edition,
    run_id: payload.run_id,
    published_at: payload.published_at,
    story_count: payload.stories.length,
    stories: payload.stories.map(story => ({
      event_id: story.event_id || story.id || story.title,
      title: story.title,
      source: story.source,
      category: story.category || 'research',
      keywords: [...new Set([story.category, story.tag, story.presentation?.section].filter(Boolean))],
    })),
  });
}
const unique = [...new Map(editions.map(item => [item.date, item])).values()].sort((a, b) => b.published_at.localeCompare(a.published_at));
await writeFile(join(root, 'data', 'archive.json'), JSON.stringify({ schema_version: 1, generated_at: new Date().toISOString(), editions: unique }, null, 2) + '\n');
await writeFile(join(root, 'data', 'search-index.json'), JSON.stringify({ schema_version: 1, generated_at: new Date().toISOString(), documents: unique.flatMap(edition => edition.stories.map(story => ({ ...story, date: edition.date, edition: edition.edition }))) }, null, 2) + '\n');
console.log(`Indexed ${unique.length} editions and ${unique.reduce((sum, edition) => sum + edition.story_count, 0)} stories.`);
