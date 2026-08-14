# Alignbase for Grok

Install and trust the plugin, connect the Alignbase MCP server when prompted, and sign in to Alignbase. Then add the following instruction to `~/.grok/AGENTS.md` and start a new session:

> Before responding to the first user request, call the Alignbase MCP get_current_context tool exactly once. If the tool is unavailable or the call fails, tell the user that Alignbase context could not be loaded and ask whether they want to continue without it. Do not answer the user's request until they confirm.

Grok's current session-start hooks cannot add instructions to the conversation, so the plugin does not include a startup hook. The global AGENTS.md instruction is required for automatic context loading.

The plugin loads the context and Skills assigned to the current agent. Read access works for every connected agent. Write and publish tools only work when the agent has the matching Alignbase permission.

Use `/mcps` to inspect or reconnect the server. If setup fails, confirm that `https://app.alignbase.ai/mcp` is reachable and start a new session after reconnecting.

Support: <https://alignbase.ai/support/>. Privacy: <https://alignbase.ai/privacy/>. Terms: <https://alignbase.ai/terms/>.
