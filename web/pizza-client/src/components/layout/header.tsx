"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu as MenuIcon, Package, Phone, ShoppingBasket } from "lucide-react";

import { Logo } from "./logo";
import { CitySelect } from "./city-select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useCart, getTotals } from "@/store/cart-store";
import { useAuth } from "@/store/auth-store";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Menu" },
  { href: "/orders", label: "Orders" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const count = mounted ? getTotals(items, null).count : 0;

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Logo />
        <CitySelect />

        <nav className="ml-auto hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === n.href && "text-foreground"
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link href="/cart" className="relative ml-auto rounded-full p-2 hover:bg-muted md:ml-2" aria-label={`Cart, ${count} items`}>
          <ShoppingBasket className="size-5" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </Link>

        {mounted && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="hidden items-center gap-2 rounded-full py-1 pr-1 pl-3 text-sm font-medium hover:bg-muted md:flex">
              {user.name}
              <Avatar>
                <AvatarImage src="/images/avatar-2.png" alt="" />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => router.push("/orders")}>
                <Package /> My orders
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={logout}>
                <LogOut /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="secondary" size="sm" className="hidden md:inline-flex">
            <Link href="/login">Log in</Link>
          </Button>
        )}

        <a href="tel:+919800098998" className="hidden items-center gap-2 text-sm font-medium lg:flex">
          <Phone className="size-4 text-primary" /> +91 9800 098 998
        </a>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 px-4">
              {nav.map((n) => (
                <SheetClose asChild key={n.href}>
                  <Link href={n.href} className="rounded-md px-3 py-2 font-medium hover:bg-muted">
                    {n.label}
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Link href="/cart" className="rounded-md px-3 py-2 font-medium hover:bg-muted">
                  Cart ({count})
                </Link>
              </SheetClose>
              {mounted && user ? (
                <button onClick={logout} className="rounded-md px-3 py-2 text-left font-medium hover:bg-muted">
                  Log out ({user.name})
                </button>
              ) : (
                <SheetClose asChild>
                  <Link href="/login" className="rounded-md px-3 py-2 font-medium hover:bg-muted">
                    Log in
                  </Link>
                </SheetClose>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
