"use client";

import { useState } from "react";

/** Client-side pagination. Page is clamped so filtering never leaves you on an empty page. */
export function usePagination<T>(items: T[], pageSize = 5) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(page, pageCount);
  const rows = items.slice((current - 1) * pageSize, current * pageSize);
  return { rows, page: current, pageCount, setPage, total: items.length, pageSize };
}
