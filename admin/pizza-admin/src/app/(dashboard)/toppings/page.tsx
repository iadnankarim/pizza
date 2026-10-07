import type { Metadata } from "next";
import { ToppingsList } from "@/components/toppings/toppings-list";

export const metadata: Metadata = { title: "Toppings" };

export default function ToppingsPage() {
  return <ToppingsList />;
}
