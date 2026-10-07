import Link from "next/link";
import { cn } from "@/lib/utils";

/** Figma: orange ring + "PIZZA" word mark */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-sm font-bold tracking-wide", className)} aria-label="Pizza admin home">
      <span className="grid size-5 place-items-center rounded-full border-[3px] border-primary">
        <span className="size-1.5 rounded-full bg-primary" />
      </span>
      PIZZA
    </Link>
  );
}
