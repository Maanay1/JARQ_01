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
  const [isButtonHovering, setIsButtonHovering] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
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
      rawLookX.set(dx * 3);
      rawLookY.set(dy * 3 + pose.pupilY);
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
  const showImage = imageReady && !imageFailed;
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
        y: shouldButtonBounce ? [0, -10, 0] : shouldReduceMotion ? 0 : activeMood === "inactive" ? [0, 2, 0] : [0, -6, 0],
        scale: activeMood === "click" ? [1, 1.07, 0.99, 1] : 1,
      }}
      transition={{
        y: shouldButtonBounce
          ? { duration: 0.38, ease: "easeOut" }
          : { repeat: shouldReduceMotion ? 0 : Infinity, duration: activeMood === "inactive" ? 5.5 : 4.2, ease: "easeInOut" },
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
          <linearGradient id="maaniyHair" x1="72" x2="192" y1="30" y2="138">
            <stop stopColor="#120b08" />
            <stop offset="0.55" stopColor="#1f1714" />
            <stop offset="1" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="maaniyJacket" x1="64" x2="196" y1="204" y2="306">
            <stop stopColor="#020617" />
            <stop offset="0.7" stopColor="#111827" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
          <radialGradient id="maaniyEye" cx="50%" cy="44%" r="70%">
            <stop stopColor="#fef3c7" />
            <stop offset="0.42" stopColor="#8b5e34" />
            <stop offset="1" stopColor="#2b1608" />
          </radialGradient>
        </defs>

        <motion.g animate={{ rotate: visualPose.bodyTilt }} style={{ originX: "130px", originY: "246px" }} transition={{ duration: 0.35 }}>
          <path d="M73 300 C76 246 94 211 130 211 C166 211 184 246 187 300 C156 315 104 315 73 300Z" fill="url(#maaniyJacket)" />
          <path d="M98 218 C109 234 120 242 130 242 C140 242 151 234 162 218" fill="none" stroke="#1f2937" strokeWidth="18" strokeLinecap="round" />
          <path d="M130 222 L130 302" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
          <path d="M128 244 L122 251 M132 244 L138 251" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <path d="M94 246 C80 250 70 264 66 287" fill="none" stroke="#020617" strokeWidth="17" strokeLinecap="round" />
          <path d="M166 246 C180 250 190 264 194 287" fill="none" stroke="#020617" strokeWidth="17" strokeLinecap="round" />
          <path d="M86 282 C96 276 105 276 114 282" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
          <path d="M146 282 C155 276 164 276 174 282" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
          <path d="M89 228 C100 214 116 208 130 208 C144 208 160 214 171 228" fill="none" stroke="#0f172a" strokeWidth="15" strokeLinecap="round" />
          <circle cx="94" cy="230" r="15" fill="#0f172a" stroke="#2563eb" strokeWidth="5" />
          <circle cx="166" cy="230" r="15" fill="#0f172a" stroke="#2563eb" strokeWidth="5" />
          <path d="M108 232 C120 240 140 240 152 232" fill="none" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
        </motion.g>

        <motion.g
          animate={{ rotate: visualPose.headTilt }}
          style={{ originX: "130px", originY: "122px" }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
        >
          <ellipse cx="130" cy="122" rx="72" ry="78" fill="#f3c7a3" />
          <path d="M61 118 C57 109 61 100 69 101 C75 102 79 111 77 121" fill="#f3c7a3" />
          <path d="M199 118 C203 109 199 100 191 101 C185 102 181 111 183 121" fill="#f3c7a3" />
          <path d="M59 111 C62 65 91 34 129 32 C172 30 201 63 199 112 C188 86 168 72 141 72 C124 72 111 78 99 89 C84 89 70 96 59 111Z" fill="url(#maaniyHair)" />
          <path d="M88 72 C100 47 125 36 157 42 C145 54 128 63 106 66 C101 76 96 82 88 72Z" fill="#1f1714" />
          <path d="M121 48 C112 66 103 78 90 88 C107 87 122 80 134 68Z" fill="#2a1c17" />
          <path d="M148 43 C171 50 187 68 193 94 C175 79 157 72 133 72 C141 62 146 53 148 43Z" fill="#0f172a" opacity="0.86" />
          <path d="M74 94 C86 76 104 68 126 69 C111 79 94 87 74 94Z" fill="#120b08" opacity="0.78" />

          <ellipse cx="105" cy="124" rx="15" ry="17" fill="#fff7ed" />
          <ellipse cx="155" cy="124" rx="15" ry="17" fill="#fff7ed" />
          <motion.g style={eyeMotion}>
            <circle cx="105" cy="125" r="8" fill="url(#maaniyEye)" />
            <circle cx="155" cy="125" r="8" fill="url(#maaniyEye)" />
            <circle cx="108" cy="121" r="3" fill="#fff" opacity={0.98} />
            <circle cx="158" cy="121" r="3" fill="#fff" opacity={0.98} />
          </motion.g>

          <motion.path
            d={isLeaving ? "M91 106 C100 101 111 102 119 109" : "M91 105 C100 100 112 100 121 105"}
            fill="none"
            stroke="#1f1714"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ y: isButtonHovering ? -4 : visualPose.brow }}
          />
          <motion.path
            d={isLeaving ? "M141 109 C149 102 160 101 169 106" : "M139 105 C148 100 160 100 169 105"}
            fill="none"
            stroke="#1f1714"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ y: isButtonHovering ? -4 : visualPose.brow }}
          />
          <circle cx="130" cy="144" r="2.4" fill="#b8785d" />
          <motion.path d={isLeaving ? "M114 164 C124 154 137 154 147 164" : visualPose.mouth} fill="none" stroke="#7f1d1d" strokeWidth="4" strokeLinecap="round" />
          <motion.ellipse cx="89" cy="151" rx="14" ry="8" fill="#fb7185" opacity={Math.max(0.24, visualPose.blush)} />
          <motion.ellipse cx="171" cy="151" rx="14" ry="8" fill="#fb7185" opacity={Math.max(0.24, visualPose.blush)} />

          <circle cx="105" cy="124" r="22" fill="none" stroke="#2a1c17" strokeWidth="3" />
          <circle cx="155" cy="124" r="22" fill="none" stroke="#2a1c17" strokeWidth="3" />
          <path d="M127 124 L133 124" fill="none" stroke="#2a1c17" strokeWidth="3" strokeLinecap="round" />
          <path d="M83 121 C88 116 91 116 94 118" fill="none" stroke="#2a1c17" strokeWidth="3" strokeLinecap="round" />
          <path d="M177 121 C172 116 169 116 166 118" fill="none" stroke="#2a1c17" strokeWidth="3" strokeLinecap="round" />
          <motion.circle cx="105" cy="125" r="23" fill="#22d3ee" opacity={visualPose.eyeGlow * 0.07} />
          <motion.circle cx="155" cy="125" r="23" fill="#22d3ee" opacity={visualPose.eyeGlow * 0.07} />
          {isLeaving ? (
            <g>
              <path d="M91 145 C86 154 85 162 89 169 C94 162 96 154 91 145Z" fill="#67e8f9" opacity="0.92" />
              <path d="M169 145 C164 154 163 162 167 169 C172 162 174 154 169 145Z" fill="#67e8f9" opacity="0.92" />
            </g>
          ) : null}
        </motion.g>
      </motion.svg>
    </motion.div>
  );
}
