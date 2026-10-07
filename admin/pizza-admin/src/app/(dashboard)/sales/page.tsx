import type { Metadata } from "next";
import { SalesReport } from "@/components/sales/sales-report";

export const metadata: Metadata = { title: "Sales" };

export default function SalesPage() {
  return <SalesReport />;
}
