"use client";

import { TouchEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Check, Code2, Languages, MessageCircle, Share2, Volume2, X, Zap } from "lucide-react";
import { MaaniyCharacter } from "@/components/MaaniyCharacter";
import { useAuth } from "@/components/auth/AuthProvider";
import { hapticError, hapticSuccess, hapticTap } from "@/components/ui/HapticProvider";
import { getSubscriptionPlan, isProPlan } from "@/lib/subscription";
import { ReelCard, ReelCategory, reels } from "@/lib/reels-data";
import { supabase } from "@/lib/supabase";

type Filter = "all" | ReelCategory;
type AnswerState = "correct" | "wrong" | null;

const FREE_REELS_LIMIT = 10;
const DAILY_REELS_KEY = "jarq-reels-daily-usage";
const WATCHED_REELS_KEY = "jarq_watched_reels";
const SAVED_REELS_KEY = "jarq_saved_reels";

export default function ReelsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>("all");
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answerState, setAnswerState] = useState<AnswerState>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [xpBursts, setXpBursts] = useState<{ id: number; value: number }[]>([]);
  const [streak, setStreak] = useState(0);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());
  const [watchedIds, setWatchedIds] = useState<Set<string> | null>(null);
  const [playQueue, setPlayQueue] = useState<ReelCard[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [saveToast, setSaveToast] = useState(false);
  const [finishedQueue, setFinishedQueue] = useState(false);
  const [usage, setUsage] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const watchedRef = useRef<Set<string>>(new Set());
  const wheelLock = useRef(false);
  const isPro = isProPlan(getSubscriptionPlan());

  const filteredReels = playQueue;
  const currentReel = filteredReels[index] ?? filteredReels[0];
  const isLimitReached = !isPro && usage >= FREE_REELS_LIMIT && !viewedIds.has(currentReel?.id ?? "");
  const isPreparing = watchedIds === null;
  const allWatched = watchedIds !== null && (!filteredReels.length || finishedQueue);

  const addXp = useCallback((value: number) => {
    const id = Date.now() + Math.random();
    setXpBursts((items) => [...items, { id, value }]);
    window.setTimeout(() => setXpBursts((items) => items.filter((item) => item.id !== id)), 1100);
  }, []);

  const markWatched = useCallback((reel?: ReelCard) => {
    if (!reel) return;
    const next = new Set(watchedRef.current);
    if (next.has(reel.id)) return;
    next.add(reel.id);
    watchedRef.current = next;
    setWatchedIds(next);
    window.localStorage.setItem(WATCHED_REELS_KEY, JSON.stringify([...next]));
    window.localStorage.setItem("jarq-reels-day", new Date().toISOString().slice(0, 10));
  }, []);

  const goTo = useCallback(
    (nextIndex: number, nextDirection: number) => {
      if (!filteredReels.length) return;
      if (nextIndex >= filteredReels.length) {
        markWatched(currentReel);
        setFinishedQueue(true);
        return;
      }
      if (nextIndex < 0) return;
      markWatched(currentReel);
      setDirection(nextDirection);
      setIndex(nextIndex);
      setAnswerState(null);
      setSelectedOption(null);
      hapticTap();
    },
    [currentReel, filteredReels.length, markWatched],
  );

  const goNext = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const goPrev = useCallback(() => {
    hapticTap();
  }, []);

  useEffect(() => {
    const storedWatched = readStringArray(WATCHED_REELS_KEY);
    const storedSaved = readStringArray(SAVED_REELS_KEY);
    const nextWatched = new Set(storedWatched);
    watchedRef.current = nextWatched;
    setWatchedIds(nextWatched);
    setSavedIds(new Set(storedSaved));
  }, []);

  useEffect(() => {
    if (watchedIds === null) return;
    const source = filter === "all" ? reels : reels.filter((reel) => reel.category === filter);
    const nextQueue = source.filter((reel) => !watchedRef.current.has(reel.id));
    setPlayQueue(nextQueue);
    setFinishedQueue(false);
    setIndex(0);
    setDirection(1);
    setAnswerState(null);
    setSelectedOption(null);
  }, [filter, watchedIds === null]);

  useEffect(() => {
    if (!supabase || !user) return;
    supabase
      .from("saved_reels")
      .select("reel_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (!data) return;
        const remoteIds = data.map((row) => String((row as { reel_id: string }).reel_id));
        const next = new Set([...readStringArray(SAVED_REELS_KEY), ...remoteIds]);
        setSavedIds(next);
        window.localStorage.setItem(SAVED_REELS_KEY, JSON.stringify([...next]));
      });
  }, [user]);

  useEffect(() => {
    setUsage(getTodayReelsUsage());
  }, []);

  useEffect(() => {
    if (!currentReel || viewedIds.has(currentReel.id) || isLimitReached || allWatched) return;
    const timeout = window.setTimeout(() => {
      setViewedIds((ids) => new Set(ids).add(currentReel.id));
      if (!isPro) {
        const nextUsage = incrementTodayReelsUsage();
        setUsage(nextUsage);
      }
      addXp(5);
    }, 1200);
    return () => window.clearTimeout(timeout);
  }, [addXp, allWatched, currentReel, isLimitReached, isPro, viewedIds]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowDown") goNext();
      if (event.key === "ArrowUp") goPrev();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  function handleWheel(deltaY: number) {
    if (wheelLock.current) return;
    if (Math.abs(deltaY) < 24) return;
    wheelLock.current = true;
    deltaY > 0 ? goNext() : goPrev();
    window.setTimeout(() => {
      wheelLock.current = false;
    }, 360);
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartY.current = event.touches[0]?.clientY ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const startY = touchStartY.current;
    const endY = event.changedTouches[0]?.clientY;
    touchStartY.current = null;
    if (startY === null || typeof endY !== "number") return;
    const delta = startY - endY;
    if (Math.abs(delta) < 56) return;
    delta > 0 ? goNext() : goPrev();
  }

  function answer(optionIndex: number) {
    if (!currentReel || answerState || isLimitReached) return;
    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === currentReel.correct;
    setAnswerState(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(100);
      else hapticSuccess();
      addXp(currentReel.xp);
      if (nextStreak > 0 && nextStreak % 5 === 0) addXp(50);
    } else {
      setStreak(0);
      hapticError();
    }
  }

  async function saveCurrentReel() {
    if (!currentReel) return;
    const next = new Set(savedIds);
    const alreadySaved = next.has(currentReel.id);
    if (alreadySaved) return;
    next.add(currentReel.id);
    setSavedIds(next);
    setSaveToast(true);
    window.localStorage.setItem(SAVED_REELS_KEY, JSON.stringify([...next]));
    window.setTimeout(() => setSaveToast(false), 1000);
    hapticSuccess();
    if (supabase && user) {
      await supabase.from("saved_reels").insert({ user_id: user.id, reel_id: currentReel.id });
    }
  }

  function speak(text?: string) {
    if (!text || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = /[а-яА-Я]/.test(text) ? "ru-RU" : "en-US";
    window.speechSynthesis.speak(utterance);
    hapticTap();
  }

  return (
    <main
      className={`fixed inset-0 z-[100] overflow-hidden bg-[#050b1a] text-white touch-none ${answerState === "correct" ? "shadow-[inset_0_0_70px_rgba(16,185,129,0.45)]" : answerState === "wrong" ? "shadow-[inset_0_0_70px_rgba(248,113,113,0.45)]" : ""}`}
      onWheel={(event) => handleWheel(event.deltaY)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,.22),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,.24),transparent_36%),linear-gradient(135deg,#050b1a,#0b1025_45%,#190b32)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="absolute left-4 right-4 top-4 z-30 flex items-center justify-between gap-3">
        <div className="flex rounded-full border border-white/10 bg-slate-950/55 p-1 backdrop-blur-xl">
          {[
            ["all", "Все"],
            ["english", "Английский"],
            ["programming", "Код"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value as Filter)}
              className={`min-h-10 rounded-full px-3 text-xs font-black transition sm:px-4 ${filter === value ? "bg-cyan-300 text-slate-950" : "text-slate-200"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/reels/saved" className="hidden min-h-11 items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 px-4 text-xs font-black backdrop-blur-xl sm:inline-flex">
            <Bookmark size={16} /> Сохранённые
          </Link>
          <Link href="/" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-slate-950/60 backdrop-blur-xl">
            <X size={21} />
          </Link>
        </div>
      </div>

      <div className="absolute inset-x-4 top-[58px] z-30 grid grid-cols-2 gap-2 sm:hidden">
        <button className="min-h-9 rounded-full bg-cyan-300 text-xs font-black text-slate-950">Для тебя</button>
        <Link href="/reels/saved" className="grid min-h-9 place-items-center rounded-full border border-white/10 bg-slate-950/55 text-xs font-black backdrop-blur-xl">Сохранённые 🔖</Link>
      </div>

      <div className="absolute inset-x-4 top-[102px] z-30 flex gap-1.5 sm:top-[72px]">
        {filteredReels.map((reel, dotIndex) => (
          <button key={reel.id} type="button" onClick={() => dotIndex > index ? goTo(dotIndex, 1) : undefined} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/18" aria-label={`Открыть reel ${dotIndex + 1}`}>
            <span className={`block h-full rounded-full transition-all duration-200 ${dotIndex < index ? "w-full bg-white/70" : dotIndex === index ? "w-full bg-cyan-300 shadow-[0_0_12px_#22d3ee]" : "w-0 bg-cyan-300"}`} />
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        {isPreparing ? (
          <PreparingCard key="preparing" />
        ) : allWatched ? (
          <AllWatchedCard key="all-watched" />
        ) : isLimitReached ? (
          <LimitCard key="limit" />
        ) : (
          <motion.section
            key={currentReel.id}
            custom={direction}
            initial={{ y: direction > 0 ? "100%" : "-100%", opacity: 0.6, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: direction > 0 ? "-100%" : "100%", opacity: 0.6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`relative z-10 grid h-[100dvh] w-screen place-items-center px-4 py-20 ${reelShade(currentReel.category, index)}`}
          >
            <button
              type="button"
              onClick={saveCurrentReel}
              className="absolute right-4 top-32 z-40 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-slate-950/65 text-cyan-100 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:top-24"
              aria-label="Сохранить Reel"
            >
              <motion.span animate={{ scale: savedIds.has(currentReel.id) ? [1, 1.25, 1] : 1 }} transition={{ duration: 0.35 }}>
                {savedIds.has(currentReel.id) ? <BookmarkCheck size={22} fill="currentColor" /> : <Bookmark size={22} />}
              </motion.span>
            </button>
            <AnimatePresence>
              {saveToast ? (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute right-4 top-44 z-40 rounded-full bg-cyan-300 px-4 py-2 text-xs font-black text-slate-950 sm:top-36">
                  Сохранено!
                </motion.div>
              ) : null}
            </AnimatePresence>
            <ReelContent reel={currentReel} speak={speak} />
            <QuestionBlock reel={currentReel} selectedOption={selectedOption} answerState={answerState} onAnswer={answer} />
          </motion.section>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-x-0 bottom-28 z-40 grid place-items-center">
        <AnimatePresence>
          {xpBursts.map((burst) => (
            <motion.div
              key={burst.id}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: -44, scale: 1.12 }}
              exit={{ opacity: 0, y: -88, scale: 0.9 }}
              transition={{ duration: 0.65 }}
              className="rounded-full bg-cyan-300 px-5 py-2 text-lg font-black text-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.45)]"
            >
              +{burst.value} XP
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 left-4 z-30 rounded-full border border-white/10 bg-slate-950/55 px-4 py-2 text-xs font-black backdrop-blur-xl">
        {isPro ? "PRO: безлимит" : `Reels сегодня: ${Math.min(usage, FREE_REELS_LIMIT)}/${FREE_REELS_LIMIT}`}
      </div>
    </main>
  );
}

function ReelContent({ reel, speak }: { reel: ReelCard; speak: (text?: string) => void }) {
  const icon = reel.category === "english" ? <Languages size={18} /> : <Code2 size={18} />;
  return (
    <div className="mb-44 grid w-full max-w-md gap-4">
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-100">
        {icon}
        {reel.title}
      </div>

      {reel.type === "phrase" ? (
        <div className="rounded-[36px] border border-white/10 bg-slate-950/55 p-6 shadow-[0_8px_42px_rgba(0,0,0,.38)] backdrop-blur-2xl">
          <div className="text-5xl font-black leading-tight text-transparent [background:linear-gradient(100deg,#fff,#67e8f9,#c084fc)] [-webkit-background-clip:text]">{reel.phrase}</div>
          <div className="mt-3 text-2xl font-black text-cyan-100">{reel.translation}</div>
          <div className="mt-3 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-slate-200">{reel.usage}</div>
          <div className="mt-5 grid gap-2">
            {reel.examples?.slice(0, 2).map((example) => (
              <button key={String(example)} type="button" onClick={() => speak(String(example))} className="rounded-[22px] bg-white/10 p-4 text-left text-[18px] font-bold leading-relaxed">
                {String(example)}
              </button>
            ))}
          </div>
          {reel.neverSay ? <div className="mt-4 rounded-[20px] border border-red-300/20 bg-red-400/10 p-3 text-sm font-bold text-red-100">Не говори: {reel.neverSay}</div> : null}
        </div>
      ) : null}

      {reel.type === "grammar" ? (
        <div className="rounded-[36px] border border-white/10 bg-slate-950/55 p-5 shadow-[0_8px_42px_rgba(0,0,0,.38)] backdrop-blur-2xl">
          <p className="whitespace-pre-line text-[21px] font-black leading-relaxed">{reel.explanation}</p>
          <div className="mt-4 grid gap-3">
            {reel.examples?.slice(0, 2).map((item, index) => {
              if (typeof item === "string") return null;
              return (
                <div key={index} className="rounded-[24px] bg-white/10 p-4">
                  <div className="text-sm font-black text-red-200">✕ {item.wrong}</div>
                  <div className="mt-1 text-sm font-black text-emerald-200">✓ {item.right}</div>
                  <div className="mt-2 text-xs font-bold text-slate-300">{item.why}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {reel.type === "pronunciation" ? (
        <div className="rounded-[36px] border border-white/10 bg-slate-950/55 p-5 shadow-[0_8px_42px_rgba(0,0,0,.38)] backdrop-blur-2xl">
          <div className="grid gap-3">
            {reel.words?.map((item) => (
              <button key={item.word} type="button" onClick={() => speak(item.word)} className="rounded-[24px] bg-white/10 p-4 text-left">
                <div className="text-2xl font-black text-white">{item.word}</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm font-black">
                  <span className="rounded-full bg-red-400/15 px-3 py-2 text-red-100">не {item.wrong}</span>
                  <span className="rounded-full bg-emerald-300/15 px-3 py-2 text-emerald-100">а {item.right}</span>
                </div>
                <div className="mt-2 text-sm font-bold text-slate-300">{item.tip}</div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {reel.type === "concept" ? (
        <div className="rounded-[36px] border border-white/10 bg-slate-950/70 p-5 shadow-[0_8px_42px_rgba(0,0,0,.38)] backdrop-blur-2xl">
          <div className="grid gap-3">
            <pre className="overflow-x-auto rounded-[24px] border border-red-300/20 bg-red-950/20 p-4 text-[14px] font-bold leading-relaxed text-red-100"><code>{reel.before}</code></pre>
            <pre className="overflow-x-auto rounded-[24px] border border-cyan-300/20 bg-cyan-950/20 p-4 text-[14px] font-bold leading-relaxed text-cyan-100"><code>{reel.after}</code></pre>
          </div>
          <p className="mt-4 rounded-[22px] bg-purple-400/12 p-4 text-[18px] font-bold leading-relaxed text-purple-50">{reel.explanation}</p>
        </div>
      ) : null}

      {reel.type === "tip" ? (
        <div className="rounded-[36px] border border-white/10 bg-slate-950/55 p-5 shadow-[0_8px_42px_rgba(0,0,0,.38)] backdrop-blur-2xl">
          <div className="text-[22px] font-black leading-relaxed text-cyan-50">{reel.tip}</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] bg-red-400/10 p-4">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-red-200">Плохо</div>
              {reel.bad?.slice(0, 3).map((item) => <code key={item} className="mt-2 block text-sm font-bold text-red-100">{item}</code>)}
            </div>
            <div className="rounded-[24px] bg-emerald-300/10 p-4">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-200">Лучше</div>
              {reel.good?.slice(0, 3).map((item) => <code key={item} className="mt-2 block text-sm font-bold text-emerald-100">{item}</code>)}
            </div>
          </div>
          <div className="mt-4 rounded-[20px] bg-white/10 p-3 text-sm font-bold text-slate-200">{reel.rule}</div>
        </div>
      ) : null}

      {reel.type === "word" ? (
        <div className="rounded-[36px] border border-white/10 bg-slate-950/55 p-6 text-center shadow-[0_8px_42px_rgba(0,0,0,.38)] backdrop-blur-2xl">
          <div className="text-6xl font-black text-transparent [background:linear-gradient(100deg,#fff,#67e8f9,#c084fc)] [-webkit-background-clip:text]">{reel.word}</div>
          <div className="mt-3 text-[18px] font-bold text-cyan-100">{reel.transcription}</div>
          <div className="mt-3 text-2xl font-black">{reel.translation}</div>
          <p className="mt-5 rounded-[24px] bg-white/10 p-4 text-[18px] font-semibold leading-relaxed text-slate-100">{reel.story ?? reel.example}</p>
          <button type="button" onClick={() => speak(reel.word)} className="elastic-tap mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-cyan-300 px-5 font-black text-slate-950">
            <Volume2 size={18} />
            Озвучить
          </button>
        </div>
      ) : null}

      {reel.type === "rule" ? (
        <div className="rounded-[36px] border border-white/10 bg-slate-950/55 p-5 shadow-[0_8px_42px_rgba(0,0,0,.38)] backdrop-blur-2xl">
          <div className="flex items-start gap-3">
            <div className="w-24 shrink-0">
              <MaaniyCharacter mood="thinking" size="sm" showBubble={false} />
            </div>
            <div className="grid gap-3">
              {reel.lines?.map((line, index) => (
                <motion.p key={line} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.18 }} className="rounded-[22px] bg-white/10 p-3 text-[18px] font-bold leading-relaxed">
                  {line}
                </motion.p>
              ))}
            </div>
          </div>
          {reel.example ? <div className="mt-4 rounded-[22px] border border-cyan-300/20 bg-cyan-300/10 p-4 text-[18px] font-black text-cyan-50">{reel.example}</div> : null}
        </div>
      ) : null}

      {reel.type === "dialogue" ? (
        <div className="rounded-[36px] border border-white/10 bg-slate-950/55 p-5 shadow-[0_8px_42px_rgba(0,0,0,.38)] backdrop-blur-2xl">
          <div className="grid gap-3">
            {reel.dialogue?.map((line, index) => (
              <motion.div key={`${line.speaker}-${index}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 }} className={`max-w-[82%] rounded-[24px] p-4 ${index % 2 === 0 ? "bg-cyan-300 text-slate-950" : "ml-auto bg-white/10 text-white"}`}>
                <div className="mb-1 text-xs font-black uppercase opacity-70">{line.speaker}</div>
                <button type="button" onClick={() => speak(line.text)} className="text-left text-[18px] font-black leading-relaxed">
                  {line.text}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      ) : null}

      {reel.type === "code" ? (
        <div className="rounded-[36px] border border-white/10 bg-slate-950/70 p-5 shadow-[0_8px_42px_rgba(0,0,0,.38)] backdrop-blur-2xl">
          <pre className="overflow-x-auto rounded-[26px] border border-cyan-300/20 bg-[#020617] p-5 text-[15px] font-bold leading-relaxed text-cyan-100">
            <code>{reel.code}</code>
          </pre>
          <p className="mt-4 rounded-[22px] bg-purple-400/12 p-4 text-[18px] font-bold leading-relaxed text-purple-50">{reel.explanation}</p>
        </div>
      ) : null}

      {reel.type === "fact" ? (
        <div className="rounded-[36px] border border-white/10 bg-slate-950/55 p-6 text-center shadow-[0_8px_42px_rgba(0,0,0,.38)] backdrop-blur-2xl">
          <div className="mx-auto grid h-28 w-28 place-items-center rounded-[36px] bg-gradient-to-br from-cyan-300 to-purple-400 text-slate-950 shadow-[0_0_44px_rgba(34,211,238,.3)]">
            <Zap size={54} />
          </div>
          <p className="mt-6 text-[22px] font-black leading-relaxed">{reel.fact}</p>
          <button type="button" onClick={() => navigator.share?.({ title: "JARQ Reels", text: reel.fact })} className="elastic-tap mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-white/10 px-5 font-black">
            <Share2 size={18} />
            Поделиться
          </button>
        </div>
      ) : null}
    </div>
  );
}

