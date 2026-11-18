export const serviceNames = ["AI 顧問服務", "流程優化", "網站建置", "SEO 優化", "其他系統建置"] as const;
export type ServiceName = typeof serviceNames[number];

// Preserve earlier inquiry types when updating the public service offering.
export const inquiryServices = [...serviceNames, "其他合作", "品牌形象網站", "會員系統", "電子商務"] as const;

export const services: { title: ServiceName; english: string; description: string; deliverables: string; example?: string }[] = [
  {
    title: "AI 顧問服務", english: "AI advisory",
    description: "想導入 AI，先從值得解決的問題開始。透過需求訪談與現況評估，整理適合的應用情境、資料條件與導入順序，並把構想轉成可討論、可實作的規格。",
    deliverables: "應用情境與可行性評估 / 導入路徑 / PoC 範圍與驗收條件 / 團隊工作坊",
    example: "smart-operations",
  },
  {
    title: "流程優化", english: "Process improvement",
    description: "當工作仰賴人工追蹤、重複輸入或口頭交接，先把現況理清。從跨角色訪談、流程圖與 SOP 著手，找到資訊斷點，再評估 RPA、OCR 與系統整合的切入點。",
    deliverables: "現況盤點與訪談 / As-Is 與 To-Be 流程 / SOP 與權責整理 / 自動化建議",
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
    description: "把分散的資料與操作接起來。依現有工具與維護需求，規劃內部管理系統、資料平台、報表及 API 串接，並把權限、資料一致性與例外處理納入設計。",
    deliverables: "需求分析與資料規劃 / 內部工具與管理介面 / API 與既有系統串接 / 操作交接",
    example: "esg-platform",
  },
];
