import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createHash, randomUUID, webcrypto } from 'node:crypto';
import ts from 'typescript';

const exports = {};
const source = fs.readFileSync('server/application-api.ts','utf8');
const compiled = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
vm.runInNewContext(`(function(exports){${compiled}\n})`,{Buffer,AbortSignal,fetch,URL})(exports);
const { validateApplication, handleApplicationRequest, applicationFields } = exports;
const secret = 'test-only-secret-'.repeat(4);
const env = {APPLICATIONS_WEBHOOK_URL:'https://script.google.com/macros/s/test-deployment/exec',APPLICATIONS_WEBHOOK_SECRET:secret};
const contact = {full_name:'Test Applicant',school:'Test school',grade:'10th Grade',email:'test@example.invalid',phone:'05550000000'};
const fixtures = {
  song:{song_title:'[TEST] Sheets song request',artist:'Test artist'},
  delegate:{...contact,committee_preference_1:'unwomen',committee_preference_2:'wha',committee_preference_3:'imo',motivation_letter:'Test motivation. '.repeat(12)},
  delegation:{full_name:contact.full_name,school:contact.school,email:contact.email,phone:contact.phone,delegation_name:'Test group',expected_members:2,all_emails:'member@example.invalid',all_phones:contact.phone},
  chairboard:{...contact,pref1:'unwomen',pref2:'wha',pref3:'imo',motivation_letter:'Test motivation. '.repeat(12),q_ai_suspicion:'Test answer',q_final_documents:'Test answer',q_disagreement:'Test answer'},
  admin:{...contact},press:{...contact,camera_model:'Test camera'},
};

class Sheet {
  rows = [];
  getMaxColumns() { return 30; }
  getLastRow() { return this.rows.length; }
  getMaxRows() { return 1000; }
  setColumnWidths() {}
  setColumnWidth() {}
  setRowHeight() {}
  setFrozenRows() {}
  hideColumns() {}
  getRange(row,col,height=1,width=1) {
    const sheet=this;
    return {
      setValues(values) { for(let i=0;i<values.length;i++) {sheet.rows[row-1+i] ||= []; for(let j=0;j<values[i].length;j++) sheet.rows[row-1+i][col-1+j]=values[i][j];} return this; },
      setWrap(){return this;},setVerticalAlignment(){return this;},setFontSize(){return this;},createFilter(){return this;},
      setFontWeight() {return this;},setBackground(){return this;},setFontColor(){return this;},setNumberFormat(){return this;},
      getDisplayValues() { return Array.from({length:height},(_,i)=>Array.from({length:width},(_,j)=>String(sheet.rows[row-1+i]?.[col-1+j] ?? ''))); },
      getValue() {return sheet.rows[row-1]?.[col-1];},
      createTextFinder(text) {return {matchEntireCell(){return this;},useRegularExpression(){return this;},findNext(){const i=sheet.rows.findIndex((values,index)=>index>=row-1&&index<row-1+height&&values[col-1]===text);return i<0?null:{getRow:()=>i+1};}};},
    };
  }
}
const sheets=new Map();
let locked=false;
let allowLock=true;
const receiver=vm.createContext({
  PropertiesService:{getScriptProperties:()=>({getProperty:key=>key==='SPREADSHEET_ID'?'test-book':secret})},
  Utilities:{DigestAlgorithm:{SHA_256:'sha256'},Charset:{UTF_8:'utf8'},computeDigest:(_,text)=>Array.from(createHash('sha256').update(text).digest()),formatDate:()=> '2026-10-29 12:00:00'},
  SpreadsheetApp:{openById:id=>{assert.equal(id,'test-book');return {getSheetByName:name=>sheets.get(name),insertSheet:name=>{const sheet=new Sheet();sheets.set(name,sheet);return sheet;}};},flush:()=>{}},
  LockService:{getScriptLock:()=>({tryLock:()=>{locked=allowLock;return locked;},hasLock:()=>locked,releaseLock:()=>{locked=false;}})},
  ContentService:{MimeType:{JSON:'json'},createTextOutput:content=>({content,setMimeType(){return this;}})},
});
vm.runInContext(fs.readFileSync('scripts/google-sheets/Code.gs','utf8'),receiver);
assert.equal(JSON.stringify(vm.runInContext('APPLICATION_FIELDS',receiver)),JSON.stringify(applicationFields),'Regenerate Code.gs after schema changes');
receiver.setupSheets();
assert.equal(sheets.size,6);
const receive = payload => JSON.parse(receiver.doPost({postData:{contents:JSON.stringify(payload)}}).content);
assert.equal(JSON.parse(receiver.doGet().content).success,false);

