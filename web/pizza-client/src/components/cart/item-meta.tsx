import type { CartItem } from "@/types";

const spiceLabel = { less: "Less spicy", medium: "Medium spicy", hot: "Hot spicy" } as const;

export function itemMeta(item: CartItem) {
  const size = item.option.length === 1 ? { S: "Small", M: "Medium", L: "Large" }[item.option] ?? item.option : item.option;
  return [size, item.spice && spiceLabel[item.spice], ...item.toppings.map((t) => t.name)].filter(Boolean).join(" · ");
}
