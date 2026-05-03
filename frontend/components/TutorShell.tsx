"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, LifeBuoy, Mic, Send, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PersonaId, ProviderId, TutorMessage, sendTutorMessage } from "@/lib/api";
import { UserProgress } from "@/components/UserProgress";
import { VoiceChat } from "@/components/VoiceChat";
import { MaaniyCharacter } from "@/components/MaaniyCharacter";
import { IntroScreen } from "@/components/IntroScreen";
import { uiText, useJarqExperience } from "@/components/JarqExperience";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { MotionPage } from "@/components/ui/MotionPage";

const personas: Array<{ id: PersonaId; label: { ru: string; en: string }; tone: { ru: string; en: string } }> = [
  { id: "jarq_classic", label: { ru: "Классик", en: "Classic" }, tone: { ru: "умный, спокойный, с юмором", en: "smart, calm, lightly funny" } },
  { id: "jarq_bro", label: { ru: "Бро", en: "Bro" }, tone: { ru: "легкий, дружеский, мотивирующий", en: "casual, friendly, motivating" } },
  { id: "jarq_sensei", label: { ru: "Сенсей", en: "Sensei" }, tone: { ru: "собранный, строгий, точный", en: "focused, strict, precise" } },
  { id: "jarq_professor", label: { ru: "Профессор", en: "Professor" }, tone: { ru: "структурный, подробный", en: "structured, detailed" } },
  { id: "jarq_native_speaker", label: { ru: "Носитель языка", en: "Native Speaker" }, tone: { ru: "живой разговорный английский", en: "natural English coach" } },
  { id: "jarq_hana", label: { ru: "Мааний", en: "Maaniy" }, tone: { ru: "спокойный, уверенный, поддерживающий", en: "calm, confident, supportive" } },
];

const providers: Array<{ id: ProviderId; label: string }> = [
  { id: "openai", label: "OpenAI" },
  { id: "openrouter", label: "OpenRouter" },
  { id: "gemini", label: "Gemini" },
  { id: "ollama", label: "Ollama" },
];

const chatCopy = {
  ru: {
    title: "Умный репетитор с памятью и характером",
    personality: "Личность AI",
    active: "Активно",
    voiceReady: "Голосовой режим готов к подключению через микрофон.",
    memory: "Использованная память:",
    noMemory: "пока нет",
    thinking: "JARQ думает...",
    placeholderTutor: "Напиши фразу, тему или ошибку, которую хочешь разобрать...",
    placeholderSupport: "Спроси про уроки, настройки, OpenRouter или Supabase...",
    greeting: "Привет! Я Мааний. Выбери стиль общения и напиши, что хочешь потренировать.",
    supportGreeting: "Я в режиме поддержки. Помогу разобраться с проектом, уроками и настройками.",
    fail: "Не удалось получить ответ JARQ.",
    modeTutor: "Репетитор",
    modeSupport: "Поддержка",
    sample: "Помоги мне потренировать заказ кофе на английском.",
    back: "На главную",
    keyWarning: "Провайдеру не хватает API ключа. Проверь backend/.env и перезапусти backend.",
  },
  en: {
    title: "Smart tutor with memory and personality",
    personality: "AI personality",
    active: "Active",
    voiceReady: "Voice mode is ready to connect through the microphone.",
    memory: "Memory used:",
    noMemory: "none yet",
    thinking: "JARQ is thinking...",
    placeholderTutor: "Write a phrase, topic, or mistake you want to review...",
    placeholderSupport: "Ask about lessons, setup, OpenRouter, or Supabase...",
    greeting: "Hi! I’m Maaniy. Pick a style and tell me what you want to practice.",
    supportGreeting: "I’m in support mode. I can help with the product, lessons, and setup.",
    fail: "Could not get a JARQ response.",
    modeTutor: "Tutor",
    modeSupport: "Support",
    sample: "Help me practice ordering coffee in English.",
    back: "Back home",
    keyWarning: "The provider is missing an API key. Check backend/.env and restart the backend.",
  },
};

type ChatMode = "tutor" | "support";

