import type { Metadata } from "next";
import { ProductForm } from "@/components/products/product-form";

export const metadata: Metadata = { title: "Create product" };

export default function CreateProductPage() {
  return <ProductForm />;
}
