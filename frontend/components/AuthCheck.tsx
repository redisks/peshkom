"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function AuthCheck({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user && !loading && pathname !== "/auth") {
      router.push(`/auth`);
    }
  }, [user, loading]);

  return (!loading && user) || pathname === "/auth" ? (
    children
  ) : (
    <div className="w-full h-full flex justify-center items-center">
      loading
    </div>
  );
}
