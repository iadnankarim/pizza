"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { FilterSelect } from "@/components/common/filter-select";
import { TablePagination } from "@/components/common/table-pagination";
import { EmptyRow } from "@/components/common/empty-row";
import { PublishBadge } from "@/components/common/status-badge";
import { RowActions } from "@/components/common/row-actions";
import { Thumb } from "@/components/common/thumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdmin } from "@/store/admin-store";
import { usePagination } from "@/hooks/use-pagination";
import { formatDate, formatPrice } from "@/lib/format";

export function ToppingsList() {
  const router = useRouter();
  const toppings = useAdmin((s) => s.toppings);
  const categories = useAdmin((s) => s.categories);
  const { remove } = useAdmin((s) => s.topping);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return toppings.filter((t) => (!q || t.name.toLowerCase().includes(q)) && (status === "all" || (status === "published") === t.isPublished));
  }, [toppings, search, status]);
  const pager = usePagination(filtered);

  return (
    <>
      <PageHeader crumbs={[{ label: "Toppings" }]} />
      <ListToolbar title="Toppings" search={search} onSearch={setSearch} searchPlaceholder="Search toppings" createLabel="Create Topping" createHref="/toppings/create">
        <FilterSelect label="Status" value={status} onChange={setStatus} options={[{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }]} />
      </ListToolbar>

      <div className="overflow-hidden rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Topping&apos;s name</TableHead>
              <TableHead>Available for</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="w-10"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pager.rows.length === 0 && <EmptyRow colSpan={6} />}
            {pager.rows.map((t) => (
              <TableRow key={t.id} onClick={() => router.push(`/toppings/${t.id}/edit`)} className="cursor-pointer">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Thumb src={t.image} className="size-7" />
                    <span className="font-medium">{t.name}</span>
                  </div>
                </TableCell>
                <TableCell>{categories.find((c) => c.id === t.categoryId)?.name ?? "—"}</TableCell>
                <TableCell className="tabular-nums">{formatPrice(t.price)}</TableCell>
                <TableCell><PublishBadge published={t.isPublished} /></TableCell>
                <TableCell className="text-xs">{formatDate(t.createdAt)}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <RowActions name={t.name} editHref={`/toppings/${t.id}/edit`} onDelete={() => { remove(t.id); toast.success(`${t.name} deleted`); }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination {...pager} />
      </div>
    </>
  );
}
