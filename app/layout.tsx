import type { Metadata } from "next";
import { Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import "@/styles/global.css";
import { ToastContainer } from "react-toastify";
import AuthHydrator from "@/components/providers/authHydrator";
import ScrollToTop from "@/components/shared/ScrollToTop";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
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
      <body className={`${playfair.variable} ${inter.variable} ${geistMono.variable} antialiased`}>
        <AuthHydrator>
          <div className="min-h-screen">{children}</div>
          <ToastContainer />
          <ScrollToTop />
        </AuthHydrator>
      </body>
    </html>
  );
}
