"use client";

import Link from "next/link";
import { BookOpen, Home, Settings, Tv, UserRound, Zap } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

const navItems = [
  { href: "/", label: "Главная", icon: Home, match: (path: string) => path === "/" },
  { href: "/courses", label: "Учёба", icon: BookOpen, match: (path: string) => path.startsWith("/courses") || path.startsWith("/lesson") },
  { href: "/reels", label: "Reels", icon: Zap, match: (path: string) => path.startsWith("/reels") },
  { href: "/media", label: "Медиа", icon: Tv, match: (path: string) => path.startsWith("/media") },
  { href: "/profile", label: "Профиль", icon: UserRound, match: (path: string) => path.startsWith("/profile") },
];

export function SiteHeader() {
  const { profile } = useAuth();
  const pathname = usePathname();
  const isAdmin = profile?.role === "admin";

  return (
    <>
      {isAdmin ? (
        <div className="fixed inset-x-0 top-0 z-[70] hidden h-8 items-center justify-center border-b border-[#26323d] bg-[#080d12]/95 px-4 text-xs font-semibold text-slate-300 backdrop-blur md:flex">
          <div className="flex w-full max-w-6xl items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2">
              <Settings size={14} />
              Режим администратора
            </span>
            <Link href="/admin" className="text-[#18dcc8] transition hover:text-white">
              Открыть Admin панель →
            </Link>
          </div>
        </div>
      ) : null}

      <aside className={`fixed bottom-0 left-0 top-0 z-50 hidden w-24 flex-col items-center border-r border-[#26323d] bg-[#080d12]/96 px-3 pb-5 text-white shadow-[10px_0_28px_rgba(0,0,0,0.35)] backdrop-blur md:flex ${isAdmin ? "pt-12" : "pt-5"}`}>
        <Link href="/" className="grid h-12 w-12 place-items-center rounded-xl border border-[#2d3b47] bg-[#101820] text-sm font-black tracking-[0.12em] text-[#18dcc8]" aria-label="JARQ">
          JQ
        </Link>
        <nav className="mt-8 flex w-full flex-1 flex-col items-stretch gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex min-h-[60px] flex-col items-center justify-center gap-1 rounded-xl border text-[11px] font-semibold transition ${
                  isActive ? "border-[#18dcc8]/55 bg-[#102520] text-[#7ff7eb]" : "border-transparent text-slate-500 hover:border-[#26323d] hover:bg-[#101820] hover:text-slate-100"
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.8 : 2.2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
