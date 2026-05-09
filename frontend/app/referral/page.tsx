"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Copy, Crown, Gift, Send, Share2, Sparkles, Trophy, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import { AuthGate } from "@/components/auth/AuthGate";
import { useAuth } from "@/components/auth/AuthProvider";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { hapticSuccess, hapticTap } from "@/components/ui/HapticProvider";
import { MotionPage } from "@/components/ui/MotionPage";
import { buildReferralLink, getOrCreateReferralCode, isAmbassador, loadReferralFriends, ReferralFriend, referralRewards } from "@/lib/referral";

export default function ReferralPage() {
  return (
    <AuthGate>
      <ReferralContent />
    </AuthGate>
  );
}

function ReferralContent() {
  const { user, profile } = useAuth();
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [friends, setFriends] = useState<ReferralFriend[]>([]);
  const displayName = profile?.username ?? user?.user_metadata?.name ?? "Маааний";
  const referralLink = useMemo(() => code ? buildReferralLink(code) : "", [code]);
  const shareText = `Привет! Я учусь на JARQ — это AI репетитор по английскому и программированию. Лучше Duolingo! Попробуй бесплатно: ${referralLink}`;
  const total = friends.length;
  const nextReward = referralRewards.find((reward) => total < reward.target) ?? referralRewards[referralRewards.length - 1];
  const ambassador = isAmbassador(total);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const nextCode = await getOrCreateReferralCode(user, displayName);
      if (!mounted) return;
      setCode(nextCode);
      const nextFriends = await loadReferralFriends(user, nextCode);
      if (mounted) setFriends(nextFriends);
    }
    void load();
    return () => {
      mounted = false;
    };
  }, [displayName, user]);

  async function copyLink() {
    await navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    hapticSuccess();
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-6 jarq-text sm:px-6 md:pb-12 md:pt-28 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="courses" className="relative z-10 mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[36px] p-5 liquid-glass md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
                <Gift size={16} />
                Реферальная программа
              </div>
              <h1 className="mt-4 text-4xl font-black leading-tight text-transparent [background:linear-gradient(100deg,#f8fafc,#67e8f9,#c084fc,#fde68a)] [-webkit-background-clip:text] md:text-6xl">
                Приглашай друзей и получай Pro
              </h1>
              <p className="mt-3 text-base font-semibold leading-7 jarq-muted">
                Друг регистрируется по ссылке — он получает 3 дня Pro, а ты открываешь награды до статуса Амбассадор.
              </p>
            </div>
            <div className="rounded-[30px] bg-yellow-300 px-5 py-4 text-center font-black text-slate-950 shadow-[0_0_38px_rgba(250,204,21,.24)]">
              {ambassador ? "👑 Амбассадор" : `${total} друзей`}
            </div>
          </div>

          <div className="mt-6 rounded-[30px] border border-white/[0.08] bg-slate-950/55 p-4 backdrop-blur-xl">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">Твоя ссылка</div>
            <div className="mt-3 break-all rounded-[24px] bg-white/[0.06] p-4 text-sm font-bold text-white md:text-base">{referralLink || "Генерирую ссылку..."}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <button type="button" onClick={copyLink} className="elastic-tap inline-flex min-h-13 items-center justify-center gap-2 rounded-[22px] bg-cyan-300 px-4 text-sm font-black text-slate-950">
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? "Скопировано" : "Скопировать ссылку"}
              </button>
              <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer" className="elastic-tap inline-flex min-h-13 items-center justify-center gap-2 rounded-[22px] bg-emerald-400 px-4 text-sm font-black text-slate-950">
                <Share2 size={18} />
                WhatsApp
              </a>
              <a href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer" className="elastic-tap inline-flex min-h-13 items-center justify-center gap-2 rounded-[22px] bg-sky-300 px-4 text-sm font-black text-slate-950">
                <Send size={18} />
                Telegram
              </a>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[36px] p-5 liquid-glass">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">Прогресс</div>
              <h2 className="mt-1 text-2xl font-black">Следующая цель: {nextReward.title}</h2>
            </div>
            <Trophy className="text-yellow-200" size={32} />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {referralRewards.map((reward, index) => {
              const progress = Math.min(100, (total / reward.target) * 100);
              const reached = total >= reward.target;
              return (
                <motion.article key={reward.target} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={`rounded-[28px] border p-4 ${reached ? "border-yellow-300/40 bg-yellow-300/12" : "border-white/[0.08] bg-slate-950/45"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black">{total}/{reward.target}</span>
                    {reached ? <Crown className="text-yellow-200" /> : <Sparkles className="text-cyan-200" />}
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-yellow-300" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-3 text-sm font-black">{reward.title}</div>
                  <p className="mt-1 text-xs font-semibold leading-relaxed jarq-muted">{reward.description}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="mt-5 rounded-[36px] p-5 liquid-glass">
          <div className="flex items-center gap-2 text-2xl font-black">
            <UsersRound className="text-cyan-200" />
            Приглашённые друзья
          </div>
          <div className="mt-4 grid gap-3">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between gap-3 rounded-[26px] bg-white/[0.05] p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-[20px] bg-cyan-300/15 text-sm font-black text-cyan-100">
                    {friend.avatar_url ? <img src={friend.avatar_url} alt="" className="h-full w-full object-cover" /> : friend.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-black">{friend.name}</span>
                    <span className="block text-xs font-semibold jarq-muted">{new Intl.DateTimeFormat("ru", { day: "2-digit", month: "short" }).format(new Date(friend.created_at))}</span>
                  </span>
                </div>
                <span className="shrink-0 rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-black text-cyan-100">{statusLabel(friend.status)}</span>
              </div>
            ))}
            {!friends.length ? (
              <div className="rounded-[28px] border border-white/[0.08] bg-slate-950/45 p-6 text-center">
                <div className="text-xl font-black">Пока никто не пришёл</div>
                <p className="mt-2 text-sm font-semibold jarq-muted">Поделись ссылкой в WhatsApp или Telegram — первый друг откроет тебе 7 дней Pro.</p>
              </div>
            ) : null}
          </div>
        </section>

        <Link href="/profile" onClick={hapticTap} className="mt-5 inline-flex min-h-14 w-full items-center justify-center rounded-[24px] bg-white/10 px-5 font-black text-cyan-100">
          Вернуться в профиль
        </Link>
      </MotionPage>
    </main>
  );
}

function statusLabel(status: ReferralFriend["status"]) {
  if (status === "first_lesson") return "Прошёл первый урок";
  if (status === "active") return "Активный";
  return "Зарегистрировался";
}