export function TutorShell() {
  const { theme, language, triggerHana, setHanaEmotion } = useJarqExperience();
  const copy = chatCopy[language];
  const isNight = theme === "night";
  const [personaId, setPersonaId] = useState<PersonaId>("jarq_classic");
  const [provider, setProvider] = useState<ProviderId>("openrouter");
  const [input, setInput] = useState(copy.sample);
  const [chatMode, setChatMode] = useState<ChatMode>("tutor");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      role: "assistant",
      content: copy.greeting,
    },
  ]);
  const [memoryUsed, setMemoryUsed] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activePersona = useMemo(
    () => personas.find((persona) => persona.id === personaId) ?? personas[0],
    [personaId],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  useEffect(() => {
    setHanaEmotion(isSending ? "thinking" : "idle");
  }, [isSending, setHanaEmotion]);

  useEffect(() => {
    setInput((current) => (current === chatCopy.ru.sample || current === chatCopy.en.sample ? copy.sample : current));
  }, [copy.sample]);

  function switchMode(mode: ChatMode) {
    setChatMode(mode);
    triggerHana(mode === "support" ? "happy" : "idle", null);
    setMessages((current) => [
      ...current,
      {
        role: "assistant",
        content: mode === "support" ? copy.supportGreeting : copy.greeting,
      },
    ]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanInput = input.trim();
    if (!cleanInput || isSending) return;

    setMessages((current) => [...current, { role: "user", content: cleanInput }]);
    setInput("");
    setIsSending(true);

    try {
      const outboundMessage =
        chatMode === "support"
          ? `[support mode] ${language === "ru" ? "Отвечай как дружелюбный помощник JARQ по продукту и настройкам." : "Answer as a friendly JARQ product and setup helper."}\n${cleanInput}`
          : cleanInput;
      const response = await sendTutorMessage({ message: outboundMessage, personaId, provider });
      setMessages((current) => [...current, { role: "assistant", content: response.reply }]);
      setMemoryUsed(response.memory_used);
      triggerHana("happy", null);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: error instanceof Error ? error.message : copy.fail,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className={`relative min-h-screen overflow-x-hidden ${isNight ? "text-white" : "text-slate-950"}`}>
      <FuturisticBackground />
      <IntroScreen />
      <ExperienceControls />
      <MotionPage variant="chat" className="relative z-10">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-20 sm:px-6 sm:py-6 lg:px-8">
        <header className="flex min-w-0 flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between jarq-border">
          <div className="min-w-0">
            <Link
              href="/"
              className="button-lift mb-4 inline-flex min-h-10 max-w-full items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold jarq-glass"
            >
              <ArrowLeft size={16} />
              {copy.back}
            </Link>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">
              <Sparkles size={16} />
              JARQ AI-репетитор
            </div>
            <h1 className="jarq-title-gradient mt-2 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              {copy.title}
            </h1>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:max-w-md sm:flex-wrap sm:items-center sm:justify-end">
            {providers.map((item) => (
              <motion.button
                key={item.id}
                type="button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onMouseEnter={() => triggerHana("happy", null)}
                onClick={() => setProvider(item.id)}
                className={`button-lift min-h-11 min-w-0 rounded-xl border px-3 py-2 text-sm font-bold backdrop-blur-xl transition sm:px-4 ${
                  provider === item.id
                    ? "border-cyan-300 bg-cyan-300 text-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.35)]"
                    : "jarq-text border-white/15 hover:border-cyan-300/70 jarq-soft"
                }`}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </header>

        <div className="grid min-w-0 flex-1 gap-4 py-4 lg:grid-cols-[320px_1fr] lg:gap-5 lg:py-5 xl:grid-cols-[340px_1fr]">
          <aside className="soft-glow min-w-0 rounded-xl p-4 jarq-glass sm:rounded-2xl sm:p-5">
            <div className="mb-4 grid place-items-center sm:mb-5">
              <MaaniyCharacter emotion={isSending ? "thinking" : chatMode === "support" ? "happy" : undefined} compact />
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <Brain size={18} />
              {copy.personality}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {personas.map((persona) => (
                <motion.button
                  key={persona.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => triggerHana(persona.id === "jarq_hana" ? "excited" : "happy", null)}
                  onClick={() => setPersonaId(persona.id)}
                  className={`button-lift min-w-0 rounded-xl border p-3 text-left transition ${
                    personaId === persona.id
                      ? "scale-[1.02] border-cyan-300 bg-cyan-300/15 shadow-[0_0_28px_rgba(34,211,238,0.26)]"
                      : "hover:border-cyan-300/60 jarq-border jarq-soft"
                  }`}
                >
                  <span className="block font-semibold">{persona.label[language]}</span>
                  <span className="block text-sm jarq-muted">{persona.tone[language]}</span>
                </motion.button>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-cyan-300/10 p-3 text-sm jarq-muted ring-1 ring-cyan-300/20">
              {copy.active}: {activePersona.label[language]}. {copy.voiceReady}
            </div>

            <div className="mt-4 text-sm jarq-muted">
              <span className="font-semibold jarq-text">{copy.memory}</span>{" "}
              {memoryUsed.length ? memoryUsed.join(", ") : copy.noMemory}
            </div>

            <div className="mt-4">
              <VoiceChat personaId={personaId} />
            </div>

            <div className="mt-4">
              <UserProgress />
            </div>
          </aside>

          <section
            className="flex min-h-[70vh] min-w-0 flex-col rounded-xl jarq-glass sm:rounded-2xl lg:min-h-[680px]"
            onMouseEnter={() => triggerHana("happy", null)}
          >
            <div className="grid grid-cols-2 gap-2 border-b p-3 jarq-border sm:flex sm:flex-wrap sm:p-4">
              {(["tutor", "support"] as ChatMode[]).map((mode) => (
                <motion.button
                  key={mode}
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => switchMode(mode)}
                  className={`inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-bold transition sm:px-4 ${
                    chatMode === mode
                      ? "bg-cyan-300 text-slate-950 shadow-[0_0_26px_rgba(34,211,238,0.32)]"
                      : "jarq-text ring-1 jarq-soft"
                  }`}
                >
                  {mode === "support" ? <LifeBuoy size={16} /> : <Sparkles size={16} />}
                  {mode === "support" ? copy.modeSupport : copy.modeTutor}
                </motion.button>
              ))}
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto scroll-smooth p-3 sm:space-y-5 sm:p-6">
              <AnimatePresence initial={false}>
                {messages.map((message, index) => {
                  const warning = isProviderWarning(message.content);
                  return (
                    <motion.div
                      key={`${message.role}-${index}`}
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className={`max-w-[94%] overflow-hidden rounded-2xl px-4 py-3 text-sm leading-6 shadow-[0_10px_36px_rgba(15,23,42,0.12)] sm:max-w-[84%] sm:px-5 sm:py-4 sm:leading-7 ${
                        warning
                          ? "border border-amber-300/40 bg-amber-300/12 jarq-text"
                          : message.role === "assistant"
                            ? "jarq-text backdrop-blur jarq-soft"
                            : "ml-auto bg-cyan-300 text-slate-950 shadow-[0_18px_40px_rgba(34,211,238,0.22)]"
                      }`}
                    >
                      {warning ? (
                        <div>
                          <div className="font-semibold">{copy.keyWarning}</div>
                          <div className="mt-2 break-words text-xs jarq-muted">{message.content}</div>
                        </div>
                      ) : (
                        message.content
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {isSending ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                className="flex max-w-[94%] items-center gap-3 rounded-2xl px-4 py-3 text-sm jarq-muted backdrop-blur jarq-soft sm:max-w-[84%] sm:px-5 sm:py-4"
                >
                  <TypingDots />
                  {copy.thinking}
                </motion.div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="sticky bottom-0 border-t bg-[color-mix(in_srgb,var(--jarq-bg)_82%,transparent)] p-3 backdrop-blur-xl jarq-border sm:p-4">
              <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-end gap-2">
                <button
                  type="button"
                  title="Голосовой ввод"
                  className="button-lift grid h-11 w-11 shrink-0 place-items-center rounded-xl border jarq-border jarq-text transition hover:border-cyan-300 jarq-soft"
                >
                  <Mic size={18} />
                </button>
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  rows={2}
                  className="min-h-11 w-full resize-none rounded-xl border px-3 py-3 text-sm outline-none transition focus:border-cyan-300 jarq-border jarq-text jarq-soft placeholder:text-slate-400 sm:px-4"
                  placeholder={chatMode === "support" ? copy.placeholderSupport : copy.placeholderTutor}
                />
                <button
                  type="submit"
                  disabled={isSending}
                  title="Отправить"
                  onMouseEnter={() => triggerHana("happy", null)}
                  onClick={() => triggerHana("excited", null)}
                  className="button-lift grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-300 text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.35)] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </section>
        </div>
      </section>
      </MotionPage>
    </main>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      <span className="h-2 w-2 animate-bounce rounded-full bg-coral [animation-delay:-0.2s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-coral [animation-delay:-0.1s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-coral" />
    </span>
  );
}

function isProviderWarning(content: string): boolean {
  const lowerContent = content.toLowerCase();
  return lowerContent.includes("api key is not configured") || lowerContent.includes("add openrouter_api_key");
}
