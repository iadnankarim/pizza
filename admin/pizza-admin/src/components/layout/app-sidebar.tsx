"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "./logo";
import { footerNav, mainNav } from "./nav";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function NavLink({ href, label, icon: Icon, onNavigate }: (typeof mainNav)[number] & { onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-r-md py-2 pr-3 pl-5 text-sm text-sidebar-foreground transition-colors hover:bg-muted",
        active && "bg-sidebar-accent font-medium text-sidebar-accent-foreground hover:bg-sidebar-accent",
        active && "before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-primary"
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}

/** Figma: fixed white sidebar, active item = light coral bg + left bar */
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar pb-4">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 pt-2 pr-3" aria-label="Main">
        {mainNav.map((item) => (
          <NavLink key={item.href} {...item} onNavigate={onNavigate} />
        ))}
      </nav>
      <div className="pr-3">
        <Separator className="mx-5 mb-3 w-auto" />
        {footerNav.map((item) => (
          <NavLink key={item.href} {...item} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 border-r border-sidebar-border lg:block">
      <SidebarContent />
    </aside>
  );
}
