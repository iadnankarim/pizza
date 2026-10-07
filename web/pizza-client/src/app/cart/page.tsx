"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QtyStepper } from "@/components/cart/qty-stepper";
import { itemMeta } from "@/components/cart/item-meta";
import { useCart, getTotals } from "@/store/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const mounted = useMounted();
  const { items, setQty, remove } = useCart();
  const { subtotal } = getTotals(items, null);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">Shopping cart</h1>

      {!mounted ? (
        <div className="h-64 animate-pulse rounded-2xl bg-white" />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-16 text-center">
          <span className="grid size-28 place-items-center rounded-full bg-muted">
            <ShoppingCart className="size-12 text-muted-foreground" />
          </span>
          <p className="mt-6 font-medium">
            Cart is empty.{" "}
            <Link href="/#menu" className="text-primary hover:underline">
              Continue shopping?
            </Link>
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-4 sm:p-6">
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.key} className="grid grid-cols-[64px_1fr_auto] items-center gap-4 py-4 sm:grid-cols-[80px_1fr_auto_auto_90px_auto]">
                <div className="relative size-16 sm:size-20">
                  <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">{item.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{itemMeta(item)}</p>
                  <p className="mt-1 text-sm">{formatPrice(item.unitPrice)}</p>
                </div>
                <div className="col-start-2 sm:col-start-auto">
                  <QtyStepper value={item.qty} onChange={(q) => setQty(item.key, q)} />
                </div>
                <span className="hidden sm:block" />
                <span className="row-start-1 text-right font-semibold sm:row-start-auto">{formatPrice(item.unitPrice * item.qty)}</span>
                <button
                  onClick={() => remove(item.key)}
                  className="col-start-3 row-start-2 justify-self-end rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground sm:col-start-auto sm:row-start-auto"
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
          <Separator />
          <div className="flex items-center justify-end gap-10 py-5">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-lg font-bold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-end">
            <Button asChild size="lg">
              <Link href="/checkout">
                Order now <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
