"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { FilterSelect } from "@/components/common/filter-select";
import { TablePagination } from "@/components/common/table-pagination";
import { EmptyRow } from "@/components/common/empty-row";
import { CouponBadge } from "@/components/common/status-badge";
import { RowActions } from "@/components/common/row-actions";
import { CouponDialog } from "./coupon-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdmin } from "@/store/admin-store";
import { usePagination } from "@/hooks/use-pagination";
import { formatDate } from "@/lib/format";
import type { Coupon } from "@/types";

const couponState = (c: Coupon) => (!c.isPublished ? "draft" : new Date(c.validTill) >= new Date() ? "valid" : "expired");

export function CouponsList() {
  const coupons = useAdmin((s) => s.coupons);
  const { remove } = useAdmin((s) => s.coupon);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dialog, setDialog] = useState<{ open: boolean; coupon?: Coupon }>({ open: false });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return coupons.filter((c) => (!q || c.code.toLowerCase().includes(q)) && (status === "all" || couponState(c) === status));
  }, [coupons, search, status]);
  const pager = usePagination(filtered);

  return (
    <>
      <PageHeader crumbs={[{ label: "Coupons" }]} />
      <ListToolbar title="Coupons" search={search} onSearch={setSearch} searchPlaceholder="Search coupons" createLabel="Create coupon" onCreate={() => setDialog({ open: true })}>
        <FilterSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={[{ value: "valid", label: "Valid" }, { value: "expired", label: "Expired" }, { value: "draft", label: "Draft" }]}
        />
      </ListToolbar>

      <div className="overflow-hidden rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Coupon name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Off percentage</TableHead>
              <TableHead>Valid till</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="w-10"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pager.rows.length === 0 && <EmptyRow colSpan={6} />}
            {pager.rows.map((c) => (
              <TableRow key={c.id} onClick={() => setDialog({ open: true, coupon: c })} className="cursor-pointer">
                <TableCell className="py-5 font-medium">{c.code}</TableCell>
                <TableCell><CouponBadge validTill={c.validTill} published={c.isPublished} /></TableCell>
                <TableCell>{c.discount}%</TableCell>
                <TableCell className="text-xs">{formatDate(c.validTill)}</TableCell>
                <TableCell className="text-xs">{formatDate(c.createdAt)}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <RowActions name={c.code} onEdit={() => setDialog({ open: true, coupon: c })} onDelete={() => { remove(c.id); toast.success(`${c.code} deleted`); }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination {...pager} />
      </div>

      <CouponDialog open={dialog.open} coupon={dialog.coupon} onOpenChange={(open) => setDialog((d) => ({ ...d, open }))} />
    </>
  );
}
