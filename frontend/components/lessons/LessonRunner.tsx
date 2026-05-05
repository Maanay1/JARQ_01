"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Code2, Headphones, HelpCircle, Loader2, Mic, Play, RotateCcw, Sparkles, Trophy, Volume2, X } from "lucide-react";
import { motion } from "framer-motion";
import { Lesson } from "@/lib/api";
import { InteractiveStep, getInteractiveLesson } from "@/lib/interactive-lessons";
import { MaaniyCharacter } from "@/components/MaaniyCharacter";

type LessonRunnerProps = {
  lesson: Lesson;
};

type CheckState = "idle" | "correct" | "wrong";

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  start: () => void;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

export function LessonRunner({ lesson }: LessonRunnerProps) {
  const interactiveLesson = useMemo(() => getInteractiveLesson(lesson), [lesson]);
  const steps = interactiveLesson.steps;
  const [stepIndex, setStepIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Array<{ left: string; right: string }>>([]);
  const [leftMatch, setLeftMatch] = useState<string | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [checkState, setCheckState] = useState<CheckState>("idle");
  const [feedback, setFeedback] = useState("Мааний рядом. Сделай шаг, и он сразу подскажет.");
  const [wrongStreak, setWrongStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [xp, setXp] = useState(0);
  const [xpBurst, setXpBurst] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [codeOutput, setCodeOutput] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const currentStep = steps[stepIndex];
  const progress = Math.round(((stepIndex + (checkState === "correct" ? 1 : 0)) / steps.length) * 100);

  useEffect(() => {
    if (!xpBurst) return;
    const timeout = window.setTimeout(() => setXpBurst(null), 900);
    return () => window.clearTimeout(timeout);
  }, [xpBurst]);

  useEffect(() => {
    resetStepState();
  }, [stepIndex]);

  function resetStepState() {
    setAnswer("");
    setSelectedWords([]);
    setMatchedPairs([]);
    setLeftMatch(null);
    setDialogueIndex(0);
    setCheckState("idle");
    setShowHint(false);
    setCodeOutput("");
    setFeedback(currentStep?.maaniy ?? "Продолжаем.");
  }

  function markCorrect(customFeedback = "Верно! Мааний радуется и начисляет XP.") {
    if (checkState === "correct") return;
    const earned = currentStep.type === "explanation" || currentStep.type === "word_card" ? 5 : 10;
    setCheckState("correct");
    setFeedback(customFeedback);
    setWrongStreak(0);
    setXp((value) => value + earned);
    setXpBurst(earned);
    playPositiveSound();
  }

  function markWrong(customFeedback = "Почти. Посмотри на правильный смысл и попробуй ещё раз.") {
    setCheckState("wrong");
    setFeedback(customFeedback);
    setWrongStreak((value) => {
      const next = value + 1;
      if (next >= 3) setShowHint(true);
      return next;
    });
  }

  function checkText(value: string, expected = currentStep.answer ?? "") {
    if (normalize(value) === normalize(expected)) {
      markCorrect("Отлично. Ответ совпал, двигаемся дальше.");
    } else {
      markWrong(`Не совсем. Правильный ответ: ${expected}`);
    }
  }

  function nextStep() {
    if (stepIndex === steps.length - 1) {
      completeLesson();
      return;
    }
    setStepIndex((index) => index + 1);
  }

  function completeLesson() {
    const score = Math.round((xp / Math.max(1, steps.length * 10)) * 100);
    const payload = {
      user_id: "00000000-0000-0000-0000-000000000000",
      lesson_id: interactiveLesson.id,
      score,
      completed_at: new Date().toISOString(),
      xp_earned: xp,
      unlocked_next: score >= 70,
    };
    window.localStorage.setItem(`jarq-lesson-progress:${interactiveLesson.id}`, JSON.stringify(payload));
    setIsComplete(true);
  }

  function speak(text: string) {
    if (!("speechSynthesis" in window)) {
      setFeedback("Браузер не поддерживает озвучку. Но текст можно прочитать глазами.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = /[а-яА-Я]/.test(text) ? "ru-RU" : "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function startSpeechRecognition() {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setFeedback("Speech Recognition API не найден. Введи фразу вручную в поле ниже.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setAnswer(transcript);
      checkText(transcript);
    };
    recognition.onend = () => setIsListening(false);
    setIsListening(true);
    recognition.start();
  }

  function runCode() {
    const code = answer || currentStep.starterCode || "";
    if (!code.trim()) {
      markWrong("Сначала напиши или оставь стартовый код.");
      return;
    }
    const printed = extractPrintedText(code);
    const output = printed || "Код принят. Для настоящего запуска позже подключим Pyodide.";
    setCodeOutput(output);
    if (!currentStep.expectedOutput || normalize(output).includes(normalize(currentStep.expectedOutput))) {
      markCorrect("Код выглядит правильно. Мааний засчитал шаг.");
    } else {
      markWrong(`Вывод пока другой. Ожидалось что-то вроде: ${currentStep.expectedOutput}`);
    }
  }

  if (isComplete) {
    return <LessonResult title={interactiveLesson.title} xp={xp} steps={steps.length} onRestart={() => {
      setStepIndex(0);
      setXp(0);
      setXpBurst(null);
      setIsComplete(false);
    }} />;
  }

  return (
    <div className="mt-5 grid min-w-0 gap-5 lg:mt-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="min-w-0 rounded-3xl p-4 jarq-glass sm:p-5">
        <MaaniyCharacter
          mood={checkState === "correct" ? "happy" : checkState === "wrong" ? "sad" : currentStep.type === "explanation" ? "focused" : "idle"}
          size="md"
          showBubble
          message={feedback}
        />
        {wrongStreak >= 3 ? (
          <div className="message-in mt-4 rounded-2xl border border-purple-300/35 bg-purple-400/10 p-4 text-sm leading-6">
            <div className="flex items-center gap-2 font-bold text-purple-100">
              <HelpCircle size={16} />
              Подсказка Маания
            </div>
            <p className="mt-2 jarq-muted">{currentStep.hint ?? "Смотри на пример и попробуй найти ключевое слово."}</p>
          </div>
        ) : null}
      </aside>

      <section className="soft-glow min-w-0 rounded-3xl p-4 jarq-glass sm:p-6">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
              Шаг {stepIndex + 1} / {steps.length}
            </div>
            <h2 className="mt-2 text-2xl font-semibold leading-tight">{currentStep.title}</h2>
          </div>
          <div className="relative inline-flex w-fit items-center gap-2 rounded-xl bg-cyan-300/20 px-3 py-2 text-sm font-bold text-cyan-100">
            <Trophy size={17} />
            {xp} XP
            {xpBurst ? <span className="xp-pop absolute -top-7 right-0 text-sm font-bold text-cyan-200">+{xpBurst}</span> : null}
          </div>
        </div>

        <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-purple-400 shadow-[0_0_24px_rgba(34,211,238,0.45)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        </div>

        <div className={`message-in mt-6 rounded-2xl border p-5 ${checkState === "correct" ? "border-emerald-300/60 bg-emerald-400/12" : checkState === "wrong" ? "border-rose-300/60 bg-rose-400/12" : "jarq-border jarq-soft"}`}>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] jarq-muted">
            <Code2 size={15} />
            {stepLabel(currentStep.type)}
          </div>
          <p className="mt-3 whitespace-pre-line text-lg font-semibold leading-8">{currentStep.prompt}</p>
        </div>

        <div className="mt-6">
          <StepBody
            step={currentStep}
            answer={answer}
            setAnswer={setAnswer}
            selectedWords={selectedWords}
            setSelectedWords={setSelectedWords}
            matchedPairs={matchedPairs}
            setMatchedPairs={setMatchedPairs}
            leftMatch={leftMatch}
            setLeftMatch={setLeftMatch}
            dialogueIndex={dialogueIndex}
            setDialogueIndex={setDialogueIndex}
            markCorrect={markCorrect}
            markWrong={markWrong}
            checkText={checkText}
            speak={speak}
            startSpeechRecognition={startSpeechRecognition}
            isListening={isListening}
            runCode={runCode}
            codeOutput={codeOutput}
          />
        </div>

        {showHint ? (
          <div className="message-in mt-5 rounded-2xl border border-cyan-300/35 bg-cyan-300/10 p-4 text-sm leading-6">
            <div className="font-bold text-cyan-100">Подсказка</div>
            <p className="mt-1 jarq-muted">{currentStep.hint ?? `Правильный ответ связан с: ${currentStep.answer ?? "примером"}.`}</p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setShowHint(true)}
            className="button-lift inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold jarq-border jarq-soft hover:border-cyan-300"
          >
            <HelpCircle size={17} />
            Помоги мне
          </button>
          <button
            type="button"
            onClick={nextStep}
            disabled={checkState !== "correct"}
            className="button-lift inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {stepIndex === steps.length - 1 ? "Завершить урок" : "Дальше"}
            <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </div>
  );
}

function StepBody(props: {
  step: InteractiveStep;
  answer: string;
  setAnswer: (value: string) => void;
  selectedWords: string[];
  setSelectedWords: (value: string[]) => void;
  matchedPairs: Array<{ left: string; right: string }>;
  setMatchedPairs: (value: Array<{ left: string; right: string }>) => void;
  leftMatch: string | null;
  setLeftMatch: (value: string | null) => void;
  dialogueIndex: number;
  setDialogueIndex: (value: number) => void;
  markCorrect: (feedback?: string) => void;
  markWrong: (feedback?: string) => void;
  checkText: (value: string, expected?: string) => void;
  speak: (text: string) => void;
  startSpeechRecognition: () => void;
  isListening: boolean;
  runCode: () => void;
  codeOutput: string;
}) {
  const { step } = props;

  if (step.type === "explanation") {
    return (
      <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
        <div className="grid min-h-40 place-items-center rounded-3xl bg-gradient-to-br from-cyan-300/20 to-purple-400/20 text-5xl font-black text-cyan-100">
          {step.illustration ?? "JQ"}
        </div>
        <ActionCard onClick={() => props.markCorrect("Супер. База понятна, идём к практике.")} label="Понял, дальше" />
      </div>
    );
  }

  if (step.type === "word_card") {
    return (
      <div className="rounded-3xl border p-6 text-center jarq-border jarq-soft">
        <div className="text-6xl font-black leading-none jarq-title-gradient">{step.word}</div>
        <button type="button" onClick={() => props.speak(step.word ?? "")} className="button-lift mx-auto mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-300 px-4 text-sm font-bold text-slate-950">
          <Volume2 size={17} />
          {step.pronunciation}
        </button>
        <p className="mt-5 text-lg font-semibold">{step.example}</p>
        <ActionCard onClick={() => props.markCorrect("Запомнил. Отличная карточка в копилку памяти.")} label="Запомнил" />
      </div>
    );
  }

  if (step.type === "choice" || step.type === "listen_choice") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {step.type === "listen_choice" ? (
          <button type="button" onClick={() => props.speak(step.audioText ?? step.answer ?? "")} className="button-lift col-span-full inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-purple-400/18 px-4 text-sm font-bold text-purple-100">
            <Headphones size={18} />
            Прослушать
          </button>
        ) : null}
        {(step.options ?? []).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => props.checkText(option)}
            className="button-lift min-h-14 rounded-2xl border px-4 text-left text-sm font-bold jarq-border jarq-soft hover:border-cyan-300"
          >
            {option}
          </button>
        ))}
      </div>
    );
  }

  if (step.type === "input" || step.type === "speak") {
    return (
      <form
        className="space-y-3"
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          props.checkText(props.answer);
        }}
      >
        {step.type === "speak" ? (
          <button type="button" onClick={props.startSpeechRecognition} className="button-lift inline-flex min-h-12 items-center gap-2 rounded-xl bg-purple-400/18 px-4 text-sm font-bold text-purple-100">
            {props.isListening ? <Loader2 className="animate-spin" size={18} /> : <Mic size={18} />}
            {props.isListening ? "Слушаю..." : "Сказать вслух"}
          </button>
        ) : null}
        <input
          value={props.answer}
          onChange={(event) => props.setAnswer(event.target.value)}
          className="min-h-14 w-full rounded-2xl border px-4 text-lg font-semibold outline-none jarq-border jarq-text jarq-soft focus:border-cyan-300"
          placeholder={step.type === "speak" ? "Или введи фразу вручную..." : "Впиши ответ..."}
        />
        <SubmitButton />
      </form>
    );
  }

  if (step.type === "sentence_builder") {
    const target = step.answer ?? "";
    const chosen = props.selectedWords.join(" ");
    return (
      <div>
        <div className="min-h-16 rounded-2xl border p-4 text-lg font-semibold jarq-border jarq-soft">{chosen || "Собранное предложение появится здесь"}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(step.words ?? []).map((word, index) => (
            <button key={`${word}-${index}`} type="button" onClick={() => props.setSelectedWords([...props.selectedWords, word])} className="button-lift rounded-xl border px-4 py-3 text-sm font-bold jarq-border jarq-soft hover:border-cyan-300">
              {word}
            </button>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => props.checkText(chosen, target)} className="button-lift inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-300 px-4 text-sm font-bold text-slate-950">
            <Check size={17} />
            Проверить
          </button>
          <button type="button" onClick={() => props.setSelectedWords([])} className="button-lift inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-bold jarq-border jarq-soft">
            <RotateCcw size={17} />
            Сброс
          </button>
        </div>
      </div>
    );
  }

  if (step.type === "true_false") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={() => props.checkText("true")} className="button-lift min-h-16 rounded-2xl bg-cyan-300 px-4 text-lg font-bold text-slate-950">
          Верно
        </button>
        <button type="button" onClick={() => props.checkText("false")} className="button-lift min-h-16 rounded-2xl border px-4 text-lg font-bold jarq-border jarq-soft">
          Неверно
        </button>
      </div>
    );
  }

  if (step.type === "matching") {
    const pairs = step.pairs ?? [];
    const leftItems = pairs.map((pair) => pair.left);
    const rightItems = pairs.map((pair) => pair.right).reverse();
    const isDone = props.matchedPairs.length === pairs.length;
    return (
      <div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            {leftItems.map((item) => (
              <button key={item} type="button" onClick={() => props.setLeftMatch(item)} className={`button-lift w-full rounded-xl border px-4 py-3 text-left text-sm font-bold ${props.leftMatch === item ? "border-cyan-300 bg-cyan-300/15" : "jarq-border jarq-soft"}`}>
                {item}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {rightItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  if (!props.leftMatch) return;
                  const pair = pairs.find((pairItem) => pairItem.left === props.leftMatch);
                  if (!pair || pair.right !== item) {
                    props.markWrong("Эта пара не совпадает. Попробуй другую связь.");
                    return;
                  }
                  const next = [...props.matchedPairs, { left: props.leftMatch, right: item }];
                  props.setMatchedPairs(next);
                  props.setLeftMatch(null);
                  if (next.length === pairs.length) props.markCorrect("Пары собраны. Хорошая работа.");
                }}
                className="button-lift w-full rounded-xl border px-4 py-3 text-left text-sm font-bold jarq-border jarq-soft"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-2xl p-3 text-sm jarq-soft jarq-muted">
          Собрано пар: {props.matchedPairs.length} / {pairs.length}
        </div>
      </div>
    );
  }

  if (step.type === "mini_dialogue") {
    const turns = step.dialogue ?? [];
    const turn = turns[props.dialogueIndex];
    if (!turn) {
      return <div className="rounded-2xl p-4 text-sm jarq-soft jarq-muted">Диалог завершён. Можно идти дальше.</div>;
    }
    return (
      <div className="rounded-3xl border p-5 jarq-border jarq-soft">
        <div className="rounded-2xl bg-purple-400/14 p-4 text-lg font-semibold">{turn.maaniy}</div>
        <div className="mt-4 grid gap-2">
          {turn.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                if (normalize(option) !== normalize(turn.answer)) {
                  props.markWrong(`Лучше ответить: ${turn.answer}`);
                  return;
                }
                if (props.dialogueIndex === turns.length - 1) props.markCorrect("Диалог пройден. Мааний доволен.");
                else props.setDialogueIndex(props.dialogueIndex + 1);
              }}
              className="button-lift min-h-12 rounded-xl border px-4 text-left text-sm font-bold jarq-border jarq-soft hover:border-cyan-300"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <textarea
        value={props.answer || step.starterCode}
        onChange={(event) => props.setAnswer(event.target.value)}
        rows={10}
        spellCheck={false}
        className="min-h-64 w-full resize-none rounded-2xl border bg-[#050b1a]/80 p-4 font-mono text-sm leading-6 text-cyan-50 outline-none jarq-border focus:border-cyan-300"
      />
      <div className="rounded-2xl border p-4 jarq-border jarq-soft">
        <div className="flex gap-2">
          <button type="button" onClick={props.runCode} className="button-lift inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-300 px-4 text-sm font-bold text-slate-950">
            <Play size={17} />
            Запустить
          </button>
          <button type="button" onClick={() => props.setAnswer(step.starterCode ?? "")} className="button-lift inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-bold jarq-border jarq-soft">
            Помоги мне
          </button>
        </div>
        <pre className="mt-4 min-h-40 whitespace-pre-wrap rounded-xl bg-black/30 p-4 text-sm text-cyan-100">{props.codeOutput || "Вывод появится здесь"}</pre>
      </div>
    </div>
  );
}

function ActionCard({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="button-lift mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 text-sm font-bold text-slate-950">
      <Check size={17} />
      {label}
    </button>
  );
}

function SubmitButton() {
  return (
    <button type="submit" className="button-lift inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 text-sm font-bold text-slate-950">
      <Check size={17} />
      Проверить
    </button>
  );
}

function LessonResult({ title, xp, steps, onRestart }: { title: string; xp: number; steps: number; onRestart: () => void }) {
  const score = Math.round((xp / Math.max(1, steps * 10)) * 100);
  return (
    <section className="relative mt-6 overflow-hidden rounded-3xl p-8 text-center jarq-glass">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.22),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.2),transparent_24%)]" />
      <motion.div className="relative mx-auto grid h-24 w-24 place-items-center rounded-full bg-cyan-300 text-slate-950" initial={{ scale: 0.7 }} animate={{ scale: [0.7, 1.12, 1] }}>
        <Trophy size={44} />
      </motion.div>
      <h2 className="relative mt-6 text-3xl font-semibold">Урок завершён</h2>
      <p className="relative mt-3 text-lg jarq-muted">{title}</p>
      <div className="relative mx-auto mt-6 grid max-w-md gap-3 sm:grid-cols-2">
        <div className="rounded-2xl p-4 jarq-soft">
          <div className="text-xs font-bold uppercase tracking-[0.14em] jarq-muted">Результат</div>
          <div className="mt-1 text-3xl font-semibold">{score}%</div>
        </div>
        <div className="rounded-2xl p-4 jarq-soft">
          <div className="text-xs font-bold uppercase tracking-[0.14em] jarq-muted">XP</div>
          <div className="mt-1 text-3xl font-semibold">{xp}</div>
        </div>
      </div>
      <p className="relative mx-auto mt-5 max-w-xl text-sm leading-6 jarq-muted">
        {score >= 70 ? "Следующий урок разблокирован. Прогресс сохранён локально и готов к синхронизации с Supabase." : "Лучше повторить проблемные темы: для разблокировки нужно 70%."}
      </p>
      <button type="button" onClick={onRestart} className="button-lift relative mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-300 px-5 text-sm font-bold text-slate-950">
        <RotateCcw size={17} />
        Повторить
      </button>
    </section>
  );
}

function playPositiveSound() {
  try {
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.frequency.value = 740;
    gain.gain.value = 0.03;
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.08);
  } catch {
    // Sound is optional; browsers may block it without user activation.
  }
}

function extractPrintedText(code: string): string {
  const match = code.match(/print\((["'`])([\s\S]*?)\1\)/);
  if (match?.[2]) return match[2];
  const variableMatch = code.match(/print\((\w+)\)/);
  if (variableMatch?.[1]) {
    const assignment = code.match(new RegExp(`${variableMatch[1]}\\s*=\\s*(["'\`])([\\s\\S]*?)\\1`));
    if (assignment?.[2]) return assignment[2];
  }
  return "";
}

function stepLabel(type: InteractiveStep["type"]): string {
  const labels: Record<InteractiveStep["type"], string> = {
    explanation: "объяснение",
    word_card: "карточка слова",
    choice: "выбор из 4",
    input: "вписать слово",
    sentence_builder: "собери предложение",
    true_false: "верно или нет",
    matching: "сопоставь пары",
    listen_choice: "послушай и выбери",
    speak: "скажи вслух",
    mini_dialogue: "мини диалог",
    code_editor: "редактор кода",
  };
  return labels[type];
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ");
}
