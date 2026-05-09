"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Brain, Flame, Headphones, MessageCircle, Play, Sparkles, Trophy, Zap } from "lucide-react";
import { MaaniyCharacter } from "@/components/MaaniyCharacter";
import { useAuth } from "@/components/auth/AuthProvider";
import { useJarqExperience } from "@/components/JarqExperience";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";

type LearningGoal = "english" | "programming" | "both";

const spring = { type: "spring", stiffness: 350, damping: 26 } as const;

export function HomePage() {
  const { theme } = useJarqExperience();
  const { isLoading, user, profile, updateProfile } = useAuth();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const isNight = theme === "night";

  useEffect(() => {
    setIsOnboarded(window.localStorage.getItem("jarq_onboarded") === "true");
  }, [user?.id]);

  if (isLoading || isOnboarded === null) {
    return (
      <Shell isNight={isNight}>
        <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center px-4">
          <div className="h-64 w-full max-w-xl animate-pulse rounded-[32px] border border-white/10 bg-white/10 backdrop-blur-xl" />
        </div>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell isNight={isNight}>
        <LandingScreen />
      </Shell>
    );
  }

  if (!isOnboarded) {
    return (
      <Shell isNight={isNight}>
        <OnboardingScreen
          onDone={async (payload) => {
            await updateProfile({
              learning_goal: payload.goal,
              learning_level: payload.level,
              daily_goal_minutes: payload.dailyGoal,
            });
            window.localStorage.setItem("jarq_onboarded", "true");
            setIsOnboarded(true);
          }}
        />
      </Shell>
    );
  }

  return (
    <Shell isNight={isNight}>
      <DashboardScreen name={profile?.username ?? user.email?.split("@")[0] ?? "ученик"} />
    </Shell>
  );
}

function Shell({ children, isNight }: { children: React.ReactNode; isNight: boolean }) {
  return (
    <main className={`relative min-h-screen overflow-hidden ${isNight ? "text-white" : "text-slate-950"}`}>
      <FuturisticBackground />
      <ExperienceControls />
      <div className="relative z-10">{children}</div>
    </main>
  );
}

