"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, MapPin, Menu, Settings, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { SidebarContent } from "./app-sidebar";
import { Logo } from "./logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/store/auth-store";
import { useAdmin } from "@/store/admin-store";
import { formatPrice, initials } from "@/lib/format";

export function Topbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const admin = useAuth((s) => s.admin);
  const logout = useAuth((s) => s.logout);
  const orders = useAdmin((s) => s.orders);
  const newOrders = useMemo(() => orders.filter((o) => o.status === "received" || o.status === "preparing"), [orders]);
  const name = admin ? `${admin.firstName} ${admin.lastName}` : "";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-white px-4 sm:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <Logo className="lg:hidden" />

      {/* Figma: restaurant location pill */}
      <span className="hidden items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground sm:inline-flex">
        <MapPin className="size-3" /> {admin?.restaurant ?? "Bandra, Mumbai"}
      </span>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications, ${newOrders.length} new`}>
              <Bell />
              {newOrders.length > 0 && <span className="absolute top-2 right-2 size-2 rounded-full bg-primary ring-2 ring-white" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>New orders ({newOrders.length})</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {newOrders.length === 0 && <p className="px-2 py-4 text-center text-sm text-muted-foreground">You&apos;re all caught up</p>}
            {newOrders.slice(0, 5).map((o) => (
              <DropdownMenuItem key={o.id} onSelect={() => router.push(`/orders/${o.id}`)} className="flex-col items-start gap-0.5">
                <span className="text-sm font-medium">
                  #{o.id} · {o.customer.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatPrice(o.amount)} · {formatDistanceToNow(new Date(o.placedAt), { addSuffix: true })}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-full p-0.5 pr-1 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="size-8">
              {admin?.avatar && <AvatarImage src={admin.avatar} alt="" />}
              <AvatarFallback className="text-xs">{initials(name || "A")}</AvatarFallback>
            </Avatar>
            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">{name}</p>
              <p className="truncate text-xs font-normal text-muted-foreground">{admin?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                logout();
                router.replace("/login");
              }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
