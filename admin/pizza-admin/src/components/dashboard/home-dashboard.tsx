"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { ClipboardList, ShoppingBag, Wallet } from "lucide-react";

import { StatCard } from "./stat-card";
import { SalesChart } from "./sales-chart";
import { OrderStatusBadge } from "@/components/common/status-badge";
import { useAdmin } from "@/store/admin-store";
import { useAuth } from "@/store/auth-store";
import { formatPrice } from "@/lib/format";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export function HomeDashboard() {
  const admin = useAuth((s) => s.admin);
  const orders = useAdmin((s) => s.orders);

  const { totalSale, recent, topProducts } = useMemo(() => {
    const totalSale = orders.reduce((s, o) => s + o.amount, 0);
    const recent = [...orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt)).slice(0, 5);
    const byProduct = new Map<string, { name: string; image: string; qty: number; revenue: number }>();
    orders.forEach((o) =>
      o.items.forEach((it) => {
        const cur = byProduct.get(it.productId) ?? { name: it.name, image: it.image, qty: 0, revenue: 0 };
        cur.qty += it.qty;
        cur.revenue += it.qty * it.price;
        byProduct.set(it.productId, cur);
      })
    );
    const topProducts = [...byProduct.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 4);
    return { totalSale, recent, topProducts };
  }, [orders]);

  return (
    <div className="space-y-5">
      <h1 className="text-lg leading-snug font-medium">
        {greeting()}
        <br />
        {admin?.firstName} <span aria-hidden>😊</span>
      </h1>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr_minmax(0,1.15fr)]">
        <div className="space-y-5 xl:col-span-2">
          <div className="grid gap-5 sm:grid-cols-2">
            <StatCard label="Total orders" value={orders.length.toLocaleString("en-IN")} icon={ShoppingBag} tone="success" />
            <StatCard label="Total sale" value={formatPrice(totalSale)} icon={Wallet} tone="info" />
          </div>
          <SalesChart />
        </div>

        {/* Figma: Recent orders card */}
        <section className="rounded-lg bg-white p-5">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-md bg-primary/10 text-primary">
              <ClipboardList className="size-4" />
            </span>
            <h2 className="text-sm font-medium">Recent orders</h2>
          </div>
          <ul className="divide-y">
            {recent.map((o) => (
              <li key={o.id}>
                <Link href={`/orders/${o.id}`} className="flex items-center gap-3 rounded-md py-3 hover:bg-muted/50">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{o.customer.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{o.customer.address.split(",")[0]}</p>
                  </div>
                  <span className="text-sm font-medium tabular-nums">{formatPrice(o.amount)}</span>
                  <span className="w-24 text-right">
                    <OrderStatusBadge status={o.status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/orders" className="mt-3 inline-block border-b-2 border-primary text-xs font-medium">
            See all orders
          </Link>
        </section>
      </div>

      {/* Figma leaves this card empty – used for top selling products */}
      <section className="rounded-lg bg-white p-5">
        <h2 className="mb-4 text-sm font-medium">Top selling products</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topProducts.map((p, i) => (
            <div key={p.name} className="flex items-center gap-3 rounded-md border p-3">
              <Image src={p.image} alt="" width={48} height={48} className="size-12 object-contain" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  <span className="text-muted-foreground">#{i + 1}</span> {p.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {p.qty} sold · {formatPrice(p.revenue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
