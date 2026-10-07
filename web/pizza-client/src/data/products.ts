import type { Address, Product, Topping } from "@/types";

const pizzaDesc = "Juicy chicken fillet and crispy bacon combined with signature tomato sauce, Mozzarella and onions";
const pizzaSizes = (s: number) => [
  { label: "S", price: s },
  { label: "M", price: s + 150 },
  { label: "L", price: s + 300 },
];
const drinkSizes = (p: number) => [
  { label: "200ml", price: p },
  { label: "300ml", price: p + 30 },
  { label: "500ml", price: p + 60 },
];
const juiceDesc = "Fresh orange juice with extra chilled and fresh fruits";

export const products: Product[] = [
  { id: "p1", name: "Margherita", description: pizzaDesc, image: "/images/pizza-carbonara.png", category: "pizza", options: pizzaSizes(500), tags: ["veg", "hit"] },
  { id: "p2", name: "Pepperoni", description: pizzaDesc, image: "/images/pizza-pepperoni.png", category: "pizza", options: pizzaSizes(550), tags: ["non-veg", "spicy"], spicy: true },
  { id: "p3", name: "Chicken BBQ", description: pizzaDesc, image: "/images/pizza-chicken-bbq.png", category: "pizza", options: pizzaSizes(600), tags: ["non-veg"], spicy: true },
  { id: "p4", name: "Carbonara", description: pizzaDesc, image: "/images/pizza-carbonara.png", category: "pizza", options: pizzaSizes(520), tags: ["non-veg"] },
  { id: "p5", name: "Double Pepperoni", description: pizzaDesc, image: "/images/pizza-hero.png", category: "pizza", options: pizzaSizes(650), tags: ["non-veg", "spicy", "hit"], spicy: true },
  { id: "p6", name: "Veggie Supreme", description: pizzaDesc, image: "/images/pizza-chicken-bbq.png", category: "pizza", options: pizzaSizes(480), tags: ["veg"] },
  { id: "p7", name: "Farmhouse", description: pizzaDesc, image: "/images/pizza-carbonara.png", category: "pizza", options: pizzaSizes(460), tags: ["veg"] },
  { id: "p8", name: "Spicy Pepperoni", description: pizzaDesc, image: "/images/pizza-pepperoni.png", category: "pizza", options: pizzaSizes(580), tags: ["non-veg", "spicy"], spicy: true },

  { id: "d1", name: "Orange Juice", description: juiceDesc, image: "/images/juice-orange.png", category: "drinks", options: drinkSizes(120), tags: ["veg", "juice"] },
  { id: "d2", name: "Pepsi", description: "Chilled classic Pepsi, the perfect partner for pizza", image: "/images/drink-pepsi.png", category: "drinks", options: drinkSizes(60), tags: ["veg", "soda"] },
  { id: "d3", name: "Pepsi Diet", description: "Zero sugar Pepsi with the same bold taste", image: "/images/drink-pepsi-diet.png", category: "drinks", options: drinkSizes(70), tags: ["veg", "soda"] },
  { id: "d4", name: "Mango Juice", description: juiceDesc.replace("orange", "mango"), image: "/images/juice-orange.png", category: "drinks", options: drinkSizes(130), tags: ["veg", "juice"] },

  { id: "s1", name: "Sweet chilli sauce", description: "Light tangy dip with a sweet chilli kick", image: "/images/sauce-sweet-chilli.png", category: "sauces", options: [{ label: "Regular", price: 120 }], tags: ["veg", "spicy"], spicy: true },
  { id: "s2", name: "Honey sauce", description: "Smooth honey dip for your crusts", image: "/images/sauce-honey.png", category: "sauces", options: [{ label: "Regular", price: 120 }], tags: ["veg"] },
  { id: "s3", name: "Cheese sauce", description: "Creamy cheddar cheese dip", image: "/images/sauce-cheese.png", category: "sauces", options: [{ label: "Regular", price: 120 }], tags: ["veg"] },
  { id: "s4", name: "Garlic sauce", description: "Classic creamy garlic dip", image: "/images/sauce-garlic.png", category: "sauces", options: [{ label: "Regular", price: 120 }], tags: ["veg"] },
];

export const toppings: Topping[] = [
  { id: "t1", name: "Cheddar", image: "/images/topping-cheese.png", price: 70 },
  { id: "t2", name: "Chicken", image: "/images/topping-chicken.png", price: 90 },
  { id: "t3", name: "Jalapeño", image: "/images/topping-jalapeno.png", price: 30 },
  { id: "t4", name: "Mushroom", image: "/images/topping-mushroom.png", price: 80 },
];

export const addresses: Address[] = [
  { id: "a1", name: "Rakesh K", line: "Main street, Blg. no. 3, Ground floor, apt. 4" },
  { id: "a2", name: "Rakesh K", line: "Naveen street, Blg. no. 10, Ground floor, apt. 12" },
];

export const restaurants = [{ id: "r1", name: "Pizzarea", line: "Shopping mall, 2nd floor" }];

export const cities = ["Mumbai", "Delhi", "Bengaluru", "Pune"];

export const TAX_RATE = 0.05;
export const DELIVERY_CHARGE = 0; // free delivery
export const COUPONS: Record<string, number> = { PIZZA10: 0.1, MERN20: 0.2 };

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}