function LandingScreen() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-8 px-4 pb-28 pt-28 md:grid-cols-[1fr_0.88fr] md:px-8 md:pb-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="space-y-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-cyan-100">
          <Sparkles size={16} /> JARQ AI-репетитор
        </div>
        <div className="space-y-4">
          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl">
            Учись с Мааанием как в игре
          </h1>
          <p className="max-w-2xl text-lg font-semibold leading-8 text-slate-300 md:text-xl">
            Английский, программирование, разговорная практика и персональная память прогресса в одном AI-приложении.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/login" className="elastic-tap inline-flex min-h-14 items-center justify-center gap-2 rounded-[24px] bg-cyan-300 px-6 font-black text-slate-950 shadow-[0_0_32px_rgba(34,211,238,0.35)]">
            Начать бесплатно <ArrowRight size={18} />
          </Link>
          <Link href="/login" className="elastic-tap inline-flex min-h-14 items-center justify-center rounded-[24px] border border-white/15 bg-white/10 px-6 font-black text-white backdrop-blur-xl">
            Войти
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Память ученика", "Маааний помнит ошибки"],
            ["Живые уроки", "Диалоги вместо сухих правил"],
            ["XP и стрик", "Мотивация каждый день"],
          ].map(([title, text]) => (
            <motion.div key={title} whileHover={{ scale: 0.98 }} whileTap={{ scale: 0.95 }} transition={spring} className="rounded-[28px] border border-white/10 bg-slate-950/65 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-xl">
              <div className="font-black text-white">{title}</div>
              <div className="mt-1 text-sm font-semibold text-slate-400">{text}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.92, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={spring} className="relative mx-auto w-full max-w-[430px]">
        <div className="absolute inset-8 rounded-full bg-cyan-300/25 blur-3xl" />
        <div className="relative rounded-[36px] border border-white/10 bg-slate-950/65 p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-xl">
          <MaaniyCharacter mood="happy" size="lg" showBubble message="Привет! Я помогу начать 💙" className="mx-auto" />
          <div className="mt-4 rounded-[24px] bg-white/10 p-4 text-left">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">Слоган</div>
            <div className="mt-2 text-2xl font-black text-white">JARQ помнит, объясняет и тренирует.</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function OnboardingScreen({ onDone }: { onDone: (payload: { goal: LearningGoal; level: string; dailyGoal: number }) => Promise<void> }) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<LearningGoal>("english");
  const [level, setLevel] = useState("zero");
  const [dailyGoal, setDailyGoal] = useState(10);
  const [saving, setSaving] = useState(false);

  const levels = goal === "programming"
    ? [
        ["zero", "Никогда не программировал"],
        ["some", "Немного знаком"],
        ["middle", "Есть опыт"],
      ]
    : [
        ["zero", "Полный ноль"],
        ["some", "Немного знаю"],
        ["middle", "Средний уровень"],
      ];

  const next = async () => {
    if (step < 3) {
      setStep((value) => value + 1);
      return;
    }
    setSaving(true);
    await onDone({ goal, level, dailyGoal });
    setSaving(false);
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-72px)] max-w-5xl items-center px-4 pb-28 pt-24 md:px-8 md:pb-16">
      <motion.div key={step} initial={{ opacity: 0, x: 48, scale: 0.98 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -48 }} transition={spring} className="grid w-full gap-5 rounded-[36px] border border-white/10 bg-slate-950/65 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-xl md:grid-cols-[0.7fr_1fr] md:p-8">
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-gradient-to-br from-cyan-300/15 to-purple-500/15 p-5">
          <MaaniyCharacter mood={step === 0 ? "happy" : "focused"} size="md" showBubble message={step === 0 ? "Познакомимся?" : "Выбери свой путь"} />
          <div className="mt-4 flex gap-2">
            {[0, 1, 2, 3].map((dot) => <span key={dot} className={`h-2 rounded-full transition-all ${dot === step ? "w-8 bg-cyan-300" : "w-2 bg-white/20"}`} />)}
          </div>
        </div>

        <div className="flex min-h-[430px] flex-col justify-between gap-6">
          {step === 0 ? (
            <div className="space-y-4">
              <Kicker>Шаг 1</Kicker>
              <h2 className="text-4xl font-black text-white">Привет! Я Маааний — твой личный AI репетитор</h2>
              <p className="text-lg font-semibold leading-8 text-slate-300">Я буду помнить тебя, твои ошибки и твой прогресс, чтобы каждый урок был точнее.</p>
            </div>
          ) : null}

          {step === 1 ? (
            <ChoiceStep title="Что хочешь выучить?" kicker="Шаг 2">
              {[
                ["english", "Английский", "Разговоры, фразы, произношение"],
                ["programming", "Программирование", "Python и компьютерная логика"],
                ["both", "Оба", "Сбалансированный путь"],
              ].map(([id, title, text]) => (
                <ChoiceCard key={id} active={goal === id} onClick={() => setGoal(id as LearningGoal)} title={title} text={text} />
              ))}
            </ChoiceStep>
          ) : null}

          {step === 2 ? (
            <ChoiceStep title="Какой у тебя уровень?" kicker="Шаг 3">
              {levels.map(([id, title]) => <ChoiceCard key={id} active={level === id} onClick={() => setLevel(id)} title={title} text="Маааний подстроит сложность уроков." />)}
            </ChoiceStep>
          ) : null}

          {step === 3 ? (
            <ChoiceStep title="Сколько времени готов учиться каждый день?" kicker="Шаг 4">
              {[5, 10, 20, 30].map((minutes) => (
                <ChoiceCard key={minutes} active={dailyGoal === minutes} onClick={() => setDailyGoal(minutes)} title={minutes === 30 ? "30+ мин" : `${minutes} мин`} text="Я напомню тебе каждый день в нужное время." />
              ))}
            </ChoiceStep>
          ) : null}

          <button onClick={next} disabled={saving} className="elastic-tap inline-flex min-h-14 items-center justify-center gap-2 rounded-[24px] bg-cyan-300 px-6 font-black text-slate-950 shadow-[0_0_32px_rgba(34,211,238,0.28)] disabled:opacity-60">
            {step === 0 ? "Познакомимся!" : step === 3 ? (saving ? "Сохраняю..." : "Начать учиться!") : "Дальше"}
            <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>
    </section>
  );
}

