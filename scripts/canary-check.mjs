import { access, readFile, writeFile } from 'node:fs/promises';
import { validateEdition } from '../workers/briefing/schema.mjs';

const args=process.argv.slice(2);const get=name=>{const index=args.indexOf(name);return index>=0?args[index+1]:null};
const edition=JSON.parse(await readFile(new URL('../data/news.json',import.meta.url),'utf8'));validateEdition(edition);
let health=null;try{health=JSON.parse(await readFile(new URL('../data/health/last-run.json',import.meta.url),'utf8'))}catch{throw Error('health artifact is missing')}
if(health.status==='critical')throw Error('latest retrieval health is critical');
const completed=Date.parse(health.completed_at);if(!Number.isFinite(completed)||Date.now()-completed>36*3600000)throw Error('health artifact is stale');
const sampledBy=get('--sampled-by');if(!sampledBy)throw Error('human sampling is required: pass --sampled-by "operator"');
const record={run_id:edition.run_id,edition:edition.edition,checked_at:new Date().toISOString(),sampled_by:sampledBy,stories:edition.stories.length,health_status:health.status};
if(args.includes('--record')){let history=[];try{history=JSON.parse(await readFile(new URL('../data/canary-runs.json',import.meta.url),'utf8'))}catch{};history.push(record);await writeFile(new URL('../data/canary-runs.json',import.meta.url),JSON.stringify(history.slice(-14),null,2)+'\n')}
console.log(JSON.stringify({ok:true,...record,canary_editions:1,remaining_to_go:13}));
