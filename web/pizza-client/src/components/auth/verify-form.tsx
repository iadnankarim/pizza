"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth, DEMO_OTP } from "@/store/auth-store";
import { useMounted } from "@/hooks/use-mounted";

export function VerifyForm() {
  const router = useRouter();
  const mounted = useMounted();
  const next = useSearchParams().get("next") ?? "/";
  const pendingEmail = useAuth((s) => s.pendingEmail);
  const verifyOtp = useAuth((s) => s.verifyOtp);
  const user = useAuth((s) => s.user);
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    // no OTP requested yet (e.g. page opened directly) -> back to email step
    if (mounted && !pendingEmail && !user) router.replace("/login");
  }, [mounted, pendingEmail, user, router]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyOtp(otp, name.trim() || "Guest")) {
      toast.success("Logged in successfully");
      router.push(next);
    } else {
      toast.error("Wrong OTP", { description: `Hint: use ${DEMO_OTP}` });
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <Label>Enter OTP which we sent you by mail</Label>
        <InputOTP autoFocus maxLength={6} value={otp} onChange={setOtp} aria-label="One-time password">
          <InputOTPGroup>
            {Array.from({ length: 6 }).map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        {mounted && pendingEmail && (
          <p className="text-xs text-muted-foreground">
            Sent to {pendingEmail}.{" "}
            <Link href="/login" className="text-primary hover:underline">
              Change
            </Link>
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="name">Your name</Label>
        <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="bg-muted/60" />
      </div>
      <Button type="submit" size="lg" className="mx-auto w-full max-w-56" disabled={otp.length < 6}>
        Done
      </Button>
    </form>
  );
}
