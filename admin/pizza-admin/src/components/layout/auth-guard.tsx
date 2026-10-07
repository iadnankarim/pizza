"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/store/auth-store";
import { useMounted } from "@/hooks/use-mounted";
import { Skeleton } from "@/components/ui/skeleton";

/** Client-side guard for the mock auth. Replace with middleware/proxy once a real API exists. */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();
  const admin = useAuth((s) => s.admin);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (mounted && !admin) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [mounted, admin, router, pathname]);

  if (!mounted || !admin) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }
  return <>{children}</>;
}
