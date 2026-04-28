import type { Metadata } from "next";
import {
  Geist_Mono,
  Inter,
  Playfair_Display,
  Cormorant_Garamond,
  Outfit,
} from "next/font/google";
import "@/styles/global.css";
import { ToastContainer } from "react-toastify";
import AuthHydrator from "@/components/providers/authHydrator";
import ScrollToTop from "@/components/ui/ScrollToTop";
import GoogleAuthProvider from "@/components/providers/gooleAuthProvider";

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
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
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
      <body
        className={`${playfair.variable} ${cormorant.variable} ${outfit.variable} ${inter.variable} ${geistMono.variable} antialiased`}
      >
        <AuthHydrator>
          <GoogleAuthProvider>
            <div className="min-h-screen">{children}</div>
            <ToastContainer />
            <ScrollToTop />
          </GoogleAuthProvider>
        </AuthHydrator>
      </body>
    </html>
  );
}
