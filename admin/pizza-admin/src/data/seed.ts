import type { Category, Coupon, Order, OrderItem, Product, Topping, User } from "@/types";

/** "Today" for the demo data – keeps seed data deterministic */
export const NOW = new Date("2026-09-29T12:00:00+05:30");
const daysAgo = (d: number, h = 12, m = 0) => {
  const t = new Date(NOW);
  t.setDate(t.getDate() - d);
  t.setHours(h, m, 0, 0);
  return t.toISOString();
};

const pizzaDesc = "Juicy chicken fillet and crispy bacon combined with signature tomato sauce, Mozzarella and onions";

export const seedCategories: Category[] = [
  { id: "c1", name: "Pizza", isPublished: true, createdAt: daysAgo(420) },
  { id: "c2", name: "Cold drinks", isPublished: true, createdAt: daysAgo(418) },
  { id: "c3", name: "Sauces", isPublished: false, createdAt: daysAgo(90) },
];

const p = (s: number) => ({ small: s, medium: s + 150, large: s + 300 });

export const seedProducts: Product[] = [
  { id: "p1", name: "Pepperoni Pizza", description: pizzaDesc, categoryId: "c1", image: "/images/pizza-pepperoni.png", prices: p(550), spiciness: "hot", isHit: true, isPublished: true, isAvailable: true, createdAt: daysAgo(400) },
  { id: "p2", name: "Margarita", description: pizzaDesc, categoryId: "c1", image: "/images/pizza-carbonara.png", prices: p(500), spiciness: "less", isHit: true, isPublished: false, isAvailable: true, createdAt: daysAgo(398) },
  { id: "p3", name: "Chicken BBQ", description: pizzaDesc, categoryId: "c1", image: "/images/pizza-chicken-bbq.png", prices: p(600), spiciness: "medium", isHit: false, isPublished: true, isAvailable: true, createdAt: daysAgo(300) },
  { id: "p4", name: "Double Pepperoni", description: pizzaDesc, categoryId: "c1", image: "/images/pizza-hero.png", prices: p(650), spiciness: "hot", isHit: false, isPublished: true, isAvailable: false, createdAt: daysAgo(200) },
  { id: "p5", name: "Pepsi", description: "Outstanding flavor coke drink by Pepsi", categoryId: "c2", image: "/images/drink-pepsi.png", prices: { small: 60, medium: 90, large: 120 }, spiciness: "less", isHit: false, isPublished: true, isAvailable: true, createdAt: daysAgo(396) },
  { id: "p6", name: "Orange juice", description: "Fresh apple juicy with from great quality oranges", categoryId: "c2", image: "/images/juice-orange.png", prices: { small: 120, medium: 150, large: 180 }, spiciness: "less", isHit: false, isPublished: true, isAvailable: true, createdAt: daysAgo(395) },
  { id: "p7", name: "Pepsi Diet", description: "Zero sugar Pepsi with the same bold taste", categoryId: "c2", image: "/images/drink-pepsi-diet.png", prices: { small: 70, medium: 100, large: 130 }, spiciness: "less", isHit: false, isPublished: false, isAvailable: true, createdAt: daysAgo(40) },
];

export const seedToppings: Topping[] = [
  { id: "t1", name: "Chedar", image: "/images/topping-cheese.png", price: 70, categoryId: "c1", isPublished: true, isAvailable: true, createdAt: daysAgo(400) },
  { id: "t2", name: "Chicken", image: "/images/topping-chicken.png", price: 90, categoryId: "c1", isPublished: true, isAvailable: true, createdAt: daysAgo(400) },
  { id: "t3", name: "Mushroom", image: "/images/topping-mushroom.png", price: 80, categoryId: "c1", isPublished: true, isAvailable: true, createdAt: daysAgo(399) },
  { id: "t4", name: "Jalapeno", image: "/images/topping-jalapeno.png", price: 30, categoryId: "c1", isPublished: true, isAvailable: false, createdAt: daysAgo(399) },
];

export const seedCoupons: Coupon[] = [
  { id: "cp1", code: "SUNFUN22", discount: 10, validTill: daysAgo(-57), isPublished: true, createdAt: daysAgo(60) },
  { id: "cp2", code: "SATFUN22", discount: 5, validTill: daysAgo(10), isPublished: true, createdAt: daysAgo(60) },
  { id: "cp3", code: "BLACKFRI22", discount: 5, validTill: daysAgo(-30), isPublished: true, createdAt: daysAgo(45) },
  { id: "cp4", code: "PIZZA10", discount: 10, validTill: daysAgo(-120), isPublished: false, createdAt: daysAgo(5) },
];

