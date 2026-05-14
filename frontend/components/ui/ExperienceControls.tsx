"use client";

import { Languages, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { uiText, useJarqExperience } from "@/components/JarqExperience";

export function ExperienceControls() {
  const { theme, language, setTheme, setLanguage, triggerHana } = useJarqExperience();
  const text = uiText[language];

  return (
    <div className="fixed right-3 top-3 z-40 flex max-w-[calc(100vw-1.5rem)] gap-2 sm:right-4 sm:top-4">
      <motion.button
        type="button"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onMouseEnter={() => triggerHana("happy", null)}
        onClick={() => setTheme(theme === "night" ? "day" : "night")}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#26323d] bg-[#0b1117]/95 text-slate-200 shadow-[0_14px_32px_rgba(0,0,0,0.34)] backdrop-blur sm:h-11 sm:w-11"
        title={theme === "night" ? text.themeDay : text.themeNight}
      >
        {theme === "night" ? <Sun size={18} /> : <Moon size={18} />}
      </motion.button>
      <motion.button
        type="button"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onMouseEnter={() => triggerHana("happy", null)}
        onClick={() => setLanguage(language === "ru" ? "en" : "ru")}
        className="inline-flex h-10 min-w-0 items-center gap-2 rounded-lg border border-[#26323d] bg-[#0b1117]/95 px-3 text-sm font-semibold text-slate-200 shadow-[0_14px_32px_rgba(0,0,0,0.34)] backdrop-blur sm:h-11 sm:px-4"
      >
        <Languages size={17} />
        {text.lang}
      </motion.button>
    </div>
  );
}
