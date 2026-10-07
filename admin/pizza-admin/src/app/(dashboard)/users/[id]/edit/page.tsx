import type { Metadata } from "next";
import { EditUser } from "@/components/users/user-form";

export const metadata: Metadata = { title: "Edit user" };

export default async function EditUserPage({ params }: PageProps<"/users/[id]/edit">) {
  const { id } = await params;
  return <EditUser id={id} />;
}
