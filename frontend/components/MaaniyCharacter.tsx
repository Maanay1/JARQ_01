"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { HanaEmotion, useJarqExperience } from "@/components/JarqExperience";
import { MaaniyMood } from "@/components/maaniy/useMaaniyInteraction";

interface MaaniyCharacterProps {
  mood?: MaaniyMood;
  size?: "sm" | "md" | "lg";
  showBubble?: boolean;
  className?: string;
  emotion?: HanaEmotion;
  message?: string | null;
  compact?: boolean;
}

type MaaniyPose = {
  bubble: string;
  mouth: string;
  brow: number;
  eyeGlow: number;
  pupilY: number;
  headTilt: number;
  bodyTilt: number;
  blush: number;
  armLift: number;
};

const moodConfig: Record<MaaniyMood, MaaniyPose> = {
  idle: {
    bubble: "",
    mouth: "M116 151 C124 158 137 158 145 151",
    brow: 0,
    eyeGlow: 0.42,
    pupilY: 0,
    headTilt: 0,
    bodyTilt: 0,
    blush: 0.18,
    armLift: 0,
  },
  hover: {
    bubble: "Привет, я Мааний — твой AI репетитор",
    mouth: "M113 149 C124 162 139 162 150 149",
    brow: -1,
    eyeGlow: 0.64,
    pupilY: -1,
    headTilt: 3,
    bodyTilt: -1,
    blush: 0.26,
    armLift: 4,
  },
  click: {
    bubble: "Погнали!",
    mouth: "M109 147 C123 168 141 168 154 147",
    brow: -2,
    eyeGlow: 0.88,
    pupilY: -2,
    headTilt: -2,
    bodyTilt: 1,
    blush: 0.36,
    armLift: 10,
  },
  thinking: {
    bubble: "Думаю...",
    mouth: "M115 156 C125 153 137 153 147 156",
    brow: -3,
    eyeGlow: 0.5,
    pupilY: -5,
    headTilt: -4,
    bodyTilt: 1,
    blush: 0.12,
    armLift: 2,
  },
  happy: {
    bubble: "Отлично. Двигаемся дальше!",
    mouth: "M110 148 C123 166 140 166 153 148",
    brow: -1,
    eyeGlow: 0.78,
    pupilY: -1,
    headTilt: 4,
    bodyTilt: -2,
    blush: 0.34,
    armLift: 7,
  },
  focused: {
    bubble: "Фокус. Разберём по шагам.",
    mouth: "M116 154 C125 157 137 157 146 154",
    brow: 3,
    eyeGlow: 0.56,
    pupilY: 0,
    headTilt: 0,
    bodyTilt: 0,
    blush: 0.08,
    armLift: 0,
  },
  sad: {
    bubble: "Ты уже уходишь?",
    mouth: "M116 160 C125 154 138 154 147 160",
    brow: 4,
    eyeGlow: 0.3,
    pupilY: 5,
    headTilt: -5,
    bodyTilt: -1,
    blush: 0.1,
    armLift: -4,
  },
  inactive: {
    bubble: "Я рядом, когда будешь готов.",
    mouth: "M119 156 C126 160 136 160 143 156",
    brow: 1,
    eyeGlow: 0.34,
    pupilY: 2,
    headTilt: 5,
    bodyTilt: 2,
    blush: 0.1,
    armLift: -2,
  },
};

const sizeClass = {
  sm: "h-40 w-40",
  md: "h-64 w-64 sm:h-72 sm:w-72",
  lg: "h-64 w-64 sm:h-80 sm:w-80 lg:h-[27rem] lg:w-[27rem]",
};

function moodFromEmotion(emotion?: HanaEmotion): MaaniyMood | undefined {
  if (!emotion) return undefined;
  if (emotion === "thinking") return "thinking";
  if (emotion === "sad") return "sad";
  if (emotion === "happy" || emotion === "excited") return "happy";
  return "idle";
}