let writes=0;
const liveMock = async (_, options) => {
  writes++;
  assert.equal(options.redirect,'follow');
  const response=receive(JSON.parse(options.body));
  return new Response(JSON.stringify(response),{status:200,headers:{'Content-Type':'application/json'}});
};
for (const [type,data] of Object.entries(fixtures)) {
  const request={type,data,requestId:randomUUID()};
  const result=await handleApplicationRequest('POST',{'content-type':'application/json'},JSON.stringify(request),env,liveMock);
  assert.equal(result.statusCode,200,type);
  assert.equal(JSON.parse(result.body).requestId,request.requestId);
  assert.ok(!result.body.includes(secret));
  const retry=await handleApplicationRequest('POST',{'content-type':'application/json'},JSON.stringify(request),env,liveMock);
  assert.equal(retry.statusCode,200);
}
for (const sheet of sheets.values()) assert.equal(sheet.rows.length,2,'Retries must not create duplicates');
const valid={type:'press',data:fixtures.press,requestId:randomUUID()};
const rowCount=()=>Array.from(sheets.values()).reduce((n,s)=>n+s.rows.length,0);
const before=rowCount();
assert.equal(receive({...valid,secret:'bad'}).success,false);
assert.equal(receive({...valid,type:'__proto__',secret}).success,false);
assert.equal(rowCount(),before);
for (const payload of [null, [], {...valid,secret,action:'read'}, {...valid,secret,spreadsheetId:'other-file'}]) {
  assert.equal(receive(payload).success,false);
  assert.equal(rowCount(),before);
}
allowLock=false;
assert.equal(receive({...validateApplication(valid),secret}).success,false);
assert.equal(rowCount(),before);
allowLock=true;
const injected={type:'press',data:{...fixtures.press,full_name:'=IMPORTXML("evil","x")'},requestId:randomUUID()};
assert.equal(receive({...validateApplication(injected),secret}).success,true);
assert.ok(sheets.get('Press').rows.at(-1).some(value=>typeof value==='string'&&value.startsWith("'=IMPORTXML")));
assert.equal(receive({...validateApplication({...injected,data:{...injected.data,full_name:'Changed payload'}}),secret}).success,false);
for (const bad of [
  {...valid,type:'__proto__'},
  {...valid,action:'read'},
  {...valid,spreadsheetId:'other-file'},
  {...valid,data:{...valid.data,message:'\u0000'}},
  {type:'song',requestId:randomUUID(),data:{song_title:'',artist:''}},
  {...valid,requestId:'bad'},
  {...valid,data:{...valid.data,status:'approved'}},
  {...valid,data:{...valid.data,email:'bad'}},
  {...valid,data:{...valid.data,full_name:'A'.repeat(101)}},
  {type:'delegation',requestId:randomUUID(),data:{...fixtures.delegation,expected_members:501}},
  {type:'delegate',requestId:randomUUID(),data:{...fixtures.delegate,committee_preference_2:'unwomen'}},
]) {
  const result=await handleApplicationRequest('POST',{'content-type':'application/json'},JSON.stringify(bad),env,liveMock);
  assert.equal(result.statusCode,400);
}
const count=writes;
assert.equal((await handleApplicationRequest('GET',{},'',env,liveMock)).statusCode,405);
assert.equal((await handleApplicationRequest('POST',{'content-type':'text/plain'},'{}',env,liveMock)).statusCode,415);
assert.equal((await handleApplicationRequest('POST',{'content-type':'application/jsonp'},'{}',env,liveMock)).statusCode,415);
for (const method of ['GET','HEAD','OPTIONS','PUT','PATCH','DELETE']) {
  const result=await handleApplicationRequest(method,{},'',env,liveMock);
  assert.equal(result.statusCode,405);
  assert.equal(result.headers['Cache-Control'],'no-store');
}
for (const headers of [
  {'sec-fetch-site':'cross-site'},
  {origin:'https://attacker.example',host:'site.example'},
  {origin:'null',host:'site.example'},
]) assert.equal((await handleApplicationRequest('POST',{'content-type':'application/json',...headers},JSON.stringify(valid),env,liveMock)).statusCode,403);
assert.equal((await handleApplicationRequest('POST',{'content-type':'application/json'},'x'.repeat(65537),env,liveMock)).statusCode,413);
assert.equal((await handleApplicationRequest('POST',{'content-type':'application/json'},JSON.stringify(valid),{},liveMock)).statusCode,503);
assert.equal(writes,count);
assert.equal((await handleApplicationRequest('POST',{'content-type':'application/json',host:'site.example',origin:'https://site.example'},JSON.stringify(valid),env,liveMock)).statusCode,200);
for(const mock of [async()=>new Response('not JSON'),async()=>new Response(JSON.stringify({success:true,requestId:'wrong'})),async()=>{throw new Error('Timeout');}]) {
  const result=await handleApplicationRequest('POST',{'content-type':'application/json'},JSON.stringify(valid),env,mock);
  assert.equal(result.statusCode,502);
  assert.ok(!result.body.includes(secret));
}
// Local-network HTTP exposes getRandomValues, but not randomUUID.
const clientExports = {};
const clientCode = ts.transpileModule(fs.readFileSync('src/lib/applications.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
vm.runInNewContext(`(function(exports){${clientCode}\n})`, {
  crypto: {getRandomValues: bytes => webcrypto.getRandomValues(bytes)}, AbortSignal,
  fetch: async (_, options) => {
    const payload = JSON.parse(options.body);
    validateApplication(payload);
    return new Response(JSON.stringify({success:true,requestId:payload.requestId}));
  },
})(clientExports);
for (const [type,data] of Object.entries(fixtures)) await clientExports.submitApplication(type,data);
// The small migration patch must also upgrade a receiver without song support.
vm.runInContext('delete APPLICATION_FIELDS.song; delete TAB_NAMES.song;',receiver);
const songProbe={...validateApplication({type:'song',requestId:randomUUID(),data:fixtures.song}),secret};
assert.equal(receive(songProbe).success,false);
vm.runInContext(fs.readFileSync('scripts/google-sheets/enable-songs.gs','utf8'),receiver);
assert.equal(receive(songProbe).success,true);
assert.equal(JSON.parse(receiver.doGet().content).receiverVersion,'fbalmun-sheets-song-v2');
console.log(JSON.stringify({passed:true,formTypes:5,songRequests:true,legacySongPatch:true,localNetworkHttp:true,duplicateRetriesPrevented:true,unauthorizedReceiverBlocked:true,formulaInjectionBlocked:true,invalidPayloadsRejected:11,failuresDoNotReportSuccess:true,realGoogleCalls:0}));
