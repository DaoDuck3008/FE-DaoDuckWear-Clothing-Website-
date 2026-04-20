"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import FullPageLoading from "../ui/fullPageLoading";

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
      router.replace(redirect);
    }
  }, [user, hydrated, router, redirect]);

  if (!hydrated) return <FullPageLoading />;

  if (user) {
    return null;
  }

  return <>{children}</>;
}
