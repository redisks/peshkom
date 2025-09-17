"use client";

import "./globals.css";
import { Inter, Unbounded } from "next/font/google";
import {
  PanelTop,
  Map,
  Footprints,
  Heart
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { YMaps } from "@iminside/react-yandex-maps";
import Head from "next/head";
import { PointsContext } from "@/context/PointsContext";
import { useState, Suspense } from "react";
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
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, user-scalable=no"
          ></meta>
        </Head>
        <body
          className={`${unbounded.variable} ${inter.variable} h-[100dvh] max-h-[100dvh] w-screen bg-background text-light-black overflow-x-hiddenT ${unbounded.className}`}
        >
          <Suspense fallback="">
            <YMaps
              query={{
                load: "package.full",
                apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY,
              }}
            >
              <PointsContext.Provider
                value={{ points: points, setPoints: setPoints }}
              >
                {/* <AuthProvider> */}
                {/* <AuthCheck> */}
                <div className="flex justify-center w-full h-full">
                  {pathname.includes("/auth") ||
                  pathname.includes("/map") ? null : pathname.includes(
                      "place/"
                    ) ? (
                    ""
                  ) : (
                    <header className="w-full bg-light-white flex justify-center p-5 pb-2 fixed top-0 z-10">
                      <span className="font-unbounded font-medium text-xl h-8 flex items-center">
                        PESHKOM
                      </span>
                    </header>
                  )}
                  <main
                    className={`w-full ${
                      pathname.includes("place/") ||
                      pathname.includes("/map") ||
                      pathname.includes("/auth")
                        ? "mt-0"
                        : "mt-10 pb-10"
                    }`}
                  >
                    {children}
                  </main>
                  {pathname.includes("/auth") ||
                  pathname.includes("/map") ? null : (
                    <nav
                      className={`flex justify-between gap-4 items-center mb-5 py-5 w-11/12 max-w-screen fixed bottom-0 bg-light-white shadow-2xl rounded-3xl z-20 ${
                        pathname.includes("place/") ? "hidden" : ""
                      }`}
                    >
                      <Link
                        href="/"
                        className={`flex justify-center items-center rounded-3xl flex-1 h-full`}
                      >
                        <Footprints
                          className={`size-8 ${
                            pathname === "/" ? "text-pale-orange" : ""
                          }`}
                        />
                      </Link>
                      <Link
                        href="/posts"
                        className={`flex justify-center items-center rounded-3xl flex-1 h-full`}
                      >
                        <PanelTop
                          className={`size-8 ${
                            pathname.includes("/post") ? "text-pale-orange" : ""
                          }`}
                        />
                      </Link>
                      <Link
                        href="/map"
                        className={`flex justify-center items-center rounded-3xl flex-1 h-full`}
                      >
                        <Map
                          className={`size-8 ${
                            pathname.includes("/map") ? "text-pale-orange" : ""
                          }`}
                        />
                      </Link>
                      <Link
                        href="/favorite"
                        className={`flex justify-center items-center rounded-3xl flex-1 h-full`}
                      >
                        <Heart
                          className={`size-8 ${
                            pathname.includes("/favorite")
                              ? "text-pale-orange"
                              : ""
                          }`}
                        />
                      </Link>
                    </nav>
                  )}
                </div>
                {/* </AuthCheck> */}
                {/* </AuthProvider> */}
              </PointsContext.Provider>
            </YMaps>
          </Suspense>
        </body>
      </html>
    </>
  );
}
