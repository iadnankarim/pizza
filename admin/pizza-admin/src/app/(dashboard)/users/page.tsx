import type { Metadata } from "next";
import { UsersList } from "@/components/users/users-list";

export const metadata: Metadata = { title: "Users" };

export default function UsersPage() {
  return <UsersList />;
}
