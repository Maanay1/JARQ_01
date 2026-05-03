"use client";

import { motion } from "framer-motion";
import { useJarqExperience } from "@/components/JarqExperience";

export function FuturisticBackground() {
  const { theme } = useJarqExperience();
  const isNight = theme === "night";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 ${
          isNight
            ? "bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.2),transparent_24%),radial-gradient(circle_at_85%_10%,rgba(168,85,247,0.22),transparent_26%),linear-gradient(135deg,#06111f,#0f172a_48%,#111827)]"
            : "bg-[radial-gradient(circle_at_20%_15%,rgba(125,211,252,0.5),transparent_26%),radial-gradient(circle_at_80%_5%,rgba(216,180,254,0.42),transparent_28%),linear-gradient(135deg,#dbeafe,#eef2ff_52%,#cffafe)]"
        }`}
      />
      {Array.from({ length: 18 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-1 w-1 rounded-full bg-cyan-300/70 shadow-[0_0_16px_rgba(34,211,238,0.9)]"
          style={{ left: `${(index * 37) % 100}%`, top: `${(index * 19) % 100}%` }}
          animate={{ y: [0, -24, 0], opacity: [0.25, 0.9, 0.25], scale: [1, 1.6, 1] }}
          transition={{ repeat: Infinity, duration: 4 + (index % 5), delay: index * 0.15 }}
        />
      ))}
      <motion.div
        className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl"
        animate={{ x: [0, -36, 0], y: [0, 24, 0] }}
        transition={{ repeat: Infinity, duration: 9 }}
      />
    </div>
  );
}
