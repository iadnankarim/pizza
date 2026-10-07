import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NotFound({ what, href, className }: { what: string; href: string; className?: string }) {
  return (
    <div className={cn("rounded-lg bg-white p-16 text-center", className)}>
      <p className="text-muted-foreground">{what} not found.</p>
      <Button asChild size="sm" className="mt-4">
        <Link href={href}>Go back</Link>
      </Button>
    </div>
  );
}
