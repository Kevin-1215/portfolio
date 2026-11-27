import assert from "node:assert/strict";
import { buildMailCompose, suggestMailMethod } from "../lib/mail-compose.ts";

const to = "kevin122815@gmail.com";
const subject = "合作洽詢｜AI 顧問 & 流程優化";
const body = `Kevin 你好，\r\n需求：核對 A+B & C? #項目\n請保留 emoji ✨，以及這段文字 &bcc=another@example.test。\n${"完整需求內容。".repeat(28)}\nEND-OF-BRIEF`;
const providers = [
  ["default", "mailto:", "", to, "subject"],
  ["gmail", "https:", "mail.google.com", "/mail/", "su"],
  ["outlook", "https:", "outlook.live.com", "/mail/0/deeplink/compose", "subject"],
  ["microsoft365", "https:", "outlook.office.com", "/mail/deeplink/compose", "subject"],
];
let checks = 0;
for (const [method, protocol, hostname, pathname, subjectKey] of providers) {
  // Mailto gets a shorter fixture so all clients exercise the complete-body path.
  const text = method === "default" ? body.slice(0, body.indexOf("完整需求內容。")) + "END-OF-BRIEF" : body;
  const compose = buildMailCompose(method, { to, subject, body: text });
  const url = new URL(compose.href);
  assert.equal(compose.requiresCopy, false);
  assert.equal(url.protocol, protocol);
  assert.equal(url.hostname, hostname);
  assert.equal(url.pathname, pathname);
  assert.equal(method === "default" ? url.pathname : url.searchParams.get("to"), to);
  assert.equal(url.searchParams.get(subjectKey), subject);
  assert.equal(url.searchParams.get("body"), text);
  for (const forbidden of ["from", "cc", "bcc"]) assert.equal(url.searchParams.has(forbidden), false);
  assert.equal(url.hash, "");
  checks++;

  const longDraft = buildMailCompose(method, { to, subject, body: "長需求".repeat(733) + "結尾保留" });
  const longUrl = new URL(longDraft.href);
  assert.equal(longDraft.requiresCopy, true);
  assert.equal(longUrl.searchParams.has("body"), false);
  assert.equal(longUrl.searchParams.get(subjectKey), subject);
  assert.equal(method === "default" ? longUrl.pathname : longUrl.searchParams.get("to"), to);
  checks++;

  const empty = buildMailCompose(method, { to, subject, body: "" });
  assert.equal(empty.requiresCopy, false);
  assert.equal(new URL(empty.href).searchParams.has("body"), false);
  checks++;
}
// Keep more than the former 180 characters intact, including the last line.
const fullText = "A complete requirement. ".repeat(12) + "END-OF-BRIEF";
assert.ok(fullText.length > 180);
for (const [method] of providers) {
  const draft = buildMailCompose(method, { to, subject, body: fullText });
  assert.equal(draft.requiresCopy, false);
  assert.equal(new URL(draft.href).searchParams.get("body"), fullText);
  checks++;
}
for (const [address, expected] of [
  [" example+brief@GMAIL.COM ", "gmail"], ["visitor@googlemail.com", "gmail"],
  ["visitor@outlook.com", "outlook"], ["visitor@hotmail.com", "outlook"],
  ["visitor@live.com", "outlook"], ["visitor@msn.com", "outlook"],
  ["visitor@outlook.com.tw", "outlook"], ["visitor@hotmail.com.tw", "outlook"],
  ["visitor@company.onmicrosoft.com", "microsoft365"],
  ["visitor@company.example", "default"], ["visitor@gmail.com.evil.example", "default"],
  ["gmail.com", "default"], ["@gmail.com", "default"], ["visitor@@gmail.com", "default"],
  ["", "default"],
]) {
  assert.equal(suggestMailMethod(address), expected);
  checks++;
}
console.log(`Contact email checks passed: ${checks} cases (encoding, complete content, long-brief fallback, provider selection).`);
