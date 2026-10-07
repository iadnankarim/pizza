"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

/** shadcn/ui chart – thin wrapper around Recharts that wires colors through CSS variables */
export type ChartConfig = Record<string, { label?: React.ReactNode; color?: string }>;

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used within a <ChartContainer />");
  return ctx;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}) {
  const uid = React.useId();
  const chartId = `chart-${id ?? uid.replace(/:/g, "")}`;
  const style = Object.fromEntries(
    Object.entries(config)
      .filter(([, v]) => v.color)
      .map(([k, v]) => [`--color-${k}`, v.color])
  ) as React.CSSProperties;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        style={style}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-layer]:outline-hidden [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip;

type TooltipItem = { dataKey?: string | number; name?: string | number; value?: number | string; color?: string; payload?: Record<string, unknown> };

function ChartTooltipContent({
  active,
  payload,
  label,
  formatter,
  nameKey,
  className,
}: {
  nameKey?: string;
  active?: boolean;
  payload?: TooltipItem[];
  label?: React.ReactNode;
  formatter?: (value: number) => React.ReactNode;
  className?: string;
}) {
  const { config } = useChart();
  if (!active || !payload?.length) return null;
  return (
    <div className={cn("grid min-w-32 gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl", className)}>
      {label != null && <div className="font-medium">{label}</div>}
      {payload.map((item) => {
        const key = String(nameKey ? item.payload?.[nameKey] : (item.dataKey ?? item.name));
        const color = (item.payload?.fill as string | undefined) ?? item.color ?? `var(--color-${key})`;
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-[2px]" style={{ background: color }} />
            <span className="text-muted-foreground">{config[key]?.label ?? key}</span>
            <span className="ml-auto font-mono font-medium tabular-nums">
              {formatter ? formatter(Number(item.value)) : Number(item.value).toLocaleString("en-IN")}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  payload,
  nameKey,
  className,
}: {
  payload?: readonly { dataKey?: unknown; value?: unknown; color?: string; payload?: unknown }[];
  nameKey?: string;
  className?: string;
}) {
  const { config } = useChart();
  if (!payload?.length) return null;
  return (
    <div className={cn("flex items-center justify-center gap-4 pt-3", className)}>
      {payload.map((item) => {
        const key = String(nameKey ? (item.payload as Record<string, unknown> | undefined)?.[nameKey] : (item.dataKey ?? item.value));
        return (
          <div key={key} className="flex items-center gap-1.5">
            <span className="size-2 shrink-0 rounded-[2px]" style={{ background: item.color }} />
            {config[key]?.label ?? key}
          </div>
        );
      })}
    </div>
  );
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent };
