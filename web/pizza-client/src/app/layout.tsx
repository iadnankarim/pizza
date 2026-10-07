import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: { default: "Pizza – Get yummy pizza in 30 min", template: "%s | Pizza" },
  description: "Order pizza, drinks and sauces online. Delivered in 30 minutes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
