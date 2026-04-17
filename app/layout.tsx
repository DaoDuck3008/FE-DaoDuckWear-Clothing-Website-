import type { Metadata } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import "@/styles/global.css";
import { ToastContainer } from "react-toastify";
import AuthHydrator from "@/components/providers/authHydrator";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "DaoDuck Wear",
  description: "DaoDuck Wear - Clothing Shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${manrope.variable} ${geistMono.variable} antialiased`}>
        <AuthHydrator>
          <div className="min-h-screen">{children}</div>
          <ToastContainer />
        </AuthHydrator>
      </body>
    </html>
  );
}
