"use client";

import Link from "next/link";
import { BarChart3, BookOpen, Home, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Главная", icon: Home, match: (path: string) => path === "/" },
  { href: "/courses", label: "Уроки", icon: BookOpen, match: (path: string) => path.startsWith("/courses") || path.startsWith("/lesson") },
  { href: "/progress", label: "Прогресс", icon: BarChart3, match: (path: string) => path.startsWith("/progress") },
  { href: "/profile", label: "Профиль", icon: UserRound, match: (path: string) => path.startsWith("/profile") },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 h-[60px] border-t border-white/10 bg-[#050b1a]/88 px-2 pb-[env(safe-area-inset-bottom)] text-white shadow-[0_-18px_45px_rgba(0,0,0,0.28)] backdrop-blur-2xl md:hidden">
      <div className="mx-auto grid h-full max-w-md grid-cols-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-bold transition active:scale-95 ${
                isActive ? "text-cyan-200" : "text-slate-400"
              }`}
            >
              <span className={`grid h-8 w-10 place-items-center rounded-xl ${isActive ? "bg-cyan-300/18 shadow-[0_0_24px_rgba(34,211,238,0.24)]" : ""}`}>
                <Icon size={21} strokeWidth={isActive ? 2.6 : 2.2} />
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
