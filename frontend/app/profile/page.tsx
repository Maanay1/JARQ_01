"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Camera, LogOut, Mail, Save, Settings, Sparkles } from "lucide-react";
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
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const provider = user?.app_metadata?.provider ? String(user.app_metadata.provider) : "email";
  const googlePhoto = typeof user?.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : null;
  const displayPhoto = profilePhoto ?? googlePhoto;
  const displayName = username || profile?.username || user?.user_metadata?.name || "JARQ student";

  useEffect(() => {
    setUsername(profile?.username ?? "");
  }, [profile?.username]);

  useEffect(() => {
    setProfilePhoto(window.localStorage.getItem("jarq-profile-photo"));
  }, []);

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
                  <h1 className="mt-3 text-4xl font-black leading-none text-transparent [background:linear-gradient(100deg,#f8fafc,#67e8f9,#c084fc,#f8fafc)] [-webkit-background-clip:text]">
                    {displayName}
                  </h1>
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
              {["🔥 Стрик: 3 дня", "🚀 Уровень: Новичок", "🎭 Ментор: " + selectedAvatarId.toUpperCase().replace("_", "-")].map((item) => (
                <div key={item} className="rounded-[28px] p-4 font-semibold text-transparent liquid-glass [background-image:linear-gradient(120deg,#f8fafc,#a5f3fc,#d8b4fe)] [-webkit-background-clip:text]">
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

function initials(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "JQ";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}
