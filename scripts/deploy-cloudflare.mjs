import { spawnSync } from "node:child_process";
import fs from "node:fs";
const file = "cloudflare/wrangler.jsonc";
const cli = "node_modules/wrangler/bin/wrangler.js";
function run(args) {
  const result = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8", env: { ...process.env, WRANGLER_SEND_METRICS: "false" }, maxBuffer: 8 * 1024 * 1024 });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) throw new Error(`Cloudflare command failed: ${args.slice(0, 2).join(" ")}`);
  return result.stdout;
}
const config = JSON.parse(fs.readFileSync(file, "utf8"));
if (config.account_id !== "b1f1a4e5370e7f9d2abc47bf2fb2fdd6") throw new Error("Unexpected account; deployment stopped");
const databases = JSON.parse(run(["d1", "list", "--json", "--config", file]));
const configured = config.d1_databases[0];
if (configured.database_id === "00000000-0000-4000-8000-000000000000") {
  if (databases.some(db => db.name === configured.database_name)) throw new Error("A database with this name already exists; inspect before selecting it");
  const created = run(["d1", "create", configured.database_name, "--location", "apac", "--config", file]);
  const id = created.match(/["']?database_id["']?\s*[:=]\s*["']([^"']+)["']/)?.[1];
  if (!id) throw new Error("Database created, but its ID must be read from the output before continuing. Do not create it again.");
  configured.database_id = id;
  fs.writeFileSync(file, JSON.stringify(config, null, 2) + "\n");
} else if (!databases.some(db => db.uuid === configured.database_id && db.name === configured.database_name)) {
  throw new Error("Configured database does not match this account");
}
run(["d1", "migrations", "apply", "DB", "--remote", "--config", file]);
const published = run(["deploy", "--config", file, "--minify"]);
const url = published.match(/https:\/\/[a-z0-9.-]+\.workers\.dev/)?.[0];
if (!url) throw new Error("Worker deployment finished without a URL; inspect before changing frontend configuration");
const publicConfig = JSON.parse(fs.readFileSync("config/public.json", "utf8"));
publicConfig.apiUrl = url;
fs.writeFileSync("config/public.json", JSON.stringify(publicConfig, null, 2) + "\n");
console.log(JSON.stringify({ deployed: true, apiUrl: url, databaseId: configured.database_id }));
