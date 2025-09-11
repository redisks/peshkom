"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { protectedRoutes } from "@/data/protectedRoutes";

export default function AuthCheck({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user && !loading && protectedRoutes.includes(pathname)) {
      router.push(`/auth?redirect=${pathname}`);
    }
  }, [user, loading]);

  return protectedRoutes.includes(pathname) ? (
    !loading && user ? (
      children
    ) : (
      <div className="w-full h-full flex justify-center items-center">
        loading
      </div>
    )
  ) : (
    children
  );
}
