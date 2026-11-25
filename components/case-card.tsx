import { caseTitle, type CaseStudyData } from "@/lib/cases";
import { ProjectVisual, sitePath } from "./site";
import ProjectDiagram from "./project-diagram";

export default function CaseCard({ project }: { project: CaseStudyData }) {
  const href = sitePath(`/work/${project.id}/`);
  const result = project.results?.[0];
  return <article className={`case-list-card ${project.group ? "case-list-card--project" : "case-list-card--system"}`}>
    {project.group && <ProjectDiagram id={project.id} compact />}
    {!project.group && <a className="case-list-thumb" href={href} aria-label={`查看${caseTitle(project)}`}><ProjectVisual id={project.id} /></a>}
    <div className="case-list-copy">
      <p className="case-list-category">{project.industry || project.type}</p>
      <h2><a href={href}>{caseTitle(project)}</a></h2>
      <p className="case-list-description">{project.intro}</p>
      {result && <p className="case-list-result">{result.value && <strong>{result.value}</strong>}<span>{result.title}</span></p>}
      <a className="case-list-open" href={href}>查看完整案例<span className="sr-only">：{caseTitle(project)}</span></a>
    </div>
  </article>;
}
