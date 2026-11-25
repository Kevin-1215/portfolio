import { useEffect, useRef, useState } from "react";
import { Check, Copy, Download, Mail } from "lucide-react";
import { apiEnabled } from "@/lib/client";
import { post, useMember } from "./site";
import { serviceNames, type ServiceName } from "@/lib/services";

export const contactEmail = "kevinchou@innodanc.com";
const services = [
  { value: serviceNames[0], label: "AI 顧問服務", note: "AI 應用評估與導入規劃" },
  { value: serviceNames[1], label: "流程優化", note: "作業盤點與自動化改善" },
  { value: serviceNames[2], label: "網站建置", note: "形象網站、會員與電商" },
  { value: serviceNames[3], label: "SEO 優化", note: "網站技術與內容結構改善" },
  { value: serviceNames[4], label: "其他系統建置", note: "內部工具、資料平台與串接" },
  { value: "其他合作", label: "先聊聊需求", note: "方向未定，先釐清問題" },
];
const featureOptions = ["AI 應用評估", "流程盤點與 SOP", "AI Automation 導入", "網站與會員功能", "SEO 技術檢查", "既有系統整合", "資料平台與報表", "一起釐清需求"];
const steps = ["選服務", "說明需求", "準備寄信"];
type Brief = { service: string; features: string[]; budget: string; timeframe: string; message: string; name: string; email: string };

