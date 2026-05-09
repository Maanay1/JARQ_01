"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, Film, Headphones, Lock, Play, Search, Sparkles, Tv, Volume2 } from "lucide-react";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { hapticTap } from "@/components/ui/HapticProvider";
import { MotionPage } from "@/components/ui/MotionPage";
import { podcastCategories, podcasts, videoCategories, videos } from "@/lib/media-data";
import { canUseUnlimitedMedia, FREE_DAILY_VIDEO_LIMIT, FREE_PODCAST_LIMIT, getTodayVideoUsage } from "@/lib/media-progress";

type Tab = "films" | "podcasts";

export default function MediaPage() {
  const [tab, setTab] = useState<Tab>("films");
  const [query, setQuery] = useState("");
  const [videoUsage, setVideoUsage] = useState(0);
  const isPro = canUseUnlimitedMedia();

  useEffect(() => {
    setVideoUsage(getTodayVideoUsage());
  }, []);

  const filteredVideos = useMemo(() => {
    const search = query.trim().toLowerCase();
    return videos.filter((video) => !search || `${video.title} ${video.description} ${video.words.join(" ")}`.toLowerCase().includes(search));
  }, [query]);

  const filteredPodcasts = useMemo(() => {
    const search = query.trim().toLowerCase();
    return podcasts.filter((podcast) => !search || `${podcast.title} ${podcast.author} ${podcast.description}`.toLowerCase().includes(search));
  }, [query]);

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-6 jarq-text sm:px-6 md:pb-12 md:pt-28 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="courses" className="relative z-10 mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[36px] p-5 liquid-glass md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
                <Tv size={16} />
                JARQ Media
              </div>
              <h1 className="mt-4 text-4xl font-black leading-tight text-transparent [background:linear-gradient(100deg,#f8fafc,#67e8f9,#c084fc)] [-webkit-background-clip:text] md:text-6xl">
                Фильмы и подкасты для живого английского
              </h1>
              <p className="mt-3 max-w-2xl text-base font-semibold leading-7 jarq-muted">
                Смотри YouTube-уроки, собирай словарь, проходи тесты и слушай подкасты с удобной скоростью.
              </p>
            </div>
            <Link href="/media/vocabulary" className="button-lift inline-flex min-h-12 items-center justify-center gap-2 rounded-[22px] bg-cyan-300 px-5 text-sm font-black text-slate-950">
              <Sparkles size={17} />
              Мой словарь
            </Link>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
            <div className="grid grid-cols-2 rounded-full border border-white/10 bg-slate-950/55 p-1 backdrop-blur-xl">
              <button type="button" onClick={() => setTab("films")} className={`min-h-11 rounded-full px-5 text-sm font-black transition ${tab === "films" ? "bg-cyan-300 text-slate-950" : "text-slate-300"}`}>
                Фильмы
              </button>
              <button type="button" onClick={() => setTab("podcasts")} className={`min-h-11 rounded-full px-5 text-sm font-black transition ${tab === "podcasts" ? "bg-cyan-300 text-slate-950" : "text-slate-300"}`}>
                Подкасты
              </button>
            </div>
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-h-12 w-full rounded-[24px] border border-white/[0.08] bg-slate-950/45 pl-12 pr-4 text-[16px] font-semibold outline-none focus:border-cyan-300"
                placeholder="Поиск по видео, словам или подкастам"
              />
            </label>
          </div>
        </section>

        {tab === "films" ? (
          <section className="mt-5 grid gap-5">
            <div className="rounded-[28px] border border-white/[0.08] bg-slate-950/55 p-4 backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-black text-cyan-100">Бесплатно: {Math.max(0, FREE_DAILY_VIDEO_LIMIT - videoUsage)} из {FREE_DAILY_VIDEO_LIMIT} видео сегодня</span>
                <span className="text-xs font-bold jarq-muted">{isPro ? "PRO: видео безлимитно" : "Pro откроет безлимит"}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-cyan-300" style={{ width: `${isPro ? 100 : Math.min(100, (videoUsage / FREE_DAILY_VIDEO_LIMIT) * 100)}%` }} />
              </div>
            </div>

            {videoCategories.map((category) => {
              const categoryVideos = filteredVideos.filter((video) => video.category === category.id);
              if (!categoryVideos.length) return null;
              return (
                <section key={category.id} className="min-w-0">
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-black">{category.title}</h2>
                      <p className="text-sm font-semibold jarq-muted">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex snap-x gap-4 overflow-x-auto pb-3">
                    {categoryVideos.map((video, index) => (
                      <VideoCard key={video.id} videoId={video.id} youtubeId={video.youtubeId} title={video.title} description={video.description} level={video.level} duration={video.duration} wordsCount={video.words.length} locked={!isPro && videoUsage >= FREE_DAILY_VIDEO_LIMIT && index > 0} />
                    ))}
                  </div>
                </section>
              );
            })}
          </section>
        ) : (
          <section className="mt-5 grid gap-5">
            <div className="flex snap-x gap-3 overflow-x-auto pb-2">
              {podcastCategories.map((category) => (
                <div key={category.id} className="snap-start rounded-full border border-white/[0.08] bg-white/[0.05] px-4 py-2 text-sm font-black text-cyan-100">
                  {category.title}
                </div>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {filteredPodcasts.map((podcast, index) => (
                <PodcastCard key={podcast.id} podcast={podcast} locked={!isPro && index >= FREE_PODCAST_LIMIT} isPro={isPro} />
              ))}
            </div>
          </section>
        )}
      </MotionPage>
    </main>
  );
}

function VideoCard({ videoId, youtubeId, title, description, level, duration, wordsCount, locked }: { videoId: string; youtubeId: string; title: string; description: string; level: string; duration: string; wordsCount: number; locked: boolean }) {
  return (
    <motion.article whileTap={{ scale: 0.95 }} whileHover={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 350, damping: 26 }} className="relative w-[280px] shrink-0 snap-start overflow-hidden rounded-[32px] border border-white/[0.08] bg-slate-950/60 shadow-[0_8px_32px_rgba(0,0,0,.37)] backdrop-blur-xl sm:w-[340px]">
      <img src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`} alt="" className="aspect-video w-full object-cover" loading="lazy" />
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950">{level}</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">{duration}</span>
          <span className="rounded-full bg-purple-400/20 px-3 py-1 text-xs font-bold text-purple-50">{wordsCount} новых слова</span>
        </div>
        <h3 className="mt-3 line-clamp-2 text-xl font-black">{title}</h3>
        <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 jarq-muted">{description}</p>
        {locked ? (
          <Link href="/subscription" className="elastic-tap mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[22px] bg-yellow-300 px-4 text-sm font-black text-slate-950">
            <Lock size={17} />
            Получить Pro
          </Link>
        ) : (
          <Link href={`/media/watch/${videoId}`} onClick={hapticTap} className="elastic-tap mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[22px] bg-cyan-300 px-4 text-sm font-black text-slate-950">
            <Play size={17} />
            Смотреть
          </Link>
        )}
      </div>
    </motion.article>
  );
}

function PodcastCard({ podcast, locked, isPro }: { podcast: (typeof podcasts)[number]; locked: boolean; isPro: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speed, setSpeed] = useState(1);

  function setPlaybackRate(nextSpeed: number) {
    setSpeed(nextSpeed);
    if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
  }

  return (
    <article className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-slate-950/60 p-5 shadow-[0_8px_32px_rgba(0,0,0,.37)] backdrop-blur-xl">
      <div className="flex gap-4">
        <div className="grid h-24 w-24 shrink-0 place-items-center rounded-[28px] bg-gradient-to-br from-cyan-300 to-purple-400 text-slate-950">
          <Headphones size={38} />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-black">{podcast.title}</h3>
          <p className="mt-1 text-sm font-bold text-cyan-100">{podcast.author} · {podcast.duration}</p>
          <p className="mt-2 text-sm font-semibold leading-6 jarq-muted">{podcast.description}</p>
        </div>
      </div>

      {locked ? (
        <Link href="/subscription" className="elastic-tap mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[22px] bg-yellow-300 px-4 text-sm font-black text-slate-950">
          <Lock size={17} />
          Подкасты безлимитно в Pro
        </Link>
      ) : podcast.audioUrl ? (
        <>
          <audio ref={audioRef} controls className="mt-5 w-full" src={podcast.audioUrl} />
          <div className="mt-4 flex flex-wrap gap-2">
            {[0.75, 1, 1.25, 1.5].map((rate) => (
              <button key={rate} type="button" onClick={() => setPlaybackRate(rate)} className={`min-h-10 rounded-full px-4 text-sm font-black ${speed === rate ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-white"}`}>
                {rate}x
              </button>
            ))}
            {isPro ? (
              <a href={podcast.audioUrl} download className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-black text-cyan-100">
                <Download size={16} />
                Скачать
              </a>
            ) : null}
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm font-bold text-cyan-50">
          <Volume2 className="mb-2" size={18} />
          Демо-подкаст: аудио будет подключено через RSS.
        </div>
      )}
    </article>
  );
}
