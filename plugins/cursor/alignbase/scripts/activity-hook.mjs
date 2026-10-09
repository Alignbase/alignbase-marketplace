#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { activityAccessToken, activityBaseURL } from './activity-oauth.mjs';

// No content leaves this adapter: serialize only the metadata allowlist below.
export function normalizeHook(input, eventName = input.hook_event_name) {
  const session = input.conversation_id || input.session_id || input.parent_conversation_id;
  if (!session) return null;
  const event = { schema_version: '1', session_id: session, source: '', completeness: 'partial' };
  if (input.generation_id) event.turn_id = input.generation_id;
  const actor = input.subagent_id || input.agent_id;
  if (actor) {
    event.actor_id = actor; event.actor_type = input.subagent_type || input.agent_type || 'subagent';
    event.parent_session_id = input.parent_conversation_id || session;
  } else if (input.agent_type === 'subagent' || input.subagent_type) {
    return null;
  }
  const observation = {};
  if (input.model_id || input.model) observation.model = input.model_id || input.model;
  if (input.tool_name) observation.tool_name = input.tool_name;
  if (input.tool_call_id || input.tool_use_id) observation.tool_call_id = input.tool_call_id || input.tool_use_id;
  const bytes = value => Buffer.byteLength(typeof value === 'string' ? value : JSON.stringify(value));
  if (input.tool_input !== undefined) observation.input_bytes = bytes(input.tool_input);
  if (input.tool_output !== undefined) observation.output_bytes = bytes(input.tool_output);
  if (input.duration !== undefined && Number.isSafeInteger(input.duration)) observation.duration_ms = input.duration;
  if (input.mcp_server_name) observation.mcp_server = input.mcp_server_name;
  switch (eventName) {
    case 'preToolUse': event.event_type = 'tool.started'; event.source = 'pre_tool_use'; break;
    case 'postToolUse': event.event_type = 'tool.finished'; event.source = 'post_tool_use'; observation.outcome = 'success'; break;
    case 'postToolUseFailure': event.event_type = 'tool.finished'; event.source = 'post_tool_use_failure'; observation.outcome = 'error'; break;
    case 'sessionStart': event.event_type='session.started';event.source='session_start';return event;
    case 'sessionEnd': event.event_type = 'session.ended'; event.source = 'session_end'; return event;
    case 'preCompact': event.event_type = 'context.compacted'; event.source = 'pre_compact'; observation.trigger = input.trigger; observation.context_tokens = input.context_tokens; observation.context_window = input.context_window_size; break;
    case 'beforeSubmitPrompt': event.event_type = 'prompt.submitted'; event.source = 'user_prompt_submit'; return event;
    case 'afterAgentResponse': event.event_type = 'response.final'; event.source = 'after_response'; return event;
    case 'subagentStart':
    case 'subagentStop':
      if (!input.subagent_id && !input.agent_id) return null;
      event.actor_id = input.subagent_id || input.agent_id; event.actor_type = input.subagent_type || input.agent_type || 'subagent'; event.parent_session_id = input.parent_conversation_id || session;
      event.event_type = eventName === 'subagentStart' ? 'subagent.started' : 'response.final'; event.source = eventName === 'subagentStart' ? 'subagent_start' : 'subagent_stop'; return event;
    default: return null;
  }
  if (event.event_type.startsWith('tool.') && /(?:record_hook_activity_event|record_activity_event|start_hook_session)/.test(observation.tool_name || '')) return null;
  if (event.event_type.startsWith('tool.') && (!observation.tool_call_id || !observation.tool_name)) {
    event.event_type='capture.health';event.source='capture_health';event.observation={dropped_events:1,error_class:'missing_tool_identity'};return event;
  }
  event.observation = observation;
  if (observation.tool_call_id) event.event_id = 'cursor-' + createHash('sha256').update([session,event.actor_id || '',event.event_type,observation.tool_call_id].join('\0')).digest('hex');
  return event;
}
async function main() {
  // Credentials stay in the host environment, never in hook output or config
  // packages. No credential means capture is unavailable, not zero activity.
  if (!process.env.ALIGNBASE_ACTIVITY_ACCESS_TOKEN && !process.env.ALIGNBASE_ACTIVITY_AUTH_FILE) return;
  const token = await activityAccessToken();
  if (!token) return;
  let text = ''; for await (const chunk of process.stdin) { text += chunk; if (text.length > 4 * 1024 * 1024) return; }
  const event = normalizeHook(JSON.parse(text), process.argv[2]);
  if (!event) return;
  const base = await activityBaseURL();
  const response = await fetch(`${base}/activity/v1/events?integration=cursor`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({events:[event]}), signal: AbortSignal.timeout(5000) });
  if (!response.ok) process.stderr.write(`Alignbase activity unavailable (${response.status}).\n`);
}
if (process.argv[1]?.endsWith('/activity-hook.mjs')) {
  // Observational permission hooks must allow the host action even when capture fails.
  if (['preToolUse', 'subagentStart'].includes(process.argv[2])) process.stdout.write('{"permission":"allow"}\n');
  main().catch(() => process.stderr.write('Alignbase activity unavailable.\n'));
}
