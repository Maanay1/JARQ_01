"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Code2, Loader2, Sparkles, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { CheckAnswerResponse, Lesson, LessonTask, checkLessonAnswer } from "@/lib/api";
import { JarqAvatar, JarqEmotion } from "@/components/JarqAvatar";

type LessonRunnerProps = {
  lesson: Lesson;
};

export function LessonRunner({ lesson }: LessonRunnerProps) {
  const tasks = lesson.tasks.length ? lesson.tasks : [fallbackTask(lesson.id)];
  const [taskIndex, setTaskIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<CheckAnswerResponse | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [xp, setXp] = useState(0);
  const [xpBurst, setXpBurst] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currentTask = tasks[taskIndex];
  const progress = Math.round(((taskIndex + (result?.correct ? 1 : 0)) / tasks.length) * 100);
  const emotion = (result?.emotion ?? "calm") as JarqEmotion;
  const options = useMemo(() => extractOptions(currentTask.question), [currentTask.question]);

  const questLabel = useMemo(() => `${taskIndex + 1} / ${tasks.length}`, [taskIndex, tasks.length]);

  async function handleCheck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!answer.trim() || isChecking) return;

    setIsChecking(true);
    setError(null);

    try {
      const response = await checkLessonAnswer({
        lessonId: lesson.id,
        userId: "00000000-0000-0000-0000-000000000000",
        taskId: currentTask.id,
        answer,
      });
      setResult(response);
      setXp((current) => current + response.xp_earned);
      if (response.xp_earned > 0) setXpBurst(response.xp_earned);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Не удалось проверить ответ.");
    } finally {
      setIsChecking(false);
    }
  }

  useEffect(() => {
    if (!xpBurst) return;
    const timeout = window.setTimeout(() => setXpBurst(null), 900);
    return () => window.clearTimeout(timeout);
  }, [xpBurst]);

  function nextQuestion() {
    const nextIndex = Math.min(taskIndex + 1, tasks.length - 1);
    setTaskIndex(nextIndex);
    setAnswer("");
    setResult(null);
    setError(null);
  }

  return (
    <div className="mt-5 grid min-w-0 gap-4 lg:mt-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-5">
      <section className="soft-glow min-w-0 rounded-xl p-4 jarq-glass sm:rounded-2xl sm:p-6">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">Задание {questLabel}</div>
            <div className="mt-3 inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] jarq-muted jarq-soft">
              <Code2 size={15} />
              {taskTypeLabel(currentTask.type)}
            </div>
          </div>
          <div className="relative inline-flex w-fit items-center gap-2 rounded-md bg-cyan-300/20 px-3 py-2 text-sm font-semibold text-cyan-100">
            <Trophy size={17} />
            {xp} XP
            {xpBurst ? <span className="xp-pop absolute -top-7 right-0 text-sm font-bold text-cyan-200">+{xpBurst}</span> : null}
          </div>
        </div>

        <div className="mt-5 h-3 w-full overflow-hidden rounded-full jarq-soft">
          <motion.div
            className="h-full rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.45)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        </div>

        <div className="mt-6 min-w-0 rounded-xl border p-4 backdrop-blur jarq-border jarq-soft sm:rounded-2xl sm:p-5">
          <h2 className="whitespace-pre-line text-lg font-semibold leading-7 sm:text-xl sm:leading-8">{currentTask.question}</h2>
        </div>

        <form onSubmit={handleCheck} className="mt-6">
          {options.length ? (
            <div className="mb-4 grid gap-2 md:grid-cols-3">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setAnswer(option.value)}
                  className={`button-lift min-h-11 min-w-0 rounded-md border px-3 py-3 text-left text-sm font-semibold ${
                    answer === option.value ? "border-cyan-300 bg-cyan-300/15" : "hover:border-cyan-300 jarq-border jarq-soft"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
          <textarea
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            rows={5}
            className="w-full min-w-0 resize-none rounded-xl border px-4 py-3 text-base outline-none transition focus:border-cyan-300 jarq-border jarq-text jarq-soft placeholder:text-slate-400"
            placeholder={currentTask.type === "write_code" ? "Напиши код..." : "Напиши ответ..."}
          />
          <button
            type="submit"
            disabled={isChecking || !answer.trim()}
            className="button-lift mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isChecking ? <Loader2 className="animate-spin" size={17} /> : <Check size={17} />}
            Проверить ответ
          </button>
        </form>

        {result ? (
          <div
            className={`message-in mt-5 min-w-0 rounded-lg border p-4 ${
              result.correct ? "border-cyan-300 bg-cyan-300/15" : "border-purple-300 bg-purple-400/10"
            }`}
          >
            <div className="text-sm font-semibold">{result.correct ? "Верно" : "Почти получилось"}</div>
            <p className="mt-2 text-sm leading-6">{result.feedback}</p>
            <p className="mt-2 text-sm leading-6 jarq-muted">{result.explanation}</p>
          </div>
        ) : null}

        {error ? <div className="mt-5 rounded-md bg-purple-400/15 p-3 text-sm">{error}</div> : null}

        <button
          type="button"
          onClick={nextQuestion}
          disabled={!result || taskIndex === tasks.length - 1}
          className="button-lift mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-semibold transition hover:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-50 jarq-border jarq-soft sm:w-auto"
        >
          Следующее задание
          <ArrowRight size={16} />
        </button>
      </section>

      <aside className="min-w-0 rounded-xl p-4 jarq-glass sm:rounded-2xl sm:p-5">
        <JarqAvatar emotion={emotion} speaking={isChecking} processing={isChecking} />
        <div className="message-in mt-5 rounded-md p-3 jarq-soft">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] jarq-muted">Реакция JARQ</div>
          <p className="mt-2 text-sm leading-6">
            {result?.feedback ?? "Ответь на задание, и JARQ даст понятную обратную связь."}
          </p>
        </div>
        {result?.next_task ? (
          <div className="message-in mt-4 rounded-md border border-cyan-300/40 bg-cyan-300/10 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] jarq-muted">
              <Sparkles size={14} />
              Следующее задание
            </div>
            <p className="mt-2 text-sm leading-6">{result.next_task.question.split("\n")[0]}</p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function extractOptions(question: string): Array<{ value: string; label: string }> {
  return question
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[A-C]\)/.test(line))
    .map((line) => ({ value: line.slice(0, 1), label: line }));
}

function taskTypeLabel(type: string | null | undefined): string {
  const labels: Record<string, string> = {
    write_code: "написать код",
    multiple_choice: "выбор варианта",
    fix_error: "исправить ошибку",
    short_answer: "короткий ответ",
    translation: "перевод",
  };
  return labels[type ?? ""] ?? "практика";
}

function fallbackTask(lessonId: string): LessonTask {
  return {
    id: "fallback-task",
    lesson_id: lessonId,
    type: "short_answer",
    question: "Напиши вежливое предложение на английском, чтобы попросить кофе.",
    correct_answer: "I would like a coffee.",
    explanation: "Для вежливой просьбы используй 'I would like...'.",
    difficulty: "easy",
  };
}
