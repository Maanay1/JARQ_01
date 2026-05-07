"use client";

import { useEffect, useMemo, useState } from "react";
import { Flame, Trophy } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { MotionPage } from "@/components/ui/MotionPage";

type SavedLessonProgress = {
  user_id: string;
  lesson_id: string;
  score: number;
  completed_at: string;
  xp_earned: number;
  unlocked_next: boolean;
};

const demoCompleted: SavedLessonProgress[] = [
  progress("english-beginner-alphabet-am", 86, 50, 0),
  progress("programming-foundations-what-is-code", 92, 60, 1),
  progress("english-beginner-greetings", 78, 40, 2),
];

export default function ProgressPage() {
  const { user } = useAuth();
  const [savedProgress, setSavedProgress] = useState<SavedLessonProgress[]>([]);

  useEffect(() => {
    const items: SavedLessonProgress[] = [];
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key?.startsWith("jarq-lesson-progress:")) continue;
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      try {
        items.push(JSON.parse(raw) as SavedLessonProgress);
      } catch {
        // Ignore old or malformed local progress entries.
      }
    }
    setSavedProgress(items.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()));
  }, []);

  const completed = savedProgress.length ? savedProgress : demoCompleted;
  const totalXp = completed.reduce((sum, item) => sum + item.xp_earned, 0);
  const xpPercent = Math.max(8, Math.min(100, totalXp % 100 || 68));
  const activity = useMemo(() => buildActivity(completed), [completed]);
  const streak = countStreak(completed);

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-6 jarq-text sm:px-6 md:pb-10 md:pt-28 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="courses" className="relative z-10">
        <section className="mx-auto max-w-3xl">
          <div className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-200">Прогресс</div>
          <h1 className="mt-3 text-3xl font-semibold leading-tight">Твой рост в JARQ</h1>
          <p className="mt-2 text-sm jarq-muted">{user?.email ? `Аккаунт: ${user.email}` : "Демо-прогресс. Войди, чтобы закрепить результат."}</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] p-5 liquid-glass">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-[20px] bg-cyan-300/20 text-cyan-100">
                  <Flame size={24} />
                </div>
                <div>
                  <div className="text-sm font-bold jarq-muted">Стрик</div>
                  <div className="text-2xl font-semibold">{streak} дня</div>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] p-5 liquid-glass">
              <div className="flex items-center gap-3">
                <div className="grid h-16 w-16 place-items-center rounded-full" style={{ background: `conic-gradient(#22d3ee ${xpPercent}%, rgba(255,255,255,0.12) 0)` }}>
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-[#050b1a] text-sm font-bold">{xpPercent}%</div>
                </div>
                <div>
                  <div className="text-sm font-bold jarq-muted">XP всего</div>
                  <div className="text-2xl font-semibold">{totalXp || 150}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[28px] p-5 liquid-glass">
            <div className="flex items-center gap-2 font-bold">
              <Trophy size={18} className="text-cyan-200" />
              Активность за 7 дней
            </div>
            <div className="mt-5 flex h-36 items-end gap-2">
              {activity.map((height, index) => (
                <div key={index} className="flex h-full flex-1 flex-col justify-end gap-2">
                  <div
                    className="min-h-2 w-full rounded-t-[14px] bg-gradient-to-t from-cyan-300 to-purple-400 shadow-[0_0_18px_rgba(34,211,238,0.24)]"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-center text-xs jarq-muted">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-[28px] p-5 liquid-glass">
            <div className="font-bold">Пройденные уроки</div>
            <div className="mt-4 space-y-3">
              {completed.map((lesson) => (
                <div key={lesson.lesson_id} className="flex items-center justify-between gap-3 rounded-[24px] p-3 jarq-soft">
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{lessonTitle(lesson.lesson_id)}</div>
                    <div className="text-sm jarq-muted">{formatDate(lesson.completed_at)}</div>
                  </div>
                  <div className="rounded-[18px] bg-cyan-300 px-3 py-2 text-sm font-bold text-slate-950">{lesson.score}%</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </MotionPage>
    </main>
  );
}

function progress(lessonId: string, score: number, xp: number, daysAgo: number): SavedLessonProgress {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return {
    user_id: "demo-user",
    lesson_id: lessonId,
    score,
    completed_at: date.toISOString(),
    xp_earned: xp,
    unlocked_next: score >= 70,
  };
}

function buildActivity(items: SavedLessonProgress[]): number[] {
  const buckets = Array.from({ length: 7 }, () => 0);
  const today = new Date();
  items.forEach((item) => {
    const date = new Date(item.completed_at);
    const diff = Math.floor((startOfDay(today).getTime() - startOfDay(date).getTime()) / 86400000);
    if (diff >= 0 && diff < 7) buckets[6 - diff] += Math.max(12, item.xp_earned);
  });
  const max = Math.max(60, ...buckets);
  return buckets.map((value) => Math.max(10, Math.round((value / max) * 100)));
}

function countStreak(items: SavedLessonProgress[]): number {
  const days = new Set(items.map((item) => startOfDay(new Date(item.completed_at)).toISOString()));
  let streak = 0;
  const cursor = startOfDay(new Date());
  while (days.has(cursor.toISOString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return Math.max(streak, 3);
}

function startOfDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function lessonTitle(lessonId: string): string {
  const labels: Record<string, string> = {
    "english-beginner-alphabet-am": "Алфавит A-M",
    "english-beginner-alphabet-nz": "Алфавит N-Z",
    "english-beginner-greetings": "Приветствия",
    "programming-foundations-what-is-code": "Что такое программирование",
    "python-beginner-hello-world": "Первая программа Python",
  };
  return labels[lessonId] ?? lessonId.replaceAll("-", " ");
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru", { day: "2-digit", month: "short" }).format(new Date(value));
}
