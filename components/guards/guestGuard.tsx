"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { LoadingLayer } from "../ui/LoadingLayer";

interface Props {
  children: React.ReactNode;
}

export default function GuestGuard({ children }: Props) {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (hydrated && user) {
      setTimeout(() => {
        router.replace(redirect);
      }, 2000);

      toast.info("Bạn đã đăng nhập!");
    }
  }, [user, hydrated, router, redirect]);

  if (!hydrated) return <LoadingLayer isLoading={!hydrated} />;

  if (user) {
    return null;
  }

  return <>{children}</>;
}
