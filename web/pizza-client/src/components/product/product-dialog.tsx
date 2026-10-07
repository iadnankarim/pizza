"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CircleCheck, Flame, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { OptionChips } from "./option-chips";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { toppings as allToppings } from "@/data/products";
import { useCart } from "@/store/cart-store";
import { cn, formatPrice } from "@/lib/utils";
import type { Product, Spiciness } from "@/types";

const spiceLevels: { value: Spiciness; label: string }[] = [
  { value: "less", label: "Less spicy" },
  { value: "medium", label: "Medium spicy" },
  { value: "hot", label: "Hot spicy" },
];

/** Figma: "Modal pizza card popup" */
export function ProductDialog({
  product,
  open,
  onOpenChange,
  initialOption,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initialOption: string;
}) {
  const [option, setOption] = useState(initialOption);
  const [selected, setSelected] = useState<string[]>([]);
  const [spice, setSpice] = useState<Spiciness>("medium");
  const add = useCart((s) => s.add);

  const base = product.options.find((o) => o.label === option)!.price;
  const chosen = useMemo(() => allToppings.filter((t) => selected.includes(t.id)), [selected]);
  const total = base + chosen.reduce((s, t) => s + t.price, 0);

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const handleAdd = () => {
    add({
      productId: product.id,
      name: product.name,
      image: product.image,
      option,
      unitPrice: total,
      toppings: chosen,
      spice: product.spicy ? spice : undefined,
    });
    toast.success(`${product.name} (${option}) added to cart`);
    onOpenChange(false);
    setSelected([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <div className="grid md:grid-cols-2">
          <div className="relative flex min-h-64 items-center justify-center bg-white p-8">
            {product.spicy && <Flame className="absolute top-5 left-5 size-5 text-destructive" />}
            <div className="relative aspect-square w-full max-w-sm">
              <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 90vw, 400px" className="object-contain" />
            </div>
          </div>

          <div className="flex flex-col gap-5 bg-muted/60 p-6 md:p-8">
            <div className="pr-6">
              <DialogTitle className="text-xl">{product.name}</DialogTitle>
              <DialogDescription className="mt-2 text-sm leading-relaxed">{product.description}</DialogDescription>
            </div>

            <OptionChips options={product.options} value={option} onChange={setOption} size="md" />

            {product.spicy && (
              <div>
                <p className="mb-2 text-sm font-semibold">Spiciness</p>
                {/* Figma: Radio/Tab */}
                <ToggleGroup type="single" value={spice} onValueChange={(v) => v && setSpice(v as Spiciness)} className="w-fit" aria-label="Spiciness">
                  {spiceLevels.map((l, i) => (
                    <ToggleGroupItem
                      key={l.value}
                      value={l.value}
                      className={cn(
                        "h-9 border bg-white px-4 text-foreground data-[state=on]:z-10 data-[state=on]:border-coral data-[state=on]:text-coral",
                        i === 0 && "rounded-l-md",
                        i === spiceLevels.length - 1 && "rounded-r-md",
                        i > 0 && "-ml-px"
                      )}
                    >
                      {l.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            )}

            <div>
              <p className="mb-3 font-semibold">Extra toppings</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {allToppings.map((t) => {
                  const active = selected.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggle(t.id)}
                      aria-pressed={active}
                      className={cn(
                        "relative flex flex-col items-center rounded-xl border-2 border-transparent bg-white p-3 text-center transition-colors hover:border-primary/40",
                        active && "border-primary"
                      )}
                    >
                      {active && <CircleCheck className="absolute top-1.5 right-1.5 size-4 text-success" />}
                      <span className="relative mb-1 block size-12">
                        <Image src={t.image} alt="" fill sizes="48px" className="object-contain" />
                      </span>
                      <span className="text-xs">{t.name}</span>
                      <span className="text-sm font-semibold">{formatPrice(t.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between pt-2">
              <span className="text-xl font-bold">{formatPrice(total)}</span>
              <Button onClick={handleAdd}>
                <ShoppingCart /> Add to cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
