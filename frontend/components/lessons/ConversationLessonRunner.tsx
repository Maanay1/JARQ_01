"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, MessageCircle, Plus, RotateCcw, Sparkles, Trophy, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { ConversationLesson, ConversationOption } from "@/lib/conversation-lessons";
import { MentorCharacter } from "@/components/mentors/MentorCharacter";
import { useAuth } from "@/components/auth/AuthProvider";
import { hapticError, hapticSuccess, hapticTap } from "@/components/ui/HapticProvider";

type ConversationLessonRunnerProps = {
  lesson: ConversationLesson;
};

type AnswerRecord = {
  turn: number;
  option: ConversationOption;
};

const VOCABULARY_STATUS_KEY = "jarq-smart-vocabulary-status";

export function ConversationLessonRunner({ lesson }: ConversationLessonRunnerProps) {
  const { selectedAvatarId } = useAuth();
  const [turnIndex, setTurnIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selected, setSelected] = useState<ConversationOption | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const currentTurn = lesson.dialog[turnIndex];
  const progress = Math.round(((turnIndex + (selected ? 1 : 0)) / lesson.dialog.length) * 100);
  const score = useMemo(() => answers.reduce((sum, item) => sum + item.option.score, 0), [answers]);
  const averageScore = answers.length ? Math.round(score / answers.length) : 0;
  const xp = Math.round((averageScore / 100) * lesson.xp);

  function choose(option: ConversationOption) {
    if (selected) return;
    setSelected(option);
    setAnswers((items) => [...items, { turn: turnIndex, option }]);
    if (option.correct) hapticSuccess();
    else hapticError();
  }

  function next() {
    if (!selected) return;
    if (turnIndex >= lesson.dialog.length - 1) {
      setIsComplete(true);
      return;
    }
    setTurnIndex((value) => value + 1);
    setSelected(null);
    hapticTap();
  }

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }

  function addPhrasesToVocabulary() {
    const raw = window.localStorage.getItem(VOCABULARY_STATUS_KEY);
    const statuses = raw ? JSON.parse(raw) as Record<string, { status: string; correct: number }> : {};
    lesson.vocabulary.forEach((phrase) => {
      statuses[phrase.toLowerCase()] = statuses[phrase.toLowerCase()] ?? { status: "learning", correct: 0 };
    });
    window.localStorage.setItem(VOCABULARY_STATUS_KEY, JSON.stringify(statuses));
    hapticSuccess();
  }

  if (isComplete) {
    return (
      <section className="mt-5 grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[32px] p-5 liquid-glass">
          <MentorCharacter avatarId={selectedAvatarId} selected size="md" message="Отлично! Теперь ты можешь использовать эти фразы в реальном разговоре." />
        </aside>
        <div className="rounded-[32px] p-5 liquid-glass">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950">
            <Trophy size={18} />
            +{xp} XP
          </div>
          <h2 className="mt-4 text-4xl font-black">Разбор разговора</h2>
          <p className="mt-2 text-sm font-semibold jarq-muted">Средняя оценка: {averageScore}%. Маанай показывает, где звучало естественно, а где можно мягче.</p>

          <div className="mt-5 grid gap-3">
            {answers.map((answer, index) => {
              const turn = lesson.dialog[answer.turn];
              const best = turn.userOptions.find((option) => option.correct && option.score === 100) ?? turn.userOptions[0];
              return (
                <article key={`${turn.text}-${index}`} className="rounded-[26px] border border-white/[0.08] bg-slate-950/45 p-4">
                  <div className="text-xs font-black uppercase tracking-[0.14em] text-cyan-200">Реплика {index + 1}</div>
                  <div className="mt-2 text-sm font-semibold jarq-muted">{turn.text}</div>
                  <div className="mt-3 rounded-[20px] bg-white/10 p-3 text-sm font-bold">Ты: {answer.option.text}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={answer.option.score >= 80 ? "rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-slate-950" : "rounded-full bg-yellow-300 px-3 py-1 text-xs font-black text-slate-950"}>
                      {answer.option.score}/100
                    </span>
                    {answer.option.feedback ? <span className="text-xs font-semibold text-yellow-100">{answer.option.feedback}</span> : null}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-cyan-100">Лучше можно так: {best.text}</div>
                </article>
              );
            })}
          </div>

          <section className="mt-5 rounded-[28px] border border-cyan-300/20 bg-cyan-300/10 p-4">
            <h3 className="text-xl font-black">Новые фразы</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {lesson.vocabulary.map((phrase) => (
                <span key={phrase} className="rounded-full bg-white/10 px-3 py-2 text-sm font-bold">{phrase}</span>
              ))}
            </div>
            <button type="button" onClick={addPhrasesToVocabulary} className="elastic-tap mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[22px] bg-cyan-300 px-5 font-black text-slate-950">
              <Plus size={18} />
              Добавить все в словарь
            </button>
          </section>

          <section className="mt-5 rounded-[28px] bg-purple-400/12 p-4">
            <h3 className="text-xl font-black">Советы Мааная</h3>
            <ul className="mt-3 grid gap-2 text-sm font-semibold jarq-muted">
              {lesson.tips.map((tip) => <li key={tip}>• {tip}</li>)}
            </ul>
          </section>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => { setTurnIndex(0); setAnswers([]); setSelected(null); setIsComplete(false); }} className="elastic-tap inline-flex min-h-14 items-center justify-center gap-2 rounded-[24px] bg-white/10 px-5 font-black">
              <RotateCcw size={18} />
              Повторить
            </button>
            <Link href="/vocabulary" className="elastic-tap inline-flex min-h-14 items-center justify-center gap-2 rounded-[24px] bg-cyan-300 px-5 font-black text-slate-950">
              <Sparkles size={18} />
              Открыть словарь
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-5 grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-[32px] p-5 liquid-glass">
        <MentorCharacter avatarId={selectedAvatarId} selected={selected?.correct} size="md" message="Скажи не идеально, а живо. Я помогу звучать естественно." />
        <div className="mt-4 rounded-[24px] border border-white/[0.08] bg-slate-950/55 p-4">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">Ситуация</div>
          <p className="mt-2 text-sm font-semibold leading-6 jarq-muted">{lesson.situation}</p>
        </div>
      </aside>

      <section className="rounded-[32px] p-5 liquid-glass">
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-purple-400" animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 350, damping: 26 }} />
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">Живой диалог · {turnIndex + 1}/{lesson.dialog.length}</div>
            <h2 className="mt-2 text-3xl font-black">{lesson.title}</h2>
          </div>
          <span className="rounded-full bg-cyan-300/15 px-3 py-2 text-sm font-black text-cyan-100">{lesson.duration}</span>
        </div>

        <div className="mt-6 grid gap-4">
          <motion.div key={currentTurn.text} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-cyan-300/20 bg-cyan-300/10 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-black uppercase tracking-[0.14em] text-cyan-100">{currentTurn.speaker}</div>
              <button type="button" onClick={() => speak(currentTurn.text)} className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
                <Volume2 size={18} />
              </button>
            </div>
            <p className="mt-3 text-2xl font-black leading-snug">{currentTurn.text}</p>
            <p className="mt-2 text-sm font-semibold jarq-muted">{currentTurn.translation}</p>
          </motion.div>

          <div className="grid gap-3">
            {currentTurn.userOptions.map((option) => {
              const isChosen = selected?.text === option.text;
              const isCorrect = selected && option.correct && option.score >= 80;
              const isWrong = isChosen && !option.correct;
              return (
                <button key={option.text} type="button" onClick={() => choose(option)} className={`elastic-tap min-h-14 rounded-[24px] px-4 text-left text-[16px] font-black leading-snug transition ${isCorrect ? "bg-emerald-300 text-slate-950" : isWrong ? "bg-red-400 text-white" : "bg-white/10 text-white hover:bg-white/15"}`}>
                  {option.text}
                  {isChosen ? <span className="ml-2 text-xs opacity-80">({option.score}/100)</span> : null}
                </button>
              );
            })}
          </div>

          {selected ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] bg-slate-950/55 p-4">
              <div className="flex items-center gap-2 font-black text-cyan-100">
                <MessageCircle size={18} />
                {selected.correct ? "Звучит естественно" : "Можно лучше"}
              </div>
              <p className="mt-2 text-sm font-semibold jarq-muted">{selected.feedback ?? "Хороший ответ. Ты поддержал разговор и звучишь уверенно."}</p>
              <button type="button" onClick={next} className="elastic-tap mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[22px] bg-cyan-300 px-5 font-black text-slate-950">
                <Check size={18} />
                {turnIndex >= lesson.dialog.length - 1 ? "Завершить и разобрать" : "Следующая реплика"}
              </button>
            </motion.div>
          ) : null}
        </div>
      </section>
    </section>
  );
}
