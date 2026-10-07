import type { Metadata } from "next";
import { EditTopping } from "@/components/toppings/topping-form";

export const metadata: Metadata = { title: "Edit topping" };

export default async function EditToppingPage({ params }: PageProps<"/toppings/[id]/edit">) {
  const { id } = await params;
  return <EditTopping id={id} />;
}
