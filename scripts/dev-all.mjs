import {spawn} from "node:child_process";
import path from "node:path";
const env={...process.env,WRANGLER_LOG_PATH:path.resolve("outputs/wrangler-preview.log"),WRANGLER_SEND_METRICS:"false"};
const cli="node_modules/wrangler/bin/wrangler.js";
if(process.argv.includes("--production")){const preview=spawn(process.execPath,["node_modules/vite/bin/vite.js","preview","--host","127.0.0.1","--port","5173"],{env,stdio:"inherit"});process.on("SIGINT",()=>preview.kill());process.on("SIGTERM",()=>preview.kill());const result=await new Promise(r=>preview.on("exit",r));process.exit(Number(result)||0);}
const migrate=spawn(process.execPath,[cli,"d1","migrations","apply","DB","--local","--config","cloudflare/wrangler.jsonc"],{env,stdio:"inherit"});
const code=await new Promise(r=>migrate.on("exit",r));if(code!==0)process.exit(Number(code)||1);
const api=spawn(process.execPath,[cli,"dev","--config","cloudflare/wrangler.jsonc","--ip","127.0.0.1","--port","8787","--inspector-port","0"],{env,stdio:"inherit"});
const web=spawn(process.execPath,["node_modules/vite/bin/vite.js","--host","127.0.0.1","--port","5173"],{env,stdio:"inherit"});
if(process.argv.includes("--check")){for(let i=0;i<30;i++){try{const health=await fetch("http://127.0.0.1:8787/api/health");if(health.ok){const checks=spawn(process.execPath,["scripts/check-hybrid-api.mjs"],{env,stdio:"inherit"});const result=await new Promise(r=>checks.on("exit",r));if(result!==0)console.error("Integration checks failed.");break;}}catch{}await new Promise(r=>setTimeout(r,500));}}
function stop(){api.kill();web.kill();}
process.on("SIGINT",stop);process.on("SIGTERM",stop);
await Promise.all([new Promise(r=>api.on("exit",r)),new Promise(r=>web.on("exit",r))]);
