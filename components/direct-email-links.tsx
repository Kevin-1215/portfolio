import { buildMailCompose, type MailMethod } from "@/lib/mail-compose";

export default function DirectEmailLinks({ email }: { email: string }) {
  const options: { id: MailMethod; label: string }[] = [
    { id: "gmail", label: "Gmail" },
    { id: "outlook", label: "Outlook／Hotmail" },
    { id: "microsoft365", label: "Microsoft 365" },
  ];
  return <div className="direct-email-options"><p>不使用表單，也可以選擇網頁信箱直接寫信：</p><div>{options.map(option => <a key={option.id} href={buildMailCompose(option.id, { to: email, subject: "合作洽詢", body: "" }).href} target="_blank" rel="noopener noreferrer">{option.label}</a>)}</div></div>;
}
