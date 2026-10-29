import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {loadEnv} from 'vite';
import {randomUUID} from 'node:crypto';
const env=loadEnv('development',process.cwd(),'');
if (process.argv[2]) env.APPLICATIONS_WEBHOOK_URL=process.argv[2];
const exports={};
const source=ts.transpileModule(fs.readFileSync('server/application-api.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
vm.runInNewContext(`(function(exports){${source}\n})`,{Buffer,AbortSignal,fetch,URL})(exports);
const contact={full_name:'[TEST] FBALMUN Conference Setup',school:'Integration test - not a real applicant',grade:'10th Grade',email:'integration-test@example.invalid',phone:'05550000000'};
const motivation='This is a synthetic integration test for the conference account setup. It checks the correct sheet and does not contain a real application or any real personal information.';
const fixtures={
  press:{...contact,camera_model:'Test only'},
  delegate:{...contact,committee_preference_1:'unwomen',committee_preference_2:'wha',committee_preference_3:'imo',motivation_letter:motivation},
  delegation:{full_name:contact.full_name,school:contact.school,email:contact.email,phone:contact.phone,delegation_name:'[TEST] Conference setup',expected_members:2,all_emails:'integration-test@example.invalid',all_phones:contact.phone},
  chairboard:{...contact,pref1:'unwomen',pref2:'wha',pref3:'imo',motivation_letter:motivation,q_ai_suspicion:'Synthetic test answer',q_final_documents:'Synthetic test answer',q_disagreement:'Synthetic test answer'},
  admin:{...contact},
  song:{song_title:'[TEST] Conference Sheets Connection',artist:'FBALMUN integration test'},
};
for(const [type,data] of Object.entries(fixtures).filter(([type])=>process.argv[3]==='all'||type===(process.argv[3]||'press'))) {
const requestId=randomUUID();
const request={type,requestId,data};
const transport=async(url,options)=>{
 const response=await fetch(url,options);
 const text=await response.clone().text();
 let result;try{result=JSON.parse(text)}catch{}
 console.log(JSON.stringify({type,providerStatus:response.status,providerHost:new URL(response.url).hostname,providerSuccess:result?.success,providerError:result?.error,requestIdMatches:result?.requestId===requestId}));
 return response;
};
const result=await exports.handleApplicationRequest('POST',{'content-type':'application/json'},JSON.stringify(request),env,transport);
console.log(JSON.stringify({apiStatus:result.statusCode,result:JSON.parse(result.body)}));
if(result.statusCode!==200) {process.exitCode=1;break;}
const retry=await exports.handleApplicationRequest('POST',{'content-type':'application/json'},JSON.stringify(request),env,transport);
if(retry.statusCode!==200) {process.exitCode=1;break;}
console.log(JSON.stringify({type,retryConfirmed:true,requestId}));
}
