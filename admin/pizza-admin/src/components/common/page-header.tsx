import Link from "next/link";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type Crumb = { label: string; href?: string };

/** Figma: "Dashboard > Products > Create" breadcrumb row with optional actions on the right */
export function PageHeader({ crumbs, children }: { crumbs: Crumb[]; children?: React.ReactNode }) {
  const all: Crumb[] = [{ label: "Dashboard", href: "/" }, ...crumbs];
  return (
    <div className="mb-5 flex min-h-9 flex-wrap items-center justify-between gap-3">
      <Breadcrumb>
        <BreadcrumbList>
          {all.map((c, i) => (
            <Fragment key={c.label + i}>
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {c.href && i < all.length - 1 ? (
                  <BreadcrumbLink asChild>
                    <Link href={c.href}>{c.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{c.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
