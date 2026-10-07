import { cn } from "@/lib/utils";

/** Figma: white rounded card with a bold title – used by every create/edit form */
export function SectionCard({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("rounded-lg bg-white p-5", className)}>
      <h2 className="mb-4 text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}
