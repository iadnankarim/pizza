"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, CreditCard, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { SelectCard } from "@/components/order/select-card";
import { addresses as seedAddresses, restaurants } from "@/data/products";
import { useCart, getTotals } from "@/store/cart-store";
import { useAuth } from "@/store/auth-store";
import { useOrders } from "@/store/order-store";
import { useMounted } from "@/hooks/use-mounted";
import { formatPrice } from "@/lib/utils";
import type { Address } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const mounted = useMounted();
  const { items, coupon, applyCoupon, removeCoupon, clear } = useCart();
  const user = useAuth((s) => s.user);
  const place = useOrders((s) => s.place);
  const totals = getTotals(items, coupon);

  const [addresses, setAddresses] = useState<Address[]>(seedAddresses);
  const [addressId, setAddressId] = useState(seedAddresses[0].id);
  const [restaurant, setRestaurant] = useState(restaurants[0].id);
  const [payment, setPayment] = useState<"cod" | "online">("cod");
  const [code, setCode] = useState("");
  const [comment, setComment] = useState("");
  const [placing, setPlacing] = useState(false);

  // add-address dialog
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLine, setNewLine] = useState("");

  const saveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newLine.trim()) return;
    const a = { id: `a${Date.now()}`, name: newName.trim(), line: newLine.trim() };
    setAddresses((s) => [...s, a]);
    setAddressId(a.id);
    setNewName("");
    setNewLine("");
    setAddOpen(false);
  };

  const onApply = () => {
    if (applyCoupon(code)) toast.success("Coupon applied");
    else toast.error("Invalid coupon code. Try PIZZA10");
  };

  const onCheckout = async () => {
    if (!user) {
      toast.info("Please log in to place your order");
      router.push("/login?next=/checkout");
      return;
    }
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 700)); // replace with POST /api/orders
    const order = place({
      items,
      subtotal: totals.subtotal,
      taxes: totals.taxes,
      delivery: totals.delivery,
      discount: totals.discount,
      total: totals.total,
      paymentType: payment,
      address: addresses.find((a) => a.id === addressId)!,
      restaurant: restaurants.find((r) => r.id === restaurant)!.name,
    });
    clear();
    toast.success("Order placed successfully!");
    router.push(`/orders/${order.id}`);
  };

  if (mounted && items.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button asChild className="mt-4">
          <Link href="/#menu">Browse menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Address</h2>
            <div role="radiogroup" aria-label="Delivery address" className="grid gap-3 sm:grid-cols-3">
              {addresses.map((a) => (
                <SelectCard key={a.id} selected={addressId === a.id} onClick={() => setAddressId(a.id)}>
                  <p className="font-semibold">{a.name}</p>
                  <p className="mt-2 text-muted-foreground">{a.line}</p>
                </SelectCard>
              ))}
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <button
                  type="button"
                  onClick={() => setAddOpen(true)}
                  className="flex min-h-28 flex-col items-center justify-center gap-1 rounded-xl border border-dashed bg-white text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground"
                >
                  <Plus className="size-6" /> Add address
                </button>
                <DialogContent>
                  <form onSubmit={saveAddress} className="grid gap-4">
                    <DialogHeader>
                      <DialogTitle>Add address</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2">
                      <Label htmlFor="addr-name">Name</Label>
                      <Input id="addr-name" value={newName} onChange={(e) => setNewName(e.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="addr-line">Address</Label>
                      <Textarea id="addr-line" value={newLine} onChange={(e) => setNewLine(e.target.value)} required />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="ghost">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit">
                        <Plus /> Save
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Restaurant</h2>
            <div role="radiogroup" aria-label="Restaurant" className="grid gap-3 sm:grid-cols-3">
              {restaurants.map((r) => (
                <SelectCard key={r.id} selected={restaurant === r.id} onClick={() => setRestaurant(r.id)}>
                  <p className="font-semibold">{r.name}</p>
                  <p className="mt-2 text-muted-foreground">{r.line}</p>
                </SelectCard>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Payment type</h2>
            <div role="radiogroup" aria-label="Payment type" className="flex flex-wrap gap-3">
              <SelectCard selected={payment === "cod"} onClick={() => setPayment("cod")} className="flex w-40 items-center gap-2 py-3">
                <Banknote className="size-4" /> COD
              </SelectCard>
              <SelectCard selected={payment === "online"} onClick={() => setPayment("online")} className="flex w-40 items-center gap-2 py-3">
                <CreditCard className="size-4" /> Online
              </SelectCard>
            </div>
          </section>

          <section>
            <Label htmlFor="comment" className="mb-3 text-sm font-semibold text-muted-foreground">
              Comment (optional)
            </Label>
            <Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="e.g. Ring the bell twice" />
          </section>
        </div>

        {/* Payment summary */}
        <aside className="h-fit rounded-2xl bg-white p-6 lg:sticky lg:top-24">
          <h2 className="mb-5 text-lg font-semibold">Payment summary</h2>
          <dl className="space-y-4 text-sm">
            <Row label="Subtotal" value={formatPrice(mounted ? totals.subtotal : 0)} />
            {totals.discount > 0 && mounted && (
              <Row
                label={
                  <span>
                    Discount ({coupon}){" "}
                    <button onClick={removeCoupon} className="text-xs text-primary hover:underline">
                      remove
                    </button>
                  </span>
                }
                value={`-${formatPrice(totals.discount)}`}
              />
            )}
            <Row label="Taxes (5%)" value={formatPrice(mounted ? totals.taxes : 0)} />
            <Row label="Delivery charges" value={formatPrice(mounted ? totals.delivery : 0)} />
            <Separator />
            <Row label={<span className="font-semibold text-foreground">Order total</span>} value={<span className="text-base font-bold">{formatPrice(mounted ? totals.total : 0)}</span>} />
          </dl>

          <div className="mt-5 flex overflow-hidden rounded-md bg-muted">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Coupon code"
              className="rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              aria-label="Coupon code"
            />
            <Button type="button" variant="secondary" onClick={onApply} className="rounded-none bg-neutral-400 text-white hover:bg-neutral-500">
              Apply
            </Button>
          </div>

          <Button size="lg" className="mt-6 w-full" onClick={onCheckout} disabled={placing || !mounted}>
            {placing && <Loader2 className="animate-spin" />} Checkout
          </Button>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