export default function ContactBrief({ selectedService, selectionKey = 0 }: { selectedService?: ServiceName; selectionKey?: number }) {
  const { me } = useMember();
  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState<Brief>({ service: selectedService || "", features: [], budget: "尚未確定", timeframe: "尚未確定", message: "", name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cloudSaved, setCloudSaved] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const description = useRef<HTMLTextAreaElement>(null);
  const firstService = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const completeHeading = useRef<HTMLHeadingElement>(null);
  const summaryField = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setBrief(previous => ({ ...previous, service: selectedService || "" }));
    setSubmitted(false); setStep(0); setError("");
  }, [selectedService, selectionKey]);
  useEffect(() => { if (submitted) completeHeading.current?.focus(); }, [submitted]);

  function change<K extends keyof Brief>(key: K, value: Brief[K]) {
    setBrief(previous => ({ ...previous, [key]: value })); setError("");
  }
  function go(next: number) {
    if (next > step && step === 0 && !brief.service) {
      setError("請先選擇一項服務；還不確定時，可以選「先聊聊需求」。");
      firstService.current?.focus(); return;
    }
    if (next > step && step === 1 && brief.message.trim().length < 10) {
      setError("請用至少 10 個字說明目前的問題，讓 Kevin 了解你的需求。");
      description.current?.focus(); return;
    }
    setStep(next); setError(""); requestAnimationFrame(() => heading.current?.focus());
  }
  function toggleFeature(value: string) { change("features", brief.features.includes(value) ? brief.features.filter(f => f !== value) : [...brief.features, value]); }
  const serviceLabel = services.find(service => service.value === brief.service)?.label || brief.service;
  const summary = `合作需求摘要\n\n稱呼：${brief.name}\n聯絡信箱：${brief.email}\n想討論的服務：${serviceLabel}\n關注的功能：${brief.features.join("、") || "一起討論"}\n預算方向：${brief.budget}\n期待時程：${brief.timeframe}\n\n需求說明：\n${brief.message}\n\n收件聯絡：${contactEmail}\n本摘要不會自動寄出。`;
  const mailBody = `Kevin 你好，\n\n想討論${brief.service === "其他合作" ? "需求與合作方向" : serviceLabel}。\n稱呼：${brief.name}\n聯絡信箱：${brief.email}\n預算方向：${brief.budget}\n期待時程：${brief.timeframe}\n關注的功能：${brief.features.join("、") || "一起討論"}\n\n${brief.message.slice(0, 180)}${brief.message.length > 180 ? "…\n（完整需求可附上下載的摘要）" : ""}`;
  const mailHref = `mailto:${contactEmail}?subject=${encodeURIComponent(`合作洽詢｜${serviceLabel}`)}&body=${encodeURIComponent(mailBody)}`;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 2) { go(step + 1); return; }
    setError(""); setCloudSaved(false); setSubmitted(true);
  }
  async function saveCloud() {
    setBusy(true); setError("");
    try {
      await post("/api/inquiries", { name: brief.name, email: brief.email, service: brief.service, budget: brief.budget, message: `關注功能：${brief.features.join("、") || "待討論"}\n期待時程：${brief.timeframe}\n\n${brief.message}` });
      setCloudSaved(true);
    } catch (error) { setError((error as Error).message); }
    finally { setBusy(false); }
  }
  function download() {
    const url = URL.createObjectURL(new Blob(["\uFEFF" + summary], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "kevin-project-brief.txt";
    document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
    setNotice("需求摘要已開始下載，可以附在合作 Email 裡。");
  }
  async function copy() {
    try { await navigator.clipboard.writeText(summary); setNotice("需求已複製，可以貼到你的 Email。"); }
    catch { summaryField.current?.focus(); summaryField.current?.select(); setNotice("已選取摘要，請使用複製快捷鍵。"); }
  }

  if (submitted) return <div className="brief-complete">
    <div className="brief-complete-icon"><Check size={22} aria-hidden="true" /></div>
    <p className="page-kicker">需求已整理完成</p><h2 ref={completeHeading} tabIndex={-1}>最後一步：寄出合作需求</h2>
    <p>接著請開啟 Email 草稿，確認內容後寄給 Kevin，即完成聯絡。</p>
    <div className="brief-send-action"><a href={mailHref} className="button-primary"><Mail size={18} aria-hidden="true" />開啟 Email 草稿</a><p>會開啟你的信箱程式，由你確認並寄出。若未開啟，可複製下方摘要，直接寄至 <a href={`mailto:${contactEmail}`}>{contactEmail}</a>。</p></div>
    <details className="brief-preview"><summary>查看、複製或下載完整摘要</summary><label className="brief-summary-label">你的需求摘要<textarea ref={summaryField} value={summary} readOnly rows={8} /></label><div className="brief-file-actions"><button onClick={() => void copy()}><Copy size={16} aria-hidden="true" />複製摘要</button><button onClick={download}><Download size={16} aria-hidden="true" />下載文字檔</button></div></details>
    {apiEnabled && me?.user && <details className="brief-member-save"><summary>會員：另存需求紀錄</summary><p className="form-note">這只會保存在本站，不會通知 Kevin；聯絡仍請寄出 Email。</p><button className="text-link" disabled={busy || cloudSaved} onClick={() => void saveCloud()}>{cloudSaved ? "已另存需求紀錄" : busy ? "正在儲存…" : "另存需求紀錄"}</button></details>}
    <button className="brief-back" onClick={() => { setSubmitted(false); setStep(0); setNotice(""); requestAnimationFrame(() => heading.current?.focus()); }}>返回修改需求</button>
    {notice && <p className="feedback" role="status">{notice}</p>}{error && <p className="form-error" role="alert">{error}</p>}
  </div>;

  return <form className="brief-form contact-form" onSubmit={submit}>
    <ol className="brief-progress" aria-label="合作需求步驟">{steps.map((title, index) => <li key={title} className={step === index ? "current" : step > index ? "complete" : ""}><button type="button" aria-current={step === index ? "step" : undefined} disabled={index > step} onClick={() => go(index)}><span>{step > index ? <Check size={14} aria-hidden="true" /> : index + 1}</span>{title}</button></li>)}</ol>
    <div className="brief-step"><h2 ref={heading} tabIndex={-1}>{["想討論哪一類需求？", "目前想解決什麼問題？", "確認需求與聯絡方式"][step]}</h2>
      {error && <p className="form-error" role="alert">{error}</p>}
      {step === 0 && <>
        <fieldset className="brief-service-options" aria-describedby="brief-service-note"><legend className="sr-only">選擇一項服務</legend>{services.map((service, index) => <label key={service.value}><input ref={index === 0 ? firstService : undefined} type="radio" name="service" value={service.value} checked={brief.service === service.value} onChange={() => change("service", service.value)} /><span className="brief-service-copy"><strong>{service.label}</strong><span>{service.note}</span></span></label>)}</fieldset>
        <div className="brief-help-note" id="brief-service-note"><strong>不確定怎麼選？</strong><p>選「先聊聊需求」即可。下一步只需簡單說明目前的問題，預算與時程還沒決定也沒關係。</p></div>
      </>}
      {step === 1 && <>
        <p className="brief-selection">已選擇：<strong>{serviceLabel}</strong></p>
        <label>需求說明（必填）<textarea ref={description} aria-label="需求說明" aria-describedby="brief-message-note" value={brief.message} onChange={event => change("message", event.target.value)} placeholder="例如：每月手動核對帳款，希望整合 Excel 與 ERP，減少重複輸入。" required minLength={10} maxLength={2200} rows={4} /><span id="brief-message-note" className="brief-field-note">寫下目前怎麼做、卡在哪裡、希望改善什麼；至少 10 字。</span></label>
        <div className="form-grid"><label>預算方向（NTD）<select value={brief.budget} onChange={event => change("budget", event.target.value)}>{["尚未確定", "5–10 萬", "10–20 萬", "20 萬以上"].map(value => <option key={value}>{value}</option>)}</select></label><label>期待完成時間<select value={brief.timeframe} onChange={event => change("timeframe", event.target.value)}>{["尚未確定", "1–2 個月內", "2–3 個月內", "時間可彈性討論"].map(value => <option key={value}>{value}</option>)}</select></label></div>
        <p className="brief-field-note">預算與時程可保留「尚未確定」，後續再依工作範圍討論。</p>
        <details className="brief-optional-options"><summary>補充希望包含的功能（選填）</summary><fieldset className="brief-feature-options"><legend className="sr-only">希望包含的功能，可複選</legend>{featureOptions.map(feature => <label key={feature}><input type="checkbox" checked={brief.features.includes(feature)} onChange={() => toggleFeature(feature)} /><span>{feature}</span></label>)}</fieldset></details>
      </>}
      {step === 2 && <>
        <div className="brief-review"><span>{serviceLabel}</span><p>{brief.message}</p><small>{brief.budget} · {brief.timeframe}{brief.features.length > 0 && ` · ${brief.features.join("、")}`}</small></div>
        <div className="form-grid"><label>怎麼稱呼你<input value={brief.name} onChange={event => change("name", event.target.value)} autoComplete="name" maxLength={60} required placeholder="姓名或公司名稱" /></label><label>聯絡信箱<input type="email" value={brief.email} onChange={event => change("email", event.target.value)} autoComplete="email" maxLength={150} required placeholder="you@yourbrand.com" /></label></div>
        <div className="brief-help-note"><strong>接下來怎麼做？</strong><p>按「整理需求，準備寄信」後，會提供 Email 草稿與完整摘要。你確認並寄出 Email 後，才會完成聯絡。</p></div>
      </>}
    </div>
    <div className="brief-navigation">{step > 0 ? <button type="button" className="brief-back" onClick={() => go(step - 1)}>上一步</button> : <span className="brief-optional">先選一項，後續仍可調整。</span>}{step < 2 ? <button key="next-step" type="button" className="solid-button" onClick={() => go(step + 1)}>{step === 0 ? "下一步：說明需求" : "下一步：聯絡方式"}</button> : <button key="submit-brief" type="submit" className="solid-button">整理需求，準備寄信</button>}</div>
  </form>;
}
