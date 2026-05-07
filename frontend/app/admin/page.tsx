"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Crown, Edit3, Lock, Plus, Save, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { AuthGate } from "@/components/auth/AuthGate";
import { useAuth } from "@/components/auth/AuthProvider";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { hapticTap } from "@/components/ui/HapticProvider";
import { MotionPage } from "@/components/ui/MotionPage";
import { isAdminEmail } from "@/lib/admin";

type AdminLessonDraft = {
  id: string;
  courseTitle: string;
  subject: "english" | "programming";
  lessonTitle: string;
  lessonGoal: string;
  updatedAt: string;
};

const STORAGE_KEY = "jarq-admin-lesson-drafts";

const starterDrafts: AdminLessonDraft[] = [
  {
    id: "english-beginner-market-dialogue",
    courseTitle: "English Beginner",
    subject: "english",
    lessonTitle: "Диалог на базаре",
    lessonGoal: "Научить покупать somsa и спрашивать цену на английском.",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "python-plov-calculator",
    courseTitle: "Python Beginner",
    subject: "programming",
    lessonTitle: "Калькулятор плова",
    lessonGoal: "Функция считает продукты для toy по количеству гостей.",
    updatedAt: new Date().toISOString(),
  },
];

export default function AdminPage() {
  return (
    <AuthGate>
      <AdminContent />
    </AuthGate>
  );
}

