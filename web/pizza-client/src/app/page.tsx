import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MenuSection } from "@/components/product/menu-section";

export default function HomePage() {
  return (
    <>
      {/* Hero – Figma: Modern Pizza Home */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Get yummy pizza <br />
              in <span className="text-primary">30 min</span>
            </h1>
            <p className="mt-5 max-w-sm text-lg text-muted-foreground">
              No need to pay if, order took more than 30 min
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full">
              <Link href="#menu">
                Order Now <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <Image src="/images/pizza-hero.png" alt="Pepperoni pizza" fill priority sizes="(max-width: 768px) 90vw, 450px" className="object-contain" />
          </div>
        </div>
      </section>

      {/* Figma: 3 sections below the hero – Pizza, Softdrinks, Sauces */}
      <div className="py-6">
        <MenuSection defaultCategory="pizza" />
        <MenuSection defaultCategory="drinks" />
        <MenuSection defaultCategory="sauces" />
      </div>
    </>
  );
}
