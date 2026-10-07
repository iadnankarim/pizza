"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderDetail } from "@/components/order/order-detail";
import { useOrders } from "@/store/order-store";
import { useMounted } from "@/hooks/use-mounted";

export function SingleOrder({ id }: { id: string }) {
  const mounted = useMounted();
  const order = useOrders((s) => s.orders.find((o) => o.id === id));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/orders">
          <ArrowLeft /> All orders
        </Link>
      </Button>
      <div className="rounded-2xl bg-white p-6">
        {!mounted ? (
          <div className="h-80 animate-pulse" />
        ) : order ? (
          <OrderDetail order={order} />
        ) : (
          <p className="py-16 text-center text-muted-foreground">Order not found.</p>
        )}
      </div>
    </div>
  );
}
