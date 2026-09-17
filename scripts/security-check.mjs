import { execFileSync } from 'node:child_process';

const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
let source = ''; try { source = execFileSync('git', ['grep', '-nI', '-E', 'BEGIN (RSA|OPENSSH|EC|DSA) PRIVATE KEY|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9_]{20,}', '--', ...files], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch (error) { if (error.status !== 1) throw error; }
if (source) throw Error(`possible committed secret detected:\n${source}`);
console.log(JSON.stringify({ ok: true, scanned_files: files.length, secret_patterns: 'no-known-private-key-or-token-patterns' }));
