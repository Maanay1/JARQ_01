"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, BookOpen, FileText, Home, LayoutDashboard, UsersRound, WalletCards } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { hapticTap } from "@/components/ui/HapticProvider";
import { MotionPage } from "@/components/ui/MotionPage";

type AdminShellProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
};

const adminNav = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/users", label: "Пользователи", icon: UsersRound },
  { href: "/admin/lessons", label: "Уроки", icon: BookOpen },
  { href: "/admin/subscriptions", label: "Подписки", icon: WalletCards },
  { href: "/admin/content", label: "Контент", icon: FileText },
];

export function AdminShell({ title, eyebrow = "Admin", children }: AdminShellProps) {
  const { isLoading, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    if (!isLoading && !isAdmin) router.replace("/");
  }, [isAdmin, isLoading, router]);

  if (isLoading || !isAdmin) {
    return (
      <main className="relative min-h-screen overflow-hidden px-4 pb-24 pt-6 jarq-text md:pt-28">
        <FuturisticBackground />
        <ExperienceControls />
        <section className="relative z-10 mx-auto max-w-md rounded-xl p-6 liquid-glass">
          <div className="h-6 w-36 animate-pulse rounded-full bg-white/10" />
          <div className="mt-4 h-10 w-64 animate-pulse rounded-2xl bg-white/10" />
          <div className="mt-5 grid gap-3">
            <div className="h-24 animate-pulse rounded-xl bg-white/10" />
            <div className="h-24 animate-pulse rounded-xl bg-white/10" />
            <div className="h-24 animate-pulse rounded-xl bg-white/10" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-6 jarq-text sm:px-6 md:pb-10 md:pt-28 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="courses" className="relative z-10 mx-auto grid max-w-7xl gap-4 lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="sticky top-28 hidden h-[calc(100vh-8rem)] rounded-xl p-3 liquid-glass lg:block">
          <Link href="/" className="inline-flex items-center gap-3 rounded-lg border border-[#26323d] bg-[#101820] px-3 py-3 font-bold tracking-[0.14em] text-[#7ff7eb]">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#18dcc8] text-slate-950">
              <Home size={20} />
            </span>
            JARQ
          </Link>
          <nav className="mt-6 grid gap-2">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={hapticTap}
                  className={`button-lift flex min-h-11 items-center gap-3 rounded-lg border px-3 text-sm font-semibold transition ${
                    active ? "border-[#18dcc8]/60 bg-[#102520] text-[#7ff7eb]" : "border-transparent bg-transparent text-slate-400 hover:border-[#26323d] hover:bg-[#101820] hover:text-slate-100"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0">
          <header className="mb-4 rounded-xl p-4 liquid-glass">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#7ff7eb]">{eyebrow}</div>
                <h1 className="mt-2 text-2xl font-bold leading-tight text-white md:text-3xl">
                  {title}
                </h1>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-[#26323d] bg-[#101820] px-3 py-2 text-sm font-semibold text-slate-200">
                <BarChart3 size={17} />
                Live Supabase
              </div>
            </div>
          </header>
          {children}
        </section>
      </MotionPage>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#26323d] bg-[#080d12]/98 px-3 py-2 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={hapticTap} className="relative grid min-h-[60px] place-items-center rounded-lg text-xs font-semibold">
                <motion.span animate={{ y: active ? -4 : 0 }} transition={{ type: "spring", stiffness: 350, damping: 26 }} className={active ? "text-[#7ff7eb]" : "text-slate-500"}>
                  <Icon size={21} />
                </motion.span>
                {active ? <motion.span layoutId="admin-nav-dot" className="absolute bottom-2 h-1.5 w-1.5 rounded-full bg-[#18dcc8]" /> : null}
              </Link>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
