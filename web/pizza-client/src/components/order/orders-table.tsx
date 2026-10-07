"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./status";
import { formatDate } from "./order-detail";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

const paymentLabel: Record<Order["paymentType"], string> = { cod: "Cash on delivery", online: "Online" };

/** Figma: Client Front → "My orders" (table view) */
export function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl bg-white">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Order ID</TableHead>
            <TableHead>Order summary</TableHead>
            <TableHead>Order date</TableHead>
            <TableHead>Payment type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Order status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => {
            const summary = o.items.map((i) => `${i.name} ×${i.qty}`).join(", ");
            return (
              <TableRow key={o.id} onClick={() => router.push(`/orders/${o.id}`)} className="cursor-pointer">
                <TableCell>
                  <Link href={`/orders/${o.id}`} onClick={(e) => e.stopPropagation()} className="font-medium hover:text-primary">
                    #{o.id}
                  </Link>
                </TableCell>
                <TableCell className="max-w-64 truncate text-muted-foreground" title={summary}>
                  {summary}
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(o.createdAt)}</TableCell>
                <TableCell>{paymentLabel[o.paymentType]}</TableCell>
                <TableCell className="text-right font-medium">{formatPrice(o.total)}</TableCell>
                <TableCell>
                  <StatusBadge status={o.status} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
