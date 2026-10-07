"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { SectionCard } from "@/components/common/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/store/auth-store";
import { useAdmin } from "@/store/admin-store";

/** Not in Figma – restaurant settings + demo data reset */
export function SettingsForm() {
  const admin = useAuth((s) => s.admin);
  const updateProfile = useAuth((s) => s.updateProfile);
  const reset = useAdmin((s) => s.reset);
  const [restaurant, setRestaurant] = useState(admin?.restaurant ?? "");
  const [notify, setNotify] = useState({ newOrder: true, lowStock: false, daily: true });

  return (
    <>
      <PageHeader crumbs={[{ label: "Settings" }]} />
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Restaurant">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (restaurant.trim().length < 2) return toast.error("Enter the outlet location");
              updateProfile({ restaurant: restaurant.trim() });
              toast.success("Restaurant updated");
            }}
          >
            <div className="grid gap-1.5">
              <Label htmlFor="restaurant" className="text-xs font-normal text-muted-foreground">Outlet location</Label>
              <Input id="restaurant" value={restaurant} onChange={(e) => setRestaurant(e.target.value)} />
            </div>
            <Button type="submit" size="sm">Save</Button>
          </form>
        </SectionCard>

        <SectionCard title="Notifications">
          <div className="space-y-4">
            {([
              ["newOrder", "New order alerts"],
              ["lowStock", "Product unavailable alerts"],
              ["daily", "Daily sales summary email"],
            ] as const).map(([key, label]) => (
              <div key={key} className="flex items-center gap-3">
                <Switch id={key} checked={notify[key]} onCheckedChange={(v) => setNotify((n) => ({ ...n, [key]: v }))} />
                <Label htmlFor={key} className="font-normal">{label}</Label>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Demo data" className="lg:col-span-2">
          <p className="mb-4 text-sm text-muted-foreground">
            This admin runs on mock data saved in your browser. Reset it to the original sample orders, products and users.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm"><RotateCcw /> Reset demo data</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset all demo data?</AlertDialogTitle>
                <AlertDialogDescription>Everything you created or edited will be replaced with the sample data.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => { reset(); toast.success("Demo data reset"); }}>Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SectionCard>
      </div>
    </>
  );
}
