import type { CaseId } from "@/lib/cases";

type Diagram = {
  title: string;
  before: string;
  after: string;
  steps: { title: string; detail: string }[];
};

const diagrams: Partial<Record<CaseId, Diagram>> = {
  "finance-operations": {
    title: "財務對帳流程",
    before: "文件分散，人工核對與交接",
    after: "統一規則，由 UiPath 自動執行",
    steps: [
      { title: "訪談與盤點", detail: "整理財務文件與實際作業" },
      { title: "規則與 SOP", detail: "釐清對帳、沖銷及交接方式" },
      { title: "UiPath 自動化", detail: "執行重複作業並交接操作" },
    ],
  },
  "smart-operations": {
    title: "營運資料與 AI 分析",
    before: "生產、良率與碳排資料分別查看",
    after: "集中管理，以 AI 協助營運分析",
    steps: [
      { title: "資料整合", detail: "串起生產、良率與碳排資訊" },
      { title: "營運儀表板", detail: "集中呈現即時營運資訊" },
      { title: "Gemini AI 助理", detail: "協助觀察績效與分析異常" },
    ],
  },
  "esg-platform": {
    title: "ESG 帳單資料流程",
    before: "據點表單不一，人工蒐集憑證",
    after: "統一資料，以 AI OCR 擷取帳單",
    steps: [
      { title: "帳單與表單", detail: "盤點據點作業並統一資料格式" },
      { title: "AI OCR 擷取", detail: "辨識公用事業帳單內容" },
      { title: "平台與報告", detail: "銜接集中管理、計算與報告" },
    ],
  },
};

export default function ProjectDiagram({ id, compact = false }: { id: CaseId; compact?: boolean }) {
  const diagram = diagrams[id];
  if (!diagram) return null;
  return <figure className={`project-diagram ${compact ? "project-diagram--compact" : "project-diagram--full"}`}>
    <figcaption><span>{diagram.title}</span><span>流程示意</span></figcaption>
    <dl className="diagram-comparison">
      <div className="diagram-before"><dt>原作業</dt><dd>{diagram.before}</dd></div>
      <div className="diagram-after"><dt>改善後</dt><dd>{diagram.after}</dd></div>
    </dl>
    <ol className="diagram-flow" role="list">{diagram.steps.map(step => <li key={step.title}><strong>{step.title}</strong>{!compact && <span>{step.detail}</span>}</li>)}</ol>
  </figure>;
}
