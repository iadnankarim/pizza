"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { IndianRupee, Receipt, ShoppingBag, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thumb } from "@/components/common/thumb";
import { salesByCategory, salesByPayment, salesSeries, type SalesRange } from "@/data/sales";
import { useAdmin } from "@/store/admin-store";
import { formatPrice } from "@/lib/format";

const ordersConfig = { orders: { label: "Orders", color: "var(--chart-3)" } } satisfies ChartConfig;
const categoryConfig = {
  pizza: { label: "Pizza", color: "var(--chart-1)" },
  drinks: { label: "Cold drinks", color: "var(--chart-3)" },
  sauces: { label: "Sauces", color: "var(--chart-4)" },
} satisfies ChartConfig;
const paymentConfig = {
  card: { label: "Card", color: "var(--chart-1)" },
  upi: { label: "UPI", color: "var(--chart-2)" },
  cash: { label: "Cash", color: "var(--chart-5)" },
} satisfies ChartConfig;

/** Figma "Sales" frame is a wireframe – filled with KPIs, trend, breakdowns and top products */
export function SalesReport() {
  const [range, setRange] = useState<SalesRange>("month");
  const series = useMemo(() => salesSeries(range), [range]);
  const orders = useAdmin((s) => s.orders);

  const kpi = useMemo(() => {
    const revenue = series.reduce((s, p) => s + p.sales, 0);
    const count = series.reduce((s, p) => s + p.orders, 0);
    const half = Math.floor(series.length / 2);
    const first = series.slice(0, half).reduce((s, p) => s + p.sales, 0);
    const second = series.slice(half).reduce((s, p) => s + p.sales, 0);
    return { revenue, count, aov: revenue / Math.max(count, 1), growth: first ? ((second - first) / first) * 100 : 0 };
  }, [series]);

  const top = useMemo(() => {
    const map = new Map<string, { name: string; image: string; qty: number; revenue: number }>();
    orders.forEach((o) =>
      o.items.forEach((it) => {
        const cur = map.get(it.productId) ?? { name: it.name, image: it.image, qty: 0, revenue: 0 };
        cur.qty += it.qty;
        cur.revenue += it.qty * it.price;
        map.set(it.productId, cur);
      })
    );
    const list = [...map.values()].sort((a, b) => b.revenue - a.revenue);
    const total = list.reduce((s, p) => s + p.revenue, 0);
    return list.map((p) => ({ ...p, share: (p.revenue / total) * 100 }));
  }, [orders]);

  return (
    <>
      <PageHeader crumbs={[{ label: "Sales" }]}>
        <Tabs value={range} onValueChange={(v) => setRange(v as SalesRange)}>
          <TabsList className="bg-white">
            {(["week", "month", "year"] as const).map((r) => (
              <TabsTrigger key={r} value={r} className="capitalize data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none">
                This {r}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </PageHeader>

      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Revenue" value={formatPrice(kpi.revenue)} icon={IndianRupee} tone="primary" />
          <StatCard label="Orders" value={kpi.count.toLocaleString("en-IN")} icon={ShoppingBag} tone="success" />
          <StatCard label="Avg. order value" value={formatPrice(kpi.aov)} icon={Receipt} tone="info" />
          <StatCard label="Growth" value={`${kpi.growth >= 0 ? "+" : ""}${kpi.growth.toFixed(1)}%`} icon={TrendingUp} tone="warning" hint="2nd half vs 1st half of period" />
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <SalesChart key={range} defaultRange={range} />
          <section className="rounded-lg bg-white p-5">
            <h2 className="mb-4 text-sm font-medium">Orders</h2>
            <ChartContainer config={ordersConfig} className="aspect-auto h-64 w-full">
              <BarChart data={series} margin={{ left: 4, right: 8, top: 4 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
                <YAxis tickLine={false} axisLine={false} width={36} />
                <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent />} />
                <Bar dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </section>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <section className="rounded-lg bg-white p-5">
            <h2 className="mb-2 text-sm font-medium">Sales by category</h2>
            <ChartContainer config={categoryConfig} className="mx-auto aspect-square max-h-64">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="category" formatter={formatPrice} />} />
                <Pie data={salesByCategory} dataKey="value" nameKey="category" innerRadius={55} strokeWidth={4} stroke="var(--card)">
                  {salesByCategory.map((d) => <Cell key={d.category} fill={`var(--color-${d.category})`} />)}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="category" />} />
              </PieChart>
            </ChartContainer>
          </section>
          <section className="rounded-lg bg-white p-5">
            <h2 className="mb-2 text-sm font-medium">Payment methods</h2>
            <ChartContainer config={paymentConfig} className="mx-auto aspect-square max-h-64">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="method" formatter={(v) => `${v}%`} />} />
                <Pie data={salesByPayment} dataKey="value" nameKey="method" innerRadius={55} strokeWidth={4} stroke="var(--card)">
                  {salesByPayment.map((d) => <Cell key={d.method} fill={`var(--color-${d.method})`} />)}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="method" />} />
              </PieChart>
            </ChartContainer>
          </section>
          <section className="overflow-hidden rounded-lg bg-white">
            <h2 className="p-5 pb-3 text-sm font-medium">Top products</h2>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {top.slice(0, 5).map((p) => (
                  <TableRow key={p.name}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Thumb src={p.image} className="size-7" />
                        <div>
                          <p className="text-xs font-medium">{p.name}</p>
                          <div className="mt-1 h-1 w-20 rounded-full bg-muted">
                            <div className="h-1 rounded-full bg-primary" style={{ width: `${p.share}%` }} />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs">{p.qty}</TableCell>
                    <TableCell className="text-right text-xs font-medium">{formatPrice(p.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </div>
      </div>
    </>
  );
}