export function MaaniyCharacter({
  mood,
  size = "md",
  showBubble = true,
  className = "",
  emotion,
  message,
  compact = false,
}: MaaniyCharacterProps) {
  const experience = useJarqExperience();
  const shouldReduceMotion = useReducedMotion();
  const activeMood = mood ?? moodFromEmotion(emotion) ?? moodFromEmotion(experience.hanaEmotion) ?? "idle";
  const pose = moodConfig[activeMood];
  const activeBubble = message ?? experience.hanaMessage ?? pose.bubble;
  const resolvedSize = compact ? "sm" : size;
  const [imageReady, setImageReady] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [canFollowCursor, setCanFollowCursor] = useState(false);
  const rawLookX = useMotionValue(0);
  const rawLookY = useMotionValue(0);
  const lookX = useSpring(rawLookX, { stiffness: 90, damping: 22, mass: 0.45 });
  const lookY = useSpring(rawLookY, { stiffness: 90, damping: 22, mass: 0.45 });
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanFollowCursor(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!canFollowCursor) {
      rawLookX.set(0);
      rawLookY.set(pose.pupilY);
      return;
    }

    function handleMouseMove(event: MouseEvent) {
      const rect = rootRef.current?.getBoundingClientRect();
      const centerX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const centerY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
      const dx = Math.max(-1, Math.min(1, (event.clientX - centerX) / (window.innerWidth * 0.24)));
      const dy = Math.max(-1, Math.min(1, (event.clientY - centerY) / (window.innerHeight * 0.24)));
      rawLookX.set(dx * 7);
      rawLookY.set(dy * 5 + pose.pupilY);
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [canFollowCursor, pose.pupilY, rawLookX, rawLookY]);

  const eyeMotion = useMemo(() => ({ x: lookX, y: lookY }), [lookX, lookY]);
  const showImage = imageReady && !imageFailed;
  const bubbleVisible = showBubble && Boolean(activeBubble);

  return (
    <motion.div
      ref={rootRef}
      className={`relative isolate ${sizeClass[resolvedSize]} ${className}`}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
      animate={{
        opacity: 1,
        y: shouldReduceMotion ? 0 : activeMood === "inactive" ? [0, 2, 0] : [0, -6, 0],
        scale: activeMood === "click" ? [1, 1.07, 0.99, 1] : 1,
      }}
      transition={{
        y: { repeat: shouldReduceMotion ? 0 : Infinity, duration: activeMood === "inactive" ? 5.5 : 4.2, ease: "easeInOut" },
        scale: { duration: 0.55, ease: "easeOut" },
        opacity: { duration: 0.2 },
      }}
      aria-label="MAANIY, JARQ AI tutor mascot"
      role="img"
    >
      <motion.div
        className="absolute inset-1 -z-10 rounded-full bg-cyan-300/20 blur-3xl"
        animate={{ scale: activeMood === "happy" || activeMood === "click" ? [1, 1.14, 1] : [1, 1.06, 1], opacity: [0.42, 0.78, 0.42] }}
        transition={{ repeat: shouldReduceMotion ? 0 : Infinity, duration: activeMood === "happy" ? 2 : 3.8, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-12 -z-10 rounded-full bg-purple-400/18 blur-2xl"
        animate={{ rotate: shouldReduceMotion ? 0 : 360 }}
        transition={{ repeat: shouldReduceMotion ? 0 : Infinity, duration: 18, ease: "linear" }}
      />

      <motion.div
        className="jarq-text absolute -top-2 left-1/2 z-30 w-[min(16rem,84vw)] -translate-x-1/2 rounded-2xl border px-3 py-2 text-center text-xs font-bold leading-5 shadow-[0_20px_60px_rgba(34,211,238,0.24)] backdrop-blur-xl sm:-top-4 sm:w-[min(18rem,92vw)] sm:px-4 sm:py-3 sm:text-sm"
        style={{ background: "color-mix(in srgb, var(--jarq-bg-2) 20%, white 80%)", borderColor: "var(--jarq-border)" }}
        animate={{ opacity: bubbleVisible ? 1 : 0, y: bubbleVisible ? 0 : 8, scale: bubbleVisible ? 1 : 0.98 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        aria-hidden={!bubbleVisible}
      >
        {activeBubble || " "}
        <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r bg-inherit" />
      </motion.div>

      <img
        src="/maaniy/maaniy-reference.png"
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 z-20 h-full w-full object-contain drop-shadow-[0_32px_70px_rgba(34,211,238,0.32)] transition-opacity duration-300 ${showImage ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onLoad={() => setImageReady(true)}
        onError={() => setImageFailed(true)}
      />

      <motion.svg
        viewBox="0 0 260 320"
        className={`relative z-10 h-full w-full drop-shadow-[0_32px_70px_rgba(34,211,238,0.32)] transition-opacity duration-300 ${showImage ? "opacity-0" : "opacity-100"}`}
      >
        <defs>
          <linearGradient id="maaniyHair" x1="70" x2="190" y1="30" y2="140">
            <stop stopColor="#020617" />
            <stop offset="0.55" stopColor="#0f172a" />
            <stop offset="1" stopColor="#164e63" />
          </linearGradient>
          <linearGradient id="maaniyHoodie" x1="66" x2="194" y1="184" y2="304">
            <stop stopColor="#071126" />
            <stop offset="0.64" stopColor="#101a45" />
            <stop offset="1" stopColor="#0e7490" />
          </linearGradient>
          <radialGradient id="maaniyEye" cx="50%" cy="44%" r="70%">
            <stop stopColor="#ecfeff" />
            <stop offset="0.45" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#0e7490" />
          </radialGradient>
        </defs>

        <motion.g animate={{ rotate: pose.bodyTilt }} style={{ originX: "130px", originY: "228px" }} transition={{ duration: 0.35 }}>
          <path d="M66 292 C72 226 94 188 130 188 C166 188 188 226 194 292 C160 310 100 310 66 292Z" fill="url(#maaniyHoodie)" />
          <path d="M88 218 C104 236 116 246 130 246 C144 246 156 236 172 218 L188 292 C152 306 108 306 72 292Z" fill="#0f172a" opacity="0.84" />
          <path d="M101 213 C112 230 122 238 130 238 C138 238 148 230 159 213" fill="none" stroke="#67e8f9" strokeWidth="4" strokeLinecap="round" />
          <path d="M86 233 C74 242 65 259 61 282" fill="none" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
          <path d="M174 233 C186 242 195 259 199 282" fill="none" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" opacity="0.55" />

          <motion.g animate={{ y: -pose.armLift }} transition={{ duration: 0.35 }}>
            <path d="M90 246 C72 250 58 264 54 284" fill="none" stroke="#0f172a" strokeWidth="16" strokeLinecap="round" />
            <path d="M170 246 C188 250 202 264 206 284" fill="none" stroke="#0f172a" strokeWidth="16" strokeLinecap="round" />
          </motion.g>

          <path d="M92 205 C104 184 156 184 168 205 C160 226 100 226 92 205Z" fill="#e9b98f" />
          <path d="M89 210 C94 196 104 188 116 186 C120 207 140 207 144 186 C156 188 166 196 171 210 C154 226 106 226 89 210Z" fill="#0f172a" opacity="0.28" />

          <path d="M84 222 C96 210 112 205 130 205 C148 205 164 210 176 222" fill="none" stroke="#0f172a" strokeWidth="13" strokeLinecap="round" />
          <circle cx="92" cy="222" r="14" fill="#111827" stroke="#67e8f9" strokeWidth="4" />
          <circle cx="168" cy="222" r="14" fill="#111827" stroke="#67e8f9" strokeWidth="4" />
          <path d="M106 224 C118 232 142 232 154 224" fill="none" stroke="#67e8f9" strokeWidth="4" strokeLinecap="round" />
        </motion.g>

        <motion.g
          animate={{ rotate: pose.headTilt }}
          style={{ originX: "130px", originY: "132px" }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
        >
          <path d="M76 119 C76 75 98 50 130 50 C162 50 184 75 184 119 C184 161 162 189 130 189 C98 189 76 161 76 119Z" fill="#f0c29b" />
          <path d="M76 116 C72 76 94 44 128 39 C166 34 190 62 188 111 C178 83 154 78 128 79 C104 80 88 90 76 116Z" fill="url(#maaniyHair)" />
          <path d="M88 91 C101 66 126 55 157 63 C144 71 126 76 102 77 C100 86 96 92 88 91Z" fill="#111827" opacity="0.92" />
          <path d="M143 58 C164 62 176 75 181 96 C165 83 151 78 132 79 C137 73 141 66 143 58Z" fill="#164e63" opacity="0.82" />

          <path d="M84 123 C75 121 69 128 71 139 C73 151 82 155 88 149" fill="#f0c29b" />
          <path d="M176 123 C185 121 191 128 189 139 C187 151 178 155 172 149" fill="#f0c29b" />

          <motion.g style={eyeMotion}>
            <ellipse cx="111" cy="127" rx="11" ry="13" fill="#f8fafc" />
            <ellipse cx="149" cy="127" rx="11" ry="13" fill="#f8fafc" />
            <circle cx="111" cy="128" r="6" fill="url(#maaniyEye)" />
            <circle cx="149" cy="128" r="6" fill="url(#maaniyEye)" />
            <circle cx="113" cy="126" r="2" fill="#fff" opacity={0.95} />
            <circle cx="151" cy="126" r="2" fill="#fff" opacity={0.95} />
          </motion.g>

          <motion.path d="M98 109 C106 105 115 105 123 109" fill="none" stroke="#111827" strokeWidth="4" strokeLinecap="round" animate={{ y: pose.brow }} />
          <motion.path d="M137 109 C145 105 154 105 162 109" fill="none" stroke="#111827" strokeWidth="4" strokeLinecap="round" animate={{ y: pose.brow }} />
          <path d="M130 134 C128 142 126 148 122 152 C126 155 133 155 137 152" fill="none" stroke="#d08d6b" strokeWidth="3" strokeLinecap="round" />
          <motion.path d={pose.mouth} fill="none" stroke="#7f1d1d" strokeWidth="4" strokeLinecap="round" />
          <motion.ellipse cx="98" cy="146" rx="10" ry="5" fill="#fb7185" opacity={pose.blush} />
          <motion.ellipse cx="162" cy="146" rx="10" ry="5" fill="#fb7185" opacity={pose.blush} />

          <path d="M92 122 C101 115 120 115 126 122" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <path d="M134 122 C140 115 159 115 168 122" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <path d="M126 122 L134 122" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <motion.circle cx="111" cy="128" r="18" fill="#22d3ee" opacity={pose.eyeGlow * 0.12} />
          <motion.circle cx="149" cy="128" r="18" fill="#22d3ee" opacity={pose.eyeGlow * 0.12} />
        </motion.g>
      </motion.svg>
    </motion.div>
  );
}
