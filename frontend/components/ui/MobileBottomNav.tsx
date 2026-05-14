"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Home, Tv, UserRound, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/", label: "Главная", icon: Home, match: (path: string) => path === "/" },
  { href: "/courses", label: "Учёба", icon: BookOpen, match: (path: string) => path.startsWith("/courses") || path.startsWith("/lesson") },
  { href: "/reels", label: "Reels", icon: Zap, match: (path: string) => path.startsWith("/reels") },
  { href: "/media", label: "Медиа", icon: Tv, match: (path: string) => path.startsWith("/media") },
  { href: "/profile", label: "Профиль", icon: UserRound, match: (path: string) => path.startsWith("/profile") },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLessonExit, setShowLessonExit] = useState(false);

  return (
    <>
      {showLessonExit ? (
        <div className="fixed inset-x-4 bottom-20 z-[60] rounded-xl border border-[#26323d] bg-[#0b1117]/98 p-4 text-white shadow-[0_18px_48px_rgba(0,0,0,0.45)] backdrop-blur md:hidden">
          <div className="text-base font-bold">Выйти из урока?</div>
          <p className="mt-1 text-sm font-medium text-slate-400">Прогресс сохранится.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              className="elastic-tap min-h-11 rounded-lg border border-[#26323d] bg-[#101820] font-semibold"
              onClick={() => setShowLessonExit(false)}
            >
              Продолжить
            </button>
            <button
              className="elastic-tap min-h-11 rounded-lg bg-[#18dcc8] font-bold text-[#04100e]"
              onClick={() => {
                setShowLessonExit(false);
                router.push("/");
              }}
            >
              Да
            </button>
          </div>
        </div>
      ) : null}
      <nav className="fixed inset-x-0 bottom-0 z-50 h-16 border-t border-[#26323d] bg-[#080d12]/98 px-2 pb-[env(safe-area-inset-bottom)] text-white shadow-[0_-14px_34px_rgba(0,0,0,0.42)] backdrop-blur md:hidden">
        <div className="mx-auto grid h-full max-w-md grid-cols-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.match(pathname);
            const shouldConfirmHome = item.href === "/" && pathname.startsWith("/lesson");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(event) => {
                  if (!shouldConfirmHome) return;
                  event.preventDefault();
                  setShowLessonExit(true);
                }}
                className={`elastic-tap relative flex min-h-11 min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-semibold transition ${
                  isActive ? "text-[#7ff7eb]" : "text-slate-500"
                }`}
              >
                <motion.span
                  className={`grid h-8 w-9 place-items-center rounded-lg ${isActive ? "border border-[#18dcc8]/45 bg-[#102520]" : ""}`}
                  animate={{ y: isActive ? -4 : 0, scale: isActive ? 1.02 : 1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                >
                  <Icon size={21} strokeWidth={isActive ? 2.6 : 2.2} />
                </motion.span>
                {isActive ? (
                  <motion.span
                    layoutId="mobile-nav-active-dot"
                    className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-[#18dcc8]"
                    transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  />
                ) : null}
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
