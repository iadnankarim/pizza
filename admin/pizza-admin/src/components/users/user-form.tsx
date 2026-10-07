"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { TextField } from "./fields";
import { PageHeader } from "@/components/common/page-header";
import { SectionCard } from "@/components/common/section-card";
import { FileUpload } from "@/components/common/file-upload";
import { FormActions } from "@/components/common/form-actions";
import { NotFound } from "@/components/common/not-found";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdmin } from "@/store/admin-store";
import { useAuth } from "@/store/auth-store";
import { useMounted } from "@/hooks/use-mounted";
import { uid } from "@/lib/format";
import type { User } from "@/types";

const base = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.email("Enter a valid email"),
  phone: z.string().trim().min(7, "Enter a phone number"),
  avatar: z.string().optional(),
  role: z.enum(["admin", "manager", "customer"]),
  designation: z.string().optional(),
  isBanned: z.boolean(),
  password: z.string(),
  confirmPassword: z.string(),
});

const makeSchema = (isEdit: boolean) =>
  base
    .refine((v) => (isEdit && !v.password) || v.password.length >= 8, { path: ["password"], message: isEdit ? "At least 8 characters" : "Password must be at least 8 characters" })
    .refine((v) => v.password === v.confirmPassword, { path: ["confirmPassword"], message: "Passwords don't match" });
type Values = z.infer<typeof base>;

/** Figma: Admin Panel → Create User */
export function UserForm({ user }: { user?: User }) {
  const router = useRouter();
  const users = useAdmin((s) => s.users);
  const { add, update } = useAdmin((s) => s.user);
  const me = useAuth((s) => s.admin);

  const form = useForm<Values>({
    resolver: zodResolver(makeSchema(!!user)),
    defaultValues: user
      ? { ...user, designation: user.designation ?? "", password: "", confirmPassword: "" }
      : { firstName: "", lastName: "", email: "", phone: "", role: "manager", designation: "", isBanned: false, password: "", confirmPassword: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    const { firstName, lastName, email, phone, avatar, role, designation, isBanned } = values;
    const v = { firstName, lastName, email, phone, avatar, role, designation, isBanned };
    if (users.some((u) => u.id !== user?.id && u.email.toLowerCase() === v.email.toLowerCase())) {
      return form.setError("email", { message: "A user with this email already exists" });
    }
    if (user && user.id === me?.id && v.isBanned) return form.setError("isBanned", { message: "You can't ban yourself" });
    // Passwords would be sent to the auth service here – never stored in the client.
    if (user) {
      update(user.id, v);
      toast.success("User updated");
    } else {
      add({ ...v, id: uid("u"), createdAt: new Date().toISOString() });
      toast.success("User created");
    }
    router.push("/users");
  });

  return (
    <>
      <PageHeader crumbs={[{ label: "Users", href: "/users" }, { label: user ? "Edit" : "Create" }]}>
        <FormActions form="user-form" />
      </PageHeader>
      <Form {...form}>
        <form id="user-form" onSubmit={onSubmit} className="grid gap-5 lg:grid-cols-[1.6fr_1fr]" noValidate>
          <div className="space-y-5">
            <SectionCard title="Basic info">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField control={form.control} name="firstName" label="First name" autoComplete="off" />
                <TextField control={form.control} name="lastName" label="Last name" autoComplete="off" />
                <TextField control={form.control} name="email" label="Email" type="email" autoComplete="off" />
                <TextField control={form.control} name="phone" label="Phone number" type="tel" autoComplete="off" />
              </div>
            </SectionCard>
            <SectionCard title="Profile image">
              <FormField control={form.control} name="avatar" render={({ field }) => (
                <FormItem>
                  <FileUpload value={field.value} onChange={field.onChange} />
                </FormItem>
              )} />
            </SectionCard>
            <SectionCard title="Security info">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField control={form.control} name="password" label={user ? "New password (optional)" : "Password"} type="password" autoComplete="new-password" />
                <TextField control={form.control} name="confirmPassword" label="Confirm password" type="password" autoComplete="new-password" />
              </div>
            </SectionCard>
          </div>
          <div className="space-y-5">
            <SectionCard title="Roles">
              <div className="space-y-4">
                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select role</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager (Employee)</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <TextField control={form.control} name="designation" label="Designation" placeholder="Outlet manager" />
              </div>
            </SectionCard>
            <SectionCard title="Other properties">
              <FormField control={form.control} name="isBanned" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="text-sm text-foreground">Ban</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
            </SectionCard>
          </div>
        </form>
      </Form>
    </>
  );
}

export function EditUser({ id }: { id: string }) {
  const mounted = useMounted();
  const user = useAdmin((s) => s.users.find((u) => u.id === id));
  if (!mounted) return <Skeleton className="h-96 w-full" />;
  if (!user) return <NotFound what="User" href="/users" />;
  return <UserForm user={user} />;
}
