import { Flame, Trophy } from "lucide-react";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { MotionPage } from "@/components/ui/MotionPage";

const activity = [20, 42, 28, 64, 46, 74, 58];
const completed = [
  { title: "Алфавит A-M", date: "сегодня", score: 86 },
  { title: "Что такое программирование", date: "вчера", score: 92 },
  { title: "Приветствия", date: "2 дня назад", score: 78 },
];

export default function ProgressPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-6 jarq-text sm:px-6 md:py-8 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="courses" className="relative z-10">
        <section className="mx-auto max-w-3xl">
          <div className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-200">Прогресс</div>
          <h1 className="mt-3 text-3xl font-semibold leading-tight">Твой рост в JARQ</h1>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl p-5 jarq-glass">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-300/20 text-cyan-100">
                  <Flame size={24} />
                </div>
                <div>
                  <div className="text-sm font-bold jarq-muted">Стрик</div>
                  <div className="text-2xl font-semibold">3 дня</div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl p-5 jarq-glass">
              <div className="flex items-center gap-3">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-[conic-gradient(#22d3ee_68%,rgba(255,255,255,0.12)_0)]">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-[#050b1a] text-sm font-bold">68%</div>
                </div>
                <div>
                  <div className="text-sm font-bold jarq-muted">До уровня</div>
                  <div className="text-2xl font-semibold">Практик</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-3xl p-5 jarq-glass">
            <div className="flex items-center gap-2 font-bold">
              <Trophy size={18} className="text-cyan-200" />
              Активность за 7 дней
            </div>
            <div className="mt-5 flex h-32 items-end gap-2">
              {activity.map((height, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-xl bg-gradient-to-t from-cyan-300 to-purple-400" style={{ height: `${height}%` }} />
                  <span className="text-xs jarq-muted">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-3xl p-5 jarq-glass">
            <div className="font-bold">Пройденные уроки</div>
            <div className="mt-4 space-y-3">
              {completed.map((lesson) => (
                <div key={lesson.title} className="flex items-center justify-between gap-3 rounded-2xl p-3 jarq-soft">
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{lesson.title}</div>
                    <div className="text-sm jarq-muted">{lesson.date}</div>
                  </div>
                  <div className="rounded-xl bg-cyan-300 px-3 py-2 text-sm font-bold text-slate-950">{lesson.score}%</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </MotionPage>
    </main>
  );
}
