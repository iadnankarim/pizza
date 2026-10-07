"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { PriceOption } from "@/types";
import { cn } from "@/lib/utils";

/** Figma: S / M / L round chips on Card/Pizza and 200ml / 300ml / 500ml pills on Card/Drinks */
export function OptionChips({
  options,
  value,
  onChange,
  size = "sm",
}: {
  options: PriceOption[];
  value: string;
  onChange: (v: string) => void;
  size?: "sm" | "md";
}) {
  if (options.length < 2) return null;
  const round = options.every((o) => o.label.length === 1);
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v)}
      className="gap-2"
      aria-label="Choose size"
    >
      {options.map((o) => (
        <ToggleGroupItem
          key={o.label}
          value={o.label}
          aria-label={o.label}
          className={cn(
            "bg-muted text-foreground/80 hover:bg-muted/70 data-[state=on]:bg-primary data-[state=on]:text-white",
            round ? (size === "md" ? "size-9 rounded-full" : "size-7 rounded-full text-xs") : "h-7 rounded-full px-3 text-xs"
          )}
        >
          {o.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
