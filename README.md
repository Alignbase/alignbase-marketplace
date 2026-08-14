# Alignbase plugin marketplace

This repository contains the official Alignbase plugin packages for the OpenAI universal plugin directory, the Claude plugin directory, Grok, and Cursor Marketplace.

## ChatGPT and Codex

The OpenAI universal plugin package works with both ChatGPT and Codex. In ChatGPT, add the `alignbase` plugin from this marketplace. In Codex, run:

```sh
codex plugin marketplace add Alignbase/alignbase-marketplace &&
codex plugin add alignbase@alignbase
```

Enable the plugin, connect the Alignbase MCP server when prompted, and sign in to Alignbase. In Codex, approve the startup hook and begin a new session.

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

## Cursor

The Cursor package is in `plugins/cursor/alignbase`. Install it from Cursor Marketplace after publication, or test it as a local plugin before submission.

## Grok

```sh
grok plugin marketplace add Alignbase/alignbase-marketplace &&
grok plugin install alignbase --trust
```

Connect the Alignbase MCP server when prompted and sign in. Grok's current session-start hooks cannot add instructions to a conversation, so follow the plugin README to add the required startup instruction to `~/.grok/AGENTS.md` before beginning a new session.

## Repository layout

- `.agents/plugins/marketplace.json` is the Codex marketplace catalog.
- `.claude-plugin/marketplace.json` is the Claude marketplace catalog.
- `.cursor-plugin/marketplace.json` is the Cursor marketplace catalog.
- `.grok-plugin/marketplace.json` is the Grok marketplace catalog.
- `plugins/codex/alignbase` contains the Codex plugin.
- `plugins/claude/alignbase` contains the Claude plugin for Cowork and Claude Code.
- `plugins/cursor/alignbase` contains the Cursor plugin.
- `plugins/grok/alignbase` contains the Grok plugin.

## Publishing updates

Keep all four plugin manifest versions and all marketplace metadata versions in sync. Bump them before publishing a plugin update because hosts cache installed plugin versions.

Run the local checks before pushing:

```sh
python3 scripts/validate.py
claude plugin validate plugins/claude/alignbase --strict
```

See `SUBMISSION.md` for the store fields, review checks, and unresolved submission blockers.

## License

The plugin packages in this repository are available under the [MIT License](LICENSE).
