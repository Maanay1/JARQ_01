"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { learningTracks } from "@/lib/learning-paths";

export function LearningTracksSection() {
  return (
    <section id="tracks" className="border-b px-4 py-10 sm:px-6 sm:py-18 lg:px-8 jarq-border">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl min-w-0">
          <div className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-200">Выбери что хочешь изучать</div>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">Два понятных пути вместо хаоса из уроков</h2>
          <p className="mt-4 text-base leading-7 jarq-muted">
            JARQ превращает обучение в дорожку: открывай уровни, получай XP и видь, что именно стало лучше.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {learningTracks.map((track, index) => {
            const Icon = track.icon;
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.08, duration: 0.45, ease: "easeOut" }}
              >
                <Link
                  href={track.href}
                  className="button-lift group relative block min-h-[250px] overflow-hidden rounded-3xl border p-5 transition hover:-translate-y-1 hover:border-cyan-300/60 jarq-glass sm:min-h-[300px] sm:p-8"
                >
                  <div className={`absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br ${track.accent} opacity-20 blur-3xl transition group-hover:opacity-35`} />
                  <div className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${track.accent} text-slate-950`}>
                    <Icon size={30} />
                  </div>
                  <div className="relative mt-7">
                    <div className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-200">{track.subtitle}</div>
                    <h3 className="mt-3 text-3xl font-semibold leading-tight">{track.title}</h3>
                    <p className="mt-4 text-base leading-7 jarq-muted">{track.description}</p>
                  </div>
                  <div className="relative mt-6 h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full w-2/5 rounded-full bg-gradient-to-r ${track.accent}`} />
                  </div>
                  <div className="relative mt-7 flex flex-wrap gap-2">
                    {track.stats.map((stat) => (
                      <span key={stat} className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] jarq-soft jarq-muted">
                        {stat}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
