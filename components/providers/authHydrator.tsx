"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { refresh } from "@/apis/auth.api";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function AuthHydrator({
  children,
}: {
  children: React.ReactNode;
}) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const hydrate = async () => {
      try {
        const res = await refresh();
        const { accessToken, user } = res.data;
        setAuth(accessToken, user);
      } catch {
        clearAuth();

        // // nếu đang ở protected route thì đẩy về login
        // if (!pathname.startsWith("/login")) {
        //   toast.info("You are being redirected to login page.");
        //   router.replace("/login");
        // }
      } finally {
        // đánh dấu đã hydrate xong
        setHydrated();
      }
    };

    hydrate();
  }, []);

  return <>{children}</>;
}
