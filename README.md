# Alignbase plugin marketplace

This repository contains the official Alignbase plugin packages for the OpenAI universal plugin directory, the Claude plugin directory, Cursor Marketplace, and Grok Build. Grok Bot is a separate host and connects to Alignbase directly through Streamable HTTP.

## ChatGPT and Codex

The repository plugin is the preferred distribution path for lifecycle hooks on supported hosts. The public directory submission is a separate MCP distribution path without hooks. In ChatGPT, add the `alignbase` plugin from this marketplace. In Codex, run:

```sh
codex plugin marketplace add Alignbase/alignbase-marketplace &&
codex plugin add alignbase@alignbase
```

The repository plugin connects directly to the Alignbase remote MCP server with OAuth. Enable the plugin, connect when prompted, and sign in to Alignbase. It does not depend on the public directory submission. In Codex, approve the startup hook and begin a new session.

## Claude

Open **Customize > Plugins > + > Add marketplace > Add from a repository**.

```text
https://github.com/Alignbase/alignbase-marketplace
```

Or install with Claude Code:

```sh
claude plugin marketplace add Alignbase/alignbase-marketplace &&
claude plugin install alignbase@alignbase &&
claude
```

Connect the Alignbase MCP server when prompted, sign in, and start a new Cowork or Claude Code session.

Version 1.2.1 uses `https://app.alignbase.com/mcp`. Existing plugin installs
using `https://app.alignbase.ai/mcp` continue to work while teams upgrade.

## Cursor

The Cursor package is in `plugins/cursor/alignbase`. Install it from Cursor Marketplace after publication, or test it as a local plugin before submission.

## Grok Build

```sh
grok plugin marketplace add Alignbase/alignbase-marketplace &&
grok plugin install alignbase --trust
```

Connect the Alignbase MCP server when prompted and sign in. Grok Build's current session-start hooks cannot add instructions to a conversation, so follow the plugin README to add the required startup instruction to `~/.grok/AGENTS.md` before beginning a new session.

Do not install this package in Grok Bot. Add `https://app.alignbase.com/mcp` to Grok Bot as a Streamable HTTP connector and complete browser sign-in.

## Repository layout

- `.agents/plugins/marketplace.json` is the Codex marketplace catalog.
- `.claude-plugin/marketplace.json` is the Claude marketplace catalog.
- `.cursor-plugin/marketplace.json` is the Cursor marketplace catalog.
- `.grok-plugin/marketplace.json` is the Grok Build marketplace catalog.
- `plugins/codex/alignbase` contains the Codex plugin.
- `plugins/claude/alignbase` contains the Claude plugin for Cowork and Claude Code.
- `plugins/cursor/alignbase` contains the Cursor plugin.
- `plugins/grok/alignbase` contains the Grok Build plugin.

## Publishing updates

Keep all four plugin manifest versions and all marketplace metadata versions in sync. Bump them before publishing a plugin update because hosts cache installed plugin versions.

The Alignbase webapp also embeds download ZIPs from `app/internal/pluginbundle/assets` in the private `Alignbase/alignbase` repository. For Claude, ChatGPT/Codex, and Cursor, keep each current embedded package byte-for-byte equal to the matching `plugins/<host>/alignbase` directory here, including hidden files and images. Update the `packageSpecs` version in `app/internal/pluginbundle/bundle.go` whenever a manifest version changes. Publish this repository first, then ship the matching webapp bundle and check `/plugins/claude/download`, `/plugins/chatgpt/download`, and `/plugins/cursor/download`. The webapp's `app/internal/pluginbundle/README.md` has the asset paths and verification steps.

Run the local checks before pushing:

```sh
python3 scripts/validate.py
claude plugin validate plugins/claude/alignbase
```

The Claude validator reports warnings for the directory metadata fields described in `SUBMISSION.md`. Keep those fields for the directory listing; validation errors must still pass before publishing.

See `SUBMISSION.md` for the store fields, review checks, and unresolved submission blockers.

## License

The plugin packages in this repository are available under the [MIT License](LICENSE).
