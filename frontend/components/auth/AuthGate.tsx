"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-4">
        <div className="w-full max-w-sm rounded-[32px] p-5 liquid-glass">
          <div className="h-28 animate-pulse rounded-[28px] bg-white/10" />
          <div className="mt-4 h-5 w-2/3 animate-pulse rounded-full bg-white/10" />
          <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-white/10" />
          <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-white/10" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
