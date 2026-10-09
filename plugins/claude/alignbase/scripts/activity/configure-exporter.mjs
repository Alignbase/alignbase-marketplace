#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const file=process.env.ALIGNBASE_ACTIVITY_AUTH_FILE;
if(!file)throw new Error('Set ALIGNBASE_ACTIVITY_AUTH_FILE');
const auth=JSON.parse(await readFile(file,'utf8'));
if(!auth.relay_key)throw new Error('Activity relay key missing');
const host=process.env.ALIGNBASE_ACTIVITY_INTEGRATION;
const port=Number(process.env.ALIGNBASE_ACTIVITY_RELAY_PORT || 4318);
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('Invalid relay port');
let text,extension;
if(host==='codex') {
 extension='toml';
 text=`[otel]\nlog_user_prompt = false\n\n[otel.exporter.otlp-http]\nendpoint = "http://127.0.0.1:${port}/v1/logs"\nprotocol = "binary"\n\n[otel.exporter.otlp-http.headers]\nx-alignbase-relay-key = "${auth.relay_key}"\n`;
} else if(host==='claude') {
 extension='sh';
 text=`export CLAUDE_CODE_ENABLE_TELEMETRY=1\nexport OTEL_LOGS_EXPORTER=otlp\nexport OTEL_EXPORTER_OTLP_LOGS_PROTOCOL=http/protobuf\nexport OTEL_EXPORTER_OTLP_LOGS_ENDPOINT=http://127.0.0.1:${port}/v1/logs\nexport OTEL_EXPORTER_OTLP_LOGS_HEADERS=x-alignbase-relay-key=${auth.relay_key}\nexport OTEL_LOG_USER_PROMPTS=0\nexport OTEL_LOG_ASSISTANT_RESPONSES=0\nexport OTEL_LOG_TOOL_DETAILS=0\nexport OTEL_LOG_TOOL_CONTENT=0\n`;
} else throw new Error('Set ALIGNBASE_ACTIVITY_INTEGRATION to codex or claude');
const output=path.join(path.dirname(file),`activity-${host}.${extension}`);
await writeFile(output,text,{mode:0o600,flag:'wx'});
process.stdout.write(`Saved private exporter settings to ${output}.\n`);
