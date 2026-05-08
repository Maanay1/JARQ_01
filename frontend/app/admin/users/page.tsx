"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Search, ShieldOff } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDataset, AdminProfile, displayProfileName, formatDate, formatDateTime, isActiveSubscription, loadAdminDataset } from "@/lib/admin-data";

type SortKey = "name" | "created_at" | "last_seen" | "lessons_completed" | "streak" | "subscription" | "status";

export default function AdminUsersPage() {
  const [dataset, setDataset] = useState<AdminDataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");

  useEffect(() => {
    let mounted = true;
    loadAdminDataset()
      .then((nextDataset) => mounted && setDataset(nextDataset))
      .catch((reason) => mounted && setError(reason?.message ?? "Не удалось загрузить пользователей."));
    return () => {
      mounted = false;
    };
  }, []);

  const users = useMemo(() => {
    if (!dataset) return [];
    const activeSubscriptions = new Set(dataset.subscriptions.filter(isActiveSubscription).map((subscription) => subscription.user_id));
    return dataset.profiles
      .filter((profile) => {
        const searchValue = `${displayProfileName(profile)} ${profile.email ?? ""}`.toLowerCase();
        const matchesSearch = searchValue.includes(query.trim().toLowerCase());
        const status = profile.status ?? "active";
        const sub = activeSubscriptions.has(profile.id) ? "pro" : "free";
        return matchesSearch && (statusFilter === "all" || status === statusFilter) && (subscriptionFilter === "all" || sub === subscriptionFilter);
      })
      .sort((a, b) => compareProfiles(a, b, sortKey, activeSubscriptions));
  }, [dataset, query, sortKey, statusFilter, subscriptionFilter]);

  return (
    <AdminShell title="Пользователи" eyebrow="CRM учеников">
      {error ? <div className="mb-4 rounded-[24px] border border-red-300/30 bg-red-400/15 p-4 text-sm font-bold text-red-100">{error}</div> : null}
      <section className="rounded-[32px] p-5 liquid-glass">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-h-14 w-full rounded-[24px] border border-white/[0.08] bg-slate-950/45 pl-12 pr-4 text-[16px] font-semibold outline-none focus:border-cyan-300"
              placeholder="Поиск по имени или email"
            />
          </label>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="min-h-14 rounded-[24px] border border-white/[0.08] bg-slate-950/45 px-4 text-[16px] font-bold text-white outline-none">
            <option value="all">Все статусы</option>
            <option value="active">Активный</option>
            <option value="inactive">Неактивный</option>
            <option value="blocked">Заблокирован</option>
          </select>
          <select value={subscriptionFilter} onChange={(event) => setSubscriptionFilter(event.target.value)} className="min-h-14 rounded-[24px] border border-white/[0.08] bg-slate-950/45 px-4 text-[16px] font-bold text-white outline-none">
            <option value="all">Все тарифы</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
          </select>
        </div>

        {!dataset ? <div className="mt-5 h-80 animate-pulse rounded-[28px] bg-white/10" /> : (
          <div className="mt-5 overflow-x-auto rounded-[28px] border border-white/[0.08]">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="bg-white/[0.05] text-xs uppercase tracking-[0.12em] jarq-muted">
                <tr>
                  <SortableHead label="Ученик" sortKey="name" current={sortKey} onSort={setSortKey} />
                  <SortableHead label="Регистрация" sortKey="created_at" current={sortKey} onSort={setSortKey} />
                  <SortableHead label="Последний вход" sortKey="last_seen" current={sortKey} onSort={setSortKey} />
                  <SortableHead label="Уроков" sortKey="lessons_completed" current={sortKey} onSort={setSortKey} />
                  <SortableHead label="Стрик" sortKey="streak" current={sortKey} onSort={setSortKey} />
                  <SortableHead label="Подписка" sortKey="subscription" current={sortKey} onSort={setSortKey} />
                  <SortableHead label="Статус" sortKey="status" current={sortKey} onSort={setSortKey} />
                  <th className="px-4 py-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((profile) => {
                  const subscription = dataset.subscriptions.find((item) => item.user_id === profile.id && isActiveSubscription(item));
                  return (
                    <tr key={profile.id} className="border-t border-white/[0.06] transition hover:bg-cyan-300/[0.06]">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[18px] bg-cyan-300/15 text-sm font-black text-cyan-100">
                            {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" /> : displayProfileName(profile).slice(0, 2).toUpperCase()}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-black text-white">{displayProfileName(profile)}</span>
                            <span className="block truncate text-xs jarq-muted">{profile.email ?? "email не сохранён"}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 jarq-muted">{formatDate(profile.created_at)}</td>
                      <td className="px-4 py-4 jarq-muted">{formatDateTime(profile.last_seen)}</td>
                      <td className="px-4 py-4 font-black">{profile.lessons_completed ?? dataset.activities.filter((item) => item.user_id === profile.id).length}</td>
                      <td className="px-4 py-4 font-black">{profile.streak ?? 0}</td>
                      <td className="px-4 py-4">
                        <span className={subscription ? "rounded-full bg-yellow-300 px-3 py-1 font-black text-slate-950" : "rounded-full bg-white/10 px-3 py-1 font-bold text-slate-200"}>
                          {subscription ? `Pro до ${formatDate(subscription.current_period_end)}` : "Free"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={profile.status === "blocked" ? "rounded-full bg-red-400/20 px-3 py-1 font-bold text-red-100" : "rounded-full bg-emerald-400/15 px-3 py-1 font-bold text-emerald-100"}>
                          {profile.status === "blocked" ? "Заблокирован" : profile.status === "inactive" ? "Неактивный" : "Активный"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <Link href={`/profile?user=${profile.id}`} className="grid h-10 w-10 place-items-center rounded-[16px] bg-white/10 text-cyan-100">
                            <Eye size={17} />
                          </Link>
                          <button type="button" className="grid h-10 w-10 place-items-center rounded-[16px] bg-red-400/15 text-red-100" title="Заблокировать через Supabase policy">
                            <ShieldOff size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}

function SortableHead({ label, sortKey, current, onSort }: { label: string; sortKey: SortKey; current: SortKey; onSort: (key: SortKey) => void }) {
  return (
    <th className="px-4 py-3">
      <button type="button" onClick={() => onSort(sortKey)} className={current === sortKey ? "text-cyan-100" : "hover:text-white"}>
        {label}
      </button>
    </th>
  );
}

function compareProfiles(a: AdminProfile, b: AdminProfile, key: SortKey, activeSubscriptions: Set<string | null>) {
  if (key === "name") return displayProfileName(a).localeCompare(displayProfileName(b), "ru");
  if (key === "subscription") return Number(activeSubscriptions.has(b.id)) - Number(activeSubscriptions.has(a.id));
  if (key === "status") return String(a.status ?? "active").localeCompare(String(b.status ?? "active"));
  if (key === "lessons_completed") return (b.lessons_completed ?? 0) - (a.lessons_completed ?? 0);
  if (key === "streak") return (b.streak ?? 0) - (a.streak ?? 0);
  return new Date((b[key] as string | null) ?? 0).getTime() - new Date((a[key] as string | null) ?? 0).getTime();
}
