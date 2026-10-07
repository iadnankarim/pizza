export type OrderStatus = "received" | "preparing" | "out_for_delivery" | "delivered";
export type PaymentType = "card" | "cash" | "upi";
export type Spiciness = "less" | "medium" | "hot";
export type Role = "admin" | "manager" | "customer";
export type PizzaSize = "small" | "medium" | "large";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  size: PizzaSize;
  toppings: string[];
  qty: number;
  price: number; // unit price incl. toppings
}

export interface Order {
  id: string;
  customer: { name: string; address: string; phone: string };
  items: OrderItem[];
  status: OrderStatus;
  paymentType: PaymentType;
  amount: number;
  comment?: string;
  placedAt: string; // ISO
}

export interface Category {
  id: string;
  name: string;
  isPublished: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  image: string;
  prices: Record<PizzaSize, number>;
  spiciness: Spiciness;
  isHit: boolean;
  isPublished: boolean;
  isAvailable: boolean;
  createdAt: string;
}

export interface Topping {
  id: string;
  name: string;
  image: string;
  price: number;
  categoryId: string; // "Available for"
  isPublished: boolean;
  isAvailable: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number; // percentage
  validTill: string; // ISO
  isPublished: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  designation?: string;
  avatar?: string;
  isBanned: boolean;
  createdAt: string;
}
