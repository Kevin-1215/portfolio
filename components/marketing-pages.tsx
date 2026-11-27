import { useEffect, useRef, useState } from "react";
import { cases } from "@/lib/cases";
import { services, serviceNames, type ServiceName } from "@/lib/services";
import { Header, Footer, sitePath } from "./site";
import { PageIntro, ContactAction } from "./page-layout";
import CaseCard from "./case-card";
import ContactBrief, { contactEmail } from "./contact-brief";
import DirectEmailLinks from "./direct-email-links";

export type MarketingPageId = "about" | "services" | "work" | "contact";

function AboutPage() {
  return <>
    <PageIntro label="ABOUT / KEVIN CHOU" title="關於我" description="AI Automation 與數位轉型顧問，結合流程盤點、流程優化、藍圖規劃、AI 應用評估與系統開發經驗。" />
    <div className="about-page-grid">
      <aside className="profile-panel"><p className="page-kicker">周靖翔</p><h2>Kevin Chou</h2><p>InnoArk 伊諾方舟科技<br />共同創辦人</p><dl><div><dt>服務產業</dt><dd>科技、製造、金融證券</dd></div><div><dt>跨領域背景</dt><dd>資訊管理、財務金融</dd></div><div><dt>服務經驗</dt><dd>臺灣、泰國、越南</dd></div></dl><ContactAction /></aside>
      <div className="about-page-content"><h2>我能協助的工作</h2><p>我協助企業進行流程盤點與流程優化、規劃數位轉型藍圖，評估 AI、OCR、RPA 與資料平台的導入方式，並將需求轉為系統規格、開發項目與作業文件。經歷涵蓋財務對帳自動化、製造業 AI 導入、ESG 資料平台，以及網站與內部系統建置。</p><p>具 KPMG 管理顧問 Senior Consultant 及精誠資訊開發經歷，參與超過 20 項專案。工作內容從主管與第一線人員訪談、需求分析、流程優化與藍圖規劃，到開發、驗證與交接，也包含企業 AI 應用培訓及技術工作坊。</p>
        <h2>顧問與開發經歷</h2><div className="career-list"><article><h3>InnoArk 伊諾方舟科技</h3><p className="career-role">共同創辦人／數位轉型顧問</p><p>提供 AI Automation、流程優化、RPA 開發與自動化工具導入服務。</p></article><article><h3>KPMG 管理顧問</h3><p className="career-role">Senior Consultant</p><p>企業流程盤點與優化、數位轉型藍圖規劃、AI 與自動化技術評估，以及資料平台與系統整合。</p></article><article><h3>精誠資訊</h3><p className="career-role">程式設計師／RPA Developer</p><p>使用 UiPath、Power Automate 等工具開發跨系統自動化，並以 C#、Angular、Python 建置網站應用與內部工具。</p></article></div>
        <h2>技術與交付能力</h2>
        <dl className="capability-list">
          <div><dt>AI 應用整合</dt><dd><p>評估生成式 AI 與文件辨識的應用情境，整合 AI 工具與企業作業流程。</p><p className="capability-tools"><strong>相關技術：</strong>Microsoft AI Builder、Google Cloud Vertex AI API、Gemini API。</p></dd></div>
          <div><dt>流程自動化開發</dt><dd><p>以 Python 整合 AI 模型與 API，開發客製化自動化流程，支援跨系統串接與例外處理。</p><p className="capability-tools"><strong>相關技術：</strong>Python、UiPath、Power Automate。</p></dd></div>
          <div><dt>網站與資料系統開發</dt><dd><p>建置品牌網站、會員功能、內部工具與資料管理系統。</p><p className="capability-tools"><strong>相關技術：</strong>React、Angular、JavaScript、Python、C#、SQL。</p></dd></div>
          <div><dt>顧問規劃與專案交付</dt><dd><p>從需求訪談、流程分析，到 AI 導入藍圖規劃與方案設計，整理開發規格與交接文件。</p><p className="capability-tools"><strong>交付項目：</strong>現況與目標流程（As-Is／To-Be）、資料結構設計、SOP 與教育訓練。</p></dd></div>
        </dl><a className="button-secondary" href={sitePath("/work/")}>查看相關專案</a>
      </div>
    </div>
  </>;
}

