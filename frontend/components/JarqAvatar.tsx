"use client";

import { Loader2 } from "lucide-react";

export type JarqEmotion = "happy" | "serious" | "funny" | "confused" | "proud" | "calm";

type JarqAvatarProps = {
  emotion: JarqEmotion;
  speaking: boolean;
  recording?: boolean;
  processing?: boolean;
};

const emotionConfig: Record<
  JarqEmotion,
  {
    face: string;
    label: string;
    className: string;
    mood: string;
  }
> = {
  happy: {
    face: ":)",
    label: "Радостно",
    className: "bg-mint/25 text-ink border-mint",
    mood: "светлый настрой",
  },
  serious: {
    face: "-_-",
    label: "Серьезно",
    className: "bg-ink text-white border-ink",
    mood: "режим фокуса",
  },
  funny: {
    face: ":D",
    label: "Весело",
    className: "bg-coral/25 text-ink border-coral",
    mood: "игривая реакция",
  },
  confused: {
    face: "?",
    label: "Вдумчиво",
    className: "bg-sky/25 text-ink border-sky",
    mood: "думает",
  },
  proud: {
    face: "^_^",
    label: "Гордится",
    className: "bg-mint text-ink border-mint",
    mood: "гордится тобой",
  },
  calm: {
    face: "J",
    label: "Спокойно",
    className: "bg-paper text-ink border-ink/10",
    mood: "спокойный режим",
  },
};

export function JarqAvatar({
  emotion,
  speaking,
  recording = false,
  processing = false,
}: JarqAvatarProps) {
  const config = emotionConfig[emotion];

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`relative grid h-28 w-28 place-items-center rounded-full border-2 text-3xl font-bold shadow-soft transition-all duration-300 ease-out ${config.className} ${
          speaking ? "animate-pulse scale-105 shadow-[0_0_42px_rgba(80,212,186,0.35)]" : ""
        } ${recording ? "ring-4 ring-coral/30 shadow-[0_0_32px_rgba(255,125,99,0.45)]" : ""}`}
      >
        <span className="avatar-orbit pointer-events-none absolute -inset-2 rounded-full border border-dashed border-current/15" />
        {processing ? (
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-current" />
          </div>
        ) : (
          <span>{config.face}</span>
        )}

        {speaking ? (
          <span className="absolute -right-1 -top-1 grid h-8 w-8 place-items-center rounded-full bg-white text-ink shadow-soft">
            <Loader2 className="animate-spin" size={16} />
          </span>
        ) : null}
      </div>

      <div className="text-center">
        <div className="text-sm font-semibold transition-colors duration-300">{config.label}</div>
        <div className="text-xs text-ink/55 transition-opacity duration-300">{processing ? "думает..." : config.mood}</div>
      </div>
    </div>
  );
}
