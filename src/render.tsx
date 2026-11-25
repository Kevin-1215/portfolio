import { renderToString } from "react-dom/server";
import App from "./app";
import { cases, caseTitle } from "../lib/cases";
export function render(path:string){return renderToString(<App path={path}/>);}
export const routes = [
  { path: "", title: "周靖翔 Kevin Chou｜AI Automation 與數位轉型顧問", description: "從流程盤點、流程優化與藍圖規劃，到 AI 應用評估與系統整合。周靖翔 Kevin Chou 提供 AI Automation、網站及內部系統建置，探索具體的顧問案例與可操作的網站展示。" },
  { path: "about", title: "關於我｜周靖翔 Kevin Chou", description: "了解 Kevin Chou 的 KPMG 管理顧問 Senior Consultant、精誠資訊開發及 InnoArk 共同創辦人經歷，以及流程盤點、流程優化、藍圖規劃與 AI Automation 能力。" },
  { path: "services", title: "服務內容｜AI 顧問、流程優化與網站建置", description: "查看 AI 顧問、流程優化、網站建置、SEO 優化及系統建置的服務範圍、可交付項目與相關案例。" },
  { path: "work", title: "參考案例｜企業流程、AI 與網站系統", description: "查看財務對帳、智慧營運、ESG AI OCR、ERP 檢核、證券開戶，以及網站與工具的工作內容與成果。" },
  { path: "contact", title: "聯絡資訊｜Kevin Chou 合作洽詢", description: "透過商務信箱或需求整理表單，討論 AI 應用、流程改善、網站與系統建置需求。" },
  { path: "members", title: "FORMA 會員體驗 · Kevin", description: "可操作的自主會員系統展示，支援雲端帳號、作品收藏、個人偏好與模擬訂單紀錄。" },
  { path: "shop", title: "日常之物 · 概念商店 · Kevin", description: "陶器選物概念商店，可操作商品分類與購物袋；展示商品不扣款、不出貨。" },
  ...cases.map(project => ({ path: `work/${project.id}`, title: `${caseTitle(project)} · Kevin Chou`, description: project.intro })),
  { path: "404", title: "找不到頁面 · Kevin", description: "回到周靖翔 Kevin Chou 的 AI Automation 與數位轉型顧問網站。" },
];
