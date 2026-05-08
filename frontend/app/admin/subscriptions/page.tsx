"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BadgePercent, Banknote, Crown, TrendingUp, XCircle } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AnimatedNumber } from "@/components/admin/AnimatedNumber";
import { AdminDataset, formatDate, isActiveSubscription, loadAdminDataset } from "@/lib/admin-data";

const monthlyPrice: Record<string, number> = {
  pro: 990,
  monthly: 990,
  yearly: 7900,
  "pro-yearly": 7900,
};

export default function AdminSubscriptionsPage() {
  const [dataset, setDataset] = useState<AdminDataset | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    loadAdminDataset()
      .then((nextDataset) => mounted && setDataset(nextDataset))
      .catch((reason) => mounted && setError(reason?.message ?? "Не удалось загрузить подписки."));
    return () => {
      mounted = false;
    };
  }, []);

  const activeSubscriptions = useMemo(() => dataset?.subscriptions.filter(isActiveSubscription) ?? [], [dataset]);
  const totalRevenue = useMemo(() => {
    if (!dataset) return 0;
    return dataset.subscriptions.reduce((sum, subscription) => sum + priceForPlan(subscription.plan), 0);
  }, [dataset]);
  const cancelledLastMonth = useMemo(() => {
    if (!dataset) return 0;
    const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return dataset.subscriptions.filter((subscription) => subscription.current_period_end && new Date(subscription.current_period_end).getTime() < Date.now() && new Date(subscription.current_period_end).getTime() >= monthAgo).length;
  }, [dataset]);
  const conversion = dataset?.profiles.length ? Math.round((activeSubscriptions.length / dataset.profiles.length) * 100) : 0;

  const revenueChart = useMemo(() => {
    if (!dataset) return [];
    return Array.from({ length: 12 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - index), 1);
      const key = date.toISOString().slice(0, 7);
      return {
        month: new Intl.DateTimeFormat("ru", { month: "short" }).format(date),
        revenue: dataset.subscriptions
          .filter((subscription) => subscription.created_at?.startsWith(key))
          .reduce((sum, subscription) => sum + priceForPlan(subscription.plan), 0),
      };
    });
  }, [dataset]);

  const cards = [
    { label: "Всего заработано", value: totalRevenue, suffix: " сом", icon: Banknote },
    { label: "Активные подписки", value: activeSubscriptions.length, icon: Crown },
    { label: "Отменены за месяц", value: cancelledLastMonth, icon: XCircle },
    { label: "Конверсия Free → Pro", value: conversion, suffix: "%", icon: BadgePercent },
  ];

  return (
    <AdminShell title="Подписки" eyebrow="Монетизация">
      {error ? <div className="mb-4 rounded-[24px] border border-red-300/30 bg-red-400/15 p-4 text-sm font-bold text-red-100">{error}</div> : null}
      {!dataset ? <div className="h-80 animate-pulse rounded-[32px] bg-white/10" /> : (
        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.label} className="rounded-[28px] p-5 liquid-glass">
                  <Icon className="text-yellow-200" />
                  <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] jarq-muted">{card.label}</p>
                  <AnimatedNumber value={card.value} suffix={card.suffix} className="mt-2 block text-4xl font-black text-white" />
                </article>
              );
            })}
          </div>

          <section className="rounded-[32px] p-5 liquid-glass">
            <div className="flex items-center gap-2 text-xl font-black">
              <TrendingUp className="text-cyan-200" />
              Доход по месяцам
            </div>
            <div className="mt-5 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChart}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.55} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip cursor={{ stroke: "rgba(34,211,238,0.35)" }} contentStyle={{ background: "#0b1025", border: "1px solid rgba(255,255,255,.1)", borderRadius: 18, color: "#fff" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={3} fill="url(#revenueFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="overflow-x-auto rounded-[32px] p-5 liquid-glass">
            <h2 className="text-xl font-black">Последние подписки</h2>
            <table className="mt-4 w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.12em] jarq-muted">
                <tr>
                  <th className="px-4 py-3">Пользователь</th>
                  <th className="px-4 py-3">Тариф</th>
                  <th className="px-4 py-3">Сумма</th>
                  <th className="px-4 py-3">Окончание</th>
                  <th className="px-4 py-3">Статус</th>
                </tr>
              </thead>
              <tbody>
                {dataset.subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="border-t border-white/[0.06] transition hover:bg-cyan-300/[0.06]">
                    <td className="px-4 py-4 font-bold">{subscription.user_id?.slice(0, 8) ?? "нет user_id"}</td>
                    <td className="px-4 py-4 font-black text-cyan-100">{subscription.plan ?? "free"}</td>
                    <td className="px-4 py-4">{priceForPlan(subscription.plan).toLocaleString("ru")} сом</td>
                    <td className="px-4 py-4 jarq-muted">{formatDate(subscription.current_period_end)}</td>
                    <td className="px-4 py-4">
                      <span className={isActiveSubscription(subscription) ? "rounded-full bg-emerald-400/20 px-3 py-1 font-bold text-emerald-100" : "rounded-full bg-white/10 px-3 py-1 font-bold text-slate-200"}>
                        {isActiveSubscription(subscription) ? "Активна" : "Завершена"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}
    </AdminShell>
  );
}

function priceForPlan(plan?: string | null) {
  if (!plan) return 0;
  return monthlyPrice[plan] ?? 990;
}
