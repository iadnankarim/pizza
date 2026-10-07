import type { Metadata } from "next";
import { CouponsList } from "@/components/coupons/coupons-list";

export const metadata: Metadata = { title: "Coupons" };

export default function CouponsPage() {
  return <CouponsList />;
}
