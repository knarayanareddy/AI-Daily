import test from 'node:test';
import assert from 'node:assert/strict';
import { safeReturnTo } from '../workers/ops-auth.mjs';

test('operator return paths stay same-origin and reject open redirects', () => {
  assert.equal(safeReturnTo('/ops.html'), '/ops.html');
  assert.equal(safeReturnTo('/ops.html?tab=alerts'), '/ops.html?tab=alerts');
  assert.equal(safeReturnTo('https://attacker.example'), '/ops.html');
  assert.equal(safeReturnTo('//attacker.example'), '/ops.html');
  assert.equal(safeReturnTo('javascript:alert(1)'), '/ops.html');
});
