"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { SectionCard } from "@/components/common/section-card";
import { FileUpload } from "@/components/common/file-upload";
import { InputWithSuffix } from "@/components/common/input-suffix";
import { FormActions } from "@/components/common/form-actions";
import { NotFound } from "@/components/common/not-found";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdmin } from "@/store/admin-store";
import { useMounted } from "@/hooks/use-mounted";
import { uid } from "@/lib/format";
import type { Topping } from "@/types";

const schema = z.object({
  name: z.string().trim().min(2, "Topping name is required"),
  categoryId: z.string().min(1, "Choose a category"),
  image: z.string().min(1, "Upload a topping image"),
  price: z.coerce.number<number>({ error: "Required" }).positive("Must be more than 0"),
  isPublished: z.boolean(),
  isAvailable: z.boolean(),
});
type Values = z.infer<typeof schema>;

/** Figma: Admin Panel → Create Toppings */
export function ToppingForm({ topping }: { topping?: Topping }) {
  const router = useRouter();
  const categories = useAdmin((s) => s.categories);
  const { add, update } = useAdmin((s) => s.topping);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: topping ?? { name: "", categoryId: "c1", image: "", price: 50, isPublished: true, isAvailable: true },
  });

  const onSubmit = form.handleSubmit((v) => {
    if (topping) {
      update(topping.id, v);
      toast.success("Topping updated");
    } else {
      add({ ...v, id: uid("t"), createdAt: new Date().toISOString() });
      toast.success("Topping created");
    }
    router.push("/toppings");
  });

  return (
    <>
      <PageHeader crumbs={[{ label: "Toppings", href: "/toppings" }, { label: topping ? "Edit" : "Create" }]}>
        <FormActions form="topping-form" />
      </PageHeader>
      <Form {...form}>
        <form id="topping-form" onSubmit={onSubmit} className="grid gap-5 lg:grid-cols-[1.6fr_1fr]" noValidate>
          <div className="space-y-5">
            <SectionCard title="Topping's info">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topping name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="categoryId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available for</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl><SelectTrigger className="w-full"><SelectValue placeholder="Choose category" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </SectionCard>
            <SectionCard title="Topping's image">
              <FormField control={form.control} name="image" render={({ field, fieldState }) => (
                <FormItem>
                  <FileUpload value={field.value || undefined} onChange={(v) => field.onChange(v ?? "")} invalid={!!fieldState.error} />
                  <FormMessage />
                </FormItem>
              )} />
            </SectionCard>
          </div>
          <div className="space-y-5">
            <SectionCard title="Topping's price">
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem className="max-w-40">
                  <FormLabel>Price</FormLabel>
                  <FormControl><InputWithSuffix suffix="₹" type="number" min={0} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </SectionCard>
            <SectionCard title="Other properties">
              <div className="space-y-4">
                {([["isPublished", "Publish"], ["isAvailable", "Available"]] as const).map(([name, label]) => (
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

export function EditTopping({ id }: { id: string }) {
  const mounted = useMounted();
  const topping = useAdmin((s) => s.toppings.find((t) => t.id === id));
  if (!mounted) return <Skeleton className="h-96 w-full" />;
  if (!topping) return <NotFound what="Topping" href="/toppings" />;
  return <ToppingForm topping={topping} />;
}
