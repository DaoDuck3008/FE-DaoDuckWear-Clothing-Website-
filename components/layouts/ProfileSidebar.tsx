"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Package,
  Heart,
  Ticket,
  LogOut,
  Home,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "react-toastify";

const MENU_ITEMS = [
  {
    label: "Tài khoản",
    href: "/profile",
    icon: User,
  },
  {
    label: "Đơn hàng",
    href: "/profile/orders",
    icon: Package,
  },
  {
    label: "Yêu thích",
    href: "/profile/favorites",
    icon: Heart,
  },
  {
    label: "Voucher của tôi",
    href: "/profile/vouchers",
    icon: Ticket,
  },
];

export function ProfileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    clearAuth();
    toast.success("Đăng xuất thành công");
    router.push("/");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={cn(
        "h-screen flex flex-col bg-white border-r border-stone-100 transition-all duration-300 ease-in-out z-[100]",
        isCollapsed ? "w-20" : "w-64 lg:w-72",
      )}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-stone-50">
        {!isCollapsed && (
          <Link
            href="/"
            className="font-cormorant text-2xl font-bold tracking-tighter uppercase italic"
          >
            DAODUCK WEAR
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            "p-1.5 rounded-full hover:bg-stone-50 transition-colors text-stone-400 hover:text-black",
            isCollapsed && "mx-auto",
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Profile Summary */}
      <div
        className={cn(
          "p-5 flex items-center gap-3 border-b border-stone-50 bg-stone-50/10 transition-all",
          isCollapsed && "justify-center px-2",
        )}
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-black text-white text-lg font-bold shadow-xl shadow-stone-200 overflow-hidden flex-shrink-0">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            user?.username?.charAt(0).toUpperCase() || "U"
          )}
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <h3 className="text-sm font-black text-black uppercase tracking-widest truncate">
              {user?.username || "Người dùng"}
            </h3>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">
              Thành viên
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 transition-all group relative",
                isActive
                  ? "bg-black text-white shadow-lg shadow-stone-200"
                  : "text-stone-400 hover:text-black hover:bg-stone-50",
                isCollapsed && "justify-center",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-transform",
                  isActive ? "scale-110" : "group-hover:scale-110",
                )}
              />
              {!isCollapsed && (
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] truncate flex-1">
                  {item.label}
                </span>
              )}
              {!isCollapsed && isActive && (
                <ChevronRight className="w-3 h-3 text-white" />
              )}

              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="fixed left-20 hidden group-hover:block bg-black text-white text-[9px] uppercase tracking-widest font-bold py-1.5 px-3 whitespace-nowrap shadow-xl z-50 ml-1">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-stone-50 space-y-2">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-3 text-stone-500 hover:text-black transition-all group rounded-2xl hover:bg-stone-50",
            isCollapsed && "justify-center",
          )}
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                Về trang chủ
              </span>
              <span className="text-[8px] uppercase tracking-widest text-stone-300 font-bold">
                Quay lại cửa hàng
              </span>
            </div>
          )}
          {isCollapsed && (
            <div className="fixed left-20 hidden group-hover:block bg-black text-white text-[9px] uppercase tracking-widest font-bold py-1.5 px-3 whitespace-nowrap shadow-xl z-50 ml-1">
              Về trang chủ
            </div>
          )}
        </Link>

        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 text-rose-500 hover:bg-rose-50 transition-all group rounded-2xl",
            isCollapsed && "justify-center",
          )}
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {!isCollapsed && (
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">
              Đăng xuất
            </span>
          )}
          {isCollapsed && (
            <div className="fixed left-20 hidden group-hover:block bg-black text-white text-[9px] uppercase tracking-widest font-bold py-1.5 px-3 whitespace-nowrap shadow-xl z-50 ml-1">
              Đăng xuất
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
