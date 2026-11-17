import { build } from "vite";
import fs from "node:fs/promises";
import path from "node:path";
import {pathToFileURL} from "node:url";
const config=JSON.parse(await fs.readFile("config/public.json","utf8"));
if(config.apiUrl && !/^https:\/\//.test(config.apiUrl))throw new Error("Production API URL must use HTTPS.");
await build();
const template=await fs.readFile("out/index.html","utf8");
await build({build:{ssr:"src/render.tsx",outDir:".sites-runtime/ssr",emptyOutDir:true,rollupOptions:{output:{entryFileNames:"render.mjs"}}}});
const {render}=await import(pathToFileURL(path.resolve(".sites-runtime/ssr/render.mjs")).href);
const routes=[["","Kevin — Independent Design & Development"],["members","FORMA 會員體驗 · Kevin"],["shop","日常之物 · 概念商店 · Kevin"],["work/aura","AURA · 品牌形象案例 · Kevin"],["404","找不到頁面 · Kevin"]];
for(const [route,title] of routes){const escaped=title.replaceAll("&","&amp;").replaceAll("<","&lt;");const canonical=`https://kevin-1215.github.io${config.basePath}${route?route+"/":""}`;let html=template.replace("<!--app-html-->",render(config.basePath+route)).replace(/<title>.*?<\/title>/,`<title>${escaped}</title>`).replace("</head>",`<link rel="canonical" href="${canonical}"/><meta property="og:title" content="${escaped}"/><meta property="og:image" content="https://kevin-1215.github.io${config.basePath}images/interior.jpg"/></head>`);const file=route==="404"?"out/404.html":`out/${route?route+"/":""}index.html`;await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,html);}
await fs.writeFile("out/.nojekyll","");
console.log("Built pre-rendered GitHub Pages pages at out/ with base "+config.basePath);
