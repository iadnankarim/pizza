import { addDays, addMonths, format, subDays, subMonths } from "date-fns";
import { NOW } from "./seed";

/** Deterministic demo sales series (replace with an analytics endpoint) */
const wave = (i: number, base: number, amp: number) => Math.round(base + amp * Math.sin(i / 1.6) + (amp / 2) * Math.cos(i / 3.1) + ((i * 7919) % 13) * (amp / 20));

export type SalesPoint = { label: string; sales: number; orders: number };
export type SalesRange = "week" | "month" | "year";

export function salesSeries(range: SalesRange): SalesPoint[] {
  if (range === "year") {
    const start = subMonths(NOW, 11);
    return Array.from({ length: 12 }, (_, i) => {
      const sales = wave(i, 520000, 140000);
      return { label: format(addMonths(start, i), "MMM"), sales, orders: Math.round(sales / 980) };
    });
  }
  const days = range === "week" ? 7 : 30;
  const start = subDays(NOW, days - 1);
  return Array.from({ length: days }, (_, i) => {
    const sales = wave(i, 18000, 9000);
    return { label: format(addDays(start, i), "d MMM"), sales, orders: Math.round(sales / 950) };
  });
}

export const salesByCategory = [
  { category: "pizza", label: "Pizza", value: 4210000 },
  { category: "drinks", label: "Cold drinks", value: 980000 },
  { category: "sauces", label: "Sauces", value: 310000 },
];

export const salesByPayment = [
  { method: "card", label: "Card", value: 46 },
  { method: "upi", label: "UPI", value: 38 },
  { method: "cash", label: "Cash", value: 16 },
];
