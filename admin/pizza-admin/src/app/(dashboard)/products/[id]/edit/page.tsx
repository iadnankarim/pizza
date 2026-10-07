import type { Metadata } from "next";
import { EditProduct } from "@/components/products/product-form";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: PageProps<"/products/[id]/edit">) {
  const { id } = await params;
  return <EditProduct id={id} />;
}
