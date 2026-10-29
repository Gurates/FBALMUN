import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync('server/application-api.ts','utf8');
const compiled = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const exports = {};
vm.runInNewContext(`(function(exports){${compiled}\n})`)(exports);
const template = fs.readFileSync('scripts/google-sheets/receiver-template.gs','utf8');
fs.writeFileSync('scripts/google-sheets/Code.gs', '// Generated with node scripts/build-sheets-script.mjs\nconst APPLICATION_FIELDS = '+JSON.stringify(exports.applicationFields,null,2)+';\n\n'+template);
console.log('Generated Google Sheets receiver for five application types and song requests.');
