import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { SectionCard } from "@/components/common/section-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Help" };

const faqs = [
  { q: "How do I move an order to the next step?", a: "Open the order and click a step in the status bar at the top: Received, Prepared, Out for delivery or Completed." },
  { q: "Why doesn't a product show on the website?", a: "Only products that are both Published and Available appear on the menu. Check the switches under Other properties." },
  { q: "How do coupons expire?", a: "A coupon is valid until the end of its Valid till date. After that it shows as expired and can no longer be applied." },
  { q: "Can I hide a category?", a: "Yes – turn off Publish in the category dialog. A category with products can't be deleted until its products are moved." },
];

export default function HelpPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Help" }]} />
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <SectionCard title="Frequently asked questions">
          <div className="divide-y">
            {faqs.map((f) => (
              <details key={f.q} className="group py-3">
                <summary className="cursor-pointer list-none text-sm font-medium marker:hidden group-open:text-primary">{f.q}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Still stuck?" className="h-fit">
          <p className="mb-4 text-sm text-muted-foreground">Our team usually replies within a few hours.</p>
          <div className="flex gap-2">
            <Button asChild size="sm"><a href="mailto:support@example.com"><Mail /> Email support</a></Button>
            <Button asChild size="sm" variant="ghost"><Link href="/">Back to dashboard</Link></Button>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
