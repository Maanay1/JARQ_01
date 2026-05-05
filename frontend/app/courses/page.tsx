import Link from "next/link";
import { ArrowLeft, Flame, Sparkles, Trophy } from "lucide-react";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { MotionPage } from "@/components/ui/MotionPage";
import { learningTracks } from "@/lib/learning-paths";

export default async function CoursesPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 py-20 jarq-text sm:px-6 sm:py-6 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="courses" className="relative z-10">
        <section className="mx-auto max-w-6xl">
          <Link href="/" className="button-lift inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold jarq-soft jarq-muted hover:text-cyan-100">
            <ArrowLeft size={16} />
            На главную
          </Link>

          <header className="mt-7 grid gap-5 border-b pb-7 jarq-border lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200 jarq-soft">
                <Sparkles size={15} />
                Выбери что хочешь изучать
              </div>
              <h1 className="jarq-title-gradient mt-4 text-4xl font-semibold leading-tight sm:text-6xl">
                Два пути. Один AI репетитор.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 jarq-muted sm:text-lg">
                Мааний ведёт как в игре: короткие уровни, XP, стрик и понятные объяснения после каждого ответа.
              </p>
            </div>

            <div className="rounded-2xl p-5 jarq-glass">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-300/20 text-cyan-100">
                  <Flame size={22} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.14em] jarq-muted">Сегодня</div>
                  <div className="text-lg font-semibold jarq-text">3 дня стрика · 240 XP</div>
                </div>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-cyan-300 to-purple-400" />
              </div>
            </div>
          </header>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {learningTracks.map((track) => {
              const Icon = track.icon;
              return (
                <Link
                  key={track.id}
                  href={track.href}
                  className="button-lift group relative min-h-[360px] overflow-hidden rounded-3xl border p-6 transition hover:-translate-y-1 hover:border-cyan-300/60 jarq-glass sm:p-8"
                >
                  <div className={`absolute -right-16 -top-20 h-56 w-56 rounded-full bg-gradient-to-br ${track.accent} opacity-20 blur-3xl transition group-hover:opacity-35`} />
                  <div className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${track.accent} text-slate-950 shadow-[0_0_45px_rgba(34,211,238,0.18)]`}>
                    <Icon size={30} />
                  </div>

                  <div className="relative mt-8">
                    <div className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-200">{track.subtitle}</div>
                    <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{track.title}</h2>
                    <p className="mt-4 max-w-xl text-base leading-7 jarq-muted">{track.description}</p>
                  </div>

                  <div className="relative mt-7 flex flex-wrap gap-2">
                    {track.stats.map((stat) => (
                      <span key={stat} className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] jarq-soft jarq-muted">
                        {stat}
                      </span>
                    ))}
                  </div>

                  <div className="relative mt-8">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] jarq-muted">
                      <span>Путь обучения</span>
                      <span>{track.levels.length} уровней</span>
                    </div>
                    <div className="mt-3 grid grid-cols-7 gap-2">
                      {track.levels.map((level, index) => (
                        <div
                          key={level.id}
                          className={`h-2.5 rounded-full ${index < 2 ? `bg-gradient-to-r ${track.accent}` : "bg-white/[0.12]"}`}
                          title={level.title}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="relative mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-300 px-5 text-sm font-bold text-slate-950 transition group-hover:bg-cyan-200">
                    Открыть путь
                    <Trophy size={17} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </MotionPage>
    </main>
  );
}
