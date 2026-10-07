import { Check, ChefHat, ClipboardCheck, Bike, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

export const statusMeta: Record<OrderStatus, { label: string; variant: "warning" | "success" | "secondary" }> = {
  received: { label: "Received", variant: "secondary" },
  preparing: { label: "Preparing", variant: "warning" },
  out_for_delivery: { label: "Out for delivery", variant: "warning" },
  delivered: { label: "Delivered", variant: "success" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const m = statusMeta[status];
  return (
    <Badge variant={m.variant}>
      {status === "delivered" && <Check />} {m.label}
    </Badge>
  );
}

const steps: { key: OrderStatus; label: string; icon: typeof Check }[] = [
  { key: "received", label: "Received", icon: ClipboardCheck },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "out_for_delivery", label: "On the way", icon: Bike },
  { key: "delivered", label: "Delivered", icon: Check },
];

export function StatusTracker({ status }: { status: OrderStatus }) {
  const current = steps.findIndex((s) => s.key === status);
  return (
    <ol className="grid grid-cols-4 gap-2">
      {steps.map((s, i) => {
        const done = i <= current;
        const Icon = s.icon;
        return (
          <li key={s.key} className="relative flex flex-col items-center gap-2 text-center">
            {i > 0 && <span className={cn("absolute top-5 right-1/2 h-0.5 w-full -translate-y-1/2", i <= current ? "bg-primary" : "bg-border")} />}
            <span className={cn("relative z-10 grid size-10 place-items-center rounded-full border-2 bg-white", done ? "border-primary text-primary" : "border-border text-muted-foreground")}>
              <Icon className="size-4" />
            </span>
            <span className={cn("text-xs", done ? "font-medium" : "text-muted-foreground")}>{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function Stars({ value, onChange, size = "sm" }: { value?: number; onChange?: (v: number) => void; size?: "sm" | "md" }) {
  return (
    <div className="flex gap-0.5" aria-label={`Rating ${value ?? 0} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = <Star className={cn(size === "sm" ? "size-3" : "size-5", n <= (value ?? 0) ? "fill-success text-success" : "text-neutral-300")} />;
        return onChange ? (
          <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} star`}>
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </div>
  );
}
