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
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "@/store/admin-store";
import { usePagination } from "@/hooks/use-pagination";
import { formatDate } from "@/lib/format";

const statusOptions = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

export function ProductsList() {
  const router = useRouter();
  const products = useAdmin((s) => s.products);
  const categories = useAdmin((s) => s.categories);
  const { remove } = useAdmin((s) => s.product);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q)) &&
        (category === "all" || p.categoryId === category) &&
        (status === "all" || (status === "published") === p.isPublished)
    );
  }, [products, search, category, status]);
  const pager = usePagination(filtered);

  return (
    <>
      <PageHeader crumbs={[{ label: "Products" }]} />
      <ListToolbar title="Products" search={search} onSearch={setSearch} searchPlaceholder="Search products" createLabel="Create product" createHref="/products/create">
        <FilterSelect label="Category" value={category} onChange={setCategory} options={categories.map((c) => ({ value: c.id, label: c.name }))} />
        <FilterSelect label="Status" value={status} onChange={setStatus} options={statusOptions} />
      </ListToolbar>

      <div className="overflow-hidden rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Product name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="w-10"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pager.rows.length === 0 && <EmptyRow colSpan={6} />}
            {pager.rows.map((p) => (
              <TableRow key={p.id} onClick={() => router.push(`/products/${p.id}/edit`)} className="cursor-pointer">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Thumb src={p.image} />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <div className="mt-0.5 flex gap-1">
                        {p.isHit && <Badge variant="warning" className="px-1.5 py-0 text-[10px]">Hit</Badge>}
                        {!p.isAvailable && <Badge variant="danger" className="px-1.5 py-0 text-[10px]">Unavailable</Badge>}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-56">
                  <p className="line-clamp-2 whitespace-normal text-xs">{p.description}</p>
                </TableCell>
                <TableCell>{catName(p.categoryId)}</TableCell>
                <TableCell><PublishBadge published={p.isPublished} /></TableCell>
                <TableCell className="text-xs">{formatDate(p.createdAt)}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <RowActions
                    name={p.name}
                    editHref={`/products/${p.id}/edit`}
                    onDelete={() => {
                      remove(p.id);
                      toast.success(`${p.name} deleted`);
                    }}
                  />
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
