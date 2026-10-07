import { BarChart3, CircleHelp, Layers, LayoutGrid, Settings, Shapes, ShoppingBag, ShoppingBasket, Ticket, Users } from "lucide-react";

export const mainNav = [
  { href: "/", label: "Home", icon: LayoutGrid },
  { href: "/orders", label: "Orders", icon: ShoppingBasket },
  { href: "/products", label: "Products", icon: ShoppingBag },
  { href: "/toppings", label: "Toppings", icon: Layers },
  { href: "/categories", label: "Categories", icon: Shapes },
  { href: "/coupons", label: "Promos", icon: Ticket },
  { href: "/users", label: "Users", icon: Users },
  { href: "/sales", label: "Sales", icon: BarChart3 },
];

export const footerNav = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: CircleHelp },
];
