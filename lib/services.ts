export const serviceNames = ["AI 顧問服務", "流程優化", "網站建置", "SEO 優化", "其他系統建置"] as const;
export type ServiceName = typeof serviceNames[number];

// Preserve earlier inquiry types when updating the public service offering.
export const inquiryServices = [...serviceNames, "其他合作", "品牌形象網站", "會員系統", "電子商務"] as const;

export const services: { title: ServiceName; english: string; description: string; deliverables: string; example?: string }[] = [
  {
    title: "AI 顧問服務", english: "AI advisory",
    description: "從企業真正需要解決的問題出發，評估 AI Automation、生成式 AI 助理與 AI OCR 的應用情境。透過需求訪談與資料條件盤點，整理導入順序、PoC 範圍與實作規格。",
    deliverables: "AI Automation 應用盤點 / 技術可行性與導入路徑 / PoC 範圍與驗收條件 / AI 應用工作坊",
    example: "smart-operations",
  },
  {
    title: "流程優化", english: "Process & AI automation",
    description: "從跨角色訪談、流程圖與 SOP 著手，找出重複輸入、人工追蹤與交接斷點，再規劃 AI Automation 的切入點。依工作性質結合 AI OCR、生成式 AI、RPA 或 API，讓辨識、資訊整理與後續執行接得起來。",
    deliverables: "現況盤點與訪談 / As-Is 與 To-Be 流程 / SOP 與權責整理 / AI Automation 導入建議",
    example: "finance-operations",
  },
  {
    title: "網站建置", english: "Web design & development",
    description: "從品牌與使用者的需求出發，整理網站內容、瀏覽路徑與操作流程。將視覺設計、響應式開發與部署放在同一個專案裡，讓網站兼顧表達與使用。",
    deliverables: "資訊架構與版面設計 / 響應式開發 / 會員與電商功能 / 部署與交接",
    example: "aura",
  },
  {
    title: "SEO 優化", english: "Technical SEO",
    description: "讓網站的內容更容易被搜尋引擎理解。檢查頁面結構、索引設定、標題與摘要、網站速度及行動版體驗，依網站現況整理可執行的改善項目。",
    deliverables: "技術 SEO 檢查 / 頁面與內容結構 / Metadata 與 Sitemap / 效能改善建議",
  },
  {
    title: "其他系統建置", english: "Systems & integration",
    description: "把 AI 應用接上實際工作。依現有工具與維護需求，規劃 AI 助理、內部管理系統、資料平台及 API 串接，並將權限、資料一致性與例外處理納入 AI Automation 方案。",
    deliverables: "需求分析與資料規劃 / 內部工具與管理介面 / API 與既有系統串接 / 操作交接",
    example: "esg-platform",
  },
];
