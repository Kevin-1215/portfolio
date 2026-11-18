import { build } from "vite";
import fs from "node:fs/promises";
import path from "node:path";
import {pathToFileURL} from "node:url";
const config=JSON.parse(await fs.readFile("config/public.json","utf8"));
if(config.apiUrl && !/^https:\/\//.test(config.apiUrl))throw new Error("Production API URL must use HTTPS.");
await build();
const template=await fs.readFile("out/index.html","utf8");
await build({build:{ssr:"src/render.tsx",outDir:".sites-runtime/ssr",emptyOutDir:true,rollupOptions:{output:{entryFileNames:"render.mjs"}}}});
const {render,routes}=await import(pathToFileURL(path.resolve(".sites-runtime/ssr/render.mjs")).href);
const escape=value=>value.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;");
for(const entry of routes){const route=entry.path;const escaped=escape(entry.title);const canonical=`https://kevin-1215.github.io${config.basePath}${route?route+"/":""}`;let html=template.replace("<!--app-html-->",render(config.basePath+route)).replace(/<title>.*?<\/title>/,`<title>${escaped}</title>`).replace(/<meta name="description"[^>]*\/>/,`<meta name="description" content="${escape(entry.description)}"/>`).replace("</head>",`<link rel="canonical" href="${canonical}"/><meta property="og:title" content="${escaped}"/><meta property="og:description" content="${escape(entry.description)}"/><meta property="og:image" content="https://kevin-1215.github.io${config.basePath}images/portfolio-social.png"/></head>`);const file=route==="404"?"out/404.html":`out/${route?route+"/":""}index.html`;await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,html);}
await fs.writeFile("out/sitemap.xml",`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.filter(r=>r.path!=="404").map(r=>`<url><loc>https://kevin-1215.github.io${config.basePath}${r.path?r.path+"/":""}</loc></url>`).join("")}</urlset>`);
await fs.writeFile("out/.nojekyll","");
const person={"@context":"https://schema.org","@type":"Person",name:"周靖翔",alternateName:"Kevin Chou",url:`https://kevin-1215.github.io${config.basePath}`,jobTitle:"AI 與數位轉型顧問",email:"kevinchou@innodanc.com",affiliation:{"@type":"Organization",name:"伊諾方舟科技股份有限公司"}};
const homepage=await fs.readFile("out/index.html","utf8");
await fs.writeFile("out/index.html",homepage.replace("</head>",`<script type="application/ld+json">${JSON.stringify(person).replaceAll("<","\\u003c")}</script></head>`));
console.log("Built pre-rendered GitHub Pages pages at out/ with base "+config.basePath);
