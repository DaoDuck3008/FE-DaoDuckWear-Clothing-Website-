"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ClipboardList,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  Home,
  ArrowLeft,
  Warehouse,
  ImagePlay,
} from "lucide-react";
import { cn } from "@/utils/cn";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Quản lý sản phẩm",
    icon: ShoppingBag,
    href: "/admin/products",
    subItems: [
      { title: "Danh sách sản phẩm", href: "/admin/products" },
      { title: "Thêm sản phẩm mới", href: "/admin/products/create-product" },
    ],
  },
  {
    title: "Quản lý tồn kho",
    icon: Warehouse,
    href: "/admin/inventory",
    subItems: [
      { title: "Xem tồn kho", href: "/admin/inventory" },
      { title: "Nhập kho nhanh", href: "/admin/inventory/import" },
    ],
  },
  {
    title: "Quản lý danh mục",
    icon: Layers,
    href: "/admin/categories",
  },
  {
    title: "Quản lý Banner",
    icon: ImagePlay,
    href: "/admin/banners",
  },
  {
    title: "Quản lý đơn hàng",
    icon: ClipboardList,
    href: "/admin/orders",
  },
  {
    title: "Quản lý khách hàng",
    icon: Users,
    href: "/admin/customers",
  },
  {
    title: "Quản lý nhân viên",
    icon: Users,
    href: "/admin/staff",
  },
  {
    title: "Cài đặt",
    icon: Settings,
    href: "/admin/settings",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>(["Sản phẩm"]); // Mặc định mở mục Sản phẩm

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) setOpenMenus([]); // Đóng hết menu con khi thu gọn sidebar
  };

  const toggleSubMenu = (title: string) => {
    if (isCollapsed) return; // Không mở menu con khi đang thu gọn
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r border-stone-100 transition-all duration-300 ease-in-out flex flex-col z-[100]",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-stone-50">
        {!isCollapsed && (
          <Link
            href="/admin"
            className="font-serif text-xl font-bold tracking-tighter"
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

      {/* Navigation section */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isOpen = openMenus.includes(item.title);
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <div key={item.title} className="space-y-1">
              {/* Main Item */}
              <Link
                href={hasSubItems && !isCollapsed ? "#" : item.href}
                onClick={(e) => {
                  if (hasSubItems && !isCollapsed) {
                    e.preventDefault();
                    toggleSubMenu(item.title);
                  }
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 transition-all group relative",
                  isActive && !hasSubItems
                    ? "bg-black text-white"
                    : "text-stone-400 hover:text-black hover:bg-stone-50",
                  isCollapsed && "justify-center",
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0 transition-transform",
                    isActive ? "scale-110" : "group-hover:scale-110",
                  )}
                />
                {!isCollapsed && (
                  <>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] truncate flex-1">
                      {item.title}
                    </span>
                    {hasSubItems && (
                      <ChevronDown
                        className={cn(
                          "w-3 h-3 transition-transform duration-300",
                          isOpen && "rotate-180",
                        )}
                      />
                    )}
                  </>
                )}

                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <div className="fixed left-20 hidden group-hover:block bg-black text-white text-[9px] uppercase tracking-widest font-bold py-1.5 px-3 whitespace-nowrap shadow-xl z-50 ml-1">
                    {item.title}
                  </div>
                )}
              </Link>

              {/* Sub Items Rendering */}
              {hasSubItems && isOpen && !isCollapsed && (
                <div className="ml-8 pl-3 border-l border-stone-100 flex flex-col space-y-1 py-1">
                  {item.subItems!.map((sub) => {
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          "py-2 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors",
                          isSubActive
                            ? "text-black underline underline-offset-4"
                            : "text-stone-300 hover:text-stone-500",
                        )}
                      >
                        {sub.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-stone-50 space-y-4">
        {/* Back to Storefront Link */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-3 text-stone-500 hover:text-black transition-all group",
            isCollapsed && "justify-center",
          )}
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-[12px] font-black uppercase tracking-[0.2em]">
                Về trang chủ
              </span>
              <span className="text-[10px] uppercase tracking-widest text-stone-300">
                Giao diện khách hàng
              </span>
            </div>
          )}
          {isCollapsed && (
            <div className="fixed left-20 hidden group-hover:block bg-black text-white text-[9px] uppercase tracking-widest font-bold py-1.5 px-3 whitespace-nowrap shadow-xl z-50 ml-1">
              Về trang chủ
            </div>
          )}
        </Link>

        {!isCollapsed ? (
          <div className="bg-stone-50 p-4 rounded-lg">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1">
              Version
            </p>
            <p className="text-[10px] font-bold text-black uppercase tracking-widest">
              v1.0.2-beta
            </p>
          </div>
        ) : (
          <div className="flex justify-center text-[9px] font-bold text-stone-300">
            v1.0
          </div>
        )}
      </div>
    </aside>
  );
}
