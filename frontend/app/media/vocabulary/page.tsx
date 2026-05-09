"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, RotateCcw, Search, Trash2 } from "lucide-react";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { hapticTap } from "@/components/ui/HapticProvider";
import { MotionPage } from "@/components/ui/MotionPage";
import { useAuth } from "@/components/auth/AuthProvider";
import { loadLocalVocabulary, saveLocalVocabulary, VocabularyItem } from "@/lib/media-progress";
import { supabase } from "@/lib/supabase";

type Filter = "all" | "learning" | "learned";

export default function VocabularyPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [flippedId, setFlippedId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadVocabulary() {
      if (supabase && user) {
        const { data, error } = await supabase
          .from("user_vocabulary")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (!error && data) {
          if (mounted) setItems(data.map(normalizeVocabularyItem));
          return;
        }
      }
      if (mounted) setItems(loadLocalVocabulary());
    }
    void loadVocabulary();
    return () => {
      mounted = false;
    };
  }, [user]);

  const filteredItems = useMemo(() => {
    const search = query.trim().toLowerCase();
    return items.filter((item) => {
      const statusMatches = filter === "all" || (filter === "learned" ? item.learned : !item.learned);
      const searchMatches = !search || `${item.word} ${item.translation} ${item.example}`.toLowerCase().includes(search);
      return statusMatches && searchMatches;
    });
  }, [filter, items, query]);

  async function toggleLearned(item: VocabularyItem) {
    const nextItems = items.map((current) => current.id === item.id ? { ...current, learned: !current.learned } : current);
    setItems(nextItems);
    saveLocalVocabulary(nextItems);
    hapticTap();
    if (supabase && user && !item.id.startsWith("local-")) {
      await supabase.from("user_vocabulary").update({ learned: !item.learned }).eq("id", item.id).eq("user_id", user.id);
    }
  }

  async function removeItem(item: VocabularyItem) {
    const nextItems = items.filter((current) => current.id !== item.id);
    setItems(nextItems);
    saveLocalVocabulary(nextItems);
    hapticTap();
    if (supabase && user && !item.id.startsWith("local-")) {
      await supabase.from("user_vocabulary").delete().eq("id", item.id).eq("user_id", user.id);
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-6 jarq-text sm:px-6 md:pb-12 md:pt-28 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="courses" className="relative z-10 mx-auto max-w-6xl">
        <Link href="/media" className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-[22px] bg-white/10 px-4 text-sm font-black">
          <ArrowLeft size={17} />
          Назад к медиа
        </Link>

        <section className="rounded-[36px] p-5 liquid-glass md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Media Vocabulary</div>
              <h1 className="mt-2 text-4xl font-black md:text-6xl">Мой словарь</h1>
              <p className="mt-2 text-sm font-semibold leading-6 jarq-muted">Слова из видео: повторяй, отмечай выученные и удаляй лишнее.</p>
            </div>
            <div className="rounded-[24px] bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100">{items.length} слов</div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[auto_minmax(0,1fr)]">
            <div className="grid grid-cols-3 rounded-full border border-white/10 bg-slate-950/55 p-1 backdrop-blur-xl">
              {[
                ["all", "Все"],
                ["learning", "Учу"],
                ["learned", "Выучил"],
              ].map(([value, label]) => (
                <button key={value} type="button" onClick={() => setFilter(value as Filter)} className={`min-h-11 rounded-full px-4 text-sm font-black transition ${filter === value ? "bg-cyan-300 text-slate-950" : "text-slate-300"}`}>
                  {label}
                </button>
              ))}
            </div>
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-12 w-full rounded-[24px] border border-white/[0.08] bg-slate-950/45 pl-12 pr-4 text-[16px] font-semibold outline-none focus:border-cyan-300" placeholder="Найти слово" />
            </label>
          </div>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => {
            const flipped = flippedId === item.id;
            return (
              <article key={item.id} className="rounded-[32px] border border-white/[0.08] bg-slate-950/60 p-5 shadow-[0_8px_32px_rgba(0,0,0,.37)] backdrop-blur-xl">
                <button type="button" onClick={() => setFlippedId(flipped ? null : item.id)} className="block min-h-36 w-full rounded-[28px] bg-white/[0.06] p-5 text-left">
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">{flipped ? "Перевод" : "Слово"}</div>
                  <div className="mt-3 text-4xl font-black text-white">{flipped ? item.translation : item.word}</div>
                  <p className="mt-3 text-sm font-semibold leading-6 jarq-muted">{item.example}</p>
                </button>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => setFlippedId(flipped ? null : item.id)} className="elastic-tap inline-flex min-h-11 items-center justify-center gap-2 rounded-[18px] bg-white/10 text-sm font-black">
                    <RotateCcw size={16} />
                  </button>
                  <button type="button" onClick={() => toggleLearned(item)} className={`elastic-tap inline-flex min-h-11 items-center justify-center gap-2 rounded-[18px] text-sm font-black ${item.learned ? "bg-emerald-300 text-slate-950" : "bg-cyan-300 text-slate-950"}`}>
                    <CheckCircle2 size={16} />
                  </button>
                  <button type="button" onClick={() => removeItem(item)} className="elastic-tap inline-flex min-h-11 items-center justify-center gap-2 rounded-[18px] bg-red-400/20 text-sm font-black text-red-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {!filteredItems.length ? (
          <section className="mt-5 rounded-[32px] p-6 text-center liquid-glass">
            <h2 className="text-2xl font-black">Пока нет слов</h2>
            <p className="mt-2 text-sm font-semibold jarq-muted">Открой видео, нажми “Добавить слово”, и оно появится здесь.</p>
          </section>
        ) : null}
      </MotionPage>
    </main>
  );
}

function normalizeVocabularyItem(raw: Record<string, unknown>): VocabularyItem {
  return {
    id: String(raw.id ?? ""),
    word: String(raw.word ?? ""),
    translation: String(raw.translation ?? ""),
    example: String(raw.example ?? ""),
    source_video_id: String(raw.source_video_id ?? ""),
    learned: Boolean(raw.learned),
    created_at: typeof raw.created_at === "string" ? raw.created_at : new Date().toISOString(),
  };
}
