import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { corrections, migrate, pool } from '../ops-db.mjs';

await migrate();
const current = JSON.parse(await readFile(new URL('../../data/news.json', import.meta.url), 'utf8'));
const rows = await corrections(null);
const byStory = Object.groupBy(rows.filter(row => row.status === 'published'), row => row.story_id);
const stories = current.stories.map(story => ({ ...story, corrections: byStory[story.event_id] || byStory[story.id] || [] }));
const output = { schema_version: 1, exported_at: new Date().toISOString(), edition: current.edition, corrections: rows, stories };
const dataDir = new URL('../../data/', import.meta.url);
await mkdir(dataDir, { recursive: true });
await writeFile(new URL('corrections.json', dataDir), JSON.stringify(output, null, 2) + '\n');
await pool.end();
console.log(`Exported ${rows.length} corrections for edition ${current.edition}.`);
