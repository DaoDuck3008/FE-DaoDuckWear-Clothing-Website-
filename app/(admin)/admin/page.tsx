"use client";

import RoleGuard from "@/components/guards/roleGuard";
import AuthGuard from "@/components/guards/authGuard";

export default function AdminPage() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={["ADMIN"]}>
        <div className="p-8 space-y-8">
          <div className="border-b border-stone-200 pb-4">
             <h1 className="font-serif text-3xl font-bold tracking-tighter uppercase">Admin Dashboard</h1>
             <p className="text-stone-500 text-sm italic">Testing Role & Auth Guards</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="p-6 bg-stone-50 border border-stone-100 uppercase tracking-widest text-[10px] font-bold">
                Total Products: 42
             </div>
             <div className="p-6 bg-stone-50 border border-stone-100 uppercase tracking-widest text-[10px] font-bold">
                Total Orders: 12
             </div>
             <div className="p-6 bg-stone-50 border border-stone-100 uppercase tracking-widest text-[10px] font-bold">
                Active Users: 5
             </div>
          </div>
          
          <div className="p-12 bg-editorial-surface border border-dashed border-stone-300 text-center text-stone-400 text-xs">
             Administrator content protected by RoleGuard.
          </div>
        </div>
      </RoleGuard>
    </AuthGuard>
  );
}
