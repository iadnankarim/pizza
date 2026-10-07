"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { FilterSelect } from "@/components/common/filter-select";
import { TablePagination } from "@/components/common/table-pagination";
import { EmptyRow } from "@/components/common/empty-row";
import { UserStatusBadge } from "@/components/common/status-badge";
import { RowActions } from "@/components/common/row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdmin } from "@/store/admin-store";
import { useAuth } from "@/store/auth-store";
import { usePagination } from "@/hooks/use-pagination";
import { formatDate, initials } from "@/lib/format";

export const roleLabel = { admin: "Admin", manager: "Manager", customer: "Customer" } as const;

export function UsersList() {
  const router = useRouter();
  const users = useAdmin((s) => s.users);
  const { remove } = useAdmin((s) => s.user);
  const me = useAuth((s) => s.admin);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter(
      (u) =>
        (!q || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q)) &&
        (status === "all" || (status === "banned") === u.isBanned) &&
        (role === "all" || u.role === role)
    );
  }, [users, search, status, role]);
  const pager = usePagination(filtered);

  return (
    <>
      <PageHeader crumbs={[{ label: "Users" }]} />
      <ListToolbar search={search} onSearch={setSearch} searchPlaceholder="Search name or email" createLabel="Create users" createHref="/users/create">
        <FilterSelect label="Status" value={status} onChange={setStatus} options={[{ value: "active", label: "Active" }, { value: "banned", label: "Banned" }]} />
        <FilterSelect label="Role" value={role} onChange={setRole} options={Object.entries(roleLabel).map(([value, label]) => ({ value, label }))} />
      </ListToolbar>

      <div className="overflow-hidden rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>User name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="w-10"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pager.rows.length === 0 && <EmptyRow colSpan={6} />}
            {pager.rows.map((u) => {
              const name = `${u.firstName} ${u.lastName}`;
              return (
                <TableRow key={u.id} onClick={() => router.push(`/users/${u.id}/edit`)} className="cursor-pointer">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        {u.avatar && <AvatarImage src={u.avatar} alt="" />}
                        <AvatarFallback className="text-[11px]">{initials(name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{name}</p>
                        {u.designation && <p className="text-xs text-muted-foreground">{u.designation}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><UserStatusBadge banned={u.isBanned} /></TableCell>
                  <TableCell>{roleLabel[u.role]}</TableCell>
                  <TableCell className="text-xs">{u.email}</TableCell>
                  <TableCell className="text-xs">{formatDate(u.createdAt)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <RowActions
                      name={name}
                      editHref={`/users/${u.id}/edit`}
                      onDelete={() => {
                        if (u.id === me?.id) return toast.error("You can't delete your own account");
                        remove(u.id);
                        toast.success(`${name} deleted`);
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination {...pager} />
      </div>
    </>
  );
}
