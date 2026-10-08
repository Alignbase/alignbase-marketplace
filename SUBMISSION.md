# Alignbase plugin submission sheet

Reviewed against the public store documentation on September 27, 2026.

## Submission status

The four packages have store-native manifests, dynamic OAuth configuration, the same 400 by 400 Alignbase logo with a blue background, and public source paths in this repository. Codex uses the PNG from its `interface` metadata, and Cursor uses the repo-relative SVG from both its marketplace entry and plugin manifest. Claude's directory submission reads the SVG icon and policy links from the plugin manifest.

The Alignbase OpenAI app submission, `asdk_app_6ac6fb6d7d908191a720e44866608dca`, is pending review. The repository plugin connects directly to the MCP endpoint with OAuth and does not reference the submission. It retains lifecycle hooks for supported hosts. Public directory submissions cannot include lifecycle hooks.

The public terms, privacy, and support pages were checked again on September 27, 2026. The Claude developer portal accepted the public plugin source in its initial validation. Before submission, connect GitHub to the submitting Claude organization, verify the existing sample-data reviewer account, and complete the policy acknowledgements with an authorized company representative. Section 2F warrants a transparent description of the startup context behavior for Anthropic's review.

The metadata does not claim an endorsement, compare Alignbase with another product, hide paid actions, or promise unsupported features. The packages contain no API keys, fixed OAuth client IDs, or passwords. Codex and Claude hooks report Activity to Alignbase when enabled.

## Logo delivery by host

| Host | Supported path |
| --- | --- |
| OpenAI | Codex package cards and composer surfaces read `interface.logo` and `interface.composerIcon` from `.codex-plugin/plugin.json`. Both paths start with `./` and point to the 400 by 400 PNG inside the plugin. OpenAI accepts square PNG, JPEG, WebP, or SVG files up to 5 MiB. Raster images must be between 48 by 48 and 4,096 by 4,096 pixels. Our PNG is 88,013 bytes, decodes as 8-bit RGBA, and is comfortably inside every limit. |
| Claude | The directory portal accepts a square icon of at least 128 by 128 pixels. The plugin manifest points to the bundled 400 by 400 SVG. The same logo is available as a PNG. |
| Cursor | Cursor reads `logo` as a repo-relative path or an absolute URL and recommends committing the file to the repository. Cursor does not publish size, aspect-ratio, or file-size limits. The catalog and plugin manifest both point to a valid, self-contained 400 by 400 SVG, which matches Cursor's documented `assets/logo.svg` example. |

## Shared production details

| Field | Prepared value |
| --- | --- |
| Product name | Alignbase |
| Developer | Alignbase |
| Contact email | `support@alignbase.com` |
| Website | `https://alignbase.com` |
| Repository | `https://github.com/Alignbase/alignbase-marketplace` |
| MCP server | `https://app.alignbase.com/mcp` |
| Authentication | OAuth 2.0 authorization code flow with PKCE and dynamic client registration |
| OAuth scopes | `context.read`, `context.write` |
| Short description | Your team's approved context. |
| Package description | Load your team's approved Alignbase context and Skills at session start. |
| Listing category | Productivity |
| Logo | `assets/alignbase-logo.png`, 400 by 400 PNG, white Alignbase mark on a blue background. Cursor also includes the equivalent SVG. |
| Support URL | `https://alignbase.com/support/` |
| Privacy policy URL | `https://alignbase.com/privacy/` |
| Terms URL | `https://alignbase.com/terms/` |

## OpenAI universal plugin directory

One submitted app is pending review for the universal directory shared by ChatGPT and Codex.

### Official links

- Submission portal: <https://platform.openai.com/plugins>
- Submission instructions: <https://developers.openai.com/plugins/deploy/submission>
- Review requirements: <https://developers.openai.com/plugins/deploy/app-review>
- Plugin guidelines: <https://developers.openai.com/plugins/app-guidelines>
- Metadata guide: <https://developers.openai.com/plugins/guides/optimize-metadata>
- Package format: <https://developers.openai.com/plugins/build/plugins>
- Submission errors: <https://developers.openai.com/plugins/deploy/submission-errors>
- Organization roles: <https://platform.openai.com/settings/organization/people/roles>
- Organization verification: <https://platform.openai.com/settings/organization/general>

### Source and listing fields

