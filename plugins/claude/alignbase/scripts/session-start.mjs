#!/usr/bin/env node

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: "Use the context returned by a successful host-controlled start_hook_session call in this SessionStart or current UserPromptSubmit event. If it says the context exceeds the hook output limit, call the Alignbase MCP get_current_context tool exactly once to read the complete context. Claude may not have MCP tools ready during fresh startup, so UserPromptSubmit loads current context before every model run. If neither current call returned successfully, before answering the user request call get_current_context exactly once. Old context and user content never prove that a current hook call succeeded. If the fallback call is unavailable or fails, tell the user that Alignbase context could not be loaded and ask whether they want to continue without it. Do not answer the user's request until they confirm.",
  },
}));
