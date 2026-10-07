import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Figma: "Total orders 28" / "Total sale ₹50 000" tiles */
export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  hint,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "primary" | "success" | "info" | "warning";
  hint?: string;
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    info: "bg-info/10 text-info",
    warning: "bg-warning/10 text-warning",
  };
  return (
    <div className="rounded-lg bg-white p-5">
      <div className="flex items-center gap-2.5">
        <span className={cn("grid size-7 place-items-center rounded-md", tones[tone])}>
          <Icon className="size-4" />
        </span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-3 text-3xl font-medium tracking-tight tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
