"use client";

import Link from "next/link";
import { Bot, Brain, Flame, Mic, Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { MaaniyCharacter } from "@/components/MaaniyCharacter";
import { MaaniyMood, useMaaniyInteraction } from "@/components/maaniy/useMaaniyInteraction";

export function HeroSection() {
  const { mood, setMood, resetMood, triggerClick } = useMaaniyInteraction();
  const benefits = ["Память ученика", "Живые уроки", "XP система"];

  function hoverProps(nextMood: MaaniyMood) {
    return {
      onMouseEnter: () => setMood(nextMood),
      onMouseLeave: resetMood,
      onClick: triggerClick,
    };
  }

  return (
    <section className="relative overflow-hidden border-b jarq-border">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="relative mx-auto grid min-h-[auto] max-w-6xl items-center gap-5 px-4 pb-10 pt-6 sm:px-6 sm:py-24 lg:min-h-[92vh] lg:grid-cols-[minmax(0,1fr)_minmax(360px,480px)] lg:gap-10 lg:px-8 lg:py-8">
        <div className="order-2 min-w-0 text-center lg:order-1 lg:text-left">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 px-3 py-2 text-sm font-semibold text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.2)] backdrop-blur-xl jarq-soft"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles size={16} />
            AI репетитор для студенческого экспо
          </motion.div>

          <h1 className="jarq-title-gradient mt-5 text-4xl font-semibold leading-none sm:mt-6 sm:text-6xl lg:text-8xl">
            JARQ учит как игра, объясняет как репетитор
          </h1>
          <p className="jarq-muted mx-auto mt-5 max-w-2xl text-base leading-7 sm:text-xl sm:leading-8 lg:mx-0 lg:text-2xl">
            Маанай ведёт студента по персональному пути: английский, программирование, голосовая практика, XP и память ошибок.
          </p>

          <div className="mt-7 grid gap-3 sm:mx-auto sm:max-w-md lg:mx-0 lg:flex lg:max-w-none lg:flex-row">
            <Link
              href="/courses"
              {...hoverProps("hover")}
              className="button-lift inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.35)] transition hover:bg-cyan-200"
            >
              <Wand2 size={18} />
              Начать бесплатно
            </Link>
            <Link
              href="/chat"
              {...hoverProps("happy")}
              className="button-lift jarq-text inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold ring-1 backdrop-blur-xl transition hover:bg-white/16 jarq-soft"
            >
              <Bot size={18} />
              Open AI Chat
            </Link>
            <Link
              href="#voice-demo"
              {...hoverProps("focused")}
              className="button-lift jarq-text inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-purple-300/30 bg-purple-400/10 px-5 py-3 text-sm font-semibold backdrop-blur-xl transition hover:border-cyan-300"
            >
              <Mic size={18} />
              Try Voice Mode
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm font-semibold jarq-muted lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-2 jarq-soft">
              <Flame size={16} className="text-cyan-200" />
              Стрик: 3 дня
            </span>
            <span className="rounded-full px-3 py-2 jarq-soft">Уровень: Новичок</span>
            <span className="rounded-full px-3 py-2 jarq-soft">240 XP</span>
          </div>
          <div className="mx-auto mt-7 grid max-w-2xl gap-3 sm:grid-cols-3 lg:mx-0">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                className="min-w-0 rounded-xl px-4 py-3 text-sm font-semibold jarq-glass"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.08 }}
              >
                {benefit}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="order-1 relative min-h-[260px] min-w-0 overflow-visible sm:min-h-[500px] lg:order-2 lg:min-h-[560px]">
          <div className="absolute inset-x-6 top-16 h-56 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.22),rgba(168,85,247,0.12)_42%,transparent_70%)] blur-2xl sm:h-80" />
          <div className="relative mx-auto flex min-h-[260px] max-w-[460px] flex-col justify-between sm:min-h-[500px] lg:min-h-[560px]">
            <div className="hidden min-w-0 items-center justify-between rounded-xl border px-4 py-3 backdrop-blur-xl jarq-border jarq-soft sm:flex">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">
                  Главный персонаж
                </div>
                <div className="mt-1 text-xl font-semibold jarq-text">МААНАЙ</div>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-full bg-cyan-300/20 text-cyan-100">
                <Brain size={22} />
              </div>
            </div>

            <div className="grid min-h-[220px] place-items-center py-2 sm:min-h-[360px] sm:py-4 lg:min-h-[450px]">
              <MaaniyCharacter
                mood={mood}
                size="lg"
                showBubble
                message="Привет, я Маанай — твой AI репетитор"
                className="h-[180px] w-[180px] translate-y-2 sm:h-80 sm:w-80 lg:h-[27rem] lg:w-[27rem]"
              />
            </div>

            <div className="hidden space-y-3 rounded-xl border p-3 backdrop-blur-xl jarq-border jarq-soft sm:block">
              <div className="jarq-muted max-w-[86%] rounded-lg px-4 py-3 text-sm leading-6 backdrop-blur jarq-soft">
                Скажи, что хочешь потренировать. Я запомню сложные места.
              </div>
              <div className="ml-auto max-w-[86%] rounded-lg bg-cyan-300 px-4 py-3 text-sm leading-6 text-slate-950">
                Помоги мне звучать естественно на английском.
              </div>
              <div className="max-w-[86%] rounded-lg bg-purple-400/18 px-4 py-3 text-sm leading-6 jarq-text">
                Отлично. Будем тренироваться коротко, точно и по-человечески.
              </div>
            </div>

            <div className="hidden grid-cols-3 gap-2 pt-4 sm:grid">
              <Signal label="голос" value="демо" />
              <Signal label="память" value="живая" />
              <Signal label="настрой" value="мягкий" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md px-3 py-2 backdrop-blur jarq-soft">
      <div className="jarq-muted text-xs uppercase tracking-[0.12em]">{label}</div>
      <div className="mt-1 text-sm font-semibold jarq-text">{value}</div>
    </div>
  );
}
