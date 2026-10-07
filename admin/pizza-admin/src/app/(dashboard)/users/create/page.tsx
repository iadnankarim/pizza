import type { Metadata } from "next";
import { UserForm } from "@/components/users/user-form";

export const metadata: Metadata = { title: "Create user" };

export default function CreateUserPage() {
  return <UserForm />;
}
