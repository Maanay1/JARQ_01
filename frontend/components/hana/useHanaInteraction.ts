"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type HanaMood =
  | "idle"
  | "hover_start_learning"
  | "hover_open_chat"
  | "hover_voice"
  | "click"
  | "exit_intent"
  | "inactive"
  | "thinking"
  | "happy";

type MousePoint = {
  x: number;
  y: number;
};

const INACTIVE_DELAY = 120000;

export function useHanaInteraction() {
  const [mouse, setMouse] = useState<MousePoint>({ x: 0, y: 0 });
  const [mood, setMood] = useState<HanaMood>("idle");
  const inactiveTimerRef = useRef<number | null>(null);
  const clickTimerRef = useRef<number | null>(null);
  const moodRef = useRef<HanaMood>("idle");

  const resetInactiveTimer = useCallback(() => {
    if (inactiveTimerRef.current) window.clearTimeout(inactiveTimerRef.current);
    inactiveTimerRef.current = window.setTimeout(() => {
      setMood("inactive");
      moodRef.current = "inactive";
    }, INACTIVE_DELAY);
  }, []);

  const updateMood = useCallback((nextMood: HanaMood) => {
    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    moodRef.current = nextMood;
    setMood(nextMood);
  }, []);

  const resetMood = useCallback(() => {
    if (moodRef.current === "exit_intent" || moodRef.current === "inactive") return;
    updateMood("idle");
  }, [updateMood]);

  const triggerClick = useCallback(() => {
    updateMood("click");
    clickTimerRef.current = window.setTimeout(() => {
      if (moodRef.current === "click") updateMood("idle");
    }, 900);
  }, [updateMood]);

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      setMouse({ x: event.clientX, y: event.clientY });
      resetInactiveTimer();

      if (event.clientY < 24) {
        updateMood("exit_intent");
        return;
      }

      if (moodRef.current === "exit_intent" || moodRef.current === "inactive") {
        updateMood("idle");
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    resetInactiveTimer();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (inactiveTimerRef.current) window.clearTimeout(inactiveTimerRef.current);
      if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current);
    };
  }, [resetInactiveTimer, updateMood]);

  return {
    mouse,
    mood,
    setMood: updateMood,
    resetMood,
    triggerClick,
  };
}
