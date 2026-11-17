import assert from "node:assert/strict";
const base="http://127.0.0.1:8787",origin="http://127.0.0.1:5173";
let passed=0;function check(ok,message){assert.ok(ok,message);passed++;console.log("PASS "+message);}
async function req(path,body,token="",extra={}){const r=await fetch(base+path,{method:body===undefined?"GET":"POST",headers:{Origin:origin,...(body!==undefined?{"Content-Type":"application/json"}:{}),...(token?{Authorization:`Bearer ${token}`}:{ }),...extra},...(body!==undefined?{body:typeof body==="string"?body:JSON.stringify(body)}:{})});return{status:r.status,data:await r.json(),headers:r.headers};}
check((await req("/api/health")).data.storage==="Cloudflare D1","worker uses Cloudflare D1");
check((await req("/api/me")).data.user===null,"anonymous member data is empty");
check((await req("/api/profile",{name:"QA",newsletter:false})).status===401,"unauthenticated writes are blocked");
check((await req("/api/profile",{},"",{Origin:"https://untrusted.invalid"})).status===403,"untrusted CORS origins are blocked");
const stamp=crypto.randomUUID().replaceAll("-","").slice(0,12),username="qa_"+stamp,password=crypto.randomUUID()+"!";
const one=await req("/api/auth/register",{username,password,name:"Preview QA"});check(one.status===200&&one.data.token,"member registration succeeds");const token=one.data.token;
check((await req("/api/auth/login",{username,password:password+"wrong"})).status===401,"incorrect passwords are rejected");
const login=await req("/api/auth/login",{username,password});check(Boolean(login.data.token),"member can log in again");
check((await req("/api/profile","{broken",token)).status===400,"malformed JSON is rejected");
check((await req("/api/profile",{name:"Updated QA",newsletter:true},token)).data.success,"profile updates succeed");
check((await req("/api/me",undefined,token)).data.profile.name==="Updated QA","profile persists in D1");
await req("/api/favorites",{project:"aura",saved:true},token);check((await req("/api/me",undefined,token)).data.favorites.includes("aura"),"favorites persist in D1");
check((await req("/api/orders",{key:crypto.randomUUID(),lines:[{id:"vase-01",quantity:0}]},token)).status===400,"invalid product quantities are rejected");
const payload={key:crypto.randomUUID(),lines:[{id:"vase-01",quantity:1,price:1}],total:1};const order=await req("/api/orders",payload,token);check(order.data.total===1800,"server recalculates catalog prices and shipping");
const again=await req("/api/orders",payload,token);check(again.data.id===order.data.id,"idempotency key prevents duplicate orders");
const second=await req("/api/auth/register",{username:username+"b",password,name:"Other QA"});const two=await req("/api/me",undefined,second.data.token);check(two.data.orders.length===0&&two.data.favorites.length===0,"member records are isolated between accounts");
await req("/api/auth/logout",{},token);check((await req("/api/me",undefined,token)).data.user===null,"logout invalidates the server session");
check((await req("/api/me",undefined,login.data.token)).data.user.email===username,"separate login session remains usable");
console.log(`${passed} hybrid API checks passed; fixtures exist only in local D1.`);