function ServicesPage() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => { const requested = new URLSearchParams(location.search).get("service"); const index = services.findIndex(item => item.title === requested); if (index >= 0) setSelected(index); }, []);
  function choose(index: number, focus = false) {
    setSelected(index); if (focus) tabs.current[index]?.focus();
    const url = new URL(location.href); url.searchParams.set("service", services[index].title); history.replaceState(null, "", url);
  }
  return <><PageIntro label="SERVICES" title="服務內容" description="選擇服務，查看適合的需求、可交付項目與相關案例。合作範圍與報價會依實際需求確認。" />
    <div className="services-page-grid"><div role="tablist" aria-label="選擇服務" className="service-page-tabs">{services.map((item, index) => <button key={item.title} ref={node => { tabs.current[index] = node; }} id={`service-tab-${index}`} role="tab" aria-selected={selected === index} aria-controls={`service-panel-${index}`} tabIndex={selected === index ? 0 : -1} onClick={() => choose(index)} onKeyDown={event => { let next = index; if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % services.length; else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index + services.length - 1) % services.length; else if (event.key === "Home") next = 0; else if (event.key === "End") next = services.length - 1; else return; event.preventDefault(); choose(next, true); }}>{item.title}</button>)}</div>
      <div>{services.map((service, index) => <section key={service.title} hidden={selected !== index} className="service-page-panel" role="tabpanel" id={`service-panel-${index}`} aria-labelledby={`service-tab-${index}`} tabIndex={0}><p className="page-kicker">{service.english}</p><h2>{service.title}</h2><p>{service.description}</p><h3>可交付項目</h3><ul className="plain-bullets">{service.deliverables.split(" / ").map(item => <li key={item}>{item}</li>)}</ul><div className="page-actions"><ContactAction service={service.title} title="洽詢這項服務" />{service.example && <a className="button-secondary" href={sitePath(`/work/${service.example}/`)}>查看相關案例</a>}</div></section>)}</div>
    </div><section className="cooperation-note"><h2>合作方式</h2><p>可依需求採專案合作或顧問協作。開始前先確認問題、需要處理的流程與資料、交付內容、時程及驗收方式。</p><a href={sitePath("/contact/")}>提供需求並聯絡</a></section>
  </>;
}

function WorkPage() {
  const [group, setGroup] = useState("projects");
  useEffect(() => { const value = new URLSearchParams(location.search).get("group"); if (["projects", "systems", "specification"].includes(value || "")) setGroup(value!); }, []);
  const options = [{ id: "projects", name: "企業專案", test: (p: typeof cases[number]) => p.group === "consulting" && !p.kind }, { id: "systems", name: "網站與工具展示", test: (p: typeof cases[number]) => !p.group }, { id: "specification", name: "流程規格設計", test: (p: typeof cases[number]) => p.kind === "specification" }];
  const current = options.find(option => option.id === group)!;
  const visible = cases.filter(current.test);
  function select(value: string) { setGroup(value); const url = new URL(location.href); url.searchParams.set("group", value); history.replaceState(null, "", url); }
  return <><PageIntro label="PROJECTS" title="參考案例" description="依工作內容選擇案例，了解處理的作業、串接的系統、我負責的工作與交付成果。" />
    <div className="case-page-filters" aria-label="案例分類">{options.map(option => <button key={option.id} aria-pressed={group === option.id} onClick={() => select(option.id)}>{option.name}<span>{cases.filter(option.test).length}</span></button>)}</div>
    <p className="case-page-context" role="status">{group === "projects" ? "財務流程、AI 營運、ESG 資料、ERP 檢核與證券開戶作業。" : group === "systems" ? "可操作的網站、會員、電商與名片工具，點入查看功能及展示入口。" : "Power Automate 的流程審查與建置規格內容。"}</p>
    <div className="case-page-grid">{visible.map(project => <CaseCard key={project.id} project={project} />)}</div>
  </>;
}

function ContactPage() {
  const [service, setService] = useState<ServiceName>();
  useEffect(() => { const value = new URLSearchParams(location.search).get("service"); if (serviceNames.includes(value as ServiceName)) setService(value as ServiceName); }, []);
  return <><PageIntro label="CONTACT" title="聯絡資訊" description="先選擇想討論的服務，再補充需求。完成後，可選常用的信箱開啟草稿並寄出。" /><div className="contact-page-form"><ContactBrief selectedService={service} /></div><aside className="contact-page-notes" aria-label="填寫與聯絡說明"><div><h2>還沒有完整規劃，也可以開始</h2><p>選單只是討論的起點。先說明目前遇到的問題即可，預算、時程與功能範圍都可以後續確認。</p></div><div><h2>想直接聯絡？</h2><p>點選信箱會開啟裝置預設郵件，也可以使用下方的網頁信箱，簡單介紹目前的問題。</p><a className="contact-page-email" href={`mailto:${contactEmail}`}>{contactEmail}</a><DirectEmailLinks email={contactEmail} /></div></aside></>;
}

export default function MarketingPage({ page }: { page: MarketingPageId }) {
  const view = page === "about" ? <AboutPage /> : page === "services" ? <ServicesPage /> : page === "work" ? <WorkPage /> : <ContactPage />;
  return <><Header active={page} /><main id="main" className={`marketing-main page-${page}`}>{view}</main><Footer /></>;
}
