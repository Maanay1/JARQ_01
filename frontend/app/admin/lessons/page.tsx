"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BookOpen, Clock, Target, TrendingDown } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AnimatedNumber } from "@/components/admin/AnimatedNumber";
import { AdminDataset, loadAdminDataset } from "@/lib/admin-data";

type LessonStat = {
  id: string;
  title: string;
  completed: number;
  avgScore: number;
  avgTime: number;
  abandoned: number;
};

export default function AdminLessonsPage() {
  const [dataset, setDataset] = useState<AdminDataset | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    loadAdminDataset()
      .then((nextDataset) => mounted && setDataset(nextDataset))
      .catch((reason) => mounted && setError(reason?.message ?? "Не удалось загрузить уроки."));
    return () => {
      mounted = false;
    };
  }, []);

  const lessons = useMemo<LessonStat[]>(() => {
    if (!dataset) return [];
    const groups = new Map<string, typeof dataset.activities>();
    dataset.activities.forEach((activity) => {
      const lessonId = activity.lesson_id ?? "unknown";
      groups.set(lessonId, [...(groups.get(lessonId) ?? []), activity]);
    });
    return Array.from(groups.entries())
      .map(([id, activities]) => {
        const completedActivities = activities.filter((activity) => (activity.action ?? "").includes("completed") || typeof activity.score === "number");
        const scores = completedActivities.map((activity) => activity.score).filter((score): score is number => typeof score === "number");
        const times = activities.map((activity) => activity.time_spent).filter((time): time is number => typeof time === "number");
        return {
          id,
          title: humanizeLessonId(id),
          completed: completedActivities.length,
          avgScore: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0,
          avgTime: times.length ? Math.round(times.reduce((sum, time) => sum + time, 0) / times.length) : 0,
          abandoned: activities.filter((activity) => (activity.action ?? "").includes("abandon")).length,
        };
      })
      .sort((a, b) => b.completed - a.completed);
  }, [dataset]);

  const summary = [
    { label: "Уроков в статистике", value: lessons.length, icon: BookOpen },
    { label: "Средний результат", value: average(lessons.map((lesson) => lesson.avgScore)), suffix: "%", icon: Target },
    { label: "Среднее время", value: average(lessons.map((lesson) => lesson.avgTime)), suffix: "с", icon: Clock },
    { label: "Бросили", value: lessons.reduce((sum, lesson) => sum + lesson.abandoned, 0), icon: TrendingDown },
  ];

  return (
    <AdminShell title="Уроки" eyebrow="Аналитика обучения">
      {error ? <div className="mb-4 rounded-[24px] border border-red-300/30 bg-red-400/15 p-4 text-sm font-bold text-red-100">{error}</div> : null}
      {!dataset ? <div className="h-80 animate-pulse rounded-[32px] bg-white/10" /> : (
        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summary.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-[28px] p-5 liquid-glass">
                  <Icon className="text-cyan-200" />
                  <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] jarq-muted">{item.label}</p>
                  <AnimatedNumber value={item.value} suffix={item.suffix} className="mt-2 block text-4xl font-black text-white" />
                </div>
              );
            })}
          </div>

          <section className="rounded-[32px] p-5 liquid-glass">
            <h2 className="text-xl font-black">Прохождения по урокам</h2>
            <div className="mt-5 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lessons.slice(0, 12)}>
                  <XAxis dataKey="title" stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={11} interval={0} angle={-15} height={70} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                  <Tooltip cursor={{ fill: "rgba(34,211,238,0.08)" }} contentStyle={{ background: "#0b1025", border: "1px solid rgba(255,255,255,.1)", borderRadius: 18, color: "#fff" }} />
                  <Bar dataKey="completed" radius={[10, 10, 0, 0]} fill="#a78bfa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="overflow-x-auto rounded-[32px] p-5 liquid-glass">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.12em] jarq-muted">
                <tr>
                  <th className="px-4 py-3">Урок</th>
                  <th className="px-4 py-3">Пройден</th>
                  <th className="px-4 py-3">Средний результат</th>
                  <th className="px-4 py-3">Среднее время</th>
                  <th className="px-4 py-3">Бросили</th>
                  <th className="px-4 py-3">Сложность</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => {
                  const hard = lesson.avgScore > 0 && lesson.avgScore < 70;
                  const easy = lesson.avgScore >= 86;
                  return (
                    <tr key={lesson.id} className="border-t border-white/[0.06] transition hover:bg-cyan-300/[0.06]">
                      <td className="px-4 py-4 font-black">{lesson.title}</td>
                      <td className="px-4 py-4">{lesson.completed}</td>
                      <td className="px-4 py-4">{lesson.avgScore}%</td>
                      <td className="px-4 py-4">{lesson.avgTime}с</td>
                      <td className="px-4 py-4">{lesson.abandoned}</td>
                      <td className="px-4 py-4">
                        <span className={hard ? "rounded-full bg-red-400/20 px-3 py-1 font-bold text-red-100" : easy ? "rounded-full bg-emerald-400/20 px-3 py-1 font-bold text-emerald-100" : "rounded-full bg-white/10 px-3 py-1 font-bold text-slate-200"}>
                          {hard ? "Сложный" : easy ? "Лёгкий" : "Норма"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </div>
      )}
    </AdminShell>
  );
}

function average(values: number[]): number {
  const cleanValues = values.filter((value) => Number.isFinite(value) && value > 0);
  return cleanValues.length ? Math.round(cleanValues.reduce((sum, value) => sum + value, 0) / cleanValues.length) : 0;
}

function humanizeLessonId(value: string): string {
  return value.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
