"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAdmin } from "@/store/admin-store";
import { formatPrice, newOrderId } from "@/lib/format";
import type { PizzaSize } from "@/types";

const schema = z.object({
  name: z.string().trim().min(2, "Customer name is required"),
  phone: z.string().trim().min(7, "Enter a phone number"),
  address: z.string().trim().min(5, "Address is required"),
  productId: z.string().min(1, "Choose a product"),
  size: z.enum(["small", "medium", "large"]),
  qty: z.coerce.number<number>().int().min(1, "At least 1").max(50),
  paymentType: z.enum(["card", "cash", "upi"]),
  comment: z.string().optional(),
});
type Values = z.infer<typeof schema>;

/** Manual order for phone / walk-in customers (Figma: "+ Create order") */
export function CreateOrderDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const router = useRouter();
  const allProducts = useAdmin((s) => s.products);
  const addOrder = useAdmin((s) => s.addOrder);
  const products = useMemo(() => allProducts.filter((p) => p.isPublished && p.isAvailable), [allProducts]);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", address: "", productId: "", size: "medium", qty: 1, paymentType: "cash", comment: "" },
  });
  const [productId, size, qty] = useWatch({ control: form.control, name: ["productId", "size", "qty"] });
  const product = products.find((p) => p.id === productId);
  const total = product ? product.prices[size as PizzaSize] * (Number(qty) || 0) : 0;

  const onSubmit = form.handleSubmit((v) => {
    const p = products.find((x) => x.id === v.productId)!;
    const id = newOrderId();
    addOrder({
      id,
      customer: { name: v.name, phone: v.phone, address: v.address },
      items: [{ productId: p.id, name: p.name, image: p.image, size: v.size, toppings: [], qty: v.qty, price: p.prices[v.size] }],
      status: "received",
      paymentType: v.paymentType,
      amount: p.prices[v.size] * v.qty,
      comment: v.comment,
      placedAt: new Date().toISOString(),
    });
    toast.success(`Order #${id} created`);
    form.reset();
    onOpenChange(false);
    router.push(`/orders/${id}`);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create order</DialogTitle>
          <DialogDescription>For phone or walk-in customers.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Customer name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl><Input type="tel" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Address</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="productId" render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Product</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger className="w-full"><SelectValue placeholder="Choose a product" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="size" render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    {(["small", "medium", "large"] as const).map((s) => (
                      <SelectItem key={s} value={s}>
                        <span className="capitalize">{s}</span>
                        {product && <span className="text-muted-foreground">· {formatPrice(product.prices[s])}</span>}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />
            <FormField control={form.control} name="qty" render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl><Input type="number" min={1} max={50} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="paymentType" render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Payment type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="cash">Cash on delivery</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )} />
            <FormField control={form.control} name="comment" render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Comment (optional)</FormLabel>
                <FormControl><Textarea rows={2} {...field} /></FormControl>
              </FormItem>
            )} />
            <DialogFooter className="items-center sm:col-span-2">
              <span className="mr-auto text-sm">Total: <b>{formatPrice(total)}</b></span>
              <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" size="sm"><Plus /> Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
