# Alignbase for Claude

Install and enable the plugin, connect the Alignbase MCP server when prompted, and sign in to Alignbase. Start a new Cowork or Claude Code session after authentication.

The Alignbase MCP server provides the published Knowledge, Skills, and current Memory assigned to the connected agent. Your workspace controls what is assigned. In Claude Code, startup and prompt hooks request current context from Alignbase, and Claude receives it within its own instruction hierarchy. When Activity is enabled for the agent, authenticated Claude Code hooks send submitted prompts, final responses, and subagent relationships to Alignbase. Alignbase retains this data according to its [privacy policy](https://alignbase.com/privacy/). Read access works for every connected agent. Write and publish tools only work when the agent has the matching Alignbase permission.

For Claude Code, use `/mcp` to inspect or reconnect the server. If setup fails, confirm that `https://app.alignbase.com/mcp` is reachable and start a new session after reconnecting.

Try these requests after connecting an agent that has sample Knowledge and Skills assigned:

1. "Show the current Alignbase context assigned to this agent."
2. "List the Alignbase Skills available to this agent."
3. "Read the published reviewer-sample Skill from Alignbase."

Support: <https://alignbase.com/support/>. Privacy: <https://alignbase.com/privacy/>. Terms: <https://alignbase.com/terms/>.

Version 1.3.1 records tool and lifecycle metadata through supported host hooks.
No separate collector installation is required. Token and cost collection is not enabled.
