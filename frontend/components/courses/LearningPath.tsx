"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Flame, LockKeyhole, Play, Star, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { LearningTrack, userLevelFromXp } from "@/lib/learning-paths";

type LearningPathProps = {
  track: LearningTrack;
};

export function LearningPath({ track }: LearningPathProps) {
  const totalXp = track.levels.reduce((sum, level) => sum + Math.round((level.xp * level.progress) / 100), 0);
  const totalProgress = Math.round(track.levels.reduce((sum, level) => sum + level.progress, 0) / track.levels.length);

  return (
    <section className="mx-auto max-w-6xl min-w-0">
      <Link href="/courses" className="button-lift inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold jarq-soft jarq-muted hover:text-cyan-100">
        <ArrowLeft size={16} />
        Выбор направления
      </Link>

      <header className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200 jarq-soft">
            <Star size={15} />
            Игровой путь JARQ
          </div>
          <h1 className="jarq-title-gradient mt-4 text-4xl font-semibold leading-tight sm:text-6xl">{track.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 jarq-muted sm:text-lg">{track.description}</p>
        </div>

        <div className="rounded-2xl p-5 jarq-glass">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] jarq-muted">Твой ранг</div>
              <div className="mt-1 text-2xl font-semibold jarq-text">{userLevelFromXp(totalXp)}</div>
            </div>
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-300/20 text-cyan-100">
              <Trophy size={25} />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat label="XP" value={String(totalXp)} />
            <Stat label="Стрик" value="3 дня" icon={<Flame size={16} />} />
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] jarq-muted">
              <span>Прогресс курса</span>
              <span>{totalProgress}%</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${track.accent}`}
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="relative mt-10 pb-8">
        <div className="absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-gradient-to-b from-cyan-300/70 via-purple-300/40 to-transparent md:block" />
        <div className="grid gap-5">
          {track.levels.map((level, index) => {
            const Icon = level.icon;
            const isLeft = index % 2 === 0;
            return (
              <motion.article
                key={level.id}
                className={`relative grid min-w-0 gap-4 md:grid-cols-[1fr_80px_1fr] md:items-center`}
                initial={{ opacity: 0, y: 22, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.07, duration: 0.45, ease: "easeOut" }}
              >
                <div className={isLeft ? "md:order-1" : "md:order-3"}>{isLeft ? <LevelCard track={track} level={level} index={index} Icon={Icon} /> : null}</div>
                <div className="relative order-1 flex justify-start md:order-2 md:justify-center">
                  <div className={`grid h-16 w-16 place-items-center rounded-2xl border shadow-[0_0_45px_rgba(34,211,238,0.16)] backdrop-blur-xl ${level.locked ? "border-white/[0.12] bg-white/[0.08] jarq-muted" : "border-cyan-300/45 bg-cyan-300/20 text-cyan-100"}`}>
                    {level.locked ? <LockKeyhole size={23} /> : <Icon size={25} />}
                  </div>
                </div>
                <div className={isLeft ? "md:order-3" : "md:order-1"}>{!isLeft ? <LevelCard track={track} level={level} index={index} Icon={Icon} /> : null}</div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LevelCard({
  track,
  level,
  index,
  Icon,
}: {
  track: LearningTrack;
  level: LearningTrack["levels"][number];
  index: number;
  Icon: LearningTrack["levels"][number]["icon"];
}) {
  const href = track.id === "english" && index === 0 ? "/lesson/english-beginner-alphabet-am" : track.id === "programming" && index === 0 ? "/lesson/programming-foundations-what-is-code" : "#";

  return (
    <div className={`button-lift min-w-0 rounded-2xl p-5 transition hover:border-cyan-300/60 ${level.locked ? "opacity-70 jarq-soft" : "jarq-glass"}`}>
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] jarq-muted">
            Уровень {index + 1}
            {level.locked ? <LockKeyhole size={14} /> : null}
          </div>
          <h2 className="mt-2 text-xl font-semibold jarq-text">{level.title}</h2>
          <p className="mt-2 text-sm leading-6 jarq-muted">{level.description}</p>
        </div>
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${track.accent} text-slate-950`}>
          <Icon size={22} />
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] jarq-muted">
          <span>{level.locked ? "Закрыто" : "Прогресс"}</span>
          <span>+{level.xp} XP</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${track.accent}`}
            initial={{ width: 0 }}
            animate={{ width: `${level.progress}%` }}
            transition={{ duration: 0.7, delay: 0.1 + index * 0.06 }}
          />
        </div>
      </div>

      <Link
        href={href}
        aria-disabled={level.locked}
        className={`mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition ${
          level.locked ? "pointer-events-none bg-white/[0.08] jarq-muted" : "bg-cyan-300 text-slate-950 hover:bg-cyan-200"
        }`}
      >
        {level.locked ? <LockKeyhole size={16} /> : <Play size={16} />}
        {level.locked ? "Откроется позже" : "Начать"}
      </Link>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="rounded-xl p-3 jarq-soft">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] jarq-muted">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold jarq-text">{value}</div>
    </div>
  );
}
