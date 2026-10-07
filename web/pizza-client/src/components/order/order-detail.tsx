"use client";

import Image from "next/image";
import { MapPin, Store, Wallet } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { StatusBadge, StatusTracker, Stars } from "./status";
import { itemMeta } from "@/components/cart/item-meta";
import { useOrders } from "@/store/order-store";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export function OrderDetail({ order }: { order: Order }) {
  const rate = useOrders((s) => s.rate);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold break-all">Order #{order.id}</h2>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <StatusTracker status={order.status} />

      <ul className="divide-y rounded-xl border">
        {order.items.map((i) => (
          <li key={i.key} className="flex items-center gap-4 p-3">
            <div className="relative size-14 shrink-0">
              <Image src={i.image} alt={i.name} fill sizes="56px" className="object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">
                {i.name} <span className="text-muted-foreground">× {i.qty}</span>
              </p>
              <p className="truncate text-xs text-muted-foreground">{itemMeta(i)}</p>
            </div>
            <span className="font-medium">{formatPrice(i.unitPrice * i.qty)}</span>
          </li>
        ))}
      </ul>

      <div className="grid gap-4 text-sm sm:grid-cols-3">
        <Info icon={MapPin} title="Delivery address" text={`${order.address.name}, ${order.address.line}`} />
        <Info icon={Store} title="Restaurant" text={order.restaurant} />
        <Info icon={Wallet} title="Payment" text={order.paymentType === "cod" ? "Cash on delivery" : "Paid online"} />
      </div>

      <dl className="space-y-2 rounded-xl bg-muted/60 p-4 text-sm">
        <Line label="Subtotal" value={formatPrice(order.subtotal)} />
        {order.discount > 0 && <Line label="Discount" value={`-${formatPrice(order.discount)}`} />}
        <Line label="Taxes" value={formatPrice(order.taxes)} />
        <Line label="Delivery" value={formatPrice(order.delivery)} />
        <Separator />
        <Line label={<b className="text-foreground">Total</b>} value={<b>{formatPrice(order.total)}</b>} />
      </dl>

      {order.status === "delivered" && (
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">Rate this order</span>
          <Stars value={order.rating} onChange={(v) => rate(order.id, v)} size="md" />
        </div>
      )}
    </div>
  );
}

function Info({ icon: Icon, title, text }: { icon: typeof MapPin; title: string; text: string }) {
  return (
    <div className="flex gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
function Line({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
