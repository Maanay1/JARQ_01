"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, Save, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { AuthGate } from "@/components/auth/AuthGate";
import { MentorAvatarId, useAuth } from "@/components/auth/AuthProvider";
import { MascotSelector } from "@/components/profile/MascotSelector";
import { hapticTap } from "@/components/ui/HapticProvider";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { MotionPage } from "@/components/ui/MotionPage";

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
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setUsername(profile?.username ?? "");
  }, [profile?.username]);

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

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-6 jarq-text sm:px-6 md:py-8 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="courses" className="relative z-10">
        <section className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="grid gap-4">
            <motion.div
              className="rounded-[28px] p-5 liquid-glass"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
            >
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">Личный кабинет</div>
              <h1 className="mt-2 text-3xl font-semibold">Профиль ученика</h1>
              <p className="mt-2 text-sm leading-6 jarq-muted">{user?.email ?? "JARQ student"} · Новичок · 240 XP</p>
            </motion.div>

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
              {["Стрик: 3 дня", "Уровень: Новичок", "Ментор: " + selectedAvatarId.toUpperCase()].map((item) => (
                <div key={item} className="rounded-[28px] p-4 font-semibold liquid-glass">
                  {item}
                </div>
              ))}
            </div>

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
          </div>

          <MascotSelector selectedAvatarId={selectedAvatarId} onSelect={handleAvatarSelect} />
        </section>
      </MotionPage>
    </main>
  );
}
