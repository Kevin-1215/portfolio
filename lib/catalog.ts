export const products = [
  { id: "vase-01", name: "弧線花器", en: "Arc vessel", price: 1680, category: "陶作", shape: "vase", color: "chalk", note: "霧白陶土・高 24 cm" },
  { id: "bowl-01", name: "日常淺缽", en: "Everyday bowl", price: 980, category: "陶作", shape: "bowl", color: "sand", note: "砂色陶土・直徑 18 cm" },
  { id: "vase-02", name: "靜石花器", en: "Still vessel", price: 2280, category: "花器", shape: "round", color: "charcoal", note: "炭灰陶土・高 18 cm" },
  { id: "cup-01", name: "晨光杯", en: "Morning cup", price: 780, category: "日用", shape: "cup", color: "chalk", note: "霧白陶土・容量 280 ml" },
];
export type CartLine = { id: string; quantity: number };
export function price(value: number) { return `NT$${new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 }).format(value)}`; }
export function calculateOrder(lines: CartLine[]) {
  if (!Array.isArray(lines) || lines.length < 1 || lines.length > 12) throw new Error("請選擇 1 至 12 項商品。");
  const quantities = new Map<string, number>();
  for (const line of lines) {
    if (!line || typeof line.id !== "string" || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 10 || !products.some(p => p.id === line.id)) throw new Error("商品或數量無效。");
    const qty = (quantities.get(line.id) || 0) + line.quantity;
    if (qty > 10) throw new Error("每項商品最多可選購 10 件。");
    quantities.set(line.id, qty);
  }
  const items = [...quantities].map(([id, quantity]) => { const p = products.find(p => p.id === id)!; return { id, name: p.name, unitPrice: p.price, quantity }; });
  const subtotal = items.reduce((sum, p) => sum + p.unitPrice * p.quantity, 0);
  const shipping = subtotal >= 3000 ? 0 : 120;
  return { items, subtotal, shipping, total: subtotal + shipping };
}
