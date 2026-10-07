import { format } from "date-fns";

export const formatPrice = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;
export const formatDate = (iso: string) => format(new Date(iso), "d MMMM yyyy");
export const formatDateTime = (iso: string) => format(new Date(iso), "d MMMM yyyy h:mm a");

/** 7-digit order number, e.g. 3423232 */
export const newOrderId = () => String(Date.now()).slice(-7);

export const uid = (prefix: string) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
