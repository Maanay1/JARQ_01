"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MaaniyMood = "idle" | "hover" | "click" | "thinking" | "happy" | "focused" | "sad" | "inactive";

const INACTIVE_DELAY = 120000;

export function useMaaniyInteraction() {
  const [mood, setMood] = useState<MaaniyMood>("idle");
  const inactiveTimerRef = useRef<number | null>(null);
  const clickTimerRef = useRef<number | null>(null);
  const moodRef = useRef<MaaniyMood>("idle");

  const updateMood = useCallback((nextMood: MaaniyMood) => {
    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    moodRef.current = nextMood;
    setMood(nextMood);
  }, []);

  const resetInactiveTimer = useCallback(() => {
    if (inactiveTimerRef.current) window.clearTimeout(inactiveTimerRef.current);
    inactiveTimerRef.current = window.setTimeout(() => {
      moodRef.current = "inactive";
      setMood("inactive");
    }, INACTIVE_DELAY);
  }, []);

  const resetMood = useCallback(() => {
    if (moodRef.current === "sad" || moodRef.current === "inactive") return;
    updateMood("idle");
  }, [updateMood]);

  const triggerClick = useCallback(() => {
    updateMood("click");
    clickTimerRef.current = window.setTimeout(() => {
      if (moodRef.current === "click") updateMood("idle");
    }, 800);
  }, [updateMood]);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      resetInactiveTimer();

      if (event.pointerType === "mouse" && event.clientY < 24) {
        updateMood("sad");
        return;
      }

      if (moodRef.current === "sad" || moodRef.current === "inactive") {
        updateMood("idle");
      }
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", resetInactiveTimer, { passive: true });
    resetInactiveTimer();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", resetInactiveTimer);
      if (inactiveTimerRef.current) window.clearTimeout(inactiveTimerRef.current);
      if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current);
    };
  }, [resetInactiveTimer, updateMood]);

  return {
    mood,
    setMood: updateMood,
    resetMood,
    triggerClick,
  };
}
