"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/store/auth-store";
import { useAdmin } from "@/store/admin-store";
import { DEMO_ADMIN } from "@/data/seed";

const schema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean(),
});

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const login = useAuth((s) => s.login);
  const users = useAdmin((s) => s.users);
  const [show, setShow] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = form.handleSubmit(({ email, password }) => {
    // Mock auth: demo admin credentials. Replace with your auth service call.
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.role !== "customer" && !u.isBanned);
    if (email.toLowerCase() !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password || !user) {
      form.setError("password", { message: "Invalid email or password" });
      return;
    }
    login({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, avatar: user.avatar, restaurant: "Bandra, Mumbai" });
    toast.success(`Welcome back, ${user.firstName}!`);
    const next = params.get("next");
    router.replace(next?.startsWith("/") ? next : "/");
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input type={show ? "text" : "password"} autoComplete="current-password" className="pr-10" {...field} />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(v === true)} />
              </FormControl>
              <FormLabel className="text-sm text-foreground">Remember me</FormLabel>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          <LogIn /> Log in
        </Button>
        <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
          Demo: <span className="font-medium text-foreground">{DEMO_ADMIN.email}</span> / <span className="font-medium text-foreground">{DEMO_ADMIN.password}</span>
        </p>
      </form>
    </Form>
  );
}
