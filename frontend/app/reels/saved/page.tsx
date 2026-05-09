"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookmarkX, Code2, Languages, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { hapticTap } from "@/components/ui/HapticProvider";
import { ReelCategory, reels } from "@/lib/reels-data";
import { supabase } from "@/lib/supabase";

type Filter = "all" | ReelCategory;

const SAVED_REELS_KEY = "jarq_saved_reels";

export default function SavedReelsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>("all");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    setSavedIds(readStringArray(SAVED_REELS_KEY));
  }, []);

  useEffect(() => {
    if (!supabase || !user) return;
    supabase
      .from("saved_reels")
      .select("reel_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (!data) return;
        const ids = data.map((row) => String((row as { reel_id: string }).reel_id));
        const merged = [...new Set([...readStringArray(SAVED_REELS_KEY), ...ids])];
        setSavedIds(merged);
        window.localStorage.setItem(SAVED_REELS_KEY, JSON.stringify(merged));
      });
  }, [user]);

  const savedReels = useMemo(() => {
    const set = new Set(savedIds);
    const items = reels.filter((reel) => set.has(reel.id));
    return filter === "all" ? items : items.filter((reel) => reel.category === filter);
  }, [filter, savedIds]);

  async function removeSaved(reelId: string) {
    const next = savedIds.filter((id) => id !== reelId);
    setSavedIds(next);
    window.localStorage.setItem(SAVED_REELS_KEY, JSON.stringify(next));
    hapticTap();
    if (supabase && user) {
      await supabase.from("saved_reels").delete().eq("user_id", user.id).eq("reel_id", reelId);
    }
  }

  return (
    <main className="min-h-screen bg-[#050b1a] px-4 pb-24 pt-24 text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,.22),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,.24),transparent_36%),linear-gradient(135deg,#050b1a,#0b1025_45%,#190b32)]" />
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">JARQ Reels</div>
            <h1 className="mt-2 text-4xl font-black">Сохранённые 🔖</h1>
          </div>
          <Link href="/reels" className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-slate-950/60 backdrop-blur-xl">
            <X size={22} />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-[26px] border border-white/10 bg-slate-950/55 p-2 backdrop-blur-xl sm:flex sm:w-fit">
          <Link href="/reels" className="grid min-h-11 place-items-center rounded-[20px] px-4 text-sm font-black text-slate-300">Для тебя</Link>
          <div className="grid min-h-11 place-items-center rounded-[20px] bg-cyan-300 px-4 text-sm font-black text-slate-950">Сохранённые</div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {[
            ["all", "Все"],
            ["english", "Английский"],
            ["programming", "Программирование"],
          ].map(([value, label]) => (
            <button key={value} type="button" onClick={() => setFilter(value as Filter)} className={`min-h-11 rounded-full px-4 text-sm font-black ${filter === value ? "bg-cyan-300 text-slate-950" : "border border-white/10 bg-white/8 text-white"}`}>
              {label}
            </button>
          ))}
        </div>

        {savedReels.length ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {savedReels.map((reel) => (
              <motion.article key={reel.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[32px] border border-white/10 bg-slate-950/65 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-xl">
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-cyan-300/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-cyan-200">
                    {reel.category === "english" ? <Languages size={15} /> : <Code2 size={15} />}
                    {reel.category === "english" ? "English" : "Code"}
                  </div>
                  <button type="button" onClick={() => removeSaved(reel.id)} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-slate-200">
                    <BookmarkX size={18} />
                  </button>
                </div>
                <h2 className="mt-5 text-2xl font-black">{reel.phrase ?? reel.word ?? reel.title}</h2>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-300">{reel.translation ?? reel.explanation ?? reel.fact ?? reel.question}</p>
                <div className="mt-5 rounded-[22px] bg-white/10 p-4 text-sm font-black text-cyan-50">{reel.question}</div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[36px] border border-white/10 bg-slate-950/65 p-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-xl">
            <div className="text-3xl font-black">Пока нет сохранённых Reels</div>
            <p className="mt-3 text-sm font-semibold text-slate-400">Нажимай 🔖 на карточках, чтобы собрать личную коллекцию.</p>
            <Link href="/reels" className="mt-6 inline-flex min-h-14 items-center justify-center rounded-[24px] bg-cyan-300 px-6 font-black text-slate-950">Открыть Reels</Link>
          </div>
        )}
      </div>
    </main>
  );
}

function readStringArray(key: string) {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}