export const seedUsers: User[] = [
  { id: "u1", firstName: "Rakesh", lastName: "K", email: "rakesh@example.com", phone: "+91 98000 98998", role: "admin", designation: "Owner", avatar: "/images/avatar-1.png", isBanned: false, createdAt: daysAgo(430) },
  { id: "u2", firstName: "Ashwini", lastName: "K", email: "ashwini@example.com", phone: "+91 98111 22334", role: "customer", avatar: "/images/avatar-2.png", isBanned: true, createdAt: daysAgo(300) },
  { id: "u3", firstName: "Jane", lastName: "Doe", email: "janedoe@example.com", phone: "+91 98222 33445", role: "manager", designation: "Outlet manager", isBanned: false, createdAt: daysAgo(210) },
  { id: "u4", firstName: "John", lastName: "Doe", email: "john@example.com", phone: "+91 98333 44556", role: "customer", isBanned: false, createdAt: daysAgo(150) },
  { id: "u5", firstName: "Naman", lastName: "Kar", email: "naman@example.com", phone: "+91 98444 55667", role: "customer", isBanned: false, createdAt: daysAgo(80) },
  { id: "u6", firstName: "Priya", lastName: "Shah", email: "priya@example.com", phone: "+91 98555 66778", role: "manager", designation: "Kitchen head", isBanned: false, createdAt: daysAgo(20) },
];

const item = (productId: string, size: OrderItem["size"], qty: number, toppings: string[] = []): OrderItem => {
  const prod = seedProducts.find((x) => x.id === productId)!;
  const toppingTotal = toppings.reduce((s, n) => s + (seedToppings.find((t) => t.name === n)?.price ?? 0), 0);
  return { productId, name: prod.name, image: prod.image, size, toppings, qty, price: prod.prices[size] + toppingTotal };
};

const customers = [
  { name: "Rakesh Kohali", address: "Main street, Bandra, Mumbai 403 515", phone: "+91 98000 11111" },
  { name: "John Doe", address: "Left street, Bandra, Mumbai 403 515", phone: "+91 98000 22222" },
  { name: "Jane Doe", address: "Down street, Bandra, Mumbai 403 515", phone: "+91 98000 33333" },
  { name: "Naman Kar", address: "Down street, Bandra, Mumbai 403 515", phone: "+91 98000 44444" },
  { name: "Ashwini K", address: "Hill road, Bandra, Mumbai 403 050", phone: "+91 98000 55555" },
];

const orderItems: OrderItem[][] = [
  [item("p1", "small", 2, ["Mushroom", "Chicken", "Jalapeno", "Chedar"]), item("p2", "large", 3, ["Mushroom", "Chicken"])],
  [item("p3", "medium", 1, ["Chedar"]), item("p5", "small", 2)],
  [item("p2", "small", 1)],
  [item("p4", "large", 2, ["Jalapeno"]), item("p6", "medium", 2)],
  [item("p1", "medium", 1), item("p7", "small", 1)],
  [item("p3", "large", 2, ["Chicken", "Chedar"])],
];

const statuses: Order["status"][] = ["preparing", "out_for_delivery", "delivered", "delivered", "received", "delivered", "delivered"];
const payments: Order["paymentType"][] = ["card", "cash", "upi", "card", "upi"];
const comments = ["Please, make it as spicy as possible. Don't ring the bell, my baby is sleeping. Call me when you reach. 😀", "Extra napkins please", undefined, undefined];

export const seedOrders: Order[] = Array.from({ length: 24 }, (_, i) => {
  const items = orderItems[i % orderItems.length];
  const amount = items.reduce((s, it) => s + it.price * it.qty, 0);
  return {
    id: `34232${String(32 - i).padStart(2, "0")}`,
    customer: customers[i % customers.length],
    items,
    status: i < 3 ? statuses[i] : statuses[(i % 4) + 3],
    paymentType: payments[i % payments.length],
    amount,
    comment: comments[i % comments.length],
    placedAt: daysAgo(Math.floor(i * 1.3), 23 - (i % 10), (i * 17) % 60),
  };
});

/** Demo admin credentials (mock auth – replace with your API) */
export const DEMO_ADMIN = { email: "rakesh@example.com", password: "admin123" };
