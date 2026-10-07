import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/layout/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <AuthCard title="Login">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
