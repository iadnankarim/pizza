"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, startOfToday } from "date-fns";
import { CalendarIcon, Plus, Save } from "lucide-react";
import { toast } from "sonner";

import { InputWithSuffix } from "@/components/common/input-suffix";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useAdmin } from "@/store/admin-store";
import { uid } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Coupon } from "@/types";

const schema = z.object({
  code: z.string().trim().min(3, "At least 3 characters").max(20).regex(/^[A-Za-z0-9]+$/, "Letters and numbers only"),
  validTill: z.date({ error: "Pick a date" }),
  discount: z.coerce.number<number>({ error: "Required" }).min(1, "1–90%").max(90, "1–90%"),
  isPublished: z.boolean(),
});
type Values = z.infer<typeof schema>;

/** Figma: "Create coupon" modal */
export function CouponDialog({ open, onOpenChange, coupon }: { open: boolean; onOpenChange: (o: boolean) => void; coupon?: Coupon }) {
  const coupons = useAdmin((s) => s.coupons);
  const { add, update } = useAdmin((s) => s.coupon);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { code: "", discount: 10, isPublished: true } });

  useEffect(() => {
    if (!open) return;
    form.reset(
      coupon
        ? { code: coupon.code, discount: coupon.discount, validTill: new Date(coupon.validTill), isPublished: coupon.isPublished }
        : { code: "", discount: 10, validTill: undefined, isPublished: true }
    );
  }, [open, coupon, form]);

  const onSubmit = form.handleSubmit((v) => {
    const code = v.code.toUpperCase();
    if (coupons.some((c) => c.id !== coupon?.id && c.code === code)) return form.setError("code", { message: "This coupon already exists" });
    const data = { code, discount: v.discount, validTill: v.validTill.toISOString(), isPublished: v.isPublished };
    if (coupon) {
      update(coupon.id, data);
      toast.success("Coupon updated");
    } else {
      add({ ...data, id: uid("cp"), createdAt: new Date().toISOString() });
      toast.success(`Coupon ${code} created`);
    }
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{coupon ? "Edit coupon" : "Create coupon"}</DialogTitle>
          <DialogDescription className="sr-only">Coupon code, expiry and discount</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <FormField control={form.control} name="code" render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon name</FormLabel>
                <FormControl><Input autoFocus className="uppercase" placeholder="SUNFUN22" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="validTill" render={({ field }) => (
              <FormItem>
                <FormLabel>Valid till</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button type="button" variant="outline" className={cn("w-full justify-between rounded-md font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "d MMMM yyyy") : "Select date"}
                        <CalendarIcon className="opacity-60" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={{ before: startOfToday() }} autoFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="discount" render={({ field }) => (
              <FormItem className="max-w-36">
                <FormLabel>Off percentage</FormLabel>
                <FormControl><InputWithSuffix suffix="%" type="number" min={1} max={90} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="isPublished" render={({ field }) => (
              <FormItem className="flex items-center gap-2 border-b pb-5">
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="text-sm text-foreground">Publish</FormLabel>
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" size="sm">{coupon ? <><Save /> Save</> : <><Plus /> Create</>}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
