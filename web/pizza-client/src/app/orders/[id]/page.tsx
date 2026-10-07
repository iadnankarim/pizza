import type { Metadata } from "next";
import { SingleOrder } from "./single-order";

export async function generateMetadata({ params }: PageProps<"/orders/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order ${id}` };
}

export default async function OrderPage({ params }: PageProps<"/orders/[id]">) {
  const { id } = await params;
  return <SingleOrder id={id} />;
}
