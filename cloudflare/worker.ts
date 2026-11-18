import { z } from "zod";
import { calculateOrder } from "../lib/catalog";
import { inquiryServices } from "../lib/services";
type Env = { DB: D1Database; ALLOWED_ORIGINS: string };
type Member = { id: string; username: string; name: string; newsletter: number };
class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
const encoder = new TextEncoder();
const hex = (bytes: ArrayBuffer | Uint8Array) => [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2,"0")).join("");
const random = (n: number) => hex(crypto.getRandomValues(new Uint8Array(n)));
async function digest(value: string) { return hex(await crypto.subtle.digest("SHA-256", encoder.encode(value))); }
async function hashPassword(password: string, salt: string) {
  const material = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  return hex(await crypto.subtle.deriveBits({ name: "PBKDF2", salt: encoder.encode(salt), iterations: 100000, hash: "SHA-256" }, material, 256));
}
function equal(a: string, b: string) { let different = a.length ^ b.length; for (let i=0;i<Math.max(a.length,b.length);i++) different |= (a.charCodeAt(i)||0) ^ (b.charCodeAt(i)||0); return different === 0; }
const accountSchema = z.object({ username: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,30}$/, "帳號請使用 3–30 個英文字母、數字或底線。"), password: z.string().min(12,"密碼至少 12 個字元。").max(128) });
const registerSchema = accountSchema.extend({ name: z.string().trim().min(1).max(40) });
const profileSchema = z.object({ name: z.string().trim().min(1).max(40), newsletter: z.boolean() });
const favoriteSchema = z.object({ project: z.enum(["folio","aura","objects","forma"]), saved: z.boolean() });
const orderSchema = z.object({ key: z.string().uuid(), lines: z.array(z.object({ id: z.string(), quantity: z.number().int().min(1).max(10) })).min(1).max(12) });
const inquirySchema = z.object({ name:z.string().trim().min(1).max(60), email:z.string().email().max(150), service:z.enum(inquiryServices), budget:z.enum(["尚未確定","5–10 萬","10–20 萬","20 萬以上"]), message:z.string().trim().min(10).max(3000) });
async function body<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new HttpError(415,"請使用 JSON 格式。");
  if (Number(request.headers.get("content-length") || 0)>12000) throw new HttpError(413,"內容過長。");
  const raw = await request.text(); if (raw.length>12000) throw new HttpError(413,"內容過長。");
  let input; try { input=JSON.parse(raw); } catch { throw new HttpError(400,"資料格式無效。"); }
  const parsed = schema.safeParse(input); if (!parsed.success) throw new HttpError(400,parsed.error.issues[0]?.message || "請檢查填寫的資料。"); return parsed.data;
}
async function authenticate(request: Request, db: D1Database) {
  const token = request.headers.get("authorization")?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
  if (!token) return null;
  return db.prepare("SELECT u.id,u.username,u.name,u.newsletter FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?").bind(await digest(token),new Date().toISOString()).first<Member>();
}
async function limitAuth(request: Request, db: D1Database) {
  const now = Math.floor(Date.now()/1000); const slot = Math.floor(now/900);
  const ip = request.headers.get("CF-Connecting-IP") || "local-preview";
  const key = await digest(`${slot}:${ip}`);
  const result=await db.prepare("INSERT INTO auth_limits(key,attempts,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=attempts+1 RETURNING attempts").bind(key,(slot+1)*900).first<{attempts:number}>();
  if ((result?.attempts||0)>15) throw new HttpError(429,"登入嘗試較頻繁，請在 15 分鐘後再試。");
  await db.prepare("DELETE FROM auth_limits WHERE expires_at<?").bind(now-86400).run();
}
async function route(request: Request, env: Env) {
  const path=new URL(request.url).pathname; const db=env.DB;
  if (path==="/api/health" && request.method==="GET") return { ok:true, storage:"Cloudflare D1", payments:"disabled" };
  if (["/api/auth/register","/api/auth/login"].includes(path) && request.method==="POST") {
    await limitAuth(request,db);
    const token=random(32); const tokenHash=await digest(token); const expires=new Date(Date.now()+12*3600000).toISOString();
    if (path.endsWith("register")) {
      const data=await body(request,registerSchema); const salt=random(16); const id=crypto.randomUUID(); const passwordHash=await hashPassword(data.password,salt);
      try { await db.batch([db.prepare("INSERT INTO users(id,username,name,password_hash,salt,created_at) VALUES(?,?,?,?,?,?)").bind(id,data.username,data.name,passwordHash,salt,new Date().toISOString()), db.prepare("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)").bind(tokenHash,id,expires)]); }
      catch(e) { if (String(e).includes("UNIQUE")) throw new HttpError(409,"這個帳號已被使用，請改用其他名稱。"); throw e; }
    } else {
      const data=await body(request,accountSchema); const account=await db.prepare("SELECT id,password_hash,salt FROM users WHERE username=?").bind(data.username).first<{id:string;password_hash:string;salt:string}>();
      const calculated=await hashPassword(data.password,account?.salt||"00000000000000000000000000000000");
      if (!account || !equal(calculated,account.password_hash)) throw new HttpError(401,"帳號或密碼不正確。");
      await db.prepare("DELETE FROM sessions WHERE expires_at<?").bind(new Date().toISOString()).run();
      await db.prepare("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)").bind(tokenHash,account.id,expires).run();
    }
    return { token, expiresAt:expires };
  }
  const member=await authenticate(request,db);
  if (path==="/api/me" && request.method==="GET") {
    if (!member) return {user:null,profile:null,favorites:[],orders:[]};
    const [saved,history]=await Promise.all([db.prepare("SELECT project FROM favorites WHERE user_id=?").bind(member.id).all<{project:string}>(),db.prepare("SELECT id,items,total,status,created_at FROM orders WHERE user_id=? ORDER BY created_at DESC LIMIT 30").bind(member.id).all<{id:string;items:string;total:number;status:string;created_at:string}>()]);
    return {user:{displayName:member.name,email:member.username},profile:{name:member.name,newsletter:Boolean(member.newsletter)},favorites:saved.results.map(f=>f.project),orders:history.results.map(o=>({id:o.id,items:JSON.parse(o.items),total:o.total,status:o.status,createdAt:o.created_at}))};
  }
  if (!member) throw new HttpError(401,"登入後即可儲存與體驗。");
  if (request.method!=="POST") throw new HttpError(405,"不支援這個操作。");
  if (path==="/api/auth/logout") { const token=request.headers.get("authorization")!.slice(7); await db.prepare("DELETE FROM sessions WHERE token_hash=?").bind(await digest(token)).run(); return {success:true}; }
  if (path==="/api/profile") { const data=await body(request,profileSchema); await db.prepare("UPDATE users SET name=?,newsletter=? WHERE id=?").bind(data.name,Number(data.newsletter),member.id).run(); return {success:true}; }
  if (path==="/api/favorites") { const data=await body(request,favoriteSchema); if(data.saved) await db.prepare("INSERT OR IGNORE INTO favorites(user_id,project) VALUES(?,?)").bind(member.id,data.project).run(); else await db.prepare("DELETE FROM favorites WHERE user_id=? AND project=?").bind(member.id,data.project).run(); return {success:true}; }
  if (path==="/api/orders") {
    const data=await body(request,orderSchema); let totals; try {totals=calculateOrder(data.lines);} catch(e){throw new HttpError(400,(e as Error).message);}
    await db.prepare("INSERT OR IGNORE INTO orders(id,user_id,idempotency_key,items,subtotal,shipping,total,status,created_at) VALUES(?,?,?,?,?,?,?,'demo_confirmed',?)").bind(crypto.randomUUID(),member.id,data.key,JSON.stringify(totals.items),totals.subtotal,totals.shipping,totals.total,new Date().toISOString()).run();
    const order=await db.prepare("SELECT id,total,status FROM orders WHERE user_id=? AND idempotency_key=?").bind(member.id,data.key).first(); return order;
  }
  if (path==="/api/inquiries") {
    const data=await body(request,inquirySchema); const day=new Date(Date.now()-86400000).toISOString();const id=crypto.randomUUID();
    const result=await db.prepare("INSERT INTO inquiries(id,user_id,name,email,service,budget,message,created_at) SELECT ?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM inquiries WHERE user_id=? AND created_at>?)<5").bind(id,member.id,data.name,data.email,data.service,data.budget,data.message,new Date().toISOString(),member.id,day).run();
    if(!result.meta.changes)throw new HttpError(429,"24 小時內最多送出五次洽詢。"); return {success:true,id};
  }
  throw new HttpError(404,"找不到這個服務。");
}
export default { async fetch(request:Request,env:Env):Promise<Response> {
  const origin=request.headers.get("origin");const allowed=env.ALLOWED_ORIGINS.split(",").map(s=>s.trim());const acceptable=Boolean(origin&&allowed.includes(origin));
  const headers=new Headers({"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Vary":"Origin"});
  if(acceptable){headers.set("Access-Control-Allow-Origin",origin!);headers.set("Access-Control-Allow-Methods","GET, POST, OPTIONS");headers.set("Access-Control-Allow-Headers","Authorization, Content-Type");headers.set("Access-Control-Max-Age","600");}
  if((origin&&!acceptable)||(!origin&&request.method!=="GET"))return new Response(JSON.stringify({error:"此來源未獲授權。"}),{status:403,headers});
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers});
  try { return new Response(JSON.stringify(await route(request,env)),{status:200,headers}); }
  catch(error){const known=error instanceof HttpError;if(!known)console.error("API request failed",error instanceof Error?error.name:"unknown");return new Response(JSON.stringify({error:known?error.message:"暫時無法完成，請稍後再試。"}),{status:known?error.status:500,headers});}
} };
