"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, DEMO_OTP } from "@/store/auth-store";

export function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/";
  const requestOtp = useAuth((s) => s.requestOtp);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500)); // replace with POST /api/auth/send-otp
    requestOtp(email);
    toast.success(`OTP sent to ${email}`, { description: `Demo OTP: ${DEMO_OTP}` });
    router.push(`/login/verify?next=${encodeURIComponent(next)}`);
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-muted/60" />
      </div>
      <Button type="submit" size="lg" className="mx-auto w-full max-w-56" disabled={loading}>
        {loading && <Loader2 className="animate-spin" />} Send OTP
      </Button>
    </form>
  );
}
