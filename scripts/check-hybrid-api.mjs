import assert from "node:assert/strict";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
const remote=process.argv.includes("--remote");
const base=remote?JSON.parse(fs.readFileSync("config/public.json","utf8")).apiUrl:"http://127.0.0.1:8787",origin=remote?"https://kevin-1215.github.io":"http://127.0.0.1:5173";
if(remote && base!=="https://kevin-portfolio-api.kevin-design-lab.workers.dev")throw new Error("Refusing to test an unexpected remote API");
const fixtures=[];
let passed=0;function check(ok,message){assert.ok(ok,message);passed++;console.log("PASS "+message);}
async function req(path,body,token="",extra={}){const r=await fetch(base+path,{method:body===undefined?"GET":"POST",headers:{Origin:origin,...(body!==undefined?{"Content-Type":"application/json"}:{}),...(token?{Authorization:`Bearer ${token}`}:{ }),...extra},...(body!==undefined?{body:typeof body==="string"?body:JSON.stringify(body)}:{})});return{status:r.status,data:await r.json(),headers:r.headers};}
try {
const health=await req("/api/health");
check(health.data.storage==="Cloudflare D1","worker uses Cloudflare D1");
check(health.data.payments==="disabled","real payments remain disabled");
const preflight=await fetch(base+"/api/profile",{method:"OPTIONS",headers:{Origin:origin,"Access-Control-Request-Method":"POST","Access-Control-Request-Headers":"authorization,content-type"}});
check(preflight.status===204&&preflight.headers.get("access-control-allow-origin")===origin,"published frontend passes CORS preflight");
check((await req("/api/me")).data.user===null,"anonymous member data is empty");
check((await req("/api/profile",{name:"QA",newsletter:false})).status===401,"unauthenticated writes are blocked");
check((await req("/api/profile",{},"",{Origin:"https://untrusted.invalid"})).status===403,"untrusted CORS origins are blocked");
const stamp=crypto.randomUUID().replaceAll("-","").slice(0,12),username="qa_"+stamp,password=crypto.randomUUID()+"!";
fixtures.push(username,username+"b");
const one=await req("/api/auth/register",{username,password,name:"Preview QA"});check(one.status===200&&one.data.token,"member registration succeeds");const token=one.data.token;
check((await req("/api/auth/login",{username,password:password+"wrong"})).status===401,"incorrect passwords are rejected");
const login=await req("/api/auth/login",{username,password});check(Boolean(login.data.token),"member can log in again");
check((await req("/api/profile","{broken",token)).status===400,"malformed JSON is rejected");
check((await req("/api/profile",{name:"Updated QA",newsletter:true},token)).data.success,"profile updates succeed");
check((await req("/api/me",undefined,token)).data.profile.name==="Updated QA","profile persists in D1");
await req("/api/favorites",{project:"aura",saved:true},token);check((await req("/api/me",undefined,token)).data.favorites.includes("aura"),"favorites persist in D1");
check((await req("/api/favorites",{project:"folio",saved:true},token)).data.success,"Folio can be saved as a favorite");
check((await req("/api/inquiries",{name:"Deployment QA",email:"qa@example.com",service:"其他合作",budget:"尚未確定",message:"Synthetic deployment verification; no reply required."},token)).data.success,"authenticated inquiry can be stored without sending email");
check((await req("/api/orders",{key:crypto.randomUUID(),lines:[{id:"vase-01",quantity:0}]},token)).status===400,"invalid product quantities are rejected");
const payload={key:crypto.randomUUID(),lines:[{id:"vase-01",quantity:1,price:1}],total:1};const order=await req("/api/orders",payload,token);check(order.data.total===1800,"server recalculates catalog prices and shipping");
const again=await req("/api/orders",payload,token);check(again.data.id===order.data.id,"idempotency key prevents duplicate orders");
const second=await req("/api/auth/register",{username:username+"b",password,name:"Other QA"});const two=await req("/api/me",undefined,second.data.token);check(two.data.orders.length===0&&two.data.favorites.length===0,"member records are isolated between accounts");
const services=["AI 顧問服務","流程優化","網站建置","SEO 優化","其他系統建置"];
const inquiries=[];
for(const service of services)inquiries.push(await req("/api/inquiries",{name:"Service QA",email:"qa@example.com",service,budget:"尚未確定",message:"Synthetic service validation; no email is sent."},second.data.token));
check(inquiries.every(result=>result.status===200&&result.data.success),"all five public service types are accepted by the cloud API");
check((await req("/api/inquiries",{name:"Limit QA",email:"qa@example.com",service:services[0],budget:"尚未確定",message:"Synthetic sixth inquiry verifies the daily limit."},second.data.token)).status===429,"inquiry daily limit remains enforced");
await req("/api/auth/logout",{},token);check((await req("/api/me",undefined,token)).data.user===null,"logout invalidates the server session");
check((await req("/api/me",undefined,login.data.token)).data.user.email===username,"separate login session remains usable");
console.log(`${passed} hybrid API checks passed (${remote?"Cloudflare":"local D1"}).`);
} finally {
  if(remote&&fixtures.length){
    assert.ok(fixtures.every(name=>/^qa_[a-f0-9]{12}b?$/.test(name)));
    const command=`DELETE FROM users WHERE username IN (${fixtures.map(name=>`'${name}'`).join(",")})`;
    const cleanup=spawnSync(process.execPath,["node_modules/wrangler/bin/wrangler.js","d1","execute","DB","--remote","--config","cloudflare/wrangler.jsonc","--command",command,"--json"],{encoding:"utf8",env:{...process.env,WRANGLER_SEND_METRICS:"false"}});
    if(cleanup.status!==0)throw new Error("Synthetic fixture cleanup failed; inspect Wrangler before retrying");
    const result=JSON.parse(cleanup.stdout);
    if(!result.every(item=>item.success))throw new Error("Synthetic fixture cleanup was not confirmed");
    console.log("Removed only the two generated QA accounts and their dependent test records.");
  }
}
