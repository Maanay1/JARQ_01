"use client";

import { FormEvent, useState } from "react";
import { Github, Loader2, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { MaaniyCharacter } from "@/components/MaaniyCharacter";

export default function LoginPage() {
  const { isConfigured, signInWithEmail, signInWithOAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setStatus(null);
    await signInWithEmail(email.trim());
    setStatus("Проверь почту: мы отправили magic link для входа.");
    setIsLoading(false);
  }

  async function handleOAuth(provider: "google" | "github") {
    setOauthError(null);
    const result = await signInWithOAuth(provider);
    if (result.error) {
      setOauthError(result.error);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-24 pt-8 jarq-text">
      <FuturisticBackground />
      <ExperienceControls />
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center">
        <motion.div
          className="rounded-[32px] p-5 liquid-glass"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
        >
          <MaaniyCharacter size="sm" showBubble message="Войди, и я сохраню твой прогресс 💙" className="mx-auto" />
          <div className="mt-5 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
              <Sparkles size={15} />
              JARQ Auth
            </div>
            <h1 className="mt-4 text-3xl font-semibold">Войти в обучение</h1>
            <p className="mt-2 text-sm leading-6 jarq-muted">Профиль, XP, стрик и выбранный Сэнсэй будут синхронизироваться через Supabase.</p>
          </div>

          {!isConfigured ? (
            <div className="mt-5 rounded-[24px] border border-amber-300/30 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
              Supabase keys не настроены. Добавь `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
            </div>
          ) : null}

          <div className="mt-6 grid gap-3">
            <motion.button
              type="button"
              onClick={() => handleOAuth("google")}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="elastic-tap min-h-14 rounded-[24px] bg-cyan-300 px-4 text-base font-bold text-slate-950 disabled:opacity-50"
              disabled={!isConfigured}
            >
              Войти через Google
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleOAuth("github")}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="elastic-tap inline-flex min-h-14 items-center justify-center gap-2 rounded-[24px] border border-white/[0.08] bg-slate-950/45 px-4 text-base font-bold backdrop-blur-xl disabled:opacity-50"
              disabled={!isConfigured}
            >
              <Github size={19} />
              GitHub
            </motion.button>
          </div>

          {oauthError ? (
            <div className="mt-4 rounded-[24px] border border-rose-300/30 bg-rose-400/10 p-4 text-sm leading-6 text-rose-100">
              {oauthError}
            </div>
          ) : null}

          <div className="mt-4 rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 jarq-muted">
            Если Google открывает JSON `provider is not enabled`, включи Google Provider в Supabase Auth Providers и добавь redirect URL.
          </div>

          <form onSubmit={handleEmail} className="mt-4 grid gap-3">
            <label className="text-sm font-bold jarq-muted" htmlFor="email">
              Email magic link
            </label>
            <input
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="student@jarq.ai"
              className="min-h-14 rounded-[24px] border border-white/[0.08] bg-slate-950/45 px-4 text-[16px] font-semibold outline-none backdrop-blur-xl focus:border-cyan-300"
            />
            <button
              type="submit"
              disabled={!isConfigured || isLoading || !email.trim()}
              className="elastic-tap inline-flex min-h-14 items-center justify-center gap-2 rounded-[24px] bg-white/10 px-4 text-base font-bold disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />}
              Отправить ссылку
            </button>
          </form>

          {status ? <div className="mt-4 rounded-[24px] bg-emerald-400/12 p-4 text-sm font-semibold text-emerald-100">{status}</div> : null}
        </motion.div>
      </section>
    </main>
  );
}
