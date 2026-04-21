import AdminHeader from "@/components/layouts/adminHeader";
import AuthGuard from "@/components/guards/authGuard";
import RoleGuard from "@/components/guards/roleGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={["ADMIN"]}>
        <div className="flex min-h-screen flex-col font-sans antialiased">
          <AdminHeader />
          <main className="flex-1 bg-stone-50">{children}</main>
        </div>
      </RoleGuard>
    </AuthGuard>
  );
}

