import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Figma: white bar with title, search, filter selects and the coral "+ Create …" button */
export function ListToolbar({
  title,
  search,
  onSearch,
  searchPlaceholder = "Search",
  createLabel,
  createHref,
  onCreate,
  children,
}: {
  title?: string;
  search: string;
  onSearch: (v: string) => void;
  searchPlaceholder?: string;
  createLabel?: string;
  createHref?: string;
  onCreate?: () => void;
  children?: React.ReactNode;
}) {
  const createBtn = createLabel && (
    <Button size="sm" asChild={!!createHref} onClick={onCreate} className="sm:ml-auto">
      {createHref ? (
        <Link href={createHref}>
          <Plus /> {createLabel}
        </Link>
      ) : (
        <>
          <Plus /> {createLabel}
        </>
      )}
    </Button>
  );

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-lg bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center">
      {title && <h1 className="mr-4 text-base font-semibold">{title}</h1>}
      <div className={cn("relative w-full sm:w-56")}>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="h-9 border-transparent bg-muted pl-9 shadow-none"
        />
      </div>
      {children}
      {createBtn}
    </div>
  );
}
