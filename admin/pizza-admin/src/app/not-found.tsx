import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="text-5xl font-bold text-primary">404</p>
        <p className="mt-2 text-muted-foreground">This page doesn&apos;t exist.</p>
        <Button asChild size="sm" className="mt-5"><Link href="/">Go to dashboard</Link></Button>
      </div>
    </div>
  );
}
