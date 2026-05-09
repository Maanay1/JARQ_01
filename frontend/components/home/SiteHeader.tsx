"use client";

import Link from "next/link";
import { BookOpen, Home, Settings, Sparkles, Tv, UserRound, Zap } from "lucide-react";
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
        <div className="fixed inset-x-0 top-0 z-[70] hidden h-8 items-center justify-center border-b border-purple-200/10 bg-purple-950/85 px-4 text-xs font-black text-purple-100 backdrop-blur-xl md:flex">
          <div className="flex w-full max-w-6xl items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2">
              <Settings size={14} />
              Режим администратора
            </span>
            <Link href="/admin" className="text-cyan-200 transition hover:text-white">
              Открыть Admin панель →
            </Link>
          </div>
        </div>
      ) : null}

      <aside className={`fixed bottom-0 left-0 top-0 z-50 hidden w-24 flex-col items-center border-r border-white/10 bg-[#050b1a]/78 px-3 pb-5 text-white shadow-[8px_0_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl md:flex ${isAdmin ? "pt-12" : "pt-5"}`}>
        <Link href="/" className="grid h-12 w-12 place-items-center rounded-[20px] bg-cyan-300 text-slate-950 shadow-[0_0_32px_rgba(34,211,238,0.32)]" aria-label="JARQ">
          <Sparkles size={22} />
        </Link>
        <nav className="mt-8 flex w-full flex-1 flex-col items-stretch gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-[24px] text-[11px] font-black transition ${
                  isActive ? "bg-cyan-300/15 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.18)]" : "text-slate-400 hover:bg-white/8 hover:text-white"
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
