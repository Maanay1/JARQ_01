"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck, Bell, CheckCircle2, RotateCcw, Search, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { hapticError, hapticSuccess, hapticTap } from "@/components/ui/HapticProvider";
import { MotionPage } from "@/components/ui/MotionPage";
import { SmartPhrase, smartPhrases, VocabularyCategory, vocabularyCategories } from "@/lib/vocabulary-data";

type PhraseStatus = "new" | "learning" | "known";
type Filter = "all" | PhraseStatus;
type StoredStatus = { status: PhraseStatus; correct: number };

const STATUS_KEY = "jarq-smart-vocabulary-status";

export default function VocabularyPage() {
  const [category, setCategory] = useState<VocabularyCategory | "all">("all");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<Record<string, StoredStatus>>({});
  const [activeCard, setActiveCard] = useState<string | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(STATUS_KEY);
    if (!raw) return;
    try {
      setStatuses(JSON.parse(raw) as Record<string, StoredStatus>);
    } catch {
      setStatuses({});
    }
  }, []);

  function saveStatuses(next: Record<string, StoredStatus>) {
    setStatuses(next);
    window.localStorage.setItem(STATUS_KEY, JSON.stringify(next));
  }

  function phraseStatus(phrase: SmartPhrase): StoredStatus {
    return statuses[phrase.id] ?? statuses[phrase.phrase.toLowerCase()] ?? { status: "new", correct: 0 };
  }

  const filteredPhrases = useMemo(() => {
    const search = query.trim().toLowerCase();
    return smartPhrases.filter((phrase) => {
      const status = statuses[phrase.id]?.status ?? statuses[phrase.phrase.toLowerCase()]?.status ?? "new";
      const matchesCategory = category === "all" || phrase.category === category;
      const matchesStatus = filter === "all" || status === filter;
      const matchesSearch = !search || `${phrase.phrase} ${phrase.translation} ${phrase.dialogue}`.toLowerCase().includes(search);
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [category, filter, query, statuses]);

  const dueToday = smartPhrases.filter((phrase) => phraseStatus(phrase).status !== "known").slice(0, 5);

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
    hapticTap();
  }

  function markCorrect(phrase: SmartPhrase) {
    const current = phraseStatus(phrase);
    const correct = current.correct + 1;
    saveStatuses({
      ...statuses,
      [phrase.id]: { correct, status: correct >= 3 ? "known" : "learning" },
    });
    hapticSuccess();
  }

  function markWrong(phrase: SmartPhrase) {
    saveStatuses({ ...statuses, [phrase.id]: { correct: 0, status: "learning" } });
    hapticError();
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-6 jarq-text sm:px-6 md:pb-12 md:pt-28 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="courses" className="relative z-10 mx-auto max-w-7xl">
        <section className="rounded-[36px] p-5 liquid-glass md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
                <BookOpenCheck size={16} />
                Умный словарь
              </div>
              <h1 className="mt-4 text-4xl font-black md:text-6xl">Фразы, которыми реально говорят</h1>
              <p className="mt-3 max-w-2xl text-base font-semibold leading-7 jarq-muted">Не отдельные слова, а готовые разговорные фразы по ситуациям. Ответил правильно 3 раза — фраза переходит в “Знаю”.</p>
            </div>
            <div className="rounded-[28px] border border-yellow-300/25 bg-yellow-300/10 p-4 text-sm font-black text-yellow-50">
              <Bell className="mb-2" size={20} />
              5 фраз ждут повторения утром
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-[auto_auto_minmax(0,1fr)]">
            <select value={category} onChange={(event) => setCategory(event.target.value as VocabularyCategory | "all")} className="min-h-12 rounded-[24px] border border-white/[0.08] bg-slate-950/55 px-4 text-[16px] font-bold text-white outline-none">
              <option value="all">Все категории</option>
              {vocabularyCategories.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>
            <select value={filter} onChange={(event) => setFilter(event.target.value as Filter)} className="min-h-12 rounded-[24px] border border-white/[0.08] bg-slate-950/55 px-4 text-[16px] font-bold text-white outline-none">
              <option value="all">Все</option>
              <option value="new">Новое</option>
              <option value="learning">Учу</option>
              <option value="known">Знаю</option>
            </select>
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-12 w-full rounded-[24px] border border-white/[0.08] bg-slate-950/45 pl-12 pr-4 text-[16px] font-semibold outline-none focus:border-cyan-300" placeholder="Найти фразу" />
            </label>
          </div>
        </section>

        <section className="mt-5 rounded-[36px] p-5 liquid-glass">
          <h2 className="text-2xl font-black">Сегодня повторить</h2>
          <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2">
            {dueToday.map((phrase) => (
              <button key={phrase.id} onClick={() => setActiveCard(phrase.id)} className="min-w-[240px] snap-start rounded-[26px] bg-cyan-300/10 p-4 text-left">
                <div className="text-lg font-black">{phrase.phrase}</div>
                <div className="mt-1 text-sm font-semibold jarq-muted">{phrase.translation}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredPhrases.map((phrase, index) => {
            const stored = phraseStatus(phrase);
            const active = activeCard === phrase.id;
            return (
              <motion.article key={phrase.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.01 }} className="rounded-[32px] border border-white/[0.08] bg-slate-950/60 p-5 shadow-[0_8px_32px_rgba(0,0,0,.37)] backdrop-blur-xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-2xl font-black">{phrase.phrase}</div>
                    <div className="mt-1 text-sm font-bold text-cyan-100">{phrase.translation}</div>
                  </div>
                  <button type="button" onClick={() => speak(phrase.phrase)} className="grid h-11 w-11 shrink-0 place-items-center rounded-[18px] bg-cyan-300 text-slate-950">
                    <Volume2 size={18} />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">{formalityLabel(phrase.formality)}</span>
                  <span className={stored.status === "known" ? "rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-slate-950" : stored.status === "learning" ? "rounded-full bg-yellow-300 px-3 py-1 text-xs font-black text-slate-950" : "rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950"}>
                    {statusLabel(stored.status)} · {stored.correct}/3
                  </span>
                </div>
                <p className="mt-4 rounded-[22px] bg-white/[0.06] p-4 text-sm font-semibold leading-6 jarq-muted">{phrase.dialogue}</p>
                {active ? (
                  <div className="mt-4 rounded-[22px] bg-purple-400/12 p-4 text-sm font-bold text-purple-50">Закрой перевод и попробуй вспомнить фразу по-русски.</div>
                ) : null}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => markWrong(phrase)} className="elastic-tap inline-flex min-h-12 items-center justify-center gap-2 rounded-[20px] bg-white/10 font-black">
                    <RotateCcw size={17} />
                    Ошибся
                  </button>
                  <button type="button" onClick={() => markCorrect(phrase)} className="elastic-tap inline-flex min-h-12 items-center justify-center gap-2 rounded-[20px] bg-cyan-300 font-black text-slate-950">
                    <CheckCircle2 size={17} />
                    Помню
                  </button>
                </div>
              </motion.article>
            );
          })}
        </section>
      </MotionPage>
    </main>
  );
}

function formalityLabel(value: SmartPhrase["formality"]) {
  if (value === "friends") return "😊 с друзьями";
  if (value === "work") return "👔 на работе";
  return "🌍 везде";
}

function statusLabel(value: PhraseStatus) {
  if (value === "known") return "Знаю";
  if (value === "learning") return "Учу";
  return "Новое";
}
