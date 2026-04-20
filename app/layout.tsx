import type { Metadata } from "next";
import { Geist_Mono, Inter, Noto_Serif } from "next/font/google";
import "@/styles/global.css";
import { ToastContainer } from "react-toastify";
import AuthHydrator from "@/components/providers/authHydrator";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
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
      <body className={`${notoSerif.variable} ${inter.variable} ${geistMono.variable} antialiased`}>
        <AuthHydrator>
          <div className="min-h-screen">{children}</div>
          <ToastContainer />
        </AuthHydrator>
      </body>
    </html>
  );
}
