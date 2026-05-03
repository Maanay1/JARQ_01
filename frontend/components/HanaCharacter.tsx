"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { HanaEmotion, useJarqExperience } from "@/components/JarqExperience";
import { HanaMood } from "@/components/hana/useHanaInteraction";

interface HanaCharacterProps {
  mood?: HanaMood;
  size?: "sm" | "md" | "lg";
  showBubble?: boolean;
  className?: string;
  emotion?: HanaEmotion;
  message?: string | null;
  compact?: boolean;
}

type HanaPose = {
  bubble: string;
  mouth: string;
  eyeScale: number;
  pupilY: number;
  leftArm: string;
  rightArm: string;
  sparkle: boolean;
  blush: number;
  headTilt: number;
  bodyTilt: number;
  eyelid?: number;
  yawn?: boolean;
};

const moodConfig: Record<HanaMood, HanaPose> = {
  idle: {
    bubble: "",
    mouth: "M116 151 C124 158 136 158 144 151",
    eyeScale: 1,
    pupilY: 0,
    leftArm: "M84 210 C66 218 58 235 63 252",
    rightArm: "M176 210 C194 218 202 235 197 252",
    sparkle: false,
    blush: 0.4,
    headTilt: 0,
    bodyTilt: 0,
  },
  hover_start_learning: {
    bubble: "Готов? Начнём урок 💙",
    mouth: "M111 149 C123 166 139 166 151 149",
    eyeScale: 1.08,
    pupilY: -1,
    leftArm: "M84 211 C64 220 56 236 61 252",
    rightArm: "M176 207 C204 193 220 175 226 154",
    sparkle: true,
    blush: 0.66,
    headTilt: 4,
    bodyTilt: -2,
  },
  hover_open_chat: {
    bubble: "Ооо, хочешь поговорить?",
    mouth: "M125 153 C125 145 137 145 137 153 C137 162 125 162 125 153",
    eyeScale: 1.2,
    pupilY: -1,
    leftArm: "M84 210 C66 202 58 187 58 170",
    rightArm: "M176 210 C195 218 202 235 197 252",
    sparkle: true,
    blush: 0.56,
    headTilt: -4,
    bodyTilt: 2,
  },
  hover_voice: {
    bubble: "Скажи что-нибудь, я слушаю!",
    mouth: "M111 149 C123 163 140 163 152 149 M124 154 L128 160 L132 154",
    eyeScale: 1.05,
    pupilY: 0,
    leftArm: "M84 210 C66 218 58 235 63 252",
    rightArm: "M176 209 C196 200 202 181 197 163",
    sparkle: false,
    blush: 0.72,
    headTilt: 4,
    bodyTilt: 1,
  },
  click: {
    bubble: "Йей! Погнали ✨",
    mouth: "M109 146 C122 170 140 170 153 146",
    eyeScale: 1.24,
    pupilY: -2,
    leftArm: "M84 207 C58 192 48 172 49 150",
    rightArm: "M176 207 C202 192 212 172 211 150",
    sparkle: true,
    blush: 0.84,
    headTilt: 0,
    bodyTilt: 0,
  },
  exit_intent: {
    bubble: "Ты уже уходишь? 😢",
    mouth: "M113 162 C124 153 138 153 149 162",
    eyeScale: 0.94,
    pupilY: 5,
    leftArm: "M84 211 C68 226 65 243 72 257",
    rightArm: "M176 211 C192 226 195 243 188 257",
    sparkle: false,
    blush: 0.26,
    headTilt: -6,
    bodyTilt: -1,
    eyelid: 0.22,
  },
  inactive: {
    bubble: "Я пока тут… жду тебя",
    mouth: "M124 155 C124 149 138 149 138 155 C138 163 124 163 124 155",
    eyeScale: 0.88,
    pupilY: 3,
    leftArm: "M84 211 C70 205 65 194 68 181",
    rightArm: "M176 211 C190 217 196 230 194 244",
    sparkle: false,
    blush: 0.3,
    headTilt: 6,
    bodyTilt: 2,
    eyelid: 0.32,
    yawn: true,
  },
  thinking: {
    bubble: "Хмм… думаю",
    mouth: "M114 157 C124 153 138 153 148 157",
    eyeScale: 0.96,
    pupilY: -5,
    leftArm: "M84 210 C66 218 58 235 63 252",
    rightArm: "M176 209 C196 200 202 181 197 163",
    sparkle: false,
    blush: 0.38,
    headTilt: -2,
    bodyTilt: 1,
  },
  happy: {
    bubble: "",
    mouth: "M110 148 C122 166 140 166 152 148 M124 153 L128 160 L132 153",
    eyeScale: 1.12,
    pupilY: -1,
    leftArm: "M84 210 C66 218 58 235 63 252",
    rightArm: "M176 210 C194 218 202 235 197 252",
    sparkle: true,
    blush: 0.74,
    headTilt: 2,
    bodyTilt: 0,
  },
};

