import type { Metadata } from "next";
import { OrderDetail } from "@/components/orders/order-detail";

export async function generateMetadata({ params }: PageProps<"/orders/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order #${id}` };
}

export default async function OrderPage({ params }: PageProps<"/orders/[id]">) {
  const { id } = await params;
  return <OrderDetail id={id} />;
}
