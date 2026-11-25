import { useState } from "react";
import { cases } from "@/lib/cases";
import { Header, Footer, sitePath } from "./site";
import ProjectDiagram from "./project-diagram";

export default function Portfolio() {
  const featured = cases.filter(project => ["finance-operations", "smart-operations", "esg-platform"].includes(project.id));
  const [featuredId, setFeaturedId] = useState("finance-operations");
  const featuredLabels: Record<string, string> = { "finance-operations": "財務對帳", "smart-operations": "製造業 AI", "esg-platform": "ESG 資料" };
  return <><Header active="home" /><main id="main" className="marketing-main landing-page">
    <section className="landing-hero"><div className="landing-intro"><p className="page-kicker">AI AUTOMATION & DIGITAL TRANSFORMATION</p><h1>AI 自動化與<br /><em>企業流程優化</em></h1><p>從<strong>流程盤點、AI 應用評估到系統整合</strong>，協助企業改善財務對帳、文件辨識與跨系統作業，也提供網站及內部系統建置。</p><div className="page-actions"><a className="button-primary" href={sitePath("/work/")}>查看專案案例</a><a className="button-secondary" href={sitePath("/services/")}>了解服務內容</a></div></div>
      <aside className="landing-profile"><p>周靖翔</p><h2>Kevin Chou</h2><span>AI Automation 與數位轉型顧問</span><dl><div><dt>顧問經歷</dt><dd>KPMG 管理顧問</dd></div><div><dt>開發背景</dt><dd>精誠資訊 · 系統與 RPA 開發</dd></div><div><dt>創業經歷</dt><dd>InnoArk 伊諾方舟科技共同創辦人</dd></div></dl><a href={sitePath("/about/")}>了解我的經歷</a></aside>
    </section>
    <section className="landing-selected"><div className="landing-section-heading"><h2>精選專案</h2><a href={sitePath("/work/")}>查看所有案例</a></div><div className="landing-case-controls" role="group" aria-label="切換精選專案">{featured.map(project => <button key={project.id} aria-pressed={featuredId === project.id} aria-controls={`featured-${project.id}`} onClick={() => setFeaturedId(project.id)}>{featuredLabels[project.id]}</button>)}<span className="sr-only" role="status">{featured.find(project => project.id === featuredId)?.name}</span></div><div className="landing-case-list">{featured.map(project => <article key={project.id} id={`featured-${project.id}`} data-selected={featuredId === project.id}><ProjectDiagram id={project.id} compact /><div className="landing-case-copy"><p>{project.industry}</p><h3><a href={sitePath(`/work/${project.id}/`)}>{project.name}</a></h3><a className="landing-case-open" href={sitePath(`/work/${project.id}/`)}>查看案例</a></div></article>)}</div></section>
  </main><Footer /></>;
}