| Portal field | Value or action |
| --- | --- |
| Submission type | With MCP |
| Plugin name | Alignbase |
| Short description | Your team's approved context. |
| Long description | Connect ChatGPT and Codex to the context and Skills assigned to the current agent in Alignbase. MCP tools load or manage Alignbase context when the agent has permission. |
| Developer Identity | Select the verified Alignbase business identity |
| Category | Productivity |
| Logo | Upload `plugins/codex/alignbase/assets/alignbase-logo.png` |
| Website | `https://alignbase.com` |
| Support URL | `https://alignbase.com/support/` |
| Privacy policy URL | `https://alignbase.com/privacy/` |
| Terms URL | `https://alignbase.com/terms/` |
| Screenshots | None. The plugin has no UI, and OpenAI says not to submit screenshots for plugins without UI |
| MCP URL type | Universal |
| MCP server URL | `https://app.alignbase.com/mcp` |
| Authentication | OAuth 2.0 |
| Demo credentials | Add the reviewer account after it is created |
| UI content security policy | Not applicable because the MCP server returns no UI |
| Countries and regions | Select only markets covered by Alignbase's terms, privacy policy, support, and export review |
| Release notes | Initial submission of Alignbase. Loads approved context and Skills assigned to an agent and provides permission-scoped MCP tools for reading, drafting, writing, and publishing Alignbase context. OAuth uses dynamic client registration and PKCE. No UI is included. |

The repository package manifest is `plugins/codex/alignbase/.codex-plugin/plugin.json`. It points to `.mcp.json` and the square PNG. Codex discovers lifecycle hooks from `hooks/hooks.json`. This repository package is separate from the in-review MCP submission and is the preferred installation path when hooks are needed. Do not upload its hooks to the public directory. The public directory has its own logo upload in the OpenAI submission form.

### Starter prompts

1. Load my current Alignbase context.
2. Find and read a published Alignbase Skill.
3. Find and read published Alignbase Knowledge.
4. Publish a Skill version I explicitly name.
5. Update Alignbase Memory while preserving its existing content.

### Positive test cases

The submitted form uses the `tester@alignbase.com` account and `Test Tester's
Agent`. Its sample Resources and permissions are listed in the private app
repository's `plugins/README.md`. These summaries describe the five submitted
cases; `plugins/chatgpt-app-submission.json` in that repository holds the exact
prompts and expected results:

1. Load current context with `get_current_context`. The answer must identify `Reviewer Sample Knowledge`, the `reviewer-sample` Skill, and `Submission Review Memory`.
2. Find and read the published `reviewer-sample` package with `list_skills` and `read_skill`, including its version, digest, and install metadata.
3. Find and read `Reviewer Sample Knowledge` with `list_knowledge` and `read_knowledge`, including its authority, version, and two existing bullets.
4. Find the currently published `reviewer-sample` version with `list_skills`, then call `publish_skill` with that same version. It must report that nothing changed.
5. Read `Submission Review Memory` with `list_memories` and `read_memory`, then use `write_memory` with the latest version. Keep `- Submission review check: ready` exactly once and preserve all other content.

### Negative test cases

The three submitted negative cases ask about unrelated scheduling, host memory
settings, and repository access. None should invoke the Alignbase plugin.

### Tool annotation review

All tools operate inside a private Alignbase tenant, so `openWorldHint` is `false`. Most read and list tools use `readOnlyHint: true` and `destructiveHint: false`; `read_inbox` changes read status. Create, proposal, publish, and sync-report tools use `readOnlyHint: false` and `destructiveHint: false`. Full-document replacement tools use `readOnlyHint: false` and `destructiveHint: true`.

Before submission, scan the production MCP server in the portal and inspect every response. OpenAI asks developers to remove personal data, authentication secrets, debug payloads, internal identifiers, and timestamps unless the user needs them for the stated workflow. Pay particular attention to draft author email fields and IDs in list and read responses.

### Submission steps

1. Give the submitter Apps Management Write access in the OpenAI Platform organization.
2. Complete Alignbase business verification in the same organization.
3. Confirm the support, privacy, and terms pages are live.
4. Create and seed the reviewer account.
5. Open the portal, choose **Create plugin**, then choose **With MCP**.
6. Complete the Info fields above.
7. Enter the Universal MCP URL and OAuth details.
8. Deploy the generated domain challenge token at the exact well-known path.
9. Select **Scan Tools**. Review every tool name, description, input schema, output, and annotation.
10. Add the starter prompts above and the exact five positive and three negative test cases from `plugins/chatgpt-app-submission.json` in the private app repository.
11. Select the approved countries and regions, add the release notes, and make the policy attestations only after the blockers are closed.
12. Submit for review. After approval, return to the portal and publish the approved version.

Do not add upgrade, checkout, or subscription sales flows to the plugin. OpenAI's plugin rules bar using plugins to sell digital services or subscriptions, including indirect freemium upsells.

## Claude plugin directory

The same Claude directory listing is available in Cowork and Claude Code. In Claude Code it appears through the `claude-plugins-official` marketplace.

### Official links

- Submission guide: <https://claude.com/docs/plugins/submit>
- Developer portal: <https://claude.ai/directory/manage>
- Pre-submission checklist: <https://claude.com/docs/plugins/pre-submission-checklist>
- Plugin reference: <https://code.claude.com/docs/en/plugins-reference>
- Directory policy: <https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy>
- Directory terms: <https://support.claude.com/en/articles/13145338-anthropic-software-directory-terms>

### Submission fields

