import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function pages(current: number, count: number): (number | "…")[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const set = new Set([1, count, current - 1, current, current + 1].filter((p) => p >= 1 && p <= count));
  const sorted = [...set].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? (["…", p] as const) : [p]));
}

export function TablePagination({
  page,
  pageCount,
  setPage,
  total,
  pageSize,
}: {
  page: number;
  pageCount: number;
  setPage: (p: number) => void;
  total: number;
  pageSize: number;
}) {
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <div className="flex flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row">
      <p className="text-xs text-muted-foreground">
        Showing {from}–{to} of {total}
      </p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious disabled={page === 1} onClick={() => setPage(page - 1)} />
          </PaginationItem>
          {pages(page, pageCount).map((p, i) => (
            <PaginationItem key={`${p}-${i}`}>
              {p === "…" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationButton isActive={p === page} onClick={() => setPage(p)}>
                  {p}
                </PaginationButton>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext disabled={page === pageCount} onClick={() => setPage(page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
