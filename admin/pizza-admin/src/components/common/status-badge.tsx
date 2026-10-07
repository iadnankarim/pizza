import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types";

export const orderStatusMeta: Record<OrderStatus, { label: string; variant: "warning" | "info" | "success" | "secondary" }> = {
  received: { label: "Received", variant: "secondary" },
  preparing: { label: "Preparing", variant: "warning" },
  out_for_delivery: { label: "On the way", variant: "info" },
  delivered: { label: "Delivered", variant: "success" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const m = orderStatusMeta[status];
  return <Badge variant={m.variant}>{m.label}</Badge>;
}

export function PublishBadge({ published }: { published: boolean }) {
  return <Badge variant={published ? "success" : "draft"}>{published ? "Published" : "Draft"}</Badge>;
}

export function CouponBadge({ validTill, published }: { validTill: string; published: boolean }) {
  if (!published) return <Badge variant="draft">Draft</Badge>;
  const valid = new Date(validTill) >= new Date();
  return <Badge variant={valid ? "success" : "danger"}>{valid ? "valid" : "expired"}</Badge>;
}

export function UserStatusBadge({ banned }: { banned: boolean }) {
  return <Badge variant={banned ? "danger" : "success"}>{banned ? "banned" : "active"}</Badge>;
}
