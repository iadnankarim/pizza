"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order } from "@/types";
import { addresses, products } from "@/data/products";

const sample = (id: string, status: Order["status"], date: string, rating?: number): Order => {
  const p = products[Number(id.slice(-1)) % 4];
  const item = { key: p.id, productId: p.id, name: p.name, image: p.image, option: p.options[0].label, unitPrice: p.options[0].price, toppings: [], qty: 2 };
  const subtotal = item.unitPrice * item.qty;
  const taxes = Math.round(subtotal * 0.05);
  return { id, items: [item], subtotal, taxes, delivery: 0, discount: 0, total: subtotal + taxes, paymentType: "cod", address: addresses[0], restaurant: "Pizzarea", status, createdAt: date, rating };
};

const seed: Order[] = [
  sample("4DFD532345454KSD1", "preparing", "2026-09-28T13:20:00Z"),
  sample("4DFD532345454KSD2", "delivered", "2026-09-20T18:05:00Z", 5),
  sample("4DFD532345454KSD3", "delivered", "2026-09-11T19:40:00Z", 4),
  sample("4DFD532345454KSD4", "delivered", "2026-08-30T20:15:00Z", 5),
];

interface OrderState {
  orders: Order[];
  place: (order: Omit<Order, "id" | "createdAt" | "status">) => Order;
  rate: (id: string, rating: number) => void;
}

export const useOrders = create<OrderState>()(
  persist(
    (set) => ({
      orders: seed,
      place: (data) => {
        const order: Order = {
          ...data,
          id: Math.random().toString(36).slice(2, 10).toUpperCase() + Date.now().toString(36).toUpperCase(),
          createdAt: new Date().toISOString(),
          status: "received",
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        return order;
      },
      rate: (id, rating) => set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, rating } : o)) })),
    }),
    { name: "pizza-orders" }
  )
);
