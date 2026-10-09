import { readFile, writeFile, rename, mkdir, rmdir } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';

export async function activityBaseURL(authFile=process.env.ALIGNBASE_ACTIVITY_AUTH_FILE) {
 if (process.env.ALIGNBASE_ACTIVITY_BASE_URL) return process.env.ALIGNBASE_ACTIVITY_BASE_URL;
 if (authFile) return JSON.parse(await readFile(authFile,'utf8')).base_url;
 return 'https://app.alignbase.com';
}

export async function activityAccessToken({authFile=process.env.ALIGNBASE_ACTIVITY_AUTH_FILE, fetchImpl=fetch}={}) {
 if (process.env.ALIGNBASE_ACTIVITY_ACCESS_TOKEN) return process.env.ALIGNBASE_ACTIVITY_ACCESS_TOKEN;
 if (!authFile) throw new Error('Configure Alignbase Activity OAuth first');
 let auth=JSON.parse(await readFile(authFile,'utf8'));
 if (auth.access_token && auth.expires_at > Date.now()+60000) return auth.access_token;
 const lock=authFile+'.refresh-lock';
 let locked=false;
 for(let attempt=0;attempt<100;attempt++) {
  try {await mkdir(lock,{mode:0o700});locked=true;break;} catch(error) {if(error.code!=='EEXIST')throw error;await new Promise(resolve=>setTimeout(resolve,100));}
 }
 if(!locked)throw new Error('Activity OAuth refresh busy');
 try {
 auth=JSON.parse(await readFile(authFile,'utf8'));
 if (auth.access_token && auth.expires_at > Date.now()+60000) return auth.access_token;
 const response=await fetchImpl(`${auth.base_url}/oauth/token`,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'refresh_token',client_id:auth.client_id,refresh_token:auth.refresh_token}),signal:AbortSignal.timeout(10000)});
 if (!response.ok) throw new Error(`Activity OAuth refresh failed (${response.status})`);
 const tokens=await response.json();
 if (!tokens.access_token || !tokens.refresh_token || !Number.isFinite(tokens.expires_in)) throw new Error('Invalid Activity OAuth response');
 const next={...auth,...tokens,expires_at:Date.now()+tokens.expires_in*1000};
 const temporary=`${authFile}.${randomBytes(8).toString('hex')}.tmp`;
 await writeFile(temporary,JSON.stringify(next),{mode:0o600,flag:'wx'});await rename(temporary,authFile);
 return next.access_token;
 } finally {await rmdir(lock);}
}
