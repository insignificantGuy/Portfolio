import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await readFile('dist/index.html','utf8');
const script=[...html.matchAll(/<script type="module">(.*?)<\/script>/gs)].map(x=>x[1]).find(x=>x.includes('clipboard'));
assert(script,'Built email script exists');
for(const mode of ['success','denied','unsupported']) {
  let click; let copied; const status={textContent:''};
  const button={dataset:{email:'manu.rahul28@gmail.com'},closest:()=>({querySelector:()=>status}),addEventListener:(_event,fn)=>click=fn};
  const navigator= mode==='unsupported' ? {} : {clipboard:{writeText:async text=>{if(mode==='denied')throw new Error('Denied');copied=text;}}};
  vm.runInNewContext(script,{document:{querySelectorAll:()=>[button]},navigator});
  await click();
  if(mode==='success'){assert.equal(copied,button.dataset.email);assert.equal(status.textContent,'Email copied.');}
  else assert.equal(status.textContent,'Could not copy. Select the email address or use the email link.');
}
console.log('PASS: built copy-email handler, success, permission denial, and unsupported clipboard fallback.');
