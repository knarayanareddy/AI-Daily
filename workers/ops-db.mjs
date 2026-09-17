import pg from 'pg';
import { createHash, randomBytes } from 'node:crypto';
const { Pool } = pg;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: Number(process.env.DB_POOL_SIZE || 5), ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false } });
export const hash = value => createHash('sha256').update(value).digest('hex');
export const token = () => randomBytes(32).toString('base64url');

export async function migrate() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required; JSON operator persistence has been removed');
  await pool.query(`CREATE TABLE IF NOT EXISTS ops_schema_version (version integer PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE IF NOT EXISTS ops_sessions (id text PRIMARY KEY, subject text NOT NULL, email text NOT NULL, name text, roles jsonb NOT NULL DEFAULT '[]', expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE IF NOT EXISTS ops_auth_states (state text PRIMARY KEY, nonce text NOT NULL, code_verifier text NOT NULL, redirect_to text, expires_at timestamptz NOT NULL);
    CREATE TABLE IF NOT EXISTS ops_decisions (id bigserial PRIMARY KEY, cluster_id text NOT NULL, run_id text, decision text NOT NULL CHECK (decision IN ('approved','rejected','escalated')), reason text NOT NULL DEFAULT '', actor_subject text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE IF NOT EXISTS ops_audit (id bigserial PRIMARY KEY, event_type text NOT NULL, payload jsonb NOT NULL, actor_subject text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE IF NOT EXISTS ops_state (key text PRIMARY KEY, value jsonb NOT NULL, updated_by text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE IF NOT EXISTS ops_corrections (id bigserial PRIMARY KEY, edition_id text NOT NULL, story_id text NOT NULL, claim text NOT NULL, correction text NOT NULL, reason text NOT NULL, actor_subject text NOT NULL, status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','retracted')), created_at timestamptz NOT NULL DEFAULT now());
    CREATE INDEX IF NOT EXISTS ops_decisions_run_idx ON ops_decisions(run_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS ops_audit_created_idx ON ops_audit(created_at DESC);
  `);
}
export async function transaction(fn) { const client = await pool.connect(); try { await client.query('BEGIN'); const result = await fn(client); await client.query('COMMIT'); return result; } catch (e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); } }
export async function createSession(user, ttlHours = 8) { const id = token(); await pool.query('INSERT INTO ops_sessions(id,subject,email,name,roles,expires_at) VALUES($1,$2,$3,$4,$5,now()+$6::interval)', [hash(id), user.sub, user.email, user.name || '', JSON.stringify(user.roles || []), `${ttlHours} hours`]); return id; }
export async function getSession(id) { if (!id) return null; const result = await pool.query('SELECT subject,email,name,roles,expires_at FROM ops_sessions WHERE id=$1 AND expires_at>now()', [hash(id)]); return result.rows[0] || null; }
export async function deleteSession(id) { if (id) await pool.query('DELETE FROM ops_sessions WHERE id=$1', [hash(id)]); }
export async function saveAuthState(state, nonce, verifier, redirectTo) { await pool.query('INSERT INTO ops_auth_states(state,nonce,code_verifier,redirect_to,expires_at) VALUES($1,$2,$3,$4,now()+interval \'10 minutes\')', [state, nonce, verifier, redirectTo || '/ops.html']); }
export async function takeAuthState(state) { return transaction(async client => { const result = await client.query('DELETE FROM ops_auth_states WHERE state=$1 AND expires_at>now() RETURNING *', [state]); return result.rows[0] || null; }); }
export async function saveDecision({ clusterId, runId, decision, reason, actor }) { return transaction(async client => { const result = await client.query('INSERT INTO ops_decisions(cluster_id,run_id,decision,reason,actor_subject) VALUES($1,$2,$3,$4,$5) RETURNING *', [clusterId, runId || null, decision, reason || '', actor.subject]); await client.query('INSERT INTO ops_audit(event_type,payload,actor_subject) VALUES($1,$2,$3)', ['operator_decision', JSON.stringify({ cluster_id: clusterId, run_id: runId, decision, reason }), actor.subject]); return result.rows[0]; }); }
export async function decisions(runId) { const result = await pool.query('SELECT DISTINCT ON (cluster_id) cluster_id,run_id,decision,reason,actor_subject,created_at FROM ops_decisions WHERE ($1::text IS NULL OR run_id=$1) ORDER BY cluster_id,created_at DESC', [runId || null]); return result.rows; }
export async function getState() { const result = await pool.query('SELECT key,value FROM ops_state'); return Object.fromEntries(result.rows.map(row => [row.key, row.value])); }
export async function setState(key, value, actor) { await transaction(async client => { await client.query('INSERT INTO ops_state(key,value,updated_by) VALUES($1,$2,$3) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value,updated_by=EXCLUDED.updated_by,updated_at=now()', [key, JSON.stringify(value), actor.subject]); await client.query('INSERT INTO ops_audit(event_type,payload,actor_subject) VALUES($1,$2,$3)', ['state_change', JSON.stringify({ key, value }), actor.subject]); }); }
export async function audit(event, actor) { await pool.query('INSERT INTO ops_audit(event_type,payload,actor_subject) VALUES($1,$2,$3)', [event.type, JSON.stringify(event), actor.subject]); }
export async function createCorrection({ editionId, storyId, claim, correction, reason, actor }) { return transaction(async client => { const result = await client.query('INSERT INTO ops_corrections(edition_id,story_id,claim,correction,reason,actor_subject) VALUES($1,$2,$3,$4,$5,$6) RETURNING *', [editionId, storyId, claim, correction, reason, actor.subject]); await client.query('INSERT INTO ops_audit(event_type,payload,actor_subject) VALUES($1,$2,$3)', ['correction_created', JSON.stringify({ edition_id: editionId, story_id: storyId, claim }), actor.subject]); return result.rows[0]; }); }
export async function corrections(editionId) { const result = await pool.query('SELECT * FROM ops_corrections WHERE ($1::text IS NULL OR edition_id=$1) ORDER BY created_at DESC', [editionId || null]); return result.rows; }
