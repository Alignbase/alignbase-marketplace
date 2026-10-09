# Conversation activity collectors

Hook packages 1.3.0 record tool calls, results, lifecycle, model changes, and
permission requests where the host supports those events. Tokens and cost need a
separate collector because hooks do not expose per-request usage consistently.
These collectors use an OAuth connection with `activity.write`. Activity policy,
retention, deletion, and agent permissions also apply to collected metadata.

## Connect a collector

Run from this directory, with Node 22 or later:

```sh
export ALIGNBASE_ACTIVITY_AUTH_FILE="$HOME/.alignbase/activity-oauth.json"
node setup-oauth.mjs
```

Complete the consent link and choose the same Alignbase agent as the host's MCP
connection. The file holds rotating OAuth credentials with mode 0600. Do not
commit it, copy it into an agent workspace, or include it in hook output. Refresh
runs automatically and uses a lock to avoid concurrent token rotation. If a
process was killed during refresh, remove its stale `.refresh-lock` directory
before retrying. Use a separate auth file and relay port for each host or agent.

## Claude and Codex

Install the matching 1.3.0 hook package first. Keep the relay running while the
host runs:

```sh
export ALIGNBASE_ACTIVITY_INTEGRATION=codex # or claude
node configure-exporter.mjs
node relay.mjs
```

The configuration command writes a private exporter snippet beside the auth
file. For Codex, merge its `activity-codex.toml` settings into your user-level
`~/.codex/config.toml`, preserving other settings. For Claude Code, source
`activity-claude.sh` before launching the host. Restart the host after configuring
telemetry. The relay accepts OTLP/HTTP JSON or protobuf on localhost and requires
a private relay header. It refreshes the upstream bearer credential without
putting it in host configuration. It accepts logs only, not cumulative metrics
or reasoning traces.

Source contracts: [Codex configuration](https://developers.openai.com/codex/config-reference)
and [Claude Code monitoring](https://code.claude.com/docs/en/monitoring-usage).
Desktop and hosted surfaces need their own host-supported exporter configuration;
CLI environment settings do not activate telemetry in every surface.

Telemetry joins a hook conversation only when agent, integration, session,
subagent identity, and policy generation match exactly one stored conversation.
Unmatched records are ignored rather than attached to an unrelated conversation.
Start a new hooked session after setup. Exporter retries deduplicate by request
identity; when the host omits a request ID, the stable telemetry-record timestamp
provides identity. A collector cannot infer subagent lineage from a query label.

## Cursor

The Cursor hook script reads `ALIGNBASE_ACTIVITY_AUTH_FILE` from the host
process environment. Launch Cursor with that variable set. Hook events share the
collector OAuth identity with usage imports. The setup and import scripts ship
in the Cursor package's `scripts` directory too.

For request tokens and charges, use a Cursor team admin API key and explicitly
select one user's email:

```sh
export CURSOR_ADMIN_API_KEY='<team admin key>'
export ALIGNBASE_CURSOR_USER_EMAIL='user@example.com'
node import-cursor-usage.mjs
```

By default this imports the previous 24 hours. `ALIGNBASE_CURSOR_START_MS` sets
an earlier starting timestamp, within Alignbase's metadata retention period.
Pagination is bounded, retries are idempotent, and other users' usage is excluded
even if the upstream email filter is ignored. Rows without a conversation ID or
complete token counters are skipped. This command is an import, not a background
scheduler. Keep the admin key outside agent-visible configuration.

## Accounting and evidence

Each model request keeps original provider input, normalized input including
cache, output, cache read/write, reasoning-token counts, duration, and reported
cost or charge when supplied. Reasoning tokens are counts only and remain a
subset of output. Missing fields are unknown. Estimated costs and charged costs
are distinct; Alignbase does not invent prices for hosts that omit cost.

Tool metadata includes stable call ID, name, outcome, timing, byte sizes, MCP
server, and available execution flags. Tool hook and telemetry results count once
per call; telemetry supplies richer result details. Content bodies, raw tool
arguments/results, file paths, host user identity, credentials, and private
reasoning are excluded by the collector. Existing transcript capture still
follows the configured Activity level. Cursor reports capture health when a tool
lacks a usable identity. Other exporters' outages remain unknown; the relay has
no durable spool and returns failures for the host exporter to retry.

Conversation lists show reported tokens and completed tool calls. Conversation
details show input/output/cost, cache and coverage details, and expandable tool
and model events with their source. Totals cover the selected conversation, not
its child conversations. All host observations are client-reported evidence.
