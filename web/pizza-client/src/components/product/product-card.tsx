"use client";

import Image from "next/image";
import { useState } from "react";
import { Flame, Plus } from "lucide-react";
import { toast } from "sonner";

import { OptionChips } from "./option-chips";
import { ProductDialog } from "./product-dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

/** Figma: Card/Pizza, Card/Drinks, Card/Sauce */
export function ProductCard({ product }: { product: Product }) {
  const [option, setOption] = useState(product.options[0].label);
  const [open, setOpen] = useState(false);
  const add = useCart((s) => s.add);
  const price = product.options.find((o) => o.label === option)!.price;
  const isPizza = product.category === "pizza";

  const handleAdd = () => {
    if (isPizza) return setOpen(true);
    add({ productId: product.id, name: product.name, image: product.image, option, unitPrice: price, toppings: [] });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <article className="group flex flex-col rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
      <button
        type="button"
        onClick={() => (isPizza ? setOpen(true) : undefined)}
        className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-xl"
        aria-label={isPizza ? `Customize ${product.name}` : product.name}
        tabIndex={isPizza ? 0 : -1}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {product.spicy && (
          <span className="absolute top-0 right-0 rounded-full bg-destructive/10 p-1 text-destructive" title="Spicy">
            <Flame className="size-3.5" />
          </span>
        )}
      </button>

      <h3 className="font-semibold">{product.name}</h3>
      <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{product.description}</p>

      <div className="mt-3">
        <OptionChips options={product.options} value={option} onChange={setOption} />
      </div>

      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="font-semibold">{formatPrice(price)}</span>
        <Button size="icon-sm" onClick={handleAdd} aria-label={`Add ${product.name}`}>
          <Plus />
        </Button>
      </div>

      {isPizza && <ProductDialog key={option} product={product} open={open} onOpenChange={setOpen} initialOption={option} />}
    </article>
  );
}
