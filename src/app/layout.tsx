import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import NextAuthProvider from "@/provider/NextAuthProvider";
import NuqsProvider from "@/provider/NuqsProvider";
import ReactQueryProvider from "@/provider/ReactQueryProvider";
import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import Loading from "./loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Homigo | Property App",
  description:
    "Welcome to Homigo – Your Complete Property Management Solution! Homigo is here to simplify property management for you, whether for personal or business needs. For Owners & Managers: Easily manage your property units through an integrated platform. Monitor tenants, handle payments, schedule maintenance, and analyze property performance—all in one app. For Tenants: Enjoy a more convenient rental experience. From online payments and issue reporting to accessing contract information, everything can be done quickly and transparently. With Homigo, property management becomes more efficient, secure, and hassle-free!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <NuqsProvider>
            <NextAuthProvider>
              <Header />
              <Suspense fallback={<Loading />}>
                <div className="min-h-screen">
                  {children}
                  <Toaster position="top-right" />
                </div>
              </Suspense>
              <Footer />
            </NextAuthProvider>
          </NuqsProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
