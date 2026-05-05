"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { HanaEmotion, useJarqExperience } from "@/components/JarqExperience";
import { MaaniyMood } from "@/components/maaniy/useMaaniyInteraction";

export interface MaaniyCharacterProps {
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
  pawWave: number;
  lensOpen: number;
};

const moodConfig: Record<MaaniyMood, MaaniyPose> = {
  idle: {
    bubble: "",
    mouth: "M116 165 C124 171 137 171 145 165",
    brow: 0,
    eyeGlow: 0.5,
    pupilY: 0,
    headTilt: 0,
    bodyTilt: 0,
    blush: 0.18,
    armLift: 3,
    pawWave: -8,
    lensOpen: 1,
  },
  hover: {
    bubble: "Готов? Я рядом!",
    mouth: "M112 162 C124 176 140 176 151 162",
    brow: -2,
    eyeGlow: 0.72,
    pupilY: -1,
    headTilt: 3,
    bodyTilt: -1,
    blush: 0.28,
    armLift: 7,
    pawWave: -12,
    lensOpen: 1.05,
  },
  click: {
    bubble: "Йей! Погнали",
    mouth: "M110 160 C123 181 142 181 155 160",
    brow: -3,
    eyeGlow: 0.95,
    pupilY: -2,
    headTilt: -3,
    bodyTilt: 2,
    blush: 0.38,
    armLift: 12,
    pawWave: -22,
    lensOpen: 1.08,
  },
  thinking: {
    bubble: "Хмм... думаю",
    mouth: "M117 169 C125 166 137 166 145 169",
    brow: -4,
    eyeGlow: 0.55,
    pupilY: -5,
    headTilt: -5,
    bodyTilt: 1,
    blush: 0.12,
    armLift: 2,
    pawWave: -4,
    lensOpen: 0.94,
  },
  happy: {
    bubble: "Отлично!",
    mouth: "M111 161 C124 178 141 178 154 161",
    brow: -2,
    eyeGlow: 0.82,
    pupilY: -1,
    headTilt: 4,
    bodyTilt: -2,
    blush: 0.34,
    armLift: 9,
    pawWave: -18,
    lensOpen: 1.06,
  },
  focused: {
    bubble: "Разберём по шагам.",
    mouth: "M116 167 C125 170 137 170 146 167",
    brow: 3,
    eyeGlow: 0.58,
    pupilY: 0,
    headTilt: 0,
    bodyTilt: 0,
    blush: 0.1,
    armLift: 0,
    pawWave: 0,
    lensOpen: 0.96,
  },
  sad: {
    bubble: "Ты уже уходишь?",
    mouth: "M116 174 C125 166 138 166 147 174",
    brow: 5,
    eyeGlow: 0.32,
    pupilY: 5,
    headTilt: -5,
    bodyTilt: -1,
    blush: 0.1,
    armLift: -5,
    pawWave: 6,
    lensOpen: 0.88,
  },
  inactive: {
    bubble: "Я пока тут... жду тебя",
    mouth: "M120 170 C126 174 136 174 142 170",
    brow: 2,
    eyeGlow: 0.34,
    pupilY: 3,
    headTilt: 5,
    bodyTilt: 2,
    blush: 0.08,
    armLift: -3,
    pawWave: 4,
    lensOpen: 0.9,
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
  const [canFollowCursor, setCanFollowCursor] = useState(false);
  const [isButtonHovering, setIsButtonHovering] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const rawLookX = useMotionValue(0);
  const rawLookY = useMotionValue(0);
  const lookX = useSpring(rawLookX, { stiffness: 95, damping: 20, mass: 0.42 });
  const lookY = useSpring(rawLookY, { stiffness: 95, damping: 20, mass: 0.42 });
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
      const dx = Math.max(-1, Math.min(1, (event.clientX - centerX) / (window.innerWidth * 0.22)));
      const dy = Math.max(-1, Math.min(1, (event.clientY - centerY) / (window.innerHeight * 0.22)));
      rawLookX.set(dx * 5.2);
      rawLookY.set(dy * 4.4 + pose.pupilY);
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [canFollowCursor, pose.pupilY, rawLookX, rawLookY]);

  useEffect(() => {
    function handlePointerOver(event: PointerEvent) {
      if (event.target instanceof Element && event.target.closest("button, a[role='button'], .button-lift")) {
        setIsButtonHovering(true);
      }
    }

    function handlePointerOut(event: PointerEvent) {
      if (event.target instanceof Element && event.target.closest("button, a[role='button'], .button-lift")) {
        setIsButtonHovering(false);
      }
    }

    function handleBeforeUnload() {
      setIsLeaving(true);
    }

    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.addEventListener("pointerout", handlePointerOut, { passive: true });
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const eyeMotion = useMemo(() => ({ x: lookX, y: lookY }), [lookX, lookY]);
  const bubbleVisible = showBubble && Boolean(activeBubble);
  const visualPose = isLeaving ? moodConfig.sad : pose;
  const shouldButtonBounce = isButtonHovering && !shouldReduceMotion;

  return (
    <motion.div
      ref={rootRef}
      className={`relative isolate ${sizeClass[resolvedSize]} ${className}`}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
      animate={{
        opacity: 1,
        y: shouldButtonBounce ? [0, -9, 0] : shouldReduceMotion ? 0 : activeMood === "inactive" ? [0, 2, 0] : [0, -6, 0],
        scale: activeMood === "click" ? [1, 1.08, 0.99, 1] : 1,
      }}
      transition={{
        y: shouldButtonBounce
          ? { duration: 0.38, ease: "easeOut" }
          : { repeat: shouldReduceMotion ? 0 : Infinity, duration: activeMood === "inactive" ? 5.6 : 4.1, ease: "easeInOut" },
        scale: { duration: 0.55, ease: "easeOut" },
        opacity: { duration: 0.2 },
      }}
      aria-label="JARQ AI tutor mascot"
      role="img"
    >
      <motion.div
        className="absolute inset-1 -z-10 rounded-full bg-cyan-300/20 blur-3xl"
        animate={{ scale: activeMood === "happy" || activeMood === "click" ? [1, 1.16, 1] : [1, 1.06, 1], opacity: [0.42, 0.82, 0.42] }}
        transition={{ repeat: shouldReduceMotion ? 0 : Infinity, duration: activeMood === "happy" ? 2 : 3.8, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-12 -z-10 rounded-full bg-purple-400/20 blur-2xl"
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

      <motion.svg
        viewBox="0 0 260 320"
        className="relative z-10 h-full w-full drop-shadow-[0_32px_70px_rgba(34,211,238,0.32)]"
      >
        <defs>
          <radialGradient id="maaniyPlushBlack" cx="44%" cy="28%" r="78%">
            <stop stopColor="#2b313d" />
            <stop offset="0.42" stopColor="#080c13" />
            <stop offset="1" stopColor="#01030a" />
          </radialGradient>
          <radialGradient id="maaniyFurSoft" cx="46%" cy="32%" r="70%">
            <stop stopColor="#fffdf4" />
            <stop offset="0.56" stopColor="#f0eadf" />
            <stop offset="1" stopColor="#d3cabf" />
          </radialGradient>
          <radialGradient id="maaniyLens" cx="42%" cy="28%" r="80%">
            <stop stopColor="#f8fbff" stopOpacity="0.82" />
            <stop offset="0.38" stopColor="#9fb4ce" stopOpacity="0.42" />
            <stop offset="1" stopColor="#090b12" stopOpacity="0.78" />
          </radialGradient>
          <linearGradient id="maaniyHeadphone" x1="54" x2="206" y1="42" y2="154">
            <stop stopColor="#232936" />
            <stop offset="0.55" stopColor="#090c13" />
            <stop offset="1" stopColor="#02040a" />
          </linearGradient>
          <radialGradient id="maaniyEye" cx="42%" cy="35%" r="70%">
            <stop stopColor="#e9fdff" />
            <stop offset="0.32" stopColor="#61e8ff" />
            <stop offset="0.64" stopColor="#3554ff" />
            <stop offset="1" stopColor="#101225" />
          </radialGradient>
          <linearGradient id="maaniyNeon" x1="62" x2="202" y1="62" y2="280">
            <stop stopColor="#22d3ee" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
          <filter id="maaniyGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.g animate={{ rotate: visualPose.bodyTilt }} style={{ originX: "130px", originY: "250px" }} transition={{ duration: 0.35 }}>
          <ellipse cx="130" cy="285" rx="67" ry="16" fill="#020617" opacity="0.34" />
          <path d="M75 300 C78 244 97 209 130 209 C163 209 182 244 185 300 C154 315 106 315 75 300Z" fill="url(#maaniyPlushBlack)" />
          <path d="M101 224 C109 246 119 258 130 258 C141 258 151 246 159 224 C146 216 114 216 101 224Z" fill="url(#maaniyFurSoft)" opacity="0.95" />
          <path d="M90 237 C76 246 67 265 66 287" fill="none" stroke="#05070d" strokeWidth="18" strokeLinecap="round" />
          <motion.path
            d="M170 237 C184 246 193 265 194 287"
            fill="none"
            stroke="#05070d"
            strokeWidth="18"
            strokeLinecap="round"
            animate={{ rotate: visualPose.pawWave, y: -visualPose.armLift }}
            style={{ originX: "170px", originY: "238px" }}
            transition={{ type: "spring", stiffness: 180, damping: 16 }}
          />
          <circle cx="71" cy="291" r="11" fill="#0a0d14" />
          <motion.circle
            cx="194"
            cy="291"
            r="11"
            fill="#0a0d14"
            animate={{ y: -visualPose.armLift }}
            transition={{ type: "spring", stiffness: 180, damping: 16 }}
          />
          <path d="M105 272 C117 279 143 279 155 272" fill="none" stroke="url(#maaniyNeon)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          <circle cx="130" cy="238" r="6" fill="#22d3ee" opacity="0.82" filter="url(#maaniyGlow)" />
        </motion.g>

        <motion.g
          animate={{ rotate: visualPose.headTilt }}
          style={{ originX: "130px", originY: "128px" }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
        >
          <path d="M51 117 C43 79 61 51 93 43 C105 25 154 25 167 43 C198 51 217 79 209 117 C225 150 206 203 169 209 C151 224 109 224 91 209 C54 203 35 150 51 117Z" fill="url(#maaniyPlushBlack)" />
          <path d="M67 67 C54 47 62 29 84 31 C101 33 109 50 101 69Z" fill="#090c13" />
          <path d="M193 67 C206 47 198 29 176 31 C159 33 151 50 159 69Z" fill="#090c13" />
          <path d="M75 61 C69 49 73 41 85 42 C93 43 98 52 95 62Z" fill="#f7b7c8" opacity="0.86" />
          <path d="M185 61 C191 49 187 41 175 42 C167 43 162 52 165 62Z" fill="#f7b7c8" opacity="0.86" />

          <path d="M130 47 C118 66 107 85 99 108 C114 102 133 101 150 107 C145 83 139 63 130 47Z" fill="url(#maaniyFurSoft)" />
          <path d="M72 126 C78 95 99 78 128 78 C160 78 182 96 188 128 C179 104 160 93 132 93 C103 93 82 105 72 126Z" fill="#02040a" opacity="0.8" />

          <path d="M73 136 C76 112 96 98 118 102 C126 107 134 107 142 102 C164 98 184 112 187 136 C185 167 164 190 130 190 C96 190 75 167 73 136Z" fill="url(#maaniyFurSoft)" />
          <ellipse cx="130" cy="154" rx="47" ry="36" fill="#ede6dc" opacity="0.98" />

          <motion.g style={eyeMotion}>
            <ellipse cx="106" cy="131" rx={11 * visualPose.lensOpen} ry={14 * visualPose.lensOpen} fill="url(#maaniyEye)" />
            <ellipse cx="154" cy="131" rx={11 * visualPose.lensOpen} ry={14 * visualPose.lensOpen} fill="url(#maaniyEye)" />
            <circle cx="109" cy="126" r="3.2" fill="#fff" opacity="0.96" />
            <circle cx="157" cy="126" r="3.2" fill="#fff" opacity="0.96" />
            <circle cx="102" cy="137" r="2" fill="#bff8ff" opacity={visualPose.eyeGlow} />
            <circle cx="150" cy="137" r="2" fill="#bff8ff" opacity={visualPose.eyeGlow} />
          </motion.g>

          <motion.path
            d={isLeaving ? "M91 111 C100 105 112 107 120 115" : "M91 111 C101 106 112 106 121 111"}
            fill="none"
            stroke="#05070d"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ y: isButtonHovering ? -4 : visualPose.brow }}
          />
          <motion.path
            d={isLeaving ? "M140 115 C148 107 160 105 169 111" : "M139 111 C148 106 160 106 169 111"}
            fill="none"
            stroke="#05070d"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ y: isButtonHovering ? -4 : visualPose.brow }}
          />

          <g>
            <rect x="81" y="112" width="45" height="37" rx="11" fill="url(#maaniyLens)" stroke="#05070d" strokeWidth="5" />
            <rect x="134" y="112" width="45" height="37" rx="11" fill="url(#maaniyLens)" stroke="#05070d" strokeWidth="5" />
            <path d="M126 129 C128 127 132 127 134 129" fill="none" stroke="#05070d" strokeWidth="5" strokeLinecap="round" />
            <path d="M91 117 L116 145" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.36" />
            <path d="M144 117 L169 145" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.28" />
          </g>

          <ellipse cx="130" cy="151" rx="9" ry="7" fill="#fb7f8e" />
          <circle cx="127" cy="148" r="2.2" fill="#ffd0d5" opacity="0.82" />
          <motion.path d={isLeaving ? "M116 174 C125 166 138 166 147 174" : visualPose.mouth} fill="none" stroke="#4a1018" strokeWidth="4" strokeLinecap="round" />
          {activeMood === "hover" || activeMood === "happy" || activeMood === "click" ? (
            <path d="M128 169 L132 169 L130 173Z" fill="#fffdf4" opacity="0.95" />
          ) : null}
          <motion.ellipse cx="92" cy="159" rx="13" ry="7" fill="#fb7185" opacity={Math.max(0.18, visualPose.blush)} />
          <motion.ellipse cx="168" cy="159" rx="13" ry="7" fill="#fb7185" opacity={Math.max(0.18, visualPose.blush)} />

          <path d="M60 96 C68 46 98 21 130 21 C162 21 192 46 200 96" fill="none" stroke="url(#maaniyHeadphone)" strokeWidth="13" strokeLinecap="round" />
          <path d="M61 96 C68 49 98 26 130 26 C162 26 192 49 199 96" fill="none" stroke="#384152" strokeWidth="4" strokeLinecap="round" opacity="0.62" />
          <rect x="38" y="87" width="36" height="70" rx="17" fill="url(#maaniyHeadphone)" />
          <rect x="186" y="87" width="36" height="70" rx="17" fill="url(#maaniyHeadphone)" />
          <rect x="45" y="96" width="18" height="51" rx="9" fill="#161b26" opacity="0.86" />
          <rect x="197" y="96" width="18" height="51" rx="9" fill="#161b26" opacity="0.86" />
          <path d="M52 94 C58 83 69 82 75 92" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.68" />
          <path d="M208 94 C202 83 191 82 185 92" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.68" />

          {isLeaving ? (
            <g>
              <path d="M92 145 C87 154 87 163 91 170 C96 163 97 154 92 145Z" fill="#67e8f9" opacity="0.92" />
              <path d="M168 145 C163 154 163 163 167 170 C172 163 173 154 168 145Z" fill="#67e8f9" opacity="0.92" />
            </g>
          ) : null}

          <circle cx="83" cy="77" r="4" fill="#22d3ee" opacity="0.7" filter="url(#maaniyGlow)" />
          <circle cx="178" cy="78" r="4" fill="#a855f7" opacity="0.7" filter="url(#maaniyGlow)" />
        </motion.g>
      </motion.svg>
    </motion.div>
  );
}
