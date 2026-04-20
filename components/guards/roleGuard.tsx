"use client";

import { useAuthStore } from "@/stores/auth.store";
import FullPageLoading from "../ui/fullPageLoading";
import ForbiddenPage from "@/app/error/403/page";

interface Props {
  allowedRoles: Array<string>;
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: Props) {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  if (!hydrated) return <FullPageLoading />;

  if (!user) return null;

  if (!allowedRoles.includes(user.role)) return <ForbiddenPage />;

  return <>{children}</>;
}
