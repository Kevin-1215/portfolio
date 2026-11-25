import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
const config = JSON.parse(await fs.readFile("config/public.json", "utf8"));
async function list(directory) { const entries = await fs.readdir(directory, { withFileTypes: true }); const groups = await Promise.all(entries.map(entry => entry.isDirectory() ? list(path.join(directory, entry.name)) : [path.join(directory, entry.name)])); return groups.flat(); }
const files = await list("out"); const pages = files.filter(file => file.endsWith(".html")); let links = 0;
for (const file of pages) {
  const html = await fs.readFile(file, "utf8");
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${file}: requires one main heading`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: duplicate element IDs`);
  assert.ok(html.includes('rel="canonical"'), `${file}: missing canonical URL`);
  const navigation = html.match(/<nav aria-label="主要導覽"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(navigation,`${file}: missing primary navigation`);
  for(const route of ["", "about/", "services/", "work/", "contact/"])assert.ok(navigation.includes(`href="${config.basePath}${route}"`),`${file}: primary navigation must link to the ${route||"home"} page`);
  for(const old of ["about", "services", "work", "contact"])assert.ok(!html.includes(`href="${config.basePath}#${old}"`),`${file}: old one-page navigation remains`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const raw = match[1].replaceAll("&amp;", "&");
    if (/^(?:https?:|mailto:|data:|blob:|#)/.test(raw)) continue;
    assert.ok(raw.startsWith(config.basePath), `${file}: reference misses project path: ${raw}`);
    const relative = raw.slice(config.basePath.length).split(/[?#]/)[0];
    const target = path.join("out", relative.endsWith("/") || relative === "" ? `${relative}index.html` : relative);
    await fs.access(target).catch(() => { throw new Error(`${file}: broken local reference ${raw}`); }); links++;
  }
}
for (const id of ["finance-operations", "smart-operations", "esg-platform", "erp-validation", "account-opening", "purchase-workflow", "folio", "aura", "objects", "forma"]) {
  const file=`out/work/${id}/index.html`;
  await fs.access(file);
  const html=await fs.readFile(file,"utf8");
  assert.ok(!html.includes("過往專案")&&!html.includes("匿名摘要")&&!html.includes("專案性質"),`${file}: use concrete project content rather than generic case labels`);
}
const homepage = await fs.readFile("out/index.html", "utf8");
for(const route of ["about", "services", "work", "contact"])await fs.access(`out/${route}/index.html`);
for(const id of ["about", "services", "work", "contact"])assert.ok(!homepage.includes(`id="${id}"`),`Homepage must not embed the entire ${id} page`);
const servicePage=await fs.readFile("out/services/index.html","utf8");
for(const service of ["AI 顧問服務", "流程優化", "網站建置", "SEO 優化", "其他系統建置"])assert.ok(servicePage.includes(service),`Missing requested service: ${service}`);
assert.ok(homepage.includes("周靖翔")&&homepage.includes("Kevin Chou"),"Homepage must identify the consultant");
const publicEmails=[...homepage.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)].map(match=>match[0]);
assert.ok(publicEmails.every(email=>email==="kevinchou@innodanc.com"),"Only the approved business email may be published");
assert.ok(!/(?<!\d)09\d{2}[-\s]?\d{3}[-\s]?\d{3}(?!\d)/.test(homepage),"Reference-only mobile contact data must not be published");
const bundle = (await Promise.all(files.filter(file => file.endsWith(".js")).map(file => fs.readFile(file, "utf8")))).join("");
assert.ok(!bundle.includes("127.0.0.1:8787"), "Published bundle must not call a development API");
if(config.apiUrl)assert.ok(bundle.includes(config.apiUrl),"Published bundle must use the configured cloud API");
console.log(`PASS ${pages.length} pre-rendered pages, ${links} local references, unique IDs, 10 case routes, independent page navigation, concrete project descriptions and cloud API state.`);
