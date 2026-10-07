"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { seedCategories, seedCoupons, seedOrders, seedProducts, seedToppings, seedUsers } from "@/data/seed";
import type { Category, Coupon, Order, OrderStatus, Product, Topping, User } from "@/types";

/**
 * Mock backend for the admin panel. Everything is kept in localStorage so
 * create / edit / delete survive reloads. Swap these actions for API calls later.
 */
type Entity = { id: string };
type Crud<T extends Entity> = {
  add: (item: T) => void;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
};

interface AdminState {
  orders: Order[];
  products: Product[];
  toppings: Topping[];
  categories: Category[];
  coupons: Coupon[];
  users: User[];
  setOrderStatus: (id: string, status: OrderStatus) => void;
  addOrder: (order: Order) => void;
  product: Crud<Product>;
  topping: Crud<Topping>;
  category: Crud<Category>;
  coupon: Crud<Coupon>;
  user: Crud<User>;
  reset: () => void;
}

type ListKey = "products" | "toppings" | "categories" | "coupons" | "users";

const seed = () => ({
  orders: seedOrders,
  products: seedProducts,
  toppings: seedToppings,
  categories: seedCategories,
  coupons: seedCoupons,
  users: seedUsers,
});

export const useAdmin = create<AdminState>()(
  persist(
    (set) => {
      const crud = <K extends ListKey>(key: K) => {
        type T = AdminState[K][number];
        return {
          add: (item: T) => set((s) => ({ [key]: [item, ...s[key]] }) as Partial<AdminState>),
          update: (id: string, patch: Partial<T>) =>
            set((s) => ({ [key]: (s[key] as T[]).map((x) => (x.id === id ? { ...x, ...patch } : x)) }) as Partial<AdminState>),
          remove: (id: string) => set((s) => ({ [key]: (s[key] as T[]).filter((x) => x.id !== id) }) as Partial<AdminState>),
        } as Crud<T>;
      };
      return {
        ...seed(),
        setOrderStatus: (id, status) => set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
        addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
        product: crud("products"),
        topping: crud("toppings"),
        category: crud("categories"),
        coupon: crud("coupons"),
        user: crud("users"),
        reset: () => set(seed()),
      };
    },
    {
      name: "pizza-admin-data",
      version: 1,
      partialize: ({ orders, products, toppings, categories, coupons, users }) => ({ orders, products, toppings, categories, coupons, users }),
    }
  )
);
