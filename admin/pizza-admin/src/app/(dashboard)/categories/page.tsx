import type { Metadata } from "next";
import { CategoriesList } from "@/components/categories/categories-list";

export const metadata: Metadata = { title: "Categories" };

export default function CategoriesPage() {
  return <CategoriesList />;
}