const sizeClass = {
  sm: "h-40 w-40",
  md: "h-72 w-72",
  lg: "h-[24rem] w-[24rem] max-w-full sm:h-[27rem] sm:w-[27rem]",
};

function legacyMood(emotion?: HanaEmotion): HanaMood | undefined {
  if (!emotion) return undefined;
  if (emotion === "thinking") return "thinking";
  if (emotion === "sad") return "exit_intent";
  if (emotion === "happy" || emotion === "excited") return "happy";
  return "idle";
}

export function HanaCharacter({
  mood,
  size = "md",
  showBubble = true,
  className = "",
  emotion,
  message,
  compact = false,
}: HanaCharacterProps) {
  const experience = useJarqExperience();
  const activeMood = mood ?? legacyMood(emotion) ?? legacyMood(experience.hanaEmotion) ?? "idle";
  const pose = moodConfig[activeMood];
  const activeBubble = message ?? experience.hanaMessage ?? pose.bubble;
  const resolvedSize = compact ? "sm" : size;
  const [imageReady, setImageReady] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const rawLookX = useMotionValue(0);
  const rawLookY = useMotionValue(0);
  const lookX = useSpring(rawLookX, { stiffness: 95, damping: 20, mass: 0.45 });
  const lookY = useSpring(rawLookY, { stiffness: 95, damping: 20, mass: 0.45 });
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      const rect = rootRef.current?.getBoundingClientRect();
      const centerX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const centerY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
      const dx = Math.max(-1, Math.min(1, (event.clientX - centerX) / (window.innerWidth * 0.28)));
      const dy = Math.max(-1, Math.min(1, (event.clientY - centerY) / (window.innerHeight * 0.28)));
      rawLookX.set(dx * 8);
      rawLookY.set(dy * 6);
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rawLookX, rawLookY]);

  const eyeMotion = useMemo(
    () => ({
      x: lookX,
      y: lookY,
    }),
    [lookX, lookY],
  );

  const showImage = imageReady && !imageFailed;

  return (
    <motion.div
      ref={rootRef}
      className={`relative isolate ${sizeClass[resolvedSize]} ${className}`}
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{
        opacity: 1,
        y: activeMood === "inactive" ? [0, 2, 0] : [0, -7, 0],
        scale: activeMood === "click" ? [1, 1.08, 0.99, 1] : 1,
      }}
      transition={{
        y: { repeat: Infinity, duration: activeMood === "inactive" ? 5.2 : 4.4, ease: "easeInOut" },
        scale: { duration: 0.62, ease: "easeOut" },
        opacity: { duration: 0.25 },
      }}
      aria-label="Hana, JARQ AI tutor mascot"
      role="img"
    >
      <motion.div
        className="absolute inset-1 -z-10 rounded-full bg-cyan-300/20 blur-3xl"
        animate={{ scale: pose.sparkle ? [1, 1.18, 1] : [1, 1.07, 1], opacity: [0.52, 0.86, 0.52] }}
        transition={{ repeat: Infinity, duration: pose.sparkle ? 1.8 : 3.8, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-12 -z-10 rounded-full bg-fuchsia-400/18 blur-2xl"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
      />

      {showBubble && activeBubble ? (
        <motion.div
          className="jarq-text absolute -top-4 left-1/2 z-30 w-[min(17rem,92vw)] -translate-x-1/2 rounded-2xl border px-4 py-3 text-center text-sm font-bold leading-5 shadow-[0_20px_60px_rgba(34,211,238,0.26)] backdrop-blur-xl"
          style={{ background: "color-mix(in srgb, var(--jarq-bg-2) 18%, white 82%)", borderColor: "var(--jarq-border)" }}
          initial={false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
        >
          {activeBubble}
          <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r bg-inherit" />
        </motion.div>
      ) : null}

      <img
        src="/hana/hana-reference.png"
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
          <linearGradient id="hanaHair" x1="52" x2="210" y1="34" y2="156">
            <stop stopColor="#071126" />
            <stop offset="0.52" stopColor="#111a4d" />
            <stop offset="1" stopColor="#0e7490" />
          </linearGradient>
          <linearGradient id="hanaCyanLock" x1="120" x2="202" y1="44" y2="120">
            <stop stopColor="#67e8f9" />
            <stop offset="1" stopColor="#0891b2" />
          </linearGradient>
          <linearGradient id="hanaDress" x1="76" x2="184" y1="190" y2="300">
            <stop stopColor="#071126" />
            <stop offset="0.58" stopColor="#101a45" />
            <stop offset="1" stopColor="#0e7490" />
          </linearGradient>
          <radialGradient id="hanaEyeGold" cx="50%" cy="40%" r="70%">
            <stop stopColor="#fff7c2" />
            <stop offset="0.34" stopColor="#facc15" />
            <stop offset="0.7" stopColor="#b7791f" />
            <stop offset="1" stopColor="#3b2507" />
          </radialGradient>
        </defs>

        <motion.g
          animate={{ rotate: pose.bodyTilt }}
          style={{ transformOrigin: "130px 244px" }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        >
          <path d="M82 214 C96 190 164 190 178 214 C194 254 182 296 130 304 C78 296 66 254 82 214Z" fill="url(#hanaDress)" />
          <path d="M96 210 C108 238 119 266 130 294 C141 266 152 238 164 210 C149 202 111 202 96 210Z" fill="#f8fafc" />
          <path d="M105 207 L130 244 L155 207" fill="none" stroke="#67e8f9" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="130" cy="241" r="5" fill="#f9d56e" />
          <circle cx="130" cy="262" r="4" fill="#f9d56e" />
          <path d={pose.leftArm} fill="none" stroke="#ffd6e7" strokeWidth="13" strokeLinecap="round" />
          <path d={pose.rightArm} fill="none" stroke="#ffd6e7" strokeWidth="13" strokeLinecap="round" />
          <circle cx="63" cy="252" r="9" fill="#ffd6e7" />
          <circle cx="197" cy="252" r="9" fill="#ffd6e7" />
          {activeMood === "inactive" ? (
            <>
              <circle cx="71" cy="181" r="4" fill="#ffd6e7" />
              <circle cx="77" cy="186" r="3" fill="#ffd6e7" />
              <circle cx="83" cy="188" r="2.5" fill="#ffd6e7" />
            </>
          ) : null}
        </motion.g>

        <motion.g
          style={{
            transformOrigin: "130px 130px",
            x: lookX,
            y: lookY,
          }}
          animate={{ rotate: pose.headTilt }}
          transition={{ type: "spring", stiffness: 110, damping: 16 }}
        >
          <motion.g
            style={{
              transformOrigin: "130px 132px",
              rotate: lookX,
            }}
          >
            <path d="M36 126 C19 68 52 33 91 51 C70 26 107 14 130 36 C153 14 190 26 169 51 C208 33 241 68 224 126 C241 178 205 236 130 238 C55 236 19 178 36 126Z" fill="url(#hanaHair)" />
            <path d="M23 139 C13 91 36 59 72 60 C47 87 52 135 78 168 C55 171 34 160 23 139Z" fill="#071126" />
            <path d="M237 139 C247 91 224 59 188 60 C213 87 208 135 182 168 C205 171 226 160 237 139Z" fill="#071126" />
            <path d="M42 154 C39 195 58 225 92 230 C66 205 61 175 70 143Z" fill="#101a45" />
            <path d="M218 154 C221 195 202 225 168 230 C194 205 199 175 190 143Z" fill="#101a45" />
            <path d="M58 132 C58 83 92 55 130 55 C168 55 202 83 202 132 C202 180 174 218 130 219 C86 218 58 180 58 132Z" fill="#ffd6e7" />
            <path d="M48 130 C61 67 95 40 130 40 C165 40 199 67 212 130 C178 100 82 100 48 130Z" fill="#071126" />
            <path d="M56 106 C81 58 112 45 130 45 C148 45 181 58 204 107 C173 84 89 84 56 106Z" fill="url(#hanaHair)" />
            <path d="M69 77 C82 103 97 115 118 116 C103 93 94 68 97 48" fill="#111a4d" />
            <path d="M125 45 C122 77 132 103 153 116 C149 88 155 63 166 48" fill="#16205f" />
            <path d="M183 84 C170 104 156 114 140 116 C158 94 166 70 164 50" fill="url(#hanaCyanLock)" opacity="0.9" />
            <path d="M84 92 C67 111 63 133 65 154" fill="none" stroke="#67e8f9" strokeWidth="5" strokeLinecap="round" opacity="0.65" />
            <path d="M180 92 C193 112 196 133 194 154" fill="none" stroke="#67e8f9" strokeWidth="5" strokeLinecap="round" opacity="0.58" />

            <Eye cx={92} cy={133} pose={pose} eyeMotion={eyeMotion} />
            <Eye cx={168} cy={133} pose={pose} eyeMotion={eyeMotion} />

            <path d="M72 116 C83 108 98 107 109 113" fill="none" stroke="#071126" strokeWidth="5" strokeLinecap="round" />
            <path d="M151 113 C162 107 177 108 188 116" fill="none" stroke="#071126" strokeWidth="5" strokeLinecap="round" />
            <motion.path d={pose.mouth} fill="none" stroke="#8b1e4d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            {pose.yawn ? <circle cx="149" cy="150" r="3.5" fill="#8b1e4d" opacity="0.62" /> : null}
            <ellipse cx="68" cy="154" rx="18" ry="9" fill="#fb7185" opacity={pose.blush} />
            <ellipse cx="192" cy="154" rx="18" ry="9" fill="#fb7185" opacity={pose.blush} />
          </motion.g>
        </motion.g>

        {pose.sparkle ? (
          <motion.g animate={{ opacity: [0.35, 1, 0.35], scale: [0.9, 1.15, 0.9] }} transition={{ repeat: Infinity, duration: 1.65 }}>
            <path d="M43 55 L49 69 L64 74 L49 79 L43 94 L37 79 L22 74 L37 69Z" fill="#67e8f9" />
            <path d="M214 48 L218 58 L229 62 L218 66 L214 77 L210 66 L199 62 L210 58Z" fill="#f9d56e" />
            <circle cx="215" cy="115" r="4" fill="#67e8f9" />
          </motion.g>
        ) : null}
      </motion.svg>
    </motion.div>
  );
}

function Eye({
  cx,
  cy,
  pose,
  eyeMotion,
}: {
  cx: number;
  cy: number;
  pose: HanaPose;
  eyeMotion: { x: ReturnType<typeof useSpring>; y: ReturnType<typeof useSpring> };
}) {
  return (
    <motion.g animate={{ scale: pose.eyeScale }} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <ellipse cx={cx} cy={cy} rx="24" ry="31" fill="#fffaf0" />
      <ellipse cx={cx} cy={cy} rx="17" ry="24" fill="url(#hanaEyeGold)" />
      <motion.g
        style={{
          x: eyeMotion.x,
          y: eyeMotion.y,
        }}
      >
        <ellipse cx={cx} cy={cy + 2 + pose.pupilY} rx="8.5" ry="12.5" fill="#0f172a" />
        <circle cx={cx - 6} cy={cy - 10 + pose.pupilY} r="4.4" fill="#ffffff" />
        <circle cx={cx + 6} cy={cy + 9 + pose.pupilY} r="2.6" fill="#fff7c2" />
      </motion.g>
      {pose.eyelid ? (
        <motion.path
          d={`M${cx - 23} ${cy - 20} C${cx - 8} ${cy - 30} ${cx + 8} ${cy - 30} ${cx + 23} ${cy - 20} L${cx + 22} ${cy - 8} C${cx + 6} ${cy - 15} ${cx - 6} ${cy - 15} ${cx - 22} ${cy - 8}Z`}
          fill="#ffd6e7"
          opacity={pose.eyelid}
        />
      ) : null}
    </motion.g>
  );
}
