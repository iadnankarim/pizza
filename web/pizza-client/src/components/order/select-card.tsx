import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/** Selectable card used for Address / Restaurant / Payment type (Figma: Checkout form) */
export function SelectCard({
  selected,
  onClick,
  className,
  children,
}: {
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={!!selected}
      onClick={onClick}
      className={cn(
        "relative rounded-xl border bg-white p-4 text-left text-sm transition-colors hover:border-primary/50",
        selected && "border-primary ring-1 ring-primary",
        className
      )}
    >
      {selected && <CircleCheck className="absolute top-2.5 right-2.5 size-4 text-primary" />}
      {children}
    </button>
  );
}
