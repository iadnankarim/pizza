"use client";

import Image from "next/image";
import Link from "next/link";
import { Bike, Check, ClipboardList, CreditCard, Pizza } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdmin } from "@/store/admin-store";
import { useMounted } from "@/hooks/use-mounted";
import { formatDateTime, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { OrderStatus, PaymentType } from "@/types";

/** Figma: Received → Prepared → Out for delivery → Completed */
const steps: { status: OrderStatus; label: string; icon: typeof Check }[] = [
  { status: "received", label: "Received", icon: ClipboardList },
  { status: "preparing", label: "Prepared", icon: Pizza },
  { status: "out_for_delivery", label: "Out for delivery", icon: Bike },
  { status: "delivered", label: "Completed", icon: Check },
];

const paymentLabel: Record<PaymentType, string> = { card: "Debit Card", cash: "Cash on delivery", upi: "UPI" };
const sizeLabel = { small: "Small", medium: "Medium", large: "Large" };

export function OrderDetail({ id }: { id: string }) {
  const mounted = useMounted();
  const order = useAdmin((s) => s.orders.find((o) => o.id === id));
  const setStatus = useAdmin((s) => s.setOrderStatus);

  if (!mounted) return <Skeleton className="h-96 w-full" />;
  if (!order) {
    return (
      <div className="rounded-lg bg-white p-16 text-center">
        <p className="text-muted-foreground">Order #{id} was not found.</p>
        <Button asChild className="mt-4" size="sm">
          <Link href="/orders">Back to orders</Link>
        </Button>
      </div>
    );
  }

  const current = steps.findIndex((s) => s.status === order.status);
  const itemCount = order.items.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <PageHeader crumbs={[{ label: "Orders", href: "/orders" }, { label: `Order #${order.id}` }]}>
        {/* Status stepper – click a step to move the order along */}
        <ol className="flex flex-wrap items-center gap-1" aria-label="Order status">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done = i <= current;
            return (
              <li key={s.status} className="flex items-center gap-1">
                {i > 0 && <span className={cn("hidden h-px w-5 border-t border-dashed sm:block", i <= current ? "border-primary" : "border-input")} />}
                <button
                  type="button"
                  onClick={() => {
                    setStatus(order.id, s.status);
                    toast.success(`Order #${order.id} marked as ${s.label.toLowerCase()}`);
                  }}
                  aria-current={i === current ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md border bg-white px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary",
                    done && "text-foreground",
                    i === current && "border-info bg-info/10 text-info"
                  )}
                >
                  <Icon className="size-3.5" /> {s.label}
                </button>
              </li>
            );
          })}
        </ol>
      </PageHeader>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <section className="h-fit rounded-lg bg-white p-5">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-sm font-semibold">Order Details</h1>
            <span className="text-xs text-muted-foreground">{formatDateTime(order.placedAt)}</span>
          </div>
          <ul className="divide-y">
            {order.items.map((it, i) => (
              <li key={i} className="flex items-center gap-4 py-4">
                <Image src={it.image} alt="" width={44} height={44} className="size-11 object-contain" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{it.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {sizeLabel[it.size]}
                    {it.toppings.length > 0 && `, Toppings: ${it.toppings.join(", ")}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {it.qty} {it.qty === 1 ? "item" : "items"}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatPrice(it.price * it.qty)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t pt-4 text-sm font-semibold">
            <span>Total ({itemCount} items)</span>
            <span>{formatPrice(order.amount)}</span>
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-lg bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold">Customer Details</h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Name</dt>
                <dd className="font-medium">{order.customer.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Phone</dt>
                <dd className="font-medium">
                  <a href={`tel:${order.customer.phone.replace(/\s/g, "")}`} className="hover:text-primary">
                    {order.customer.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Address</dt>
                <dd className="font-medium">{order.customer.address}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Payment type</dt>
                <dd className="flex items-center gap-2 font-medium">
                  <CreditCard className="size-4" /> {paymentLabel[order.paymentType]}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Order amount</dt>
                <dd className="font-medium">{formatPrice(order.amount)}</dd>
              </div>
            </dl>
          </section>
          <section className="rounded-lg bg-white p-5">
            <h2 className="mb-2 text-sm font-semibold">Comment</h2>
            <p className="text-sm text-muted-foreground">{order.comment || "No comment from the customer."}</p>
          </section>
        </div>
      </div>
    </>
  );
}
