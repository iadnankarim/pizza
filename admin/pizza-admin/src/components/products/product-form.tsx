"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Flame } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { SectionCard } from "@/components/common/section-card";
import { FileUpload } from "@/components/common/file-upload";
import { InputWithSuffix } from "@/components/common/input-suffix";
import { FormActions } from "@/components/common/form-actions";
import { NotFound } from "@/components/common/not-found";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAdmin } from "@/store/admin-store";
import { useMounted } from "@/hooks/use-mounted";
import { uid } from "@/lib/format";
import type { Product } from "@/types";

const price = z.coerce.number<number>({ error: "Required" }).positive("Must be more than 0");
const schema = z
  .object({
    name: z.string().trim().min(2, "Product name is required"),
    categoryId: z.string().min(1, "Choose a category"),
    description: z.string().trim().min(10, "Write at least 10 characters"),
    image: z.string({ error: "Upload a product image" }).min(1, "Upload a product image"),
    small: price,
    medium: price,
    large: price,
    spiciness: z.enum(["less", "medium", "hot"]),
    isHit: z.boolean(),
    isPublished: z.boolean(),
    isAvailable: z.boolean(),
  })
  .refine((v) => v.small <= v.medium && v.medium <= v.large, { path: ["large"], message: "Prices should go up from small to large" });
type Values = z.infer<typeof schema>;

const spice = [
  { value: "less", label: "Less spicy" },
  { value: "medium", label: "Medium spicy" },
  { value: "hot", label: "Hot spicy" },
] as const;

/** Figma: Admin Panel → Create Product */
export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const categories = useAdmin((s) => s.categories);
  const { add, update } = useAdmin((s) => s.product);

  const defaults = useMemo<Values>(
    () =>
      product
        ? { ...product, small: product.prices.small, medium: product.prices.medium, large: product.prices.large }
        : { name: "", categoryId: "", description: "", image: "", small: 300, medium: 500, large: 600, spiciness: "medium", isHit: false, isPublished: true, isAvailable: true },
    [product]
  );
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: defaults });

  const onSubmit = form.handleSubmit(({ small, medium, large, ...v }) => {
    const data = { ...v, prices: { small, medium, large } };
    if (product) {
      update(product.id, data);
      toast.success("Product updated");
    } else {
      add({ ...data, id: uid("p"), createdAt: new Date().toISOString() });
      toast.success("Product created");
    }
    router.push("/products");
  });

  return (
    <>
      <PageHeader crumbs={[{ label: "Products", href: "/products" }, { label: product ? "Edit" : "Create" }]}>
        <FormActions form="product-form" pending={form.formState.isSubmitting} />
      </PageHeader>

      <Form {...form}>
        <form id="product-form" onSubmit={onSubmit} className="grid gap-5 lg:grid-cols-[1.6fr_1fr]" noValidate>
          <div className="space-y-5">
            <SectionCard title="Product info">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="categoryId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product category</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl><SelectTrigger className="w-full"><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea rows={3} placeholder="Tell something about the product" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </SectionCard>

            <SectionCard title="Product image">
              <FormField control={form.control} name="image" render={({ field, fieldState }) => (
                <FormItem>
                  <FileUpload value={field.value || undefined} onChange={(v) => field.onChange(v ?? "")} invalid={!!fieldState.error} />
                  <FormMessage />
                </FormItem>
              )} />
            </SectionCard>
          </div>

          <div className="space-y-5">
            <SectionCard title="Product price">
              <div className="grid grid-cols-3 gap-3">
                {(["small", "medium", "large"] as const).map((size) => (
                  <FormField key={size} control={form.control} name={size} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{size}</FormLabel>
                      <FormControl><InputWithSuffix suffix="₹" type="number" min={0} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Spiciness">
              <FormField control={form.control} name="spiciness" render={({ field }) => (
                <FormItem>
                  <div className="flex flex-wrap items-center gap-3">
                    <ToggleGroup type="single" value={field.value} onValueChange={(v) => v && field.onChange(v)} aria-label="Spiciness">
                      {spice.map((s) => (
                        <ToggleGroupItem
                          key={s.value}
                          value={s.value}
                          className="h-8 border px-3 text-xs font-normal first:rounded-l-md last:rounded-r-md data-[state=on]:border-primary data-[state=on]:text-primary [&:not(:first-child)]:-ml-px data-[state=on]:z-10"
                        >
                          {s.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                    <span className="flex text-destructive" aria-hidden>
                      {Array.from({ length: spice.findIndex((s) => s.value === field.value) + 1 }, (_, i) => <Flame key={i} className="size-4 fill-current" />)}
                    </span>
                  </div>
                </FormItem>
              )} />
            </SectionCard>

            <SectionCard title="Other properties">
              <div className="space-y-4">
                {([
                  ["isHit", "Show as hit product"],
                  ["isPublished", "Publish"],
                  ["isAvailable", "Available"],
                ] as const).map(([name, label]) => (
                  <FormField key={name} control={form.control} name={name} render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <FormLabel className="text-sm text-foreground">{label}</FormLabel>
                    </FormItem>
                  )} />
                ))}
              </div>
            </SectionCard>
          </div>
        </form>
      </Form>
    </>
  );
}

export function EditProduct({ id }: { id: string }) {
  const mounted = useMounted();
  const product = useAdmin((s) => s.products.find((p) => p.id === id));
  if (!mounted) return <Skeleton className="h-96 w-full" />;
  if (!product) return <NotFound what="Product" href="/products" />;
  return <ProductForm product={product} />;
}
