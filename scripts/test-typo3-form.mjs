import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync,writeFileSync } from 'node:fs';

const base='https://taxi-adler.ddev.site';
const curl=(url,body)=>execFileSync('curl',['--fail','--silent','--show-error',...(body ? ['--data-binary','@-'] : []),url],{input:body,encoding:'utf8',maxBuffer:3*1024*1024});
const parse=html=>JSON.parse(execFileSync('php',['scripts/html-snapshot.php'],{input:html,encoding:'utf8'}));
const mail=()=>JSON.parse(curl(`${base}:8026/api/v1/messages`));
const before=mail().total;
function submit(overrides={}){
  const html=curl(`${base}/kontakt/`);
  const form=parse(html).forms[0];
  assert(form,'No form rendered');
  const body=new URLSearchParams();
  const values={name:'TYPO3 Integration Test',phone:'07222 000000',email:'typo3-test@example.invalid',pickup:'Test Abholort',destination:'Test Zielort',date:'2026-12-05',time:'14:30',notes:'Local integration test only; no real booking.',consent:'1',...overrides};
  for(const control of form.controls){
    if(!control.name)continue;
    if(control.type==='hidden')body.set(control.name,control.value);
    else if(control.tag==='button')body.set(control.name,control.value);
    else {
      const key=control.name.match(/\[([^\]]+)\]$/)?.[1];
      body.set(control.name,values[key]??'');
    }
  }
  return curl(new URL(form.action,`${base}/kontakt/`).href,body.toString());
}
const invalid=submit({email:'invalid-email',consent:'',time:'99:99'});
assert(!invalid.includes('Ihre Anfrage wurde übermittelt.'),'Invalid form unexpectedly accepted');
assert.equal(mail().total,before,'Validation failure generated mail');
const invalidDestination=submit({destination:'x'.repeat(256)});
assert(!invalidDestination.includes('Ihre Anfrage wurde übermittelt.'),'Overlong destination unexpectedly accepted');
assert.equal(mail().total,before,'Overlong destination generated mail');
const valid=submit();
mkdirSync('output',{recursive:true});
writeFileSync('output/typo3-form-response.html',valid);
assert(valid.includes('Ihre Anfrage wurde übermittelt.'),'Valid form did not reach confirmation');
assert.equal(mail().total,before+1,'Expected one email in local Mailpit');
const withoutDestination=submit({destination:''});
assert(withoutDestination.includes('Ihre Anfrage wurde übermittelt.'),'An empty optional destination was rejected');
assert.equal(mail().total,before+2,'Expected the enquiry without a destination in local Mailpit');
const messages=mail().messages;
assert(messages.some(message=>JSON.stringify(message).includes('Fahrtanfrage')),'Expected trip enquiry email missing');
mkdirSync('output',{recursive:true});
writeFileSync('output/typo3-form-test.json',JSON.stringify({validationRejectedInvalidData:true,destinationLengthValidated:true,emptyDestinationAccepted:true,confirmationShown:true,localMailpitDelivery:true,testEmail:'typo3-test@example.invalid'},null,2)+'\n');
console.log('PASS validation, optional empty destination, destination length limit, confirmation and local Mailpit emails. No external email was sent.');
