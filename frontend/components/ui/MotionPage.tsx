"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type MotionPageProps = {
  children: ReactNode;
  variant?: "home" | "chat" | "courses" | "lesson";
  className?: string;
};

const variants = {
  home: { opacity: 0, y: 24, scale: 0.98 },
  chat: { opacity: 0, y: 18, scale: 0.985 },
  courses: { opacity: 0, y: 30, scale: 0.97 },
  lesson: { opacity: 0, y: 16, scale: 0.99 },
};

export function MotionPage({ children, variant = "home", className = "" }: MotionPageProps) {
  return (
    <motion.div
      className={className}
      initial={variants[variant]}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
