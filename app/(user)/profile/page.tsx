"use client";

import { useAuthStore } from "@/stores/auth.store";
import { User, Mail, Phone, Calendar, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-black uppercase tracking-tight">
          Thông tin tài khoản
        </h2>
        <p className="text-sm text-stone-400 font-medium mt-1">
          Quản lý thông tin cá nhân và bảo mật tài khoản của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-stone-50/50 rounded-3xl border border-stone-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center text-stone-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              Họ và tên
            </p>
            <p className="text-sm font-black text-black uppercase tracking-tight mt-0.5">
              {user?.username || "Chưa cập nhật"}
            </p>
          </div>
        </div>

        <div className="p-6 bg-stone-50/50 rounded-3xl border border-stone-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center text-stone-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              Email
            </p>
            <p className="text-sm font-black text-black tracking-tight mt-0.5">
              {user?.email || "Chưa cập nhật"}
            </p>
          </div>
        </div>

        <div className="p-6 bg-stone-50/50 rounded-3xl border border-stone-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center text-stone-400">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              Số điện thoại
            </p>
            <p className="text-sm font-black text-black tracking-tight mt-0.5">
              {user?.phone || "Chưa cập nhật"}
            </p>
          </div>
        </div>

        <div className="p-6 bg-stone-50/50 rounded-3xl border border-stone-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center text-stone-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              Vai trò
            </p>
            <p className="text-sm font-black text-emerald-600 uppercase tracking-tight mt-0.5">
              {user?.role || "Khách hàng"}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button className="px-8 py-4 bg-black text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-stone-200 hover:scale-105 active:scale-95 transition-all">
          Cập nhật thông tin
        </button>
      </div>
    </div>
  );
}
