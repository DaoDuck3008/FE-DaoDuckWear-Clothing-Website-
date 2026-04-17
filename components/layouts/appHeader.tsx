"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ShoppingBag, User, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { logout } from "@/apis/auth.api";
import { toast } from "react-toastify";

export default function AppHeader() {
  const router = useRouter();
  const { user, hydrated, clearAuth } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  const avatarLetter = user?.username?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-white"
        >
          <ShoppingBag className="h-6 w-6 text-indigo-600" />
          <span className="hidden sm:inline">
            Dao<span className="text-indigo-600">Duck</span>Wear
          </span>
        </Link>

        {/* Nav links — có thể bổ sung sau */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400 md:flex">
          <Link
            href="/"
            className="transition-colors hover:text-zinc-900 dark:hover:text-white"
          >
            Trang chủ
          </Link>
          <Link
            href="/shop"
            className="transition-colors hover:text-zinc-900 dark:hover:text-white"
          >
            Cửa hàng
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Chờ hydrate để tránh flash */}
          {!hydrated ? (
            <div className="h-9 w-32 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-800" />
          ) : user ? (
            /* ── Avatar dropdown ── */
            <div className="relative" ref={dropdownRef}>
              <button
                id="user-menu-button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full py-1.5 pl-2 pr-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/30"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                    {avatarLetter}
                  </span>
                )}
                <span className="hidden max-w-[120px] truncate sm:inline">
                  {user.username}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-zinc-200 bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
                  role="menu"
                >
                  {/* User info */}
                  <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
                    <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                      {user.username}
                    </p>
                    {user.email && (
                      <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                        {user.email}
                      </p>
                    )}
                  </div>

                  <div className="p-1">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      role="menuitem"
                    >
                      <User className="h-4 w-4" />
                      Hồ sơ của tôi
                    </Link>

                    <button
                      id="logout-button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Login / Register buttons ── */
            <>
              <Link
                id="login-link"
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Đăng nhập
              </Link>
              <Link
                id="register-link"
                href="/register"
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 active:bg-indigo-800"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
