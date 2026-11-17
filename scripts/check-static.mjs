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
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const raw = match[1].replaceAll("&amp;", "&");
    if (/^(?:https?:|mailto:|data:|blob:|#)/.test(raw)) continue;
    assert.ok(raw.startsWith(config.basePath), `${file}: reference misses project path: ${raw}`);
    const relative = raw.slice(config.basePath.length).split(/[?#]/)[0];
    const target = path.join("out", relative.endsWith("/") || relative === "" ? `${relative}index.html` : relative);
    await fs.access(target).catch(() => { throw new Error(`${file}: broken local reference ${raw}`); }); links++;
  }
}
for (const id of ["folio", "aura", "objects", "forma"]) await fs.access(`out/work/${id}/index.html`);
const bundle = (await Promise.all(files.filter(file => file.endsWith(".js")).map(file => fs.readFile(file, "utf8")))).join("");
assert.ok(!bundle.includes("127.0.0.1:8787"), "Published bundle must not call a development API");
if(config.apiUrl)assert.ok(bundle.includes(config.apiUrl),"Published bundle must use the configured cloud API");
console.log(`PASS ${pages.length} pre-rendered pages, ${links} local references, unique IDs, case routes and public API state.`);
