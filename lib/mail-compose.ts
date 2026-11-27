export type MailMethod = "default" | "gmail" | "outlook" | "microsoft365";
export type EmailDraft = { to: string; subject: string; body: string };

export const mailMethods: { id: MailMethod; label: string; action: string; note: string }[] = [
  { id: "gmail", label: "Gmail", action: "用 Gmail 開啟草稿", note: "在新分頁開啟 Gmail；請使用自己的帳號，確認內容後寄出。" },
  { id: "outlook", label: "Outlook／Hotmail", action: "用 Outlook 開啟草稿", note: "在新分頁開啟個人版 Outlook；公司 Microsoft 365 信箱請選另一個選項。" },
  { id: "microsoft365", label: "Microsoft 365", action: "用 Microsoft 365 開啟草稿", note: "在新分頁開啟公司或學校的 Outlook 網頁版；請使用自己的帳號。" },
  { id: "default", label: "裝置預設郵件", action: "用預設郵件 App 開啟草稿", note: "會使用這部裝置設定的郵件 App。若出現加入帳號畫面，可改選上方的網頁信箱。" },
];

export function suggestMailMethod(email: string): MailMethod {
  const domain = email.trim().toLowerCase().match(/^[^@\s]+@([^@\s]+)$/)?.[1];
  if (domain === "gmail.com" || domain === "googlemail.com") return "gmail";
  if (["outlook.com", "hotmail.com", "live.com", "msn.com", "outlook.com.tw", "hotmail.com.tw"].includes(domain || "")) return "outlook";
  if (domain?.endsWith(".onmicrosoft.com")) return "microsoft365";
  return "default";
}

function composeHref(method: MailMethod, draft: EmailDraft, includeBody: boolean): string {
  // Encode each value separately: user text must never become another query parameter.
  const query = (entries: [string, string][]) => entries.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&");
  const body: [string, string][] = includeBody && draft.body ? [["body", draft.body]] : [];
  if (method === "default") return `mailto:${draft.to}?${query([["subject", draft.subject], ...body])}`;
  if (method === "gmail") return `https://mail.google.com/mail/?${query([["view", "cm"], ["fs", "1"], ["to", draft.to], ["su", draft.subject], ...body])}`;
  const base = method === "outlook" ? "https://outlook.live.com/mail/0/deeplink/compose" : "https://outlook.office.com/mail/deeplink/compose";
  return `${base}?${query([["to", draft.to], ["subject", draft.subject], ...body])}`;
}

export function buildMailCompose(method: MailMethod, draft: EmailDraft): { href: string; requiresCopy: boolean } {
  const href = composeHref(method, draft, true);
  // These are conservative product limits, not claims about every mail client.
  // Long briefs stay intact in the copy/download path instead of being truncated.
  const prefillLimit = method === "default" ? 1800 : 6000;
  if (href.length <= prefillLimit) return { href, requiresCopy: false };
  return { href: composeHref(method, draft, false), requiresCopy: true };
}
