const studies = {
  "finance-operations": { code: "01 / FINANCE OPERATIONS", title: <>Clearer<br /><i>flows.</i></>, steps: ["理解現況", "流程重整", "自動化落地"], label: "財務流程示意：理解現況、流程重整、自動化落地", caption: "FROM COMPLEXITY, TO A CLEAR WAY FORWARD." },
  "smart-operations": { code: "02 / INTELLIGENT OPERATIONS", title: <>Ideas,<br /><i>at work.</i></>, steps: ["營運目標", "資料整合", "AI 應用"], label: "智慧營運示意：營運目標、資料整合、AI 應用", caption: "STRATEGY, CONNECTED TO EVERYDAY WORK." },
  "esg-platform": { code: "03 / CONNECTED INFORMATION", title: <>Shared<br /><i>data.</i></>, steps: ["分散來源", "資料標準", "集中管理"], label: "跨據點資料示意：分散來源、資料標準、集中管理", caption: "MANY SOURCES. ONE CONSIDERED STRUCTURE." },
  "purchase-workflow": { code: "04 / WORKFLOW ARCHITECTURE", title: <>A clear<br /><i>brief.</i></>, steps: ["需求釐清", "條件與例外", "建置規格"], label: "採購流程規格示意：需求釐清、條件與例外、建置規格", caption: "A SPECIFICATION, READY FOR A CONVERSATION." },
};
export type WorkflowId = keyof typeof studies;

export default function WorkflowArtwork({ id, hero = false }: { id: WorkflowId; hero?: boolean }) {
  const study = studies[id];
  return <div className={`project-art workflow-art workflow-${id} ${hero ? "workflow-hero" : ""}`} role="img" aria-label={study.label}>
    <div className="workflow-art-top"><span>{study.code}</span><span>流程示意 / STUDY</span></div>
    <div className="workflow-art-body">
      <div className="workflow-art-title">{study.title}<span className="workflow-rule" /></div>
      <div className="workflow-track">{study.steps.map((step, i) => <div className="workflow-node" key={step}><span className="workflow-number">0{i + 1}</span><span>{step}</span><span className="workflow-node-mark" aria-hidden="true">{i === 2 ? "↗" : "+"}</span></div>)}</div>
    </div>
    <div className="workflow-art-bottom"><span>{study.caption}</span><span>KEVIN CHOU ↗</span></div>
  </div>;
}
