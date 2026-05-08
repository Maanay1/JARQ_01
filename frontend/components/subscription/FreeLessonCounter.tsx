"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Crown, Lock } from "lucide-react";
import { FREE_DAILY_LESSON_LIMIT, getSubscriptionPlan, getTodayLessonUsage, isProPlan } from "@/lib/subscription";

export function FreeLessonCounter() {
  const [plan, setPlan] = useState(getSubscriptionPlan());
  const [used, setUsed] = useState(getTodayLessonUsage().count);
  const isPro = isProPlan(plan);
  const remaining = Math.max(0, FREE_DAILY_LESSON_LIMIT - used);
  const percent = Math.min(100, (used / FREE_DAILY_LESSON_LIMIT) * 100);

  useEffect(() => {
    function sync() {
      setPlan(getSubscriptionPlan());
      setUsed(getTodayLessonUsage().count);
    }
    window.addEventListener("jarq-subscription-change", sync);
    window.addEventListener("jarq-lesson-usage-change", sync);
    return () => {
      window.removeEventListener("jarq-subscription-change", sync);
      window.removeEventListener("jarq-lesson-usage-change", sync);
    };
  }, []);

  if (isPro) {
    return (
      <div className="rounded-[24px] border border-yellow-300/30 bg-yellow-300/10 p-4 text-sm font-bold text-yellow-100">
        <Crown className="mr-2 inline" size={18} />
        JARQ Pro активен: уроки без лимитов.
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-cyan-300/25 bg-slate-950/55 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 text-sm font-bold">
        <span>Осталось уроков сегодня: {remaining} из {FREE_DAILY_LESSON_LIMIT}</span>
        <Link href="/subscription" className="text-cyan-200 hover:text-cyan-100">Pro</Link>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-purple-400" style={{ width: `${percent}%` }} />
      </div>
      {remaining === 0 ? (
        <Link href="/subscription" className="mt-3 flex items-center gap-2 rounded-[20px] bg-purple-400/15 p-3 text-sm font-bold text-purple-100">
          <Lock size={16} />
          Получи Pro для безлимитных уроков
        </Link>
      ) : null}
    </div>
  );
}
