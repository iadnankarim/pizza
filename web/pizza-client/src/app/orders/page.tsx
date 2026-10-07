"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, LayoutList, ShoppingBag, Table2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { OrderDetail, formatDate } from "@/components/order/order-detail";
import { OrdersTable } from "@/components/order/orders-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, Stars } from "@/components/order/status";
import { useOrders } from "@/store/order-store";
import { useMounted } from "@/hooks/use-mounted";
import { cn, formatPrice } from "@/lib/utils";

export default function OrdersPage() {
  const mounted = useMounted();
  const orders = useOrders((s) => s.orders);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"table" | "details">("table");
  const selected = orders.find((o) => o.id === selectedId) ?? orders[0];

  if (!mounted) return <div className="mx-auto my-10 h-96 max-w-6xl animate-pulse rounded-2xl bg-white" />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <ShoppingBag className="size-5" /> My orders <span className="text-muted-foreground">({orders.length})</span>
        </h1>
        {orders.length > 0 && (
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
            <TabsList className="bg-white">
              <TabsTrigger value="table" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none">
                <Table2 /> Table
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none">
                <LayoutList /> Details
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-white p-16 text-center">
          <p className="text-muted-foreground">No orders yet.</p>
          <Button asChild className="mt-4">
            <Link href="/#menu">Order your first pizza</Link>
          </Button>
        </div>
      ) : view === "table" ? (
        <OrdersTable orders={orders} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="h-fit rounded-2xl bg-white p-2">
            <p className="flex items-center gap-2 px-3 py-2 text-sm font-semibold">
              <ClipboardList className="size-4" /> Order history
            </p>
            <ul>
              {orders.map((o) => (
                <li key={o.id}>
                  <button
                    onClick={() => setSelectedId(o.id)}
                    className={cn(
                      "flex w-full items-start justify-between gap-3 border-l-2 border-transparent px-3 py-3 text-left hover:bg-muted/60",
                      selected?.id === o.id && "border-primary bg-primary/5"
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">#{o.id}</p>
                      <p className="text-sm">{formatPrice(o.total)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <StatusBadge status={o.status} />
                      <Stars value={o.rating} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <section className="rounded-2xl bg-white p-6">
            {selected && <OrderDetail order={selected} />}
            {selected && (
              <Button asChild variant="link" className="mt-4 px-0">
                <Link href={`/orders/${selected.id}`}>Open order page →</Link>
              </Button>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
