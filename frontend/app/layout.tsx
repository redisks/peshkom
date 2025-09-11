// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Unbounded } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import AuthCheck from "@/components/AuthCheck";
import Script from "next/script";
import Head from "next/head";

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-unbounded",
});
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "peshkom",
  description: "PESHKOM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en">
        <body
          className={`${inter.variable} ${unbounded.variable} p-5 h-screen w-screen bg-background text-light-black overflow-x-hiddenT ${inter.className}`}
        >
          <AuthProvider>
            <AuthCheck>{children}</AuthCheck>
          </AuthProvider>
        </body>
      </html>
    </>
  );
}