function AdminContent() {
  const { user } = useAuth();
  const [drafts, setDrafts] = useState<AdminLessonDraft[]>([]);
  const [courseTitle, setCourseTitle] = useState("English Beginner");
  const [subject, setSubject] = useState<AdminLessonDraft["subject"]>("english");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonGoal, setLessonGoal] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const isAdmin = isAdminEmail(user?.email);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setDrafts(starterDrafts);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(starterDrafts));
      return;
    }
    try {
      setDrafts(JSON.parse(raw) as AdminLessonDraft[]);
    } catch {
      setDrafts(starterDrafts);
    }
  }, []);

  const stats = useMemo(
    () => [
      { label: "Черновики", value: drafts.length },
      { label: "English", value: drafts.filter((draft) => draft.subject === "english").length },
      { label: "Programming", value: drafts.filter((draft) => draft.subject === "programming").length },
    ],
    [drafts],
  );

  function persist(nextDrafts: AdminLessonDraft[]) {
    setDrafts(nextDrafts);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDrafts));
    hapticTap();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = lessonTitle.trim();
    if (!cleanTitle) return;

    const nextDraft: AdminLessonDraft = {
      id: cleanTitle.toLowerCase().replace(/[^a-zа-я0-9]+/gi, "-").replace(/^-|-$/g, "") || `lesson-${Date.now()}`,
      courseTitle: courseTitle.trim() || (subject === "english" ? "English Course" : "Programming Course"),
      subject,
      lessonTitle: cleanTitle,
      lessonGoal: lessonGoal.trim() || "Нужно дописать цель урока.",
      updatedAt: new Date().toISOString(),
    };

    persist([nextDraft, ...drafts.filter((draft) => draft.id !== (editingId ?? nextDraft.id))]);
    setLessonTitle("");
    setLessonGoal("");
    setEditingId(null);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1400);
  }

  function handleEdit(draft: AdminLessonDraft) {
    setEditingId(draft.id);
    setCourseTitle(draft.courseTitle);
    setSubject(draft.subject);
    setLessonTitle(draft.lessonTitle);
    setLessonGoal(draft.lessonGoal);
    hapticTap();
  }

  if (!isAdmin) {
    return (
      <main className="relative min-h-screen overflow-hidden px-4 pb-24 pt-6 jarq-text md:pt-28">
        <FuturisticBackground />
        <ExperienceControls />
        <section className="relative z-10 mx-auto max-w-md rounded-[32px] p-6 text-center liquid-glass">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-[26px] bg-purple-400/15 text-purple-100">
            <Lock size={30} />
          </div>
          <h1 className="mt-4 text-3xl font-black">Админ доступ закрыт</h1>
          <p className="mt-3 text-sm leading-relaxed jarq-muted">
            Этот кабинет доступен только владельцу JARQ. Войди с админ-аккаунта, чтобы добавлять курсы и править уроки.
          </p>
          <Link href="/profile" className="elastic-tap mt-5 inline-flex min-h-14 w-full items-center justify-center rounded-[24px] bg-cyan-300 px-5 font-bold text-slate-950">
            Вернуться в профиль
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-6 jarq-text sm:px-6 md:pb-10 md:pt-28 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="courses" className="relative z-10">
        <section className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[420px_minmax(0,1fr)]">
          <div className="grid content-start gap-4">
            <div className="rounded-[32px] p-5 liquid-glass">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-300/20 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-100">
                <Crown size={15} />
                Личный админ кабинет
              </div>
              <h1 className="mt-4 text-4xl font-black leading-tight text-transparent [background:linear-gradient(100deg,#f8fafc,#67e8f9,#c084fc)] [-webkit-background-clip:text]">
                Управление JARQ
              </h1>
              <p className="mt-3 text-sm leading-relaxed jarq-muted">
                Аккаунт: {user?.email}. Здесь можно готовить новые курсы и править уроки без изменений backend.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[24px] border border-white/[0.08] bg-slate-950/50 p-4 text-center backdrop-blur-xl">
                  <div className="text-2xl font-black text-cyan-100">{stat.value}</div>
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] jarq-muted">{stat.label}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="rounded-[32px] p-5 liquid-glass">
              <div className="flex items-center gap-2 text-lg font-black">
                <Plus size={20} className="text-cyan-200" />
                {editingId ? "Редактировать урок" : "Новый урок"}
              </div>

              <label className="mt-4 block text-sm font-bold jarq-muted">
                Курс
                <input
                  value={courseTitle}
                  onChange={(event) => setCourseTitle(event.target.value)}
                  className="mt-2 min-h-14 w-full rounded-[24px] border border-white/[0.08] bg-slate-950/45 px-4 text-[16px] font-semibold outline-none focus:border-cyan-300"
                />
              </label>

              <label className="mt-4 block text-sm font-bold jarq-muted">
                Направление
                <select
                  value={subject}
                  onChange={(event) => setSubject(event.target.value as AdminLessonDraft["subject"])}
                  className="mt-2 min-h-14 w-full rounded-[24px] border border-white/[0.08] bg-slate-950/45 px-4 text-[16px] font-semibold text-white outline-none focus:border-cyan-300"
                >
                  <option value="english">Английский</option>
                  <option value="programming">Программирование</option>
                </select>
              </label>

              <label className="mt-4 block text-sm font-bold jarq-muted">
                Название урока
                <input
                  value={lessonTitle}
                  onChange={(event) => setLessonTitle(event.target.value)}
                  className="mt-2 min-h-14 w-full rounded-[24px] border border-white/[0.08] bg-slate-950/45 px-4 text-[16px] font-semibold outline-none focus:border-cyan-300"
                  placeholder="Например, Past Simple в Бишкеке"
                />
              </label>

              <label className="mt-4 block text-sm font-bold jarq-muted">
                Что должен выучить ученик
                <textarea
                  value={lessonGoal}
                  onChange={(event) => setLessonGoal(event.target.value)}
                  className="mt-2 min-h-28 w-full resize-none rounded-[24px] border border-white/[0.08] bg-slate-950/45 px-4 py-3 text-[16px] font-semibold outline-none focus:border-cyan-300"
                  placeholder="Кратко опиши цель и задание урока"
                />
              </label>

              <button type="submit" className="elastic-tap mt-4 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[24px] bg-cyan-300 px-5 text-base font-bold text-slate-950">
                <Save size={18} />
                {saved ? "Сохранено" : editingId ? "Сохранить правки" : "Добавить урок"}
              </button>
            </form>
          </div>

          <section className="rounded-[32px] p-5 liquid-glass">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">Контент</div>
                <h2 className="mt-1 text-2xl font-black">Черновики уроков</h2>
              </div>
              <BookOpen className="text-cyan-200" />
            </div>

            <div className="mt-5 grid gap-3">
              {drafts.map((draft, index) => (
                <motion.article
                  key={draft.id}
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 26, delay: index * 0.03 }}
                  className="rounded-[28px] border border-white/[0.08] bg-slate-950/45 p-4 backdrop-blur-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-bold uppercase tracking-[0.14em] text-purple-100">{draft.courseTitle}</div>
                      <h3 className="mt-1 truncate text-xl font-black">{draft.lessonTitle}</h3>
                    </div>
                    <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-bold text-cyan-100">
                      {draft.subject === "english" ? "EN" : "CODE"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed jarq-muted">{draft.lessonGoal}</p>
                  <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold jarq-muted">
                    <span>{new Intl.DateTimeFormat("ru", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(draft.updatedAt))}</span>
                    <button type="button" onClick={() => handleEdit(draft)} className="elastic-tap inline-flex items-center gap-2 rounded-[18px] bg-white/10 px-3 py-2 text-cyan-100">
                      <Edit3 size={14} />
                      Править
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        </section>
      </MotionPage>
    </main>
  );
}
