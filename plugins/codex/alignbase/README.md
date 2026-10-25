# Alignbase for ChatGPT and Codex

Install and enable the Alignbase plugin from the repository marketplace. Connect the official Alignbase app and sign in when prompted. This package requires the live Alignbase app, `asdk_app_6ac6fb6d7d908191a720e44866608dca`, and bundles no separate direct-MCP connection.

In Codex desktop, review and trust the lifecycle hooks, then start a new session. On supported hosts, the hooks load assigned context and report prompts, final responses, and subagent relationships when Activity is enabled. Hosts without lifecycle hooks can use the app tools. Native hook sessions leave Activity recording to hooks, preventing duplicate model-mediated capture.

The plugin loads the context and Skills assigned to the current agent. Read access works for every connected agent. Write and publish tools only work when the agent has the matching Alignbase permission.

If setup fails, check that the official Alignbase app is available and connected, and that workspace policy permits it. In Codex, also review the lifecycle hooks and start a new session.

When upgrading from a direct-MCP install, remove any separately configured Alignbase MCP connection after confirming the app is connected. Refresh the marketplace, upgrade the plugin, review the changed hooks, and begin a new session. The package retains hooks for supported local Codex sessions; OpenAI directory packages exclude them.

Support: <https://alignbase.com/support/>. Privacy: <https://alignbase.com/privacy/>. Terms: <https://alignbase.com/terms/>.

Version 1.4.0 records tool and lifecycle metadata through supported host hooks.
No separate collector installation is required. Token and cost collection is not enabled.

Use a Codex runtime with MCP tool-hook support. Older runtimes may reject these hooks. Codex currently skips SessionEnd MCP hooks, so session-end capture remains incomplete.
