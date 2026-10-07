"use client";

import { Minus, Plus } from "lucide-react";

export function QtyStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="inline-flex h-8 items-center rounded-full border bg-white">
      <button type="button" onClick={() => onChange(value - 1)} className="grid size-8 place-items-center rounded-full hover:bg-muted" aria-label="Decrease quantity">
        <Minus className="size-3.5" />
      </button>
      <span className="w-6 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" onClick={() => onChange(value + 1)} className="grid size-8 place-items-center rounded-full hover:bg-muted" aria-label="Increase quantity">
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
