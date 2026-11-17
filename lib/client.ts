const config = import.meta.env;
export const basePath = config.BASE_URL || "/";
export const apiOrigin = config.VITE_API_URL || (config.DEV ? "http://127.0.0.1:8787" : "");
export const apiEnabled = Boolean(apiOrigin);
export function sitePath(value: string) { const canonical=value.replace(/^(\/(?:members|shop|work\/aura))(?=[?#]|$)/,"$1/");return `${basePath.replace(/\/$/,"")}${canonical}`; }
let memoryToken = "";
function sessionToken() { try { return memoryToken || sessionStorage.getItem("kevin-member-token") || ""; } catch { return memoryToken; } }
export function setSession(token: string) { memoryToken=token;try { if(token)sessionStorage.setItem("kevin-member-token",token);else sessionStorage.removeItem("kevin-member-token"); }catch{} }
export async function api<T>(path:string,body?:unknown):Promise<T> {
  if(!apiEnabled)throw new Error("會員與雲端功能正在準備中，敬請稍候。");
  const token=sessionToken(); const response=await fetch(`${apiOrigin.replace(/\/$/,"")}${path}`,{method:body===undefined?"GET":"POST",headers:{...(body!==undefined?{"Content-Type":"application/json"}:{}),...(token?{Authorization:`Bearer ${token}`}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{}),credentials:"omit",cache:"no-store"});
  const data=await response.json() as T & {error?:string};if(!response.ok)throw new Error(data.error||"請稍後再試。");return data;
}
