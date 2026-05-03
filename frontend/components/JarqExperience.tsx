"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

export type JarqTheme = "day" | "night";
export type JarqLanguage = "ru" | "en";
export type HanaEmotion = "idle" | "happy" | "excited" | "thinking" | "sad";

type JarqExperienceContextValue = {
  theme: JarqTheme;
  language: JarqLanguage;
  hanaEmotion: HanaEmotion;
  hanaMessage: string | null;
  setTheme: (theme: JarqTheme) => void;
  setLanguage: (language: JarqLanguage) => void;
  setHanaEmotion: (emotion: HanaEmotion) => void;
  setHanaMessage: (message: string | null) => void;
  triggerHana: (emotion: HanaEmotion, message?: string | null) => void;
};

const JarqExperienceContext = createContext<JarqExperienceContextValue | null>(null);

export function JarqExperienceProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<JarqTheme>("night");
  const [language, setLanguageState] = useState<JarqLanguage>("ru");
  const [hanaEmotion, setHanaEmotion] = useState<HanaEmotion>("idle");
  const [hanaMessage, setHanaMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("jarq-theme") as JarqTheme | null;
    const savedLanguage = window.localStorage.getItem("jarq-language") as JarqLanguage | null;
    if (savedTheme === "day" || savedTheme === "night") setThemeState(savedTheme);
    if (savedLanguage === "ru" || savedLanguage === "en") setLanguageState(savedLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.jarqTheme = theme;
    window.localStorage.setItem("jarq-theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("jarq-language", language);
  }, [language]);

  useEffect(() => {
    if (!hanaMessage || hanaEmotion === "sad") return;
    const timeout = window.setTimeout(() => setHanaMessage(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [hanaEmotion, hanaMessage]);

  useEffect(() => {
    function handleMouseLeave(event: MouseEvent) {
      if (event.clientY <= 8) {
        setHanaEmotion("sad");
        setHanaMessage(language === "ru" ? "Ты уже уходишь? 😢" : "Leaving already? 😢");
      }
    }

    window.addEventListener("mouseleave", handleMouseLeave);
    return () => window.removeEventListener("mouseleave", handleMouseLeave);
  }, [language]);

  const value = useMemo<JarqExperienceContextValue>(
    () => ({
      theme,
      language,
      hanaEmotion,
      hanaMessage,
      setTheme: setThemeState,
      setLanguage: setLanguageState,
      setHanaEmotion,
      setHanaMessage,
      triggerHana: (emotion, message = null) => {
        setHanaEmotion(emotion);
        setHanaMessage(message);
      },
    }),
    [hanaEmotion, hanaMessage, language, theme],
  );

  return <JarqExperienceContext.Provider value={value}>{children}</JarqExperienceContext.Provider>;
}

export function useJarqExperience() {
  const context = useContext(JarqExperienceContext);
  if (!context) throw new Error("useJarqExperience must be used inside JarqExperienceProvider");
  return context;
}

export const uiText = {
  ru: {
    start: "Начать обучение",
    chat: "Открыть AI-чат",
    themeDay: "День",
    themeNight: "Ночь",
    lang: "RU",
    intro: "Привет, я Мааний — твой AI репетитор",
    support: "Поддержка",
    tutor: "Репетитор",
    supportHint: "Спроси Маания о проекте, уроках или настройках.",
  },
  en: {
    start: "Start learning",
    chat: "Open AI chat",
    themeDay: "Day",
    themeNight: "Night",
    lang: "EN",
    intro: "Hi, I’m Maaniy — your AI tutor",
    support: "Support",
    tutor: "Tutor",
    supportHint: "Ask Maaniy about the product, lessons, or setup.",
  },
};
