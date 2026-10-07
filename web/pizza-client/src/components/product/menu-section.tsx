"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { ProductCard } from "./product-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/types";

const categories: { value: Category; label: string; search: string }[] = [
  { value: "pizza", label: "Pizza", search: "pizza" },
  { value: "drinks", label: "Softdrinks", search: "drinks" },
  { value: "sauces", label: "Sauces", search: "sauces" },
];

type Filter = { value: string; label: string; test: (p: Product) => boolean };
const hasTag = (tag: NonNullable<Product["tags"]>[number]) => (p: Product) => !!p.tags?.includes(tag);
const all: Filter = { value: "all", label: "All", test: () => true };

/** Figma: each section has its own filter dropdown (Vegetarian / Non Alcohol / ...) */
const filtersByCategory: Record<Category, Filter[]> = {
  pizza: [
    all,
    { value: "veg", label: "Vegetarian", test: hasTag("veg") },
    { value: "non-veg", label: "Non-vegetarian", test: hasTag("non-veg") },
    { value: "spicy", label: "Spicy", test: hasTag("spicy") },
    { value: "hit", label: "Hit products", test: hasTag("hit") },
  ],
  drinks: [
    all,
    { value: "non-alcohol", label: "Non Alcohol", test: (p) => !p.tags?.includes("alcohol") },
    { value: "juice", label: "Juices", test: hasTag("juice") },
    { value: "soda", label: "Soft drinks", test: hasTag("soda") },
  ],
  sauces: [
    all,
    { value: "spicy", label: "Spicy", test: hasTag("spicy") },
    { value: "mild", label: "Mild", test: (p) => !p.spicy },
  ],
};

export const sectionIds: Record<Category, string> = { pizza: "menu", drinks: "drinks", sauces: "sauces" };

interface MenuSectionProps {
  defaultCategory?: Category;
  className?: string;
}

export function MenuSection({ defaultCategory = "pizza", className }: MenuSectionProps) {
  const [category, setCategory] = useState<Category>(defaultCategory);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filters = filtersByCategory[category];
  const current = categories.find((c) => c.value === category)!;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const test = (filters.find((f) => f.value === filter) ?? all).test;
    return products.filter((p) => p.category === category && (!q || p.name.toLowerCase().includes(q)) && test(p));
  }, [category, query, filter, filters]);

  const changeCategory = (c: Category) => {
    setCategory(c);
    setFilter("all");
    setQuery("");
  };

  return (
    <section
      id={sectionIds[defaultCategory]}
      aria-label={current.label}
      className={cn("mx-auto max-w-7xl scroll-mt-20 px-4 py-8 sm:px-6", className)}
    >
      {/* Toolbar: tabs + search + filter */}
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] md:flex-row md:items-center">
        <Tabs value={category} onValueChange={(v) => changeCategory(v as Category)}>
          <TabsList className="bg-transparent p-0">
            {categories.map((c) => (
              <TabsTrigger
                key={c.value}
                value={c.value}
                className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${current.search}...`}
            className="border-transparent bg-muted/60 pl-9 shadow-none"
            aria-label={`Search ${current.search}`}
          />
        </div>

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full border-transparent bg-muted/60 shadow-none md:w-48" aria-label="Filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filters.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {list.length ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-muted-foreground">No products match your search.</p>
      )}
    </section>
  );
}
