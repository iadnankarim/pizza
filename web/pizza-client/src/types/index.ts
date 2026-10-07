export type Category = "pizza" | "drinks" | "sauces";

export type PizzaSize = "S" | "M" | "L";
export type Spiciness = "less" | "medium" | "hot";

export interface PriceOption {
  label: string; // "S", "M", "L" or "200ml", ...
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: Category;
  options: PriceOption[]; // at least one
  tags?: ("veg" | "non-veg" | "spicy" | "hit" | "juice" | "soda" | "alcohol")[];
  spicy?: boolean;
}

export interface Topping {
  id: string;
  name: string;
  image: string;
  price: number;
}

export interface CartItem {
  key: string; // productId + option + toppings + spice
  productId: string;
  name: string;
  image: string;
  option: string;
  unitPrice: number; // option price + toppings
  toppings: Topping[];
  spice?: Spiciness;
  qty: number;
}

export type OrderStatus = "received" | "preparing" | "out_for_delivery" | "delivered";

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  taxes: number;
  delivery: number;
  discount: number;
  total: number;
  paymentType: "cod" | "online";
  address: Address;
  restaurant: string;
  status: OrderStatus;
  createdAt: string;
  rating?: number;
}

export interface Address {
  id: string;
  name: string;
  line: string;
}
