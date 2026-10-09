# Alignbase for ChatGPT and Codex

Install and enable the Alignbase plugin from the repository marketplace. Connect its remote MCP server and sign in to Alignbase when prompted. The package connects directly to `https://app.alignbase.com/mcp` using OAuth and does not require the public directory app.

In Codex desktop, review and trust the lifecycle hooks, then start a new session. On supported hosts, the hooks load assigned context and report prompts, final responses, and subagent relationships when Activity is enabled. Hosts without lifecycle hooks can use the MCP tools directly.

The plugin loads the context and Skills assigned to the current agent. Read access works for every connected agent. Write and publish tools only work when the agent has the matching Alignbase permission.

If setup fails, check that your host supports repository plugins with remote MCP servers and that workspace policy permits the connection, then retry OAuth. In Codex, also review the lifecycle hooks and start a new session.

The public directory submission is a separate MCP distribution path. OpenAI currently excludes lifecycle hooks from directory submissions.

Support: <https://alignbase.com/support/>. Privacy: <https://alignbase.com/privacy/>. Terms: <https://alignbase.com/terms/>.

Version 1.3.1 records tool and lifecycle metadata through supported host hooks.
No separate collector installation is required. Token and cost collection is not enabled.
