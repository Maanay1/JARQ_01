"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CheckCircle2, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { MentorCharacter } from "@/components/mentors/MentorCharacter";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { setSubscriptionPlan, SubscriptionPlan } from "@/lib/subscription";

export default function SubscriptionSuccessPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan") as SubscriptionPlan | null;
    setSubscriptionPlan(plan === "pro_yearly" ? "pro_yearly" : "pro_monthly");
  }, []);

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-20 jarq-text">
      <FuturisticBackground />
      <ExperienceControls />
      <motion.section
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 26 }}
        className="relative z-10 mx-auto max-w-lg rounded-[36px] p-6 text-center liquid-glass"
      >
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 420, damping: 18 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-cyan-300 text-slate-950">
          <CheckCircle2 size={44} />
        </motion.div>
        <div className="mt-5 flex justify-center">
          <MentorCharacter avatarId="maanay" selected size="md" message="Йей! Pro открыт ✨" />
        </div>
        <h1 className="mt-5 text-4xl font-black">Добро пожаловать в JARQ Pro!</h1>
        <p className="mt-3 text-sm leading-6 jarq-muted">
          Все уроки, голосовой режим, офлайн и приоритетный AI ответ теперь открыты.
        </p>
        <Link href="/courses" className="elastic-tap mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[24px] bg-cyan-300 px-5 font-black text-slate-950">
          <Crown size={18} />
          Начать учиться
        </Link>
      </motion.section>
    </main>
  );
}
