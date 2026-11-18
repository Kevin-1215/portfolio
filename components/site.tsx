"use client";
import { useEffect, useId, useState } from "react";
import { api, apiEnabled, sitePath } from "@/lib/client";
export { sitePath } from "@/lib/client";
import { ArrowUpRight, ArrowLeft, Menu, X, UserRound } from "lucide-react";
import { cases } from "@/lib/cases";
import { FolioArtwork } from "./card-art";
import WorkflowArtwork from "./workflow-art";

export function Header({ inner = false }: { inner?: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { const close = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); }; document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close); }, []);
  return <header className="site-header consultant-header"><a href={sitePath("/")} className="wordmark" aria-label="Kevin 首頁">kevin<span>°</span></a><span className="header-role">AI & DIGITAL<br />TRANSFORMATION CONSULTANT</span><nav aria-label="主要導覽" className={open ? "main-nav is-open" : "main-nav"}>{[["main", "首頁"], ["about", "關於我"], ["services", "服務內容"], ["work", "參考案例"], ["contact", "聯絡資訊"]].map(([id, name]) => <a key={id} className={id === "contact" ? "contact-link" : undefined} href={`${inner ? sitePath("/") : ""}#${id}`} onClick={() => setOpen(false)}>{name}{id === "contact" && <ArrowUpRight size={15} />}</a>)}</nav><div className="header-actions"><button className="menu-toggle" aria-expanded={open} aria-label={open ? "關閉選單" : "開啟選單"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div></header>;
}
export function Footer() { return <footer className="site-footer consultant-footer"><a href={sitePath("/")} className="wordmark">kevin<span>°</span></a><p>把流程理清，讓技術落地。</p><div className="footer-experiences"><a href={sitePath("/?work=systems#work")}>網站與系統展示 ↗</a><a href={sitePath("/members/")}><UserRound size={12} />會員體驗</a></div><span>© {new Date().getFullYear()} KEVIN CHOU · TAIWAN</span><a href={sitePath("/#main")}>BACK TO TOP ↑</a></footer>; }
export function BackLink({ systems = true }: { systems?: boolean }) { return <a className="back-link" href={sitePath(systems ? "/?work=systems#work" : "/#work")}><ArrowLeft size={16} /> 回到參考案例</a>; }
export function Arrow({ size = 20 }: { size?: number }) { return <ArrowUpRight size={size} strokeWidth={1.4} aria-hidden="true" />; }
export function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) { return <p className="eyebrow"><span className="section-num">{n}</span>{children}</p>; }
export function Pottery({ shape = "vase", color = "chalk", className = "" }: { shape?: string; color?: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  const tones = color === "charcoal" ? ["#777871", "#41453e", "#292d28"] : color === "sand" ? ["#dfc8a8", "#bfa486", "#8d7760"] : ["#f2ede0", "#d0c7b5", "#aaa18d"];
  return <svg className={`pottery ${className}`} viewBox="0 0 500 440" role="img" aria-label={`${color === "charcoal" ? "炭灰" : color === "sand" ? "砂色" : "霧白"}手作陶器插畫`}><defs><linearGradient id={`${id}g`}><stop stopColor={tones[2]} /><stop offset=".24" stopColor={tones[0]} /><stop offset=".58" stopColor={tones[1]} /><stop offset="1" stopColor={tones[2]} /></linearGradient><filter id={`${id}s`} x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="10" /></filter><filter id={`${id}t`}><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" seed="4" result="noise" /><feComposite in="noise" in2="SourceGraphic" operator="in" /><feBlend in="SourceGraphic" mode="soft-light" /></filter></defs><ellipse cx="270" cy="368" rx="115" ry="12" fill="#554f3d" opacity=".22" filter={`url(#${id}s)`} /><g fill={`url(#${id}g)`} stroke={tones[2]} strokeWidth=".6">{shape === "bowl" ? <><path d="M120 249 Q128 360 250 367 Q373 360 380 249Z" /><ellipse cx="250" cy="249" rx="130" ry="31" fill={tones[2]} /><ellipse cx="250" cy="251" rx="120" ry="24" fill={tones[1]} /></> : shape === "round" ? <><path d="M211 168 L211 205 C117 214 104 353 209 366 H292 C397 350 379 214 290 205 V168Z" /><ellipse cx="250" cy="168" rx="39" ry="8" fill={tones[2]} /></> : shape === "cup" ? <><path d="M296 216 C390 196 394 331 305 321" fill="none" stroke={tones[2]} strokeWidth="19" /><path d="M163 207 L178 345 Q245 377 309 345 L323 207Z" /><ellipse cx="243" cy="207" rx="80" ry="18" fill={tones[2]} /><ellipse cx="243" cy="208" rx="71" ry="12" fill={tones[1]} /></> : <><path d="M224 107 C224 151 224 170 208 191 C195 210 163 231 164 272 L175 350 Q250 382 325 350 L336 272 C337 231 305 210 292 191 C276 170 276 151 276 107Z" /><ellipse cx="250" cy="107" rx="26" ry="6" fill={tones[2]} /><path d="M250 104 Q267 58 310 34 M267 73 Q243 54 245 26 M283 55 Q319 66 331 44" fill="none" stroke="#72715c" strokeWidth="2" /><ellipse cx="244" cy="34" rx="8" ry="17" fill="#7e8269" transform="rotate(-25 244 34)" /><ellipse cx="316" cy="40" rx="8" ry="19" fill="#8d9076" transform="rotate(46 316 40)" /></>}</g></svg>;
}
export const projectInfo = cases.map(project => ({ ...project, href: sitePath(`/work/${project.id}/`) }));
export function ProjectVisual({ id }: { id: string }) {
  if (id === "finance-operations" || id === "smart-operations" || id === "esg-platform" || id === "purchase-workflow") return <WorkflowArtwork id={id} />;
  if (id === "folio") return <div className="project-art folio-project-art"><FolioArtwork /></div>;
  if (id === "aura") return <div className="project-art aura-art"><img src={sitePath("/images/architecture.jpg")} alt="自然光穿過落地窗的現代生活空間" width="1600" height="1088" loading="lazy" /><div className="aura-art-top"><span>AURA</span><span>SPACES FOR LIVING.</span></div><span className="aura-art-bottom">The art of<br /><i>feeling at home.</i></span><span className="art-index">RESIDENCE — 001</span></div>;
  if (id === "objects") return <div className="project-art objects-art"><div className="objects-brand">日常之物 <small>OBJECTS OF EVERYDAY</small></div><Pottery /><span className="objects-title">Less, but<br /><i>closer to you.</i></span><span className="art-index">COLLECTION 01 / 土與形</span></div>;
  return <div className="project-art forma-art"><div className="forma-top">forma<span>YOUR SPACE TO CREATE.</span></div><div className="forma-orbit"><span /><span /><span /></div><div className="forma-member-card"><span>FORMA / MEMBERS CLUB</span><strong>A little space.<br />A world of ideas.</strong><div><span>CREATIVE MEMBER</span><span>001 ↗</span></div></div><span className="art-index">A COMMUNITY, THOUGHTFULLY CONNECTED.</span></div>;
}
export type Me = { user: { displayName: string; email: string } | null; profile: { name: string; newsletter: boolean } | null; favorites: string[]; orders: { id: string; total: number; createdAt: string; items: { name: string; quantity: number }[] }[] };
export function useMember() {
  const [me, setMe] = useState<Me | null>(null); const [error, setError] = useState("");
  const refresh = async () => { if(!apiEnabled){setMe({user:null,profile:null,favorites:[],orders:[]});return;}try { const data = await api<Me>("/api/me"); setMe(data); setError(""); } catch (e) { setError(e instanceof Error ? e.message : "無法讀取會員資料。"); } };
  useEffect(() => { void refresh(); }, []);
  return { me, error, refresh };
}
export async function post<T = { success: boolean }>(url: string, body: unknown): Promise<T> { return api<T>(url, body); }
