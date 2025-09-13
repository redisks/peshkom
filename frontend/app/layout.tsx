"use client";

import "./globals.css";
import { Inter, Unbounded } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import AuthCheck from "@/components/AuthCheck";
import {
  MoveLeft,
  ArrowLeft,
  CircleUser,
  PanelTop,
  MessageCircleHeart,
  Focus,
  Sparkle,
  Share,
  Map,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { YMaps } from "@iminside/react-yandex-maps";
import Head from "next/head";
import { PointsContext } from "@/context/PointsContext";
import { useState } from "react";
import { IPlace } from "@/lib/types";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [points, setPoints] = useState<IPlace[]>([]);

  return (
    <>
      <html lang="en">
        <Head>
          <meta name="referrer" content="origin"></meta>
        </Head>
        <body
          className={`${inter.variable} ${unbounded.variable} h-screen w-screen bg-background text-light-black overflow-x-hiddenT ${inter.className}`}
        >
          <YMaps
            query={{
              load: "package.full",
              apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY,
            }}
          >
            <PointsContext.Provider
              value={{ points: points, setPoints: setPoints }}
            >
              <AuthProvider>
                <AuthCheck>
                  <div className="flex justify-center w-full">
                    {pathname.includes("/auth") ||
                    pathname.includes("/map") ? null : pathname.includes(
                        "place/"
                      ) ? (
                      <header className="w-full flex justify-between p-5 fixed top-0 z-10">
                        <div className="p-2 bg-light-white rounded-4xl shadow-md">
                          <ArrowLeft
                            className="size-6"
                            onClick={() => router.back()}
                          />
                        </div>
                        <div className="flex gap-4 items-center">
                          <div className="p-2 bg-light-white rounded-4xl shadow-md">
                            <Sparkle className="size-6" />
                          </div>
                          <div className="p-2 bg-light-white rounded-4xl shadow-md">
                            <Share className="size-6" />
                          </div>
                        </div>
                      </header>
                    ) : (
                      <header className="w-full bg-light-white flex justify-between p-5 fixed top-0 z-10">
                        <MoveLeft
                          className="size-8"
                          onClick={() => router.back()}
                        />
                        <span className="font-unbounded font-medium text-xl h-8 flex items-center">
                          PESHKOM
                        </span>
                        <CircleUser className="size-8" />
                      </header>
                    )}
                    <main
                      className={`w-full ${
                        pathname.includes("place/") ||
                        pathname.includes("/map") ||
                        pathname.includes("/auth")
                          ? "mt-0"
                          : "mt-20"
                      }`}
                    >
                      {children}
                    </main>
                    {pathname.includes("/auth") ||
                    pathname.includes("/map") ? null : (
                      <nav
                        className={`flex justify-between gap-4 items-center mb-5 p-5 w-11/12 max-w-screen fixed bottom-0 bg-white shadow-2xl rounded-3xl z-10 ${
                          pathname.includes("place/") ? "hidden" : ""
                        }`}
                      >
                        <Link href="/posts">
                          <PanelTop className="size-8" />
                        </Link>
                        <Link href="/">
                          <MessageCircleHeart className="size-8" />
                        </Link>
                        <Link href="/map">
                          <Map className="size-8" />
                        </Link>
                        <Link href="/">
                          <Focus className="size-8" />
                        </Link>
                        <Link href="/">
                          <CircleUser className="size-8" />
                        </Link>
                      </nav>
                    )}
                  </div>
                </AuthCheck>
              </AuthProvider>
            </PointsContext.Provider>
          </YMaps>
        </body>
      </html>
    </>
  );
}
