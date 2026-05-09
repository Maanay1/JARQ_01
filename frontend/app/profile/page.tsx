"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Award, BookOpen, CalendarCheck, Camera, Crown, Flame, Gift, GraduationCap, LogOut, Mail, Medal, Save, Settings, Sparkles, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { AuthGate } from "@/components/auth/AuthGate";
import { MentorAvatarId, useAuth } from "@/components/auth/AuthProvider";
import { MascotSelector } from "@/components/profile/MascotSelector";
import { hapticTap } from "@/components/ui/HapticProvider";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { MotionPage } from "@/components/ui/MotionPage";
import { isAmbassador, loadReferralTotal } from "@/lib/referral";
import { getSubscriptionPlan, isProPlan, SubscriptionPlan } from "@/lib/subscription";

export default function ProfilePage() {
  return (
    <AuthGate>
      <ProfileContent />
    </AuthGate>
  );
}

function ProfileContent() {
  const { profile, selectedAvatarId, updateProfile, signOut, user } = useAuth();
  const [username, setUsername] = useState(profile?.username ?? "");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>("free");
  const [referralTotal, setReferralTotal] = useState(0);
  const provider = user?.app_metadata?.provider ? String(user.app_metadata.provider) : "email";
  const googlePhoto = typeof user?.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : null;
  const displayPhoto = profilePhoto ?? googlePhoto;
  const displayName = username || profile?.username || user?.user_metadata?.name || "JARQ student";
  const isAdmin = profile?.role === "admin";
  const isPro = isProPlan(subscriptionPlan);
  const ambassador = isAmbassador(referralTotal);
  const mentorLabel = selectedAvatarId.toUpperCase().replace("_", "-");
  const rewards = [
    { title: "Первый урок", text: "Старт в JARQ открыт", icon: Medal, active: true },
    { title: "Первый день", text: "Профиль создан сегодня", icon: Flame, active: true },
    { title: "Неделя стрика", text: "Осталось 4 дня", icon: CalendarCheck, active: false },
    { title: "100 XP", text: "Награда за практику", icon: Trophy, active: true },
    { title: "Английский", text: "Начни путь Beginner", icon: BookOpen, active: false },
    { title: "Кодинг", text: "Открой Python миссию", icon: GraduationCap, active: false },
  ];

  useEffect(() => {
    setUsername(profile?.username ?? "");
  }, [profile?.username]);

  useEffect(() => {
    setProfilePhoto(window.localStorage.getItem("jarq-profile-photo"));
  }, []);

  useEffect(() => {
    function syncSubscription() {
      setSubscriptionPlan(getSubscriptionPlan());
    }
    syncSubscription();
    window.addEventListener("jarq-subscription-change", syncSubscription);
    return () => window.removeEventListener("jarq-subscription-change", syncSubscription);
  }, []);

  useEffect(() => {
    let mounted = true;
    loadReferralTotal(user).then((total) => {
      if (mounted) setReferralTotal(total);
    });
    return () => {
      mounted = false;
    };
  }, [user]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    await updateProfile({ username: username.trim() || "JARQ student" });
    hapticTap();
    setSaved(true);
    setIsSaving(false);
    window.setTimeout(() => setSaved(false), 1400);
  }

  async function handleAvatarSelect(avatarId: MentorAvatarId) {
    await updateProfile({ selected_avatar_id: avatarId });
    hapticTap();
  }

  function handlePhotoChange(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const value = typeof reader.result === "string" ? reader.result : null;
      if (!value) return;
      setProfilePhoto(value);
      window.localStorage.setItem("jarq-profile-photo", value);
      hapticTap();
    };
    reader.readAsDataURL(file);
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-6 jarq-text sm:px-6 md:py-8 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="courses" className="relative z-10">
        <section className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="grid gap-4">
            <motion.div
              className="relative overflow-hidden rounded-[32px] p-5 liquid-glass"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
            >
              <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />
              <div className="absolute -bottom-20 left-6 h-44 w-44 rounded-full bg-purple-400/18 blur-3xl" />
              <div className="relative grid gap-4 sm:grid-cols-[112px_minmax(0,1fr)] sm:items-center">
                <label className="group relative mx-auto grid h-28 w-28 cursor-pointer place-items-center overflow-hidden rounded-[32px] border border-white/[0.08] bg-slate-950/50 shadow-[0_18px_48px_rgba(34,211,238,0.16)] backdrop-blur-xl sm:mx-0">
                  {displayPhoto ? (
                    <img src={displayPhoto} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-transparent [background:linear-gradient(135deg,#22d3ee,#a855f7,#f8fafc)] [-webkit-background-clip:text]">
                      {initials(displayName)}
                    </span>
                  )}
                  <span className="absolute inset-x-2 bottom-2 inline-flex min-h-9 items-center justify-center gap-1 rounded-[20px] bg-slate-950/75 text-xs font-bold text-cyan-100 opacity-95 backdrop-blur-xl">
                    <Camera size={14} />
                    Фото
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => handlePhotoChange(event.target.files?.[0])}
                  />
                </label>
                <div className="min-w-0 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
                    <Sparkles size={15} />
                    Личный кабинет
                  </div>
                  <div className="mt-3 flex min-w-0 flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <h1 className="min-w-0 text-4xl font-black leading-none text-transparent [background:linear-gradient(100deg,#f8fafc,#67e8f9,#c084fc,#f8fafc)] [-webkit-background-clip:text]">
                      {displayName}
                    </h1>
                    {isPro ? (
                      <span className="inline-flex items-center rounded-full bg-yellow-300 px-3 py-1 text-sm font-black text-slate-950 shadow-[0_0_24px_rgba(250,204,21,0.32)]">
                        ⭐ PRO
                      </span>
                    ) : null}
                    {ambassador ? (
                      <span className="inline-flex items-center rounded-full bg-amber-300 px-3 py-1 text-sm font-black text-slate-950 shadow-[0_0_24px_rgba(251,191,36,0.32)]">
                        👑 Амбассадор
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-3 flex min-w-0 flex-col gap-2 text-sm font-semibold jarq-muted sm:flex-row sm:flex-wrap">
                    <span className="inline-flex min-w-0 items-center justify-center gap-2 rounded-full bg-white/10 px-3 py-2 sm:justify-start">
                      <Mail size={15} />
                      <span className="truncate">{user?.email ?? "JARQ student"}</span>
                    </span>
                    <span className="rounded-full bg-cyan-300/15 px-3 py-2 text-cyan-100">Вход: {provider}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <Link href="/referral" className="button-lift relative overflow-hidden rounded-[32px] border border-cyan-300/25 bg-cyan-300/10 p-5 shadow-[0_0_32px_rgba(34,211,238,.16)] backdrop-blur-xl">
              <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-cyan-300/20 blur-2xl" />
              <div className="relative flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
                    <Gift size={16} />
                    Рефералы
                  </div>
                  <div className="mt-2 text-xl font-black">Пригласи друга — получи 7 дней Pro бесплатно →</div>
                  <p className="mt-1 text-sm font-semibold jarq-muted">Уже приглашено: {referralTotal}</p>
                </div>
                <Crown className="shrink-0 text-yellow-200" size={34} />
              </div>
            </Link>

            <form onSubmit={handleSave} className="rounded-[28px] p-5 liquid-glass">
              <label htmlFor="username" className="text-sm font-bold jarq-muted">
                Имя ученика
              </label>
              <input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-3 min-h-14 w-full rounded-[24px] border border-white/[0.08] bg-slate-950/45 px-4 text-[16px] font-semibold outline-none backdrop-blur-xl focus:border-cyan-300"
                placeholder="Например, Байэл"
              />
              <button
                type="submit"
                disabled={isSaving}
                className="elastic-tap mt-4 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[24px] bg-cyan-300 px-5 text-base font-bold text-slate-950 disabled:opacity-60"
              >
                <Save size={18} />
                {isSaving ? "Сохраняю..." : saved ? "Сохранено" : "Сохранить"}
              </button>
            </form>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Стрик", value: "3 дня", icon: Flame },
                { label: "Уровень", value: "Новичок", icon: Crown },
                { label: "Ментор", value: mentorLabel, icon: Sparkles },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-[28px] border border-white/[0.08] bg-slate-950/50 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[20px] bg-cyan-300/15 text-cyan-100">
                        <Icon size={20} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-bold uppercase tracking-[0.14em] text-cyan-200">{item.label}</span>
                        <span className="block truncate text-lg font-black text-white">{item.value}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <section className="rounded-[32px] p-5 liquid-glass">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">Награды</div>
                  <h2 className="mt-1 text-2xl font-black">Мотивация ученика</h2>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-[22px] bg-purple-400/20 text-purple-100">
                  <Award size={24} />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {rewards.map((reward, index) => {
                  const Icon = reward.icon;
                  return (
                    <motion.div
                      key={reward.title}
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 26, delay: index * 0.04 }}
                      className={`min-h-32 rounded-[28px] border p-4 ${
                        reward.active
                          ? "border-cyan-300/35 bg-cyan-300/10 shadow-[0_0_28px_rgba(34,211,238,0.14)]"
                          : "border-white/[0.08] bg-slate-950/35 opacity-80"
                      }`}
                    >
                      <div className={`grid h-11 w-11 place-items-center rounded-[20px] ${reward.active ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-slate-300"}`}>
                        <Icon size={20} />
                      </div>
                      <div className="mt-3 text-sm font-black text-white">{reward.title}</div>
                      <div className="mt-1 text-xs font-semibold leading-relaxed jarq-muted">{reward.text}</div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/courses" className="elastic-tap inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[24px] bg-cyan-300 px-5 text-base font-bold text-slate-950">
                <Settings size={18} />
                Продолжить обучение
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="elastic-tap inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[24px] border border-white/[0.08] bg-slate-950/45 px-5 text-base font-bold backdrop-blur-xl"
              >
                <LogOut size={18} />
                Выйти
              </button>
            </div>

            {isAdmin ? (
              <Link href="/admin" className="elastic-tap inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[24px] border border-purple-300/35 bg-purple-400/15 px-5 text-base font-bold text-purple-50 shadow-[0_0_30px_rgba(168,85,247,0.18)]">
                <Crown size={18} />
                Админ кабинет JARQ
              </Link>
            ) : null}
          </div>

          <MascotSelector selectedAvatarId={selectedAvatarId} onSelect={handleAvatarSelect} />
        </section>
      </MotionPage>
    </main>
  );
}


function initials(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "JQ";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}
