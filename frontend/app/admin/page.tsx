"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Crown, UserCheck, UserMinus, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import { AdminShell } from "@/components/admin/AdminShell";
import { AnimatedNumber } from "@/components/admin/AnimatedNumber";
import {
  AdminDataset,
  displayProfileName,
  formatDateTime,
  isActiveSubscription,
  isProfileActive,
  isProfileInactive,
  loadAdminDataset,
} from "@/lib/admin-data";

export default function AdminOverviewPage() {
  const [dataset, setDataset] = useState<AdminDataset | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    loadAdminDataset()
      .then((nextDataset) => {
        if (mounted) setDataset(nextDataset);
      })
      .catch((reason) => {
        if (mounted) setError(reason?.message ?? "Не удалось загрузить Supabase данные.");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    if (!dataset) return null;
    const now = Date.now();
    const thisWeek = dataset.profiles.filter((profile) => profile.created_at && new Date(profile.created_at).getTime() >= now - 7 * 24 * 60 * 60 * 1000).length;
    const prevWeek = dataset.profiles.filter((profile) => {
      if (!profile.created_at) return false;
      const created = new Date(profile.created_at).getTime();
      return created < now - 7 * 24 * 60 * 60 * 1000 && created >= now - 14 * 24 * 60 * 60 * 1000;
    }).length;
    const growth = prevWeek === 0 ? (thisWeek > 0 ? 100 : 0) : Math.round(((thisWeek - prevWeek) / prevWeek) * 100);

    return [
      { label: "Всего пользователей", value: dataset.profiles.length, delta: `${growth >= 0 ? "+" : ""}${growth}% за неделю`, icon: UsersRound },
      { label: "Активные сегодня", value: dataset.profiles.filter(isProfileActive).length, delta: "последние 24 часа", icon: UserCheck },
      { label: "Неактивные", value: dataset.profiles.filter(isProfileInactive).length, delta: "больше 7 дней", icon: UserMinus },
      { label: "Pro подписчики", value: dataset.subscriptions.filter(isActiveSubscription).length, delta: "платящие", icon: Crown },
    ];
  }, [dataset]);

  const chartData = useMemo(() => {
    if (!dataset) return [];
    return Array.from({ length: 30 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - index));
      const key = date.toISOString().slice(0, 10);
      return {
        day: new Intl.DateTimeFormat("ru", { day: "2-digit", month: "2-digit" }).format(date),
        lessons: dataset.activities.filter((activity) => activity.created_at?.startsWith(key)).length,
      };
    });
  }, [dataset]);

  const topUsers = useMemo(() => {
    if (!dataset) return [];
    return dataset.profiles
      .map((profile) => ({
        profile,
        completed: dataset.activities.filter((activity) => activity.user_id === profile.id && (activity.action ?? "").includes("lesson")).length || profile.lessons_completed || 0,
      }))
      .sort((a, b) => b.completed - a.completed)
      .slice(0, 10);
  }, [dataset]);

  return (
    <AdminShell title="Обзор JARQ" eyebrow="Админ панель">
      {error ? <AdminError message={error} /> : null}
      {!dataset || !metrics ? <AdminLoading /> : (
        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.article
                  key={metric.label}
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 26, delay: index * 0.04 }}
                  className="rounded-[28px] p-5 liquid-glass"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] jarq-muted">{metric.label}</p>
                      <AnimatedNumber value={metric.value} className="mt-3 block text-4xl font-black text-white" />
                    </div>
                    <span className="grid h-12 w-12 place-items-center rounded-[22px] bg-cyan-300/15 text-cyan-100">
                      <Icon size={23} />
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-bold text-cyan-100">{metric.delta}</p>
                </motion.article>
              );
            })}
          </div>

          <section className="rounded-[32px] p-5 liquid-glass">
            <div className="flex items-center gap-2 text-xl font-black">
              <Activity className="text-cyan-200" />
              Активность за 30 дней
            </div>
            <div className="mt-5 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                  <Tooltip cursor={{ fill: "rgba(34,211,238,0.08)" }} contentStyle={{ background: "#0b1025", border: "1px solid rgba(255,255,255,.1)", borderRadius: 18, color: "#fff" }} />
                  <Bar dataKey="lessons" radius={[10, 10, 0, 0]} fill="#22d3ee" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-2">
            <section className="rounded-[32px] p-5 liquid-glass">
              <h2 className="text-xl font-black">Топ 10 активных пользователей</h2>
              <div className="mt-4 grid gap-3">
                {topUsers.map(({ profile, completed }, index) => (
                  <div key={profile.id} className="flex items-center justify-between gap-4 rounded-[24px] bg-white/[0.04] p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[18px] bg-cyan-300/15 text-sm font-black text-cyan-100">{index + 1}</span>
                      <div className="min-w-0">
                        <div className="truncate font-black">{displayProfileName(profile)}</div>
                        <div className="text-xs font-semibold jarq-muted">{formatDateTime(profile.last_seen)}</div>
                      </div>
                    </div>
                    <span className="rounded-full bg-cyan-300 px-3 py-1 text-sm font-black text-slate-950">{completed}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[32px] p-5 liquid-glass">
              <h2 className="text-xl font-black">Последние 10 регистраций</h2>
              <div className="mt-4 grid gap-3">
                {dataset.profiles.slice(0, 10).map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between gap-4 rounded-[24px] bg-white/[0.04] p-3">
                    <div className="min-w-0">
                      <div className="truncate font-black">{displayProfileName(profile)}</div>
                      <div className="text-xs font-semibold jarq-muted">{profile.email ?? "email не сохранён"}</div>
                    </div>
                    <div className="shrink-0 text-right text-xs font-bold jarq-muted">
                      <div>{formatDateTime(profile.created_at)}</div>
                      <div>{profile.source ?? "direct"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function AdminLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-36 animate-pulse rounded-[28px] bg-white/10" />
      ))}
    </div>
  );
}

function AdminError({ message }: { message: string }) {
  return <div className="mb-4 rounded-[24px] border border-red-300/30 bg-red-400/15 p-4 text-sm font-bold text-red-100">{message}</div>;
}
