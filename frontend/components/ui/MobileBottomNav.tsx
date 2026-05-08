"use client";

import Link from "next/link";
import { BarChart3, BookOpen, Home, UserRound, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Главная", icon: Home, match: (path: string) => path === "/" },
  { href: "/courses", label: "Уроки", icon: BookOpen, match: (path: string) => path.startsWith("/courses") || path.startsWith("/lesson") },
  { href: "/reels", label: "Reels", icon: Zap, match: (path: string) => path.startsWith("/reels") },
  { href: "/progress", label: "Прогресс", icon: BarChart3, match: (path: string) => path.startsWith("/progress") },
  { href: "/profile", label: "Профиль", icon: UserRound, match: (path: string) => path.startsWith("/profile") },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 h-[60px] border-t border-white/[0.05] bg-slate-950/65 px-2 pb-[env(safe-area-inset-bottom)] text-white shadow-[0_-8px_32px_rgba(0,0,0,0.37)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid h-full max-w-md grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`elastic-tap relative flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-[24px] text-[11px] font-bold transition ${
                isActive ? "text-cyan-200" : "text-slate-400"
              }`}
            >
              <motion.span
                className={`grid h-8 w-10 place-items-center rounded-[20px] ${isActive ? "bg-cyan-300/15 shadow-[0_0_24px_rgba(34,211,238,0.24)]" : ""}`}
                animate={{ y: isActive ? -4 : 0, scale: isActive ? 1.02 : 1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 350, damping: 26 }}
              >
                <Icon size={21} strokeWidth={isActive ? 2.6 : 2.2} />
              </motion.span>
              {isActive ? (
                <motion.span
                  layoutId="mobile-nav-active-dot"
                  className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-300 to-purple-400 shadow-[0_0_8px_#8b5cf6]"
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                />
              ) : null}
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
