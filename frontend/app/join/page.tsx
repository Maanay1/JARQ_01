"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Gift, LogIn, Sparkles, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { MaaniyCharacter } from "@/components/MaaniyCharacter";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { MotionPage } from "@/components/ui/MotionPage";
import { savePendingReferralCode } from "@/lib/referral";

export default function JoinPage() {
  return (
    <Suspense fallback={null}>
      <JoinContent />
    </Suspense>
  );
}

function JoinContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref")?.trim().toUpperCase() ?? "";
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!ref) return;
    savePendingReferralCode(ref);
    setSaved(true);
  }, [ref]);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-24 pt-6 jarq-text sm:px-6 md:py-12 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="home" className="relative z-10 mx-auto grid min-h-[86vh] max-w-6xl items-center gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="rounded-[36px] p-6 liquid-glass md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
            <Gift size={16} />
            Приглашение в JARQ
          </div>
          <h1 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
            Тебя пригласил Маанай
          </h1>
          <p className="mt-4 max-w-2xl text-base font-semibold leading-7 jarq-muted">
            Зарегистрируйся и получи <span className="font-black text-cyan-100">3 дня Pro бесплатно</span>. Английский, программирование, Reels, медиа и уроки с AI-репетитором.
          </p>

          <div className="mt-6 rounded-[28px] border border-white/[0.08] bg-slate-950/55 p-4 backdrop-blur-xl">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">Реферальный код</div>
            <div className="mt-2 text-3xl font-black">{ref || "JARQ"}</div>
            <p className="mt-2 text-sm font-semibold jarq-muted">{saved ? "Код сохранён до регистрации." : "Открой ссылку с кодом приглашения."}</p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href="/login" className="elastic-tap inline-flex min-h-14 items-center justify-center gap-2 rounded-[24px] bg-cyan-300 px-5 font-black text-slate-950">
              <UserPlus size={18} />
              Зарегистрироваться
            </Link>
            <Link href="/" className="elastic-tap inline-flex min-h-14 items-center justify-center gap-2 rounded-[24px] bg-white/10 px-5 font-black text-cyan-100">
              <LogIn size={18} />
              Посмотреть JARQ
            </Link>
          </div>
        </section>

        <motion.section initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 350, damping: 26 }} className="rounded-[36px] p-5 text-center liquid-glass">
          <div className="mx-auto max-w-[300px]">
            <MaaniyCharacter mood="happy" size="lg" showBubble message="Добро пожаловать! Pro уже ждёт тебя" />
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-yellow-300 px-4 py-2 text-sm font-black text-slate-950">
            <Sparkles size={17} />
            +3 дня Pro после входа
          </div>
        </motion.section>
      </MotionPage>
    </main>
  );
}
