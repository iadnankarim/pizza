"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAdmin } from "@/store/admin-store";
import { uid } from "@/lib/format";
import type { Category } from "@/types";

const schema = z.object({ name: z.string().trim().min(2, "Category name is required"), isPublished: z.boolean() });
type Values = z.infer<typeof schema>;

/** Figma: "Create category" modal – name + Publish switch */
export function CategoryDialog({ open, onOpenChange, category }: { open: boolean; onOpenChange: (o: boolean) => void; category?: Category }) {
  const categories = useAdmin((s) => s.categories);
  const { add, update } = useAdmin((s) => s.category);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: "", isPublished: true } });

  useEffect(() => {
    if (open) form.reset(category ? { name: category.name, isPublished: category.isPublished } : { name: "", isPublished: true });
  }, [open, category, form]);

  const onSubmit = form.handleSubmit((v) => {
    const dup = categories.some((c) => c.id !== category?.id && c.name.toLowerCase() === v.name.toLowerCase());
    if (dup) return form.setError("name", { message: "A category with this name already exists" });
    if (category) {
      update(category.id, v);
      toast.success("Category updated");
    } else {
      add({ ...v, id: uid("c"), createdAt: new Date().toISOString() });
      toast.success("Category created");
    }
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? "Edit category" : "Create category"}</DialogTitle>
          <DialogDescription className="sr-only">Category name and visibility</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} noValidate>
            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-start">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Category name</FormLabel>
                  <FormControl><Input autoFocus {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="isPublished" render={({ field }) => (
                <FormItem className="flex items-center gap-2 sm:mt-7">
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel className="text-sm text-foreground">Publish</FormLabel>
                </FormItem>
              )} />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" size="sm">{category ? <><Save /> Save</> : <><Plus /> Create</>}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
