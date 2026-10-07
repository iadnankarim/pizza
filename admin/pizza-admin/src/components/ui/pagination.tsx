import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav role="navigation" aria-label="pagination" data-slot="pagination" className={cn("flex justify-end", className)} {...props} />;
}
function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("flex flex-row items-center gap-1.5", className)} {...props} />;
}
function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationButtonProps = { isActive?: boolean } & React.ComponentProps<"button">;

/** Figma: small square page buttons, active one has primary border */
function PaginationButton({ className, isActive, ...props }: PaginationButtonProps) {
  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      data-active={isActive}
      className={cn(
        "grid size-8 place-items-center rounded-md border bg-white text-xs transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40",
        isActive && "border-primary text-primary",
        className
      )}
      {...props}
    />
  );
}
function PaginationPrevious(props: React.ComponentProps<"button">) {
  return (
    <PaginationButton aria-label="Go to previous page" {...props}>
      <ChevronLeft className="size-3.5" />
    </PaginationButton>
  );
}
function PaginationNext(props: React.ComponentProps<"button">) {
  return (
    <PaginationButton aria-label="Go to next page" {...props}>
      <ChevronRight className="size-3.5" />
    </PaginationButton>
  );
}
function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span aria-hidden data-slot="pagination-ellipsis" className={cn("flex size-8 items-center justify-center", className)} {...props}>
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export { Pagination, PaginationContent, PaginationItem, PaginationButton, PaginationPrevious, PaginationNext, PaginationEllipsis };
