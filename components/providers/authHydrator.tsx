"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { refresh } from "@/apis/auth.api";
import { usePathname, useRouter } from "next/navigation";

import { useCartStore } from "@/stores/cart.store";
import { useFavoriteStore } from "@/stores/favorite.store";

export default function AuthHydrator({
  children,
}: {
  children: React.ReactNode;
}) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const fetchFavorites = useFavoriteStore((s) => s.fetchFavorites);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const hydrate = async () => {
      try {
        const res = await refresh();
        const { accessToken, user } = res.data;
        setAuth(accessToken, user);

        // Sync cart & favorites after login
        fetchCart();
        fetchFavorites();
      } catch {
        clearAuth();
      } finally {
        // đánh dấu đã hydrate xong
        setHydrated();
      }
    };

    hydrate();
  }, []);

  return <>{children}</>;
}
