"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";
import { COUPONS, DELIVERY_CHARGE, TAX_RATE } from "@/data/products";

interface CartState {
  items: CartItem[];
  coupon: string | null;
  add: (item: Omit<CartItem, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const makeKey = (i: Omit<CartItem, "key" | "qty">) =>
  [i.productId, i.option, i.spice ?? "", i.toppings.map((t) => t.id).sort().join(".")].join("|");

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      coupon: null,
      add: (item, qty = 1) =>
        set((s) => {
          const key = makeKey(item);
          const existing = s.items.find((i) => i.key === key);
          if (existing) {
            return { items: s.items.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i)) };
          }
          return { items: [...s.items, { ...item, key, qty }] };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          items: qty <= 0 ? s.items.filter((i) => i.key !== key) : s.items.map((i) => (i.key === key ? { ...i, qty } : i)),
        })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [], coupon: null }),
      applyCoupon: (code) => {
        const c = code.trim().toUpperCase();
        if (!(c in COUPONS)) return false;
        set({ coupon: c });
        return true;
      },
      removeCoupon: () => set({ coupon: null }),
    }),
    { name: "pizza-cart" }
  )
);

export function getTotals(items: CartItem[], coupon: string | null) {
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  const discount = coupon ? Math.round(subtotal * (COUPONS[coupon] ?? 0)) : 0;
  const taxes = Math.round((subtotal - discount) * TAX_RATE);
  const delivery = items.length ? DELIVERY_CHARGE : 0;
  const total = subtotal - discount + taxes + delivery;
  const count = items.reduce((n, i) => n + i.qty, 0);
  return { subtotal, discount, taxes, delivery, total, count };
}
