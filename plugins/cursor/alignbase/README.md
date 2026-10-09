# Alignbase for Cursor

Install and enable the plugin, connect the Alignbase MCP server when prompted, and sign in to Alignbase. Start a new Cursor agent session after authentication.

The plugin loads the context and Skills assigned to the current agent. Assigned context is delivered without repository read permission. Discovering or reading other Resources requires the matching Alignbase permission, as do writes and publication.

If setup fails, confirm that `https://app.alignbase.com/mcp` is reachable, reconnect the MCP server, and start a new session.

Support: <https://alignbase.com/support/>. Privacy: <https://alignbase.com/privacy/>. Terms: <https://alignbase.com/terms/>.

Version 1.3.0 also records tool and lifecycle metadata on supported hosts.
Tokens and cost require the host collector connection. See
[scripts/activity/README.md](scripts/activity/README.md) for setup.
