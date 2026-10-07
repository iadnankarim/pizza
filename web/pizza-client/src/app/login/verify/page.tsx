import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/layout/auth-card";
import { VerifyForm } from "@/components/auth/verify-form";

export const metadata: Metadata = { title: "Verify OTP" };

export default function VerifyPage() {
  return (
    <AuthCard title="Password">
      <Suspense>
        <VerifyForm />
      </Suspense>
    </AuthCard>
  );
}
