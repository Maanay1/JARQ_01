"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Plus, Sparkles, Trophy } from "lucide-react";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { hapticError, hapticSuccess, hapticTap } from "@/components/ui/HapticProvider";
import { MotionPage } from "@/components/ui/MotionPage";
import { useAuth } from "@/components/auth/AuthProvider";
import { getVideoById, MediaWord } from "@/lib/media-data";
import { addLocalVocabulary, canUseUnlimitedMedia, FREE_DAILY_VIDEO_LIMIT, getTodayVideoUsage, incrementTodayVideoUsage } from "@/lib/media-progress";
import { supabase } from "@/lib/supabase";

export default function WatchMediaPage() {
  const params = useParams<{ id: string }>();
  const video = getVideoById(params.id);
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());
  const [xpBurst, setXpBurst] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const score = useMemo(() => {
    if (!video) return 0;
    return video.quiz.reduce((sum, question, index) => sum + (answers[index] === question.correct ? 1 : 0), 0);
  }, [answers, video]);
  const isComplete = video ? Object.keys(answers).length === video.quiz.length : false;

  useEffect(() => {
    if (!video) return;
    if (canUseUnlimitedMedia()) return;
    const usage = getTodayVideoUsage();
    if (usage >= FREE_DAILY_VIDEO_LIMIT) {
      setLimitReached(true);
      return;
    }
    incrementTodayVideoUsage();
  }, [video]);

  if (!video) notFound();

  async function addWord(word: MediaWord) {
    if (!video) return;
    if (savedWords.has(word.word)) return;
    setSavedWords((items) => new Set(items).add(word.word));
    hapticTap();

    const payload = {
      word: word.word,
      translation: word.translation,
      example: word.example,
      source_video_id: video.id,
    };

    if (supabase && user) {
      const { error } = await supabase.from("user_vocabulary").insert({ user_id: user.id, ...payload });
      if (!error) return;
    }

    addLocalVocabulary(payload);
  }

  function answer(questionIndex: number, optionIndex: number) {
    if (!video) return;
    if (answers[questionIndex] !== undefined) return;
    const correct = video.quiz[questionIndex]?.correct === optionIndex;
    setAnswers((items) => ({ ...items, [questionIndex]: optionIndex }));
    if (correct) {
      hapticSuccess();
    } else {
      hapticError();
    }
  }

  useEffect(() => {
    if (!isComplete) return;
    setXpBurst(true);
    const timeout = window.setTimeout(() => setXpBurst(false), 1300);
    return () => window.clearTimeout(timeout);
  }, [isComplete]);

  if (limitReached) {
    return (
      <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-10 jarq-text">
        <FuturisticBackground />
        <div className="relative z-10 max-w-md rounded-[36px] p-6 text-center liquid-glass">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-[30px] bg-yellow-300 text-slate-950">
            <Trophy size={38} />
          </div>
          <h1 className="mt-5 text-3xl font-black">Лимит видео на сегодня</h1>
          <p className="mt-3 text-sm font-semibold leading-relaxed jarq-muted">Бесплатно доступно 3 видео в день. Pro откроет безлимитный просмотр.</p>
          <Link href="/subscription" className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-[24px] bg-cyan-300 px-5 font-black text-slate-950">
            Получить Pro
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-6 jarq-text sm:px-6 md:pb-12 md:pt-28 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="lesson" className="relative z-10 mx-auto max-w-6xl">
        <Link href="/media" className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-[22px] bg-white/10 px-4 text-sm font-black">
          <ArrowLeft size={17} />
          Назад к медиа
        </Link>

        <section className="overflow-hidden rounded-[36px] p-4 liquid-glass md:p-6">
          <div className="aspect-video overflow-hidden rounded-[28px] bg-black">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">{video.level} · {video.duration}</div>
              <h1 className="mt-2 text-3xl font-black md:text-5xl">{video.title}</h1>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 jarq-muted">{video.description}</p>
            </div>
            <div className="rounded-[24px] bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100">
              Тест: {score}/{video.quiz.length}
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[36px] p-5 liquid-glass">
          <div className="flex items-center gap-2 text-xl font-black">
            <Sparkles className="text-cyan-200" />
            Ключевые слова
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {video.keyWords.map((word) => (
              <article key={word.word} className="rounded-[28px] border border-white/[0.08] bg-slate-950/45 p-4 backdrop-blur-xl">
                <div className="text-2xl font-black text-cyan-100">{word.word}</div>
                <div className="mt-1 text-sm font-bold text-white">{word.translation}</div>
                <p className="mt-3 text-sm font-semibold leading-6 jarq-muted">{word.example}</p>
                <button
                  type="button"
                  onClick={() => addWord(word)}
                  className="elastic-tap mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[20px] bg-cyan-300 px-4 text-sm font-black text-slate-950"
                >
                  {savedWords.has(word.word) ? <Check size={17} /> : <Plus size={17} />}
                  {savedWords.has(word.word) ? "Добавлено" : "Добавить слово"}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="relative mt-5 rounded-[36px] p-5 liquid-glass">
          <h2 className="text-2xl font-black">Тест на понимание</h2>
          <div className="mt-4 grid gap-4">
            {video.quiz.map((question, questionIndex) => (
              <article key={question.question} className="rounded-[28px] border border-white/[0.08] bg-slate-950/45 p-4">
                <div className="font-black">{questionIndex + 1}. {question.question}</div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option, optionIndex) => {
                    const selected = answers[questionIndex] === optionIndex;
                    const answered = answers[questionIndex] !== undefined;
                    const correct = optionIndex === question.correct;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => answer(questionIndex, optionIndex)}
                        className={`elastic-tap min-h-12 rounded-[20px] px-4 text-left text-sm font-black transition ${
                          answered && correct ? "bg-emerald-300 text-slate-950" : selected ? "bg-red-400 text-white" : "bg-white/10 text-white hover:bg-white/15"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
          {isComplete ? (
            <div className="mt-5 rounded-[28px] bg-cyan-300 p-5 text-center text-slate-950">
              <div className="text-3xl font-black">+{score * 10 + 25} XP</div>
              <div className="mt-1 text-sm font-bold">Тест завершён. Маанай гордится тобой.</div>
            </div>
          ) : null}
          {xpBurst ? (
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: -30, scale: 1.08 }} className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-cyan-300 px-5 py-2 text-lg font-black text-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.45)]">
              XP получен
            </motion.div>
          ) : null}
        </section>
      </MotionPage>
    </main>
  );
}
