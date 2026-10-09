#!/usr/bin/env node
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { timingSafeEqual } from 'node:crypto';
import { activityAccessToken } from './oauth.mjs';

const authFile=process.env.ALIGNBASE_ACTIVITY_AUTH_FILE;
if(!authFile)throw new Error('Set ALIGNBASE_ACTIVITY_AUTH_FILE');
const auth=JSON.parse(await readFile(authFile,'utf8'));
const host=process.env.ALIGNBASE_ACTIVITY_INTEGRATION;
if(!['codex','claude'].includes(host))throw new Error('Set ALIGNBASE_ACTIVITY_INTEGRATION to codex or claude');
if(!auth.relay_key)throw new Error('Activity relay key missing');
const server=http.createServer(async(req,res)=>{
 try {
  const supplied=Buffer.from(req.headers['x-alignbase-relay-key'] || '');const expected=Buffer.from(auth.relay_key);
  if(req.method!=='POST'||req.url!='/v1/logs'||req.headers.origin||supplied.length!==expected.length||!timingSafeEqual(supplied,expected)){res.writeHead(403);res.end();return;}
  const chunks=[];let size=0;
  for await(const chunk of req){size+=chunk.length;if(size>4*1024*1024){res.writeHead(413);res.end();return;}chunks.push(chunk);}
  const token=await activityAccessToken({authFile});
  const upstream=await fetch(`${auth.base_url}/activity/v1/logs?integration=${host}`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':req.headers['content-type'] || 'application/x-protobuf'},body:Buffer.concat(chunks),signal:AbortSignal.timeout(10000)});
  res.writeHead(upstream.status,{'Content-Type':upstream.headers.get('content-type') || 'application/json'});res.end(Buffer.from(await upstream.arrayBuffer()));
 } catch {res.writeHead(503);res.end();}
});
server.listen(Number(process.env.ALIGNBASE_ACTIVITY_RELAY_PORT || 4318),'127.0.0.1',()=>process.stdout.write('Alignbase Activity relay ready.\n'));
