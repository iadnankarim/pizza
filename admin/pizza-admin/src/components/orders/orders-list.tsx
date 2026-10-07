"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/common/page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { FilterSelect } from "@/components/common/filter-select";
import { TablePagination } from "@/components/common/table-pagination";
import { EmptyRow } from "@/components/common/empty-row";
import { OrderStatusBadge, orderStatusMeta } from "@/components/common/status-badge";
import { CreateOrderDialog } from "./create-order-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdmin } from "@/store/admin-store";
import { usePagination } from "@/hooks/use-pagination";
import { formatDateTime, formatPrice } from "@/lib/format";

const statusOptions = Object.entries(orderStatusMeta).map(([value, m]) => ({ value, label: m.label }));

export function OrdersList() {
  const router = useRouter();
  const orders = useAdmin((s) => s.orders);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders
      .filter((o) => (status === "all" || o.status === status) && (!q || o.customer.name.toLowerCase().includes(q) || o.id.includes(q) || o.customer.address.toLowerCase().includes(q)))
      .sort((a, b) => b.placedAt.localeCompare(a.placedAt));
  }, [orders, search, status]);
  const pager = usePagination(filtered);

  return (
    <>
      <PageHeader crumbs={[{ label: "Orders" }]} />
      <ListToolbar
        title="Orders"
        search={search}
        onSearch={(v) => {
          setSearch(v);
          pager.setPage(1);
        }}
        searchPlaceholder="Search name, address or #id"
        createLabel="Create order"
        onCreate={() => setOpen(true)}
      >
        <FilterSelect label="Status" value={status} onChange={setStatus} options={statusOptions} />
      </ListToolbar>

      <div className="overflow-hidden rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Customer name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Order status</TableHead>
              <TableHead>Order amount</TableHead>
              <TableHead>Placed time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pager.rows.length === 0 && <EmptyRow colSpan={5} />}
            {pager.rows.map((o) => (
              <TableRow
                key={o.id}
                tabIndex={0}
                role="link"
                aria-label={`Open order #${o.id}`}
                onClick={() => router.push(`/orders/${o.id}`)}
                onKeyDown={(e) => e.key === "Enter" && router.push(`/orders/${o.id}`)}
                className="cursor-pointer"
              >
                <TableCell className="py-5">
                  <p className="font-medium">{o.customer.name}</p>
                  <p className="text-xs text-muted-foreground">#{o.id}</p>
                </TableCell>
                <TableCell className="max-w-56 min-w-48 whitespace-normal">{o.customer.address}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={o.status} />
                </TableCell>
                <TableCell className="font-semibold tabular-nums">{formatPrice(o.amount)}</TableCell>
                <TableCell className="text-xs">{formatDateTime(o.placedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination {...pager} />
      </div>

      <CreateOrderDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
