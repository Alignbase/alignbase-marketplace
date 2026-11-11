import assert from 'node:assert/strict';
import { register } from '../plugins/claude/alignbase/hooks/side-chat.mjs';

let handler;
let fallback;
register((event, matcher, fn) => {
  assert.equal(event, 'command.run');
  assert.deepEqual(matcher, { command: 'btw' });
  handler = fn;
  return { catch(fn) { fallback = fn; } };
});
assert.equal(typeof fallback, 'function');

async function run(args, behavior = {}) {
  const sent = [];
  const logs = [];
  const original = { args, command: 'btw', origin: { kind: 'composer' } };
  let continued = 0;
  const result = { text: undefined, ref: 7 };
  const $ = {
    session: { async id() { return 'synthetic-parent'; } },
    clock: { async now() { return 42; } },
    mcp: { async call(server, tool, input) {
      sent.push({ server, tool, input });
      if (behavior.throw) throw new Error('DO_NOT_LOG_SECRET_OR_PAYLOAD');
      return { isError: behavior.isError };
    } },
    ui: { async log(message) { logs.push(message); } },
  };
  assert.equal(await handler($, original, async event => {
    assert.equal(event, original);
    continued++;
    return result;
  }), result);
  assert.equal(continued, 1);
  assert.ok(logs.every(x => !x.includes('DO_NOT_LOG_SECRET_OR_PAYLOAD')));
  return { sent, logs };
}

const first = await run('  synthetic side question  ');
const second = await run('  synthetic side question  ');
assert.equal(first.sent.length, 1);
const { server, tool, input } = first.sent[0];
assert.equal(server, 'plugin:alignbase:alignbase');
assert.equal(tool, 'record_hook_activity_event');
assert.equal(input.event.prompt_text, '  synthetic side question  ');
assert.equal(input.event.source, 'side_chat');
assert.equal(input.event.session_id, 'synthetic-parent');
assert.equal(input.event.completeness, 'partial');
assert.deepEqual(Object.keys(input.event).sort(), ['completeness', 'event_id', 'event_type', 'prompt_text', 'schema_version', 'session_id', 'source']);
assert.notEqual(input.event.event_id, second.sent[0].input.event.event_id);
assert.equal((await run('')).sent.length, 0);
assert.equal((await run(' \n ')).sent.length, 0);
assert.equal((await run('failure test', { throw: true })).logs.length, 1);
assert.equal((await run('error result', { isError: true })).logs.length, 1);
console.log('Side-question hook tests passed.');
