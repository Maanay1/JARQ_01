"use client";

import { motion } from "framer-motion";
import { MentorAvatarId } from "@/components/auth/AuthProvider";
import { MentorCharacter, mentorCopy } from "@/components/mentors/MentorCharacter";

const avatars: MentorAvatarId[] = ["maanay", "sensei", "professor", "robo_bot", "tulpar", "nomad", "snow_leopard", "astro"];

type MascotSelectorProps = {
  selectedAvatarId: MentorAvatarId;
  onSelect: (avatarId: MentorAvatarId) => void;
};

export function MascotSelector({ selectedAvatarId, onSelect }: MascotSelectorProps) {
  const selectedCopy = mentorCopy[selectedAvatarId];

  return (
    <section className="rounded-[28px] p-4 liquid-glass">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">Сэнсэй-ментор</div>
          <h2 className="mt-1 text-2xl font-semibold">Выбери спутника</h2>
        </div>
      </div>

      <div className="mt-4 rounded-[28px] p-4 text-center liquid-glass">
        <MentorCharacter avatarId={selectedAvatarId} selected size="md" message={selectedCopy.phrase} />
        <div className="mt-2 text-xl font-bold">{selectedCopy.name}</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-3">
        {avatars.map((avatarId) => {
          const isSelected = avatarId === selectedAvatarId;
          return (
            <motion.button
              key={avatarId}
              type="button"
              onClick={() => onSelect(avatarId)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className={`elastic-tap min-h-44 rounded-[28px] border p-3 text-center ${
                isSelected ? "border-cyan-300 bg-cyan-300/10" : "border-white/[0.08] bg-slate-950/45"
              }`}
            >
              <MentorCharacter avatarId={avatarId} selected={isSelected} />
              <div className="mt-2 text-sm font-bold">{mentorCopy[avatarId].name}</div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
