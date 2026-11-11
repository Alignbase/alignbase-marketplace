// The native /btw command does not emit UserPromptSubmit. Observe its exact
// arguments without changing the command, reading transcripts, or pairing stops.
let sequence = 0;

export function register(on) {
  on('command.run', { command: 'btw' }, async ($, event, next) => {
    if (typeof event.args === 'string' && event.args.trim() !== '') {
      try {
        const session = await $.session.id();
        const received = await $.clock.now();
        const result = await $.mcp.call('plugin:alignbase:alignbase', 'record_hook_activity_event', {
          integration: 'claude',
          adapter_version: '1.4.4',
          capabilities: ['context_session_start', 'prompt_submit', 'final_response', 'subagent_lifecycle', 'tool_use', 'lifecycle'],
          event: {
            schema_version: '1',
            event_type: 'prompt.submitted',
            event_id: `side-chat:${session}:${received}:${++sequence}`,
            session_id: session,
            source: 'side_chat',
            completeness: 'partial',
            prompt_text: event.args,
          },
        });
        if (result.isError) {
          await $.ui.log('Alignbase could not record the side-question prompt. Check the MCP connection.');
        }
      } catch {
        // Errors can include submitted text or credentials. Only show a fixed
        // category, and always let the original side-question command proceed.
        await $.ui.log('Alignbase could not record the side-question prompt. Check the MCP connection.');
      }
    }
    return next(event);
  }).catch(($, event, next) => next(event));
}
