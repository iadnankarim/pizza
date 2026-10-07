import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm">
        <Logo className="mb-6 justify-center text-base" />
        <div className="rounded-lg bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
          <h1 className="text-lg font-semibold">Sign in to admin</h1>
          <p className="mb-5 text-sm text-muted-foreground">Manage orders, menu, promos and users.</p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
