"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MaaniyCharacter } from "@/components/MaaniyCharacter";
import { uiText, useJarqExperience } from "@/components/JarqExperience";

export function IntroScreen() {
  const { language, triggerHana } = useJarqExperience();
  const [isVisible, setIsVisible] = useState(false);
  const text = uiText[language];

  useEffect(() => {
    setIsVisible(window.sessionStorage.getItem("jarq-intro-seen") !== "true");
  }, []);

  function closeIntro() {
    window.sessionStorage.setItem("jarq-intro-seen", "true");
    triggerHana("excited", language === "ru" ? "Погнали учиться!" : "Let’s learn!");
    setIsVisible(false);
  }

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[#06111f]/95 px-4 text-white backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.22),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.24),transparent_30%)]" />
          <motion.div
            className="relative flex max-w-xl flex-col items-center text-center"
            initial={{ y: 28, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
          >
            <MaaniyCharacter emotion="happy" message={text.intro} />
            <motion.button
              type="button"
              onClick={closeIntro}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="mt-6 rounded-full bg-cyan-300 px-7 py-3 text-sm font-bold text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.45)]"
            >
              {text.start}
            </motion.button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
