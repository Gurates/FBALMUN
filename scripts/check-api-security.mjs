import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {loadEnv} from 'vite';

const env = loadEnv('development', process.cwd(), '');
assert.ok((env.APPLICATIONS_WEBHOOK_SECRET || '').length >= 32, 'Configure the receiver secret before running the live audit');
assert.match(env.APPLICATIONS_WEBHOOK_URL || '', /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/, 'Configure a production receiver URL before running the live audit');
const base = new URL(process.argv[2] || 'http://127.0.0.1:5173');
const sheetId = process.argv[3] || env.APPLICATIONS_SPREADSHEET_ID;
assert.match(sheetId || '', /^[A-Za-z0-9_-]{20,}$/, 'Pass the target spreadsheet ID as the third argument, or configure APPLICATIONS_SPREADSHEET_ID for the audit');
const results = [];
async function check(label, url, options, expected) {
  const response = await fetch(url, {...options, signal:AbortSignal.timeout(30000)});
  const text = await response.text();
  assert.ok(!env.APPLICATIONS_WEBHOOK_SECRET || !text.includes(env.APPLICATIONS_WEBHOOK_SECRET), `${label}: secret exposed`);
  if (new URL(url).host === base.host) assert.equal(response.headers.get('access-control-allow-origin'),null,'API/source responses must not enable third-party CORS');
  assert.ok(expected(response, text), `${label}: unexpected HTTP ${response.status}`);
  results.push({check:label,status:response.status,passed:true});
}
for (const method of ['GET','HEAD','OPTIONS','PUT','PATCH','DELETE']) {
  await check(`API ${method}`,new URL('/api/applications?select=*',base),{method},r=>r.status===405);
}
for (const [label,body,headers,status] of [
  ['malformed JSON','{',{'content-type':'application/json'},400],
  ['unsupported content type','{}',{'content-type':'text/plain'},415],
  ['cross-site request','{}',{'content-type':'application/json',origin:'https://attacker.example'},403],
  ['read action',JSON.stringify({action:'read'}),{'content-type':'application/json'},400],
  ['oversized request','x'.repeat(65537),{'content-type':'application/json'},413],
]) await check(label,new URL('/api/applications',base),{method:'POST',headers,body},r=>r.status===status);
for (const route of ['/api/registrations','/api/song_requests','/api/applications/records','/.env','/.env.production','/.env?raw','/%2eenv?raw','/.git/config','/server/application-api.ts','/scripts/google-sheets/Code.gs','/@fs/'+process.cwd().replaceAll('\\','/')+'/.env?raw','/__open-in-editor']) {
  await check(`protected ${route}`,new URL(route,base),{},r=>[403,404].includes(r.status));
}
if (env.APPLICATIONS_WEBHOOK_URL) {
  await check('receiver never lists records',env.APPLICATIONS_WEBHOOK_URL+'?action=read',{},(r,t)=>{
    try {const value=JSON.parse(t);return value.success===false&&value.error==='Method not allowed.';}catch{return false;}
  });
  await check('receiver rejects wrong secret',env.APPLICATIONS_WEBHOOK_URL,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({secret:'invalid-audit-secret',action:'read'})},(r,t)=>{
    try {const value=JSON.parse(t);return value.success===false&&value.error==='Unauthorized.';}catch{return false;}
  });
}
// No cookies or API credentials are sent when testing document exports.
for (const suffix of ['/export?format=csv','/gviz/tq?tqx=out:csv','/pubhtml','/pub?output=csv']) {
  await check('private sheet '+suffix,`https://docs.google.com/spreadsheets/d/${sheetId}${suffix}`,{},r=>new URL(r.url).hostname==='accounts.google.com'||[401,403,404].includes(r.status));
}
function scan(directory) {
  for(const item of fs.readdirSync(directory,{withFileTypes:true})) {
    const file=path.join(directory,item.name);
    if(item.isDirectory()) scan(file);
    else if(/\.(js|css|html|json|map)$/.test(item.name)) {
      const content=fs.readFileSync(file,'utf8');
      assert.ok(!env.APPLICATIONS_WEBHOOK_SECRET||!content.includes(env.APPLICATIONS_WEBHOOK_SECRET), 'Secret in production bundle');
    }
  }
}
scan('dist');
console.log(JSON.stringify({passed:true,checks:results.length,results,bundleSecretsExposed:false},null,2));