function DashboardScreen({ name }: { name: string }) {
  const [stats, setStats] = useState({ lessons: 0, xp: 240, vocab: 0, studiedToday: false, progress: 38 });
  const hour = new Date().getHours();
  const greeting = hour >= 6 && hour < 12
    ? "Доброе утро! Готов к уроку?"
    : hour >= 12 && hour < 18
      ? "Привет! Продолжим где остановились?"
      : hour >= 18 && hour < 23
        ? "Вечер — отличное время для повторения!"
        : "Поздно уже! Один быстрый урок?";
  const maaniyMood = hour >= 23 || hour < 6 ? "thinking" : hour < 12 ? "happy" : "idle";

  useEffect(() => {
    let lessons = 0;
    let xp = 240;
    let progress = 38;
    Object.keys(window.localStorage).forEach((key) => {
      if (!key.startsWith("jarq-lesson-progress:")) return;
      lessons += 1;
      try {
        const value = JSON.parse(window.localStorage.getItem(key) ?? "{}") as { score?: number; step?: number; total?: number; completedAt?: string };
        xp += Math.max(10, Math.round(value.score ?? 20));
        if (value.step && value.total) progress = Math.round((value.step / value.total) * 100);
      } catch {
        progress = 38;
      }
    });
    const vocab = Object.keys(JSON.parse(window.localStorage.getItem("jarq-smart-vocabulary-status") ?? "{}")).length;
    const today = new Date().toISOString().slice(0, 10);
    const studiedToday = window.localStorage.getItem("jarq-last-study-date") === today || window.localStorage.getItem("jarq-reels-day") === today;
    setStats({ lessons, xp, vocab, studiedToday, progress });
  }, []);

  const recommendation = useMemo(() => {
    if (stats.vocab > 0) return `${stats.vocab} фраз ждут повторения в словаре.`;
    if (stats.lessons < 2) return "Попробуй разговорный урок — он быстрее всего прокачивает речь.";
    return "Сегодня хорошо зайдёт короткий JARQ Reels на 60 секунд.";
  }, [stats.lessons, stats.vocab]);

  return (
    <section className="mx-auto min-h-screen max-w-7xl px-4 pb-28 pt-24 md:px-8 md:pb-16">
      <div className="grid gap-5 lg:grid-cols-[1fr_0.52fr]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="rounded-[36px] border border-white/10 bg-slate-950/65 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-xl md:p-7">
          <Kicker>Дашборд</Kicker>
          <h1 className="mt-3 text-4xl font-black leading-tight text-white md:text-6xl">{greeting}</h1>
          <p className="mt-3 text-lg font-semibold text-slate-300">{name}, Маааний уже подготовил короткий маршрут на сегодня.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InfoCard icon={<Flame />} title={`${stats.studiedToday ? "Стрик сохранён ✓" : "Не потеряй стрик!"}`} text={stats.studiedToday ? "Сегодня ты уже занимался." : `Осталось ${24 - hour} ч до конца дня.`} accent="🔥 3 дня" />
            <InfoCard icon={<Play />} title="Продолжить" text="Последний незаконченный урок" accent={`${stats.progress}%`} href="/lesson/english-beginner-greetings" />
          </div>

          <div className="mt-4 rounded-[28px] border border-cyan-300/15 bg-cyan-300/10 p-4">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-cyan-200"><Brain size={16} /> Рекомендует Маааний</div>
            <p className="mt-2 text-xl font-black text-white">{recommendation}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={spring} className="rounded-[36px] border border-white/10 bg-slate-950/65 p-5 text-center shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-xl">
          <MaaniyCharacter mood={maaniyMood} size="md" showBubble message={greeting} className="mx-auto" />
          <div className="mt-4 grid grid-cols-2 gap-3 text-left">
            <Stat label="XP за неделю" value={String(stats.xp)} />
            <Stat label="Уроков всего" value={String(Math.max(stats.lessons, 3))} />
            <Stat label="Слов в словаре" value={String(stats.vocab)} />
            <Stat label="Уровень" value={stats.xp > 500 ? "Практик" : "Новичок"} />
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.08 }} className="mt-5">
        <Kicker>Что сегодня</Kicker>
        <div className="mt-3 flex gap-4 overflow-x-auto pb-3">
          {[
            ["/reels", "JARQ Reels", "3 новых коротких карточки", Zap],
            ["/lesson/english-beginner-greetings", "Разговорный урок", "Скажи что-то в реальной ситуации", MessageCircle],
            ["/vocabulary", "Повторение слов", "Фразы, которые реально говорят", BookOpen],
            ["/media", "Медиа", "Видео и подкасты на английском", Headphones],
          ].map(([href, title, text, Icon]) => (
            <Link key={String(href)} href={String(href)} className="elastic-tap min-w-[260px] rounded-[30px] border border-white/10 bg-slate-950/65 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-xl">
              <Icon className="text-cyan-200" size={26} />
              <div className="mt-5 text-2xl font-black text-white">{String(title)}</div>
              <div className="mt-2 text-sm font-bold leading-6 text-slate-400">{String(text)}</div>
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ChoiceStep({ title, kicker, children }: { title: string; kicker: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <Kicker>{kicker}</Kicker>
      <h2 className="text-4xl font-black text-white">{title}</h2>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function ChoiceCard({ active, onClick, title, text }: { active: boolean; onClick: () => void; title: string; text: string }) {
  return (
    <motion.button type="button" onClick={onClick} whileHover={{ scale: 0.98 }} whileTap={{ scale: 0.95 }} transition={spring} className={`min-h-20 rounded-[24px] border p-4 text-left touch-manipulation ${active ? "border-cyan-300 bg-cyan-300/15 shadow-[0_0_24px_rgba(34,211,238,0.22)]" : "border-white/10 bg-white/5"}`}>
      <div className="text-lg font-black text-white">{title}</div>
      <div className="mt-1 text-sm font-semibold text-slate-400">{text}</div>
    </motion.button>
  );
}

function InfoCard({ icon, title, text, accent, href }: { icon: React.ReactNode; title: string; text: string; accent: string; href?: string }) {
  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-[20px] bg-cyan-300/15 text-cyan-200">{icon}</div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-black text-cyan-100">{accent}</div>
      </div>
      <div className="mt-4 text-2xl font-black text-white">{title}</div>
      <div className="mt-1 text-sm font-bold text-slate-400">{text}</div>
      {href ? <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[38%] rounded-full bg-cyan-300" /></div> : null}
    </>
  );
  const className = "elastic-tap block rounded-[28px] border border-white/10 bg-white/5 p-5 text-left";
  return href ? <Link href={href} className={className}>{content}</Link> : <div className={className}>{content}</div>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-white/7 p-4">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-black text-white">{value}</div>
    </div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-cyan-200"><Trophy size={15} /> {children}</div>;
}
