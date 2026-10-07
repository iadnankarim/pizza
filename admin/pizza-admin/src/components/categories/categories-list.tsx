"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { TablePagination } from "@/components/common/table-pagination";
import { EmptyRow } from "@/components/common/empty-row";
import { PublishBadge } from "@/components/common/status-badge";
import { RowActions } from "@/components/common/row-actions";
import { CategoryDialog } from "./category-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdmin } from "@/store/admin-store";
import { usePagination } from "@/hooks/use-pagination";
import { formatDate } from "@/lib/format";
import type { Category } from "@/types";

export function CategoriesList() {
  const categories = useAdmin((s) => s.categories);
  const products = useAdmin((s) => s.products);
  const { remove } = useAdmin((s) => s.category);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<{ open: boolean; category?: Category }>({ open: false });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return categories.filter((c) => !q || c.name.toLowerCase().includes(q));
  }, [categories, search]);
  const pager = usePagination(filtered);
  const count = (id: string) => products.filter((p) => p.categoryId === id).length;

  return (
    <>
      <PageHeader crumbs={[{ label: "Categories" }]} />
      <ListToolbar title="Categories" search={search} onSearch={setSearch} searchPlaceholder="Search categories" createLabel="Create Category" onCreate={() => setDialog({ open: true })} />

      <div className="overflow-hidden rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Category name</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="w-10"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pager.rows.length === 0 && <EmptyRow colSpan={5} />}
            {pager.rows.map((c) => (
              <TableRow key={c.id} onClick={() => setDialog({ open: true, category: c })} className="cursor-pointer">
                <TableCell className="py-5 font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{count(c.id)}</TableCell>
                <TableCell><PublishBadge published={c.isPublished} /></TableCell>
                <TableCell className="text-xs">{formatDate(c.createdAt)}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <RowActions
                    name={c.name}
                    onEdit={() => setDialog({ open: true, category: c })}
                    onDelete={() => {
                      if (count(c.id) > 0) return toast.error(`Move or delete the ${count(c.id)} product(s) in ${c.name} first`);
                      remove(c.id);
                      toast.success(`${c.name} deleted`);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination {...pager} />
      </div>

      <CategoryDialog open={dialog.open} category={dialog.category} onOpenChange={(open) => setDialog((d) => ({ ...d, open }))} />
    </>
  );
}