function QuestionBlock({ reel, selectedOption, answerState, onAnswer }: { reel: ReelCard; selectedOption: number | null; answerState: AnswerState; onAnswer: (index: number) => void }) {
  return (
    <div className="absolute inset-x-4 bottom-16 z-20 mx-auto max-w-md rounded-[32px] border border-white/10 bg-slate-950/72 p-4 shadow-[0_8px_42px_rgba(0,0,0,.42)] backdrop-blur-2xl">
      <div className="text-base font-black leading-snug">{reel.question}</div>
      <div className="mt-3 grid gap-2">
        {reel.options.map((option, index) => {
          const isCorrect = answerState && index === reel.correct;
          const isWrong = answerState === "wrong" && index === selectedOption;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onAnswer(index)}
              className={`elastic-tap flex min-h-14 items-center justify-between rounded-[22px] px-4 text-left text-[18px] font-black leading-snug transition ${
                isCorrect ? "bg-emerald-300 text-slate-950" : isWrong ? "bg-red-400 text-white" : "bg-white/10 text-white hover:bg-white/15"
              }`}
            >
              {option}
              {isCorrect ? <Check size={18} /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LimitCard() {
  return (
    <motion.section
      key="limit"
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="relative z-10 grid h-[100dvh] place-items-center px-4"
    >
      <div className="max-w-md rounded-[36px] border border-yellow-300/25 bg-slate-950/75 p-6 text-center shadow-[0_8px_48px_rgba(0,0,0,.42)] backdrop-blur-2xl">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-[30px] bg-yellow-300 text-slate-950">
          <Zap size={38} />
        </div>
        <h1 className="mt-5 text-3xl font-black">Лимит Reels на сегодня</h1>
        <p className="mt-3 text-sm font-semibold leading-relaxed jarq-muted">Бесплатно доступно 10 карточек в день. Смотри безлимитно с JARQ Pro.</p>
        <Link href="/subscription" className="elastic-tap mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-[24px] bg-cyan-300 px-5 font-black text-slate-950">
          Получить Pro
        </Link>
      </div>
    </motion.section>
  );
}

function PreparingCard() {
  return (
    <motion.section
      key="preparing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 grid h-[100dvh] place-items-center px-4"
    >
      <div className="h-72 w-full max-w-md animate-pulse rounded-[36px] border border-white/10 bg-slate-950/65 shadow-[0_8px_48px_rgba(0,0,0,.42)] backdrop-blur-2xl" />
    </motion.section>
  );
}

function AllWatchedCard() {
  return (
    <motion.section
      key="all-watched"
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="relative z-10 grid h-[100dvh] place-items-center px-4"
    >
      <div className="max-w-md rounded-[36px] border border-cyan-300/25 bg-slate-950/75 p-6 text-center shadow-[0_8px_48px_rgba(0,0,0,.42)] backdrop-blur-2xl">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-[30px] bg-cyan-300 text-slate-950">
          <Check size={38} />
        </div>
        <h1 className="mt-5 text-3xl font-black">Ты просмотрел все Reels!</h1>
        <p className="mt-3 text-sm font-semibold leading-relaxed jarq-muted">Новые появятся завтра 🎉 А пока можно повторить сохранённые карточки.</p>
        <Link href="/reels/saved" className="elastic-tap mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[24px] bg-cyan-300 px-5 font-black text-slate-950">
          <Bookmark size={18} />
          Посмотреть сохранённые
        </Link>
      </div>
    </motion.section>
  );
}

function getTodayReelsUsage() {
  if (typeof window === "undefined") return 0;
  const today = new Date().toISOString().slice(0, 10);
  const raw = window.localStorage.getItem(DAILY_REELS_KEY);
  if (!raw) return 0;
  try {
    const parsed = JSON.parse(raw) as { date: string; count: number };
    return parsed.date === today ? parsed.count : 0;
  } catch {
    return 0;
  }
}

function readStringArray(key: string) {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function incrementTodayReelsUsage() {
  const today = new Date().toISOString().slice(0, 10);
  const nextCount = getTodayReelsUsage() + 1;
  window.localStorage.setItem(DAILY_REELS_KEY, JSON.stringify({ date: today, count: nextCount }));
  return nextCount;
}

function reelShade(category: ReelCard["category"], index: number) {
  const variants = category === "english"
    ? ["bg-cyan-950/10", "bg-blue-950/15", "bg-teal-950/10"]
    : ["bg-purple-950/12", "bg-indigo-950/16", "bg-fuchsia-950/10"];
  return variants[index % variants.length];
}
