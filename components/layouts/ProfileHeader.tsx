"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Search, Bell } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { logout } from "@/apis/auth.api";
import { toast } from "react-toastify";
import UserAvatar from "@/components/ui/UserAvatar";
import { cn } from "@/utils/cn";

export default function ProfileHeader() {
  const router = useRouter();
  const { user, hydrated, clearAuth } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    } finally {
      clearAuth();
      setDropdownOpen(false);
      toast.success("Đã đăng xuất thành công!");
      router.push("/");
    }
  };

  return (
    <header className="h-16 bg-white border-b border-stone-100 flex items-center justify-between px-6 lg:px-10 z-[50]">
      {/* Search Bar - Matches Admin Header style */}
      {/* <div className="flex-1 max-w-md hidden md:flex items-center gap-3 bg-stone-50 px-4 py-2 rounded-2xl border border-stone-100">
        <Search className="w-4 h-4 text-stone-400" />
        <input 
          type="text" 
          placeholder="Tìm kiếm nhanh..." 
          className="bg-transparent border-none p-0 text-[11px] font-bold uppercase tracking-widest focus:ring-0 w-full placeholder:text-stone-300"
        />
      </div> */}

      {/* Actions */}
      <div className="flex flex-row-reverse w-full items-center gap-6">
        {/* Notifications Placeholder */}
        {/* <button className="relative p-2 text-stone-400 hover:text-black transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white" />
        </button> */}

        {!hydrated ? (
          <div className="h-8 w-8 animate-pulse rounded-full bg-stone-100" />
        ) : user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 hover:opacity-80 transition-all p-1 pr-3 rounded-2xl hover:bg-stone-50 border border-transparent hover:border-stone-100"
            >
              <UserAvatar
                avatar={user.avatar}
                username={user.username}
                className="w-8 h-8 text-[10px]"
              />
              <div className="hidden lg:flex flex-col items-start leading-none">
                <span className="text-[10px] font-black uppercase tracking-widest text-black">
                  {user.username}
                </span>
                <span className="text-[8px] font-bold text-stone-300 uppercase tracking-widest mt-1">
                  Thành viên
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "w-3 h-3 text-stone-400 transition-transform duration-300",
                  dropdownOpen && "rotate-180",
                )}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-stone-100 shadow-2xl z-[100] py-2 animate-in fade-in zoom-in-95 duration-200 rounded-2xl">
                <div className="px-5 py-4 border-b border-stone-50 mb-2">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-stone-300 font-bold mb-1">
                    Đã đăng nhập
                  </p>
                  <p className="text-xs font-black text-black uppercase tracking-tight truncate">
                    {user.username}
                  </p>
                </div>

                <Link
                  href="/"
                  className="flex items-center gap-3 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-stone-500 hover:text-black hover:bg-stone-50 transition-colors"
                >
                  Về trang chủ
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}