| Field | Value or action |
| --- | --- |
| Plugin GitHub link | `https://github.com/Alignbase/alignbase-marketplace/tree/main/plugins/claude/alignbase` |
| Repository visibility | Public |
| Name | Alignbase |
| Description | Load your team's approved Alignbase context and Skills at session start. |
| Developer | Alignbase |
| Contact | `support@alignbase.com` |
| Homepage | `https://alignbase.com` |
| Privacy policy | `https://alignbase.com/privacy/` |
| Terms | `https://alignbase.com/terms/` |
| Support | `https://alignbase.com/support/` |
| Logo | The plugin manifest's `icon` field points to `assets/alignbase-logo.svg`, a square 400 by 400 image. |
| Test account | `tester@alignbase.com`; keep its password only in the portal's private reviewer field |
| MCP endpoint | `https://app.alignbase.com/mcp` |
| Example prompts | Use the first three starter prompts below |

Starter prompts:

1. Load the Alignbase context assigned to this agent.
2. List the Alignbase Skills available to this agent.
3. Show me the Knowledge this agent can read and which items it can edit.

### Policy and review

Section 2F of the Directory Policy says that instructional software must not direct Claude to dynamically pull behavioral instructions from external sources for Claude to execute. Alignbase's startup hooks request workspace-assigned context. The submission must describe this behavior accurately so Anthropic can review it. The same applies to activity hooks: they send submitted prompts and final responses to Alignbase when Activity is enabled. Do not claim the plugin only reads static reference data or omits conversation content.

The portal reviews each Git commit. The Claude plugin uses declared MCP hooks and does not run a local startup script, so the automated validator no longer places a script policy hold. The manifest provides the icon, privacy policy, terms, support, and documentation links.

The Source validator may warn that `icon`, `documentationUrl`, `privacyPolicyUrl`, `supportUrl`, and `termsOfServiceUrl` are unknown to Claude Code. The portal says it reads those fields for the directory listing and that no action is needed. Keep them in the manifest so the listing retains its logo and public links. Check each new validation report for other warnings; a passing scan alone does not explain them.

### Submission steps

1. Confirm the reviewer account has sample data and working access.
2. Run `claude plugin validate plugins/claude/alignbase` and `python3 scripts/validate.py`.
3. Test the plugin from the public GitHub source in a new Cowork session and a new Claude Code session.
4. Connect a GitHub account with push access to the public repository in the submitting Claude organization. The portal checks this before it saves or submits the listing.
5. In the developer portal, submit the plugin bundle from this repository. It already includes the remote MCP server configuration. A standalone connector is a separate, optional listing, not a prerequisite for the plugin bundle. Validate again after each source change.
6. Answer the data-handling questions and review the Directory Terms and Policy with the person authorized to accept them for the organization.
7. Submit the plugin for review. Track the scan and reviewer feedback in the portal. Once approved, request publication there.

## Cursor Marketplace

### Official links

- Plugin reference and checklist: <https://cursor.com/docs/reference/plugins>
- Publisher application: <https://cursor.com/marketplace/publish>
- Publisher Terms: <https://cursor.com/marketplace-publisher-terms>
- Publisher support: `marketplace-publishing@cursor.com`

### Publisher application fields

| Application field | Prepared value |
| --- | --- |
| Organization name | Alignbase |
| Organization handle | `alignbase` |
| Contact email | `support@alignbase.com` |
| Logotype URL | `https://raw.githubusercontent.com/Alignbase/alignbase-marketplace/main/plugins/cursor/alignbase/assets/alignbase-logo.svg` |
| Organization description | Alignbase gives teams one place to manage and distribute approved context and Skills to their AI agents. |
| GitHub repository | `https://github.com/Alignbase/alignbase-marketplace` |
| Owner | Select the signed-in company account or team |
| Website URL | `https://alignbase.com` |
| Publisher Terms | Accept after the company approves the remaining license grant, indemnity, and data obligations |

The repository-level Cursor catalog is `.cursor-plugin/marketplace.json`. Its `alignbase` entry points to `plugins/cursor/alignbase`, where `.cursor-plugin/plugin.json` declares the MCP server, hook, metadata, and relative logo.

### Submission steps

1. Confirm the privacy, terms, and support pages are live.
2. Test the package as a local plugin under `~/.cursor/plugins/local/alignbase`. Confirm the startup hook, OAuth flow, `get_current_context`, read tools, and permission failures.
3. Push the package and logo to the public repository. Confirm the raw logo URL returns the square blue-background SVG.
4. Sign in at the publisher application and complete the fields above.
5. Accept the Publisher Terms after the company approves the remaining license grant, indemnity, and data obligations.
6. Submit the repository for manual review. Address review feedback and request re-indexing after later updates.

The repository and all three plugin manifests use the MIT License. The company has confirmed that a free Cursor plugin may connect to the paid Alignbase service. The current copy calls the product `Cursor` exactly, makes no endorsement claim, and contains no comparative or unsupported claims. The plugin only sends requests to Alignbase and contains no model training, advertising, data sale, or third-party transfer behavior. Confirm those statements against production telemetry before making the publisher warranty.
