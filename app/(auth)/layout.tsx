import GuestGuard from "@/components/guards/guestGuard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuestGuard>{children}</GuestGuard>;
}
