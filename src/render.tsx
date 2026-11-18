import { renderToString } from "react-dom/server";
import App from "./app";
import { cases } from "../lib/cases";
export function render(path:string){return renderToString(<App path={path}/>);}
export const routes = [
  { path: "", title: "周靖翔 Kevin Chou｜AI 與數位轉型顧問", description: "從流程診斷、方案規劃，到系統實作。周靖翔 Kevin Chou 提供 AI 顧問服務、流程優化、網站建置、SEO 優化與系統整合，探索顧問經歷與可操作的網站案例。" },
  { path: "members", title: "FORMA 會員體驗 · Kevin", description: "可操作的自主會員系統展示，支援雲端帳號、作品收藏、個人偏好與模擬訂單紀錄。" },
  { path: "shop", title: "日常之物 · 概念商店 · Kevin", description: "陶器選物概念商店，可操作商品分類與購物袋；展示商品不扣款、不出貨。" },
  ...cases.map(project => ({ path: `work/${project.id}`, title: `${project.name} · ${project.type}案例 · Kevin`, description: project.intro })),
  { path: "404", title: "找不到頁面 · Kevin", description: "回到周靖翔 Kevin Chou 的 AI 與數位轉型顧問網站。" },
];
