"use client";

import Link from "next/link";
import { BarChart3, BookOpen, Bot, Crown, Home, Menu, Sparkles, UserRound } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export function SiteHeader() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  return (
    <header className="fixed inset-x-0 top-0 z-40 hidden border-b border-white/10 bg-[#050b1a]/70 px-4 py-3 text-white backdrop-blur-2xl md:block sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-bold tracking-[0.16em]">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-300 text-slate-950 shadow-[0_0_32px_rgba(34,211,238,0.32)]">
            <Sparkles size={20} />
          </span>
          JARQ
        </Link>
        <nav className="hidden items-center gap-4 text-sm font-semibold text-slate-200 md:flex">
          <Link className="inline-flex items-center gap-2 transition hover:text-cyan-200" href="/">
            <Home size={16} />
            Главная
          </Link>
          <Link className="transition hover:text-cyan-200" href="/courses">
            <span className="inline-flex items-center gap-2">
              <BookOpen size={16} />
              Уроки
            </span>
          </Link>
          <Link className="transition hover:text-cyan-200" href="/courses/english">
            Английский
          </Link>
          <Link className="inline-flex items-center gap-2 transition hover:text-cyan-200" href="/progress">
            <BarChart3 size={16} />
            Прогресс
          </Link>
          <Link className="inline-flex items-center gap-2 transition hover:text-cyan-200" href="/profile">
            <UserRound size={16} />
            Профиль
          </Link>
          {isAdmin ? (
            <Link className="inline-flex items-center gap-2 transition hover:text-purple-200" href="/admin">
              <Crown size={16} />
              Админ
            </Link>
          ) : null}
          <Link className="transition hover:text-cyan-200" href="/chat">
            AI чат
          </Link>
        </nav>
        <Link href="/chat" className="button-lift hidden min-h-10 items-center gap-2 rounded-xl bg-white/10 px-4 text-sm font-bold text-white ring-1 ring-white/15 backdrop-blur-xl hover:bg-white/15 sm:inline-flex">
          <Bot size={17} />
          Спросить Мааная
        </Link>
        <Link href="/courses" className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white ring-1 ring-white/15 md:hidden">
          <Menu size={20} />
        </Link>
      </div>
    </header>
  );
}
