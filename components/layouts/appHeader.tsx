"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  ShoppingBag,
  User,
  ChevronDown,
  Search,
  Heart,
  LogIn,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { logout } from "@/apis/auth.api";
import { toast } from "react-toastify";
import CartSidebar from "../cart/CartSidebar";
import FavoriteSidebar from "../favorites/FavoriteSidebar";
import { useCartStore } from "@/stores/cart.store";
import { useFavoriteStore } from "@/stores/favorite.store";

export default function AppHeader() {
  const router = useRouter();
  const { user, hydrated, clearAuth } = useAuthStore();
  const totalItems = useCartStore((state) => state.totalItems);
  const totalFavorites = useFavoriteStore((state) => state.totalItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearFavorites = useFavoriteStore((state) => state.clearFavorites);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoriteOpen, setIsFavoriteOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true); // Đánh dấu đã mount thành công trên client
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
      clearCart(); // Xóa giỏ hàng cục bộ khi logout
      clearFavorites(); // Xóa favorites cục bộ khi logout
      setDropdownOpen(false);
      toast.success("Đã đăng xuất thành công!");
      router.push("/");
    }
  };

  return (
    <>
      <header className="sticky top-0 w-full z-50 bg-white border-b border-stone-100">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-4 lg:py-6">
          <div className="flex justify-between items-center mb-4 lg:mb-6">
            {/* Social Icons */}
            <div className="hidden lg:flex items-center gap-6 flex-1">
              <a className="hover:opacity-60 transition-opacity" href="#">
                <img
                  src="/assets/FacebookIcon.png"
                  alt="Facebook"
                  className="w-4 h-4 object-contain grayscale"
                />
              </a>
              <a className="hover:opacity-60 transition-opacity" href="#">
                <img
                  src="/assets/InstagramIcon.png"
                  alt="Instagram"
                  className="w-4 h-4 object-contain grayscale"
                />
              </a>
              <a className="hover:opacity-60 transition-opacity" href="#">
                <img
                  src="/assets/YoutubeIcon.png"
                  alt="Youtube"
                  className="w-4 h-4 object-contain grayscale"
                />
              </a>
            </div>

            {/* Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link
                className="font-serif text-2xl lg:text-3xl font-bold tracking-tighter text-black"
                href="/"
              >
                ATELIER
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 lg:gap-6 flex-1 justify-end">
              <div className="hidden md:flex items-center border-b border-black/10 pb-1">
                <Search className="w-4 h-4 text-black mr-2" />
                <input
                  className="bg-transparent border-none p-0 text-xs focus:ring-0 placeholder:text-stone-400 w-24 lg:w-32 font-sans"
                  placeholder="Tìm kiếm sản phẩm..."
                  type="text"
                />
              </div>

              {/* Auth section */}
              {!hydrated ? (
                <div className="h-6 w-6 animate-pulse rounded-full bg-stone-100" />
              ) : user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="hover:opacity-60 transition-opacity flex items-center gap-2"
                  >
                    <span className="hidden md:inline text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                      {user.username}
                    </span>
                    {user.avatar && user.avatar !== "" ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-black" />
                    )}
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-100 shadow-xl z-50 p-2">
                      <div className="px-3 py-3 border-b border-stone-100 mb-1">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-bold mb-1">
                          Thành viên
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
                        href="/profile"
                        className="block px-3 py-2 text-[11px] uppercase tracking-wider hover:bg-stone-50 transition-colors"
                      >
                        Hồ sơ
                      </Link>
                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          className="block text-blue-600 px-3 py-2 text-[11px] uppercase tracking-wider hover:bg-stone-50 transition-colors"
                        >
                          Trang quản trị
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsFavoriteOpen(true);
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-[11px] uppercase tracking-wider hover:bg-stone-50 transition-colors"
                      >
                        Danh sách yêu thích
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-[11px] uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hover:opacity-60 transition-opacity"
                >
                  <LogIn className="w-6 h-6 text-black" />
                </Link>
              )}

              <button 
                onClick={() => setIsFavoriteOpen(true)}
                className="hover:opacity-60 transition-opacity hidden sm:block relative group"
              >
                <Heart className="w-6 h-6 text-black" />
                {mounted && totalFavorites() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold group-hover:scale-110 transition-transform">
                    {totalFavorites()}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  if (!user) {
                    toast.info("Vui lòng đăng nhập để xem giỏ hàng");
                  } else {
                    setIsCartOpen(true);
                  }
                }}
                className="hover:opacity-60 transition-opacity relative group"
              >
                <ShoppingBag className="w-6 h-6 text-black" />
                {mounted && totalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold group-hover:scale-110 transition-transform">
                    {totalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Links Centered */}
          <nav className="flex justify-center gap-6 lg:gap-10 items-center mt-4 lg:mt-8 overflow-x-auto no-scrollbar pb-2">
            <Link
              className="text-black border-b border-black pb-0.5 font-medium text-[10px] lg:text-[11px] uppercase tracking-[0.25em] transition-all whitespace-nowrap"
              href="/shop"
            >
              Cửa hàng
            </Link>
            <Link
              className="text-stone-500 font-medium hover:text-black text-[10px] lg:text-[11px] uppercase tracking-[0.25em] transition-all whitespace-nowrap"
              href="/shop?gender=men"
            >
              Nam
            </Link>
            <Link
              className="text-stone-500 font-medium hover:text-black text-[10px] lg:text-[11px] uppercase tracking-[0.25em] transition-all whitespace-nowrap"
              href="/shop?gender=women"
            >
              Nữ
            </Link>
            <Link
              className="text-stone-500 font-medium hover:text-black text-[10px] lg:text-[11px] uppercase tracking-[0.25em] transition-all whitespace-nowrap"
              href="/accessories"
            >
              Phụ kiện
            </Link>
            <Link
              className="text-stone-500 font-medium hover:text-black text-[10px] lg:text-[11px] uppercase tracking-[0.25em] transition-all whitespace-nowrap"
              href="/about"
            >
              Về chúng tôi
            </Link>
          </nav>
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <FavoriteSidebar isOpen={isFavoriteOpen} onClose={() => setIsFavoriteOpen(false)} />
    </>
  );
}
