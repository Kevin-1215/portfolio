import { useState } from "react";
import { Bookmark } from "lucide-react";
import { cases, caseTitle, type CaseId } from "@/lib/cases";
import { apiEnabled } from "@/lib/client";
import { Header, Footer, BackLink, ProjectVisual, sitePath, useMember, post } from "./site";
import { ContactAction } from "./page-layout";
import CraftStudy from "./craft-study";

export default function CaseStudy({ id }: { id: CaseId }) {
  const project = cases.find(item => item.id === id)!;
  const related = cases.filter(item => !item.group && item.id !== id).slice(0, 2);
  const { me, refresh } = useMember();
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const saved = me?.favorites.includes(id);
  async function save() { setBusy(true); try { await post("/api/favorites", { project: id, saved: !saved }); await refresh(); setFeedback(saved ? "已移除收藏。" : "已儲存至會員收藏。"); } catch (error) { setFeedback((error as Error).message); } finally { setBusy(false); } }
  const demoHref = project.external ? project.demo : sitePath(project.demo || "/work/?group=systems");
  return <><Header active="work" /><main id="main" className="marketing-main system-detail">
    <BackLink /><header className="project-intro"><p className="page-kicker">{project.type}</p><h1>{caseTitle(project)}</h1><p>{project.intro}</p><div className="page-actions">{project.demo && !project.demo.startsWith("#") && <a className="button-primary" href={demoHref} target={project.external ? "_blank" : undefined} rel={project.external ? "noopener noreferrer" : undefined}>{project.demoLabel}</a>}<button className="button-secondary" onClick={() => void save()} disabled={busy || !apiEnabled}><Bookmark size={16} fill={saved ? "currentColor" : "none"} />{saved ? "已收藏案例" : "收藏案例"}</button></div>{feedback && <p className="inline-feedback" role="status">{feedback}{feedback.includes("登入") && <a href={sitePath(`/members/?next=${id}`)}>登入會員</a>}</p>}</header>
    <dl className="project-facts"><div><dt>專案內容</dt><dd>{project.scope}</dd></div><div><dt>負責工作</dt><dd>{project.role}</dd></div><div><dt>使用技術</dt><dd>{project.stack}</dd></div><div><dt>功能類型</dt><dd>{project.status}</dd></div></dl>
    <section className="system-copy-section"><h2>功能範圍</h2><p>{project.context}</p></section>
    <section className="system-copy-section"><h2>實作內容</h2><div className="system-work">{project.decisions.map(item => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
    {id === "folio" ? <details className="system-demo"><summary>試用名片編輯功能</summary><CraftStudy initialStage={2} compact /></details> : id === "aura" ? <details className="system-demo"><summary>查看品牌頁面展示</summary><section className="aura-demo" aria-label="AURA 品牌網站介面"><header><strong>AURA</strong><a href={sitePath("/contact/?service=網站建置")}>聯絡合作</a></header><h2>Spaces that breathe.<br /><i>Stories that stay.</i></h2><div className="aura-demo-content"><img src={sitePath("/images/interior.jpg")} alt="AURA 品牌介面的自然光居住空間攝影" width="2000" height="1500" loading="lazy" /><div><p>品牌頁面透過空間攝影、標題與內容分段，呈現作品及設計方向。</p><a href={sitePath("/contact/?service=網站建置")}>討論品牌網站需求</a></div></div></section></details> : <details className="system-demo"><summary>查看介面視覺</summary><div className="system-cover"><ProjectVisual id={id} /></div></details>}
    <section className="system-copy-section"><h2>操作流程</h2><ol className="project-process">{project.flow.map(item => <li key={item.title}><strong>{item.title}</strong><span>{item.note}</span></li>)}</ol></section>
    <section className="system-copy-section"><h2>功能檢查與使用範圍</h2><ul className="plain-bullets">{project.checks.map(item => <li key={item}>{item}</li>)}</ul><p>{project.boundary}</p><div className="page-actions"><ContactAction service={id === "folio" || id === "aura" ? "網站建置" : "其他系統建置"} title="討論類似功能" />{id === "folio" && <a className="button-secondary" href="https://github.com/Kevin-1215/card-studio" target="_blank" rel="noopener noreferrer">查看工具原始碼</a>}</div></section>
    <section className="project-related"><h2>其他網站與工具</h2><div>{related.map(item => <a key={item.id} href={sitePath(`/work/${item.id}/`)}>{caseTitle(item)}</a>)}</div></section>
  </main><Footer /></>;
}
