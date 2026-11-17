import { forwardRef, useId } from "react";
export const cardPalettes = [
  { name: "墨綠", paper: "#344337", ink: "#ecebdc", accent: "#b8c3aa" },
  { name: "暖白", paper: "#eee9dc", ink: "#383c33", accent: "#748367" },
  { name: "深藍", paper: "#273644", ink: "#f0eadd", accent: "#c9b79c" },
];
export const BusinessCard = forwardRef<SVGSVGElement, { brand?: string; palette?: number; back?: boolean; wire?: boolean; guides?: boolean }>(function BusinessCard({ brand = "KEVIN", palette = 0, back = false, wire = false, guides = false }, ref) {
  const p = cardPalettes[palette] || cardPalettes[0]; const id = useId().replace(/:/g, "");
  return <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 330" role="img" aria-label={wire ? "名片資訊結構線稿" : `${p.name}名片${back ? "背面" : "正面"}：${brand || "YOUR STUDIO"}`}>
    <defs><pattern id={`${id}grid`} width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke={wire ? "#b0b6a5" : p.ink} strokeWidth=".5" opacity=".35" /></pattern></defs>
    <rect x="10" y="10" width="520" height="310" rx="2" fill={wire ? "#eeeee4" : p.paper} stroke={wire ? "#a8b19c" : p.paper} />
    {(wire || guides) && <rect x="10" y="10" width="520" height="310" fill={`url(#${id}grid)`} />}
    {wire ? <g fill="none" stroke="#7f8b73" strokeWidth="1"><rect x="47" y="46" width="32" height="32" /><path d="M47 46l32 32M79 46L47 78" /><rect x="47" y="138" width="280" height="45" /><path d="M47 203h170M47 253h75M47 265h130M439 46h54M493 46v54" /><text x="48" y="125" fill="#53604b" stroke="none" fontSize="9" fontFamily="Arial,sans-serif" letterSpacing="2">BRAND / PRIMARY INFORMATION</text><text x="48" y="294" fill="#53604b" stroke="none" fontSize="8" fontFamily="Arial,sans-serif" letterSpacing="1.5">STRUCTURE BEFORE DECORATION.</text></g> : <g fill={p.ink}>
      <path d="M47 48v29h5V63l14 14h7L57 61l15-13h-7L52 60V48z" fill={p.accent} /><circle cx="78" cy="49" r="3" fill={p.accent} />
      {back ? <><text x="48" y="154" fontSize="31" fontFamily="Arial,sans-serif" letterSpacing="-1">Kevin</text><text x="48" y="182" fontSize="10" fontFamily="Arial,sans-serif" fill={p.accent} letterSpacing="1.4">INDEPENDENT DESIGN &amp; DEVELOPMENT</text><path d="M48 218H492" stroke={p.accent} opacity=".5" /><text x="48" y="252" fontSize="13" fontFamily="Arial,sans-serif">kevinchou@innodanc.com</text><text x="48" y="282" fontSize="9" fill={p.accent} fontFamily="Arial,sans-serif" letterSpacing="1">TAIWAN / OPEN FOR COLLABORATIONS</text></> : <><text x="48" y="181" fontFamily="Georgia,'Microsoft JhengHei',serif" fontStyle="italic" fontSize={brand.length > 15 ? "30" : "49"} letterSpacing="-1.8" textLength={brand.length > 21 ? 420 : undefined} lengthAdjust="spacingAndGlyphs">{brand || "YOUR STUDIO"}</text><text x="49" y="208" fontFamily="Arial,sans-serif" fontSize="9" letterSpacing="2.5" fill={p.accent}>DESIGN WITH INTENT. BUILD WITH CARE.</text><path d="M48 274h60M466 47h27v27" fill="none" stroke={p.accent} /><text x="492" y="282" textAnchor="end" fontSize="8" fill={p.accent} fontFamily="Arial,sans-serif" letterSpacing="2">01 / IDENTITY</text></>}
    </g>}
    {guides && !wire && <rect x="35" y="35" width="470" height="260" stroke={p.accent} strokeWidth="1" fill="none" strokeDasharray="4 6" opacity=".55" />}
  </svg>;
});
export function FolioArtwork({ hero = false }: { hero?: boolean }) { return <div className={`folio-art ${hero ? "folio-art-hero" : ""}`}><div className="folio-art-heading"><span>folio<span className="folio-period">.</span></span><small>AN IDENTITY, IN YOUR HANDS.</small></div><div className="folio-art-grid" aria-hidden="true" /><div className="folio-card-back"><BusinessCard palette={1} back /></div><div className="folio-card-front"><BusinessCard palette={2} /></div><div className="folio-art-caption"><span>EDIT. PREVIEW. MAKE IT YOURS.</span><span>LIVE TOOL ↗</span></div></div>; }
