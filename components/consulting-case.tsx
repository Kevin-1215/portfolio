import { cases, type CaseStudyData } from "@/lib/cases";
import { Header, Footer, sitePath } from "./site";
import { ContactAction } from "./page-layout";

export default function ConsultingCase({ project }: { project: CaseStudyData }) {
  const specification = project.kind === "specification";
  const service = project.id === "esg-platform" ? "其他系統建置" : project.id === "smart-operations" || specification ? "AI 顧問服務" : "流程優化";
  const related = cases.filter(item => item.group === "consulting" && item.id !== project.id && item.kind === project.kind).slice(0, 2);
  return <><Header active="work" /><main id="main" className="marketing-main consulting-detail">
    <a className="page-back" href={sitePath(specification ? "/work/?group=specification" : "/work/")}>回到參考案例</a>
    <header className="project-intro"><p className="page-kicker">{project.type}</p><h1>{project.name}</h1><p>{project.intro}</p></header>
    <dl className="project-facts"><div><dt>{specification ? "應用情境" : "客戶背景"}</dt><dd>{project.industry}</dd></div><div><dt>專案內容</dt><dd>{project.scope}</dd></div><div><dt>我的工作</dt><dd>{project.role}</dd></div><div><dt>使用技術</dt><dd>{project.stack}</dd></div></dl>
    <div className="project-detail-columns"><article className="project-detail-body"><section><h2>{project.question}</h2><p>{project.context}</p></section><section><h2>{specification ? "規格設計內容" : "我做了哪些工作"}</h2><div className="project-work-items">{project.decisions.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}</div></section>
      {project.parameters && <section><h2>規格中的判斷條件</h2><div className="project-table-wrap"><table className="project-parameters"><thead><tr><th>項目</th><th>範例設定</th><th>處理方式</th></tr></thead><tbody>{project.parameters.map(item => <tr key={item.label}><th scope="row">{item.label}</th><td>{item.value}</td><td>{item.note}</td></tr>)}</tbody></table></div></section>}
      <section><h2>作業流程</h2><ol className="project-process">{project.flow.map(item => <li key={item.title}><strong>{item.title}</strong><span>{item.note}</span></li>)}</ol></section>
      <section><h2>{specification ? "設計產出" : "專案成果"}</h2><div className="project-results">{project.results?.map(result => <div key={result.title}>{result.value && <strong className="project-result-value">{result.value}</strong>}<h3>{result.title}</h3><p>{result.description}</p></div>)}</div>{project.boundary && <p className="project-result-note">{project.boundary}</p>}</section>
    </article><aside className="project-deliverables"><h2>交付內容</h2><ul className="plain-bullets">{project.deliverables?.map(item => <li key={item}>{item}</li>)}</ul><ContactAction service={service} title="討論類似專案" /></aside></div>
    {related.length > 0 && <section className="project-related"><h2>其他相關案例</h2><div>{related.map(item => <a key={item.id} href={sitePath(`/work/${item.id}/`)}>{item.name}</a>)}</div></section>}
  </main><Footer /></>;
}
