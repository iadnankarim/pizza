import type { Metadata } from "next";
import { ToppingForm } from "@/components/toppings/topping-form";

export const metadata: Metadata = { title: "Create topping" };

export default function CreateToppingPage() {
  return <ToppingForm />;
}
