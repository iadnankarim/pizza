"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { TextField } from "@/components/users/fields";
import { PageHeader } from "@/components/common/page-header";
import { SectionCard } from "@/components/common/section-card";
import { FileUpload } from "@/components/common/file-upload";
import { FormActions } from "@/components/common/form-actions";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { useAuth, type AdminProfile } from "@/store/auth-store";
import { useAdmin } from "@/store/admin-store";

const schema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z.email("Enter a valid email"),
    phone: z.string().trim().min(7, "Enter a phone number"),
    avatar: z.string().optional(),
    password: z.string().refine((v) => !v || v.length >= 8, "At least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, { path: ["confirmPassword"], message: "Passwords don't match" });
type Values = z.infer<typeof schema>;

/** Figma: Admin Panel → User Profile (Dashboard > Profile > update) */
export function ProfileForm() {
  const admin = useAuth((s) => s.admin);
  if (!admin) return null;
  return <ProfileFormInner admin={admin} />;
}

function ProfileFormInner({ admin }: { admin: AdminProfile }) {
  const updateProfile = useAuth((s) => s.updateProfile);
  const updateUser = useAdmin((s) => s.user.update);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: admin.firstName, lastName: admin.lastName, email: admin.email, phone: admin.phone, avatar: admin.avatar, password: "", confirmPassword: "" },
  });

  const onSubmit = form.handleSubmit(({ password, ...rest }) => {
    const { firstName, lastName, email, phone, avatar } = rest;
    const v = { firstName, lastName, email, phone, avatar };
    updateProfile(v);
    updateUser(admin.id, v); // keep the Users list in sync
    form.reset({ ...v, password: "", confirmPassword: "" });
    toast.success(password ? "Profile and password updated" : "Profile updated");
  });

  return (
    <>
      <PageHeader crumbs={[{ label: "Profile" }, { label: "update" }]}>
        <FormActions form="profile-form" />
      </PageHeader>
      <Form {...form}>
        <form id="profile-form" onSubmit={onSubmit} className="grid gap-5 lg:grid-cols-[1.6fr_1fr]" noValidate>
          <div className="space-y-5">
            <SectionCard title="Basic info">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField control={form.control} name="firstName" label="First name" autoComplete="given-name" />
                <TextField control={form.control} name="lastName" label="Last name" autoComplete="family-name" />
                <TextField control={form.control} name="email" label="Email" type="email" autoComplete="email" />
                <TextField control={form.control} name="phone" label="Phone number" type="tel" autoComplete="tel" />
              </div>
            </SectionCard>
            <SectionCard title="Security info">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField control={form.control} name="password" label="Password" type="password" autoComplete="new-password" placeholder="Leave blank to keep current" />
                <TextField control={form.control} name="confirmPassword" label="Confirm password" type="password" autoComplete="new-password" />
              </div>
            </SectionCard>
          </div>
          <SectionCard title="Profile image" className="h-fit">
            <FormField control={form.control} name="avatar" render={({ field }) => (
              <FormItem>
                <FileUpload value={field.value} onChange={field.onChange} className="h-40" />
              </FormItem>
            )} />
          </SectionCard>
        </form>
      </Form>
    </>
  );
}
