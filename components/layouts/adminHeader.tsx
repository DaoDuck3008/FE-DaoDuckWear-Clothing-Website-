"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { logout } from "@/apis/auth.api";
import { toast } from "react-toastify";

export default function AdminHeader() {
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
      // ignore logout api errors
    } finally {
      clearAuth();
      setDropdownOpen(false);
      toast.success("Đã đăng xuất thành công!");
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-white border-b border-stone-100 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-10 h-16 flex justify-between items-center">
        {/* Logo */}
        <div>
          <Link
            className="flex items-baseline gap-2 font-serif tracking-tighter text-black"
            href="/admin"
          >
            <span className="text-xl lg:text-2xl font-bold">ATELIER</span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400">
              Admin
            </span>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center justify-end">
          {/* Auth section */}
          {!hydrated ? (
            <div className="h-6 w-6 animate-pulse rounded-full bg-stone-100" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="hover:opacity-60 transition-opacity flex items-center gap-2 border hover:border-black rounded-full px-3 py-1.5"
              >
                <span className="hidden md:inline text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                  {user.username}
                </span>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-black" />
                )}
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-stone-100 shadow-xl z-50 py-2">
                  <div className="px-4 py-2 border-b border-stone-100 mb-1">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-bold mb-1">
                      Quản trị viên
                    </p>
                    <p className="text-xs font-bold truncate text-black uppercase tracking-tight">
                      {user.username}
                    </p>
                    {user.email && (
                      <p className="text-[10px] text-stone-500 truncate mt-1 normal-case tracking-normal font-medium">
                        {user.email}
                      </p>
                    )}
                  </div>
                  <Link
                    href="/admin/profile"
                    className="block px-4 py-2 text-[11px] uppercase tracking-wider hover:bg-stone-50 transition-colors"
                  >
                    Hồ sơ
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-[11px] uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
