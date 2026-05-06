"use client";

import { motion } from "framer-motion";
import { MentorAvatarId } from "@/components/auth/AuthProvider";
import { MaaniyCharacter } from "@/components/MaaniyCharacter";

type MentorCharacterProps = {
  avatarId: MentorAvatarId;
  selected?: boolean;
  size?: "sm" | "md";
  message?: string;
  className?: string;
};

export const mentorCopy: Record<MentorAvatarId, { name: string; phrase: string }> = {
  maanay: { name: "MAANAY", phrase: "Йей, мы снова учимся вместе! ✨" },
  sensei: { name: "SENSEI", phrase: "Путь начинается с одного шага, ученик! 🏔️" },
  professor: { name: "PROFESSOR", phrase: "Мой метод обучения максимально эффективен! 🎓" },
  robo_bot: { name: "ROBO-BOT", phrase: "Система инициализирована. Погнали кодить! 🤖" },
  tulpar: { name: "TULPAR", phrase: "Летим к новым знаниям быстро и красиво! 🪽" },
  nomad: { name: "NOMAD", phrase: "Спокойно идём по пути знаний, шаг за шагом. 🏕️" },
  snow_leopard: { name: "AK ILBIRS", phrase: "Тихий фокус. Быстрая победа. 🐾" },
  astro: { name: "ASTRO", phrase: "Курс проложен. Запускаем обучение! 🚀" },
};

export function MentorCharacter({ avatarId, selected = false, size = "sm", message, className = "" }: MentorCharacterProps) {
  if (avatarId === "maanay") {
    return (
      <MaaniyCharacter
        size={size}
        mood={selected ? "happy" : "idle"}
        showBubble={Boolean(message)}
        message={message}
        className={className}
      />
    );
  }

  const scaleClass = size === "md" ? "h-64 w-64" : "h-36 w-36";

  return (
    <motion.div
      className={`relative mx-auto ${scaleClass} ${className}`}
      animate={{ y: selected ? [0, -8, 0] : [0, -3, 0], scale: selected ? [1, 1.08, 1] : 1 }}
      transition={{ type: "spring", stiffness: 350, damping: 26 }}
      role="img"
      aria-label={mentorCopy[avatarId].name}
    >
      {message ? (
        <motion.div
          className="absolute -top-8 left-1/2 z-20 w-48 -translate-x-1/2 rounded-[24px] border border-white/[0.08] bg-slate-950/70 p-3 text-center text-xs font-bold leading-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
        >
          {message}
        </motion.div>
      ) : null}
      <svg viewBox="0 0 160 180" className="h-full w-full drop-shadow-[0_24px_60px_rgba(34,211,238,0.22)]">
        {avatarId === "sensei" ? <SenseiSvg selected={selected} /> : null}
        {avatarId === "professor" ? <ProfessorSvg selected={selected} /> : null}
        {avatarId === "robo_bot" ? <RoboSvg selected={selected} /> : null}
        {avatarId === "tulpar" ? <TulparSvg selected={selected} /> : null}
        {avatarId === "nomad" ? <NomadSvg selected={selected} /> : null}
        {avatarId === "snow_leopard" ? <SnowLeopardSvg selected={selected} /> : null}
        {avatarId === "astro" ? <AstroSvg selected={selected} /> : null}
      </svg>
    </motion.div>
  );
}

function TulparSvg({ selected }: { selected: boolean }) {
  return (
    <g>
      <ellipse cx="80" cy="82" rx="44" ry="50" fill="#0f172a" stroke="#67e8f9" strokeWidth="3" />
      <path d="M41 78 C18 60 20 112 49 106" fill="#a855f7" opacity="0.7" />
      <path d="M119 78 C142 60 140 112 111 106" fill="#22d3ee" opacity="0.7" />
      <path d="M59 50 C70 27 95 27 106 50" fill="#f8fafc" opacity="0.95" />
      <circle cx="65" cy="80" r="7" fill="#22d3ee" />
      <circle cx="95" cy="80" r="7" fill="#22d3ee" />
      <path d="M67 102 C75 109 86 109 94 102" fill="none" stroke="#fda4af" strokeWidth="4" strokeLinecap="round" />
      <motion.path d="M56 132 C66 121 94 121 104 132 L116 170 L44 170Z" fill="#111827" animate={{ y: selected ? [0, -5, 0] : 0 }} />
    </g>
  );
}

function NomadSvg({ selected }: { selected: boolean }) {
  return (
    <g>
      <circle cx="80" cy="76" r="44" fill="#1f2937" />
      <path d="M42 56 C52 26 108 26 118 56 C100 48 60 48 42 56Z" fill="#f59e0b" />
      <path d="M54 54 L80 28 L106 54" fill="none" stroke="#fde68a" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="64" cy="78" rx="8" ry="6" fill="#a5f3fc" />
      <ellipse cx="96" cy="78" rx="8" ry="6" fill="#a5f3fc" />
      <path d="M67 100 C75 105 85 105 93 100" fill="none" stroke="#fecaca" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 132 C60 114 100 114 110 132 L120 170 L40 170Z" fill="#78350f" />
      <motion.path d="M103 122 C122 128 130 143 122 157" fill="none" stroke="#78350f" strokeWidth="12" strokeLinecap="round" animate={{ rotate: selected ? -12 : 0 }} />
    </g>
  );
}

