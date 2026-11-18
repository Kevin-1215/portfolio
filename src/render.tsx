import { renderToString } from "react-dom/server";
import App from "./app";
import { cases, caseTitle } from "../lib/cases";
export function render(path:string){return renderToString(<App path={path}/>);}
export const routes = [
  { path: "", title: "周靖翔 Kevin Chou｜AI Automation 與數位轉型顧問", description: "從 AI 應用評估到系統整合。周靖翔 Kevin Chou 提供 AI Automation、生成式 AI 應用、流程優化、網站建置與系統整合，探索具體的顧問案例與可操作的網站展示。" },
  { path: "members", title: "FORMA 會員體驗 · Kevin", description: "可操作的自主會員系統展示，支援雲端帳號、作品收藏、個人偏好與模擬訂單紀錄。" },
  { path: "shop", title: "日常之物 · 概念商店 · Kevin", description: "陶器選物概念商店，可操作商品分類與購物袋；展示商品不扣款、不出貨。" },
  ...cases.map(project => ({ path: `work/${project.id}`, title: `${caseTitle(project)} · Kevin Chou`, description: project.intro })),
  { path: "404", title: "找不到頁面 · Kevin", description: "回到周靖翔 Kevin Chou 的 AI Automation 與數位轉型顧問網站。" },
];
