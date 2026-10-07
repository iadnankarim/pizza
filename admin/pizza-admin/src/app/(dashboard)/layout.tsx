import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { AuthGuard } from "@/components/layout/auth-guard";

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <div className="lg:pl-56">
        <Topbar />
        <main className="mx-auto max-w-7xl p-4 sm:p-6">
          <AuthGuard>{children}</AuthGuard>
        </main>
      </div>
    </div>
  );
}
