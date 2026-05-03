import Link from "next/link";
import { BookOpen, Flame, Sparkles } from "lucide-react";
import { getCourses } from "@/lib/api";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { MotionPage } from "@/components/ui/MotionPage";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 py-20 jarq-text sm:px-6 sm:py-6 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="courses" className="relative z-10">
      <section className="mx-auto max-w-6xl">
        <header className="mb-6 flex min-w-0 flex-col gap-4 border-b pb-5 md:flex-row md:items-end md:justify-between jarq-border">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">
              <Sparkles size={16} />
              Учись с JARQ
            </div>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Курсы</h1>
          </div>
          <div className="flex min-w-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold jarq-glass">
            <Flame size={17} className="text-cyan-200" />
            Ежедневный квест готов
          </div>
        </header>

        <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="button-lift group min-w-0 rounded-xl p-4 transition hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-white/15 jarq-glass sm:rounded-2xl sm:p-5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-cyan-300/20 text-cyan-100">
                <BookOpen size={22} />
              </div>
              <div className="mt-5 flex min-w-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] jarq-muted">
                Уровень {levelLabel(course.level)} · Мир {index + 1}
              </div>
              <h2 className="mt-2 text-lg font-semibold sm:text-xl">{course.title}</h2>
              <p className="mt-2 text-sm leading-6 jarq-muted sm:min-h-12">
                {course.description ?? "Игровой путь из коротких уроков и быстрых побед."}
              </p>
              <div className="mt-5 h-2 rounded-full jarq-soft">
                <div className="h-2 w-1/3 rounded-full bg-cyan-300 transition group-hover:w-1/2" />
              </div>
            </Link>
          ))}
        </div>
      </section>
      </MotionPage>
    </main>
  );
}

function levelLabel(level: string | null | undefined): string {
  const labels: Record<string, string> = {
    beginner: "начальный",
    starter: "стартовый",
  };
  return labels[level ?? ""] ?? "стартовый";
}
