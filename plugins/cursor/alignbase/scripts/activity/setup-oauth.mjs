#!/usr/bin/env node
import http from 'node:http';
import { createHash, randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

// The user completes ordinary Alignbase consent and chooses this connection's
// agent. Credentials are written to a private local file, never printed.
const baseURL=process.env.ALIGNBASE_ACTIVITY_BASE_URL || 'https://app.alignbase.com';
const authFile=process.env.ALIGNBASE_ACTIVITY_AUTH_FILE || path.join(os.homedir(),'.alignbase','activity-oauth.json');
const verifier=randomBytes(32).toString('base64url');
const state=randomBytes(32).toString('base64url');
const server=http.createServer();
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
try {
 const redirect=`http://127.0.0.1:${server.address().port}/callback`;
 const registration=await fetch(`${baseURL}/oauth/register`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({client_name:'Alignbase Activity collector',redirect_uris:[redirect],grant_types:['authorization_code','refresh_token'],response_types:['code'],token_endpoint_auth_method:'none'}),signal:AbortSignal.timeout(10000)});
 if(!registration.ok)throw new Error(`OAuth registration failed (${registration.status})`);
 const {client_id}=await registration.json();
 const url=new URL(`${baseURL}/oauth/authorize`);url.search=new URLSearchParams({client_id,redirect_uri:redirect,response_type:'code',scope:'context.read activity.write',state,code_challenge:createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:'S256'}).toString();
 process.stdout.write(`Open this link to connect Activity:\n${url}\n`);
 const code=await new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>reject(new Error('OAuth consent timed out')),300000);
  server.on('request',(req,res)=>{
   const callback=new URL(req.url,redirect);
   if(callback.pathname!='/callback'||callback.searchParams.get('state')!==state){res.writeHead(400);res.end('Invalid callback');return;}
   clearTimeout(timeout);
   if(callback.searchParams.get('error')){res.writeHead(400);res.end('Connection declined');reject(new Error('Activity connection declined'));return;}
   const code=callback.searchParams.get('code');if(!code){res.writeHead(400);res.end('Missing code');reject(new Error('Missing OAuth code'));return;}
   res.setHeader('Content-Type','text/plain');res.end('Activity connected. Return to your terminal.');resolve(code);
  });
 });
 const response=await fetch(`${baseURL}/oauth/token`,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'authorization_code',client_id,code,redirect_uri:redirect,code_verifier:verifier}),signal:AbortSignal.timeout(10000)});
 if(!response.ok)throw new Error(`OAuth exchange failed (${response.status})`);
 const tokens=await response.json();
 if(!tokens.access_token||!tokens.refresh_token||!Number.isFinite(tokens.expires_in))throw new Error('Invalid OAuth response');
 await mkdir(path.dirname(authFile),{recursive:true,mode:0o700});
 await writeFile(authFile,JSON.stringify({...tokens,client_id,base_url:baseURL,expires_at:Date.now()+tokens.expires_in*1000,relay_key:randomBytes(32).toString('hex')}),{mode:0o600,flag:'wx'});
 process.stdout.write(`Saved Activity credentials to ${authFile}.\n`);
} catch(error) {process.stderr.write(error.message+'\n');process.exitCode=1;} finally {server.close();}
