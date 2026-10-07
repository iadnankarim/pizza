"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { BarChart3 } from "lucide-react";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { salesSeries, type SalesRange } from "@/data/sales";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const config = { sales: { label: "Sales", color: "var(--chart-1)" } } satisfies ChartConfig;

const compact = (v: number) => `₹${v >= 100000 ? `${(v / 100000).toFixed(1)}L` : `${Math.round(v / 1000)}k`}`;

/** Figma: "Sales" card with W / M / Y toggle and a smooth coral line */
export function SalesChart({ className, defaultRange = "month", height = "h-64" }: { className?: string; defaultRange?: SalesRange; height?: string }) {
  const [range, setRange] = useState<SalesRange>(defaultRange);
  const data = useMemo(() => salesSeries(range), [range]);

  return (
    <div className={cn("rounded-lg bg-white p-5", className)}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-md bg-info/10 text-info">
            <BarChart3 className="size-4" />
          </span>
          <h2 className="text-sm font-medium">Sales</h2>
        </div>
        <ToggleGroup type="single" value={range} onValueChange={(v) => v && setRange(v as SalesRange)} aria-label="Sales range" className="gap-1.5">
          {(["week", "month", "year"] as const).map((r) => (
            <ToggleGroupItem
              key={r}
              value={r}
              aria-label={r}
              className="size-7 rounded-full bg-muted p-0 text-[11px] font-semibold uppercase data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {r[0]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <ChartContainer config={config} className={cn("aspect-auto w-full", height)}>
        <AreaChart data={data} margin={{ left: 4, right: 8, top: 4 }}>
          <defs>
            <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-sales)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--color-sales)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
          <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={compact} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={formatPrice} />} />
          <Area dataKey="sales" type="monotone" stroke="var(--color-sales)" strokeWidth={2} fill="url(#fillSales)" />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
