import AdminHeader from "@/components/layouts/adminHeader";
import AdminSidebar from "@/components/layouts/adminSidebar";
import AuthGuard from "@/components/guards/authGuard";
import RoleGuard from "@/components/guards/roleGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={["ADMIN", "STAFF", "MANAGER"]}>
        <div className="flex h-screen overflow-hidden font-sans antialiased text-black">
          {/* Sidebar */}
          <AdminSidebar />

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 overflow-hidden min-w-0">
            {/* Header stays inside content area */}
            <AdminHeader />

            {/* Scrollable Viewport */}
            <main className="flex-1 overflow-y-auto bg-stone-50/50">
              {children}
            </main>
          </div>
        </div>
      </RoleGuard>
    </AuthGuard>
  );
}
