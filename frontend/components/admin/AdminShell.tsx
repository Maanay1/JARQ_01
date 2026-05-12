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
        <section className="relative z-10 mx-auto max-w-md rounded-[32px] p-6 liquid-glass">
          <div className="h-6 w-36 animate-pulse rounded-full bg-white/10" />
          <div className="mt-4 h-10 w-64 animate-pulse rounded-2xl bg-white/10" />
          <div className="mt-5 grid gap-3">
            <div className="h-24 animate-pulse rounded-[28px] bg-white/10" />
            <div className="h-24 animate-pulse rounded-[28px] bg-white/10" />
            <div className="h-24 animate-pulse rounded-[28px] bg-white/10" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-6 jarq-text sm:px-6 md:pb-10 md:pt-28 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="courses" className="relative z-10 mx-auto grid max-w-7xl gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="sticky top-28 hidden h-[calc(100vh-8rem)] rounded-[32px] p-4 liquid-glass lg:block">
          <Link href="/" className="inline-flex items-center gap-3 rounded-[24px] px-3 py-3 font-black tracking-[0.16em] text-cyan-100">
            <span className="grid h-11 w-11 place-items-center rounded-[20px] bg-cyan-300 text-slate-950">
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
                  className={`button-lift flex min-h-12 items-center gap-3 rounded-[22px] px-4 text-sm font-bold transition ${
                    active ? "bg-cyan-300 text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.24)]" : "bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]"
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
          <header className="mb-5 rounded-[32px] p-5 liquid-glass">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">{eyebrow}</div>
                <h1 className="mt-2 text-3xl font-black leading-tight text-white md:text-4xl">
                  {title}
                </h1>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-300/25 bg-purple-400/10 px-4 py-2 text-sm font-bold text-purple-50">
                <BarChart3 size={17} />
                Live Supabase
              </div>
            </div>
          </header>
          {children}
        </section>
      </MotionPage>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/5 bg-slate-950/65 px-3 py-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={hapticTap} className="relative grid min-h-[60px] place-items-center rounded-[24px] text-xs font-bold">
                <motion.span animate={{ y: active ? -4 : 0 }} transition={{ type: "spring", stiffness: 350, damping: 26 }} className={active ? "text-cyan-200" : "text-slate-400"}>
                  <Icon size={21} />
                </motion.span>
                {active ? <motion.span layoutId="admin-nav-dot" className="absolute bottom-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" /> : null}
              </Link>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
