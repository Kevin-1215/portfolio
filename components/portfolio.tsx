import { useEffect, useRef, useState } from "react";
import { ArrowDown, Mail, Plus, Minus } from "lucide-react";
import { Header, Footer, Arrow, SectionLabel, ProjectVisual, projectInfo, sitePath } from "./site";
import WorkflowArtwork from "./workflow-art";
import ContactBrief, { contactEmail } from "./contact-brief";
import { services, type ServiceName } from "@/lib/services";

export default function Portfolio() {
  const [group, setGroup] = useState<"consulting" | "systems">("consulting");
  const [service, setService] = useState(0);
  const [briefService, setBriefService] = useState<ServiceName>(services[0].title);
  const [briefSelection, setBriefSelection] = useState(0);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("revealed"); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    root.current?.querySelectorAll("[data-reveal]").forEach(node => {
      node.classList.add("will-reveal"); observer.observe(node);
    });
    if (new URLSearchParams(location.search).get("work") === "systems") setGroup("systems");
    return () => observer.disconnect();
  }, []);

  function selectGroup(value: "consulting" | "systems") {
    setGroup(value);
    const url = new URL(location.href);
    if (value === "systems") url.searchParams.set("work", value); else url.searchParams.delete("work");
    history.replaceState(null, "", url);
  }
  const shown = projectInfo.filter(project => group === "consulting" ? project.group === "consulting" : !project.group);

  return <div ref={root} className="consultant-site"><Header /><main id="main">
    <section className="hero consultant-hero" aria-labelledby="hero-heading">
      <div className="hero-top"><span className="eyebrow">KEVIN CHOU / AI & DIGITAL TRANSFORMATION</span><span className="availability"><i />開放合作洽詢</span></div>
      <div className="hero-heading-wrap">
        <h1 id="hero-heading">Clarity<br /><span className="hero-second">at work<span className="hero-dot">.</span></span></h1>
        <div className="hero-intro">
          <p>讓流程更順，<br />讓技術真正落地。</p>
          <span>周靖翔 Kevin Chou<br />AI 與數位轉型顧問<br />從流程診斷到系統實作，<br />把改變帶進日常工作。</span>
          <div className="hero-actions"><a href="#services" className="text-link">了解服務內容 <ArrowDown size={16} /></a><a href="#contact">討論你的需求 <Arrow size={15} /></a></div>
        </div>
      </div>
      <div className="hero-bottom">
        <div className="hero-side"><span className="tiny-label">CONSULTING × TECHNOLOGY<br />BASED IN TAIWAN</span><div className="hero-caption"><span className="mini-cross">+</span><p>先理解問題，<br />再讓改變發生。</p></div><a href="#about" className="scroll-cue"><span>A LITTLE ABOUT ME</span><ArrowDown size={18} /></a></div>
        <a className="hero-image consultant-featured" href={sitePath("/work/finance-operations/")} aria-label="查看財務流程優化案例"><WorkflowArtwork id="finance-operations" hero /><span className="consultant-featured-caption">SELECTED EXPERIENCE / 財務流程優化 <Arrow size={18} /></span></a>
      </div>
      <div className="hero-footnote"><span>STRATEGY × PROCESS × TECHNOLOGY</span><span>從看清問題，到做出改變。</span><span>KEVIN CHOU — CONSULTANT</span></div>
    </section>

    <section id="about" className="about section-pad consultant-about">
      <div className="about-label" data-reveal>
        <SectionLabel n="01">ABOUT ME / 關於我</SectionLabel>
        <div className="about-mark" aria-hidden="true"><span>k</span><i>°</i></div>
        <div className="consultant-identity"><strong>周靖翔 <span>Kevin Chou</span></strong><p>AI 與數位轉型顧問<br />InnoArk 伊諾方舟科技 · 共同創辦人</p></div>
      </div>
      <div className="about-content" data-reveal>
        <h2>理解業務的語言，<br />也看得見技術的細節。</h2>
        <p className="about-lead">把顧問思考與開發實作，放在同一條路上。</p>
        <p>我的工作橫跨數位轉型顧問、RPA 自動化與系統開發，具 KPMG 管理顧問與精誠資訊開發經歷，並共同創立 InnoArk 伊諾方舟科技。</p>
        <p>資訊管理與財務金融的背景，讓我習慣同時理解作業目的、資料邏輯與技術條件。從主管訪談、第一線流程梳理，到 AI、OCR、RPA 與網站系統，我在意的是方案能否接上每天真正發生的工作。</p>
        <div className="experience-lines"><div><span>CONSULTING</span><p>需求訪談 · 流程診斷 · 數位轉型規劃</p></div><div><span>IMPLEMENTATION</span><p>AI 應用 · RPA / OCR · 網站與系統整合</p></div><div><span>ENABLEMENT</span><p>SOP 與交接 · 企業培訓 · 技術工作坊</p></div></div>
      </div>
    </section>

    <section id="services" className="services section-pad consultant-services">
      <div className="section-heading" data-reveal><div><SectionLabel n="02">SERVICES / 服務內容</SectionLabel><h2>從你的問題，開始。<span>Made to move forward.</span></h2></div><p>釐清現況，選擇合適的工具。<br />再把方向，轉成能執行的工作。</p></div>
      <div className="service-list">{services.map((item, i) => <article key={item.title} className={`service-row ${service === i ? "expanded" : ""}`}>
        <button aria-expanded={service === i} aria-controls={`service-${i}`} onClick={() => setService(service === i ? -1 : i)}><span className="service-number">0{i + 1}</span><h3>{item.title}</h3><span className="service-en">{item.english}</span>{service === i ? <Minus size={22} /> : <Plus size={22} />}</button>
        <div id={`service-${i}`} className="service-detail" hidden={service !== i}><p>{item.description}</p><span className="service-deliverables"><strong>可討論的交付內容</strong>{item.deliverables}</span><div className="service-links"><a className="text-link" href="#contact" onClick={() => { setBriefService(item.title); setBriefSelection(value => value + 1); }}>討論這項服務 <Arrow size={16} /></a>{item.example && <a href={sitePath(`/work/${item.example}/`)}>查看相關案例 <Arrow size={15} /></a>}</div></div>
      </article>)}</div>
      <div className="consulting-method"><div><span className="tiny-label">A CONSIDERED PROCESS</span><h3>一起把下一步，說清楚。</h3></div><ol>{[["理解現況", "盤點資料、訪談角色，釐清目標與問題。"], ["整理方案", "畫出流程與範圍，確認做法與交付內容。"], ["實作驗證", "依專案進行規格設計、開發或導入驗證。"], ["交接延續", "整理操作文件，支援團隊理解與後續維護。"]].map(([title, description], i) => <li key={title}><span>0{i + 1}</span><h4>{title}</h4><p>{description}</p></li>)}</ol></div>
    </section>

    <section id="work" className="work section-pad consultant-work">
      <div className="section-heading" data-reveal><div><SectionLabel n="03">SELECTED EXPERIENCE / 參考案例</SectionLabel><h2>把方法，放回真實問題。<span>Work, with context.</span></h2></div><p>從顧問規劃，到可以操作的系統。<br />看看每個案例裡的問題、選擇與實作範圍。</p></div>
      <div className="work-toolbar"><div className="filters case-groups" aria-label="參考案例分類">{[["consulting", "顧問與流程專案"], ["systems", "網站與系統展示"]].map(([value, label]) => <button key={value} aria-pressed={group === value} className={group === value ? "active" : ""} onClick={() => selectGroup(value as "consulting" | "systems")}>{label}<sup>04</sup></button>)}</div><span className="tiny-label">CONTEXT BEFORE CONCLUSIONS</span></div>
      <p className="case-group-description" role="status">{group === "consulting" ? "三個過往專案的匿名經歷摘要，以及一份流程架構規格示例。" : "一個已上線的自主開發工具，以及品牌、電商與會員系統的可操作展示。"}</p>
      <div className={`projects-grid ${group === "consulting" ? "consulting-grid" : "systems-grid"}`}>{shown.map(project => <article key={project.id} className={`project-card project-${project.id}`}>
        <a className="project-link" href={project.href} aria-label={`探索 ${project.name} ${project.type}案例`}><ProjectVisual id={project.id} /><span className="project-hover">了解問題與做法 <Arrow /></span></a>
        <div className="project-meta"><div><h3><a href={project.href}>{project.name}</a></h3><p>{project.subtitle}</p><span className="case-status">{project.status}</span></div><a className="project-arrow" href={project.href} aria-label={`開啟 ${project.name} 案例`}><Arrow /></a></div>
        <div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      </article>)}</div>
      <p className="work-note"><span>↳</span>{group === "consulting" ? "企業專案以匿名摘要呈現；案例圖像為流程示意。" : "自主專案與概念展示各自標明範圍；概念商店不會扣款或出貨。"}</p>
    </section>

    <section id="contact" className="contact section-pad consultant-contact">
      <div className="contact-intro" data-reveal><SectionLabel n="04">CONTACT / 聯絡資訊</SectionLabel><h2>從一個問題，<br /><em>聊到下一步。</em><Arrow size={56} /></h2><p>想評估 AI 應用、整理工作流程，<br />或建置一個網站與系統，都可以先聊聊。</p><a className="direct-email" href={`mailto:${contactEmail}?subject=${encodeURIComponent("合作洽詢")}`}><Mail size={17} /><span>{contactEmail}</span><Arrow size={15} /></a><span className="availability"><i />OPEN FOR COLLABORATIONS</span><p className="contact-side-note">可依需求討論專案合作或顧問協作。<br />範圍、時程與交付內容，確認後再報價。</p></div>
      <div className="contact-form-wrap"><ContactBrief selectedService={briefService} selectionKey={briefSelection} /></div>
    </section>
  </main><Footer /></div>;
}
