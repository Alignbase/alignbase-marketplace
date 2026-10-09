#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { activityAccessToken, activityBaseURL } from './oauth.mjs';

export function normalizeCursorUsage(row) {
  if (!row.conversationId || !row.tokenUsage || !row.isTokenBasedCall) return null;
  const u = row.tokenUsage;
  const values = [u.inputTokens, u.outputTokens, u.cacheReadTokens, u.cacheWriteTokens];
  if (!values.every(n => Number.isSafeInteger(n) && n >= 0 && n <= 1e12)) return null;
  const date = new Date(Number(row.timestamp));
  if (!Number.isFinite(date.getTime())) return null;
  const identity = createHash('sha256').update([row.conversationId,row.timestamp,row.model].join('\0')).digest('hex');
  const usage = { scope: 'request', input_includes_cache: false, reported_input_tokens: u.inputTokens, input_tokens: u.inputTokens + u.cacheReadTokens + u.cacheWriteTokens, output_tokens: u.outputTokens, cache_read_tokens: u.cacheReadTokens, cache_write_tokens: u.cacheWriteTokens, currency: 'USD' };
  if (Number.isFinite(u.totalCents) && u.totalCents >= 0) usage.reported_cost_micros = Math.round(u.totalCents * 10000);
  if (Number.isFinite(row.chargedCents) && row.chargedCents >= 0) usage.charged_cost_micros = Math.round(row.chargedCents * 10000);
  return { schema_version:'1', event_type:'model.request', source:'usage_api', completeness:'partial', session_id:row.conversationId, occurred_at:date.toISOString(), observation:{model:row.model, request_id:`cursor-${identity}`, usage} };
}

export async function importCursorUsage({apiKey, accessToken, email, startDate, endDate, baseURL='https://app.alignbase.com', fetchImpl=fetch}) {
  if (!apiKey || !accessToken || !email || !Number.isFinite(startDate) || !Number.isFinite(endDate) || startDate >= endDate) throw new Error('Cursor import configuration missing');
  let page = 1, accepted = 0, skipped = 0;
  do {
    const response = await fetchImpl('https://api.cursor.com/teams/filtered-usage-events',{method:'POST',headers:{Authorization:`Basic ${Buffer.from(apiKey+':').toString('base64')}`,'Content-Type':'application/json'},body:JSON.stringify({email,startDate,endDate,page,pageSize:100}),signal:AbortSignal.timeout(30000)});
    if (!response.ok) throw new Error(`Cursor usage unavailable (${response.status})`);
    const data = await response.json();
    if (!Array.isArray(data.usageEvents)) throw new Error('Invalid Cursor usage response');
    const events = [];
    for (const row of data.usageEvents) {
      // One authorization represents one agent. Never attach another user's
      // team usage to it, even if the upstream email filter is ignored.
      if (row.userEmail !== email) {skipped++; continue;}
      const event = normalizeCursorUsage(row); if (event) events.push(event); else skipped++;
    }
    if (events.length) {
      const result = await fetchImpl(`${baseURL}/activity/v1/events?integration=cursor`,{method:'POST',headers:{Authorization:`Bearer ${accessToken}`,'Content-Type':'application/json'},body:JSON.stringify({events}),signal:AbortSignal.timeout(30000)});
      if (!result.ok) throw new Error(`Alignbase import rejected (${result.status})`);
      const status = await result.json(); accepted += status.accepted || 0;
    }
    if (!data.pagination?.hasPreviousPage && page > 1 && !data.pagination) throw new Error('Invalid pagination');
    if (!data.pagination?.hasNextPage) break;
    if (++page > 10000) throw new Error('Cursor import page limit reached');
  } while (true);
  return {accepted,skipped};
}
if (process.argv[1]?.endsWith('/import-cursor-usage.mjs')) {
  const endDate = Date.now(); const startDate = Number(process.env.ALIGNBASE_CURSOR_START_MS || endDate - 24*60*60*1000);
  importCursorUsage({apiKey:process.env.CURSOR_ADMIN_API_KEY,accessToken:await activityAccessToken(),email:process.env.ALIGNBASE_CURSOR_USER_EMAIL,startDate,endDate,baseURL:await activityBaseURL()}).then(result=>process.stdout.write(JSON.stringify(result)+'\n')).catch(error=>{process.stderr.write(error.message+'\n');process.exitCode=1;});
}