function SnowLeopardSvg({ selected }: { selected: boolean }) {
  return (
    <g>
      <circle cx="80" cy="78" r="46" fill="#e5e7eb" />
      <path d="M48 48 L38 24 L66 38Z" fill="#e5e7eb" />
      <path d="M112 48 L122 24 L94 38Z" fill="#e5e7eb" />
      {[56, 75, 101, 88, 65, 108].map((x, index) => (
        <circle key={index} cx={x} cy={index % 2 ? 56 : 92} r="3" fill="#0f172a" opacity="0.65" />
      ))}
      <circle cx="65" cy="78" r="7" fill="#0f172a" />
      <circle cx="95" cy="78" r="7" fill="#0f172a" />
      <circle cx="80" cy="91" r="5" fill="#fb7185" />
      <path d="M68 105 C76 112 84 112 92 105" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
      <motion.path d="M54 132 C65 116 95 116 106 132 L116 170 L44 170Z" fill="#cbd5e1" animate={{ scale: selected ? [1, 1.04, 1] : 1 }} style={{ transformOrigin: "80px 140px" }} />
    </g>
  );
}

function AstroSvg({ selected }: { selected: boolean }) {
  return (
    <g>
      <circle cx="80" cy="78" r="46" fill="#0f172a" stroke="#a855f7" strokeWidth="4" />
      <circle cx="80" cy="78" r="31" fill="#111827" stroke="#67e8f9" strokeWidth="3" />
      <circle cx="68" cy="75" r="5" fill="#67e8f9" />
      <circle cx="92" cy="75" r="5" fill="#67e8f9" />
      <path d="M70 94 C77 99 84 99 91 94" fill="none" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
      <path d="M54 132 C64 116 96 116 106 132 L118 170 L42 170Z" fill="#312e81" />
      <motion.g animate={{ rotate: selected ? 360 : 0 }} transition={{ repeat: selected ? Infinity : 0, duration: 3, ease: "linear" }}>
        <circle cx="126" cy="52" r="4" fill="#22d3ee" />
        <circle cx="34" cy="112" r="3" fill="#a855f7" />
      </motion.g>
    </g>
  );
}

function SenseiSvg({ selected }: { selected: boolean }) {
  return (
    <g>
      <circle cx="80" cy="68" r="48" fill="#111827" />
      <path d="M42 52 C55 22 105 22 118 52 L112 62 C96 48 64 48 48 62Z" fill="#ef4444" />
      <path d="M46 85 C58 124 102 124 114 85 C102 114 58 114 46 85Z" fill="#f8fafc" />
      <path d="M62 88 C67 148 93 148 98 88 C90 103 70 103 62 88Z" fill="#e5e7eb" />
      <ellipse cx="64" cy="70" rx="8" ry="4" fill="#a5f3fc" />
      <ellipse cx="96" cy="70" rx="8" ry="4" fill="#a5f3fc" />
      <path d="M65 92 C73 98 87 98 95 92" fill="none" stroke="#fca5a5" strokeWidth="4" strokeLinecap="round" />
      <motion.path d="M48 130 C40 140 38 153 48 160" fill="none" stroke="#111827" strokeWidth="14" strokeLinecap="round" animate={{ rotate: selected ? -16 : 0 }} style={{ transformOrigin: "48px 130px" }} />
    </g>
  );
}

function ProfessorSvg({ selected }: { selected: boolean }) {
  return (
    <g>
      <circle cx="80" cy="78" r="46" fill="#1e293b" />
      <path d="M45 42 L80 24 L115 42 L80 60Z" fill="#020617" stroke="#22d3ee" strokeWidth="2" />
      <path d="M104 45 L122 58" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
      <circle cx="63" cy="78" r="15" fill="rgba(255,255,255,0.18)" stroke="#e0f2fe" strokeWidth="4" />
      <circle cx="97" cy="78" r="15" fill="rgba(255,255,255,0.18)" stroke="#e0f2fe" strokeWidth="4" />
      <path d="M78 78 L82 78" stroke="#e0f2fe" strokeWidth="4" />
      <circle cx="64" cy="78" r="5" fill="#67e8f9" />
      <circle cx="98" cy="78" r="5" fill="#67e8f9" />
      <path d="M68 103 C75 108 86 108 93 103" fill="none" stroke="#fda4af" strokeWidth="4" strokeLinecap="round" />
      <motion.path d="M112 95 C132 98 136 114 124 125" fill="none" stroke="#1e293b" strokeWidth="13" strokeLinecap="round" animate={{ x: selected ? -8 : 0, y: selected ? -7 : 0 }} />
      <path d="M53 132 C58 116 102 116 107 132 L116 170 L44 170Z" fill="#111827" />
    </g>
  );
}

function RoboSvg({ selected }: { selected: boolean }) {
  return (
    <g>
      <rect x="42" y="42" width="76" height="76" rx="26" fill="#0f172a" stroke="#22d3ee" strokeWidth="4" />
      <path d="M50 39 L38 24 M110 39 L122 24" stroke="#a855f7" strokeWidth="5" strokeLinecap="round" />
      <circle cx="38" cy="24" r="7" fill="#22d3ee" />
      <circle cx="122" cy="24" r="7" fill="#a855f7" />
      <rect x="56" y="58" width="48" height="36" rx="14" fill="#67e8f9" opacity="0.22" />
      <text x="80" y="82" textAnchor="middle" fontSize="15" fill="#e0f2fe" fontWeight="700">
        {selected ? "💙" : "^_^"}
      </text>
      <path d="M55 130 C62 118 98 118 105 130 L116 170 L44 170Z" fill="#111827" />
      <motion.g animate={{ opacity: selected ? [0, 1, 0.25, 1] : 0.35 }} transition={{ repeat: selected ? Infinity : 0, duration: 1.2 }}>
        <circle cx="34" cy="66" r="3" fill="#22d3ee" />
        <circle cx="124" cy="86" r="3" fill="#a855f7" />
        <circle cx="119" cy="54" r="2" fill="#22d3ee" />
      </motion.g>
    </g>
  );
}
